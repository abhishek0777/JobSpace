console.log('Client-side code running');


function applyFunction(PostID){
  var button=document.getElementById('applyButton');
  button.innerHTML='Applied';
  button.classList.remove('btn-primary');
  button.classList.add('btn-danger');
  console.log(PostID);
 
  var xhr=new window.XMLHttpRequest();
  xhr.open('POST','/developer/clicked/'+PostID,true);
  xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
  xhr.send();
}
