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
    },
    //to filter by recruiters during job applications
    hiddenScore:{
        type:String
    },
    // subscribed companies to get their latest updates
    subscribed:[
        {
            type:String
        }
    ]

});

const Developer=mongoose.model('Developer',DeveloperSchema);

module.exports=Developer;