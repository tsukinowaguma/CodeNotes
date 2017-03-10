//类似react的思想写的

window.onload=function(){
	new queue().init();
}

function queue(){
	this.inBtn = null;
	this.outBtn = null;
	this.input = null;
	this.arr = [];
	this.todo = null;
	this.search = null;
	this.time = null;
	this.lists = [];
}

queue.prototype = {
	init(){		//初始化 绑定事件
		this.inBtn = document.getElementById("in-btn");
		this.outBtn = document.getElementById("out-btn");
		this.input = document.getElementById("input");
		this.todo =document.getElementById("todo");
		this.search = document.getElementById("search");
		var _this = this;
		this.inBtn.onclick = function(e){
			_this.handleIn(e);
		}
		this.outBtn.onclick = function(e){
			_this.handleOut(e);
		}
		this.todo.onclick = function(e){
			_this.handleDel(e);
		},
		this.search.onkeyup = function(e){
			_this.handleSearch(e);
		}
	},
	mapToHTML(){		//将数组遍历成str然后写成html
		var _this = this;
		var str = '';
		this.arr.map(function(item,index){
			str += '<li data-index = ' + index + '>' + item + '  </li>';
		});
		this.todo.innerHTML = str;
		this.saveLists();
	},
	saveLists(){
		this.lists= this.todo.childNodes;
	},
	handleIn(e){	//点击按钮从左或右输入
		var dataValue = e.target.getAttribute("data-value");
		var value = this.input.value;
		if(!dataValue) return;
		if(dataValue === "left-in"){
			this.arr.unshift(this.input.value);
			this.input.value = '';
			this.mapToHTML();
		}else{
			this.arr.push(this.input.value);
			this.input.value = '';
			this.mapToHTML();
		}
	},
	handleOut(e){	//点击按钮删除左第一个或者右第一个
		var dataValue = e.target.getAttribute("data-value");
		var length = this.arr.length;
		if(length <= 0) return;
		if(!dataValue) return;
		if(dataValue==="left-out"){
			this.arr.shift(this.input.value);
			this.mapToHTML();
		}else{
			this.arr.splice(this.arr.length-1,1);
			this.mapToHTML();
		}
	},
	handleDel(e){	//点击数字删除
		var index = e.target.getAttribute('data-index');
		if(!index) return;
		this.arr.splice(index,1);
		this.mapToHTML();
	},
	handleSearch(e){
		var lists = this.lists;
		var value = e.target.value;
		clearTimeout(this.time);
		this.time = setTimeout(function(){
			for(var i =0; i<lists.length; i++){
				if(lists[i].innerHTML.indexOf(value)>=0 && value!=""){
					lists[i].className = "high-light";
				}else{
					lists[i].className = "";
				}
			}
		},100);
	}
}