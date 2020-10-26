console.log('search script is runnning');



$(function(){
    $('#searchName').autocomplete({
        source:function(req,res){

            // ajax code starts here
            $.ajax({
                url:'searchAutocomplete',
                dataType:'jsonp',
                type:'GET',
                data:req,
                success:function(data){
                    res(data);
                },
                error:function(err){
                    console.log(err.status);
                }
            })
        },
        minLength:1,
        select:function(event,ui){
            if(ui.item){
                $('#searchName').val(ui.item.label);
            }
        }

    })
})

function searchByCompanyName(){
    console.log('button clicked');
    let nameInput=document.getElementById('searchName').value;
    console.log(nameInput);
    
    var xhr=new window.XMLHttpRequest();
      
      xhr.open('GET','/developer/searchCompany/'+nameInput,true);
      xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
      xhr.send();

}


