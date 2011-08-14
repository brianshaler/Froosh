
var lat = null;
var lng = null;

function requestLocation () {
    navigator.geolocation.getCurrentPosition(gotLocation, deniedLocation, { enableHighAccuracy: true });
}

function gotLocation (pos) {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    
    $("#lat").html(pos.coords.latitude);
    $("#lng").html(pos.coords.longitude);
}

function deniedLocation () {
    // :-3(
}