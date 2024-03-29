var SpriteSheet = new function(){
	this.map = {};
	this.load = function (spriteData,callback) {
	  this.map = spriteData;
	  this.image = new Image();
	  this.image.onload = callback;
	  this.image.src = "images/sprites.png";
	};
	
	this.draw = new function(ctx,sprite,x,y,frame){
		var s = this.map[sprite];
		if(!frame){
			frame = 0;
		}
		ctx.drawImage(this.image,s.sx + frame* s.sw, s.sy, s.w, s.h,x,y,s.w,s.h);
	};
}
