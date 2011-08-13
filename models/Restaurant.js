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
    latest_deal: {type:String},
    address: {type:String},
    location: {type: Object},
    setup: {type: Boolean}
    
});

mongoose.model('Restaurant', Restaurant);
