//-----------------------------THis route file for Company,so all routes related to company are defined here------------
//---------------------------------------/company/<someRoutePath>-----------------


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


//bring auth-config file
// =>ensureAuthenticated : Use to protect the routes 
// =>forwardAuthenticated : by pass the routes without having authentication
const {forwardAuthenticated,ensureAuthenticated}=require('../config/auth');


// set public folde for static files to load
router.use(express.static(path.join("public")));


//Handle request for registration form (bypass authentication)
router.get('/register',forwardAuthenticated,(req,res)=>{
    res.render("registerCom");
});


//Handle reqest for login form, (by pass authentication)
router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('loginCom');
})

let OTP;
//Handle Post request to register new company
router.post('/register',(req,res)=>{
    //we extract all inputs form form

    //password1=password
    //password2=confirm password
    const {name,email,size,country,password1,password2}=req.body;
    let errors=[];

    //check if any field is empty
    if(!name || !email || !password1 || !password2)
    {
        errors.push({msg:'Please fill in all fields'});
    }

    if(req.body.OTP==''){
        errors.push({msg:'Verify your account first.'});
    }

    //confirm password
    if(password1!=password2)
    {
        errors.push({msg:"Password don't match "});
    }

    //check Password length
    if(password1.length<6)
    {
        errors.push({msg:"Password should be at least six character long"});
    }

    //if we find any error,return to sing up page again
    if(errors.length>0)
    {
        res.render('registerCom',{
            errors,
            name,
            email,
            size,
            country,
            password1,
            password2
        })
    }
    else
    {
        //till now ,we did't find any errors
        //hence now we chehk,if business email 
        // is already registered or not
        Company.findOne({email:email})
        .then(company=>{
            if(company)
            {
                //company is already registered
                errors.push({msg:'Email is already registerd'});
                res.render('registerCom',{
                    errors,
                    name,
                    email,
                    size,
                    country,
                    password1,
                    password2
                })
            }
            else
            {
                //check if this email already registered under developer type
                Developer.findOne({email:email})
                .then(developer=>{
                    if(developer)
                    {
                        //email is registerd under a developer
                            errors.push({msg:'Email is already registerd'});
                            res.render('registerCom',{
                                errors,
                                name,
                                email,
                                size,
                                country,
                                password1,
                                password2
                            })
                    }
                    else
                    {
                        // if we reach here,then to verify this email we have to send OTP
                        //to this email and re-enter by the user and then check whether OTP match or not
                        //for this functionality,i will use 'node-mailer' module

                        
                        

                        if(OTP!=req.body.OTP){
                            errors.push({msg:'OOPS ! Your OTP was wrong, Try again'});
                            res.render('registerCom',{
                                errors,
                                name,
                                email,
                                size,
                                country,
                                password1,
                                password2
                            })
                        }

                        else{
                                //if not registerd,we will save this accound in Company model
                            const newCompany=new Company({
                                name:name,
                                email:email,
                                size:size,
                                country:country,
                                password:password1
                            })

                            //Using bcrypt, we will hash account's password
                                bcrypt.genSalt(10,(err,salt)=>{
                                bcrypt.hash(newCompany.password,salt,(err,hash)=>{
                                    if(err) throw err;

                                    //set password to hashed one
                                    newCompany.password=hash;

                                    //save company's account
                                    newCompany.save()
                                    .then(company=>{
                                        req.flash('success_msg',"You're now registerd,can Login");
                                        res.redirect('/company/login')
                                    })
                                    .catch((err)=>{console.log(err)});
                                })
                            })
                        }
                        


                    }
                })
            }
            
        })
    }



})


router.post('/OTP/:emailID',(req,res)=>{

    /* ------------Node mailer starts here -------------*/
    const email=req.params.emailID;
    
    OTP='';
    // string used to create 6 characters long OTP
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 

    
    // Find the length of string 
    var len = string.length; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += string[Math.floor(Math.random() * len)]; 
    } 

    //create output for mail to new user
    const output = `
      <p>Welcome to community of millions of developers.</p>
      <h3>One Time Password : ${OTP}</h3>
      <h3>From :</h3>
      <h3>JobSpace</h3>
      <h3>Thank you for joining us as a recruiter!</h3>
    `;
  

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jobspace2020webster@gmail.com',
        // pass: 'jobspace@1234'
        pass: 'nayipvtewekfxiog' 
      }
    });
  

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

    /*-------------- Node mailer ends here-------------- */
})





//handle post request for company login page

//here comes,passport.js 's 'Local strategy'
// for company, we have create 'local.company' named to strategy
//will authenticatec company and most imp , serialize it as a user
router.post('/login',(req,res,next)=>{
    passport.authenticate('local.company',{
        successRedirect:'/company/dashboard',
        failureRedirect:'/company/login',
        failureFlash:true
    })(req,res,next)
})



// -------------------------Routes after login can be accessed ----------------------------------




router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    //check whether this company has posted any job or not yet
    //if didn't then show a message to post a job 
    //else show all posted jobs by company

    JobPost.find({companyName:req.user.name},(err,post)=>{
        //note that 'posts' is an array of objectes ,not a single object
        res.render('company/dashboard',{
            user:req.user,
            posts:post
        })
    })
})




//This route handles request for company's profile
router.get('/profile',ensureAuthenticated,(req,res)=>{
    res.render('company/profile',{
        user:req.user
    })
})




//This route handles request of addPost web page
router.get('/addPost',ensureAuthenticated,(req,res)=>{
    res.render('company/addPost',{
        user:req.user
    });
})




//post a job,handles POST request of addPost webpage's form
router.post('/addPost',(req,res)=>{


    // notifications to all users,who subscribed this company
    Developer.find({},(err,developers)=>{
        developers.forEach(function(developer){
            developer.subscribed.forEach(function(companyEmail){
                if(companyEmail==req.user.email){
                    developer.notifications.unshift('Your subscribed company '+req.user.name+' posted a '+req.body.jobName+' job.');
                }
                
            })

            //now update this developer
            Developer.updateOne({email:developer.email},developer,(err)=>{
                if(err){
                    console.log(err);
                    return;
                }
               
            });
        })
    })
    
    //in this case ,we just have to directly post the POST
    

    //time format custom method
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d=new Date();
    let timeString=timeFormat()+"   "+d.getDate()+" "+months[d.getMonth()];

    function timeFormat(){
        let hh=d.getHours();
        let mm=d.getMinutes();
        let a='am';
        if(hh==12&&mm>0)a='pm';
        if(hh>12)hh-=12,a='pm';

        return hh+":"+mm+" "+a;
    }
    // time format custom method ends here

    
    //create a new object of 'JobPost' Schema
    const newpost=new JobPost({
        companyName:req.user.name,
        companyEmail:req.user.email,
        jobName:req.body.jobName,
        jobRole:req.body.jobRole,
        skillsReq:req.body.skillsReq,
        jobType:req.body.jobType,
        expReq:req.body.expReq,
        date:timeString,
        isContinue:'YES'
    })

    //save this newly created object to database,with a success message
    newpost.save()
    .then(post=>{
        req.flash('success_msg','Job Application Posted');
        res.redirect('/company/dashboard');
    })
    .catch(err=>console.log(err));

})





//Handles request to show statistics of Posts posted by company 
//   => Can check who have applied(requests)
//   => can check their portfolio
//   => can also decline their request,if found not suitable for job

router.get('/statistics',ensureAuthenticated,(req,res)=>{
    JobPost.find( { companyEmail : req.user.email } , ( err , posts ) => {
        Developer.find({},(err,developers)=>{
            res.render('company/statistics',{
                user:req.user,
                posts:posts,
                developers:developers
            })
        })
        
    })
})




//Handles request,if on statistics page,a company wants to check developer's portfolio
//It will find portfolio using email (came with req.body) in Developer' Schema
router.post('/devProfile',(req,res)=>{

    //developer's email id
    const email=req.body.submit;

    //find a developer
    Developer.findOne({'email':email})
    .then(developer=>{
        if(developer){

            //send this notification to developer
            developer.notifications.unshift('Your portfolio has been checked by '+req.user.name+'.');
            Developer.updateOne({email:email},developer,(err)=>{
                if(err){
                    console.log(err);
                    return;
                }
            })


            //if found,then find its portfolio also
            Portfolio.findOne({'email':email},(err,portfolio)=>{
                if(portfolio){
                    res.render('company/devProfile',{

                        //sends (i) portfolio, (ii) developer's profile,and (iii) authenticated user
                        user:req.user,
                        portfolio:portfolio,
                        developer:developer
                    })
                }
                else{
                    // when user haven't created his portfolio yet
                }
                
            })
        }
        
    })
    
})

// companies can developer's stats who apply to their posts
router.post('/developerStats',(req,res)=>{
    const email=req.body.submit;


    //find a developer
    Developer.findOne({'email':email})
    .then(developer=>{
        if(developer){

            //send this notification to developer
            developer.notifications.unshift('Your stats has been reviewed by '+req.user.name+'.');
            Developer.updateOne({email:email},developer,(err)=>{
                if(err){
                    console.log(err);
                    return;
                }
            })

            JobPost.find({},(err,posts)=>{
                res.render('company/developerStats',{

                    //sends (i) posts (ii) developer and (ii) authenticated user
                    user:req.user,
                    developer:developer,
                    posts:posts
                })
            })
        }
    })

})





//Handles,declining of request by company
// It will update the array of appliedDev accordingly
router.get('/declineRequest/:id1/:id2',ensureAuthenticated,(req,res)=>{

    //extract PostID
    const jobID=req.params.id1;

    //extract developer's email ID
    const dev=req.params.id2;

    //send notifications to all users,who applied to this post
    JobPost.findOne({"_id":jobID},(err,post)=>{
        Developer.findOne({email:dev},(err,developer)=>{
            developer.notifications.unshift("Your application for "+post.jobName+" got rejected from "+post.companyName+".");

            Developer.updateOne({email:dev},developer,(err)=>{
                if(err){
                    console.log(err);
                    return;
                }
            })
        })
    })


    //Find that post
    JobPost.findOne({"_id":jobID},(err,post)=>{

        // and then change the array of applied developers
        appliedDevelopers=[];
        post.appliedDev.forEach(function(email){
            if(email!=dev){
                appliedDevelopers.push(email);
            }
        })

        //assign new array of developers
        post.appliedDev=appliedDevelopers;

        //and add this developer to rejected Developer array
        post.rejectedDev.push(dev);


        //then Update the post and return to page again
        JobPost.updateOne({"_id":jobID},post,(err)=>{

            if(err){
                console.log(err);
                return;
            }
            else{
                console.log("Update ho gya");
                return res.status(200).end();
            }
        })

    })

})





//handles post req when company done with the posted job
router.post('/postDone/:id',(req,res)=>{
    let postID=req.params.id;
    console.log(postID);

    JobPost.findOne({_id:postID},(err,post)=>{
        post.isContinue='NO';

        JobPost.updateOne({_id:postID},post,(err)=>{
            if(err){
                console.log(err);
                return;
            }
            else{
                console.log("update ho gya");
                return res.status(200).end();
            }
        })

        // also send notifications to all user,that they get selected
        post.appliedDev.forEach(function(email){
            Developer.findOne({email:email},(err,developer)=>{
                
                developer.notifications.unshift('Congratulations '+developer.name+', your application for '+post.jobName+' has accepted.Keep eyes on notifications for further assessments.')

                    //update the developer
                Developer.updateOne({email:email},developer,(err)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                })
            })

            

        })
    })



    
})



router.get('/assessment',ensureAuthenticated,(req,res)=>{
    JobPost.find({},(err,posts)=>{
        res.render('company/assessment',{
            user:req.user,
            posts:posts
        })
    })
    
})


router.post('/sendTestLink',(req,res)=>{
    JobPost.findOne({'_id':req.body.postID},(err,post)=>{
        if(!err){
            // now to send mail to all selected developers
            //we have to create array of their emails,so
            let mailList=[];
            post.appliedDev.forEach(function(email){
                mailList.push(email);
            })
            console.log(mailList);
            let testlink=req.body.testlink;

            // now we will use nodemailer to send mail
            //create output for mail to new user
            const output = `
            <p>Congratulations, You are selected for test rounds of ${post.jobName}</p>
            Here is the <a href="${testlink}">link </a>for test.
            <h3>Instructions</h3>
            <p>${req.body.testinstructions}</p>
            <h3>Best of luck from JobSpace</h3>
            `;


            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'jobspace2020webster@gmail.com',
                pass: 'jobspace@1234' 
                }
            });


            // setup email data with unicode symbols
            let mailOptions = {

                from: '"Nodemailer Contact"', // sender address
                to: mailList, // list of receivers
                subject: 'JobSpace Test', // Subject line
                // text: 'OTP for jobspace :'+OTP,
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

            /*-------------- Node mailer ends here-------------- */

        }
    })
})





//Handles the GET request to view  notification section
//Its work is not started yet <----Pending---->
router.get('/notifications',ensureAuthenticated,(req,res)=>{

    res.render('company/notifications',{
        user:req.user
    });

})




//This route logout the company
//deserialize it
//and redirect to compnay's login page again
//with a success flash message
router.get('/logout',ensureAuthenticated,(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/company/login');
})


module.exports=router;