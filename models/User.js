/**
 *  User schema
 *  Created by create-model script  
 **/
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    conf = require('node-config')
    crypto = require('crypto');

var SUPERADMIN = "superadmin";
var ADMIN = "admin";
var MODERATOR = "moderator";
var USER = "user";
var BANNED = "banned";

var User = new Schema({

    // Single default property
    user_name:{type: String, required: true, index: true},
    password: {type:String},
    display_name:{type: String},
    email: {type: String},
    zip: {type: String},
    status: {type: String},
    last_activity: {type: Date, default: Date.now},
    session_key: {type: String, index: true},
    session_start: {type: Date},
    created_at: {type: Date, default: Date.now}
    
});

User.methods.registerUser = function () {
    this.status = USER;
    this.display_name = this.user_name;
}

User.methods.setPassword = function (p, autoSave) {
    this.password = this.hash(p);
    if (autoSave === true) {
        this.save();
    }
}

User.methods.getDisplayName = function () {
    if (this.display_name && this.display_name.length > 0) {
        return this.display_name;
    } else {
        return this.user_name;
    }
}

User.methods.authenticate = function (p) {
    var u = this.user_name;
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
    key = this.hash(this.user_name+this.password+Date.now());
    //key = "/KEY-"+this.user_name+Date.now()+"-KEY/";
    return key;
}

User.methods.validateSessionToken = function (key, token) {
    var validated = false;
    console.error("Trying: key: "+key+"; token: "+token);
    console.error("Against: key: "+this.session_key+"; token: "+this.generateToken());
    if (this.session_key && this.session_key != "" && key && token && key != "" && token != "") {
        if (key === this.session_key && this.generateToken() === token) {
            validated = true;
        }
    }
    console.error("Validation: "+this.user_name+": "+(validated ? "true" : "false"));
    
    return validated;
}

User.methods.generateToken = function () {
    var token = "";
    token = this.hash(this.user_name+"|"+this.session_key);
    //token = "/TOKEN-"+this.user_name+"-"+this.session_key+"-TOKEN/";
    return token;
}

User.methods.isSuperAdmin = function () {
    return this.status === SUPERADMIN ? true : false;
}

User.methods.isAdmin = function () {
    return (this.status === ADMIN || 
            this.status === SUPERADMIN) ? true : false;
}

User.methods.isModerator = function () {
    return (this.status === MODERATOR || 
            this.status === ADMIN || 
            this.status === SUPERADMIN) ? true : false;
}

User.methods.isUser = function () {
    return (this.status === USER || 
            this.status === MODERATOR || 
            this.status === ADMIN || 
            this.status === SUPERADMIN) ? true : false;
}

User.methods.hash = function (str) {
    var hashed;
    var h = crypto.createHash('sha1');
    h.update(str);
    hashed = h.digest('hex');
    //hashed = str + conf.passphrase;
    //hashed = "HASH" + str;
    return hashed;
}

mongoose.model('User', User);

exports.User = User;