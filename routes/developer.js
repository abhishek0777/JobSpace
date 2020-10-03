const express=require("express");
const path=require('path');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');


//bring in models
const Developer=require('../models/Developer');
const Company=require('../models/Company');


//bring auth-config file
const {forwardAuthenticated,ensureAuthenticated}=require('../config/auth');




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
router.post('/login',(req,res,next)=>{
    passport.authenticate('local.developer',{
        successRedirect:'/developer/dashboard',
        failureRedirect:'/developer/login',
        failureFlash:true
    })(req,res,next)
})


//-------------------------------After Login by developer-------------------------------

//all routes afterwards can be accessed only if developer login

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    
    res.render('developer/dashboard',{
        user:req.user
    })
})


//route to portfolio of developer
router.get('/portfolio',ensureAuthenticated,(req,res)=>{

    res.render('developer/portfolio',{
        user:req.user
    });
})


//route to job Posts
router.get('/jobPosts',(req,res)=>{
    res.render('developer/jobPosts',{
        user:req.user
    });
})


//route to statistics ,for which companies
//developer have applied
router.get('/statistics',(req,res)=>{
    res.render('developer/statistics',{
        user:req.user
    });
})


//route to notifications for developer
router.get('/notifications',(req,res)=>{
    res.render('developer/notifications',{
        user:req.user
    });
})




//route to logout developer ,
//it redirect to login page with success message
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/developer/login');
})

module.exports=router;