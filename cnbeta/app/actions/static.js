var util    = require('../../util');
var fs      = require('fs');
var path    = require('path');
var zlib    = require("zlib");

exports = module.exports = function(req, res, config){
    var self = this;

    this.mime = {
      "css": "text/css",
      "gif": "image/gif",
      "html": "text/html",
      "ico": "image/x-icon",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "js": "text/javascript",
      "json": "application/json",
      "pdf": "application/pdf",
      "png": "image/png",
      "svg": "image/svg+xml",
      "swf": "application/x-shockwave-flash",
      "tiff": "image/tiff",
      "txt": "text/plain",
      "wav": "audio/x-wav",
      "wma": "audio/x-ms-wma",
      "wmv": "video/x-ms-wmv",
      "xml": "text/xml"
    };

    this.cacheTime = 3600 * 24 * 365;

    this._404 = function(){
        res.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});
        res.end();
        return false;
    };

    this.setHeader = function(filePath,callback){
        var ext = path.extname(filePath).toLowerCase();
        ext = ext ? ext.slice(1) : 'unknown';
        var contentType = self.mime[ext] || "text/plain";
        res.setHeader("Content-Type", contentType);

        var ifModifiedSince = "If-Modified-Since".toLowerCase();

        fs.stat(filePath, function (err, stat) {
            var lastModified = stat.mtime.toUTCString();
            res.setHeader("Last-Modified", lastModified);

            var expires = new Date();
            expires.setTime(expires.getTime() + self.cacheTime);
            res.setHeader("Expires", expires.toUTCString());
            res.setHeader("Cache-Control", "max-age=" + self.cacheTime.toString());

            if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
                res.writeHead(304, "Not Modified");
                return res.end();
            }
            callback(); 
        });
    }

    this.execute = function(){
        var filePath = req.url.replace('/static/','');
        var rootPath = path.join(self.appPath , 'static/');

        if(filePath.indexOf('../') == -1){
            filePath = path.join(rootPath,filePath);
            //console.log(filePath)
            path.exists(filePath, function (exists) {
                if (!exists) return self._404();
                self.setHeader(filePath,function(){
                    var raw = fs.createReadStream(filePath);

                    var acceptEncoding = req.headers['accept-encoding'] || "";

                    if (acceptEncoding.match(/\bgzip\b/)) {
                        res.writeHead(200, "Ok", {'Content-Encoding': 'gzip'});
                        raw.pipe(zlib.createGzip()).pipe(res);
                    } else if (acceptEncoding.match(/\bdeflate\b/)) {
                        res.writeHead(200, "Ok", {'Content-Encoding': 'deflate'});
                        raw.pipe(zlib.createDeflate()).pipe(res);
                    } else {
                        res.writeHead(200, "Ok");
                        raw.pipe(res);
                    }
                    return false;
                });
                
            });
        }   
        else{
            return self._404();
        }
    };
}