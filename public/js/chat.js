
console.log('chat script working');

var objDiv = document.getElementById("message-collection");
objDiv.scrollTop = objDiv.scrollHeight;

function appendNewMsg(devname){
    let msgText=document.getElementById('msg').value;
    document.getElementById('msg').value='';

    console.log(msgText);
    
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d=new Date();
    let timeString=timeFormat()+"   "+d.getDate()+", "+months[d.getMonth()];

    function timeFormat(){
        let hh=d.getHours();
        let mm=d.getMinutes();
        let a='am';
        if(hh>12)hh-=12,a='pm';

        return hh+":"+mm+" "+a;
    }
    
    let div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${devname}  <br><span>${timeString}</span></p>
    <p class="text"> 
        ${msgText}   
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

    var objDiv = document.getElementById("message-collection");
    objDiv.scrollTop = objDiv.scrollHeight;


    // xml http request
    var xhr=new window.XMLHttpRequest();

    let msgObj=JSON.stringify({
        senderName:devname,
        sendingTime:timeString,
        senderMsg:msgText
    })

    xhr.open('POST','/developer/addMsgToChat',true);
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
    xhr.send(msgObj);
    
}