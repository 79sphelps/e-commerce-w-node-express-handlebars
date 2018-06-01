const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const schema = new Schema({
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

const User = mongoose.model('User', schema);
module.exports = User;