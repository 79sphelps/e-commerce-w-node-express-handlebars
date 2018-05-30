var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var schema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

schema.methods.encryptPassword = function(password) {
    // use 5 rounds of salt creation here
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
}

schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', schema);
module.exports = User;