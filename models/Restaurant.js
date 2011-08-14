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
    loc: {
        lat: Number,
        lng: Number},
    setup: {type: Boolean, default: false}
    
});

Object.prototype.restaurantToPublic = function () {
    var obj = {};
    obj.name = this.name;
    obj.address = this.address;
    obj.latest_deal = this.latest_deal;
    obj.loc = this.loc;
    return obj;
}

mongoose.model('Restaurant', Restaurant);
