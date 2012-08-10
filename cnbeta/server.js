
http.createServer(function(req, res){
    var http = require('http');
    var url  = require('url');
    
    var imageServer = function(http, url) {
        var _url = url;
        var _http = http;
        this.http = function(url, callback, method) {
            method = method || 'GET';
            callback = callback ||
            function() {};
            var urlData = _url.parse(url);
            var request = _http.createClient(80, urlData.host).
            request(method, urlData.pathname, {
                "host": urlData.host
            });
            request.end();
            request.on('response', function(response) {
                var type = response.headers["content-type"],
                    body = "";
                response.setEncoding('binary');
                response.on('end', function() {
                    var data = {
                        type: type,
                        body: body
                    };
                    callback(data);
                });
                response.on('data', function(chunk) {
                    if (response.statusCode == 200) body += chunk;
                });
            });
        };
    };
    
    var params = url.parse(req.url, true);
    var IMGS = new imageServer(http, url);
    IMGS.http(params.query.url, function(data) {
        res.writeHead(200, {"Content-Type": data.type});
        res.write(data.body, "binary");
        res.end();
    });
}).listen(80);

