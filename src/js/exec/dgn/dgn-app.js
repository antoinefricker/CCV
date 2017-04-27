var DGN;
var proto;

if(!DGN){
	DGN = {
		core: {}
	};
	
	if(!DGN.core.Application){
		DGN.core.Application = function(pageId){
			this.cnv = document.getElementById('pixi-stage');
			this.page = null;
			this.lang = 'fr';
		};
		proto = DGN.core.Application.prototype;
		
		
		proto.initialize = function(){
			var page,
				
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
						DGN.app.pageSet('play');
					});
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
					$('<div />')
						.on('click', function() {
							DGN.app.pageSet('info', {
								innerIndex: index
							});
						})
						.appendTo(pagination);
				});
			}
			
			/* play page */{
				// buttons actions
				$('#play .footer-menu')
					.on('click', '.action-help', function(){
						DGN.app.pageSet('help');
					})
					.on('click', '.action-help', function(){
						app.magnifierDisplayToggle();
					})
			}
			
			
			
			
			
			
			
			
			
			
			
			
		}
		
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
				if(!params)
					params = {};
				if(!id)
					id = 'home';
				KPF.utils.log('set page #' + id, 'Application.setPage', params);
				
				$('.page').hide();
				$('#' + id).show();
				
				switch(id){
					case 'home':
						break;
					
					case 'info':
						this._infoUtils(KPF.utils.isan(params.innerIndex) ? params.innerIndex : 0);
						break;
					
					case 'help':
						this._helpAnimation(params);
						break;
					
					case 'play':
						this.app = new CCV.app.Player(this.cnv, {
							magnifierDisplayStatus: true,
							scenesShowFillStatus: true
						});
						break;
					default:
						KPF.utils.warn('Unknown ', 'Application.pageSet');
				}
			};
			
			proto._infoUtils = function(index){
				var page;
				
				console.log(index);
				
				page = $('#info');
				page.find('.pagination').children().each(function(paginationIndex, paginationEl){
					$(paginationEl).toggleClass('current', paginationIndex == index);
				});
				page.find('.inner-page').each(function(innerPageIndex, innerPageEl){
					$(innerPageEl).toggle(innerPageIndex == index);
				});
			};
			proto._helpUtils = function(status){
				if(status) {
					var tl, anim, hand, bg,
						animSize, handSize, bgSize,
						startX, endX;
					
					tl = new TimelineMax({
						repeat: -1,
						repeatDelay: 1.5
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
					tl.add(new TweenMax(hand, 1.5, {
						ease: Power1.easeInOut,
						x: startX
					}));
					// move away
					tl.add(new TweenMax(hand, 1.5, {
						ease: Power1.easeInOut,
						x: endX
					}), "+=.5");
					
					// ---   animation #2
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
					tl.add(TweenMax.to(hand, 2, {
						ease: Power1.easeInOut,
						x: startX
					}), "+=2");
					// click
					tl.add(TweenMax.to(hand, .2, {
						ease: Power1.easeInOut,
						y: 10,
						x: startXPrime
					}));
					// release
					tl.add(TweenMax.to(hand, .2, {
						ease: Power1.easeInOut,
						y: 0,
						x: startX
					}), "+=.2");
					// move away
					tl.add(TweenMax.to(hand, 2, {
						ease: Power1.easeInOut,
						x: endX
					}), "+=.5");
				}
			}
		}
	}
}