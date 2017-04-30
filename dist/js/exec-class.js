var DGN;
var proto;

DGN = {};

DGN.states = {
	HOME: 'home',
	INFO: 'info',
	HELP: 'help',
	PLAY: 'play'
};

DGN.Application = function (lang) {
	StateMachine.create({
		target: DGN.Application.prototype,
		initial: 'none',
		error: function (eventName, from, to, args, errorCode, errorMessage, originalException) {
			console.log('[StateMachine - DGN.sm] event "' + eventName + '" ; ' + errorMessage);
			if(originalException)
			console.warn(originalException);
		},
		events: [
			{name: 'initialize', from: 'none', to: DGN.states.HOME},
			{name: 'openInfo', from: DGN.states.HOME, to: DGN.states.INFO},
			{name: 'closeInfo', from: DGN.states.INFO, to: DGN.states.HOME},
			{name: 'openHelp', from: [DGN.states.HOME, DGN.states.PLAY], to: DGN.states.HELP},
			{name: 'openPlay', from: DGN.states.HELP, to: DGN.states.PLAY},
			{name: 'closePlay', from: DGN.states.PLAY, to: DGN.states.HOME}
		]
	});
	
	this.cnv = document.getElementById('pixi-stage');
	
	/** @var {CCV.core.Player} */
	if(CCV.player)
		this.player = CCV.player;
	else{
		this.player = CCV.player = new CCV.app.Player(this.cnv, {
				magnifierDisplayStatus: false,
				scenesShowFillStatus: true
			});
	}
	
	/** @var {TimelineMax} */
	this.helpAnimation = null;
	
	/** @var {Number} */
	this.infoIndex = 0;
	
	/** @var {Boolean} */
	this.helpResizedFlag = true;
	
	this.initInteractions();
	this.langSet(lang);
	
	/** @var {Howl} */
	this.soundInterface  = null;
};
proto = DGN.Application.prototype;



// ------------------------------------------------------------------------------------------
//         INITIALIZATION & DATA
// ------------------------------------------------------------------------------------------

proto.initInteractions = function(){
	var self = this, page, pagination;
	
	// ---   application
	
	// buttons interactions
	$('[data-lang]')
		.on('click', function () {
			self.langSet($(this).data('lang'));
		});
	
	
	// ---   home page
	
	// buttons interactions
	$('#home')
		.on('click', 'button.action-info', function () {
			self.openInfo();
		})
		.on('click', 'button.action-play', function () {
			self.openHelp();
		})
		.on('click', '.app-title', function () {
			self.openHelp();
		});
	
	
	// ---   help
	
	// buttons interactions
	$('#help')
		// .on('click', 'button.action-close', function () {
		.on('click', function () {
			self.openPlay();
		});
	
	
	// ---   info
	
	page = $('#info');
	pagination = page.find('.pagination');
	
	// buttons interactions
	page.on('click', 'button.action-home', function () {
		self.closeInfo();
	});
	
	// pagination
	pointer = page.find('.inner-page');
	pointer.each(function (index, el) {
		
		// create items
		$('<div />')
			.on('click', function () {
				self.setInfoIndex(index, true);
			})
			.appendTo(pagination);
		
		// handle swipe
		// @see doc
		$(el).swipe({
			swipe: function (e, direction) {
				if (direction == 'right')
					self.incInfoIndex(-1);
				else if(direction == 'left')
					self.incInfoIndex(1);
			},
			threshold: 50
		});
	});
	
	
	// ---   play
	
	// buttons actions
	pointer = $('#play .footer-menu');
	pointer
		.on('click', '.red-home', function () {
			self.closePlay();
		})
		.on('click', '.red-magnifier', function () {
			self.player.magnifierDisplayToggle();
		})
		.on('click', '.red-help', function () {
			self.openHelp();
		})
		.on('click', '.red-arrow', function () {
			pointer.toggleClass('opened');
		});
};
proto.soundPlay = function(props){
	if(!props || !props.hasOwnProperty('src'))
		return;
	
	if(this.soundInterface){
		if(this.soundInterface._src == props.src)
			return;
		this.soundInterface.fade(this.soundInterface.volume(), 0, 2000);
	}
	
	this.soundInterface = new Howl(Object.assign({
		src: 'ccv/audio/interface.mp3',
		volume: 0,
		buffer: false,
		loop: true,
		autoplay: true,
		onplay: function(){
			this.fade(0, CCV.global.AUDIO_GLOBAL_VOLUME, 8000);
		}
	}, props));
};

proto.onenterstate = function(e, from, to){
	if(KPF.PRODUCTION)
		return;
	
	switch(to){
		case DGN.states.HOME:
		case DGN.states.INFO:
			this.soundPlay({
				src: 'ccv/audio/interface128.mp3',
				loop: false
			});
			break;
		
		case DGN.states.PLAY:
		case DGN.states.HELP:
			this.soundPlay({
				src: 'ccv/audio/landscape128.mp3',
				loop: true
			});
			break;
	}
	var separator = '-------------------------------------------------';
	console.log(separator + '\n'
		+ e + ': [' + from + ' >> ' + to + ']'
		+ '\n' + separator
		);
};
proto.toString = function(){
	return '[DGNApplication] lang: ' + this.lang + ', state: "' + this.current + '"';
};



// ------------------------------------------------------------------------------------------
//         STATE MACHINE & PAGES
// ------------------------------------------------------------------------------------------


proto.oninitialize = function (e, from, to) {
	$('#home').attr('data-pos', 'at-default');
	$('#info').attr('data-pos', 'at-top');
	$('#help').attr('data-pos', 'at-bottom');
	$('#play').attr('data-pos', 'at-bottom');
	
	window.setTimeout(function(){
		$('#home').addClass('sliding');
		$('#info').addClass('sliding');
		$('#help').addClass('sliding');
		$('#play').addClass('sliding');
	}, 250);
	
};
	
proto.onopenInfo = function (e, from, to) {
	this.setInfoIndex(0, false);
	$('#info').attr('data-pos', 'at-default');
	$('#home').attr('data-pos', 'at-bottom');
	
};
proto.oncloseInfo = function (e, from, to) {
	$('#info').attr('data-pos', 'at-top');
	$('#home').attr('data-pos', 'at-default');
};
proto.incInfoIndex = function (increment) {
	this.setInfoIndex(this.infoIndex + increment, true);
};
proto.setInfoIndex = function (index, doTransition) {
	var page, pointer, val, self = this;
	
	doTransition === true;
	
	this.infoIndex = KPF.utils.clamp(index, 0, 2) || 0;
	KPF.utils.log('infoIndex: ' + this.infoIndex, 'Application.setInfoIndex');
	
	page = $('#info');
	page.find('.pagination').children().each(function (index, el) {
		$(el).toggleClass('current', index == self.infoIndex);
	});
	
	pointer = page.find('.inner-pages');
	val = 'translateX(' + (-100 * this.infoIndex) + 'vw)';
	
	if(doTransition){
		TweenMax.to(page.find('.inner-pages'), .4, {
			startAt: {
				transform: pointer.css('transform')
			},
			ease: Circ.easeInOut,
			transform: val
		});
	}
	else{
		 pointer.css({
			 transform: val
		 });
	}
};

proto.onopenHelp = function (e, from, to) {
	if (this.helpResizedFlag)
		return window.setTimeout(this.helpBuild.bind(this, e, from, to), 120);
	this.helpLaunch(e, from, to);
};
proto.helpLaunch = function(e, from, to){
	if(from == DGN.states.PLAY){
		$('#help')
			.addClass('sliding')
			.attr('data-pos', 'at-default');
		$('#play').attr('data-pos', 'at-bottom');
	}
	else if(from == DGN.states.HOME){
		$('#help')
			.addClass('sliding')
			.attr('data-pos', 'at-default');
		$('#home').attr('data-pos', 'at-top');
	}
	this.helpAnimation.restart();
};
proto.helpBuild = function(e, from, to){
	var anim, hand, bg;
	var animSize, handSize, bgSize;
	var startX, endX;
	
	this.helpAnimation = new TimelineMax({
		repeat: -1,
		repeatDelay: .8
	});
	
	// ---   animation #1
	
	anim = $('#help-animation1');
	hand = anim.find('.hand');
	bg = anim.find('.background');
	
	animSize = anim.width();
	handSize = hand.width();
	bgSize = bg.width();
	
	startX = (.5 * animSize) - (.2 * bgSize) - (.77 * handSize);
	endX = startX - (.1 * bgSize);
	
	TweenMax.set(hand, {
		x: endX
	});
	
	// search magnifier
	this.helpAnimation.add(new TweenMax(hand, 1, {
		ease: Power1.easeInOut,
		x: startX
	}));
	// move away
	this.helpAnimation.add(new TweenMax(hand, 1, {
		ease: Power1.easeInOut,
		x: endX
	}), "+=.5");

/* animation #2 */

	anim = $('#help-animation2');
	hand = anim.find('.hand');
	bg = anim.find('.background');
	
	animSize = anim.width();
	handSize = hand.width();
	bgSize = bg.width();
	
	startX = (.5 * animSize) - ((.5 - .64) * bgSize) - (.05 * handSize);
	startXPrime = startX - (.01 * handSize);
	endX = startX + (.1 * bgSize);
	
	
	TweenMax.set(hand, {
		x: endX
	});
	
	// move to button
	this.helpAnimation.add(TweenMax.to(hand, 1, {
		ease: Power1.easeInOut,
		x: startX
	}), "+=.8");
	// click
	this.helpAnimation.add(TweenMax.to(hand, .2, {
		ease: Power1.easeInOut,
		y: 7,
		x: startXPrime
	}));
	// release
	this.helpAnimation.add(TweenMax.to(hand, .12, {
		ease: Power1.easeInOut,
		y: 0,
		x: startX
	}), "+=.1");
	// move away
	this.helpAnimation.add(TweenMax.to(hand, 1, {
		ease: Power1.easeInOut,
		x: endX
	}), "+=.5");
	
	
	this.helpResizedFlag = false;
	this.helpLaunch(e, from, to);
};

proto.onopenPlay = function (e, from, to) {
	this.helpAnimation.stop();
	$('#help').attr('data-pos', 'at-top');
	window.setTimeout(function () {
		$('#help')
			.removeClass('sliding')
			.attr('data-pos', 'at-top');
	}, 300);
	$('#play').attr('data-pos', 'at-default');
};
proto.onclosePlay = function (e, from, to) {
	this.player.activate(false);
	$('#home').attr('data-pos', 'at-default');
	$('#play').attr('data-pos', 'at-bottom');
	window.setTimeout(function () {
		$('#help')
			.removeClass('sliding')
			.attr('data-pos', 'at-bottom');
	}, 300);
};



// ------------------------------------------------------------------------------------------
//          LANGUAGE
// ------------------------------------------------------------------------------------------

/**
 * Defines application language
 * @param lang {String}
 */
proto.langSet = function (lang) {
	if (!lang)
		lang = this.langGetFull();
	else if (lang != 'fr' && lang != 'en')
		lang = 'en';
	this.lang = lang;
	KPF.utils.log('Set application language: ' + this.lang, 'Application.langSet');
	
	$('[data-lang-toggler]').each(function (index, el) {
		$(el).attr('data-lang-toggler', lang);
	});
	
	var isfr = (this.lang == 'fr');
	$('.lang-fr').toggle(isfr);
	$('.lang-en').toggle(!isfr);
};
/**
 * Returns preferred language w/ fallback to browser language
 * @return {String}
 * @private
 */
proto.langGetFull = function () {
	var lang;
	lang = window.navigator.languages ? window.navigator.languages[0] : null;
	lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
	return this.langCleanResults(lang);
};
/**
 * Returns browser native language
 * @return {String}
 * @private
 */
proto.langGetNative = function () {
	return this.langCleanResults(window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage);
};
/**
 * Cleans language results and return language nick (fr, en, etc.)
 * @return {String}
 * @private
 */
proto.langCleanResults = function (v) {
	if (v.indexOf('-') !== -1)
		v = v.split('-')[0];
	if (v.indexOf('_') !== -1)
		v = v.split('_')[0];
	return v;
};


// ------------------------------------------------------------------------------------------
//          GARBAGE CODE
// ------------------------------------------------------------------------------------------

// state machine computed methods - autofill halpers
proto.initialize = function(){};
proto.openInfo = function(){};
proto.closeInfo = function(){};
proto.openHelp = function(){};
proto.openPlay = function(){};
proto.closePlay = function(){};
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
	KPF.utils.roundTo = function(v, precision){
		return Math.round(v/precision) * precision;
	};
	KPF.utils.floorTo = function(v, precision){
		return Math.floor(v/precision) * precision;
	};
	KPF.utils.ceilTo = function(v, precision){
		return Math.ceil(v/precision) * precision;
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
	
	
	KPF.utils.arraySum = function(arr){
		return arr.reduce(function(pv, cv) { return pv + cv; }, 0);
	}
}
var CCV;
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
};

if (!CCV)
	CCV = {};

if (!CCV.utils){
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
}

if (!CCV.global){
	
	CCV.global = {
		RED: 0xFF3E29,
		BLUE: 0xADD2EA,
		
		HEADER_HEIGHT: 0,
		FOOTER_HEIGHT: 0,
		
		SYS_FORCE_CANVAS: true,
		SYS_USE_SHARED_TICKER: true,
		SYS_FPS: 8,
		SYS_ALLOW_LARGE: false,
		
		DEBUG_LANDSCAPE_GFX: false,
		DEBUG_SCENE_GFX: false,
		DEBUG_SCROLL_GFX: false,
		DEBUG_SCENE_MARGINS: false,
		DEBUG_SWIPE: false,
		
		AUDIO_FOLDER: 'ccv/audio/',
		AUDIO_GLOBAL_VOLUME: 0,
		AUDIO_DELTA_VOLUME_COEF: 0.6,
		AUDIO_DELTA_PAN_COEF: 0.6,
		
		SCENE_START_INDEX: 37,
		SCENE_START_RAND: false,
		SCENE_ACTIVATION_DELAY: 2000,
		SCENE_DEACTIVATION_DELAY: 1400,
		SCENE_REPEAT_DELAY: 4000,
		SCENE_RESTART_DELAY: 2000,
		SCENE_SLIDE_DURATION: 1.6,
		SCENE_MAX_HEIGHT: 650,
		SCENE_EXTRAVIEW_COEF: .25,
		SCENE_GROUND_HEIGHT: 100,
		SCENE_ACTIVATE_BORDING_SCENES: false,
		SCENE_ITEM_BEFORE: 10,
		
		MEDIA_FOLDER: 'ccv/',
		
		MAGNIFIER_RED: 0xFF1515,
		MAGNIFIER_PINCH_AMP: 200,
		MAGNIFIER_PINCH_INCREMENT: .5,
		MAGNIFIER_APPEAR_TIME: .7,
		MAGNIFIER_VANISH_TIME: .5,
		MAGNIFIER_RADIUS: 150,
		MAGNIFIER_DRAG_IDLE_TEMPO: -1,
		
		SCROLL_ELASTICITY: .08,
		SCROLL_SWIPE_ELASTICITY: .15,
		SCROLL_PREVIEW_OFFSET: 120,
		SCROLL_MIN_OFFSET: 250,
		
		SWIPE_ENABLED: false,
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
			magnifierDisplayStatus: true,
			scenesShowFillStatus: true,
			configurationFile: 'json/config.json'
		}, options);
		
		// ---   register core options
		CCV.player = this;
		
		this.mediaFolder = '';
		
		
		// ---   create application
		this.application = new PIXI.Application(800, 600, {
			backgroundColor: 0xffffff,
			view:  this.target,
			transparent:  false,
			antialias:  true,
			preserveDrawingBuffer:  false,
			resolution:  1,
			legacy:  false
		}, CCV.global.SYS_FORCE_CANVAS, CCV.global.SYS_USE_SHARED_TICKER);
		
		this.application.stop();
		
		
		// --- tickers utilities
		
		this.animTicker = new CCV.app.AnimationsTicker();
		
		
		// --- callbacks
		
		this.cbks = {};
		
		// window focus/blur
		this.cbks.windowFocus = this.windowFocus.bind(this);
		this.cbks.windowBlur = this.windowBlur.bind(this);
		
		// window resize
		this.cbks.resize = this.resize.bind(this);
		
		// landscape swipe handlers
		this.cbks.swCtx = {
			name: 'swCtx',
			active: false,
			startTime: Number.NaN,
			startX: Number.NaN,
			startScrollPanelX: Number.NaN,
			elasticity: Number.NaN,
			scrollTarget: Number.NaN,
			scrollMin: Number.NaN,
			scrollMax: Number.NaN,
			swipeLockMin: Number.NaN,
			swipeLockMax: Number.NaN
	};
		Object.seal(this.cbks.swCtx);
		
		this.cbks.swipeStart = this._swipeStart.bind(this);
		this.cbks.swipeEnd = this._swipeEnd.bind(this);
		this.cbks.swipeMove = this._swipeMove.bind(this);
		this.cbks.scrollApply = this._scrollApply.bind(this);
		
		// magnifier handlers
		this.cbks.mgCtx = {
			name: 'mgCtx',
			dragTouch: null,
			pinchTouch: null,
			pinchStartScale: Number.NaN,
			pinchStartDelta: Number.NaN,
			idleTimeoutId: null
		};
		Object.seal(this.cbks.mgCtx);
		
		this.cbks.magnifierDragStart = this._mgDragStart.bind(this);
		this.cbks.magnifierDragMove = this._mgDragMove.bind(this);
		this.cbks.magnifierDragEnd = this._mgDragEnd.bind(this);
		
		
		// --- window utilities
		
		// check for Internet Explorer - https://msdn.microsoft.com/en-us/library/ahx1z4fs(VS.80).aspx
		if(/*@cc_on!@*/false) {
			document.onfocusin = this.cbks.windowFocus;
			document.onfocusout = this.cbks.windowBlur;
		}
		else {
			window.onfocus = this.cbks.windowFocus;
			window.onblur = this.cbks.windowBlur;
		}
		window.onresize = this.cbks.resize;
		
		
		// --- launch display
		this.landscapeHeight = CCV.global.SCENE_MAX_HEIGHT;
		this.groundHeight = CCV.global.SCENE_GROUND_HEIGHT;
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
		
		this.magnifier = new CCV.app.Magnifier(CCV.global.MAGNIFIER_RADIUS);
		this.application.stage.addChild(this.magnifier.view);
		
		this.resize();
		
		if(CCV.global.SCENE_START_RAND)
			this.landscape.pickRandomScene(false);
		
		this.initInteractions();
		this.magnifierDisplayToggle(this.options.magnifierDisplayStatus);
		
		this.scenesShowFillToggle(this.options.scenesShowFillStatus !== false);
		this.windowFocus();
		
		$(this.target).trigger('ready', [this.landscape.scenes, this.landscape.scenesIndexed]);
	};
	
	
	// --------------- USER INTERACTIONS
	
	proto.initInteractions = function(){
		// swipe handling
		this.background.interactive = true;
		this.background
			.on('pointerdown', this.cbks.swipeStart)
			.on('pointerupoutside', this.cbks.swipeEnd)
			.on('pointerup',this.cbks.swipeEnd);
		
		
		// magnifier drag & drop
		this.magnifier.view.interactive = true;
		this.magnifier.view.on('pointerdown', this.cbks.magnifierDragStart)
	};
	
	proto._mgDragInteractionsReset = function(){
		this.magnifier.view
			.off('pointerup', this.cbks.magnifierDragEnd)
			.off('pointerupoutside', this.cbks.magnifierDragEnd)
			.off('pointermove', this.cbks.magnifierDragMove);
	};
	proto._mgDragStart = function(e){
		var mgCtx = this.cbks.mgCtx;
		
		if(mgCtx.idleTimeoutId){
			window.clearTimeout(mgCtx.idleTimeoutId);
		}
		
		if(!mgCtx.dragTouch){
			mgCtx.dragTouch = this._createTouch(e);
			this.magnifier.view
				.on('pointerup', this.cbks.magnifierDragEnd)
				.on('pointerupoutside', this.cbks.magnifierDragEnd)
				.on('pointermove', this.cbks.magnifierDragMove);
		}
		else if(!mgCtx.pinchTouch){
			mgCtx.pinchTouch = this._createTouch(e);
			mgCtx.pinchStartScale = this.magnifier.pinchScale;
			mgCtx.pinchStartDelta = this._mgPinchComputeDelta(mgCtx);
		}
	};
	proto._mgDragMove = function(e){
		var mgCtx = this.cbks.mgCtx, delta, pos;
		
		pos = e.data.getLocalPosition(this.application.stage);
		
		// pinch
		if(mgCtx.pinchTouch){
			switch(e.data.identifier) {
				case mgCtx.dragTouch.id:
					mgCtx.dragTouch.copy(pos);
					break;
				case mgCtx.pinchTouch.id:
					mgCtx.pinchTouch.copy(pos);
					break;
				default:
					/*
					// checked use case : three or more touches on magnifier as expected -> clear warning
					KPF.utils.warn('Touch does not correspond to any stored value ; cancel illegal method call', 'Player._mgDragMove', {
						mgCtx: mgCtx,
						dragTouchId: mgCtx.dragTouch.id,
						pinchTouchId: mgCtx.pinchTouch.id,
						currentTouchId: e.data.identifier
					});
					//*/
					return;
			}
			
			delta = this._mgPinchComputeDelta(mgCtx) - mgCtx.pinchStartDelta;
			delta = KPF.utils.clamp(delta, - CCV.global.MAGNIFIER_PINCH_AMP, CCV.global.MAGNIFIER_PINCH_AMP);
			this.magnifier.pinchScale = mgCtx.pinchStartScale + (delta / CCV.global.MAGNIFIER_PINCH_AMP * CCV.global.MAGNIFIER_PINCH_INCREMENT);
		}
		else if(mgCtx.dragTouch && e.data.identifier == mgCtx.dragTouch.id){
			this.magnifier.pos = pos;
		}
	};
	proto._mgDragEnd = function(e){
		var mgCtx = this.cbks.mgCtx;
		 
		mgCtx.dragTouch = null;
		mgCtx.pinchTouch = null;
		mgCtx.pinchStartScale = Number.NaN;
		mgCtx.pinchStartDelta = Number.NaN;
		if(CCV.global.MAGNIFIER_DRAG_IDLE_TEMPO > 0){
			mgCtx.idleTimeoutId = window.setTimeout(this._mgTidy, CCV.global.MAGNIFIER_DRAG_IDLE_TEMPO);
		}
		
		this._mgDragInteractionsReset();
	};
	proto._mgTidy = function(doTransition){
		var p = CCV.player;
		var pos = {
			x: .5 * p.size.x,
			y: .9 * p.size.y
		};
		
		if(doTransition === false){
			p.magnifier.pos = pos;
		}
		else{
			TweenMax.to(p.magnifier, .4, {
				ease: Circ.easeInOut,
				pinchScale: 1,
				x: pos.x,
				y: pos.y
			});
		}
	};
	
	proto._mgPinchComputeDelta = function(mgCtx){
		var delta = new PIXI.Point();
		delta.copy(mgCtx.pinchTouch);
		delta.minus(mgCtx.dragTouch);
		return delta.getLength();
	};
	proto._createTouch = function(touch){
		return Object.assign(touch.data.getLocalPosition(CCV.player.application.stage), { id: touch.data.identifier });
	};
	 
	proto._swipeStart = function(e){
		var swCtx = this.cbks.swCtx;
		
		if(swCtx.active)
			return;
		
		swCtx.active = true;
		swCtx.startTime = new Date().getTime();
		swCtx.startX = e.data.getLocalPosition(this.application.stage).x;
		
		swCtx.scrollMin = Math.floor(this.landscape.xTarget - this.landscape.scrollMin);
		swCtx.swipeLockMin = Math.floor(swCtx.scrollMin - this.landscape.scrollPreview);
		
		swCtx.scrollMax = Math.ceil(this.landscape.xTarget + this.landscape.scrollMin);
		swCtx.swipeLockMax = Math.ceil(swCtx.scrollMax + this.landscape.scrollPreview);
		
		swCtx.elasticity = CCV.global.SCROLL_ELASTICITY;
		swCtx.startScrollPanelX = this.landscape.scenesScroll.x;
		
		this.background.on('pointermove', this.cbks.swipeMove);
		this._swipeMove(e);
		PIXI.ticker.shared.add(this.cbks.scrollApply);
	};
	proto._swipeMove = function(e){
		var swCtx, delta;
		
		swCtx = this.cbks.swCtx;
		delta = (e.data.getLocalPosition(this.application.stage).x - swCtx.startX);
		
		if(delta <= -this.landscape.scrollMin){
			swCtx.scrollTarget = swCtx.swipeLockMin;
			swCtx.elasticity = CCV.global.SCROLL_SWIPE_ELASTICITY;
		}
		else if(delta >= this.landscape.scrollMin){
			swCtx.scrollTarget = swCtx.swipeLockMax;
			swCtx.elasticity = CCV.global.SCROLL_SWIPE_ELASTICITY;
		}
		else{
			swCtx.scrollTarget = swCtx.startScrollPanelX + delta;
			swCtx.elasticity = CCV.global.SCROLL_ELASTICITY;
		}
	};
	proto._scrollApply = function(e){
		var swCtx = this.cbks.swCtx;
		
		if(isNaN(swCtx.scrollTarget))
			return;
		this.landscape.scenesScroll.x -= (this.landscape.scenesScroll.x - swCtx.scrollTarget) * swCtx.elasticity;
	};
	proto._swipeEnd = function(e){
		var swCtx = this.cbks.swCtx;
		
		// --- check drag limits
		if(swCtx.scrollTarget ==  swCtx.swipeLockMin) {
			this.landscape.move(1);
			this._swipeReset();
			return;
		}
		else if(swCtx.scrollTarget ==  swCtx.swipeLockMax){
			this.landscape.move(-1);
			this._swipeReset();
			return;
		}
		
		// --- skip further process if swipe gesture is not enabled
		if(!CCV.global.SWIPE_ENABLED){
			this._swipeReset();
			return;
		}
		
		// --- compute gesture
		var threshold, passThreshold;
		var vicacity, passVivacity;
		var velocity, passVelocity;
		var swipePass;
		var logsCtx = [];
		
		threshold = e.data.getLocalPosition(this.application.stage).x - swCtx.startX;
		if(Math.abs(threshold) < 10){ // avoid clicks pollution
			this._swipeReset();
			return;
		}
		passThreshold = Math.abs(threshold) > CCV.global.SWIPE_THRESHOLD;
		logsCtx.push('threshold: ' + threshold.toFixed(0) + ' (' + passThreshold + ')');
			
		vicacity = (new Date()).getTime() - swCtx.startTime;
		passVivacity = vicacity < CCV.global.SWIPE_VIVACITY;
		logsCtx.push('vicacity: ' + vicacity.toFixed(0) + ' (' + passVivacity + ')');
			
		velocity = Math.abs(threshold) / vicacity * 1000;
		passVelocity = velocity >= CCV.global.SWIPE_VELOCITY;
		logsCtx.push('velocity: ' + velocity.toFixed(0) + ' (' + passVelocity + ')');
		
		// clean gesture context
		this._swipeReset();
		
		// end process
		swipePass = passThreshold && passVivacity && passVelocity;
		if(CCV.global.DEBUG_SWIPE)
			KPF.utils.log((swipePass ? 'Apply' : 'Cancel') + ' swipe gesture', 'Player._swipeEnd', ' // ' + logsCtx.join(', '));
		if(swipePass)
			this.landscape.move(- threshold);
	};
	proto._swipeReset = function(){
		var swCtx = this.cbks.swCtx;
		
		this.background.off('pointermove', this.cbks.swipeMove);
		
		PIXI.ticker.shared.remove(this.cbks.scrollApply);
		
		swCtx.active = false;
		swCtx.startTime = Number.NaN;
		swCtx.startX = Number.NaN;
		
		swCtx.scrollTarget = Number.NaN;
		swCtx.scrollMin = Number.NaN;
		swCtx.scrollMax = Number.NaN;
		swCtx.swipeLockMin = Number.NaN;
		swCtx.swipeLockMax = Number.NaN;
		swCtx.startScrollPanelX = Number.NaN;
	};
	
	proto.magnifierDisplayToggle = function(status){
		this.magnifierDisplayStatus = KPF.utils.isbool(status) ? status : !this.magnifierDisplayStatus;
		KPF.utils.log('magnifierDisplayStatus: ' + this.magnifierDisplayStatus, 'CCV.app.Player');
		
		if(this.magnifierDisplayStatus){
			this._mgTidy(false);
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
		
		KPF.utils.log('scenesShowFillStatus: ' + this.scenesShowFillStatus, 'Player.scenesShowFillToggle')
		
		this.landscape.scenes.forEach(function(scene){
			scene.showFill(status);
		});
		$(this.target).trigger('scenesShowFillChange', [this.scenesShowFillStatus]);
	};
	
	
	// --------------- WINDOW UTILITIES
	
	proto.activate = function(status){
		if(status){
			KPF.utils.log('Start application rendering', 'Player.windowFocus');
			PIXI.ticker.shared.start();
			this.animTicker.start();
		}
		else{
			KPF.utils.log('Stop application rendering', 'Player.activate');
			PIXI.ticker.shared.stop();
			this.animTicker.stop();
			this.application.stop();
		}
	};
	
	proto.windowBlur = function(){
		this.activate(false);
	};
	proto.windowFocus = function(){
		this.activate(true);
	};
	
	proto.resizeInit = function(){
		var maxAvailHeight = window.innerHeight - CCV.global.FOOTER_HEIGHT -CCV.global.HEADER_HEIGHT;
		if(CCV.global.SYS_ALLOW_LARGE && maxAvailHeight > .5 * (CCV.global.SCENE_MAX_HEIGHT + CCV.global.SCENE_GROUND_HEIGHT)){
			this.scaleFolder = 'x2';
			this.scaleSourceCoef = 2;
		}
		else{
			this.scaleFolder = 'x1';
			this.scaleSourceCoef = 1;
		}
		CCV.global.SCENE_MAX_HEIGHT *= this.scaleSourceCoef;
		this.landscapeHeight *= this.scaleSourceCoef;
		this.groundHeight *= this.scaleSourceCoef;
		this.mediaFolder = CCV.global.MEDIA_FOLDER + this.scaleFolder + '/';
		KPF.utils.log('scale folder: ' + this.scaleFolder + ', scaleSourceCoef: ' + this.scaleSourceCoef.toFixed(1), 'Player.resizeInit');
	};
	proto.resize = function(){
		var scaleOverflow = false;
		
		this.size = new PIXI.Point(window.innerWidth, window.innerHeight);
		this.size.y -= CCV.global.HEADER_HEIGHT;
		this.size.y -= CCV.global.FOOTER_HEIGHT;
		
		this.background.width = this.size.x;
		this.background.height = this.size.y;
		
		this.application.renderer.resize(this.size.x, this.size.y);
		
		this.scale = this.size.y / (this.landscapeHeight + this.groundHeight);
		if(this.scale > 1){
			scaleOverflow = true;
			this.scale = 1;
		}
		KPF.utils.log('- application size: ' + this.size.toString()
			+ '\n - application scale: ' + this.scale.toFixed(2)
			+ '\n - scaleOverflow: ' + scaleOverflow,
			'Player.resize');
		
		this.magnifier.redraw(this.scale);
		this._mgTidy(false);
		
		this.landscape.resize(this.size, this.scale);
	};
	
	
	// --------------- EVENT HANDLERS
	
	proto.triggerIndex = function(index, scene, scenesLen){
		$(this.target).trigger('sceneIndexChange', [index, scene, scenesLen]);
	};
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
		this.renderCallback = this.render.bind(this);
		this.renderIntervalId = null;
		this.frameLength = 1000 / CCV.global.SYS_FPS;
		this.running = false;
		 
		/** @var Array.<PIXI.extras.AnimatedSprite> */
		this.sequences = [];
	};
	proto = CCV.app.AnimationsTicker.prototype;
	
	proto.start = function(){
		if(this.running)
			return;
		
		this.running = true;
		this.renderIntervalId = window.setInterval(this.renderCallback, this.frameLength);
		this.render();
	};
	proto.stop = function(){
		if(!this.running)
			this.running = false;
		
		this.running = false;
		window.clearInterval(this.renderIntervalId);
	};
	/**
	 * @param sequence {CCV.app.Sequence}
	 */
	proto.addSequence = function(sequence){
		if(this.sequences.indexOf(sequence) < 0 && sequence.animation.totalFrames > 1) {
			this.sequences.push(sequence);
		}
	};
	/**
	 * @param sequence {CCV.app.Sequence}
	 */
	proto.removeSequence = function(sequence){
		var i = this.sequences.indexOf(sequence);
		if(i >= 0)
			this.sequences.splice(i, 1);
	};
	proto.render = function(e){
		for(var i = 0, ilen = this.sequences.length; i < ilen; i++)
			this.sequences[i].nextFrame();
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
		this.index = CCV.global.SCENE_START_INDEX;
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
		var temp, heightMaxi;
		
		this.scenesCtn.scale = new PIXI.Point(scale, scale);
		
		this.size = size.clone();
		this.size.scale(1 / scale);
		this.size.round();
		
		heightMaxi = CCV.player.landscapeHeight + CCV.player.groundHeight;
		if(this.size.y > heightMaxi){
			this.size.y = heightMaxi;
			this.view.y = Math.round((size.y - this.size.y) * .66);
		}
		else{
			this.view.y = 0;
		}
		
		this.xCenter = Math.round(this.size.x * .5);
		
		// reposition bottom footer
		var gy = this.view.y + (scale * CCV.player.landscapeHeight);
		var dy = CCV.player.size.y - gy;
		var ty = gy + (.5 * dy);
		$('.footer-menu').css('top', ty);
		
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
			this.debugGfx.beginFill(0xff0000, .2);
			this.debugGfx.drawRect(0, 0, this.size.x, CCV.player.landscapeHeight);
			this.debugGfx.endFill();
			
			// draw ground line
			this.debugGfx.lineStyle();
			this.debugGfx.beginFill(0x0, .2);
			this.debugGfx.drawRect(0, CCV.player.landscapeHeight, this.size.x, CCV.player.groundHeight);
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
		var i, ilen, scene, formerScene, xPos, scenesPositions, yGround;
		
		// --- parse scenes data
		this.scenes = [];
		this.scenesIndexed = [];
		for (i = 0, ilen = (data.scenes ? data.scenes.length : 0); i < ilen; ++i) {
			scene = new CCV.app.Scene(data.scenes[i]);
			if(scene.id != '_debug' || CCV.global.DEBUG_LANDSCAPE_GFX){
				if(scene.indexable)
					this.scenesIndexed.push({
						index: this.scenes.length,
						scene: scene
					});
				this.scenes.push(scene);
			}
		}
		// ---   build view
		
		this.view = new PIXI.Container();
		
		// global container
		this.scenesCtn = new PIXI.Container();
		this.view.addChild(this.scenesCtn);
		
		// scenes scroll container
		this.scenesScroll = new PIXI.Container();
		this.scenesCtn.addChild(this.scenesScroll);
		
		// add scenes and define scenes positions
		yGround = CCV.player.landscapeHeight;
		
		scenesPositions = [];
		for(i = 0, ilen = this.scenes.length, xPos = 0; i < ilen; ++i) {
			scene = this.scenes[i];
			
			// left position part
			xPos += scene.marginLeft;
			
			// assign position
			scene.view.x = xPos;
			scene.view.y = yGround - scene.size.y;
			
			// store
			scenesPositions.push(xPos);
			
			// right position part
			xPos += scene.size.x + scene.pos.x;
			
			// append scene to view
			this.scenesScroll.addChild(scene.view);
			if(scene.popUnder && formerScene)
				this.scenesScroll.swapChildren(scene.view, formerScene.view);
			formerScene = scene;
		}
		
		// compute scenes widths and remove last utility scene (#_end)
		this.scenesWidths = [];
		for(i = 1, ilen = scenesPositions.length; i < ilen; ++i)
			this.scenesWidths.push(scenesPositions[i] - scenesPositions[i - 1]);
		this.scenes.pop();
		
		// ground
		this.ground = new CCV.app.Ground(data.ground);
		this.ground.view.position = new PIXI.Point(0, yGround + this.ground.pos.y);
		this.scenesScroll.addChild(this.ground.view);
		
		// debug
		this.debugGfx = new PIXI.Graphics();
		this.scenesCtn.addChild(this.debugGfx);
		
		// debug amplitude
		this.scrollDebugGfx = new PIXI.Graphics();
		this.scenesScroll.addChild(this.scrollDebugGfx);
		
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
	proto.move = function (orientation, indexedOnly) {
		var newval;
		
		indexedOnly = indexedOnly !== false;
		
		if(indexedOnly){
			for(var i = 0, ilen = this.scenesIndexed.length, beforeScene, afterScene, equalScene; i <= ilen; ++i){
				if(i == ilen || this.scenesIndexed[i].index > this.index){
					afterScene = this.scenesIndexed[i % ilen];
					beforeScene = this.scenesIndexed[(i - 1 + ilen) % ilen];
					if(beforeScene.index == this.index){
						equalScene = beforeScene;
						beforeScene = this.scenesIndexed[(i - 2 + ilen) % ilen];
					}
					break;
				}
			}
			
			/*
			KPF.utils.log(
				'move with orientation: ' + orientation + ', indexedOnly: ' + indexedOnly,
				'Landscape.move', {
					afterScene: afterScene,
					equalScene: equalScene,
					beforeScene: beforeScene
				});
			//*/
			
			if (orientation == 0){
				if(equalScene)
					return;
				newval = (Math.abs(beforeScene.index - this.index) < Math.abs(afterScene.index - this.index)) ? beforeScene.index : afterScene.index;
			}
			else if(orientation < 0)
				newval = beforeScene.index;
			else if(orientation > 0)
				newval = afterScene.index;
		}
		else if( orientation == 0)
			return;
		else
			newval = this.index + (orientation > 0 ? 1 : -1);
		this.setIndex(newval, true);
	};
	/**
	 * @param index {Number}
	 * @param doTransition {Boolean}
	 */
	proto.setIndex = function (index, doTransition) {
		var i, ilen, activationDelta, activationDeltaMin, activationDeltaMax, activationTest;
		var limitBefore, limitAfter,  limitDelta;
		var sceneBefore, sceneAfter, sceneCurrent;
		
		doTransition = doTransition !== false;
		ilen = this.scenes.length;
		if (ilen == 0) {
			KPF.log('[CCV.app.Landscape.setSceneIndex] Illegal call; scenes is empty');
			return;
		}
		
		// constrain index
		if (index < 0)
			index = ilen - 1;
		else if (index > ilen - 1)
			index = 0;
		this.index = parseInt(index);
		KPF.utils.log('index: ' + index, 'Landscape.setIndex');
		
		// retrieve bording indexed scenes
		scene = this.scenes[this.index];
		for(i = 0, ilen = this.scenesIndexed.length; i <= ilen; ++i){
			if(i == ilen || this.scenesIndexed[i].index > this.index){
				sceneAfter = this.scenesIndexed[i % ilen];
				sceneBefore = this.scenesIndexed[(i - 1 + ilen) % ilen];
				if(sceneBefore.index == this.index){
					sceneCurrent = sceneBefore;
					sceneBefore = this.scenesIndexed[(i - 2 + ilen) % ilen];
				}
				break;
			}
		}
		
		// activate/deactivate scene according to current scene
		KPF.utils.log('activate sequences between ]#' + sceneBefore.scene.id + ', index:' + sceneBefore.index + '; #' + sceneAfter.scene.id + ', index:' + sceneAfter.index + '[', 'Landscape.setIndex')
		
		ilen = this.scenes.length;
		activationDeltaMax = Math.floor(ilen / 2);
		activationDeltaMin = - activationDeltaMax;
		
		for (i = 0; i < ilen; ++i){
			activationDelta = i - this.index;
			if(activationDelta < activationDeltaMin)
				activationDelta += ilen;
			else if(activationDelta > activationDeltaMax)
				activationDelta -= ilen;
			activationTest = CCV.global.SCENE_ACTIVATE_BORDING_SCENES ?
				(sceneBefore.index > sceneAfter.index) ? (i >= sceneBefore.index) || (i <= sceneAfter.index) : (i >= sceneBefore.index) && (i <= sceneAfter.index) :
				(sceneBefore.index > sceneAfter.index) ? (i > sceneBefore.index) || (i < sceneAfter.index) : (i > sceneBefore.index) && (i < sceneAfter.index);
			if(activationTest){
				KPF.utils.log('\t - activate index: ' + i + ' (' + this.scenes[i].id + ')');
			}
			this.scenes[i].activateDisplay(activationTest, activationDelta);
		}
		
		// rearrange scenes positions
		this._reArrangeScenesFrom(this.index);
		
		// retrieve bording indexed scenes
		scene = this.scenes[this.index];
		for(i = 0, ilen = this.scenesIndexed.length; i <= ilen; ++i){
			if(i == ilen || this.scenesIndexed[i].index > this.index){
				sceneAfter = this.scenesIndexed[i % ilen];
				sceneBefore = this.scenesIndexed[(i - 1 + ilen) % ilen];
				if(sceneBefore.index == this.index){
					sceneCurrent = sceneBefore;
					sceneBefore = this.scenesIndexed[(i - 2 + ilen) % ilen];
				}
				break;
			}
		}
		
		// ---   compute scene amplitude
		limitBefore = sceneBefore.scene.view.x  + sceneBefore.scene.pos.x + sceneBefore.scene.size.x;
		limitAfter = sceneAfter.scene.view.x + sceneAfter.scene.pos.x;
		limitDelta = limitAfter - limitBefore;
		
		this.xTarget = this.xCenter - limitBefore - (.5 * limitDelta);
		this.scrollMin = Math.max(CCV.global.SCROLL_MIN_OFFSET, .5 * (limitDelta - this.size.x));
		this.scrollPreview = CCV.global.SCROLL_PREVIEW_OFFSET;
		KPF.utils.log('scrollMin: ' + this.scrollMin + ',  scrollPreview: ' + this.scrollPreview, 'Landscape.setIndex');
		
		if(CCV.global.DEBUG_SCROLL_GFX){
			this.scrollDebugGfx.clear();
			CCV.utils.drawDebugRect(this.scrollDebugGfx, new PIXI.Rectangle(limitBefore, 0, limitAfter - limitBefore, CCV.global.SCENE_MAX_HEIGHT), 0x00ffff, 2, .5, true);
		}
		
		// scroll position
		if(doTransition){
			TweenMax.to(this.scenesScroll, CCV.global.SCENE_SLIDE_DURATION, {
				x: this.xTarget,
				ease: Expo.easeInOut
			});
		}
		else
			this.scenesScroll.x = this.xTarget;
		
		
		CCV.player.triggerIndex(this.index, this.scenes[this.index], this.scenes.length);
	};
	/** @private */
	proto._reArrangeScenesFrom = function(index){
		var i, ilen, xPos, clampedIndex;
		
		console.log('_reArrangeScenesFrom: ' + index + ', #' + this.scenes[index].id + ' at: ' + this.scenes[index].view.x);
		
		// ground
		xPos = this.scenes[index].view.x;
		this.ground.view.x = KPF.utils.floorTo(xPos, this.ground.size.x) - this.ground.size.x;
			
		// left-side items
		xPos = this.scenes[index].view.x;
		for(i = 1, ilen = this.scenes.length; i < CCV.global.SCENE_ITEM_BEFORE; ++i) {
			clampedIndex = index - i;
			while (clampedIndex < 0)
				clampedIndex += ilen;
			clampedIndex %= ilen;
			
			xPos -= this.scenesWidths[clampedIndex];
			this.scenes[clampedIndex].view.x = xPos;
		}
		
		// right-side items
		xPos = this.scenes[index].view.x + this.scenesWidths[index];
		for(i = 1, ilen = this.scenes.length; i < ilen - CCV.global.SCENE_ITEM_BEFORE; ++i) {
			clampedIndex = index + i;
			while (clampedIndex < 0)
				clampedIndex += ilen;
			clampedIndex %= ilen;
			
			this.scenes[clampedIndex].view.x = xPos;
			xPos += this.scenesWidths[clampedIndex];
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
		var ssc = CCV.player.scaleSourceCoef;
		
		// --- parse data
		this.id = data.id;
		
		this.folder = CCV.player.mediaFolder;
		if(this.id.indexOf('_') != 0){
			this.folder += this.id + '/';
		}
		
		this.indexable = data.indexable !== false;
		this.disposable = data.disposable !== false;
		this.popUnder = data.popUnder === true;
		
		this.pos = new PIXI.Point();
		if(data.pos)
			this.pos.copy(data.pos);
		this.pos.scale(ssc);
		
		this.marginLeft = data.marginLeft * ssc;
		
		this.size = new PIXI.Point(data.size.x, data.size.y);
		this.size.scale(ssc);
		this.xCenter = Math.round(.5 * this.size.x);
		
		this.activationTimeoutId = null;
		
		
		// ---   build audio
		if(data.hasOwnProperty('audio'))
			this.audio = new CCV.app.AudioChannel(data.audio);
		
		// ---   build view
		this.viewBuild(data);
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
	 * @param depth   {Number} formatting depth
	 * @param indentStart   {Boolean}   whether or not indentation should be added on string start
	 * @return {String}
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
				return new CCV.app.Sequence(data, this);
			else
				return new CCV.app.Layer(data, this);
		}
		return null;
	};
	proto.showFill = function(status){
		if(!this.redFill)
			return;
		
		TweenMax.to(this.redFill.view, .3, {
			ease: Expo.easeOut,
			alpha: status ? 1 : 0
		});
	};
	proto.viewBuild = function (data) {
		this.view = new PIXI.Container();
		
		// ---   blue layers
		this.blue = this.factoryModel(data.blue);
		if(this.blue && this.blue.view){
			this.blue.view.position.copy(this.pos);
			this.view.addChild(this.blue.view);
		}
		
		// ---   red layers
		this.red = new CCV.app.CompoLayer(data.red);
		if(data.red){
			this.redOutline = this.red.addLayer(data.red.outline, this);
			this.redFill = this.red.addLayer(data.red.fill, this);
		}
		if(this.redFill && this.redFill.view){
			this.redFill.view.position.copy(this.pos);
			this.redFill.view.blendMode = PIXI.BLEND_MODES.MULTIPLY;
			this.view.addChild(this.redFill.view);
		}
		if(this.redOutline && this.redOutline.view){
			this.redOutline.view.position.copy(this.pos);
			this.redOutline.view.blendMode = PIXI.BLEND_MODES.MULTIPLY;
			this.view.addChild(this.redOutline.view);
		}
		
		// ---   debug markers
		if (CCV.global.DEBUG_SCENE_GFX) {
			var gfx, text, textStyle = {
				fontFamily: 'Verdana',
				fontSize: 12,
				fill: 0x0
			};
			
			this.debugGfx = new PIXI.Container();
			this.view.addChild(this.debugGfx);
			
			gfx = new PIXI.Graphics();
			
			// draw size and position
			CCV.utils.drawDebugPoint(gfx, this.pos, 0xff0000, 2);
			CCV.utils.drawDebugRect(gfx, new PIXI.Rectangle(this.pos.x, this.pos.y, this.size.x, this.size.y), 0x0000ff, 1, 1, false);
			this.debugGfx.addChild(gfx);
			
			// draw left margin
			if(CCV.global.DEBUG_SCENE_MARGINS){
				if(this.marginLeft != 0){
					gfx.lineStyle(1, 0x0000ff, 1);
					gfx.drawRect(this.pos.x - this.marginLeft, this.pos.y, this.marginLeft, this.size.y);
					gfx.moveTo(this.pos.x, this.pos.y);
					gfx.lineTo(this.pos.x - this.marginLeft, this.pos.y + (.5 * this.size.y));
					gfx.lineTo(this.pos.x, this.pos.y + this.size.y);
					this.debugGfx.addChild(gfx);
				}
			}
			
			// show root ID and position
			text = new PIXI.Text('#' + this.id, textStyle);
			text.position = new PIXI.Point(10, 10);
			this.debugGfx.addChild(text);
			
			CCV.utils.drawDebugPoint(gfx, new PIXI.Point(0, 0), 0xff0000, 2);
			CCV.utils.drawDebugRect(gfx, new PIXI.Rectangle(0, 0, Math.abs(this.size.x + this.pos.x), this.size.y + this.pos.y), 0xff0000, 1, .2, false);
		}
	};
	proto.activateDisplay = function(status, delta) {
		var self = this;
		
		// audio management
		this.volumeTarget = status ? 1 : Math.max(0, 1 - CCV.global.AUDIO_DELTA_VOLUME_COEF * Math.abs(delta));
		this.panTarget = KPF.utils.clamp(delta * CCV.global.AUDIO_DELTA_PAN_COEF, -1, 1);
		if(this.audio)
			this._launchAudio(this.audio);
		
		if(this.activationTimeoutId)
			window.clearTimeout(this.activationTimeoutId);
		
		this.activationTimeoutId = window.setTimeout(function(){
			$(self).trigger('displayStateChange', [status]);
		}, status ? CCV.global.SCENE_ACTIVATION_DELAY : CCV.global.SCENE_DEACTIVATION_DELAY);
	};
	proto.launchAudio = function(audio, doTransition){
		doTransition = doTransition !== false;
		
		if(doTransition){
			if(!audio.isPlaying()){
				startAtValues = {
					volume: 0
				}
			}
			TweenMax.to(audio, CCV.global.SCENE_SLIDE_DURATION, {
				volume: this.volumeTarget,
				pan: this.panTarget,
				delay: .3,
				startAt: startAtValues,
				onUpdate: audio.render.bind(audio)
			});
			if(this.volumeTarget > 0 && !audio.isPlaying()){
				audio.play();
				audio.render();
			}
		}
		else{
			audio.stop();
			audio.volume = this.volumeTarget;
			audio.pan = this.panTarget;
			audio.play();
			audio.render();
			console.log('-----------------------------> audio')
		}
	}
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
		this.layers = [];
		
		if(!data)
			return;
		
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
// CCV.app.Sequence
// ----------------------------------------------------------------------
if (!CCV.app.Sequence) {
	/**
	 * Multiple frame layer model.
	 * @param data    object   JSON formatted data holder
	 * @param scene   CCV.app.Scene   context scene
	 * @constructor
	 */
	CCV.app.Sequence = function (data, scene) {
		this.scene = scene;
		
		this.parse(data);
		
		this.view = new PIXI.Container();
		
		if(data.hasOwnProperty('preview')) {
			/** @var {PIXI.Sprite} */
			this.preview = new PIXI.Sprite(new PIXI.Texture.fromImage(this.scene.folder + data.preview));
			this.view.addChild(this.preview);
		}
		
		// ---   debug markers
		if (CCV.global.DEBUG_SCENE_GFX) {
			this.text = new PIXI.Text('', {
				fontFamily: 'Verdana',
				fontSize: 15,
				fill: 0x0
			});
			this.text.position = new PIXI.Point(20, -20);
			this.view.addChild(this.text);
		}
		
		this.active = undefined;
		$(this.scene).on('displayStateChange', this.activateDisplay.bind(this));
		this.activateDisplay(null, false);
	};
	proto = CCV.app.Sequence.prototype;
	
	proto.parse = function(data){
		this.seqNumLength = data.hasOwnProperty('seqNumLength') ? data.seqNumLength : -1;
		this.seqStart = data.hasOwnProperty('seqStart') ? data.seqStart : 1;
		this.seqEnd = data.hasOwnProperty('seqEnd') ? data.seqEnd : 1;
		
		this.endDelay = (data.hasOwnProperty('endDelay') && data.endDelay >= 0) ? data.endDelay : CCV.global.SCENE_REPEAT_DELAY;
		this.endFrames = parseInt(this.endDelay / 1000 * CCV.global.SYS_FPS);
		this.endSuspensionFrames = -1;
		
		this.startDelay = (data.hasOwnProperty('startDelay') && data.startDelay >= 0) ? data.startDelay : CCV.global.SCENE_RESTART_DELAY;
		this.startFrames = parseInt(this.startDelay / 1000 * CCV.global.SYS_FPS);
		this.startSuspensionFrames = -1;
		
		if(data.hasOwnProperty('audio')){
			this.audio = new CCV.app.AudioChannel(data.audio, true);
		}
		
		this.file = data.file;
		this.loop = data.loop !== false;
	};
	proto.nextFrame = function(){
		var a = this.animation;
		
		if(!a)
			return;
		
		var c = a.currentFrame + 1;
		var t = a.totalFrames;
		
		// ##################### if repeat suspensions frames are defined, handle them
		// ... wait
		if(this.endSuspensionFrames > 0) {
			this.endSuspensionFrames--;
		}
		// ... repeat
		else if(this.endSuspensionFrames == 0) {
			this.endSuspensionFrames = -1;
			if(this.startFrames > 0)
				this.startSuspensionFrames = this.startFrames;
			else if(this.audio){
				console.log('launch audio from repeat pause');
				this.scene.launchAudio(this.audio, false);
			}
			a.gotoAndStop(0);
		}
		
		// ##################### if restart suspensions frames are defined, handle them
		// ... wait
		else if(this.startSuspensionFrames > 0) {
			this.startSuspensionFrames--;
		}
		// ... restart
		else if(this.startSuspensionFrames == 0) {
			this.startSuspensionFrames = -1;
			a.gotoAndStop(1);
			if(this.audio){
				console.log('launch audio from restart pause');
				this.scene.launchAudio(this.audio, false);
			}
		}
		// // ##################### else set playhead to move forward
		else if(c < t){
			a.gotoAndStop(c);
		}
		else{
			// sequence has a repeat pause
			if(this.endFrames > 0){
				this.endSuspensionFrames = this.endFrames;
				a.gotoAndStop(t - 1);
			}
			// sequence has a restart pause
			else if(this.startFrames > 0){
				this.startSuspensionFrames = this.startFrames;
				a.gotoAndStop(0);
			}
			//
			else{
				a.gotoAndStop(0);
				if(this.audio){
					console.log('launch audio from loop');
					this.scene.launchAudio(this.audio, false);
				}
			}
		}
		
		if (CCV.global.DEBUG_SCENE_GFX) {
			var log = a.currentFrame + '/' + a.totalFrames;
			if(this.startFrames > 0)
				log += ' [restart: ' + this.startSuspensionFrames + '/' + this.startFrames + ']';
			if(this.endFrames > 0)
				log += ' [repeat: ' + this.endSuspensionFrames + '/' + this.endFrames + ']';
			this.text.text = log;
		}
	};
	proto.toString = function () {
		return this.info(0);
	};
	proto.info = function (depth, indentStart) {
		var str;
		
		str = (indentStart === true) ? KPF.utils.repeat(depth || 0, KPF.global.FORMAT_INDENT) : '';
		str += '[Sequence] ' + (this.seqEnd - this.seqStart) + ' frames [' + this.seqStart + ' -> ' + this.seqEnd + ']';
		return str;
	};
	proto.activateDisplay = function(e, status){
		var i, index, file, texture;
		
		var p = this.preview;
		var scene = this.scene;
		
		// --- change active status or die
		status = status !== false || !this.scene.disposable;
		
		if(this.active === status)
			return;
		this.active = status;
		this.endSuspensionFrames = -1;
		this.startSuspensionFrames = -1;
		
		if(!status){
			if(this.audio)
				this.audio.stop();
		}
		
		// active --> launch animmation
		// .... OR
		// inactive but no preview exist --> stop animmation
		if(this.active || !this.preview) {
			if(!this.animation){
				// create textures
				this.textures = [];
				for (i = this.seqStart; i <= this.seqEnd; ++i) {
					index = this.seqNumLength > 0 ? KPF.utils.fillTo(i, this.seqNumLength, '0') : i;
					file = this.scene.folder + this.file.replace('[NUM]', index);
					texture = new PIXI.Texture.fromImage(file);
					this.textures.push(texture);
				}
				
				// create animation
				this.animation = new PIXI.extras.AnimatedSprite(this.textures, false);
				this.animation.textures = this.textures;
				this.animation.gotoAndStop(0);
				this.view.addChild(this.animation);
				
				/* #EDIT 2017/04/30 - provoques flicker
				// hide preview if or when first frame is loaded
				if(p){
					if(this.textures[0].baseTexture.hasLoaded)
						p.visible = false;
					else{
						this.textures[0].baseTexture.on('loaded', function(e){
							p.visible = false;
						});
					}
				}
				*/
			}
			CCV.player.animTicker.addSequence(this);
			
			// auto-launch audio
			if(this.audio && this.endFrames + this.startFrames == 0){
				console.log('launch audio from activation');
				this.scene.launchAudio(this.audio, false);
			}
		}
		else if(this.animation){
			CCV.player.animTicker.removeSequence(this);
			this.view.removeChild(this.animation);
			this.animation.destroy(true);
			this.animation = null;
		}
		
		
		if(p){
			if(status){
				this.textures[0].baseTexture.on('loaded', function(e){
					console.log('--------------------------------------------------> hide scene ' + scene.id);
					p.visible = false;
				});
			}
			else{
				p.visible = true;
			}
		}
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
		this.pos = new PIXI.Point(data.pos.x, data.pos.y);
		this.pos.scale(CCV.player.scaleSourceCoef);
		
		this.size = new PIXI.Point(data.size.x, data.size.y);
		this.size.scale(CCV.player.scaleSourceCoef);
		
		this.view = new PIXI.Container();
		
		for(var i = 0, texture = PIXI.Texture.fromImage(CCV.player.mediaFolder + data.file); i < 3; ++i){
			gfx = PIXI.Sprite.from(texture);
			gfx.blendMode = PIXI.BLEND_MODES.MULTIPLY;
			gfx.position = new PIXI.Point(i * this.size.x, 0);
			this.view.addChild(gfx);
		}
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
				pinchScale = KPF.utils.clamp(pinchScale, 1, 1 + CCV.global.MAGNIFIER_PINCH_INCREMENT);
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



// ----------------------------------------------------------------------
// CCV.app.AudioChannel
// ----------------------------------------------------------------------
if(!CCV.app.AudioChannel){
	
	/**
	 * @param data
	 * @param autoRender
	 * @constructor
	 */
	CCV.app.AudioChannel = function(data, autoRender){
		this.file = CCV.global.AUDIO_FOLDER + data.file;
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
		this.sound.volume(CCV.global.AUDIO_GLOBAL_VOLUME * this.volumeCoef * this._volume, this.soundId);
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