
/**
 *  Specials Controller
 *  Created by create-controller script @ Tue Aug 16 2011 08:04:49 GMT+0000 (UTC)
 **/
 var mongoose = require('mongoose'),	
	Special = mongoose.model('Special'),
	pager = require('../utils/pager.js'),
	ViewTemplatePath = 'specials';

module.exports = {

	/**
	 * Index action, returns a list either via the views/specials/index.html view or via json
	 * Default mapping to GET '/specials'
	 * For JSON use '/specials.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Special.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/specials');    	
	                  
			  Special.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, specials) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(specials.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{specials:specials,pagerHtml:pagerHtml});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/specials/show.html view or via json
	 * Default mapping to GET '/special/:id'
	 * For JSON use '/special/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Special.findById(req.params.id, function(err, special) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(special.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{special:special});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/specials/edit.html view no JSON view.
	 * Default mapping to GET '/special/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Special.findById(req.params.id, function(err, special) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{special:special});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/special/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    Special.findById(req.params.id, function(err, special) {
	        
	    	if (!special) return next(err);
	        
	    	special.name = req.body.special.name;
	    	
	        special.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update special: ' + err);
	          	  res.redirect('/specials');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(special.toObject());
	              break;
	            default:
	              req.flash('info', 'Special updated');
	              res.redirect('/special/' + req.params.id);
	          }
	        });
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/specials', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var special = new Special(req.body.special);
		  
		  special.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create special: ' + err);
	      	  res.redirect('/specials');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(special.toObject());
		        break;
	
		      default:
		    	  req.flash('info','Special created');
		      	  res.redirect('/special/' + special.id);
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/special/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  Special.findById(req.params.id, function(err, special) {
		        
		    	if (!special) { 
	  	    	  	req.flash('error','Unable to locate the special to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	special.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the special!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','Special deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};