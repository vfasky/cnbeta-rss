var task    = require('../task');
var util    = require('../../util');
var dict    = require('gbk-dict').init();
var get     = require('get');
var models  = require('../models');
var Type    = models.Type;
var Article = models.Article;

exports = module.exports = function(req, res, config){
    var self = this;

    //取文章类型
    this.getType = function(content,callback){
        try{
            var type    = content.split('</a>')[0];
            var url     = type.split('"')[1];
            var title   = type.split('alt="')[1].split('"')[0].trim();
            var type_id = url.replace('.htm','').replace('/topics/','');
            var img_url = type.split('src="')[1].split('"')[0].replace(' ','%2');

            Type.findOne({type_id:type_id},function(err,type){
                if(null == type){
                    var type = new Type({
                        type_id : type_id ,
                        title : title ,
                        img_url : img_url
                    });
                    type.save();
                }
                return callback(type);
            });
        }catch(e){
            return false;
        }
    };

    //将图片转换成代理方式
    this.proxyImg = function(content){
        var proxy = 'http://' + req.headers.host + '/imgProxy?i=';

        content = content.replace(new RegExp('src="pic',"gm"),
                                  'src="'+proxy+'http://cnbeta.com/pic');


        content = content.replace(new RegExp('src="http://img.cnbeta.com/',"gm"), 
                                  'src="'+proxy+'http://img.cnbeta.com/');
        return content;
    };

    //为视频添加连接,方便 IPAD 等用户
    this.formatVideo = function(content){
        var videoArr = content.split('<embed');
        if(videoArr.length>=2){
            util.each(videoArr,function(v,k){
                try{
                    var src = v.split('src="')[1].split('"')[0]; 

                    if(src.indexOf('http://player.youku.com/') == 0){
                        var id = src.split('sid/')[1].split('/')[0];
                        var temp = v.split('/>');
                        var begin = temp[0] + '/><a href="http://v.youku.com/v_show/id_'+id+'.html">(open Video)</a>';
                        temp.splice(0,1);
                        v = begin + temp.join('/>');
                    }

                    videoArr[k] = v;    
                }catch(e){
                    return true;
                }
            });
            return videoArr.join('<embed');
        }
        return content;
    };

    this.formatHtml = function(html){
        
        var Harr = html.split('<div id="news_content">');
        if(Harr.length==2){
            try{
                var date = Harr[0].split('<p id="news_author"><span>')[1].split('|<script')[0].split('发布于')[1].trim();
                var title = Harr[0].split('</title>')[0].split('<title>')[1].trim();
                title = title.replace('_cnBeta.COM','');
            }catch(e){
                return false;
            }
            
            Harr = Harr[1].split('<div class="digbox">');
            if(Harr.length>=2){
                var content = Harr[0].trim();
                self.getType(content,function(type){
                    var tempArr = content.split('</a>');
                    tempArr.splice(0,1);
                    content = tempArr.join('</a>').trim();
                    content = self.proxyImg(content);
                    content = self.formatVideo(content);

                    Article.findOne({article_id : req.params.id} , function(err,article){
                        if(null==article){
                            var article = new Article({
                                article_id : req.params.id ,
                                type_id : type.type_id ,
                                title : title ,
                                content : content ,
                                date : date ,
                                comments : []
                            }) 
                        }
                        else{
                            article.title = title;
                            article.content = content;
                        }
                        article.save();

                        //添加抓取热门评论任务
                        task.add({
                            url : 'http://' + req.headers.host + '/getComments-' + article.article_id.toString() ,
                            time : 60 * 15
                        });

                    });
                });
            }
        }
    };
    
    this.execute = function(){
        var id = req.params.id;
        var target = 'http://cnbeta.com/articles/'+ id.toString() +'.htm';
        res.end('');
  
        get(target).asBuffer(function(err, data) {
            self.formatHtml(dict.gbkToUTF8(data));
        });
    };
}