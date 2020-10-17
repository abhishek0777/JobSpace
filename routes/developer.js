//-----------------------------This route file for Developer,so all routes related to developer are defined here------------
//---------------------------------------/developer/<someRoutePath>-----------------


//------------List of all the required modules------

//Express framework for server side programming
const express=require("express");
const path=require('path');

const router=express.Router();

//module for encryption of password
const bcrypt=require('bcryptjs');

//module for login authentication
const passport=require('passport');


//--------------Bring in all the models----------------
const Developer=require('../models/Developer');
const Company=require('../models/Company');
const JobPost=require('../models/JobPost');
const Portfolio=require('../models/Portfolio');


//bring auth-config file
// =>ensureAuthenticated : Use to protect the routes 
// =>forwardAuthenticated : by pass the routes without having authentication
const {forwardAuthenticated,ensureAuthenticated}=require('../config/auth');


//bring in middleware for image uploading in portfolio
// that is 'Multer'
const upload=require('../middleware/multer');



// set public folder for mainly CSS files to render
router.use(express.static(path.join("public")));




//route for registration form
router.get('/register',forwardAuthenticated,(req,res)=>{
    res.render("registerDev");
});



//route for login form
router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('loginDev');
})



//route for POST req of registration/Sign Up
router.post('/register',(req,res)=>{

    //first we will extract all variables from form
    const {name,email,password1,password2}=req.body;

    //declare array to store all errors for displaying to developer
    let errors=[];

    //check if any field is empty
    if(!name || !email || !password1 || !password2)
    {
        errors.push({msg:'Please fill in all fields'});
    }

    //we will come here if all fields are filled
    // To confirm password
    if(password1!=password2)
    {
        errors.push({msg:'Passwords do not match'});
    }

    // We'll check password length
    if(password1.length<6)
    {
        errors.push({msg:'Password should be atleast six character long'});
    }

    //check if any errors
    if(errors.length>0)
    {
        res.render('registerDev',{
            errors,
            name,
            email,
            password1,
            password2
        });
    }
    else{
        //Till now ,we have validated
        //Now we will check if is there any developer or not
        //with same email id
        Developer.findOne({email:email})
        .then(user=>{
            //if promise return any developer,means
            //developer already exist
            if(user)
            {
                errors.push({msg:'Email is already registered'});

                //again render the register page with all credentials and errors
                res.render('registerDev',{
                    errors,
                    name,
                    email,
                    password1,
                    password2
                });
            }
            else
            {
                Company.findOne({email:email})
                .then(company=>{
                    if(company)
                    {
                        errors.push({msg:'Email is already registered'});

                        //again render the register page with all credentials and errors
                        res.render('registerDev',{
                            errors,
                            name,
                            email,
                            password1,
                            password2
                        });
                    }
                    else
                    {

                        //if there is no developer ,we will add it in database
                        const newDeveloper=new Developer({
                            name:name,
                            email:email,
                            password:password1
                        });
        
                        //We will encrypt the password 
                        // so that no one can see developer's 
                        //password in database too
        
                        //Hash the password
                        bcrypt.genSalt(10,(err,salt)=>{
                            bcrypt.hash(newDeveloper.password,salt,(err,hash)=>{
                                if(err) throw err;
        
                                //set password to hash
                                newDeveloper.password=hash;
        
        
                                //now its perfect time to save developer
                                //in database
                                newDeveloper.save()
                                .then(user=>{
                                    req.flash('success_msg','You are now registerd,can Login');
                                    res.redirect('/developer/login');
                                })
                                .catch((err)=>{console.log(err)});
                            })
                        })
                    }
                    
                })
            }
            
        })
    }
})



//handle post request for developer login page
//Using Local strategy to authenticate user
//we have defined strategy named 'local.developer' for developers to authenticate
router.post('/login',(req,res,next)=>{
    passport.authenticate('local.developer',{
        successRedirect:'/developer/dashboard',
        failureRedirect:'/developer/login',
        failureFlash:true
    })(req,res,next)
})


//-------------------------------After Login by developer-------------------------------

//all routes afterwards can be accessed only if developer have loggedin

router.get('/dashboard',ensureAuthenticated,(req,res)=>{

    //Dashboard will shows all the posts posted by all companies to user
    //as per latest one on top

    let isCreated=-1;
    Portfolio.findOne({email:req.user.email},(err,portfolio)=>{
        if(portfolio){
            isCreated=1;
        }
    })

    JobPost.find({},(err,posts)=>{
        
        res.render('developer/dashboard',{
            user:req.user,
            posts:posts,
            isCreated:isCreated
        })
    })
})


//This route handles GET request to view or change portfolio's details
router.get('/portfolio',ensureAuthenticated,(req,res)=>{

    //let first find portfolio of this developer
    Portfolio.findOne({email:req.user.email})
    .then(portfolio=>{
        
            res.render('developer/portfolio',{
                user:req.user,
                portfolio:portfolio ? portfolio:"",
                msg:""
            })
        
    })
    .catch(err=>console.log(err));
})

//recommended jobs shows according what developers subscribed
router.get('/recommended',ensureAuthenticated,(req,res)=>{

    JobPost.find({},(err,posts)=>{
        res.render('developer/recommended',{
            user:req.user,   //user contains its subscribed array also
            posts:posts
        })
    })
    
})


//route to statistics ,can see to which companies developer have applied
router.get('/statistics',ensureAuthenticated,(req,res)=>{
    res.render('developer/statistics',{
        user:req.user
    });
})


//from here,user can subscribe companies
router.get('/companies',ensureAuthenticated,(req,res)=>{
    Company.find({},(err,companies)=>{
        res.render('developer/companies',{
            user:req.user,
            companies:companies
        });
    })
})


//on click ,subscribe the companies
router.get('/subscribed/:id',(req,res)=>{

    var emailID=req.params.id;
    console.log(emailID);

    //add emailID to array of subcribed company
    var subscribeDev=[];
    req.user.subscribed.forEach(function(email){
        if(email!=emailID){
            subscribeDev.push(email);
        }
    })
    subscribeDev.push(emailID);

    //asssign
    req.user.subscribed=subscribeDev;

    //then Update the developer's schema
    Developer.updateOne({email:req.user.email},req.user,(err)=>{
        if(err){
            console.log(err);
            return;
        }
        else{
            res.status(200).end();
        }
    })

    
})


//route to notifications for developer
// ------------Work in progress-----
router.get('/notifications',ensureAuthenticated,(req,res)=>{
    res.render('developer/notifications',{
        user:req.user
    });
})



//route to handle POST request to change the portfolio's details
router.post('/portfolio',(req,res)=>{
     
    Portfolio.findOne({email:req.body.email})
    .then(devfolio=>{
        //if portfolio already existed 
        //then update the existed one
        //otherwise create a new one
        if(!devfolio)
        {
           

            //create a new object
            const newPortfolio=new Portfolio({
                email:req.body.email,
                bio:req.body.bio,
                experience:req.body.experience,
                college:req.body.college,
                degree:req.body.degree,
                lastJob:req.body.lastJob,
                date:Date.now()
            })

            //push all top-3 skills
            newPortfolio.skills.push(req.body.skill_1)
            newPortfolio.skills.push(req.body.skill_2)
            newPortfolio.skills.push(req.body.skill_3)

            newPortfolio.save()
            .then(portfolio=>{
                
                res.render('developer/portfolio',{
                    user:req.user,
                    portfolio:portfolio,
                    msg:"Portfolio is created, now you can apply for Jobs"
                });
            })
            .catch(err=>console.log(err));
        }
        else
        {
            Portfolio.findOne({email:req.body.email})
            .then(portfolio=>{

                //just update each field
                portfolio.email=req.body.email;
                portfolio.bio=req.body.bio;
                portfolio.skills=[req.body.skill_1,req.body.skill_2,req.body.skill_3];
                portfolio.experience=req.body.experience;
                portfolio.college=req.body.college;
                portfolio.degree=req.body.degree;
                portfolio.lastJob=req.body.lastJob;
                portfolio.date=Date.now()

                let query={email:req.body.email};

                //and then update in a database
                Portfolio.updateOne(query,portfolio,(err)=>{
                    if(err)
                    {
                        console.log(err);
                        return;
                    } 
                    else
                    {
                        res.render('developer/portfolio',{
                            user:req.user,
                            portfolio:portfolio,
                            msg:"Portfolio is updated now"
                            
                        })
                    }
                })
            })
        }
    })

    
})


//on click ,apply to jobs route
router.get('/clicked/:id',(req,res)=>{
    var postID=req.params.id;
    console.log(postID);

    JobPost.findOne({_id:postID},(err,post)=>{
                    //   adding the developer ID to 
                    //   applied developer to a specific job
                    var appliedDevelopers=[];
                    

                    post.appliedDev.forEach(function(email){
                        if(email!=req.user.email)
                        {
                            appliedDevelopers.push(email);
                        }
                    })
                    
                    appliedDevelopers.push(req.user.email);
                    post.appliedDev=appliedDevelopers;



                    //update the appliedDev array
                    JobPost.updateOne({'_id':postID},post,(err)=>{
                        if(err){
                            console.log(err);
                            return;
                        }
                        else{
                            console.log("update ho gya");
                            return res.status(200).end();
                        }
                    })
    })


    
})





//route to logout developer ,
//it redirect to login page with success message
router.get('/logout',ensureAuthenticated,(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/developer/login');
})

module.exports=router;