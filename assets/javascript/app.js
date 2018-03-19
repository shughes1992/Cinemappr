$(document).ready(function () {

    console.log("Hello");

    // Hide results on load
    // $(".results").hide();

    // Click "Search" button
    $("#search").on("click", function () {
        $(".welcome").hide();
        $(".welcome::after").hide();
        $(".landing-page").hide();
        $(".results").fadeIn();
    });

});