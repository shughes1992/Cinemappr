$(document).ready(function(){
    console.log("theater page linked")

    // TODO: write addGoogleMaps function

    $.ajax({
        url: "/location",
        method: "GET"
    }).then(response => {
        console.log(response)
        $("#zipcode").val(response.zipcode)
        $("#date").val(response.date)
        $("#radius").val(response.radius)
    })

    $.ajax({
        url: "/getData",
        method: "GET"
    }).then(response => {

        response1 = JSON.parse(response);

        console.log(response1);

        var uniqueTheatreArray = [];
        var displayObject = new Object();
        var theaterData = [];

        for (var i = 0; i < response1.length; i++) {

            var movieTitles = response1[i].title; // Get name of movie

            for (var j = 0; j < response1[i].showtimes.length; j++) {

                var listOfTheatreNames = response1[i].showtimes[j].theatre.name; // Get name of theater
                var times = JSON.stringify(response1[i].showtimes[j].dateTime.match(/T.*/)).slice(3, 8); // Get showtime
                var timesFormat = moment(times, "H:mm").format("LT"); // Parse showtime format

                // Push properties theater, showtime, and time to var theaterData
                theaterData.push({ theater: listOfTheatreNames, showtime: timesFormat, title: movieTitles });
            }
        }

        for (var key in theaterData) {
            if (displayObject[theaterData[key].names] === undefined && displayObject[theaterData[key].titles] === undefined) {
                displayObject[theaterData[key].names] = theaterData[key].names + theaterData[key].titles;
            }

        }

        console.log(theaterData);

        // TODO: call addGoogleMaps function, passing theaterData

        var holder = {};

        theaterData.forEach(function (element) {
            var identifier = element.theater;
            if (holder[identifier]) {
                holder[identifier] = element.theater;
            }
            else {
                holder[identifier] = element.theater;
            };
        });

        var theaterData2 = [];

        for (var identifier in holder) {
            theaterData2.push({ theater: holder[identifier] });
        }

        console.log(theaterData2);
        console.log(theaterData2.length)

        // parse_data("University Penn 6", theaterData)
        function loopThroughTheaters() {
            for (var i = 0; i < theaterData2.length; i++) {
                console.log(theaterData2[i].theater);
                parse_data(theaterData2[i].theater, theaterData);
            }
        }

        loopThroughTheaters();

        function parse_data(my_theater_name, theaterData) {
            console.log("Junk we start with:");
            console.log(theaterData);

            // Step 1: Build array of just movies/times at this theater
            var array_of_objects_at_my_theater = [];

            for (let i = 0; i < theaterData.length; i++) {
                if (theaterData[i]["theater"] === my_theater_name) {
                    array_of_objects_at_my_theater.push(theaterData[i]);
                }
            }
            console.log("Step 1: Build array of just movies/times at this theater");
            console.log(array_of_objects_at_my_theater);

            // Step 2: Build a list of movie names
            var array_of_movie_names = [];
            for (let i = 0; i < array_of_objects_at_my_theater.length; i++) {
                if (array_of_movie_names.indexOf(array_of_objects_at_my_theater[i].title) < 0) {
                    array_of_movie_names.push(array_of_objects_at_my_theater[i].title);

                }
            }

            console.log("Step 2: Build a list of movie names");
            console.log(array_of_movie_names);

            // Step 3: Create an array of objects for each movie playing at this theatre 
            var array_of_movies_at_this_theater_with_show_times = [];

            for (let i = 0; i < array_of_movie_names.length; i++) {
                var new_movie_object = {};
                new_movie_object.title = array_of_movie_names[i];
                new_movie_object.showtimes = [];
                array_of_movies_at_this_theater_with_show_times.push(new_movie_object);
            }

            console.log("Step 3: Create an array of objects for each movie playing at this theatre");
            console.log(array_of_movies_at_this_theater_with_show_times);

            // Step 4: Populate showtimes into that data structure 
            for (let i = 0; i < array_of_objects_at_my_theater.length; i++) {
                // figure out which movie object to put the time in
                for (let j = 0; j < array_of_movies_at_this_theater_with_show_times.length; j++) {
                    if (array_of_objects_at_my_theater[i].title === array_of_movies_at_this_theater_with_show_times[j].title) {
                        array_of_movies_at_this_theater_with_show_times[j].showtimes.push(array_of_objects_at_my_theater[i].showtime);
                    }
                }
            }

            console.log("Step 4: Populate showtimes into that data structure ");
            console.log(array_of_movies_at_this_theater_with_show_times);

            // Step 5: Pack it into its own object why not
            var final_theater_object = {};
            final_theater_object.name = my_theater_name;
            final_theater_object.movies_with_times = array_of_movies_at_this_theater_with_show_times;

            console.log("Step 5: Pack it into its own object why not");
            console.log(final_theater_object);
            console.log(my_theater_name);

            var jumbotron = $("<div class='showtime-listings'>");
            $("#movies").append(jumbotron);
            jumbotron.append("<h3>" + my_theater_name);

            for (var k = 0; k < final_theater_object.movies_with_times.length; k++) {
                console.log(final_theater_object.movies_with_times[k].title);
                jumbotron.append("<h4>" + final_theater_object.movies_with_times[k].title)

                for (var l = 0; l < final_theater_object.movies_with_times[k].showtimes.length; l++) {
                    console.log(final_theater_object.movies_with_times[k].showtimes[l]);
                    jumbotron.append("<p id='showtimes'>" + final_theater_object.movies_with_times[k].showtimes[l]);
                }
            }
        }
    })


    // This still needs to be refactored to make the API call from the server

    $("#start").on("click", function (event) {
        console.log("I got clicked");
        // event.preventDefault();
        var zip1 = $("#zipcode").val();
        var date = $("#date").val();
        console.log(zip1);
        console.log(date);

        var queryUrl1 = 'http://data.tmsapi.com/v1.1/movies/showings?startDate=' + date + '&zip=' + zip1 + '&api_key=8dyfezutfxys5435q4ehcqkp';
        $.ajax({
            method: "GET",
            url: queryUrl1
        }).then(function (response1) {

            var uniqueTheatreArray = [];
            var displayObject = new Object();
            var theaterData = [];

            for (var i = 0; i < response1.length; i++) {

                var movieTitles = response1[i].title; // Get name of movie

                for (var j = 0; j < response1[i].showtimes.length; j++) {

                    var listOfTheatreNames = response1[i].showtimes[j].theatre.name; // Get name of theater
                    var times = JSON.stringify(response1[i].showtimes[j].dateTime.match(/T.*/)).slice(3, 8); // Get showtime
                    var timesFormat = moment(times, "H:mm").format("LT"); // Parse showtime format

                    // Push properties theater, showtime, and time to var theaterData
                    theaterData.push({ theater: listOfTheatreNames, showtime: timesFormat, title: movieTitles });
                }
            }

            for (var key in theaterData) {
                if (displayObject[theaterData[key].names] === undefined && displayObject[theaterData[key].titles] === undefined) {
                    displayObject[theaterData[key].names] = theaterData[key].names + theaterData[key].titles;
                }

            }

            console.log(theaterData);

            var holder = {};

            theaterData.forEach(function (element) {
                var identifier = element.theater;
                if (holder[identifier]) {
                    holder[identifier] = element.theater;
                }
                else {
                    holder[identifier] = element.theater;
                };
            });

            var theaterData2 = [];

            for (var identifier in holder) {
                theaterData2.push({ theater: holder[identifier] });
            }

            console.log(theaterData2);
            console.log(theaterData2.length)

            // parse_data("University Penn 6", theaterData)
            function loopThroughTheaters() {
                for (var i = 0; i < theaterData2.length; i++) {
                    console.log(theaterData2[i].theater);
                    parse_data(theaterData2[i].theater, theaterData);
                }
            }

            loopThroughTheaters();

            function parse_data(my_theater_name, theaterData) {
                console.log("Junk we start with:");
                console.log(theaterData);

                // Step 1: Build array of just movies/times at this theater
                var array_of_objects_at_my_theater = [];

                for (let i = 0; i < theaterData.length; i++) {
                    if (theaterData[i]["theater"] === my_theater_name) {
                        array_of_objects_at_my_theater.push(theaterData[i]);
                    }
                }
                console.log("Step 1: Build array of just movies/times at this theater");
                console.log(array_of_objects_at_my_theater);

                // Step 2: Build a list of movie names
                var array_of_movie_names = [];
                for (let i = 0; i < array_of_objects_at_my_theater.length; i++) {
                    if (array_of_movie_names.indexOf(array_of_objects_at_my_theater[i].title) < 0) {
                        array_of_movie_names.push(array_of_objects_at_my_theater[i].title);

                    }
                }

                console.log("Step 2: Build a list of movie names");
                console.log(array_of_movie_names);

                // Step 3: Create an array of objects for each movie playing at this theatre 
                var array_of_movies_at_this_theater_with_show_times = [];

                for (let i = 0; i < array_of_movie_names.length; i++) {
                    var new_movie_object = {};
                    new_movie_object.title = array_of_movie_names[i];
                    new_movie_object.showtimes = [];
                    array_of_movies_at_this_theater_with_show_times.push(new_movie_object);
                }

                console.log("Step 3: Create an array of objects for each movie playing at this theatre");
                console.log(array_of_movies_at_this_theater_with_show_times);

                // Step 4: Populate showtimes into that data structure 
                for (let i = 0; i < array_of_objects_at_my_theater.length; i++) {
                    // figure out which movie object to put the time in
                    for (let j = 0; j < array_of_movies_at_this_theater_with_show_times.length; j++) {
                        if (array_of_objects_at_my_theater[i].title === array_of_movies_at_this_theater_with_show_times[j].title) {
                            array_of_movies_at_this_theater_with_show_times[j].showtimes.push(array_of_objects_at_my_theater[i].showtime);
                        }
                    }
                }

                console.log("Step 4: Populate showtimes into that data structure ");
                console.log(array_of_movies_at_this_theater_with_show_times);

                // Step 5: Pack it into its own object why not
                var final_theater_object = {};
                final_theater_object.name = my_theater_name;
                final_theater_object.movies_with_times = array_of_movies_at_this_theater_with_show_times;

                console.log("Step 5: Pack it into its own object why not");
                console.log(final_theater_object);
                console.log(my_theater_name);

                var jumbotron = $("<div class='showtime-listings'>");
                $("#movies").append(jumbotron);
                jumbotron.append("<h3>" + my_theater_name);

                for (var k = 0; k < final_theater_object.movies_with_times.length; k++) {
                    console.log(final_theater_object.movies_with_times[k].title);
                    jumbotron.append("<h4>" + final_theater_object.movies_with_times[k].title)

                    for (var l = 0; l < final_theater_object.movies_with_times[k].showtimes.length; l++) {
                        console.log(final_theater_object.movies_with_times[k].showtimes[l]);
                        jumbotron.append("<p id='showtimes'>" + final_theater_object.movies_with_times[k].showtimes[l]);
                    }
                }


            }

        }) // End of Gracenote AJAX call
    }) // End of Click event

})