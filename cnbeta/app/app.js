var util       = require('../util');
var Handlebars = require('handlebars');
var fs         = require('fs');
var path       = require('path');
var url        = require('url');
var config     = require('../config');

var _templateCache = {}

var getTemplate = function(template, callback){
    var url = __dirname + '/views/' + template;

    if(config.app.runMode != 'devel' ){
        if(_templateCache[url]) return callback(_templateCache[url]);
    }
    
    path.exists(url, function (exists) {
        if (!exists) {
            return callback(false);
        }
        fs.readFile(url, 'utf8', function(err, txt) {
            if (err) {
                return callback(false);
            } 
            _templateCache[url] = txt;
            return callback(txt);
        });

    });
};

exports.view = function(template, data, callback){
    callback = callback || function(){};
    getTemplate(template,function(source){
        if(false == source) return callback('');
        var templateObj = Handlebars.compile(source.toString());
        var html = templateObj(data||{});
        return callback(html);
    });
    return false;
};

//上下文
exports.context = function(req){
    var get = url.parse(req.url,true);
    return {
        get : get.query || {}
    }
};

/**
 * 调度action
 * @param  {[type]} name   控制器名称,没有任何过滤,只接受字符,不接受变量
 * @param  {[type]} req    [description]
 * @param  {[type]} res    [description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
exports.action = function(name, req, res, config){
    
    var Action = require('./actions/' + name);
    
    var action     = new Action(req, res, config);
    action.context = exports.context(req);
    action.app     = exports;
    action.appPath = __dirname + '/../';
    action.render  = function(template,data){
        if( undefined == res._header){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        }
        exports.view(template,data,function(html){
            return res.end(html);
        });
        return false;
    };
    var ret  = action.execute();

    if(util.isString(ret)){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        return res.end(ret);
    }
    else if(util.isObject(ret) || util.isArray(ret)){
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        return res.end(JSON.stringify(ret));
    }
    
};