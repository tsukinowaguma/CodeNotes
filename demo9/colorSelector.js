function colorSelector(){
	this.shaft = null;		//转色轴
	this.selector = null;	//颜色盘
	this.tailrgb = [255,0,0];	//颜色选择器最右上角的颜色RGB值
	this.selectrgb = [255,255,255];	//所选择的颜色的RGB值
	this.selecthsb = [0,0,100]	//当前颜色的hsl
	this.shaftColor = "red";	//转色的颜色系默认为红
	this.ClickX = 0;	//点击颜色盘的X轴
	this.ClickY = 0;	//点击颜色盘的Y轴
	this.selectorCTX = null;	//颜色盘画布的context对象
	this.stutsUrl = "";		//颜色盘底色状态图片url
	this.shaftCTX = null;	//转轴画布的context对象
	this.shaftUrl = "";		//转轴状态图片url
}

colorSelector.prototype = {
	init(){	//初始化
		var _this = this;
		this.selector = document.getElementById("color-select");
		this.shaft = document.getElementById("color-shaft");
		this.info = document.getElementById("color-shaft");
		this.setShaft();	//初始化转色轴的颜色
		this.shaft.onclick = function(e){
			_this.handleShaftClick(e);
		}
		this.selector.onclick = function(e){	
			_this.handleClickSelector(e);
		}
		this.setSelector(); //初始化颜色盘的颜色
		this.paintSelectorPointer(this.ClickX,this.ClickY);	//绘制指针
		this.paintShaftPointer(0);	//绘制指针
	},	
	setShaft(){	//初始化转色轴的颜色
		var ctx = this.shaftCTX = this.shaft.getContext("2d");	
		var IGrd = ctx.createLinearGradient(0,0,0,255);	//纵向填充颜色
		var _this = this;
		IGrd.addColorStop(0,"rgb(255,0,0)");	//初始为红色系
		IGrd.addColorStop(1/6,"rgb(255,0,255)");	// 红色、蓝色满 此时由红色系转变为蓝色系
		IGrd.addColorStop(2/6,"rgb(0,0,255)");	//纯蓝色
		IGrd.addColorStop(3/6,"rgb(0,255,255)");	// 蓝色、绿色满 此时由蓝色系转变为绿色系
		IGrd.addColorStop(4/6,"rgb(0,255,0)");	//纯绿色
		IGrd.addColorStop(5/6,"rgb(255,255,0)");	// 绿色和红色满 此时由绿色系转变为红色系
		IGrd.addColorStop(1,"rgb(255,0,0)");	//纯红色
		ctx.fillStyle = IGrd;
		ctx.fillRect(0,0,70,256);	//填充
		this.shaftUrl = this.shaft.toDataURL();
	},
	setSelector (){	//设置颜色盘颜色
		var selector = this.selector;	
		var ctx = this.selectorCTX = selector.getContext("2d");
		var headrgb  = [255,255,255];	
		var tailrgb  = this.tailrgb;
		var tailrgbCopy = [tailrgb[0],tailrgb[1],tailrgb[2]]; 	//赋值备份
		var IGrd,
			headrgbStr,tailrgbStr;
		for (var i = 0; i <= 255; i++) {	//遍历256遍每次给颜色盘绘制高为1px，宽为256px的渐变横线
			IGrd = ctx.createLinearGradient(0, i, 255, 1);	//纵向填充颜色
			headrgbStr = headrgb.join(",");	//变成RGB的字符串
			tailrgbStr = tailrgb.join(",");	//变成RGB的字符串
			IGrd.addColorStop(0,"rgb(" + headrgbStr + ")"); 
			IGrd.addColorStop(1,"rgb(" + tailrgbStr + ")");
			ctx.fillStyle = IGrd;
			ctx.fillRect(0,i,256,1);
			for(var u = 0; u < 3 ; u++){	// 颜色盘越往下颜色r,g,b值越小直至该r,g,b为0则不再递减
				if(headrgb[u] != 0) headrgb[u] -= 1;
			}
			for(var o = 0; o < 3 ; o++){	// 颜色盘越往下颜色r,g,b值越小直至该r,g,b为0则不再递减
				if(tailrgb[o] != 0) tailrgb[o] -= 1;
			}
		}
		this.tailrgb = tailrgbCopy;
		//每次设置颜色盘重新保存状态
		this.stutsUrl = selector.toDataURL();
	},
	handleShaftClick(e){		//点击转轴时
		var posY = this.getPosition(e).posY; //获取Y坐标
		var Ypercent = posY/this.shaft.height;	//获取Y坐标占高的比例
		var colorLength = this.shaft.height * 1/6;	//每一段的颜色区域长度
		var colorratio,	//Y的坐标在该颜色区域的比例位置
			r,g,b;
		if( Ypercent >= 0 && Ypercent < 1/6){ //如果比例在此区间，此时r不变，y坐标越低则b值越大
			this.shaftColor = "red";		//红色系
			colorratio = (posY - 0) / colorLength; 	
			r = 255; 
			g = 0; 
			b = Math.round(255 * colorratio);
		}else if(Ypercent >= 1/6 && Ypercent < 2/6){ //如果比例在此区间，此时b不变，y坐标越低则r值越小
			this.shaftColor = "blue";	//蓝色系
			colorratio = (posY - this.shaft.height*1/6) / colorLength; 
			r = Math.round(255 * (1 - colorratio));
			g = 0;
			b = 255;
		}else if(Ypercent >= 2/6 && Ypercent < 3/6){ //如果比例在此区间，此时b不变，y坐标越低则g值越大
			this.shaftColor = "blue";	//蓝色系
			colorratio = (posY - this.shaft.height*2/6) / colorLength; 
			r = 0; 
			g = Math.round(255 * colorratio);
			b = 255;
		}else if(Ypercent >= 3/6 && Ypercent < 4/6){ //如果比例在此区间，此时g不变，y坐标越低则b值越小
			this.shaftColor = "green";	//绿色系
			colorratio = (posY - this.shaft.height*3/6) / colorLength; 
			r = 0;
			g = 255;
			b = Math.round(255 * (1 - colorratio));
		}else if(Ypercent >= 4/6 && Ypercent < 5/6){ //如果比例在此区间，此时g不变，y坐标越低则r值越大
			this.shaftColor = "green";	//绿色系
			colorratio = (posY - this.shaft.height*4/6) / colorLength; 
			r = Math.round(255 * colorratio);
			g = 255;
			b = 0;
		}else if(Ypercent >= 5/6 && Ypercent < 6/6){ //如果比例在此区间，此时r不变，y坐标越低则g值越小
			this.shaftColor = "red";	//红色系
			colorratio = (posY - this.shaft.height*5/6) / colorLength; 
			r = 255;
			g = Math.round(255 * (1 - colorratio));
			b = 0;
		}
		this.tailrgb = [r,g,b];	//改变颜色盘的尾部颜色
		this.selecthsb[0] = 360 * Ypercent;
		this.setSelector(); //重新绘制颜色盘
		this.setColorRGB(this.ClickX,this.ClickY);	//点击转轴要重新获取一遍颜色值
		this.paintSelectorPointer(this.ClickX,this.ClickY);	//绘制颜色盘指针
		this.paintShaftPointer(posY);		//绘制转轴盘指针
	},	
	handleClickSelector(e){		//点击颜色盘时
		//获取点击的位置
		var pos = this.getPosition(e);
		var posX = this.ClickX = pos.posX;
		var posY = this.ClickY = pos.posY;
		//设置this.selectRGB的值
		this.setColorRGB(posX,posY);	
		this.paintSelectorPointer(posX,posY);
		this.selecthsb[2] = 100 * (1 - posY / this.selector.height);
		this.selecthsb[1] = 100 * posX / this.selector.width;
	},
	setColorRGB(posX,posY){ //设置当前指针的颜色的RGB值
		var r,g,b;
		var tailrgb = this.tailrgb;
		var Xpercent = posX / this.selector.width;	// 点击位置横坐标所占的百分比
		var Ypercent = posY / this.selector.height; // 点击位置纵坐标所占的百分比
		/*
			根据色相为转色轴的规律
			每一列的最高点为每个rgb在此列的最高值，每一列的最底部颜色永远为0,0,0,高度下降则rgb值按比例下降直至到达底部
			每一行最左边值rgb永远不变且为该行最高值，左上角永远rgb为255,255,255
			从左往右该色系的值永远不变，比如红色系时r值永远不变，而其他值按比例减小
		*/
		switch(this.shaftColor){
			case "red" :{	//红色系时r值最顶端一行为255
				r = Math.round(255 * (1 - Ypercent)) ;	
				g = Math.round((tailrgb[1] + (255 - tailrgb[1]) * (1 - Xpercent)) * (1 - Ypercent));
				b = Math.round((tailrgb[2] + (255 - tailrgb[2]) * (1 - Xpercent))* (1 - Ypercent));
				break;
			}
			case "green" :{		//绿色系r值最顶端一行为255
				r = Math.round((tailrgb[0] + (255 - tailrgb[0]) * (1 - Xpercent)) * (1 - Ypercent));
				g = Math.round(255 * (1 - Ypercent)) ;
				b = Math.round((tailrgb[2] + (255 - tailrgb[2]) * (1 - Xpercent)) * (1 - Ypercent));
				break;
			}
			case "blue" :{		//蓝色系b值最顶端一行为255
				r = Math.round((tailrgb[0] + (255 - tailrgb[0]) * (1 - Xpercent)) * (1 - Ypercent));
				g = Math.round((tailrgb[1] + (255 - tailrgb[1]) * (1 - Xpercent)) * (1 - Ypercent));
				b = Math.round(255 * (1 - Ypercent)) ;
				break;
			}
		}
		//防止点击边缘时为256
		if(r>=255) r=255;	
		if(g>=255) g=255;
		if(b>=255) b=255;
		this.selectrgb = [r,g,b];
	},
	paintSelectorPointer(posX,posY){		//绘制颜色指针
		var selector = this.selector;	
		var ctx = this.selectorCTX;
		var Ypercent = posY / selector.height;	//获取百分比
		var color = "white";	//定义变量绘制颜色，下半部分为黑色
		if(Ypercent < 0.5) color = "black";	//当上部分时为黑色
		//加载状态
		var img = new Image();	
		img.src = this.stutsUrl;
		img.onload = function(){ //防止状态没加载完就开始绘制新指针
			ctx.drawImage(img,0,0,selector.width,selector.height);
			//绘制圆形指针
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = 3;
			ctx.arc(posX, posY, 5, 0, 2 * Math.PI, false);	//以点击的点为圆心
			ctx.stroke();
			ctx.closePath();
		}
	},
	paintShaftPointer(posY){		//绘制转轴颜色指针
		var shaft = this.shaft;	
		var ctx = this.shaftCTX;
		var Ypercent = posY / shaft.height;	//获取百分比
		var img = new Image();	
		img.src = this.shaftUrl;
		img.onload = function(){ //防止状态没加载完就开始绘制新指针
			ctx.drawImage(img,0,0,shaft.width,shaft.height);
			//绘制圆形指针
			ctx.beginPath();
			ctx.strokeStyle ="white";
			ctx.lineWidth = 3;
			ctx.arc(shaft.width/2, posY, 5, 0, 2 * Math.PI, false);	//以点击的点为圆心
			ctx.stroke();
			ctx.closePath();
		}
	},
	getPosition(e){	//获得涂鸦时的坐标
		var posX = e.offsetX ;
		var posY = e.offsetY ;
		//返回位置对象
		return{
			posX:posX,
			posY:posY
		};
	},
	getColorRGB(){	//外界接口返回rgb
		return this.selectrgb;
	}
}
window.onload = function(){
	var color = new colorSelector();		
	color.init();
	var selectrgb = color.selectrgb;
	var infoNode = document.getElementById("color-info");
	var setInfo = function(infoNode,selectrgb){	//设置颜色信息的方法
		var toHex = function(number){	//转为十六进制的方法
			if(number < 16){ //如果数字小于16就在前面加0
				number = "0" + number.toString(16);
			}else{
				number = number.toString(16);
			}
			return number;
		}
		var html = "", 
			str = "", 
			hex = "";
		for (var i = 0; i < 3; i++){	//遍历选取颜色的rgb数组
			switch(i){	//添加字符串
				case 0 : str = "red: ";break;	
				case 1 : str = "green: ";break;
				case 2 : str = "blue: ";break;
			}
			//拼接字符串
			hex += toHex(selectrgb[i]);	
			html += "<li>" + str + selectrgb[i] + "</li>";
		}
		html += "</br>"
		for(var i = 0; i < 3; i++){		//遍历选取颜色的hsb数组
			switch(i){	//添加字符串
				case 0 : str = "hues: ";break;	
				case 1 : str = "saturation: ";break;
				case 2 : str = "brightness: ";break;
			}
			if(i === 0) html += "<li>" + str + Math.round(color.selecthsb[i]) + "°</li>";
				else html += "<li>" + str + Math.round(color.selecthsb[i]) + "%</li>";
		}
		//拼接字符串
		hex = "#" + hex;	//显示#ffffff的效果
		html += "</br><li>十六进制:" + hex + "</li>" + 
					"<li class='color-show' style='background-color:" + hex + ";'></li>";
		//写入html
		infoNode.innerHTML = "<ul>" + html + "</ul>";
	}
	//先初始化一次
	setInfo(infoNode,selectrgb);
	//数据绑定,当选择的颜色变化时重新设置颜色信息，具体可以看百度糯米技术学院的数据绑定任务(一、二)
	Object.defineProperty(color,"selectrgb",{	
		enumerable:true,
		configurable:true,
		get(){
			return selectrgb;
		},
		set(newVal){
			selectrgb = newVal;
			setInfo(infoNode,selectrgb);
		}
	});
}