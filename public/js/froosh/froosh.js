
function requestLocation () {
    navigator.geolocation.getCurrentPosition(gotLocation, deniedLocation, { enableHighAccuracy: true });
}

function gotLocation (pos) {
    $("#lat").html(pos.coords.latitude);
    $("#lng").html(pos.coords.longitude);
}

function deniedLocation () {
    
}