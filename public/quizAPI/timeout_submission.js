
// it will auto submit the quiz after 5 minute

var auto_refresh = setInterval(function() { submitform(); }, 300000);

// Form submit function.
function submitform(){
    alert('OOPS! Time-out..Form is auto submitting.');
    document.getElementById("quizForm").submit();
    
}