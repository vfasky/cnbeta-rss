var mongoose = require('mongoose');


//环境变量
exports.app = {
    'runMode' : 'deploy', //应用运行模式: devel、test 、deploy  三种

	'devel' : {
		'port' : 1337 ,
		'db' : 'mongodb://127.0.0.1:27017/cnbeta'
	},

	'deploy' : {
		'port' : 80 ,
		'db' : 'mongodb://127.0.0.1:27017/cnbeta'
	}
};

/**
 * 动态取环境变量
 * @demo :
 * var config = require('./config');
 * config.get('port');
 * 
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
var _toArray = function(path){
	var trim = function(str){
		return str.trim();
	};
	var arr = path.toString().split('.');
	return arr.map(trim);
};

var _get = function(soure,index,pathArr,def,undef){
	if(undef == soure) return def;
	var data = soure[pathArr[index]];
	if(undef == data) return def;
	index++;
	if(index==pathArr.length) return data;
	return _get(data,index,pathArr,def,undef);

};

exports.get = function(path,def){
	var soure = exports.app[ exports.app['runMode'] ];
	return _get(soure,0,_toArray(path),def);
};

