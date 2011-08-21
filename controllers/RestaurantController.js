
/**
 *  Restaurants Controller
 *  Created by create-controller script @ Sat Aug 13 2011 19:49:39 GMT+0000 (UTC)
 **/
 var mongoose = require('mongoose'),	
	Special = mongoose.model('Special'),
	Restaurant = mongoose.model('Restaurant'),
	pager = require('../utils/pager.js'),
	ViewTemplatePath = 'restaurants',
	SimpleGeo = require('simplegeo-client').SimpleGeo,
	markdown = require("github-flavored-markdown");

var sg_key = 'HMGpuKcpPdSr8GY4fHfhPK83nZuS48Uj',
    sg_secret = 'yxVG4ZzV4y7BMgDCukD6fSeN2gFdgMnF';

module.exports = {

	/**
	 * Index action, returns a list either via the views/restaurants/index.html view or via json
	 * Default mapping to GET '/restaurants'
	 * For JSON use '/restaurants.json'
	 **/
	index: function(req, res, next) {
        res.redirect("/restaurants/search");
        return;
    },
    
	manage: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 50;
	      var total = 0;
	      
	      Restaurant.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/restaurants/manage');    	
	                  
			  Restaurant.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, restaurants) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(restaurants.map(function(u) {
			              return u.toPublic();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{restaurants:restaurants,pagerHtml:pagerHtml});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	search: function (req, res, next) {
	    
	    var lat = null;
	    var lng = null;
	    var results = [];
	    var currentTime = Math.floor((new Date()).getTime()/1000);
        var zip = "";
        
        if (req.body && req.body.zip) {
            zip = req.body.zip;
        }
	    if (req.query) {
	        if (req.query["lat"]) {
	            lat = parseFloat(req.query["lat"]);
            }
	        if (req.query["lng"]) {
	            lng = parseFloat(req.query["lng"]);
            }
            if (zip == "" && req.query["zip"]) {
                zip = req.query["zip"];
            }
        }
	    
	    if (!lat || !lng) {
            switch (req.params.format) {
                case 'json':
                    return res.send({message: "No latitutde or longitude?", debug: req.query});
                    break;
                default:
                    return res.render(ViewTemplatePath + "/search", {results: results, zip: zip});
            }
        } else {
            
            function nearbyCallback (err, results) {
                if (err) {
                    switch (req.params.format) {
                        case 'json':
                            return res.send({message: err, debug: req.query});
                            break;
                        default:
                            return res.render("error",{message:err});
                    }
                }
                switch (req.params.format) {
                    case 'json':
                        return res.send(results.map(function (r) {
                            return r.toPublic();
                        }));
                        break;
                    default:
                        return res.render(ViewTemplatePath + "/search",{results:results, zip: zip, lat: lat, lng: lng});
                }
            }
            
            getNearby(lat, lng, nearbyCallback);
            
        }
    },
    
    zip: function (req, res, next) {
        
        var zip = req.body.zip;
        var lng = null;
        var lat = null;
        
        if (zip && zip.length >= 5) {
            var sg = new SimpleGeo(sg_key,sg_secret);
        
            sg.getContextByAddress(zip, checkLatLong);
            
	        function checkLatLong (err, data) {
	            
	            if (err) {
	                return res.render("error",{message:err});
                }
	            if (data && data.query && data.query.latitude && data.query.longitude) {
	                lat = data.query.latitude;
	                lng = data.query.longitude;
                }
                if (!lat || !lng) {
                    res.render("error",{message:"Unable to geolocate that ZIP code.."});
                } else {
                    res.redirect("/restaurants/search?zip="+zip+"&lat="+lat+"&lng="+lng);
                    return;
                }
            }
            
        } else {
            res.render("error",{message:"No zip?"});
        }
        
    },
	
	nearby: function (req, res, next) {
	    var lat = null;
	    var lng = null;
	    var results = [];
	    var currentTime = Math.floor((new Date()).getTime()/1000);
	    
	    if (req.query) {
	        if (req.query["lat"]) {
	            lat = parseFloat(req.query["lat"]);
            }
	        if (req.query["lng"]) {
	            lng = parseFloat(req.query["lng"]);
            }
        }
        
	    if (!lat || !lng) {
	        
            switch (req.params.format) {
                case 'json':
                    return res.send({message: "No latitutde or longitude?", debug: req.query});
                    break;
                default:
                    res.render("error",{message:"No latitude or longitude?"});
            }
		    
        } else {
            
            function nearbyCallback (err, results) {
                if (err) {
                    switch (req.params.format) {
                        case 'json':
                            return res.send({message: err, debug: req.query});
                            break;
                        default:
                            res.render("error",{message:err});
                    }
                }
                switch (req.params.format) {
                    case 'json':
                        return res.send(results.map(function (r) {
                            return r.toPublic();
                        }));
                        break;
                    default:
                        res.render(ViewTemplatePath + "/results",{results:results});
                }
            }
            
            getNearby(lat, lng, nearbyCallback);

        }
    },
	
	/**
	 * Show action, returns shows a single item via views/restaurants/show.html view or via json
	 * Default mapping to GET '/restaurant/:id'
	 * For JSON use '/restaurant/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Restaurant.findById(req.params.id, function(err, restaurant) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(restaurant.toPublic());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{restaurant:restaurant});
		      }
		      
		  });
		      
	},
	
	/**
	 * Show action, returns shows a single item via views/restaurants/show.html view or via json
	 * Default mapping to GET '/restaurant/:id'
	 * For JSON use '/restaurant/:id.json'
	 **/	
	view: function(req, res, next) {	  		  
			
		  Restaurant.findById(req.params.id, function(err, restaurant) {
			  if (err) return res.send(err);
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(restaurant.toPublic());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/view",{restaurant:restaurant, markdown: markdown});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/restaurants/edit.html view no JSON view.
	 * Default mapping to GET '/restaurant/:id/edit'
	 **/  	  
	edit: function(req, res, next, me) {
	    
	    if (!me.isUser()) {
	        return res.render("503");
        }
        Restaurant.findById(req.params.id, function(err, restaurant) {
            if(err) return next(err);

            if (me.isModerator() || restaurant.isOwnedBy(me)) {
                res.render(ViewTemplatePath + "/edit",{restaurant:restaurant});
            } else {
                return res.send(me._id+" != "+restaurant.owner);
                res.render("503");
            }
        });
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/restaurant/:id', no GET mapping	 
	 **/  
	update: function(req, res, next, me){
	    
	    if (!me.isUser()) {
	        return res.render("503");
        }
        
	    // updatable: Fields users can POST and overwrite.
	    // Any other fields in the schema are programmatically set.
	    var updatable = ["name", "cell_phone", "address", "restaurant_phone", "description", "web_site", 
	            "twitter", "facebook", "yelp"];
	    var updatableObj = {};
	    updatable.forEach(function (field) {
	        updatableObj[field] = 1;
        });
	    
	    Restaurant.findById(req.params.id, function(err, restaurant) {
	        
	    	if (err || !restaurant) return next(err);
	        
	        if (!me.isModerator() && restaurant.isOwnedBy(me)) {
                return res.render("503");
            }
	        
	        if (restaurant.address != req.body.restaurant.address) {
	            if (req.body.restaurant.address == "") {
	                checkLatLong(null, {});
                } else {
                    var sg = new SimpleGeo(sg_key,sg_secret);
                
                    sg.getContextByAddress(req.body.restaurant.address, checkLatLong);
                }
            } else {
                checkLatLong(null, {});
            }
	        
	        function checkLatLong (err, data) {
	            var lng = restaurant.loc[0];
	            var lat = restaurant.loc[1];
	            
	            if (data && data.query && data.query.latitude && data.query.longitude) {
	                lat = data.query.latitude;
	                lng = data.query.longitude;
                }
                
                for (var k in req.body.restaurant) {
                    if (k != "loc" && k != "most_recent_special" && k != "specials" && updatableObj[k] === 1) {
                        restaurant[k] = req.body.restaurant[k];
                    }
                }
                
                restaurant.loc = [lng, lat];
    	    	restaurant.setup = req.body.restaurant.setup;

    	        restaurant.save(function(err) {

    	    	  if (err) {
    	    		  console.log(err);
    	        	  req.flash('error','Could not update restaurant: ' + err);
    	          	  res.redirect('/restaurants/edit/' + req.params.id);
    	          	  return;
    	    	  }

    	          switch (req.params.format) {
    	            case 'json':
    	              res.send(restaurant.toPublic());
    	              break;
    	            default:
    	              req.flash('info', 'Restaurant updated');
    	              res.redirect('/restaurant/edit/' + req.params.id);
    	          }
    	        });
            }
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/restaurants', no GET mapping	 
	 **/  
	create: function(req, res, next) {
        
        var restaurant = new Restaurant(req.body.restaurant);
        
        if (restaurant.address == "") {
            checkLatLong(null, {});
        } else {
            var sg = new SimpleGeo(sg_key,sg_secret);
            
            sg.getContextByAddress(restaurant.address, checkLatLong);
        }
	        
        function checkLatLong (err, data) {
            var lng = restaurant.loc[0] || 0;
            var lat = restaurant.loc[1] || 0;

            if (data && data.query && data.query.latitude && data.query.longitude) {
                lat = data.query.latitude;
                lng = data.query.longitude;
            }

            restaurant.loc = [lng, lat];
            restaurant.setup = true;

            restaurant.save(function(err) {

                if (err) {
                    req.flash('error','Could not create restaurant: ' + err);
                    res.redirect('/restaurants');
                    return;
                }

                switch (req.params.format) {
                    case 'json':
                        res.send(restaurant.toPublic());
                        break;

                    default:
                        req.flash('info','Restaurant created');
                        res.redirect('/restaurant/show/' + restaurant.id);
                }
            });	  

        }
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/restaurant/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  Restaurant.findById(req.params.id, function(err, restaurant) {
		        
		    	if (!restaurant) { 
	  	    	  	req.flash('error','Unable to locate the restaurant to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	restaurant.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the restaurant!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','Restaurant deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};

function getNearby (lat, lng, callback) {
    var results = [];
    var currentTime = Math.floor((new Date()).getTime()/1000);
    
    function addResults (restaurants, until) {
        restaurants.forEach(function (restaurant) {
            var found = false;
            results.forEach(function (r) {
                if (r.id == restaurant.id) {
                    found = true;
                }
            });
            if (found == false && (!until || results.length < until)) {
                results.push(restaurant);
            }
        });
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

    /** Converts numeric degrees to radians */
    if (typeof(Number.prototype.toRad) === "undefined") {
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      }
    }
    
    function finalize () {
        results.forEach(function (result) {
            result.distance = Math.floor(geoDistance({lat: lat, lng: lng}, {lat: result.loc[1], lng: result.loc[0]})*10)/10;
        });
        
        return callback(null, results);
    }
    
    
    Restaurant.find({loc: {"$near": [lng, lat], "$maxDistance": 500/3959}, "specials.created_at": {"$gte": new Date((new Date()).getTime()-86400*7*1000)}}, function (err, restaurants) {
        if (err) {
            return callback(err);
        }
        addResults(restaurants);
        
        Restaurant.find({loc: {"$near": [lng, lat], "$maxDistance": 100/3959}}, function (err, restaurants) {
	        if (err) {
                return callback(err);
            }
            
            addResults(restaurants);
            
            if (results.length < 10) {
                Restaurant.find({loc: {"$near": [lng, lat], "$maxDistance": 5000/3959}}, function (err, restaurants) {
        	        if (err) {
                        return callback(err);
                    }

                    addResults(restaurants, 10);
                    
                    return finalize();
                });
                
            } else {
                return finalize();
            }
	    });
    });
}