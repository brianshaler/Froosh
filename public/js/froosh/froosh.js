
var lat = null;
var lng = null;

function showView (view) {
    $(".autohide").hide();
    $("#"+view).show();
}

function requestLocation () {
    navigator.geolocation.getCurrentPosition(gotLocation, deniedLocation, { enableHighAccuracy: true });
}

function gotLocation (pos) {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    
    $("#lat").html(pos.coords.latitude);
    $("#lng").html(pos.coords.longitude);
    
    showView("askForLocation");
    getNearby(lat, lng);
}

function getNearby (lat, lng) {
    $.ajax({
        url: "http://froo.sh/restaurant/nearby.json",
        dataType: "json",
        data: {lat: lat, lng: lng},
        success: gotNearby
    });
}

function gotNearby (data) {
    $("#results").html("<ul id=\"resultList\"></ul>");
    data.forEach(function (restaurant) {
        var li = $("<li>");
        li.html(restaurant.name);
        $("#resultList").appendChild(li);
    });
    var li = $("<li>");
    li.html("last...");
    $("#resultList").appendChild(li);
}

function deniedLocation () {
    // :-3(
    showView("requiresLocation");
}

$(document).ready(function () {
   $(".findStuff").click(function (e) {
       e.preventDefault();
       showView("loading");
       requestLocation();
       return false;
   });
    
});