var proto;


// ----------------------------------------------------------------------
// PIXI add-ons
// @see http://www.pixijs.com/
// ----------------------------------------------------------------------

proto = PIXI.Point.prototype;
proto.scale = function(a){
	this.x *= a;
	this.y *= a;
};
proto.floor = function(){
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
};
proto.ceil = function(){
	this.x = Math.ceil(this.x);
	this.y = Math.ceil(this.y);
};
proto.round = function(){
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
};
proto.minus = function(p){
	this.x -= p.x;
	this.y -= p.y;
};
proto.plus = function(p){
	this.x += p.x;
	this.y += p.y;
};
proto.getLength = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
};
proto.to = function(target){
	target.x = this.x;
	target.y = this.y;
};
proto.toString = function(){
	return '[PIXI.Point] x: ' + this.x.toFixed(1) + ', y: ' + this.y.toFixed(1);
};

proto = PIXI.Rectangle.prototype;
proto.scale = function(a, b){
	if(b == undefined)
		b = a;
	
	this.x *= a;
	this.y *= a;
	this.width *= b;
	this.height *= b;
};/**
 * Created by antoi on 17/05/09.
 */
