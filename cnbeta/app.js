var http   = require('http');
var router = require('router');
var route  = router();

var config = require('./config');
var app    = require('./app/app');

route.get('/', function(req, res) {
    app.action('index',req,res,config);
});

route.get('/show-{id}', function(req, res) {
    res.writeHead(200);
    var id = req.params.id;
    res.end('show id :' + id);
});

route.get(function(req, res) {
    res.writeHead(404);
    res.end('Page no found');
});

http.createServer(route).listen(config.get('port')); 

console.log('Server running at http://127.0.0.1:'+config.get('port')+'/');