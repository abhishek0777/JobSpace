// This a client side js code to add message to messages in chat-box

console.log('chat script working');


// This block of code used to goto bottom of chat-message 
var objDiv = document.getElementById("message-collection");
objDiv.scrollTop = objDiv.scrollHeight;


// This function triggered on click of send button
//devname=developer who sends the message
function appendNewMsg(devname){

    //extract the message 
    let msgText=document.getElementById('msg').value;

    //after extracting msg,make msg input empty again
    document.getElementById('msg').value='';

    
    // this block of code used to format time and date to append with message
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d=new Date();
    let timeString=timeFormat()+"   "+d.getDate()+" "+months[d.getMonth()];

    function timeFormat(){
        let hh=d.getHours();
        let mm=d.getMinutes();
        let a='am';
        if(hh==12&&mm>0)a='pm';
        if(hh>12)hh-=12,a='pm';
        

        return hh+":"+mm+" "+a;
    }



    
    // To add message to chat-messages
    let div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${devname}  <br><span>${timeString}</span></p>
    <p class="text"> 
        ${msgText}   
    </p>`;
    // and then append the created element
    document.querySelector('.chat-messages').appendChild(div);

    // and then again ,scroll page to bottom
    var objDiv = document.getElementById("message-collection");
    objDiv.scrollTop = objDiv.scrollHeight;


    // xml http request
    var xhr=new window.XMLHttpRequest();

    //to save this msg to database,send it to server side
    let msgObj=JSON.stringify({
        senderName:devname,
        sendingTime:timeString,
        senderMsg:msgText
    })

    //making post request to send body
    xhr.open('POST','/developer/addMsgToChat',true);
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
    xhr.send(msgObj);
    
}