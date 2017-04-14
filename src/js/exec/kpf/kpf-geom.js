var KPF;

if (!KPF)
	KPF = {};



// ######################################################################
// KPF.geom
// ######################################################################

if (!KPF.geom){
	KPF.geom = {};
}


// ----------------------------------------------------------------------
// KPF.geom.Point

if (!KPF.geom.Point) {
	
	KPF.geom.Point = function () {
		/** @var Number */
		this.x = 0;
		/** @var Number */
		this.y = 0;
		switch(arguments.length){
			case 2:
				this.reset.apply(this, arguments);
				break;
			case 1:
				if(KPF.utils.isan(arguments[0]))
					this.reset(arguments[0], 0);
				else
					this.from(arguments[0]);
				break;
		}
	};
	proto = KPF.geom.Point.prototype;
	
	proto.polar = function(theta, radius){
		this.x += Math.cos(theta) * radius;
		this.y += Math.sin(theta) * radius;
		return this;
	};
	proto.toString = function () {
		return '[Point] {x: ' + this.x + ', y: ' + this.y + '}';
	};
	proto.round = function (precision) {
		if (!KPF.utils.isan(precision))
			precision = 1;
		this.x = Math.round(this.x / precision) * precision;
		this.y = Math.round(this.y / precision) * precision;
		return this;
	};
	proto.reset = function (x, y) {
		this.x = x || 0;
		this.y = y || 0;
		return this;
	};
	proto.from = function (d) {
		d ? this.reset(d.x, d.y) : this.reset(0, 0);
		return this;
	};
	proto.to = function(d){
		d.x = this.x;
		d.y = this.y;
	};
	proto.clone = function () {
		return new KPF.geom.Point(this.x, this.y);
	};
	proto.plus = function (p) {
		this.x += p.x;
		this.y += p.y;
		return this;
	};
	proto.minus = function (p) {
		this.x -= p.x;
		this.y -= p.y;
		return this;
	};
	proto.scale = function (coef) {
		this.x *= coef;
		this.y *= coef;
		return this;
	};
}