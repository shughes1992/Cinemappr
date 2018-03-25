$(document).ready(function () {

    console.log("I got linked!");

    //looping through multiple background images function
    $(function () {
        var images = ['reel.jpg', 'popcorn.jpg', 'ticket.jpg', 'reel2.jpg'];
        $('.welcome').css({ 'background-image': 'url(assets/images/homepage-images/' + images[Math.floor(Math.random() * images.length)] + ')' });

        console.log("testing")
    });

})