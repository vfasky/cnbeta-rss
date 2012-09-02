var util    = require('../../util');
var models  = require('../models');
var Article = models.Article;
var Type    = models.Type;
var request = require('request');

exports = module.exports = function(req, res, config){
    var self = this;

    this.execute = function(){
        var id = req.params.id;
        Article.findOne({article_id : id},function(err,article){
            if(null==article){
                return res.end('');
            }

            Type.findOne({type_id : article.type_id},function(err,type){
                if(null==type){
                    return res.end('');
                }
                self.render('show.html',{
                    article : article ,
                    type : type
                });

                if(self.context.get.uc=='true'){
                    request('http://' + req.headers.host + '/getComments-' + id.toString()
                        ,function(error, response, body){
                    });
                }
            });
        })
    };
}