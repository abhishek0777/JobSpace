console.log('Client-side code running');


function applyFunction(PostID){
  console.log(PostID);
 
  var xhr=new window.XMLHttpRequest();
  xhr.open('POST','/developer/clicked/'+PostID,true);
  xhr.setRequestHeader('Content-Type','text');
  xhr.send();
}
