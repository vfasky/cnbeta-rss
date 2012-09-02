var mongoose = require('mongoose');
var config = require('../../config');
  
mongoose.connect(config.get('db'), function (err) {
  if (err) {
    console.error('connect to %s error: ', config.get('db'), err.message);
  }
});

require('./type')
require('./article');
require('./image');

exports.Type = mongoose.model('Type');
exports.Article = mongoose.model('Article');
exports.Image = mongoose.model('Image');