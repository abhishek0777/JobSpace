const LocalStrategy=require('passport-local').Strategy;
const bcrypt=require('bcryptjs');

// Bring Developer Model
const Developer=require('../models/Developer');

//Bring Company Model
const Company = require('../models/Company');


function SessionConstructor(userID,userGroup,details)
{
    this.userID=userID;
    this.userGroup=userGroup;
    this.details=details;
}


module.exports=function(passport){

    //serialize and deserialize
    passport.serializeUser((userObject,done)=>{
        //userObject could be of any model
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


    //deserialize

    passport.deserializeUser((sessionConstructor,done)=>{
        if(sessionConstructor.userGroup=='developer-model')
        {
            Developer.findOne({
                _id:sessionConstructor.userID
            },(err,user)=>{
                // When using string syntax, prefixing a path with - will flag that path as excluded.
                done(err,user);
            })
        }
        else if(sessionConstructor.userGroup=='company-model')
        {
            Company.findOne({
                _id:sessionConstructor.userID
            },(err,user)=>{
                // When using string syntax, prefixing a path with - will flag that path as excluded.
                done(err,user);
            })
        }
    })



    //login authentication for developer login
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


    //login authentication for Company login
    passport.use('local.company',
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            //match account
            Company.findOne({email:email})
            .then(company=>{
                if(!company)
                {
                     return done(null,false,{message:'This email is not registered yet'});  
                }

                //it code comes here,it means email is registered
                //now check for password
                bcrypt.compare(password,company.password,(err,isMatch)=>{
                    if(err) throw err;
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