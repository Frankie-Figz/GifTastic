var queryHomeSticker = "https://api.giphy.com/v1/stickers/search?";
var queryHomeGIF = "https://api.giphy.com/v1/gifs?";
var clicksGiven = [];

    function addGifButton(){
        event.preventDefault();
        // This line of code will grab the input from the textbox
        var title = $("#gif-input").val().trim();
        // Create a new button element and give it a class that will be shared by all buttons
        var buttonDiv = $("<button>");
        buttonDiv.addClass("populateViewAreaGif");
        buttonDiv.text(title);
        buttonDiv.attr("gif-category", title);
        $("#buttons-view").append(buttonDiv);

    }

    function displayGifOnViewArea(){
        //Empties the viewing area
        $("#gif-view").empty();

        // Retrieves the name of gif
        var title = $(this).attr("gif-category");
        
        // Params as objects in order to simplify the AJAX query call
        params = {q:title, limit:24, api_key:"il8dzFtHjMofE66vf9iQ2anujWKuCQK7"};
        
        // Insert here the param logic to extract the queryURL
        queryURL = queryHomeSticker + jQuery.param(params);

        // Call GIPHY API
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            console.log(response);

            var seq = 0;
            var gifRowDiv = $("<div>");
                gifRowDiv.addClass("row");
            
            // The clicksGiven array will be used to toggle animation of gifs. The below code takes care of cleaning array if not-empty
            while (clicksGiven.length > 0) {
                clicksGiven.pop();
            }

            // Iterate over the data of the response object (ie: the GIFS returned by the ajax call)
            for(i in response.data){

                // We will place the images on their on div
                var gifColDiv = $("<div>");

                // Their will be 3 divs per row. A class will be assign to later be used by the renderGifMethod
                gifColDiv.addClass("col-4 single-gif-contain");

                // We give it an ID that will later be used by the ajax call once it is time to render gif
                gifColDiv.attr("gif-id", response.data[i].id);
                gifColDiv.attr("seq",seq);
                clicksGiven.push(0);

                var gifUrl = response.data[i].images["fixed_height_still"].url;
                var newGifImg = $("<img src= " + gifUrl +  ">");
                newGifImg.attr("id-img",response.data[i].id);

                // Sets box dimensions to 400px by 400px
                newGifImg.attr("width","400px");
                newGifImg.attr("height","400px");
                
                // Create a div for the rating
                var ratingP = $("<p>");

                // Give the rating the text it will display. Uppercase is used for clarity
                ratingP.text("RATED : " + response.data[i].rating.toUpperCase());

                // Append rating and image div to container spanning 4 columns.
                gifColDiv.append(ratingP);
                gifColDiv.append(newGifImg);

                // Append the container div to the row
                gifRowDiv.append(gifColDiv);
                seq++;
            }

            // Append the row div to the class of gif-view (this class is explicitly declared on the html)
            $("#gif-view").append(gifRowDiv);
        });

    };

    // Function responsible for causing the still pictures to animate into a GIF.
    function renderMotionGIF(){
        event.preventDefault();
        //Empties the viewing area
        // $(this).empty();

        // Retrieves the name of gif
        var idGif = $(this).attr("gif-id");
        var seq = $(this).attr("seq");
        clicksGiven[seq]++;

        $( "img[id-img=" + idGif + "]").remove();

        // If the number of clicks given on the containing div is even then display still image. If it is odd then display GIF
        if((clicksGiven[seq] % 2) == 0){
            // Select the params from list
            params = {ids:idGif, api_key:"il8dzFtHjMofE66vf9iQ2anujWKuCQK7"};

            // Insert here the param logic to extract the queryURL
            queryURL = queryHomeGIF + jQuery.param(params);

            $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
                    var gifUrl = response.data[0].images["fixed_height_still"].url;
                    var newGifDiv = $("<img src= " + gifUrl +  ">");
                    newGifDiv.addClass("single-gif-contain");
                    newGifDiv.attr("width","100%");
                    newGifDiv.attr("id-img",idGif);
                    var a = $("div[seq=" + seq + "]");
                    a.append(newGifDiv);
                    newGifDiv.attr("height","400px");
                });
        }else{
             
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
                    newGifDiv.addClass("single-gif-contain");
                    newGifDiv.attr("width","100%");
                    newGifDiv.attr("id-img",idGif);
                    var a = $("div[seq=" + seq + "]");
                    a.append(newGifDiv);
                    newGifDiv.attr("height","400px");
            });
        }
    };
    
    // Assigns the buttons with their corresponding on-click function
    $(document).on("click", "#add-gif", addGifButton);
    $(document).on("click", ".populateViewAreaGif", displayGifOnViewArea);
    $(document).on("click", ".single-gif-contain", renderMotionGIF);