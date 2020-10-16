//This is 'Portfolio Schema',which have

//     (i) Developer's email (to find portfolio using his email)
//    (ii) Deveoloper's Bio
//   (iii) array of skills (top-3)
//    (iv) Experience(years) in development
//     (v) College
//    (vi) Degree
//   (vii) Last job
//  (viii) Last Job(if any)


const mongoose=require('mongoose');

const PortfolioSchema=new mongoose.Schema({
    
    email:{
        type:String,
        required:true
    },

    bio:{
        type:String,
        required:true
    },

    skills:[String],

    experience:{
        type:Number,
        required:true
    },

    college:{
        type:String,
        requied:true
    },

    degree:{
        type:String,
        required:true
    },

    lastJob:{
        type:String,
        required:true
    },

    date:{
      type:Date,
      default:Date.now
    }

})

const Portfolio=mongoose.model('Portfolio',PortfolioSchema);

module.exports=Portfolio;
