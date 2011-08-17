/**
 *  Restaurant schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    tmp = require('../models/Special.js'), // Huh? I have to manually pre-load this other model??
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.model("Special", tmp.Special);
var Special = mongoose.model("Special").Special;

var Restaurant = new Schema({

    name: {type: String, required: true},
    cell_phone: {type:String, default: ""},
    address: {type: String, default: ""},
    restaurant_phone: {type:String, default: ""},
    description: {type: String, default: ""},
    web_site: {type: String, default: ""},
    twitter: {type: String, default: ""},
    facebook: {type: String, default: ""},
    yelp: {type: String, default: ""},
    specials: [Special],
    loc: [Number],
    setup: {type: Boolean, default: false}
    
});

Restaurant.methods.toPublic = function () {
    var obj = {};
    obj.id = this._id;
    obj.name = this.name;
    obj.address = this.address;
    obj.description = this.description || "";
    obj.restaurant_phone = this.restaurant_phone || "";
    obj.web_site = this.web_site || "";
    obj.twitter = this.twitter || "";
    obj.facebook = this.facebook || "";
    obj.yelp = this.yelp || "";
    obj.loc = this.loc;
    obj.loc.lng = this.loc[0];
    obj.loc.lat = this.loc[1];
    obj.specials = this.specials.toObject();
    return obj;
}

Restaurant.methods.getLatestSpecial = function () {
    if (this.specials && this.specials[0]) {
        return this.specials[this.specials.length-1];
    }
    return false;
}

mongoose.model('Restaurant', Restaurant);

exports.Restaurant = Restaurant;