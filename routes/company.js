const express=require("express");
const path=require('path');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');

//Bring the Company model
const Developer=require('../models/Developer');
const Company=require('../models/Company');
const JobPost=require('../models/JobPost');


//bring auth-config file
const {forwardAuthenticated,ensureAuthenticated}=require('../config/auth');

// set public folder
router.use(express.static(path.join("public")));

//Handle req for registration form
router.get('/register',forwardAuthenticated,(req,res)=>{
    res.render("registerCom");
});


//Handle req for login form
router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('loginCom');
})

//Handle Post req to register new company
router.post('/register',(req,res)=>{
    //we extract all inputs form form
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


router.get('/profile',(req,res)=>{
    res.render('company/profile',{
        user:req.user
    })
})

router.get('/addPost',(req,res)=>{
    res.render('company/addPost',{
        user:req.user
    });
})


//post a job
router.post('/addPost',(req,res)=>{
    // res.send('form is submitted');

    //in this case ,we just have to directly post the POST
    
    const newpost=new JobPost({
        companyName:req.user.name,
        jobName:req.body.jobName,
        jobRole:req.body.jobRole,
        skillsReq:req.body.skillsReq,
        jobType:req.body.jobType,
        expReq:req.body.expReq,
        date:Date.now()
    })

    newpost.save()
    .then(post=>{
        req.flash('success_msg','Job Application Posted');
        res.redirect('/company/addPost');
    })
    .catch(err=>console.log(err));

})



router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/company/login');
})


module.exports=router;