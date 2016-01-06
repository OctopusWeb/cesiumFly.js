var Sprite = function(name,painter,behaviors){
	if (name!== undefined) this.name = name;
	if(painter !== undefined) this.painter = painter;
	this.top = 0;
	this.left = 0;
	this.width = 10;
	this.height = 10;
	
	this.visible = true;
	this.animating = true;
	this.datas = [];
	this.behaviors = behaviors || [];
	
	this.paint=function(context){
		if(this.painter !== undefined && this.visible){
			this.painter.paint(this,context);
		}
	};
	this.update=function(time,interval){
		for(var i=0; i< this.behaviors.length;++i){
			this.behaviors[i].execute(this,time,interval);
		}
	};
	
	return this;
	
};


var TrafficPainter = function(){
	this.scale = 1;
	var pathPerFrame = 5;
	var filterOffset = 100*this.scale;
	var aminateInterval = 1000/60;
	var lineIdx = 0;
	var lastTime = 0;
	var indexArr = [];
	var sprite,context;
	function paintPath() {
		
		//if(sprite.animating){
            for(var i=0;i<sprite.datas.length;i++){
            	context.beginPath();
            	context.strokeStyle = 'rgba(255,0,255,0.8)';
            	context.lineWidth = 2;
            	var data = sprite.datas[i];
            	if(data){
		            for (var j = 0; j < data.length; j++) {
		                var first = data[j];
		                var last = data[j + 1];
		                if (last) {
		                    if(first.x>0&&first.y>0&&first.x<(window.innerWidth+0)&&first.y<(0+window.innerHeight)){
		         				if(last.x>0&&last.y>0&&last.x<(window.innerWidth+0)&&last.y<(0+window.innerHeight)){
			                      	if(first.x-last.x<filterOffset && first.x-last.x>-filterOffset && first.y-last.y<filterOffset && first.y-last.y>-filterOffset){
			                      		context.moveTo(first.x , first.y );
			                      		context.lineTo(last.x , last.y );
			                      	}
		         				}
		                    }    
		                }
		            }  
            	}
	            context.stroke();
	            
            }
            
    	//}

	}
	

	
	function paintCarMove(ctx,time,interval){
		
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    	for (var i=0; i< sprite.datas.length; i++) {
    		ctx.beginPath();
    		
            var line=sprite.datas[i];
            for(var j =0; j<line.length; j++){
            	var position = line[j];
            	var lastPos = line[j];
            	if(j>0){
            		lastPos = line[j-1];
            	}
            	if((position.time+interval) > time && (position.time-time)<=0){
                	if(position.x>0&&position.y>0&&position.x<(window.innerWidth+0)&&position.y<(0+window.innerHeight)){
                		if(lastPos.x>0&&lastPos.y>0&&lastPos.x<(window.innerWidth+0)&&lastPos.y<(0+window.innerHeight)){
                			if(position.x-lastPos.x<filterOffset && position.x-lastPos.x>-filterOffset && position.y-lastPos.y<filterOffset && position.y-lastPos.y>-filterOffset){
                				drawGradualLine(lastPos,position,ctx);
                			}
                		}
                	}  
                	j=line.length;
            	}
            }
           
        	
        }
    	
	}
	var size = 8;
	var r = 255;
	var g = 255;
	var b = 255;
	var gradualStep = 3;
	var fullStepPix = 20;
	function drawGradualLine(sPos,ePos,ctx){
		
    	var xOffset = ePos.x-sPos.x;
    	var yOffset = ePos.y-sPos.y;
    	var mOffset = xOffset;
    	if(yOffset > xOffset) mOffset = yOffset;
    	var stepPercent = mOffset/fullStepPix;
    	if(stepPercent>1) stepPercent = 1; 
    	
    	var count = Math.floor(gradualStep * stepPercent);
    	for(var i=1; i<=count;i++){
    		ctx.beginPath();
    		//var rgba = "rgba("+(r-(r/count)*(count-i+1))+","+(g-(g/count)*(count-i+1))+","+(b-(b/count)*(count-i+1))+","+(1-((count-i)*(1/count)))+")";
    		var rgba = "rgba("+r+","+g+","+b+","+(1-((count-i)*(1/count)))+")";
    		var rgbas = "rgba("+r+","+50+","+50+","+(1-((count-i)*(1/count)))+")";
    		ctx.fillStyle = rgba;
    		ctx.strokeStyle = rgbas;
    		ctx.lineWidth = size;
    		ctx.moveTo(sPos.x+xOffset*(i-1)/count, sPos.y+yOffset*(i-1)/count);
    		ctx.lineTo(sPos.x+xOffset*(i)/count, sPos.y+yOffset*(i)/count);
    		ctx.stroke();
    	}
    	ctx.beginPath();
    	ctx.fillStyle = "rgba("+r+","+g+","+b+",1)";
    	ctx.arc(ePos.x, ePos.y, size/2, 0, Math.PI*2, false);
    	//context.drawImage(imageObj, position.x, position.y);
    	ctx.fill();
    }
	function paintPixelCarMove(ctx){
		
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		var imageData = ctx.getImageData(0, 0, window.innerWidth, window.innerHeight);
    	for (var i=0; i< sprite.datas.length; i++) {
            var line=sprite.datas[i];       
            if(indexArr[i]===undefined){          	
            	indexArr[i] = 0;
            }
            var position;
            indexArr[i]	++;
        	if(indexArr[i] >= line.length){
        		indexArr[i]=0;
        		continue;
        	}
        	position = line[indexArr[i]];
        	if(position.x>0&&position.y>0&&position.x<(window.innerWidth+0)&&position.y<(0+window.innerHeight)){
        		for(var j = 0;j<200;j=j+2){
        			setPixel(imageData,position.x+j,position.y,255,255,255,255);
        		}
        		
        	}        	       	
        }
    	ctx.putImageData(imageData, 0, 0);
	}
	var setPixel = function(data,x,y,r,g,b,a){
		x = Math.floor(x >> 0);
		y = Math.floor(y >> 0);
		
		var i = data.width * 4 * y + x * 4;
		data.data[i + 0] = r;
		data.data[i + 1] = g;
		data.data[i + 2] = b;
		data.data[i + 3] = a;
	}
	var drawLine=function(data,p1,p2,r,g,b,a){
		var offx = Math.floor(p2.x-p1.x);
		var offy = Math.floor(p2.y-p1.y);
		var off = Math.abs(offx);
		if(Math.abs(offy) > off) off = Math.abs(offy);
		for(var i=0; i<off; i++){
			var x = Math.floor(p1.x+(offx/off)*i);
			var y = Math.floor(p1.y+(offy/off)*i);
			var idx = data.width * 4 * y + x * 4;
			data.data[idx + 0] = r;
			data.data[idx + 1] = g;
			data.data[idx + 2] = b;
			data.data[idx + 3] = a;
		}

	}
	this.paint=function(spr,ctx){
		
		lineIdx = 0;
		context = ctx;
		context.clearRect(0, 0, window.innerWidth, window.innerHeight);
		sprite = spr;
		paintPath();
		
	};
	this.move=function(spr,ctx,time,interval){
		//var now = (+new Date);
		sprite = spr;
		if(indexArr===undefined || indexArr.length<=0)
		indexArr = new Array(sprite.datas.length);
		paintCarMove(ctx,time,interval);
		//paintPixelCarMove(ctx);
    	
	}	
	
}



var TrafficBehavior = function(context){
	//this.idx= 0;
	this.context = context;
	this.execute = function(sprite,time,interval){
		sprite.painter.move(sprite,this.context,time,interval);
	}
}




