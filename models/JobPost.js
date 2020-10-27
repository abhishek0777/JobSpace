//his is schema of 'Post',it have
//   (i) Company name which posted it
//  (ii) Company email
// (iii) Job name
//  (iv) Job Role
//   (v) Skills required
//  (vi) Job type : Internship or Full-time
// (vii) Experience Required
//(viii) array of emails of developers who applied for job
//  (ix) tells programmer whether application portal is still open to apply or not


//ORM used is this project is mongoose,for simplicity
//and each of interaction with Mongodb database
const mongoose =require('mongoose');


const JobPostSchema=new mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    companyEmail:{
        type:String,
        required:true
    },
    jobName:{
        type:String,
        required:true
    },
    jobRole:{
        type:String,
        required:true
    },
    skillsReq:{
        type:String,
        required:true
    },
    jobType:{
        type:String,
        required:true
    },
    expReq:{
        type:String,
        required:true
    },

    //String=email
    appliedDev:[String], 

    rejectedDev:[String],
    
    date:{
        type:String,
        required:true
    },

    //YES or NO
    isContinue:{
        type:String,
        required:true
    }



    


})

const JobPost = mongoose.model('JobPost',JobPostSchema);

module.exports=JobPost;