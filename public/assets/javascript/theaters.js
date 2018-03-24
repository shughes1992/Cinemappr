$(document).ready(function(){
    console.log("theater page linked")

    $.ajax({
        url: "/location",
        method: "GET"
    }).then(response => {
        console.log(response)
        $("#location").val(response.location)
        $("#date").val(response.date)
        $("#radius").val(response.radius)
    })
})