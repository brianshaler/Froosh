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
    deal_posted: {type:Number},
    address: {type:String},
    loc: {
        lng: Number,
        lat: Number},
    setup: {type: Boolean, default: false}
    
});

Restaurant.methods.toPublic = function () {
    var obj = {};
    obj.id = this._id;
    obj.name = this.name;
    obj.address = this.address;
    obj.latest_deal = this.latest_deal;
    obj.loc = this.loc;
    return obj;
}

mongoose.model('Restaurant', Restaurant);
