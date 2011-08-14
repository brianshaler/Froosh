
/**
 *  Restaurants Controller
 *  Created by create-controller script @ Sat Aug 13 2011 19:49:39 GMT+0000 (UTC)
 **/
 var mongoose = require('mongoose'),	
	Restaurant = mongoose.model('Restaurant'),
	pager = require('../utils/pager.js'),
	ViewTemplatePath = 'restaurants',
	SimpleGeo = require('simplegeo').SimpleGeo;

module.exports = {

	/**
	 * Index action, returns a list either via the views/restaurants/index.html view or via json
	 * Default mapping to GET '/restaurants'
	 * For JSON use '/restaurants.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Restaurant.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/restaurants');    	
	                  
			  Restaurant.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, restaurants) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(restaurants.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{restaurants:restaurants,pagerHtml:pagerHtml});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	nearby: function (req, res, next) {
	    var lat = null;
	    var lng = null;
	    
	    if (req.query) {
	        if (req.query["lat"]) {
	            lat = parseFloat(req.query["lat"]);
            }
	        if (req.query["lng"]) {
	            lng = parseFloat(req.query["lng"]);
            }
        }
        
        if (req.params.format != "json") {
            return res.send({message: "Sorry, only JSON supported."});
        }
	    
	    if (!lat || !lng) {
            return res.send({message: "No latitutde or longitude?", debug: req.query});
        } else {
    	    Restaurant.find({loc: {"$near": [lat, lng], "$maxDistance": 1000}, setup: true}, function (err, restaurants) {
    	        if (err) {
    	            return res.send(err);
	            }
                if (restaurants.length > 0) {
    	            res.send(restaurants.map(function(u) {
    	                return u.toPublic();
                    }));
                } else {
                    res.send({message: "No results"});
                }
            });
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
		          res.send(restaurant.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{restaurant:restaurant});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/restaurants/edit.html view no JSON view.
	 * Default mapping to GET '/restaurant/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Restaurant.findById(req.params.id, function(err, restaurant) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{restaurant:restaurant});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/restaurant/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    Restaurant.findById(req.params.id, function(err, restaurant) {
	        
	    	if (!restaurant) return next(err);
	        
	        if (restaurant.address != req.body.restaurant.address) {
	            if (req.body.restaurant.address == "") {
	                checkLatLong(null, {});
                } else {
                    var sg = new SimpleGeo('HMGpuKcpPdSr8GY4fHfhPK83nZuS48Uj','yxVG4ZzV4y7BMgDCukD6fSeN2gFdgMnF');
                
                    sg.getContextByAddress(req.body.restaurant.address, checkLatLong);
                }
            } else {
                checkLatLong(null, {});
            }
	        
	        function checkLatLong (err, data) {
	            if (data && data.query && data.query.latitude && data.query.longitude) {
	                lat = data.query.latitude;
	                lng = data.query.longtiude;
                }
                
    	    	restaurant.name = req.body.restaurant.name;
    	    	restaurant.phone = req.body.restaurant.phone;
    	    	restaurant.latest_deal = req.body.restaurant.latest_deal;
    	    	restaurant.address = req.body.restaurant.address;
    	    	restaurant.loc.lng = req.body.restaurant.loc.lng;
    	    	restaurant.loc.lat = req.body.restaurant.loc.lat;
    	    	restaurant.setup = req.body.restaurant.setup;

    	        restaurant.save(function(err) {

    	    	  if (err) {
    	    		  console.log(err);
    	        	  req.flash('error','Could not update restaurant: ' + err);
    	          	  res.redirect('/restaurants');
    	          	  return;
    	    	  }

    	          switch (req.params.format) {
    	            case 'json':
    	              res.send(restaurant.toObject());
    	              break;
    	            default:
    	              req.flash('info', 'Restaurant updated');
    	              res.redirect('/restaurant/show/' + req.params.id);
    	          }
    	        });
            }
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/restaurants', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var restaurant = new Restaurant(req.body.restaurant);
		  
		  restaurant.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create restaurant: ' + err);
	      	  res.redirect('/restaurants');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(restaurant.toObject());
		        break;
	
		      default:
		    	  req.flash('info','Restaurant created');
		      	  res.redirect('/restaurant/show/' + restaurant.id);
			 }
		  });	  
		  
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