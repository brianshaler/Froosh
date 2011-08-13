/**
 *  Restaurant schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Restaurant = new Schema({

	  // Single default property
	  name:{type: String, required: true}
	  
});

mongoose.model('Restaurant', Restaurant);
