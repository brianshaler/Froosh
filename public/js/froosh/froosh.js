
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

var jsonResult;
function gotNearby (data) {
    jsonResult = data;
    $("#results").html("<ul id=\"resultList\"></ul>");
    data.forEach(function (restaurant) {
        var li = $('<li class="resultItem" id="'+restaurant.id+'">');
        var link = $('<a href="#">');
        var divMessage = $('<div class="resultSpecial">');
        divMessage.html(restaurant.latest_deal);
        var divDetails = $('<div class="resultDetails">');
        var divRestaurant = $('<div class="resultRestaurant">');
        divRestaurant.html(restaurant.name);
        divDetails.append(divRestaurant);
        if (lat && lng && restaurant.loc.lat && restaurant.loc.lng) {
            var divDistance = $('<div class="resultDistance">');
            var dist = geoDistance(restaurant.loc, {lat: lat, lng: lng});
            dist = (Math.floor(dist*10)/10) + "m";
            divDistance.html(dist);
            divDetails.append(divDistance);
        }
        
        if (restaurant.latest_deal.length > 0) {
            li.append(divMessage);
        }
        li.append(link);
        link.append(divDetails);
        $("#resultList").append(li);
    });
    $(".resultItem").click(viewRestaurant);
    $("a", $(".resultItem")).click(viewRestaurant);
    showView("results");
}

function viewRestaurant (e) {
    console.log(e.target);
    console.log($(e.target).attr("id"));
    e.preventDefault();
    
    var holder = null;
    $(".resultItem").each(function (i, item) {
        if ($(item).has(e.target).length > 0) {
            holder = item;
        }
    });
    if (holder) {
        console.log("View restaurant: "+$(holder).attr("id"));
    }
}

function deniedLocation () {
    // :-3(
    showView("requiresLocation");
}

function geoDistance (loc1, loc2) {
    var lat1 = loc1.lat;
    var lon1 = loc1.lng;
    var lat2 = loc2.lat;
    var lon2 = loc2.lng;
    
    var R = 6371; // km
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    
    return d / 1.609344;
}

$(document).ready(function () {
   $(".findStuff").click(function (e) {
       e.preventDefault();
       requestLocation();
       return false;
   });
    
});