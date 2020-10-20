//This is a client side code for applying to jobs



console.log('Client-side code running');

//when apply button is triggered
function postDoneFunction(PostID){

      var post=document.getElementById('postDone/'+PostID);

      alert("Do you want to send notification to developers")
      post.remove()
      

      //_id of post to which developer applied
      //This is a primary key
      console.log(PostID);

    
      //-----------------XML http request------------------------

      //(so without rendering data will be feeded)
      var xhr=new window.XMLHttpRequest();
      
      xhr.open('POST','/company/postDone/'+PostID,true);
      xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
      xhr.send();

}
