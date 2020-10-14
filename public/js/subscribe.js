console.log('Client-side code running');


function subscribeFunction(companyEmail){
  var button=document.getElementById('subscribe');
  button.innerHTML='Subscribed';
  button.classList.remove('btn-primary');
  button.classList.add('btn-danger');

  
  console.log(companyEmail);
 
//   Make XML-http Request(xhr)
  var xhr=new window.XMLHttpRequest();
  xhr.open('POST','/developer/subscribed/'+companyEmail,true);
  xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
  xhr.send();
}