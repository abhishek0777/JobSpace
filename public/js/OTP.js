console.log('client side code is running');

function sendOTPFunction(userType){
    const email=document.getElementById('email').value;
    console.log(email);

    //-----------------XML http request------------------------

      //(so without rendering data will be feeded)

    //   refer to google for this regex 
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
      {
        document.getElementById('getOTPButton').setAttribute("data-target","#OTPModal");
        var xhr=new window.XMLHttpRequest();
      
        xhr.open('POST','/'+userType+'/OTP/'+email,true);
        xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
        xhr.send();
      }
      else{
          document.getElementById('getOTPButton').setAttribute("data-target","#OTPErrorModal");
      }
      
    
      

}