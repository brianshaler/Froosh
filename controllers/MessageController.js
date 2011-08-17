
/**
 *  Messages Controller
 *  Created by create-controller script @ Sat Aug 13 2011 20:01:25 GMT+0000 (UTC)
 **/
 var mongoose = require('mongoose'),	
	Message = mongoose.model('Message'),
	Special = mongoose.model('Special'),
	Restaurant = mongoose.model('Restaurant'),
	pager = require('../utils/pager.js'),
	ViewTemplatePath = 'messages',
	TwilioClient = require('twilio').Client,
    Twiml = require('twilio').Twiml;

module.exports = {
    
    test: function (req, res, next) {
        res.send("TEST");
    },

    incoming: function(req, res, next) {
        var from = "";
        var special_text = "";
	    var currentTime = Math.floor((new Date()).getTime()/1000);
        
        try {
            from = req.body.From;
            special_text = req.body.Body;
        } catch (e) { }
        if (from == "") {
            try {
                from = req.query["From"];
                special_text = req.query["Body"];
            } catch (e) { }
        }
        
        if (from.length > 2 && from.substring(0, 2) == "+1") {
            from = from.substring(2);
        }
        
        var twiml_start = '<?xml version="1.0" encoding="UTF-8" ?>\n<Response>';
        var twiml_end = '</Response>';
        var debug = "";
        debug += "<from>"+from+"</from>";
        
        Restaurant.find({cell_phone: from}).limit(1).find(function (err, restaurants) {
            debug += "<restaurants>"+restaurants.length+"</restaurants>";
            if (restaurants.length > 0) {
                restaurants.forEach(function (restaurant) {
                    //debug += "<existingSpecials>"+restaurants.specials.length+"</existingSpecials>";
                    var special = new Special({
                        created_at: new Date(),
                        text: special_text
                    });
                    if (!restaurant.specials) {
                        restaurant.specials = [special];
                    } else {
                        restaurant.specials.push(special);
                    }
                    debug += "<special>"+special_text+"</special>";
                    restaurant.save();
                    return res.send(twiml_start /* + "<Sms>" + restaurant.latest_deal + "</Sms>" /**/ + debug + twiml_end, {'Content-Type':'text/xml'}, 200);
                });
            } else {
                //res.send(twiml_start + "I don't recognize this number... ("+from+")" + twiml_end, {'Content-Type':'text/xml'}, 200);
                res.send(twiml_start+debug+twiml_end, {'Content-Type':'text/xml'}, 200);
                return;
            }
        });
    },
    
	/**
	 * Index action, returns a list either via the views/messages/index.html view or via json
	 * Default mapping to GET '/messages'
	 * For JSON use '/messages.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Message.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/messages');    	
	                  
			  Message.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, messages) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(messages.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{messages:messages,pagerHtml:pagerHtml});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/messages/show.html view or via json
	 * Default mapping to GET '/message/:id'
	 * For JSON use '/message/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Message.findById(req.params.id, function(err, message) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(message.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{message:message});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/messages/edit.html view no JSON view.
	 * Default mapping to GET '/message/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Message.findById(req.params.id, function(err, message) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{message:message});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/message/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    Message.findById(req.params.id, function(err, message) {
	        
	    	if (!message) return next(err);
	        
	    	message.name = req.body.message.name;
	    	
	        message.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update message: ' + err);
	          	  res.redirect('/messages');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(message.toObject());
	              break;
	            default:
	              req.flash('info', 'Message updated');
	              res.redirect('/message/' + req.params.id);
	          }
	        });
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/messages', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var message = new Message(req.body.message);
		  
		  message.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create message: ' + err);
	      	  res.redirect('/messages');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(message.toObject());
		        break;
	
		      default:
		    	  req.flash('info','Message created');
		      	  res.redirect('/message/' + message.id);
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/message/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  Message.findById(req.params.id, function(err, message) {
		        
		    	if (!message) { 
	  	    	  	req.flash('error','Unable to locate the message to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	message.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the message!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','Message deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};