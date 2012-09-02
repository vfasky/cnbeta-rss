var request = require('request');

//存放定时任务列表
var taskList = [];

var util = require('../util');

//执行次数
var count = 0;


var time = false;

/**
 * 添加定时任务
 * @demo:
 * var task = require('./app/task');
 * task.add({
 *     time : 60 , //每60秒执行
 *     count : 1 , //执行次数, -1 为无限
 *     url : 'http://127.0.0.1/getList' 
 * }); 
 * @param {[type]} task [description]
 */
exports.add = function(task,undef){
	var index = taskList.length;

	task.count = task.count == undef ? 1 : Number(task.count)
	task._count = 0;
	taskList[index] = task;
	console.log(task);
	return index;
};

exports.del = function(index){
	delete taskList[index];
};

exports.run = function(){
	if(time) clearInterval(time);
	time = setInterval(function(){
		count++;

		if(count == 1000001) count = 1;

		util.each(taskList,function(task,index){
			if(task && util.isNumeric(task.time)){
				if( 0 == count % Number(task.time) ){
					task._count ++;
					if(task.count >= 0 && task._count >= task.count){
						exports.del(index);
					}
					//符合条件,执行
					//console.log(task)
					request(task.url,function(error, response, body){
						// console.log(error)
						// if (!error && response.statusCode == 200) {
						//     console.log(body);
						// }
					});
				}
			}
		});
	},1000);
};