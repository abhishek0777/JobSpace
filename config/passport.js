// Implementing authentication for login,
//using 'Local Strategy' of Passport.js
const LocalStrategy=require('passport-local').Strategy;

//bcrypt module use to encrypt the password , for security purpose of accounts
const bcrypt=require('bcryptjs');

// Bring Developer Model
const Developer=require('../models/Developer');

//Bring Company Model
const Company = require('../models/Company');


//Since,two authentication,
// (i)Developer login
// (ii)Company login
function SessionConstructor(userID,userGroup,details)
{
    this.userID=userID;
    this.userGroup=userGroup;
    this.details=details;
}


module.exports=function(passport){

    //--------------serialize and deserialize---------------

    // Serializing the user login
    passport.serializeUser((userObject,done)=>{

        //userObject could be of any model,let it be any
        let userGroup='developer-model';
        let userPrototype=Object.getPrototypeOf(userObject);

        if(userPrototype===Developer.prototype)
        {
            userGroup='developer-model';
        }
        else if(userPrototype===Company.prototype)
        {
            userGroup='company-model';
        }

        let sessionConstructor=new SessionConstructor(userObject._id,userGroup,'');
        done(null,sessionConstructor); 
    })


    //deserializing the user login

    passport.deserializeUser((sessionConstructor,done)=>{
        if(sessionConstructor.userGroup=='developer-model')
        {
            Developer.findOne({
                _id:sessionConstructor.userID
            },(err,user)=>{
                done(err,user);
            })
        }
        else if(sessionConstructor.userGroup=='company-model')
        {
            Company.findOne({
                _id:sessionConstructor.userID
            },(err,user)=>{
                done(err,user);
            })
        }
    })



    //------------------Login authentication for Developer login-----------------------
    passport.use('local.developer',
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            //match account
            Developer.findOne({email:email})
            .then(developer=>{
                if(!developer)
                {
                     return done(null,false,{message:'This email is not registered yet'});  
                }

                //it code comes here,it means email is registered
                //now check for password
                bcrypt.compare(password,developer.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch)
                    {
                        return done(null,developer);
                    }
                    else
                    {
                        return done(null,false,{message:'Incorrect Password, Try again'})
                    }
                })
            })
        })
    );


    //------------------------Login authentication for Company login--------------------------

    passport.use('local.company',
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            //match account
            Company.findOne({email:email})
            .then(company=>{

                //check if there is company with given email or not
                if(!company)
                {
                    //return with a flash messaging
                     return done(null,false,{message:'This email is not registered yet'});  
                }

                //it code comes here,it means email is registered
                //now check for password
                bcrypt.compare(password,company.password,(err,isMatch)=>{
                    if(err) throw err;
                    
                    //check does password matches or not
                    if(isMatch)
                    {
                        return done(null,company);
                    }
                    else
                    {
                        return done(null,false,{message:'Incorrect Password, Try again'})
                    }
                })
            })
        })
    );


   

}