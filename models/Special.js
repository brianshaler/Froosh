/**
 *  Special schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Special = new Schema({

	  // Single default property
	  name:{type: String, required: true}
	  
});

mongoose.model('Special', Special);
