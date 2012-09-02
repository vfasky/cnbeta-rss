var model = require('../models');
var task = require('../task');

var isAddTask = false;

exports = module.exports = function(req, res, config){
	
	this.execute = function(){
		if(false == isAddTask){
			isAddTask = true;
			task.add({
				url : 'http://' + req.headers.host + '/getList',
			    time : 60 ,
			    count : -1
			});
		}

	
		this.render('index.html');
	};
};