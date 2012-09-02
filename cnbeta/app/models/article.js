var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  article_id: { type: Number ,index: true },
  type_id: { type: Number },
  title: { type: String ,index: true},
  content : { type: String },
  date : {type: String},
  comments: [{ body: String, title: String }]
});

ArticleSchema.methods.typeTitle = function (callback) {
  return this.model('Type').find({ type_id: this.type_id }, callback);
};


mongoose.model('Article', ArticleSchema);