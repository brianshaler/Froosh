/**
 *  User schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var User = new Schema({

    // Single default property
    name:{type: String, required: true},
    password: {type:String},
    zip: {type: String}
    
});

mongoose.model('User', User);
