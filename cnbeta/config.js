/***
 * 如果开启了mongoDB,将下面代码注释去掉，
 * 并将dbUserName, dbPassword和dbName都
 * 替换成分配得到的值。即可查看 mongoDB
 * 测试程序。否则则开启hello world程序。
 ***/
/*
var mongo = require("mongoskin");
var db_url = exports.db_url = "dbUserName:dbPassword@127.0.0.1:20088/dbName";
exports.db = mongo.db(db_url);
*/

//环境变量
exports.app = {
    'runMode' : 'devel', //应用运行模式: devel、test 、deploy  三种

	'devel' : {
		'port' : 1337
	},

	'deploy' : {
		'port' : 80
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