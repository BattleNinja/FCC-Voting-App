var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


var UserSchema = new Schema({
    name: String,
    username: String,
    email: {
        type: String,
    },
    password: String
});

var User = module.exports = mongoose.model("User", UserSchema);
var User = module.exports = mongoose.model("User", UserSchema);

module.exports.createUser = function(user, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            user.save(callback);
        });
    });
}

module.exports.comparePassword = function(password, hash,callback) {
  bcrypt.compare(password, hash, function(err, isMatch) {
    callback(err,isMatch);
});
}
