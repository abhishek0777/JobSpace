//This is a client side code,works when a developer subscribe a company 
// for its latest jobs' notifications

console.log('Client-side code running');

//On click this function triggered
function subscribeFunction(companyEmail){
  
      var button=document.getElementById('subscribe/'+companyEmail);

      //Changes the 'Subscribe' to 'Subscribed'
      // and its color
      button.innerHTML='Subscribed';
      button.classList.remove('btn-primary');
      button.classList.add('btn-danger');

      
    
      //---------------Make XML-http Request(xhr)-------------------

      //THis request send the Company email to route to subscribe specific company
      
      var xhr=new window.XMLHttpRequest();

      xhr.open('GET','/developer/subscribed/'+companyEmail,true);
      xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
      xhr.send();

}