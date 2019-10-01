var queryHomeSticker = "https://api.giphy.com/v1/stickers/search?";
var queryHomeGIF = "https://api.giphy.com/v1/gifs?";
var clicksGiven = [];

    function addGifButton(){
        event.preventDefault();

        // This line of code will grab the input from the textbox
        var title = $("#gif-input").val().trim();

        var buttonDiv = $("<button>");
        buttonDiv.addClass("populateViewAreaGif");
        buttonDiv.text(title);
        buttonDiv.attr("gif-category", title);
        $("#buttons-view").append(buttonDiv);

        // Select the params from list
        params = {q:title, limit:24, api_key:"il8dzFtHjMofE66vf9iQ2anujWKuCQK7"};
    }

    function displayGifOnViewArea(){
        //Empties the viewing area
        $("#gif-view").empty();

        // Retrieves the name of gif
        var title = $(this).attr("gif-category");

        // Select the params from list
        params = {q:title, limit:24, api_key:"il8dzFtHjMofE66vf9iQ2anujWKuCQK7"};

        
        // Insert here the param logic to extract the queryURL
        queryURL = queryHomeSticker + jQuery.param(params);

        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            console.log(response);

            var seq = 0;
            var gifRowDiv = $("<div>");
                gifRowDiv.addClass("row");
            
            while (clicksGiven.length > 0) {
                clicksGiven.pop();
            }

            for(i in response.data){
                var gifColDiv = $("<div>");
                gifColDiv.addClass("col-4 single-gif-contain");

                gifColDiv.attr("gif-id", response.data[i].id);
                gifColDiv.attr("seq",seq);
                clicksGiven.push(0);

                var gifUrl = response.data[i].images["original_still"].url;
                var newGifImg = $("<img src= " + gifUrl +  ">");
                newGifImg.addClass("col-10");
                newGifImg.attr("width","400px");
                newGifImg.attr("height","400px");
                
                gifColDiv.append(newGifImg);
                gifRowDiv.append(gifColDiv);
                seq++;
            }

            $("#gif-view").append(gifRowDiv);
        });

    };

    function renderMotionGIF(){
        event.preventDefault();
        //Empties the viewing area
        $(this).empty();

        // Retrieves the name of gif
        var idGif = $(this).attr("gif-id");
        var seq = $(this).attr("seq");
        clicksGiven[seq]++;

        console.log(clicksGiven[seq]);

        if((clicksGiven[seq] % 2) == 0){
            // Select the params from list
            params = {ids:idGif, api_key:"il8dzFtHjMofE66vf9iQ2anujWKuCQK7"};

            // Insert here the param logic to extract the queryURL
            queryURL = queryHomeGIF + jQuery.param(params);

            $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
                console.log(response);
                    var gifUrl = response.data[0].images["fixed_height_still"].url;
                    var newGifDiv = $("<img src= " + gifUrl +  ">");
                    newGifDiv.addClass("col-4 single-gif-contain");
                    newGifDiv.attr("width","100%");
                    newGifDiv.attr("height","100%");
                    var a = $("div[seq=" + seq + "]");
                    a.append(newGifDiv);
                });
        }else{
            //Empties the viewing area
            // Retrieves the name of gif
             // Select the params from list
             params = {ids:idGif, api_key:"il8dzFtHjMofE66vf9iQ2anujWKuCQK7"};

            // Insert here the param logic to extract the queryURL
            queryURL = queryHomeGIF + jQuery.param(params);

            $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
                console.log(response);
                    var gifUrl = response.data[0].images["fixed_height"].url;
                    var newGifDiv = $("<img src= " + gifUrl +  ">");
                    newGifDiv.addClass("col-4 single-gif-contain");
                    newGifDiv.attr("width","100%");
                    newGifDiv.attr("height","100%");
                    var a = $("div[seq=" + seq + "]");
                    a.append(newGifDiv);
            });
        }
    };

    $(document).on("click", "#add-gif", addGifButton);
    $(document).on("click", ".populateViewAreaGif", displayGifOnViewArea);
    $(document).on("click", ".single-gif-contain", renderMotionGIF);