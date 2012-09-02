var util    = require('../../util');
var models  = require('../models');
var Image   = models.Image;
var get     = require('get');

exports = module.exports = function(req, res, config){
    var self = this;

    var contentType = {
        'jpg' : 'image/jpeg' ,
        'jpeg' : 'image/jpeg' ,
        'png' : 'image/png' ,
        'gif' : 'image/gif' 
    };

    this.showImage = function(ext,data){
        res.writeHead(200, {"Content-Type": contentType[ext]});
        res.write(data, "binary");
        res.end();
    };

    this.execute = function(){
        var path = self.context.get.i || false;

        if( path && 
            ( path.indexOf('http://img.cnbeta.com/') == 0 || 
              path.indexOf('http://cnbeta.com/') == 0 ||
              path.indexOf('http://www.cnbeta.com/') == 0  
            )
          ){
            path = path.trim();
            var ext = path.split('.').pop().trim().toLowerCase();

            if(util.inArray(ext,['jpg','jpeg','png','gif'])){
                Image.findOne({path:path},function(err,image){
                    if(err){
                        return res.end(err);
                    }
                    if(null==image){
                        get(path).asBuffer(function(err, data) {
                            image = new Image({
                                path : path ,
                                img : data
                            });
                            image.save();
                            return self.showImage(ext,data);
                        });
                    }
                    if(image.img){
                        return self.showImage(ext,image.img);
                    }
                    res.end('');
                });
            }
        }
        else{
            res.end('');
        }
    };
}