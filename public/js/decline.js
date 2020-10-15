console.log("decline function works");

function declineFunction(jobName_email){

    var button=document.getElementById('decline/'+jobName_email);
    console.log(button.value);
    button.remove();

    //also collapse email id button
    var emailButton=document.getElementById('declineEmail/'+jobName_email);
    emailButton.remove();
    

    //   Make XML-http Request(xhr)
    var xhr=new window.XMLHttpRequest();
    xhr.open('GET','/company/declineRequest/'+jobName_email,true);
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
    xhr.send();
}