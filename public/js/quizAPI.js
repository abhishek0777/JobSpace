// --- This is api based code to generate random question on each load---
console.log('quiz client side code running')

window.onload=sendApiRequest

//an async function to fetch data from 'trivia api'
async function sendApiRequest(){

    // first fetch response from api
    let response=await fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple')
    console.log(response);

    //then convert this json format
    let data=await response.json();
    console.log(data);

    // To show data to screen
    useApiData(data);
}


function useApiData(data){

    // loop for 10 items,we have total 10 questions
    for(let i=0;i<10;i++){
       
        //print question
        document.getElementById('question'+i).innerHTML=`Question ${i+1} : ${data.results[i].question}`

        //out of 4 options,make random one a correct option
        let random=Math.floor(4*Math.random());

        //set correct option randomly to avoid any abusice
        document.getElementById(i+'option'+random).innerHTML=`${data.results[i].correct_answer}`
        
        console.log(i+'option'+random);
        

        // also make its value true
        document.getElementById('ID'+i+'option'+random).value='true'

        // set incorrect options
        let k=0;
        for(let j=0;j<4;j++){
            if(j!=random){
                document.getElementById(i+'option'+j).innerHTML=`${data.results[i].incorrect_answers[k++]}`
                document.getElementById('ID'+i+'option'+j).value='false';
            }
        }
    }
 
}