//DOM操作
function addLoadEvent (func) {                         //用于onload加载多个函数
	var oldonload = window.onload;						//用法有addLoadEvent(firstFunction);
	if(typeof window.onload != 'function'){				//addLoadEvent(secondFunction);
		window.onload= func;
	}else {
		window.onload =function(){
			oldonload();
			func();
		}
	}

}



function insertAfter(newElement,targetElement){     //用于将元素节点插入目标元素后
	var parent = targetElement.parentNode;
	if(parent.lastChild = targetElement){
		parent.appendChild(newElement);
	}else {
		var nextElement = targetElement.nextSibling;
		parent.insertBefore(newElement, nextElement);
	}
}





function getHTTPObject(){					//获取XMLHttpRequest对象(兼容浏览器)
	if(typeof XMLHttpRequest == "undefined"){
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.6.0")；
		} catch(e) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.3.0")；
		} catch(e) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP")；
		} catch(e) {}
		return false;
	}
	return new XMLHttpRequest();
}


function nextElement(node){         //获得下一个兄弟元素节点 node为想要插入在后面的node.nextSibling
	if(node.nodeType == 1){
		return node;
	}
	if(node.nextSibling){
		return node.nextSibling;
	}
	return null ;
}




function addClass(element,value){     //为元素节点添加class属性
	if (!element.className) {
		element.className = value;
	}else {
		elemnt.className += " "+value ;
	}
}


function moveElement(elemID,final_x,final_y,interval){    //元素的移动
	elem = document.getElementById(elemID);
	if(!elem.style.left){
		elem.style.left ="0px";
	}
	if(!elem.style.top){
		elem.style.top ="0px";
	}
	if (elem.movement) {
		clearTimeout(elem.movement);
	}
	var xpos = parseInt(elem.style.left);
	var ypos =parseInt(elem.style.top);


	if(xpos == final_x & ypos ==  final_y){
		return ture ;
	}
	if(xpos < final_x){
		var dist =Math.ceil((final_x-xpos)/10);
		xpos += dist;
	}	
	if(xpos > final_x){
		var dist =Math.ceil((xpos-final_x)/10);
		xpos -= dist;
	}
	if(ypos < final_y){
		var dist =Math.ceil((final_y-ypos)/10);
		ypos += dist;
	}	
	if(ypos > final_y){
		var dist =Math.ceil((ypos-final_y)/10);
		ypos -= dist;
	}

	elem.style.left =xpos+"px";
	elem.style.top =ypos+"px";
	var repeat ="moveElement('"+ elemID +"'," +final_x + "," + final_y + "," +interval +")";
	elem.movement = setTimeout(repeat, interval);
}