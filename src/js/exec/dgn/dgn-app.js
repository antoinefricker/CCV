var DGN;
var proto;

if(!DGN){
	DGN = {
		core: {}
	};
	
	if(!DGN.core.Application){
		DGN.core.Application = function(pageId){
			this.cnv = document.getElementById('pixi-stage');
			
			/** @var {TimelineMax} */
			this.helpTl = null;
			this.page = null;
			$('.page').hide();
			
			this.lang = 'fr';
		};
		proto = DGN.core.Application.prototype;
		
		proto.initialize = function(){
			var page,
				pointer,
				pagination;
			
			/* application interactions */{
				$('[data-lang]').on('click', function(){
					DGN.app.langSet($(this).data('lang'));
				});
			}
			
			/* home page */{
				
				// buttons actions
				$('#home')
					.on('click', 'button.action-info', function(){
						DGN.app.pageSet('info');
					})
					.on('click', 'button.action-play', function(){
						DGN.app.pageSet('help');
					})
					.on('click', '.app-title', function(){
						DGN.app.pageSet('help');
					})
			}
			
			/* help page */{
				// buttons actions
				$('#help')
					.on('click', 'button.action-close', function(){
						DGN.app.pageSet('play');
					});
			}
			
			/* info page */{
				page = $('#info');
				
				// buttons actions
				page.on('click', 'button.action-home', function(){
					DGN.app.pageSet('home');
				});
				
				// initialize pagination
				pagination = page.find('.pagination');
				page.find('.inner-page').each(function(index, el){
					
					// create pagination item
					$('<div />')
						.on('click', function() {
							DGN.app.pageSet('info', {
								innerIndex: index
							});
						})
						.appendTo(pagination);
					
					// handle swipe
					$(el).swipe({
						swipe: function(e, direction) {
							console.log('direction: ' + direction)
							if(direction == 'right' || direction == 'left')
								DGN.app.pageSet('info', {
									move: direction
								});
						},
						threshold: 0 // min distance that triggers swipe
					});
				});
			}
			
			/* play page */{
				// buttons actions
				pointer = $('#play .footer-menu');
				pointer
					.on('click', '.red-home', function(){
						DGN.app.pageSet('home');
					})
					.on('click', '.red-magnifier', function(){
						CCV.player.magnifierDisplayToggle();
					})
					.on('click', '.red-help', function(){
						DGN.app.pageSet('help');
					})
					.on('click', '.red-arrow', function(){
						pointer.toggleClass('opened');
					});
			}
		};
		
		/* ########################################## LANGUAGES UTILITIES */ {
			/**
			 * Defines application language
			 * @param lang {String}
			 */
			proto.langSet = function(lang){
				if(!lang)
					lang = this.langGetFull();
				else if(lang != 'fr' && lang != 'en')
					lang = 'en';
				this.lang = lang;
				KPF.utils.log('Set application language: ' + this.lang, 'Application.langSet');
				
				$('[data-lang-toggler]').each(function(index, el){
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
			proto.langGetFull = function(){
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
			proto.langGetNative = function(){
				return this.langCleanResults(window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage);
			};
			/**
			 * Cleans language results and return language nick (fr, en, etc.)
			 * @return {String}
			 * @private
			 */
			proto.langCleanResults = function(v) {
				if (v.indexOf('-') !== -1)
					v = v.split('-')[0];
				if (v.indexOf('_') !== -1)
					v = v.split('_')[0];
				return v;
			};
		}
		
		/* ########################################## PAGES UTILITIES */ {
			proto.pageSet = function(id, params){
				if(!id)
					id = 'home';
				
				// ---- handle states (ugly ok)
				
				// info
				if(id == 'info'){
					this._infoUtils(params);
				}
				
				// help
				if(id == 'help'){
					setTimeout(this._helpUtils.bind(this, true), 500); // timeout prevents unloaded images
				}
				else if(this.formerId == 'help'){
					this._helpUtils(false);
				}
				
				// help
				if(id == 'play'){
					if(!CCV.player){
						new CCV.app.Player(this.cnv, {
							magnifierDisplayStatus: false,
							scenesShowFillStatus: true
						});
					}
					CCV.player.activate(true);
				}
				else if(this.formerId == 'play'){
					CCV.player.activate(false);
				}
				
				if(id != this.formerId){
					$('#' + id).show();
					$('#' + this.formerId).hide();
				}
				KPF.utils.log('set page #' + id + (this.formerId ? ', remove page #' + this.formerId : ''), 'Application.setPage', params);
				
				this.formerId = id;
			};
			proto._infoUtils = function(params){
				var page;
				
				if(!params)
					this.infoIndex = 0;
				else if(params.innerIndex)
					this.infoIndex = params.innerIndex;
				else if(params.move == 'right')
					this.infoIndex = this.infoIndex - 1;
				else if(params.move == 'left')
					this.infoIndex = this.infoIndex + 1;
				else
					this.infoIndex = 0;
				this.infoIndex = KPF.utils.clamp(this.infoIndex, 0, 2) || 0;
				KPF.utils.log('infoIndex: ' + this.infoIndex, 'Application._infoUtils');
				
				page = $('#info');
				page.find('.pagination').children().each(function(paginationIndex, paginationEl){
					$(paginationEl).toggleClass('current', paginationIndex == DGN.app.infoIndex);
				});
				page.find('.inner-page').each(function(innerPageIndex, innerPageEl){
					$(innerPageEl).toggle(innerPageIndex == DGN.app.infoIndex);
				});
			};
			proto._helpUtils = function(status){
				
				console.log('_helpUtils (status: ' + status + ')');
				
				if(status) {
					var anim, hand, bg,
						animSize, handSize, bgSize,
						startX, endX;
					
					this.helpTl = new TimelineMax({
						repeat: -1,
						repeatDelay: 1.5
					});
					
					/* animation #1 */ {
						
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
						this.helpTl.add(new TweenMax(hand, 1.5, {
							ease: Power1.easeInOut,
							x: startX
						}));
						// move away
						this.helpTl.add(new TweenMax(hand, 1.5, {
							ease: Power1.easeInOut,
							x: endX
						}), "+=.5");
					}
					
					/* animation #2 */ {
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
						this.helpTl.add(TweenMax.to(hand, 2, {
							ease: Power1.easeInOut,
							x: startX
						}), "+=2");
						// click
						this.helpTl.add(TweenMax.to(hand, .2, {
							ease: Power1.easeInOut,
							y: 10,
							x: startXPrime
						}));
						// release
						this.helpTl.add(TweenMax.to(hand, .2, {
							ease: Power1.easeInOut,
							y: 0,
							x: startX
						}), "+=.2");
						// move away
						this.helpTl.add(TweenMax.to(hand, 2, {
							ease: Power1.easeInOut,
							x: endX
						}), "+=.5");
					}
					
					this.helpTl.restart();
					
				}
				else if(this.helpTl){
					console.log(this.helpTl);
					this.helpTl.stop();
					this.helpTl = null;
				}
			}
		}
	}
}