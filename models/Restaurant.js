/**
 *  Restaurant schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Restaurant = new Schema({

    // Single default property
    name:{type: String, required: true},
    phone: {type:String},
    address: {type:String},
    latitude: {type:Number},
    longitude: {type:Number}
    
});

mongoose.model('Restaurant', Restaurant);
