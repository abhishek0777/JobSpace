//-----------------------------This route file for Developer,so all routes related to developer are defined here------------
//--------------------------------------------------/developer/<someRoutePath>----------------------------------------------


//------------List of all the required modules------

//Express framework for server side programming
const express=require("express");
const path=require('path');

const router=express.Router();

//module for encryption of password
const bcrypt=require('bcryptjs');

//module for login authentication
const passport=require('passport');

const nodemailer = require('nodemailer');
const prompt = require('prompt');


//--------------Bring in all the models----------------
const Developer=require('../models/Developer');
const Company=require('../models/Company');
const JobPost=require('../models/JobPost');
const Portfolio=require('../models/Portfolio');
const Message=require('../models/Message');




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




let OTP='';
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

    if(req.body.OTP==''){
        errors.push({msg:'Verify your account first.'});
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

                        // if we reach here,then to verify this email we have to send OTP
                        //to this email and re-enter by the user and then check whether OTP match or not
                        //for this functionality,i will use 'node-mailer' module

                        
                        

                        if(OTP!=req.body.OTP){
                            errors.push({msg:'OOPS ! Your OTP was wrong, Try again'});
                            res.render('registerDev',{
                                errors,
                                name,
                                email,
                                password1,
                                password2
                            })
                        }

                        
                        else{
                                //if there is no developer ,we will add it in database
                            let hiddenScore='';
                            const newDeveloper=new Developer({
                                name:name,
                                email:email,
                                password:password1,
                                hiddenScore:hiddenScore
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
                    }
                    
                })
                .catch((err)=>{console.log(err)});
            }
            
        })
        .catch((err)=>{console.log(err)});
    }
})





// This post request route used to send OTP via mail to registering user 
router.post('/OTP/:emailID',(req,res)=>{

    /* ------------Node mailer starts here -------------*/

    const email=req.params.emailID;
    OTP='';
    // string used to generate random OTP of 6 characters
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    
    // Find the length of string 
    var len = string.length;

    for (let i = 0; i < 6; i++ ) { 
        OTP+=string[Math.floor(Math.random()*len)]; 
    } 

    

    //create output for mail to new user
    const output = `
      <p>Welcome to community of millions of developers.</p>
      <h3>One Time Password : ${OTP}</h3>
      <h3>From :</h3>
      <h3>JobSpace</h3>
      <h3>Thank you for joining us as a developer!</h3>
      `;
  

    //create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({  
        // host:'smtp.gmail.com',
        service:'gmail',  
        auth:{
            user: 'jobspace2020webster@gmail.com',
            pass:'rlbrnngltkczlxxa'
        }
    });
    // pass: 'rlbrnngltkczlxxa'
  
    // setup email data with unicode symbols
    let mailOptions = {
  
        from: '"Nodemailer Contact"', // sender address
        to: email, // list of receivers
        subject: 'Welcome to JobSpace', // Subject line
        text: 'OTP for jobspace :'+OTP,
        html:output 
        
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      
    });
})





//handle post request for developer login page
//Using Local strategy to authenticate user
//we have defined strategy named 'local.developer' for developers to authenticate
router.post('/login',(req,res,next)=>{
    
    console.log(req.body.email);
    // ALGORITHM when user login
    // Condition 1 :if user login first time then he have give quiz first for hidden score
    // Condition 2 :if he had done with quiz but didn't create portfolio,then it redirects to portfolio page
    // Condition 3 :if he had done with both quiz and portfolio ,then it redirects to dashboard

    Developer.findOne({email:req.body.email},(err,developer)=>{

        if(developer){
            // condition 1
            if(developer.hiddenScore==''){

                passport.authenticate('local.developer',{
                    successRedirect:'/developer/quiz',
                    failureRedirect:'/developer/login',
                    failureFlash:true
                })(req,res,next)

            }
            else{

                Portfolio.findOne({email:req.body.email},(err,portfolio)=>{

                    // condition 3
                    if(portfolio){

                        passport.authenticate('local.developer',{
                            successRedirect:'/developer/dashboard',
                            failureRedirect:'/developer/login',
                            failureFlash:true
                        })(req,res,next)

                    }

                    // condition 2
                    else{

                        passport.authenticate('local.developer',{
                            successRedirect:'/developer/portfolio',
                            failureRedirect:'/developer/login',
                            failureFlash:true
                        })(req,res,next)

                    }
                })
            }
        }
        // when developer is not registered
        else{

            passport.authenticate('local.developer',{
                successRedirect:'/',
                failureRedirect:'/developer/login',
                failureFlash:true
            })(req,res,next)
        }
        
    })
      
})


//-------------------------------After Login by developer-------------------------------



// quiz on first time login to calculate hidden score
router.get('/quiz',ensureAuthenticated,(req,res)=>{
    res.render('developer/quiz',{
        user:req.user
    });
})





//------POST req of quiz submission-----
router.post('/quizSubmission',(req,res)=>{
    
    
    let marks=0;

    var obj=req.body;

    // calculate total marks
    for(var propt in obj){
        if(obj[propt]=='true')marks+=4;
        else marks--;
    }
    
    console.log(marks);

    //find that developer and save his/her hidden score and then update that developer in db
    Developer.findOne({email:req.user.email},(err,developer)=>{
        developer.hiddenScore=marks;

        Developer.updateOne({email:req.user.email},developer,(err)=>{
            if(err){
                console.log(err);
                return;
            }
            else{
                res.render('developer/portfolio',{
                    user:req.user,
                    portfolio:"",
                    msg:""
                })
            }
        })
    })
})





//-------all routes afterwards can be accessed only if developer have loggedin----------

router.get('/dashboard',ensureAuthenticated,(req,res)=>{

    //Dashboard will shows all the posts posted by all companies to user
    //as per latest one on top

    //in this route there will be no filter on posts
    
    JobPost.find({},(err,posts)=>{

        res.render('developer/dashboard',{
            user:req.user,
            posts:posts,
            filterCompanyName:'all',     //by default,it shows posts of all companies
            filterJobType:'both'        //and shows jobs of both the types(internship,fulltime)

        })
    })
  
})





// POST req for filtering the posts according to user demand
router.post('/dashboard',(req,res)=>{
    
    console.log(req.body.companyName);
    console.log(req.body.jobType);

    JobPost.find({},(err,posts)=>{
        res.render('developer/dashboard',{
            user:req.user,
            posts:posts,
            filterCompanyName:(req.body.companyName==undefined)?'all':req.body.companyName,
            filterJobType:(req.body.jobType==undefined)?'both':req.body.jobType
        })
    })

})





//recommended jobs shows according what developers subscribed
router.get('/recommended',ensureAuthenticated,(req,res)=>{

    JobPost.find({},(err,posts)=>{
        res.render('developer/recommended',{
            user:req.user,   //user contains its subscribed array also
            posts:posts,
            filterCompanyName:'all',  //by default,it shows posts of all companies
            filterJobType:'both'      //and shows jobs of both the types(internship,fulltime)

        })
    })
    
})





// POST req used to filter recommended posts
router.post('/recommended',(req,res)=>{
    JobPost.find({},(err,posts)=>{
        res.render('developer/recommended',{
            user:req.user,
            posts:posts,

            // Filter according to user request
            filterCompanyName:(req.body.companyName==undefined)?'all':req.body.companyName,
            filterJobType:(req.body.jobType==undefined)?'both':req.body.jobType
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





//route to statistics ,can see to which companies developer have applied
router.get('/statistics',ensureAuthenticated,(req,res)=>{

    JobPost.find({},(err,posts)=>{
        res.render('developer/statistics',{
            posts:posts,
            user:req.user
        });
    })
    
})





//from here,user can subscribe companies and can search companies
router.get('/companies',ensureAuthenticated,(req,res)=>{
    Company.find({},(err,companies)=>{
        res.render('developer/companies',{
            user:req.user,
            devEmail:req.user.email,
            companies:companies
        });
    })
})






//search autocomplete feature on companies page
router.get('/searchAutocomplete',(req,res,next)=>{

    // 'i' is regExp method
    let regex=new RegExp(req.query['term'],'i');

    //filter companies according to typed characters on search bar
    let companyFilter=Company.find({name:regex},{'name':1}).sort({'updated_at':-1}).sort({'created_at':-1}).limit(20);


    companyFilter.exec((err,data)=>{
        console.log(data);
        let result=[];
        if(!err){
            if(data && data.length && data.length>0){
                data.forEach(company=>{
                    let obj={
                        id:company._id,
                        label:company.name
                    };
                    result.push(obj);
                });
            }

            res.jsonp(result);
        }
    })
})





//after clicking search button
router.post('/searchCompany',(req,res)=>{
    console.log('route k andr aagye');
    let companyName=req.body.companyName;
    console.log(companyName);
    Company.findOne({name:companyName},(err,company)=>{
        if(company){
            console.log('mil gyi');
            res.render('developer/companyProfile',{
                user:req.user,
                company:company
            })
        }
        else{
            Company.find({},(err,companies)=>{
                res.render('developer/companies',{
                    user:req.user,
                    devEmail:req.user.email,
                    companies:companies
                });
            })
        }
        
    })
    
})





//on click ,subscribe the companies
router.get('/subscribed/:id',(req,res)=>{

    var emailID=req.params.id;
    console.log(emailID);

    //add to the notification of company
    Company.findOne({email:emailID},(err,company)=>{
        company.notifications.unshift(req.user.name+' has subscribed your organization.');

        //update the company object
        Company.updateOne({email:emailID},company,(err)=>{
            if(err){
                console.log(err);
                return;
            }
        })
    })


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

                    //check if this user is rejected from this post or not
                    //and accordingly remove him from database
                    var rejectedDevelopers=[];
                    post.rejectedDev.forEach(function(email){
                        if(email!=req.user.email){
                            rejectedDevelopers.push(email);
                        }
                    })
                    post.rejectedDev=rejectedDevelopers;



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

                    //add it to the notifications of company
                    Company.findOne({email:post.companyEmail},(err,company)=>{
                        company.notifications.unshift(req.user.name+' has applied to '+post.jobName+'.');

                        //update the company object
                        Company.updateOne({email:post.companyEmail},company,(err)=>{
                            if(err){
                                console.log(err);
                                return;
                            }
                        })
                    })
               
    })

 
})





// chat functionality
router.get('/developersChat',(req,res)=>{

    //send all messages to chat page
    Message.find({},(err,messages)=>{
        res.render('developersChat/chat',{
            user:req.user,
            messages:messages
        })
    })
    
})





// used to save message to database
router.post('/addMsgToChat',(req,res)=>{

        const newMsg=new Message({
            senderName:req.body.senderName,
            sendingTime:req.body.sendingTime,
            senderMsg:req.body.senderMsg
        })

        newMsg.save()
        .then(msg=>{
            console.log(msg);
            
        })
        .catch(err=>console.log(err));
})




//route to logout developer ,
//it redirect to login page with success message
router.get('/logout',ensureAuthenticated,(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/developer/login');
})



module.exports=router;