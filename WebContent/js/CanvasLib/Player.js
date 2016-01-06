var Player = function(name,timeAxis,sprite){
	if (name!== undefined) this.name = name;
	if(timeAxis !== undefined) this.timeAxis = timeAxis;
	if(sprite !== undefined) this.sprite = sprite;
	this.margin = 40;
	this.startTime = "2015-07-16 08:00:00";
	this.endTime = "2015-07-16 09:00:00";
	this.animating = true;
	this.speed = 1;
	var curTime = 0;
	var player = this;
	this.createDOMElement = function(){

		this.animateDomElement = document.createElement('div');
		document.body.appendChild(this.animateDomElement);
		this.animateDomElement.style.position = "absolute";
		this.animateDomElement.style.left = "0px";
		this.animateDomElement.style.top = window.innerHeight-100 +"px";
		this.animateDomElement.style.height = "50px";
		this.animateDomElement.style.width = "200px";
		this.animateDomElement.style.zIndex = 104;
		
		var p = document.createElement("input");
        p.type = "button";
        p.value = "<";
        p.onclick= function(){
        	alert("back");
        };
        var p2 = document.createElement("input");
        p2.type = "button";
        p2.value = "||";
        p2.onclick= function(){
        	player.animating = false;
        };
        var p3 = document.createElement("input");
        p3.type = "button";
        p3.value = ">";
        p3.onclick= function(){
        	player.animating = true;
        	player.play();
        };
        var p4 = document.createElement("input");
        p4.type = "button";
        p4.value = "+";
        p4.onclick= function(){
        	player.speed = player.speed * 2;
        };
        var p5 = document.createElement("input");
        p5.type = "button";
        p5.value = "-";
        p5.onclick= function(){
        	player.speed = player.speed/2;
        };
        this.animateDomElement.appendChild(p);
        this.animateDomElement.appendChild(p2);
        this.animateDomElement.appendChild(p3);
        this.animateDomElement.appendChild(p4);
        this.animateDomElement.appendChild(p5);
        
	}
	
	this.play = function(){
		if(curTime == 0)
			curTime = (new Date(this.startTime)).getTime();
		//player = this;
		playTimeAnimating();
	}
	var lastTime = 0;
	var playTimeAnimating = function(){	
		var now = (+new Date);
		if(now - lastTime>1000){
			if(player.animating){
				curTime += player.speed * 1000;
				if(curTime > new Date(player.endTime).getTime() || isNaN(curTime)){
					curTime = (new Date(player.startTime)).getTime();
				}
				player.sprite.update(curTime,player.speed * 1000);
				//this.timeAxis.update(curTime);
				lastTime  = now;
			}
		}
		
		window.requestAnimationFrame(playTimeAnimating);
	}
	this.createDOMElement();
}