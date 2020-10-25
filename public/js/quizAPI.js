console.log('quiz client side code running')
window.onload=sendApiRequest

//an async function to fetch data from trivia api
async function sendApiRequest(){
    let response=await fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple')
    console.log(response);
    let data=await response.json();
    console.log(data);
    useApiData(data);
}


function useApiData(data){
    for(let i=0;i<10;i++){
       
        document.getElementById('question'+i).innerHTML=`Question ${i+1} : ${data.results[i].question}`
        let random=Math.floor(4*Math.random());
        
        console.log(i+'option'+random);
        //set correct option randomly to avoid any abusice
        document.getElementById(i+'option'+random).innerHTML=`${data.results[i].correct_answer}`

        // also make its value true
        document.getElementById('ID'+i+'option'+random).value='true'
        let k=0;
        for(let j=0;j<4;j++){
            if(j!=random){
                document.getElementById(i+'option'+j).innerHTML=`${data.results[i].incorrect_answers[k++]}`
                document.getElementById('ID'+i+'option'+j).value='false';
            }
        }
    }
 
}