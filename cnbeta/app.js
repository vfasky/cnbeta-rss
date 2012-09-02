var http   = require('http');
var router = require('router');
var route  = router();

var config = require('./config');
var app    = require('./app/app');
var task   = require('./app/task');

//绑定路由
route.get('/', function(req, res){
    app.action('index',req,res,config);
});

route.get('/feed',function(req,res){
	app.action('feed',req,res,config);
});

route.get(/^\/static\/([a-zA-Z_.\/-0-9]+)/, function(req, res){
    app.action('static',req,res,config);
});

route.get('/getList',function(req,res){
	app.action('getList',req,res,config);
});

route.get('/imgProxy',function(req,res){
	app.action('imgProxy',req,res,config);
});

route.get('/getArticle-{id}([0-9]+)',function(req,res){
	app.action('getArticle',req,res,config);
});

route.get('/getComments-{id}([0-9]+)',function(req,res){
	app.action('getComments',req,res,config);
});

route.get('/show-{id}([0-9]+)', function(req, res) {
    app.action('show',req,res,config);
});

route.get(function(req, res) {
    res.writeHead(404);
    res.end('Page no found');
});

//运行定时任务
task.run();


//发布 server
http.createServer(route).listen(config.get('port')); 
console.log('Server running at http://127.0.0.1:'+config.get('port')+'/');