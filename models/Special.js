/**
 *  Special schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//var Restaurant = mongoose.model("Restaurant");

var Special = new Schema({

	  //restaurant: Restaurant,
	  text: {type: String, required: true},
	  created_at: {type: Date, default: new Date(0)} // If not set, this should help it get picked up by a scheduled task
	  
});

mongoose.model('Special', Special);

exports.Special = Special;