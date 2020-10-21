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
                                    req.flash('sucess_msg',"You're now registerd,can Login");
                                    res.redirect('/company/login')
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
    
    //in this case ,we just have to directly post the POST
    
    //create a new object of 'JobPost' Schema
    const newpost=new JobPost({
        companyName:req.user.name,
        companyEmail:req.user.email,
        jobName:req.body.jobName,
        jobRole:req.body.jobRole,
        skillsReq:req.body.skillsReq,
        jobType:req.body.jobType,
        expReq:req.body.expReq,
        date:Date.now(),
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
        res.render('company/statistics',{
            user:req.user,
            posts:posts
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

            //if found,then find its portfolio also
            Portfolio.findOne({'email':email},(err,portfolio)=>{
                res.render('company/devProfile',{

                    //sends (i) portfolio, (ii) developer's profile,and (iii) authenticated user
                    user:req.user,
                    portfolio:portfolio,
                    developer:developer
                })
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

    console.log(jobID);
    console.log(dev);

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

//When company done with the posted job
router.post('/postDone/:id',ensureAuthenticated,(req,res)=>{
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