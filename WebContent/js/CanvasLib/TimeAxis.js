var TimeAxis = function(name,painter,behaviors){
	if (name!== undefined) this.name = name;
	if(painter !== undefined) this.painter = painter;
	this.margin = 40;
	this.startTime = "2015-07-16 08:00:00";
	this.endTime = "2015-07-16 09:00:00";
	this.behaviors = behaviors || [];
	this.animating = true;
	this.visible = true;
	this.context = document.createElement('canvas').getContext('2d');
	this.changeEventListeners = [];
	this.percent = 0;
	this.speed = 0.1;
	
	this.createDOMElement = function(){
		this.domElement = document.createElement('div');
		this.domElement.appendChild(this.context.canvas);
		document.body.appendChild(this.domElement);
		this.domElement.style.position = "absolute";
		this.domElement.style.left = "0px";
		this.domElement.style.top = window.innerHeight-100 +"px";
		this.domElement.style.height = "100px";
		this.domElement.style.zIndex = 103;
		this.setCanvasSize();
				
	}
	
	this.appendTo = function(elementName){
		document.getElementById(elementName).appendChild(this.domElement);
		
		this.resize();
	}
	this.setCanvasSize = function(){
		var domElementParent = this.domElement.parentNode;
		this.context.canvas.width = domElementParent.offsetWidth;
		this.context.canvas.height = 100;
	}
	this.resize = function(){
		this.domElement.style.left = "0px";
		this.domElement.style.top = window.innerHeight-100 +"px";
		this.domElement.style.height = "100px";
		this.domElement.style.zIndex = 103;
		
		var domElementParent = this.domElement.parentNode;
		this.context.canvas.width = domElementParent.offsetWidth;
		this.context.canvas.height = 100;
		this.painter.paint(this,0);
	}
	
	
	this.draw=function(percent){
		if(this.painter !== undefined && this.visible){
			this.painter.paint(this,percent);
		}
	};
	this.update=function(context,time){
		if(this.painter !== undefined && this.visible){
			this.painter.move(this,time);
		}
		
	};
	this.createDOMElement();
	

	return this;
}
var TimeAxisPainter = function(){
	this.paint=function(timeAxis,percent){
		var ctx = timeAxis.context;
		//ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		paintAxis(timeAxis);
		paintTicks(timeAxis);
		paintCursor(timeAxis,20);
	}
	this.move=function(timeAxis,time){
		var position = (timeAxis.percent)*(timeAxis.speed);
		if(position > 100){
			timeAxis.percent =0;
			position = 0;
		}
		var ctx = timeAxis.context;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		paintAxis(timeAxis);
		paintTicks(timeAxis);
		
		paintCursor(timeAxis,position);
		
		timeAxis.percent += timeAxis.speed*1;
		
	}
	
	var paintAxis = function(timeAxis){
		var context = timeAxis.context;
		context.beginPath();
		context.strokeStyle = "rgba(255,255,100,1)";
		context.lineWidth = 2;
		context.moveTo(timeAxis.margin,context.canvas.height-timeAxis.margin);
		context.lineTo(context.canvas.width-timeAxis.margin,context.canvas.height-timeAxis.margin);
		context.stroke();
		
	}
	var paintTicks = function(timeAxis){
		var context = timeAxis.context;
		var diffH = diffHour(timeAxis.startTime,timeAxis.endTime);
		var deltaY = 10;
		var spaceWidth = (context.canvas.width-2*timeAxis.margin)/(diffH*5);
		for(var i=0; i< diffH*5; i++){
			context.beginPath();
			context.strokeStyle = "rgba(255,255,100,1)";
			context.lineWidth = 1;
			if(i%5 === 0){
				deltaY = 10;
				context.fillStyle = "rgba(255,100,100,1)";
				var d1 = new Date(timeAxis.startTime);
				d1.setHours(d1.getHours() + i/5);
				context.fillText(d1.toTimeString(),timeAxis.margin+spaceWidth*i-10,context.canvas.height-timeAxis.margin+10);
			}else{
				deltaY = 5;
			}
			context.moveTo(timeAxis.margin+spaceWidth*i,context.canvas.height-timeAxis.margin-deltaY);
			context.lineTo(timeAxis.margin+spaceWidth*i,context.canvas.height-timeAxis.margin+deltaY);
			context.stroke();
			if(i === diffH*5-1){
				deltaY = 10;
				context.fillStyle = "rgba(255,100,100,1)";
				var d1 = new Date(timeAxis.endTime);
				context.fillText(d1.toTimeString(),timeAxis.margin+spaceWidth*(i+1)-10,context.canvas.height-timeAxis.margin+10);
				context.moveTo(timeAxis.margin+spaceWidth*(i+1),context.canvas.height-timeAxis.margin-deltaY);
				context.lineTo(timeAxis.margin+spaceWidth*(i+1),context.canvas.height-timeAxis.margin+deltaY);
				context.stroke();
			}
			
		}
		
	}
	var diffHour=function(h1,h2){
		var d1 = new Date(h1);
		var d2 = new Date(h2);
		var diffH = Math.floor((d2.getTime()-d1.getTime())/(1000*60*60));
		return diffH;
	}
	var paintCursor = function(timeAxis,percent){
		var context = timeAxis.context;
		var size = 8;
		var cursorX = timeAxis.margin + percent*(context.canvas.width-2*timeAxis.margin)/100;
		context.beginPath();
		context.strokeStyle = "rgba(255,100,255,1)";
		context.fillStyle = "rgba(255,255,100,0.8)";
		context.moveTo(cursorX,context.canvas.height-timeAxis.margin);
		context.lineTo(cursorX-size/2,context.canvas.height-timeAxis.margin-size/2);
		context.lineTo(cursorX-size/2,context.canvas.height-timeAxis.margin-size/2-size);
		context.lineTo(cursorX+size/2,context.canvas.height-timeAxis.margin-size/2-size);
		context.lineTo(cursorX+size/2,context.canvas.height-timeAxis.margin-size/2);
		context.lineTo(cursorX,context.canvas.height-timeAxis.margin);
		context.stroke();
		context.fill();
		
	}
	
}
