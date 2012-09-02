var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
  date : { type: Number , default : new Date().getTime()},
  path: { type: String , index: true },
  img: { type: Buffer  }
});

mongoose.model('Image', ImageSchema);