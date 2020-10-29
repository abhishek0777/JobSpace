function sendMailToAll(){
    let postID=document.getElementById('jobName').value;
    let testlink=document.getElementById('test-link').value;
    let testinstructions=document.getElementById('test-instructions').value;

    let mailObj=JSON.stringify({
        postID:postID,
        testlink:testlink,
        testinstructions:testinstructions
    })


    var xhr=new window.XMLHttpRequest();

    //making post request to send body
    xhr.open('POST','/company/sendTestLink',true);
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
    xhr.send(mailObj);
}