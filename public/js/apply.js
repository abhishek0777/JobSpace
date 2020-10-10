console.log('Client-side code running');


function applyFunction(){
  var button=document.getElementById('applyButton')
  var postID=document.getElementById('applyButton').value;
  console.log(postID);
  button.addEventListener('click',function(e){
    fetch('/developer/clicked/'+postID,{method:'POST'})
    .then((response)=>{
      if(response.ok){
        console.log('click was recorded');
        return;
      }
      throw new Error('request failed');
    })
    .catch((error)=>{
      console.log(error);
    })
  })

}
