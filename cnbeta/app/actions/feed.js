
var util    = require('../../util');
var models  = require('../models');
var Article = models.Article;

exports = module.exports = function(req, res, config){
    var self = this;

    res.writeHead(200, {'Content-Type': 'text/xml; charset=utf-8'});

    this.execute = function(){
        
        var query = Article.find();
        query.limit(60).
              sort({ article_id: 'desc' }).
              exec(function(err,articles){
                 if(null != err){
                    return res.end(err);
                 }
                 util.each(articles,function(v,k){
                    v.link = 'http://' + req.headers.host + '/' + 'show-' + v.article_id;
                    articles[k] = v;
                 });
                 
                 self.render('feed.xml',{
                    articles : articles ,
                    host : 'http://' + req.headers.host + '/',
                    pubDate : new Date().toUTCString()
                 })
              });
       
    };
}