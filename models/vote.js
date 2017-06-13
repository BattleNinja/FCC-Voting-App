var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var optionSchema = require('./option')

var voteSchema = new Schema({
    title: String,
    options: [optionSchema]
});

var Vote = module.exports = mongoose.model('vote', voteSchema);

module.exports.renderTitles = function(callback) {
    Vote.find({}, callback);
}
module.exports.findVoteById = function(id, callback) {
    Vote.findOne({
        _id: id
    }, callback);
}

module.exports.findNumber = function(id,callback) {
    Vote.findOne({
        'options._id': id
    }, function(err, vote) {
      if (err) throw err;
      console.log(vote.options);

        for (var i = 0; i < vote.options.length; i++) {
            if (vote.options[i]._id.toString() === id.toString()) {
                vote.options[i].number+=1;
                console.log(vote.options[i].number);
              vote.save(callback);
            }
        }
    });
}
