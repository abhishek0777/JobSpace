//This is a client side code for applying to jobs

//On click to apply button,back-end functioning starts from here,
//it sends the GET request to route to find and update the JobPost->appliedDev array in mongoDB collection

console.log('Client-side code running');

//when apply button is triggered
function applyFunction(PostID){

      var button=document.getElementById('applyButton/'+PostID);

      //Changes the green color to red
      //and Apply to applied,so that user get a message 
      //that his request has been sent
      button.innerHTML='Applied';
      button.classList.remove('btn-primary');
      button.classList.add('btn-danger');

      //_id of post to which developer applied
      //This is a primary key
      console.log(PostID);

    
      //-----------------XML http request------------------------

      //(so without rendering data will be feeded)
      var xhr=new window.XMLHttpRequest();
      
      xhr.open('GET','/developer/clicked/'+PostID,true);
      xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
      xhr.send();

}
