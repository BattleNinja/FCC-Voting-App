var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionSchema = new Schema({
    option: String,
    number: Number
});

var Option = mongoose.model('options', optionSchema);
module.exports = optionSchema;
