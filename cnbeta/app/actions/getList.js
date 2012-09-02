var task    = require('../task');
var request = require('request');
var util    = require('../../util');
var Article = require('../models').Article;

exports = module.exports = function(req, res, config){
    
    this.execute = function(){
        var target = 'http://m.cnbeta.com/';
        res.end('');
        request(target,function(error, response, body){
            if (!error && response.statusCode == 200) {
                console.log('getList is run');
                var htmlTemp = body.split('marticle.php?sid=');
            
                if(htmlTemp.length > 10){
                    htmlTemp.splice(0,1);
                    htmlTemp = htmlTemp.reverse();
                    util.each(htmlTemp,function(v,k){
                        var aTemp = v.split('">');
                        if(aTemp.length > 1){
                            var id = aTemp[0];
                            Article.findOne({article_id:id}, 
                              function (err, article) {
                                if(null == article){
                                    task.add({
                                        url : 'http://' + req.headers.host + '/getArticle-' + id.toString() ,
                                        time : 2
                                    });
                                }
                            });   
                        }
                    });
                }
            }
        });
    };
};