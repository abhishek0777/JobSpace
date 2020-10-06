const mongoose =require('mongoose');
const Schema=mongoose.Schema;

const JobPostSchema=new mongoose.Schema({
    companyName:{
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
    appliedDev:[
        {
            type:Schema.Types.ObjectId,
            ref:'Developer'
        }
    ],
    date:{
        type:Date,
        default:Date.now
    }

    //likes feature will be added later


})

const JobPost = mongoose.model('JobPost',JobPostSchema);

module.exports=JobPost;