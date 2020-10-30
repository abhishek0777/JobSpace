//This is client side code ,works when company session is running,
// when company checks the stats of their posted job post,they can 'decline'
// the request of developers,if company didn't like his portfolio

console.log("decline function works");

function declineFunction(jobName_email){

    var button=document.getElementById('decline/'+jobName_email);
    
    //declining developers request => removing request from web page

    //(i) Declining button
    button.remove();

    //also collapse email id button
    //(ii) Portfolio link
    var emailButton=document.getElementById('declineEmail/'+jobName_email);
    emailButton.remove();

    var statsButton=document.getElementById('developerStats/'+jobName_email);
    statsButton.remove();

    var scoreButton=document.getElementById('priorityScore/'+jobName_email);
    scoreButton.remove();
    

    //----------------Make XML-http Request(xhr)-----------------------

    //this XHR request sends the PostID and email of developers
    // to routes to update the appliedDev array
    var xhr=new window.XMLHttpRequest();

    xhr.open('GET','/company/declineRequest/'+jobName_email,true);
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
    xhr.send();

}