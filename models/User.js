/**
 *  User schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    conf = require('node-config');

var SUPERADMIN = "superadmin";
var ADMIN = "admin";
var USER = "user";
var BANNED = "banned";

var User = new Schema({

    // Single default property
    user_name:{type: String, required: true, index: true},
    password: {type:String},
    zip: {type: String},
    status: {type: String},
    last_activity: {type: Date, default: Date.now},
    session_key: {type: String},
    session_start: {type: Date},
    created_at: {type: Date, default: Date.now}
    
});

User.methods.authenticate = function (password) {
    var u = this.user_name;
    var p = password;
    var h = this.password;
    var auth = false;
    
    if (this.hash(p) === h) {
        auth = true;
    }
    
    return auth;
}

User.methods.getSessionKey = function () {
    if (this.session_key && this.session_key.length > 0) {
        return this.session_key;
    } else {
        this.session_key = this.generateSessionKey();
        this.save();
        return this.session_key;
    }
}

User.methods.generateSessionKey = function () {
    var key = "";
    key = "/KEY-"+this.user_name+"-KEY/";
    return key;
}

User.methods.validate = function (key, token) {
    var validated = false;
    if (this.session_key && this.session_key != "" && key && token && key != "" && token != "") {
        if (key === this.session_key && this.generateToken() === token) {
            validated = true;
        }
    }
    return validated;
}

User.methods.generateToken = function () {
    var token = "";
    token = "/TOKEN-"+this.user_name+"-"+this.session_key+"-TOKEN/";
    return token;
}

User.methods.isSuperAdmin = function () {
    return this.status === SUPERADMIN ? true : false;
}

User.methods.isAdmin = function () {
    return this.status === ADMIN || this.status === SUPERADMIN ? true : false;
}

User.methods.isUser = function () {
    return this.status === USER || this.status === ADMIN || this.status === SUPERADMIN ? true : false;
}

User.methods.hash = function (str) {
    var hashed;
    //hashed = str + conf.passphrase;
    hashed = "HASH" + str;
    return hashed;
}

mongoose.model('User', User);

exports.User = User;