//Global variable
var results_array = [];

//Click Handlers
$(document).ready(function(){
    //$('#search-params').val('');
    
    $('#search-button').click(function(e) {
        $('.list-group').empty();

        var params = $("#search-params").val();
        var url = "https://www.boardgamegeek.com/xmlapi2/search?query=" + params
        var proxyURL = "https://cors-anywhere.herokuapp.com/"

        $.ajax({
            url: proxyURL + url

        })
        .then(function(data){
            // Create an array with all the matching titles
            var data_names = data.getElementsByTagName('name');
            var data_gameIDs = data.getElementsByTagName('item');
            
            var maxNumber = 20;

            for(i=0; i<maxNumber; i++){
                var gameName = data_names[i].getAttribute('value');
                var gameID = data_gameIDs[i].getAttribute('id')
                results_array.push({"gameName":gameName, "gameID":gameID});
            }

            var idList = "";
            results_array.forEach(function(element){
                if(element !== results_array[results_array.length-1]){
                    idList += element.gameID + ',';
                } else {
                    idList += element.gameID;
                }
                
            });
                
            console.log(idList);
            
            url = "https://www.boardgamegeek.com/xmlapi2/thing?id=" + idList


            console.log(proxyURL);
            $.ajax({
                url: proxyURL + url
            })
            .done(function(data) {
                //console.log(data.activeElement.children);
                // for(i=0; i<maxNumber; i++){
                    
                // }
                console.log(data);
                // var maxNumber = 5;
                // for(i=0; i<data_names.length; i++){
                    
                //     var newItem = $('<li>').addClass('list-group-item').text(gameName);
                //     $('.list-group').append(newItem);
                // }
                
            })
        
             

            
        })
        
    })
})
