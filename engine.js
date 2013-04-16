var SpriteSheet = new function(){
	this.map = { };
	this.load = function (spriteData,callback) {
	  this.map = spriteData;
	  this.image = new Image();
	  this.image.onload = callback;
	  this.image.src = "images/sprites.png";
	};
	
	this.draw = function(ctx,sprite,x,y,frame){
		var s = this.map[sprite];
		if(!frame){
			frame = 0;
		}
		ctx.drawImage(this.image, s.sx+frame*s.w, s.sy, s.w, s.h, x, y, s.w, s.h);
	};
};

var TitleScreen = function TitleScreen(title, subtitle, callback){
	this.step = function(dt){
		if (Game.keys["fire"] && callback) {
			callback();
		}
	};

	this.draw = function(ctx){
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "center";
		ctx.font = "bold 40px bangers";
		ctx.fillText(title,Game.width/2,Game.height/2);

		ctx.font = "bold 20px bangers";
		ctx.fillText(subtitle,Game.width/2,Game.height/2+100);
	};
}

var Game = new function(){
this.initialize = function(canvasElementId,sprite_data,callback){
		this.canvas = document.getElementById(canvasElementId);
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
		if(!this.ctx){
			return alert("Please upgrade your browser");
		}

	// setup your input
	this.setupInput();
	// start gmae loop
	this.loop();
	// load the sprite sheet and pass the forward call back
	SpriteSheet.load(sprite_data,callback);
};

var KEYCODES = { 37: 'left', 39: 'right', 32: 'fire'};
this.keys = {};
this.setupInput = function(){

	window.addEventListener('keydown',function(e){
		if (KEYCODES[e.keyCode]) {
			Game.keys[KEYCODES[e.keyCode]] = true;
			e.preventDefault();
		};
	},false);

	window.addEventListener('keyup',function(e){
		if (KEYCODES[e.keyCode]) {
			Game.keys[KEYCODES[e.keyCode]] = false;
			e.preventDefault();
		};
	},false);
};

var boards = [];
this.loop =  function(){
	var dt = 30/1000;
	for (var i = 0,len = boards.length; i < len; i++) {
		if (boards[i]) {
			boards[i].step(dt);
			boards[i] && boards[i].draw(Game.ctx); 
		}
	}
	setTimeout(Game.loop,30);
};
// Change an active game board
this.setBoard = function(num,board) {
 boards[num] = board;
 };
};
var GameBoard = function(){
 	var board = this;
 	this.objects = [];
 	this.cnt = [];

 	this.overlap = function(o1,o2){
 		return !((o1.y+o1.h-1 < o2.y) || (o1.y > o2.y+o2.h-1) || (o1.x+o1.w-1 < o2.x) || (o1.x > o2.x+o2.w-1));
 	};

 	this.collide = function(obj,type){
 		return this.detect(function(){
 			if(obj != this){
 				var col = (!type || this.type & type) && board.overlap(obj,this);
 				return col ? this : false;
 			}
 		});
 	};

 	this.add = function(obj){
 		obj.board = this;
 		this.objects.push(obj);
 		this.cnt[obj.type]  =  (this.cnt[obj.type] || 0 ) + 1;
 		return obj;
 	};

 	this.remove = function(obj){
 		var wasStillAlive = this.removed.indexOf(obj) != -1;
 		if (wasStillAlive) {
 			this.removed.push(obj);
 		}
 		return wasStillAlive;
 	};

 	// reset the list of removed object
 	this.resetRemoved = function(){
 		this.removed = [];
 	}

 	// remove object mark removal from the list
 	this.finalizeRemoved = function(){
 		for (var i = 0; i < this.removed.length; i++) {
 			var idx = this.objects.indexOf(this.removed[i]);
 			if(idx != -1){
 				this.cnt[this.removed[i].type]--;
 				this.objects.splice(idx,1);
 			}
 		}

 	};

 	this.iterate = function(funcName){
 		var args = Array.prototype.splice.call(arguments,1);
 		for (var i = 0; i < this.objects.length; i++) {
 			var obj = this.objects[i];
 			obj[funcName].apply(obj,args);
 		};
 	};

 	// this is first object for return true

 	this.detect = function(func){
 		for (var i = 0,val = null; i < this.objects.length; i++) {
 			if (func.call(this.objects[i])) {
 				return this.objects[i];
 			};
 		return false;
 		}
 	};

 	this.step = function(dt){
 		this.resetRemoved();
 		this.iterate("step",dt);
 		this.finalizeRemoved();
 	};

 	this.draw = function(ctx){
 		this.iterate("draw",ctx);
 	};
 };

 var Sprite = function(){}

 Sprite.prototype.setup = function(sprite,props){
 	this.sprite = sprite;
 	this.merge(props);
 	this.frame = this.frame || 0;
 	this.w = SpriteSheet.map[this.sprite].w;
 	this.h = SpriteSheet.map[this.sprite].h;
 }

 Sprite.prototype.merge = function(props){
 	if (props) {
 		for(var prop in props){
 			this[prop] = props[prop];
 		}
 	}
 };

 Sprite.prototype.draw = function(ctx){
 	console.log(this.sprite);
 	SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
 };
