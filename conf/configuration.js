var sys = require('sys'),
    conf = require('node-config');

/**
 * Default configuration manager
 * Inject app and express reference
 */
module.exports = function(app,express) {
	
	function onConfig (err) {
	    if (err) { sys.log("Config failed to load.."); }
	    
    }
	
	// DEVELOPMENT
	app.configure('development', function() {
    	conf.initConfig(onConfig, 'settings.dev');
        require("./development.js")(app,express);
	});

	// TEST
	app.configure('test', function() {
    	conf.initConfig(onConfig, 'settings.test');
        require("./test.js")(app,express);
	});
	
	// PRODUCTION
	app.configure('production', function() {
    	conf.initConfig(onConfig, 'settings.prod');
		require("./production.js")(app,express);
	});		

}
