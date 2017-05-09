var CCV;
var proto;

if (!CCV)
	CCV = {};

if (!CCV.utils)
	CCV.utils = {};



CCV.utils.drawDebugRect = function(g, r, color, thickness, alpha, useFill){
	if(isNaN(alpha))
		alpha = 1;
	if(isNaN(thickness))
		thickness = 1;
	if(useFill == undefined)
		useFill = false;
	
	if(useFill)
		g.beginFill(color, alpha);
	g.lineStyle(thickness, color, useFill ? 1 : alpha);
	g.drawRect(r.x, r.y, r.width, r.height);
	g.moveTo(r.x, r.y);
	g.lineTo(r.x + r.width, r.y + r.height);
	g.moveTo(r.x + r.width, r.y);
	g.lineTo(r.x, r.y + r.height);
	if(useFill)
		g.endFill();
};
CCV.utils.drawDebugPoint = function(g, pos, color, thickness){
	if(isNaN(thickness))
		thickness = 1;
	
	g.lineStyle(thickness, color, 1);
	g.drawCircle(pos.x, pos.y, 10);
	g.moveTo(pos.x, pos.y);
	g.lineTo(pos.x + 20, pos.y);
	g.moveTo(pos.x, pos.y);
	g.lineTo(pos.x, pos.y + 20);
};