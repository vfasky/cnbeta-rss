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
 *     url : '/getList' 
 * }); 
 * @param {[type]} task [description]
 */
exports.add = function(task){
	var index = taskList.length;
	taskList[index] = task;
	return index;
};

exports.del = function(index){
	delete taskList[index];
}

exports.run = function(){
	if(time) clearInterval(time);
	time = setInterval(function(){
		count++;

		if(count == 1000001) count = 1;

		util.each(taskList,function(task){
			if(task && util.isNumeric(task.time)){
				if( 0 == count % Number(task.time) ){
					//符合条件,执行
					
				}
			}
		});
	},1000);
};