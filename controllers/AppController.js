var fs = require('fs')
	, inflection = require('../lib/inflection');

module.exports = function(app) {
	
	// app.get("/favicon.ico", function() {}); // Required if you delete the favicon.ico from public
	
	// Plural
	app.get("/:controller.:format?", router);				// Index
	app.get("/:controller/:from-:to.:format?", router);		// Index
	app.get("/:controller", router);				        // Index
	app.get("/", router);				        // Index
	
	// Plural Create & Delete
	app.post("/:controller", router);			// Create
	app.del("/:controller", router);   			// Delete all
	
	// Singular - different variable to clarify routing
	app.get("/:controller/:action/:id.:format?", router);  	// To support controller/index	
	app.get("/:controller/:action/:id", router);		// Show edit
	app.post("/:controller/:action", router);			// Create
	app.put("/:controller/:id", router);				// Update
	app.del("/:controller/:id", router);				// Delete
		
	app.get("/:controller/:action", router);		// Action?
	app.get("/:controller/:action.:format?", router);  	// Action with format
}

///
function router(req, res, next) {
		
	var controller = req.params.controller ? req.params.controller : '';
	var action = req.params.action ? req.params.action : '';
	var id = req.params.id ? req.params.id : '';
	var method = req.method.toLowerCase();
	var fn = 'index';
	
	var mobile = false;
	
	var ua = req.headers['user-agent'];
    
    if (/mobile/i.test(ua) || 
            /like Mac OS X/.test(ua) || 
            /Android/.test(ua) || 
            /webOS\//.test(ua)) {
        mobile = true;
    }
	
	if (req.query && req.session && req.query["mobile"]) {
	    req.session.mobile = req.query["mobile"];
    }
    if (req.session && req.session.mobile) {
        mobile = req.session.mobile == "true" ? true : false;
    }
    res._locals = res._locals || {};
    res._locals.mobile = mobile;
	
	// Default route
	if(controller.length == 0) {
		index(req,res,next);
		return;
	}		
	
	// Determine the function to call based on controller / model and method
	if(id.length == 0) {
		
		// We are plural
		switch(method) {
			case 'get':
				if(action.length > 0) {
					fn = action;
				} else {
					fn = 'index';
				}
				break;
			case 'post':
				if(action.length > 0) {
					fn = action;
				} else {
					fn = 'create';
				}
				break;
			case 'delete':
				fn = 'destroyAll';
				break;		
		}		
		
	} else {
		
		// Controller name is now singular, need to switch it back 
		//controller = controller.pluralize();
		
		switch(method) {
			case 'get':
				if(action.length > 0) {
					fn = action;
				} else {
					fn = 'index';
				}
				break;
			case 'put':
				fn = 'update';
				break;
			case 'delete':
				fn = 'destroy';
				break;		
		}		
		
	}
	
	controllerLibrary = null;
	try {
		var controllerLibrary = require('./' + controller.capitalize() + 'Controller');			
	} catch (e) {  }
	// Just in case it's plural...
	if (!controllerLibrary && controller.charAt(controller.length-1) == "s") {
		try {
			var controllerLibrary = require('./' + controller.capitalize().substring(0, controller.length-1) + 'Controller');			
		} catch (e) {  }
	}
	
	if(controllerLibrary && typeof controllerLibrary[fn] === 'function') {
		controllerLibrary[fn](req,res,next);		
	} else {
		res.render('404');
	}
	  	
};


/**
 * Default Application index - shows a list of the controllers.
 * Redirect here if you prefer another controller to be your index.
 * @param req
 * @param res
 */
function index(req, res, next) {
	/**
	 * If you want to redirect to another controller, uncomment
	 */
	// res.redirect('/controllerName');
	
	var controllers = [];
	
	  fs.readdir(__dirname + '/', function(err, files){
	    
		if (err) throw err;
	    
		files.forEach(function(file){
			if(file != "AppController.js") {
				controllers.push(file.replace('Controller.js','').toLowerCase());
			}
	    });
	    
	    if (res._locals && res._locals.mobile == true) {
		    res.render('app/mobile-index',{controllers:controllers});
        } else {
		    res.render('app/index',{controllers:controllers});
	    }
	  
	  });	
	
	  	
};