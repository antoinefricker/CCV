var KPF;

if (!KPF)
	KPF = {};



// ######################################################################
// KPF.global
// ######################################################################

if (!KPF.global)
	KPF.global = {};

KPF.global.PRODUCTION = true;
KPF.global.FORMAT_INDENT = '   ';
var KPF;

if (!KPF)
	KPF = {};


// ######################################################################
// KPF.utils
// ######################################################################

if (!KPF.utils) {
	KPF.utils = {};
	
	/** @private */
	KPF.utils._logBuildStr = function(message, context){
		var str;
		if(KPF.utils.isdefined(context))
			str = '[' + context + '] ';
		if(KPF.utils.isdefined(message))
			str = str ? str + message : message;
		return str;
	};
	/**
	 * Displays a error log.
	 * @param message    log string
	 * @param context    execution context, usually class.method
	 * @param data       appendix data to be exposed through console
	 */
	KPF.utils.error = function (message, context, data) {
		var str = KPF.utils._logBuildStr(message, context);
		if(str)
			data ? console.error(str, data) : console.error(str);
		else if(data)
			console.error(data);
	};
	/**
	 * Displays a warning log.
	 * @param message    log string
	 * @param context    execution context, usually class.method
	 * @param data       appendix data to be exposed through console
	 */
	KPF.utils.warn = function (message, context, data) {
		var str = KPF.utils._logBuildStr(message, context);
		if(str)
			data ? console.warn(str, data) : console.warn(str);
		else if(data)
			console.warn(data);
	};
	/**
	 * Displays a default log.
	 * @param message    log string
	 * @param context    execution context, usually class.method
	 * @param data       appendix data to be exposed through console
	 */
	KPF.utils.log = function (message, context, data) {
		
		if(!KPF.global.PRODUCTION)
			return;
			
		var str = KPF.utils._logBuildStr(message, context);
		if(str)
			data ? console.log(str, data) : console.log(str);
		else if(data)
			console.log(data);
	};
	
	// ----  number utilities
	
	/** @param num Number */
	KPF.utils.degToRad = function (num) {
		return num / 180 * Math.PI;
	};
	/** @param num Number */
	KPF.utils.rad2Deg = function (num) {
		return num / Math.PI * 180;
	};
	/** @param num {Number} */
	KPF.utils.digits2 = function (num) {
		return num < 10 ? '0' + num : num;
	};
	/**
	 * @param min {Number}
	 * @param max {Number}
	 * @return {Number}
	 */
	KPF.utils.randomInt = function (min, max){
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min +1)) + min;
	};
	/**
	 * Constrains value with the mini/maxi range.
	 * @param val     {Number}
	 * @param min     {Number}
	 * @param max     {Number}
	 * @return        {Number}
	 */
	KPF.utils.clamp = function(val, min, max){
		return Math.max(min, Math.min(max, val));
	};
	
	
	// ----  string utilities
	 
	KPF.utils.fillTo = function (o, len, pattern) {
		o = o.toString();
		while(o.length < len)
			o = pattern + o;
		return o;
	};
	KPF.utils.isfilled = function (str) {
		return typeof str === 'string' && str.length > 0;
	};
	/**
	 * Keeps number within passed-in string.
	 * @param str String
	 */
	KPF.utils.keepNumeric = function (str) {
		return str.match(/\d/g).join('');
	};
	/**
	 * Repeats passed-in pattern the according to iteration setting.
	 * @param iteration Number
	 * @param pattern String pattern to be repeated
	 */
	KPF.utils.repeat = function(iteration, pattern){
		var out = '';
		
		if(isNaN(iteration))
			iteration = 0;
		else if(!(KPF.utils.isdefined(pattern))){
			KPF.utils.warn('Illegal arguments', 'KPF.utils.repeat', {
				iteration: iteration,
				pattern: pattern
			});
			return out;
		}
		
		while(iteration > 0){
			out += pattern;
			--iteration;
		}
		return out;
	};
	
	
	// ----  typecheck utilities
	
	KPF.utils.isdefined = function (arg) {
		return arg !== void 0 && arg !== null;
	};
	KPF.utils.isstring = function (str) {
		return typeof str === 'string';
	};
	KPF.utils.isarray = function (arg) {
		if (Array.isArray)
			return Array.isArray(arg);
		return objectToString(arg) === '[object Array]';
	};
	KPF.utils.isbool = function (arg) {
		return typeof arg === 'boolean';
	};
	KPF.utils.isan = function (arg) {
		return typeof arg === 'number' && arg + 1 == arg + 1;
	};
	
	
	// ----  array utilities
	
	/**
	 * @param arr Array
	 * @returns Array
	 */
	KPF.utils.arrGetUnique = function (arr) {
		var u = {},
			a = [];
		for (var i = 0, l = arr.length; i < l; ++i) {
			if (u.hasOwnProperty(arr[i]))
				continue;
			a.push(arr[i]);
			u[arr[i]] = 1;
		}
		return a;
	};
}
var CCV;
var proto;


// ----------------------------------------------------------------------
// PIXI add-ons
// @see http://www.pixijs.com/
// ----------------------------------------------------------------------

PIXI.Point.prototype.scale = function(a){
	this.x *= a;
	this.y *= a;
};
PIXI.Point.prototype.floor = function(){
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
};
PIXI.Point.prototype.ceil = function(){
	this.x = Math.ceil(this.x);
	this.y = Math.ceil(this.y);
};
PIXI.Point.prototype.round = function(){
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
};
PIXI.Point.prototype.minus = function(p){
	this.x -= p.x;
	this.y -= p.y;
};
PIXI.Point.prototype.plus = function(p){
	this.x += p.x;
	this.y += p.y;
};
PIXI.Point.prototype.getLength = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
};
PIXI.Point.prototype.to = function(target){
	target.x = this.x;
	target.y = this.y;
};


if (!CCV)
	CCV = {};

if (!CCV.global){
	CCV.global = {
		RED: 0xFF3E29,
		BLUE: 0xADD2EA,
		
		MAGNIFIER_RED: 0xFF1515,
		MAGNIFIER_APPEAR_TIME: .7,
		MAGNIFIER_VANISH_TIME: .3,
		
		DEBUG_LANDSCAPE_GFX: false,
		DEBUG_SCENE_GFX: false,
		DEBUG_SCENE_MARGINS: false,
		DEBUG_PERFORMANCE: true,
		
		FPS: 8,
		GLOBAL_VOLUME: 0.0,
		RANDOM_INDEX: true,
		AUTO_RENDER: false,
		ACTIVITY_RANGE: 0,
		SOURCE_ALLOW_LARGE: false,
		
		SLIDE_DURATION: 1.6,
		
		HEADER_HEIGHT: 0,
		FOOTER_HEIGHT: 0,
		
		MAGNIFIER_PINCH_AMP: 200,
		MAGNIFIER_PINCH_INCREMENT: .7,
		
		MAGNIFIER_DRAG_IDLE_TEMPO: 12000,
		
		SWIPE_THRESHOLD: 250, /* minimal swipe distance in pixels */
		SWIPE_VIVACITY: 400, /* maximal swipe duration in ms */
		SWIPE_VELOCITY: 300 /* px per second */
	};
}

if (!CCV.app)
	CCV.app = {};

// ----------------------------------------------------------------------
// CCV.app.Player
// ----------------------------------------------------------------------
if(!CCV.app.Player){
	
	/**
	 * Singleton PIXI canvas player.
	 * @param target
	 * @param options
	 * @constructor
	 */
	CCV.app.Player = function(target, options){
		
		// ---   build options
		this.target = target;
		this.options = Object.assign({
			forceCanvas: false,
			useSharedTicker: true,
			landscapeHeightReference: 1336,
			landscapeBottomOffset: 200,
			mediaFolder: 'theme/mm/',
			magnifierDisplayStatus: true,
			magnifierRadius: 250,
			configurationFile: 'json/configComplete.json'
		}, options);
		
		// ---   register core options
		CCV.player = this;
		
		
		// ---   create application
		this.application = new PIXI.Application(800, 600, {
			backgroundColor: 0xffffff,
			view:  this.target,
			transparent:  false,
			antialias:  true,
			preserveDrawingBuffer:  false,
			resolution:  1,
			legacy:  false
		}, this.options.forceCanvas, this.options.useSharedTicker);
		if(!CCV.global.AUTO_RENDER)
			this.application.stop();
		
		
		// --- tickers utilities
		
		this.animTicker = new CCV.app.AnimationsTicker();
		
		
		// --- callbacks
		
		this.callbacks = {};
		
		this.callbacks.windowFocus = this.windowFocus.bind(this);
		this.callbacks.windowBlur = this.windowBlur.bind(this);
		
		this.callbacks.resize = this.resize.bind(this);
		
		this.callbacks.swipeContext = {
			name: 'swipeContext',
			active: false,
			startTime: Number.NaN,
			startX: Number.NaN
		};
		this.callbacks.swipeStart = this._swipeStart.bind(this, this.callbacks.swipeContext);
		this.callbacks.swipeEnd = this._swipeEnd.bind(this, this.callbacks.swipeContext);
		
		this.callbacks.magnifierContext = {
			name: 'magnifierContext',
			dragTouch: null,
			pinchTouch: null
		};
		this.callbacks.magnifierDragStart = this._magnifierDragStart.bind(this, this.callbacks.magnifierContext, this.callbacks.swipeContext);
		this.callbacks.magnifierDragMove = this._magnifierDragMove.bind(this, this.callbacks.magnifierContext, this.callbacks.swipeContext);
		this.callbacks.magnifierDragEnd = this._magnifierDragEnd.bind(this, this.callbacks.magnifierContext, this.callbacks.swipeContext);
		
		
		// --- window utilities
		
		// check for Internet Explorer - https://msdn.microsoft.com/en-us/library/ahx1z4fs(VS.80).aspx
		if(/*@cc_on!@*/false) {
			document.onfocusin = this.callbacks.windowFocus;
			document.onfocusout = this.callbacks.windowBlur;
		}
		else {
			window.onfocus = this.callbacks.windowFocus;
			window.onblur = this.callbacks.windowBlur;
		}
		window.onresize = this.callbacks.resize;
		
		
		// --- launch display
		this.resizeInit();
		this.configurationLoad();
	};
	proto = CCV.app.Player.prototype;
	
	// --------------- MODEL UTILITIES
	
	proto.getMode = function(){
		return this.application.renderer instanceof PIXI.WebGLRenderer ? 'WebGL' : 'canvas';
	};
	proto.configurationLoad = function(){
		var self = this;
		
		$.ajax({
			url: this.options.configurationFile,
			dataType: "json",
			method: "GET",
			data: {
				context: KPF.global.PRODUCTION
			},
			error: function(jqXHR, textStatus){
				KPF.utils.error('Unable to load configuration, url: "' + self.options.configurationFile + '", textStatus: "' + textStatus + '"', 'Application.loadConfiguration');
			},
			success: function(data, textStatus){
				KPF.utils.log('Configuration loaded, textStatus: "' + textStatus + '"', 'Application.loadConfiguration');
				self.configurationParse(data);
			}
		});
	};
	proto.configurationParse = function(data){
		
		this.landscape = new CCV.app.Landscape(data.landscape);
		this.application.stage.addChild(this.landscape.view);
		
		this.background = new PIXI.Graphics();
		this.background.beginFill(0x00ff00, 0);
		this.background.drawRect(0, 0, 100, 100);
		this.application.stage.addChild(this.background);
		
		this.magnifier = new CCV.app.Magnifier(this.options.magnifierRadius);
		this.application.stage.addChild(this.magnifier.view);
		
		this.resize();
		
		if(CCV.global.RANDOM_INDEX)
			this.landscape.pickRandomScene(false);
		
		this.initInteractions();
		this.magnifierDisplayToggle(this.options.magnifierDisplayStatus);
		this.windowFocus();
		this.landscape.audio.play();
	};
	
	
	// --------------- USER INTERACTIONS
	
	proto.initInteractions = function(){
		// swipe handling
		this.background.interactive = true;
		this.background
			.on('pointerdown', this.callbacks.swipeStart)
			.on('pointerupoutside', this.callbacks.swipeEnd)
			.on('pointerup',this.callbacks.swipeEnd);
		
		
		// magnifier drag & drop
		this.magnifier.view.interactive = true;
		this.magnifier.view
			.on('pointerdown', this.callbacks.magnifierDragStart)
			.on('pointerup', this.callbacks.magnifierDragEnd)
			.on('pointerupoutside', this.callbacks.magnifierDragEnd)
			.on('pointermove', this.callbacks.magnifierDragMove);
	};
	
	proto._magnifierDragStart = function(magnifierContext, swipeContext, e){
		window.clearTimeout(magnifierContext.idleTimeoutId);
		
		if(!magnifierContext.dragTouch)
			magnifierContext.dragTouch = this._createTouch(e);
		else if(!magnifierContext.pinchTouch){
			magnifierContext.pinchTouch = this._createTouch(e);
			magnifierContext.pinchStartScale = this.magnifier.pinchScale;
			magnifierContext.pinchStartDelta = this._pinchComputeDelta(magnifierContext);
		}
	};
	proto._magnifierDragMove = function(magnifierContext, swipeContext, e){
		var delta, pos;
		
		pos = e.data.getLocalPosition(this.application.stage);
		
		// pinch
		if(magnifierContext.pinchTouch){
			switch(e.data.identifier) {
				case magnifierContext.dragTouch.id:
					magnifierContext.dragTouch.copy(pos);
					break;
				case magnifierContext.pinchTouch.id:
					magnifierContext.pinchTouch.copy(pos);
					break;
			}
			delta = this._pinchComputeDelta(magnifierContext) - magnifierContext.pinchStartDelta;
			delta = KPF.utils.clamp(delta, - CCV.global.MAGNIFIER_PINCH_AMP, CCV.global.MAGNIFIER_PINCH_AMP) / CCV.global.MAGNIFIER_PINCH_AMP;
			this.magnifier.pinchScale = magnifierContext.pinchStartScale + (delta * CCV.global.MAGNIFIER_PINCH_INCREMENT);
		}
		else if(magnifierContext.dragTouch && e.data.identifier == magnifierContext.dragTouch.id){
			this.magnifier.pos = pos;
		}
	};
	proto._magnifierDragEnd = function(magnifierContext, swipeContext, e){
		magnifierContext.dragTouch = null;
		magnifierContext.pinchTouch = null;
		magnifierContext.idleTimeoutId = window.setTimeout(this._magnifierTidy, CCV.global.MAGNIFIER_DRAG_IDLE_TEMPO);
	};
	proto._magnifierTidy = function(doTransition){
		var p, pos;
		
		p = CCV.player;
		pos = {
			x: p.size.x * .5,
			y: p.size.y
		};
		
		if(doTransition === false){
			p.magnifier.pos = pos;
		}
		else{
			TweenMax.to(p.magnifier, .4, Object.create(pos, {
				ease: Circ.easeInOut
			}));
		}
	};
	proto._pinchComputeDelta = function(magnifierContext){
		var delta = new PIXI.Point();
		delta.copy(magnifierContext.pinchTouch);
		delta.minus(magnifierContext.dragTouch);
		return delta.getLength();
	};
	proto._createTouch = function(touch){
		return Object.assign(touch.data.getLocalPosition(CCV.player.application.stage), { id: touch.data.identifier });
	};
	
	proto._swipeStart = function(swipeContext, e){
		if(swipeContext.active)
			return;
		
		swipeContext.active = true;
		swipeContext.startTime = new Date().getTime();
		swipeContext.startX = e.data.getLocalPosition(this.application.stage).x;
	};
	proto._swipeEnd = function(swipeContext, e){
		var deltaX, deltaTime, velocity;
		
		deltaX = e.data.getLocalPosition(this.application.stage).x - swipeContext.startX;
		deltaTime = new Date().getTime() - swipeContext.startTime
		velocity = Math.abs(deltaX) / deltaTime * 1000;
		
		KPF.utils.log('deltaX: ' + deltaX.toFixed(1) + ', velocity: ' + velocity.toFixed(2), 'Player._swipeEnd');
		
		swipeContext.active = false;
		swipeContext.startTime = Number.NaN;
		swipeContext.startX = Number.NaN;
		
		if(Math.abs(deltaX) > CCV.global.SWIPE_THRESHOLD
			&& velocity > CCV.global.SWIPE_VELOCITY
			&& deltaTime > CCV.global.SWIPE_VIVACITY
		){
			this.landscape.move(- deltaX);
		}
	};
	
	proto.magnifierDisplayToggle = function(status){
		this.magnifierDisplayStatus = KPF.utils.isbool(status) ? status : !this.magnifierDisplayStatus;
		KPF.utils.log('magnifierDisplayStatus: ' + this.magnifierDisplayStatus, 'CCV.app.Player');
		
		if(this.magnifierDisplayStatus){
			this._magnifierTidy(false);
			TweenMax.to(this.magnifier, CCV.global.MAGNIFIER_APPEAR_TIME, {
				scale: 1,
				ease: Expo.easeIn,
				overwrite: 'all'
			});
		}
		else{
			TweenMax.to(this.magnifier, CCV.global.MAGNIFIER_VANISH_TIME, {
				scale: 0,
				ease: CustomEase.create('custom', 'M0,0,C0.646,-0.888,0.536,0.894,1,1'),
				overwrite: 'all'
			});
		}
		$(this.target).trigger('magnifierDisplayChange', [this.magnifierDisplayStatus]);
	};
	proto.scenesShowFillToggle = function(status){
		status = KPF.utils.isbool(status) ? status : !this.scenesShowFillStatus;
		this.scenesShowFillStatus = status;
		
		this.landscape.scenes.forEach(function(scene){
			scene.fillStatus = status;
		});
		$(this.target).trigger('scenesShowFillChange', [this.scenesShowFillStatus]);
	};
	
	// --------------- WINDOW UTILITIES
	
	proto.windowBlur = function(){
		KPF.utils.log('Stop application rendering', 'Player.windowBlur');
		this.animTicker.stop();
		this.application.stop();
		PIXI.ticker.shared.stop();
	};
	proto.windowFocus = function(){
		KPF.utils.log('Start application rendering', 'Player.windowFocus');
		PIXI.ticker.shared.start();
		this.animTicker.start();
	};
	proto.resizeInit = function(){
		var maxAvailHeight = screen.height - CCV.global.FOOTER_HEIGHT -CCV.global.HEADER_HEIGHT;
		if(CCV.global.SOURCE_ALLOW_LARGE && maxAvailHeight > .5 * (this.options.landscapeHeightReference + this.options.landscapeBottomOffset)){
			this.scaleFolder = 'x2';
			this.scaleSourceCoef = 1;
		}
		else{
			this.scaleFolder = 'x1';
			this.scaleSourceCoef = .5;
		}
		this.options.landscapeHeightReference *= this.scaleSourceCoef;
		this.options.landscapeBottomOffset *= this.scaleSourceCoef;
		this.options.mediaFolder += this.scaleFolder + '/';
		KPF.utils.log('scale folder: ' + this.scaleFolder + ', scaleSourceCoef: ' + this.scaleSourceCoef.toFixed(1), 'Player.resizeInit');
	};
	proto.resize = function(){
		this.size = new PIXI.Point(window.innerWidth, window.innerHeight);
		this.size.y -= CCV.global.HEADER_HEIGHT;
		this.size.y -= CCV.global.FOOTER_HEIGHT;
		
		this.background.alpha = .2;
		this.background.width = this.size.x;
		this.background.height = this.size.y;
		
		this.application.renderer.resize(this.size.x, this.size.y);
		
		this.scale = Math.min(1, this.size.y / (this.options.landscapeHeightReference + this.options.landscapeBottomOffset));
		KPF.utils.log('application scale: ' + this.scale.toFixed(2), 'Player.resize');
		
		this.magnifier.redraw(this.scale);
		this._magnifierTidy(false);
		
		this.landscape.resize(this.size, this.scale);
	};
	
	
	// --------------- EVENT HANDLERS
	
	proto.triggerIndex = function(index, scene, scenesLen){
		$(this.target).trigger('sceneIndexChange', [index, scene, scenesLen]);
	};
}


// ----------------------------------------------------------------------
// CCV.app.Landscape
// ----------------------------------------------------------------------
if (!CCV.app.Landscape) {
	/**
	 * @constructor
	 * @param data {{scenes:Array}}   data    JSON data holder
	 */
	CCV.app.Landscape = function (data) {
		
		/**
		 * @var {PIXI.Container}
		 */
		this.view = undefined;
		/**
		 * @var {CCV.app.Ground}
		 * @private
		 */
		this.ground = undefined;
		/**
		 * @var {CCV.app.Container}
		 * @private
		 */
		this.scenesScroll = undefined;
		/**
		 * @var {CCV.app.Container}
		 * @private
		 */
		this.scenesCtn = undefined;
		/**
		 * @var {PIXI.Graphics}
		 * @private
		 */
		this.debugGfx = undefined;
		/**
		 * @var {Array.<CCV.app.Scene>}
		 */
		this.scenes = [];
		/**
		 * @var {number}
		 * @private
		 */
		this.index = 0;
		/**
		 * @var {PIXI.Point}
		 * @private
		 */
		this.size = new PIXI.Point();
		/**
		 * @var {Number}
		 * @private
		 */
		this.xCenter = 0;
		
		this.parse(data);
		
		/*
		var separator = KPF.utils.repeat(80, '#');
		KPF.utils.log(separator + '\n' + this.info() + '\n' + separator);
		// */
	};
	proto = CCV.app.Landscape.prototype;
	
	/**
	 * @param size    {PIXI.Point}
	 * @param scale    {Number}
	 */
	proto.resize = function(size, scale){
		var temp;
		
		this.scenesCtn.scale = new PIXI.Point(scale, scale);
		
		this.size = size.clone();
		this.size.scale(1  / scale);
		this.size.round();
		
		this.xCenter = Math.round(this.size.x * .5);
		
		// graphic debug
		this.debugGfx.clear();
		if(CCV.global.DEBUG_LANDSCAPE_GFX){
			temp = .5 * this.size.y;
			this.debugGfx.lineStyle(4, 0x006633, 1);
			this.debugGfx.moveTo(this.xCenter - 20, temp);
			this.debugGfx.lineTo(this.xCenter + 20, temp);
			this.debugGfx.moveTo(this.xCenter, temp - 20);
			this.debugGfx.lineTo(this.xCenter, temp + 20);
			
			// draw scene area
			this.debugGfx.lineStyle();
			this.debugGfx.beginFill(0xff0000, .0);
			this.debugGfx.drawRect(0, 0, this.size.x, CCV.player.options.landscapeHeightReference);
			this.debugGfx.endFill();
			
			// draw ground line
			this.debugGfx.lineStyle();
			this.debugGfx.beginFill(0x0, .0);
			this.debugGfx.drawRect(0, CCV.player.options.landscapeHeightReference, this.size.x, CCV.player.options.landscapeBottomOffset);
			this.debugGfx.endFill();
		}
		
		// reset landscape position
		this.setIndex(this.index, false);
	};
	/**
	 * Returns a string repreaentation of the instance.
	 * @return {string}
	 */
	proto.toString = function () {
		this.info(0);
	};
	/**
	 * Returns a formatted string representation of the instance
	 * @param depth   {Number} formatting depth
	 * @param indentStart   {Boolean}   whether or not indentation should be added on string start
	 * @return {String}
	 */
	proto.info = function (depth, indentStart) {
		var str = '';
		var ilen = this.scenes.length;
		var pattern = KPF.global.FORMAT_INDENT;
		var indent;
		
		if (isNaN(depth))
			depth = 0;
		
		indent = KPF.utils.repeat(depth, pattern);
		if (indentStart === true)
			str = indent;
		
		str += '[Landscape] (' + ilen + ' scenes)';
		for (var i = 0; i < ilen; ++i)
			str += '\n' + indent + pattern + this.scenes[i].info(depth + 1, false);
		return str;
	};
	/**
	 * Parses JSON data holder.
	 * @param data {{scenes:Array}}   data    JSON data holder
	 */
	proto.parse = function (data) {
		var i, ilen, xCurrent;
		
		var options = CCV.player.options;
		var yGround = options.landscapeHeightReference;
		
		
		// --- parse data
		
		if(data.audio)
			this.audio = new CCV.app.AudioChannel(data.audio, null, true);
		
		this.scenes = [];
		for (i = 0, ilen = (data.scenes ? data.scenes.length : 0); i < ilen; ++i)
			this.scenes.push(new CCV.app.Scene(data.scenes[i]));
		
		
		// ---   build view
		
		this.view = new PIXI.Container();
		
		// global container
		this.scenesCtn = new PIXI.Container();
		this.view.addChild(this.scenesCtn);
		
		// scenes scroll container
		this.scenesScroll = new PIXI.Container();
		this.scenesCtn.addChild(this.scenesScroll);
		
		// add scenes
		for(i = 0, ilen = this.scenes.length, xCurrent = 0; i < ilen; ++i) {
			scene = this.scenes[i];
			scene.view.y = yGround - scene.size.y;
			this.scenesScroll.addChild(scene.view);
			xCurrent += scene.marginLeft + scene.marginRight + scene.size.x;
		}
		
		// ground
		this.ground = new CCV.app.Ground(data.ground);
		this.ground.view.position = new PIXI.Point(0, yGround + this.ground.pos.y);
		this.scenesCtn.addChild(this.ground.view);
		
		// debug
		this.debugGfx = new PIXI.Graphics();
		this.scenesCtn.addChild(this.debugGfx);
		
		// ---   initial positionning
		this.scenes[0].view.x = this.scenes[0].marginLeft;
		this._reArrangeScenesFrom(0);
	};
	/**
	 * Picks a random indexable scene.
	 * @param doTransition  {Boolean}
	 */
	proto.pickRandomScene = function(doTransition){
		var index, indexFormer;
		
		indexFormer = this.index;
		while(!KPF.utils.isan(index) || indexFormer == index){
			index = KPF.utils.randomInt(0, this.scenes.length - 1);
			if(!this.scenes[index].indexable){
				index = Number.NaN;
			}
		}
		doTransition = doTransition !== false;
		
		KPF.utils.log('index: ' + index + ', doTransition: ' + doTransition, 'CCV.app.Landscape.pickRandomScene');
		this.setIndex(index, doTransition);
	};
	/**
	 * @param orientation {Number}
	 */
	proto.move = function (orientation) {
		if (orientation == 0)
			return;
		this.setIndex(this.index + (orientation > 0 ? 1 : -1));
	};
	/**
	 * @param index {Number}
	 * @param doTransition {Boolean}
	 */
	proto.setIndex = function (index, doTransition) {
		var i, ilen, xTarget, delta, deltaMin, deltaMax;
		
		
		//KPF.utils.log('index: ' + index, 'Landscape.setIndex');
		
		doTransition = doTransition !== false;
		ilen = this.scenes.length;
		if (ilen == 0) {
			KPF.log('[CCV.app.Landscape.setSceneIndex] Illegal call; scenes is empty');
			return;
		}
		
		// --- constrain index
		if (index < 0)
			index = ilen - 1;
		else if (index > ilen - 1)
			index = 0;
		this.index = parseInt(index);
		
		deltaMin = - Math.floor(ilen / 2);
		deltaMax = Math.floor(ilen / 2);
		for(i = 0; i < ilen; ++i){
			delta = i - this.index;
			if(delta < deltaMin)
				delta += ilen;
			else if(delta > deltaMax)
				delta -= ilen;
			this.scenes[i].activateDisplay(delta);
		}
		
		this._reArrangeScenesFrom(this.index);
		
		// --- apply position
		scene = this.scenes[this.index];
		xTarget = this.xCenter - scene.view.x - scene.xCenter;
		
		if(doTransition){
			TweenMax.to(this.scenesScroll, CCV.global.SLIDE_DURATION, {
				x: xTarget,
				ease: Expo.easeInOut
			});
		}
		else{
			this.scenesScroll.x = xTarget;
		}
		KPF.utils.log('index: ' + this.index + ' (scene #' + this.scenes[this.index].id + '), xTarget: ' + xTarget, 'CCV.app.Landscape.setIndex');
		CCV.player.triggerIndex(this.index, this.scenes[this.index], this.scenes.length);
	};
	/** @private */
	proto._reArrangeScenesFrom = function(index){
		var i, ilen, scene, xPos, clampedIndex, itemsBefore = 3;
		
		//console.log('_reArrangeScenesFrom: ' + index + ', #' + this.scenes[index].id);
		
		// items before
		scene = this.scenes[index];
		xPos = scene.view.x - scene.marginLeft;
		for(i = 1, ilen = this.scenes.length; i <= itemsBefore; ++i) {
			clampedIndex = index - i;
			while(clampedIndex < 0)
				clampedIndex += ilen;
			clampedIndex %= ilen;
			
			
			scene = this.scenes[clampedIndex];
			xPos -= scene.size.x + scene.marginRight;
			
			//console.log('\t - before: ' + clampedIndex + ', scene #' + scene.id + ', xPos: ' + xPos);
			scene.view.x = xPos;
			
			xPos -= scene.marginLeft;
		}
		
		// current item
		scene = this.scenes[index];
		xPos = scene.view.x + scene.size.x + scene.marginRight;
		//console.log('\t - current: ' + index + ', scene #' + scene.id + ', xPos: ' + xPos);
		
		// items after
		for(i = 1, ilen = this.scenes.length; i < ilen - itemsBefore; ++i) {
			clampedIndex = index + i;
			while(clampedIndex < 0)
				clampedIndex += ilen;
			clampedIndex %= ilen;
			
			scene = this.scenes[clampedIndex];
			xPos += scene.marginLeft;
			scene.view.x = xPos;
			//console.log('\t - after: ' + clampedIndex + ', scene #' + scene.id + ', xPos: ' + xPos);
			
			xPos += scene.size.x + scene.marginRight;
		}
	};
}


// ----------------------------------------------------------------------
// CCV.app.Scene
// ----------------------------------------------------------------------
if (!CCV.app.Scene) {
	/**
	 * @param data {object}   data    JSON data holder
	 * @constructor
	 */
	CCV.app.Scene = function (data) {
		this.id = data.id;
		this.folder = CCV.player.options.mediaFolder + data.folder + '/';
		this.indexable = data.indexable !== false;
		
		this.marginLeft = data.marginLeft * CCV.player.scaleSourceCoef;
		this.marginRight = data.marginRight * CCV.player.scaleSourceCoef;
		this.size = new PIXI.Point(data.size.x, data.size.y);
		this.size.scale(CCV.player.scaleSourceCoef);
		
		this.xCenter = Math.round(.5 * this.size.x);
		
		this.red = new CCV.app.CompoLayer(data.red);
		
		if(data.audio){
			this.audio = new CCV.app.AudioChannel(data.audio, this);
		}
		
		if(data.red){
			this.redOutline = this.red.addLayer(data.red.outline, this);
			this.redFill = this.red.addLayer(data.red.fill, this);
		}
		
		this.blue = this.factoryModel(data.blue);
		
		this.viewBuild();
	};
	proto = CCV.app.Scene.prototype;
	
	/**
	 * Returns a string representation of the instance.
	 * @return {string}
	 */
	proto.toString = function () {
		return this.info(0);
	};
	/**
	 * Returns a formatted string representation of the instance
	 * @param depth   {number} formatting depth
	 * @param indentStart   {boolean}   whether or not indentation should be added on string start
	 * @return {string}
	 */
	proto.info = function (depth, indentStart) {
		var str = '';
		var pattern = KPF.global.FORMAT_INDENT;
		var indent;
		
		if (isNaN(depth))
			depth = 0;
		
		indent = KPF.utils.repeat(depth, pattern);
		if (indentStart === true)
			str = indent;
		
		str += '[Scene] #' + this.id;
		if (this.redFill)
			str += '\n' + indent + pattern + 'redFill: ' + this.redFill.info(depth + 1, false);
		if (this.redOutline)
			str += '\n' + indent + pattern + 'redOutline: ' + this.redOutline.info(depth + 1, false);
		if (this.blue)
			str += '\n' + indent + pattern + 'blue: ' + this.blue.info(depth + 1, false);
		return str;
	};

	proto.factoryModel = function (data) {
		if (data) {
			if (KPF.utils.isarray(data))
				return new CCV.app.CompoLayer(data, this);
			else if (data.hasOwnProperty('video'))
				return new CCV.app.VideoLayer(data, this);
			else if (data.hasOwnProperty('seqEnd'))
				return new CCV.app.LayerSequence(data, this);
			else
				return new CCV.app.Layer(data, this);
		}
		return null;
	};
	proto.viewBuild = function () {
		var debug, gfx, text, createMarker, textStyle = {
			fontFamily: 'Verdana',
			fontSize: 12,
			fill: 0x0
		};
		
		this.view = new PIXI.Container();
		
		// ---   elements views
		if(this.blue && this.blue.view){
			this.view.addChild(this.blue.view);
		}
		if(this.redFill && this.redFill.view){
			this.redFill.view.blendMode = PIXI.BLEND_MODES.MULTIPLY;
			this.view.addChild(this.redFill.view);
		}
		if(this.redOutline && this.redOutline.view){
			this.redOutline.view.blendMode = PIXI.BLEND_MODES.MULTIPLY;
			this.view.addChild(this.redOutline.view);
		}
		
		// ---   debug markers
		if (CCV.global.DEBUG_SCENE_GFX) {
			
			debug = new PIXI.Container();
			
			gfx = new PIXI.Graphics();
			gfx.lineStyle(2, 0xff0000, 1);
			gfx.drawRect(0, 0, this.size.x, this.size.y);
			debug.addChild(gfx);
			
			if(CCV.global.DEBUG_SCENE_MARGINS){
				gfx = new PIXI.Graphics();
				gfx.lineStyle(2, 0x00ff00, 1);
				gfx.drawRect(-this.marginLeft, 0, this.marginLeft, this.size.y);
				debug.addChild(gfx);
				
				gfx = new PIXI.Graphics();
				gfx.lineStyle(2, 0x0000ff, 1);
				gfx.drawRect(this.size.x, 0, this.marginRight, this.size.y);
				debug.addChild(gfx);
			}
			
			text = new PIXI.Text('#' + this.id, textStyle);
			text.position = new PIXI.Point(10, 10);
			debug.addChild(text);
			
			createMarker = function(pos, color, thickness){
				var gfx = new PIXI.Graphics();
				gfx.lineStyle(thickness, color, 1);
				gfx.drawCircle(pos.x, pos.y, 10);
				gfx.moveTo(pos.x, pos.y);
				gfx.lineTo(pos.x + 20, pos.y);
				gfx.moveTo(pos.x, pos.y);
				gfx.lineTo(pos.x, pos.y + 20);
				return gfx;
			};
			
			if (this.red)
				debug.addChild(createMarker(this.red.pos || new PIXI.Point(0, 0), 0xff0000, 3));
			if (this.blue)
				debug.addChild(createMarker(this.blue.pos || new PIXI.Point(0, 0), 0x0000ff, 1));
			
			debug.cacheAsBitmap = true;
			this.view.addChild(debug);
		}
	};
	proto.activateDisplay = function(delta) {
		var volumeTarget, panTarget, status;
		
		status = Math.abs(delta) <= CCV.global.ACTIVITY_RANGE;
		
		if(this.audio){
			volumeTarget = status ? 1 : Math.max(0, 1 - 0.6 * Math.abs(delta));
			panTarget = KPF.utils.clamp(delta * .6, -1, 1);
			if(!this.audio.isPlaying()){
				startAtValues = {
					volume: 0
				}
			}
			TweenMax.to(this.audio, CCV.global.SLIDE_DURATION, {
				volume: volumeTarget,
				pan: panTarget,
				delay: .3,
				onUpdate: this.audio.render.bind(this.audio)
			});
			if(volumeTarget > 0 && !this.audio.isPlaying()){
				this.audio.play();
				this.audio.render();
			}
		}
		$(this).trigger('displayStateChange', [status]);
	};
}


// ----------------------------------------------------------------------
// CCV.app.Layer
// ----------------------------------------------------------------------
if (!CCV.app.Layer) {
	/**
	 * Single frame layer model.
	 *
	 * @param data    Object  JSON formatted data holder
	 * @param scene   CCV.app.Scene   context scene
	 * @constructor
	 */
	CCV.app.Layer = function (data, scene) {
		this.file = scene.folder + data.file;
		this.pos = new PIXI.Point();
		if(data.pos)
			this.pos.copy(data.pos);
		this.pos.scale(CCV.player.scaleSourceCoef);
		
		this.view = PIXI.Sprite.fromImage(this.file);
	};
	proto = CCV.app.Layer.prototype;
	
	/**
	 * Returns a string representation of the instance
	 * @return {string}
	 */
	proto.toString = function () {
		return this.info(0);
	};
	/**
	 * Returns a formatted string representation of the instance
	 * @param depth   Number   formatting depth
	 * @param indentStart   Boolean   whether or not indentation should be added on string start
	 * @return {string}
	 */
	proto.info = function (depth, indentStart) {
		var pattern = KPF.global.FORMAT_INDENT;
		var str;
		
		str = (indentStart === true) ? KPF.utils.repeat(depth || 0, pattern) : '';
		str += '[Layer] file: "' + this.file + '"';
		return str;
	}
}


// ----------------------------------------------------------------------
// CCV.app.LayerSequence
// ----------------------------------------------------------------------
if (!CCV.app.LayerSequence) {
	/**
	 * Multiple frame layer model.
	 * @param data    object   JSON formatted data holder
	 * @param scene   CCV.app.Scene   context scene
	 * @constructor
	 */
	CCV.app.LayerSequence = function (data, scene) {
		this.scene = scene;
		
		this.parse(data);
		
		this.view = new PIXI.Container();
		
		if(data.hasOwnProperty('preview')) {
			this.preview = new PIXI.Sprite(new PIXI.Texture.fromImage(this.scene.folder + data.preview));
			//this.preview.cacheAsBitmap = true;
			this.view.addChild(this.preview);
		}
		
		this.active = undefined;
		$(this.scene).on('displayStateChange', this.activateDisplay.bind(this));
		this.activateDisplay(null, false);
	};
	proto = CCV.app.LayerSequence.prototype;
	
	proto.parse = function(data){
		this.pos = new PIXI.Point(0, 0);
		if(data.pos)
			this.pos.copy(data.pos);
		this.pos.scale(CCV.player.scaleSourceCoef);
		
		this.seqNumLength = data.seqNumLength || -1;
		this.seqStart = data.seqStart || 1;
		this.seqEnd = data.seqEnd || 1;
		
		this.file = data.file;
		
		this.loop = data.loop !== false;
	};
	proto.toString = function () {
		return this.info(0);
	};
	proto.info = function (depth, indentStart) {
		var str;
		
		str = (indentStart === true) ? KPF.utils.repeat(depth || 0, KPF.global.FORMAT_INDENT) : '';
		str += '[LayerSequence] ' + (this.seqEnd - this.seqStart) + ' frames [' + this.seqStart + ' -> ' + this.seqEnd + ']';
		return str;
	};
	proto.activateDisplay = function(e, status){
		
		// --- change active status or die
		status = status !== false;
		if(this.active === status)
			return;
		this.active = status;
		
		if(this.preview){
			//this.preview.visible = !status;
		}
		
		// active --> launch animmation
		// .... OR
		// inactive but no preview exist --> stop animmation
		if(this.active || !this.preview) {
			if(!this.animation)
				this._createAnimation();
			CCV.player.animTicker.addAnimation(this.animation);
		}
		
		else if(this.animation){
			CCV.player.animTicker.removeAnimation(this.animation);
			this.view.removeChild(this.animation);
			this.animation.texture.destroy(true);
			this.animation.destroy();
			this.animation = null;
		}
	};
	
	proto._createAnimation = function() {
		var i, index, file;
		// create textures
		this.textures = [];
		for (i = this.seqStart; i < this.seqEnd; ++i) {
			index = this.seqNumLength > 0 ? KPF.utils.fillTo(i, this.seqNumLength, '0') : this.seqStart + i;
			file = this.scene.folder + this.file.replace('[NUM]', index);
			this.textures.push(new PIXI.Texture.fromImage(file));
		}
		
		// create animation
		this.animation = new PIXI.extras.AnimatedSprite(this.textures, false);
		this.animation.textures = this.textures;
		this.animation.gotoAndStop(1);
		this.view.addChild(this.animation);
		
		//console.log('create animation at: ' + this.scene.id + '\n' + this.info(0));
	};
}


// ----------------------------------------------------------------------
// CCV.app.CompoLayer
// ----------------------------------------------------------------------
if (!CCV.app.CompoLayer) {
	
	/**
	 * Composite layer model.
	 * @param data    object   JSON formatted data holder
	 * @param scene   CCV.app.Scene   context scene
	 * @constructor
	 */
	CCV.app.CompoLayer = function (data, scene) {
		this.pos = new PIXI.Point(0, 0);
		this.layers = [];
		
		if(!data)
			return;
		
		if(data.pos)
			this.pos.copy(data.pos);
		this.pos.scale(CCV.player.scaleSourceCoef);
		
		for (var i = 0, ilen = data.length; i < ilen; ++i)
			this.addLayer(data[i], scene);
	};
	proto = CCV.app.CompoLayer.prototype;
	
	proto.addLayer = function(data, scene){
		var view = scene.factoryModel(data);
		this.layers.push(view);
		return view;
	};
	
	/**
	 * Returns a string representation of the instance
	 * @return {string}
	 */
	proto.toString = function () {
		return this.info(0);
	};
	/**
	 * Returns a formatted string representation of the instance
	 * @param   {number}    depth          formatting depth
	 * @param   {boolean}   indentStart    whether or not indentation should be added on string start
	 * @return  {string}
	 */
	proto.info = function (depth, indentStart) {
		var str;
		var pattern = KPF.global.FORMAT_INDENT;
		var indent;
		var ilen = this.layers.length;
		
		if (isNaN(depth))
			depth = 0;
		
		indent = KPF.utils.repeat(depth, pattern);
		
		str = (indentStart === true) ? indent : '';
		str += '[CompoLayer] ' + ilen + ' layers';
		for (var i = 0; i < ilen; ++i)
			str += '\n' + this.layers[i].info(depth + 1, true);
		return str;
	}
}


// ----------------------------------------------------------------------
// CCV.app.VideoLayer
// ----------------------------------------------------------------------
if (!CCV.app.VideoLayer){
	
	/**
	 * @param data
	 * @param scene
	 * @constructor
	 */
	CCV.app.VideoLayer = function (data, scene) {
		this.scene = scene;
		
		this.file = this.scene.folder + data.video;
		
		this.loop = data.loop !== false;
		
		this.pos = new PIXI.Point(0, 0);
		if(data.pos)
			this.pos.copy(data.pos);
		this.pos.scale(CCV.player.scaleSourceCoef);
		this.pos.floor();
		
		// build view
		this.view = new PIXI.Container();
		
		this.preview = PIXI.Sprite.fromImage(this.scene.folder + data.preview);
		this.view.addChild(this.preview);
		
		// handle activation changes
		this.active = undefined;
		$(this.scene).on('displayStateChange', this.activateDisplay.bind(this));
		this.activateDisplay(null, false);
	};
	proto = CCV.app.VideoLayer.prototype;
	
	/**
	 * Returns a string representation of the instance
	 * @return {string}
	 */
	proto.toString = function () {
		return this.info(0);
	};
	/**
	 * Returns a formatted string representation of the instance
	 * @param depth   Number   formatting depth
	 * @param indentStart   Boolean   whether or not indentation should be added on string start
	 * @return {string}
	 */
	proto.info = function (depth, indentStart) {
		var pattern = KPF.global.FORMAT_INDENT;
		var str;
		
		str = (indentStart === true) ? KPF.utils.repeat(depth || 0, pattern) : '';
		str += '[VideoLayer] file: "' + this.file + '"';
		return str;
	};
	proto.pause = function() {
		this.videoSource.pause();
	};
	proto.resume = function() {
		this.videoSource.play();
	};
	proto.activateDisplay = function(e, status) {
		
		// --- change active status or die
		status = status !== false;
		if(this.active === status)
			return;
		this.active = status;
		
		if(this.preview){
			// this.preview.visible = !status;
		}
		
		// active --> launch animmation
		if(this.active) {
			if(!this.video)
				this._createVideo();
		}
		// inactive but no preview exist --> stop animmation
		else{
			if(!this.preview) {
				if(!this.video)
					this._createVideo();
			}
			// inactive but a preview exists --> display preview
			else if(this.video)
				this._destroyVideo();
		}
	};
	proto._destroyVideo = function(){
		KPF.utils.log('', 'VideoLayer._destroyVideo');
		
		if(!this.texture || !this.video)
			return;
		
		this.texture.destroy(true);
		this.texture = null;
		
		this.view.removeChild(this.video);
		this.video.destroy();
		this.video = null;
		
		/** @see http://stackoverflow.com/questions/3258587/how-to-properly-unload-destroy-a-video-element */
		$(this.videoSource).each(function(){
			this.pause();
			$(this).empty();
			$(this).remove();
			delete this;
		});
		this.videoSource = null;
	};
	proto._createVideo = function(){
		KPF.utils.log('file: ' + this.file, 'VideoLayer._createVideo');
		
		this.texture = PIXI.Texture.fromVideoUrl(this.file);
		this.videoSource = this.texture.baseTexture.source;
		this.videoSource.loop = this.loop;
		
		this.video = new PIXI.Sprite(this.texture);
		this.video.width = this.scene.size.x;
		this.video.height = this.scene.size.y;
		this.view.addChild(this.video);
	};
}




// ----------------------------------------------------------------------
// CCV.app.Ground
// ----------------------------------------------------------------------
if (!CCV.app.Ground){
	
	/**
	 * Ground line model.
	 * @param data    object   JSON formatted data holder
	 * @constructor
	 */
	CCV.app.Ground = function (data) {
		var mmSprite;
		
		this.file = CCV.player.options.mediaFolder + data.file;
		
		this.pos = new PIXI.Point(data.pos.x, data.pos.y);
		this.pos.scale(CCV.player.scaleSourceCoef);
		
		this.size = new PIXI.Point(data.size.x, data.size.y);
		this.size.scale(CCV.player.scaleSourceCoef);
		
		this.view = new PIXI.Container();
		
		mmSprite = PIXI.Sprite.fromImage(this.file);
		mmSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
		this.view.addChild(mmSprite);
		
		mmSprite = PIXI.Sprite.fromImage(this.file);
		mmSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
		mmSprite.position = new PIXI.Point(this.size.x, 0);
		this.view.addChild(mmSprite);
	};
}


// ----------------------------------------------------------------------
// CCV.app.Magnifier
// ----------------------------------------------------------------------
if(!CCV.app.Magnifier){
	/**
	 * @param radius           {Number} magnifier radius
	 * @constructor
	 */
	CCV.app.Magnifier = function(radius){
		this.radius = radius;
		
		this.view = new PIXI.Container();
		
		
		this.gfx = new PIXI.Graphics();
		this.gfx.blendMode = PIXI.BLEND_MODES.MULTIPLY;
		this.gfx.scale = new PIXI.Point(1, 1);
		this.view.addChild(this.gfx);
		
		/**
		 * @type {number}
		 * @private
		 */
		this._scale = 0;
		/**
		 * @type {number}
		 * @private
		 */
		this._x = 0;
		/**
		 * @type {number}
		 * @private
		 */
		this._y = 0;
		
		Object.defineProperty(this, 'pinchScale', {
			get: function(){
				return this.gfx.scale ? this.gfx.scale.x : 1;
			},
			set: function(pinchScale){
				pinchScale = KPF.utils.clamp(pinchScale, 1 - CCV.global.MAGNIFIER_PINCH_INCREMENT, 1 + CCV.global.MAGNIFIER_PINCH_INCREMENT);
				this.gfx.scale = new PIXI.Point(pinchScale, pinchScale);
			}
		});
		Object.defineProperty(this, 'scale', {
			get: function(){
				return this.view.scale.x;
			},
			set: function(scale){
				this._scale = scale;
				this._render();
			}
		});
		Object.defineProperty(this, 'x', {
			get: function(){
				return this._x;
			},
			set: function(x){
				this._x = x;
				this._render();
			}
		});
		Object.defineProperty(this, 'y', {
			get: function(){
				return this._y;
			},
			set: function(y){
				this._y = y;
				this._render();
			}
		});
		Object.defineProperty(this, 'pos', {
			get: function(){
				return {
					x: this._x,
					y: this._y
				};
			},
			set: function(pos){
				this._x = pos.x;
				this._y = pos.y;
				this._render();
			}
		});
		this.scale = 0;
	};
	proto = CCV.app.Magnifier.prototype;
	
	proto.redraw = function(scale){
		this.gfx.clear();
		this.gfx.beginFill(CCV.global.MAGNIFIER_RED);
		this.gfx.drawCircle(0, 0, this.radius * CCV.player.scaleSourceCoef * scale);
		this.gfx.endFill();
	};
	/** @private */
	proto._render = function(){
		var pos = new PIXI.Point(this._x, this._y);
		pos.to(this.view);
		this.view.scale.copy({ x: this._scale, y: this._scale });
	}
}




// ###################################################################################################################  PLAYER UTILITIES


// ----------------------------------------------------------------------
// CCV.app.AnimationsTicker
// ----------------------------------------------------------------------
if(!CCV.app.AnimationsTicker){
	
	/**
	 * Global ticker for PIXI animations to provide support for FPS configuration.
	 * @constructor
	 */
	CCV.app.AnimationsTicker = function(){
		this.askRenderCallback = this.askRender.bind(this);
		this.askRenderTimeoutId = null;
		
		this.scheduled = false;
		this.deltaTime = Date.now();
		this.time = 0;
		
		/** @var Array.<PIXI.extras.AnimatedSprite> */
		this.animations = [];
		
		this.start();
		
	};
	proto = CCV.app.AnimationsTicker.prototype;
	
	proto.start = function(){
		this.askRender();
	};
	proto.stop = function(){
		clearTimeout(this.askRenderTimeoutId);
	};
	proto.addAnimation = function(animation){
		if(this.animations.indexOf(animation) < 0)
			this.animations.push(animation);
	};
	proto.removeAnimation = function(animation){
		var index = this.animations.indexOf(animation);
		if(index >= 0)
			this.animations.splice(index, 1);
	};
	proto.askRender = function(){
		
		// ---   handle delayed calls
		this.scheduled = false;
		this.deltaTime = Date.now() - this.time;
		if (this.deltaTime < 1000 / CCV.global.FPS) {
			if(!this.scheduled) {
				this.scheduled = true;
				this.askRenderTimeoutId = setTimeout(this.askRenderCallback, 1000 / CCV.global.FPS - this.deltaTime);
			}
			return;
		}
		this.time += this.deltaTime;
		
		if(!CCV.global.AUTO_RENDER){
			//CCV.player.application.render();
		}
		
		for(var i = 0, ilen = this.animations.length, a, t, c; i < ilen; ++i){
			a = this.animations[i];
			t = a.totalFrames;
			c = a.currentFrame;
			a.gotoAndStop(t == 1 ? 0 : (c < t) ? c + 1 : 0);
		}
		
		requestAnimationFrame(this.askRenderCallback);
	};
}


// ----------------------------------------------------------------------
// CCV.app.AudioChannel
// ----------------------------------------------------------------------
if(!CCV.app.AudioChannel){
	
	/**
	 * @param data
	 * @param scene
	 * @param autoRender
	 * @constructor
	 */
	CCV.app.AudioChannel = function(data, scene, autoRender){
		this.file = (scene ? scene.folder : CCV.player.options.mediaFolder) + data.file;
		this.isLoop = data.isLoop !== false;
		this.isStereo = data.isStereo !== false;
		this.volumeCoef = KPF.utils.isan(data.volume) ? data.volume : 1;
		
		this.autoRender = autoRender === true;
		
		/** @var {Howl} */
		this.sound  = new Howl({
			src: this.file,
			volume: 0
		});
		
		// ---
		this._volume = 1;
		this._pan = 0;
		Object.defineProperty(this, 'pan', {
			get: function(){
				return this._pan;
			},
			set: function(pan){
				this._pan = KPF.utils.clamp(pan, -1, 1);
				if(this.autoRender)
					this.render();
			}
		});
		Object.defineProperty(this, 'volume', {
			get: function(){
				return this._volume;
			},
			set: function(volume){
				this._volume = volume;
				if(this.autoRender)
					this.render();
			}
		});
	};
	proto = CCV.app.AudioChannel.prototype;
	
	proto.isPlaying = function(){
		return this.soundId && this.sound.playing(this.soundId);
	};
	proto.play = function(){
		this.soundId = this.sound.play();
		this.sound.loop(this.isLoop, this.soundId);
		this.render();
	};
	proto.stop = function(){
		if(this.soundId) {
			this.sound.stop(this.soundId);
			this.soundId = null;
		}
	};
	proto.render = function(){
		if(!this.soundId)
			return;
		this.sound.volume(CCV.global.GLOBAL_VOLUME * this.volumeCoef * this._volume, this.soundId);
		this.sound.stereo(this._pan, this.soundId);
	};
	
	
	/**
	 * Returns a string repreaentation of the instance.
	 * @return {string}
	 */
	proto.toString = function(){
		return '[AudioChannel] loop:' + this.loop + ', stereo: ' + this.stereo + ', volumeCoef: ' + this.volumeCoef;
	};
	/**
	 * Returns a formatted string representation of the instance
	 * @param depth   {number} formatting depth
	 * @param indentStart   {boolean}   whether or not indentation should be added on string start
	 * @return {string}
	 */
	proto.info = function (depth, indentStart) {
		var pattern = KPF.global.FORMAT_INDENT;
		var indent = KPF.utils.repeat(depth || 0, pattern);
		var str;
		
		str = (indentStart === true) ? indent : '';
		str += '[AudioChannel] ';
		str += '\n' + indent + pattern + 'file: "' + this.file + '"';
		str += '\n' + indent + pattern + 'loop:' + this.loop + ', stereo: ' + this.stereo + ', volumeCoef: ' + this.volumeCoef;
		return str;
	}
}



