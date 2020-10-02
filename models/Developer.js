const mongoose=require('mongoose');

const DeveloperSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const Developer=mongoose.model('Developer',DeveloperSchema);

module.exports=Developer;