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
			KPF.utils.log('[StateMachine - DGN.sm] event "' + eventName + '" ; ' + errorMessage);
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
	
	/** @var {TimelineMax} */
	this.helpAnimation = null;
	
	/** @var {Number} */
	this.infoIndex = 0;
	
	/** @var {Boolean} */
	this.helpResizedFlag = true;
	 
	this.langSet(lang);
	
	/** @var {Howl} */
	this.soundInterface  = null;
	
	this.preloadStack = [];
	this.preloadStackInit();
	
	setTimeout(this.preloadStackPop.bind(this), 1200);
	
	setTimeout(this.init.bind(this), 1000);
};
proto = DGN.Application.prototype;


// ------------------------------------------------------------------------------------------
//         INITIALIZATION & DATA
// ------------------------------------------------------------------------------------------

proto.init = function(){
	if(CCV.player)
		this.player = CCV.player;
	else
		this.player = CCV.player = new CCV.app.Player(document.getElementById('pixi-stage'), {
			magnifierDisplayStatus: false,
			scenesShowFillStatus: true
		});
	
	this.initInteractions();
};
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
	
	for(var i = 1; i <= 6; i++){
		$('#home .house' + i)
			.on('mousedown', function() {
				$(this).toggleClass('active');
			});
	}
	
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
};
proto.preloadStackInit = function() {
		// home gifs
	for (var i = 1; i <= 6; i++)
		this.preloadStack.push('theme/mm/home/m' + i + 'a.gif');
	
	// help
	this.preloadStack.push('theme/mm/_help1-background.png');
	this.preloadStack.push('theme/mm/_help1-hand.png');
	this.preloadStack.push('theme/mm/_help2-background.png');
	this.preloadStack.push('theme/mm/_help2-hand.png');
};
proto.preloadStackPop = function(){
	var self = this;
	
	if(this.preloadStack.length == 0){
		KPF.utils.log('Preload stack is empty', 'Application.preloadStackPop');
		return;
	}
	
	var img = new Image();
	img.onload = function(){
		self.preloadStackPop();
	};
	img.src = this.preloadStack.shift();
};
proto.soundPlay = function(props){
	
	if(!CCV.global.AUDIO_ENABLED)
		return;
	
	if(!props || !props.hasOwnProperty('src'))
		return;
	
	// console.warn('mobileAutoEnable: ' + Howler.mobileAutoEnable);
	
	if(this.soundInterface){
		if(this.soundInterface._src == props.src)
			return;
		this.soundInterface.fade(this.soundInterface.volume(null, this.soundInterfaceId), 0, 2000);
	}
	
	this.soundInterface = new Howl(Object.assign({
		src: 'ccv/audio/interface128.mp3',
		volume: 0,
		buffer: true,
		loop: true,
		autoplay: false,
		onplay: function(){
			this.fade(0, CCV.global.AUDIO_GLOBAL_VOLUME, 8000);
		}
	}, props));
	this.soundInterfaceId = this.soundInterface.play();
};
proto.resetHome = function(){
	$('#home').find('.house').removeClass('active');
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
				src: ['ccv/audio/landscape128.mp3'],
				loop: true
			});
			break;
	}
	var separator = '-------------------------------------------------';
	KPF.utils.log(separator + '\n'
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
	this.resetHome();
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
		$('#play .footer-menu')
			.toggleClass('opened', false)
			.css('z-index', 3000);
	}, 300);
	$('#play').attr('data-pos', 'at-default');
	this.player.activateSet(true);
};
proto.onclosePlay = function (e, from, to) {
	this.player.activateSet(false);
	$('#home').attr('data-pos', 'at-default');
	$('#play').attr('data-pos', 'at-bottom');
	window.setTimeout(function () {
		$('#help')
			.removeClass('sliding')
			.attr('data-pos', 'at-bottom');
	}, 300);
	this.resetHome();
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