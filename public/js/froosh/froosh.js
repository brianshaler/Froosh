
var lat = null;
var lng = null;

function showView (view) {
    $(".autohide").hide();
    $("#"+view).show();
}

function requestLocation () {
    showView("askForLocation");
    navigator.geolocation.getCurrentPosition(gotLocation, deniedLocation, { enableHighAccuracy: true });
}

function gotLocation (pos) {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    
    $("#lat").html(pos.coords.latitude);
    $("#lng").html(pos.coords.longitude);
    
    showView("loading");
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
        $("#resultList").append(li);
    });
    var li = $("<li>");
    li.html("last...");
    $("#resultList").append(li);
    showView("results");
}

function deniedLocation () {
    // :-3(
    showView("requiresLocation");
}

$(document).ready(function () {
   $(".findStuff").click(function (e) {
       e.preventDefault();
       requestLocation();
       return false;
   });
    
});