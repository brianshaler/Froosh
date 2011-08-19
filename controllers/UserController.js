
/**
 *  Users Controller
 *  Created by create-controller script @ Sat Aug 13 2011 19:49:58 GMT+0000 (UTC)
 **/
 var sys = require('sys'),
    mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	//cookie = require('cookie'),
	pager = require('../utils/pager.js'),
	ViewTemplatePath = 'users';

module.exports = {

	test: function (req, res, next) {
	    var str = "...<br />";
	    
        res.setHeader('Set-Cookie', "stuff=");
	    //req.cookies.test = "testing";
	    for (var k in req.cookies) {
	        str += "<strong>"+k+": </strong>" + req.cookies[k] + "<br /><br />\n";
        }
	    res.send(str);
    },
	
	/**
	 * Index action, returns a list either via the views/users/index.html view or via json
	 * Default mapping to GET '/users'
	 * For JSON use '/users.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      User.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/users');    	
	                  
			  User.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, users) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(users.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{users:users,pagerHtml:pagerHtml});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/users/show.html view or via json
	 * Default mapping to GET '/user/:id'
	 * For JSON use '/user/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  User.findById(req.params.id, function(err, user) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(user.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{user:user});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/users/edit.html view no JSON view.
	 * Default mapping to GET '/user/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  User.findById(req.params.id, function(err, user) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{user:user});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/user/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    User.findById(req.params.id, function(err, user) {
	        
	    	if (!user) return next(err);
	        
	    	user.name = req.body.user.name;
	    	
	        user.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update user: ' + err);
	          	  res.redirect('/users');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(user.toObject());
	              break;
	            default:
	              req.flash('info', 'User updated');
	              res.redirect('/user/' + req.params.id);
	          }
	        });
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/users', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var user = new User(req.body.user);
		  
		  user.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create user: ' + err);
	      	  res.redirect('/users');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(user.toObject());
		        break;
	
		      default:
		    	  req.flash('info','User created');
		      	  res.redirect('/user/' + user.id);
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/user/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  User.findById(req.params.id, function(err, user) {
		        
		    	if (!user) { 
	  	    	  	req.flash('error','Unable to locate the user to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	user.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the user!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','User deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	},
	
	register: function (req, res, next) {
	    
    },
	
	login: function (req, res, next) {
	    
	    var user_name = "";
	    var password = "";
	    var errors = [];
	    
	    console.error("Hello? "+req.body);
	    /**/
	    if (req.body && req.body.user_name && req.body.password && req.body.user_name != "" && req.body.password != "") {
	        console.error("POST?");
	        //user_name = req.body.user_name;
	        //password = req.body.password;
        } else
        if (req.query && req.query["user_name"] && req.query["password"]) {
	        console.error("GET?");
            user_name = req.query["user_name"];
            password = req.query["password"];
        }
        /**/
	    
	    if (user_name != "" && password != "") {
	        /**/
	        User.find({user_name: user_name}, function (err, users) {
	            if (err) {
	                errors.push("There was a system error, please try again later.");
	                return displayLoginPage();
	            }
	            
	            var me = new User;
	            
	            users.forEach(function (user) {
	                if (user.authenticate(password)) {
	                    me = user;
                    }
                });
                
                if (me.isUser()) {
                    me.last_activity = new Date();
                    me.save();
                    res.setHeader('Set-Cookie', "session_key="+me.getSessionKey());
                    res.setHeader('Set-Cookie', "session_token="+me.generateToken());
                    
                    return res.redirect("/user/status");
                } else {
                    errors.push("Invalid user name or password");
                    return displayLoginPage();
                }
            });
            return;
            /**/
        }
        displayLoginPage();
	    
	    function displayLoginPage () {
        	res.render(ViewTemplatePath + "/login", {user_name: user_name, errors: errors});
        }
    },
    
    status: function (req, res, next) {
        var errors = [];
        
        /**/
        for (var k in req.cookies) {
            errors.push("<strong>"+k+": </strong>"+req.cookies[k]);
        }
        /**/
        
    	res.render(ViewTemplatePath + "/login", {user_name: "", errors: errors});
    },
    
    
	check: function (req, res, next) {
	    
    },
	
	logout: function (req, res, next) {
	    
    }
};