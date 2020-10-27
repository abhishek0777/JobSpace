const moment=require('moment');

function formattedDate(){
    return moment().format('h:mm a');
}

module.exports=formattedDate;