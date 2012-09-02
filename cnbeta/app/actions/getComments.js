var task    = require('../task');
var util    = require('../../util');
var get     = require('get');
var models  = require('../models');
var Article = models.Article;

exports = module.exports = function(req, res, config){
	var self = this;

	this.formatHtml = function(content){
		var dlList = content.split('</dl>');
		var comments = []
		util.each(dlList,function(v){
			try{
				comments.push({
					title : v.split('</span></dt>')[0].split('<span>')[1].trim() ,
					body : self.unicodeHack(v.split('<dd class="re_detail">')[1].split('</dd>')[0].trim())
				});
				
			}catch(e){
				return true;
			}
		});
		if(comments.length > 0){
			Article.findOne({article_id : req.params.id} , function(err,article){
				if(null!=article){
					article.comments = comments;
					article.save();
				}
			});
		}
	};

	this.unicodeHack = function(str){
		return unescape(str.replace(/\\/g, "%"));
	};

    this.execute = function(){
    	var id = req.params.id;
    	var target = 'http://www.cnbeta.com/comment/g_content/'+ id.toString() +'.html';
    	res.end('');
  
    	get(target).asString(function(err, data) {
		    self.formatHtml(data);
		});
    };
}