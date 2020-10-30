// This utility used to format time
const moment=require('moment');

function formattedDate(){
    return moment().format('hh:mm a');
}

module.exports=formattedDate;