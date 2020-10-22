//THis is Developer schema,it have

//     (i) Developer's name
//    (ii) Developer's email
//   (iii) his/her account's password (encrypted using bcryptjs)
//    (iv) hidden score (so that companies can filter developer's requests)
//     (v) array of company's emails ,to which he/she have subscribed
//         --(he/will get notification about job posts and their new posts)


//ORM used is this project is mongoose,for simplicity
//and each of interaction with Mongodb database
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
    //store email
    subscribed:[String],
    
    notifications:[String]

});

const Developer=mongoose.model('Developer',DeveloperSchema);

module.exports=Developer;