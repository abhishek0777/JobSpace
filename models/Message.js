const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    senderName:{
        type:String,
        required:true
    },
    sendingTime:{
        type:String,
        required:true
    },
    senderMsg:{
        type:String,
        required:true
    }

})

const Message=mongoose.model('Message',messageSchema);

module.exports=Message;