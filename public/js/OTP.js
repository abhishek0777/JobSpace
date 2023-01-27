// ------This code is basically used to generate OTP for registering to 'JobSpace'-----

console.log('client side code is running');

// function triggered on click to 'verify' button

//usertype : developer or recruiter
function sendOTPFunction(userType){

    //extract email written by user
    const email=document.getElementById('email').value;
    

    //-----------------XML http request------------------------

      //(so without rendering data will be feeded)

      //refer to google for this regex 

      // this if condition used to check whether written email is valid or not
      //if valid
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
      {
        // This modal box to verify OTP
        document.getElementById('getOTPButton').setAttribute("data-target","#OTPModal");


        // -----Make xhr request to server to send OTP to this email----
        var xhr=new window.XMLHttpRequest();
      
        xhr.open('POST','/'+userType+'/OTP/'+email,true);
        xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
        xhr.send();
      }



      //if not valid,then show alert message
      else{
          document.getElementById('getOTPButton').setAttribute("data-target","#OTPErrorModal");
      }
      
       

}