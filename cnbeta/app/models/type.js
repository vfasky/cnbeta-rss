var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TypeSchema = new Schema({
  type_id : { type: Number ,index: true},
  title: { type: String },
  img_url: { type: String , default : '' },
  article_count: { type: Number, default: 0 }
});

mongoose.model('Type', TypeSchema);