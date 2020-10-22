// This is a company's account schema,it have

//     (i) Company Name
//     (ii)Its email
//     (iii)Company size (as info for developers)
//     (iv)Country,where its based 
//     (v)password(encrypted using bcryptjs module with 10 charactes long encryption) 

//ORM used is this project is mongoose,for simplicity
//and each of interaction with Mongodb database
const mongoose = require('mongoose');

const CompanySchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    notifications:[String]


});

//Naming the created schema 'CompanySchema'
const Company=mongoose.model('Company',CompanySchema);
//then export it to use 
module.exports=Company;