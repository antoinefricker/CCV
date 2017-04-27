var DGN;
var proto;

if(!DGN){
	DGN = {
		core: {}
	};
	
	if(!DGN.core.Application){
		DGN.core.Application = function(pageId){
			this.page = null;
			this.lang = 'fr';
			
			$('[data-lang]').on('click', function(){
				DGN.app.langSet($(this).data('lang'));
			});
			this.langSet(this.langGetFull());
			
			this.pageSet(pageId)
		};
		proto = DGN.core.Application.prototype;
		
		proto.pageSet = function(id){
			if(!id)
				id = 'home';
			KPF.utils.log('set page #' + id, 'Application.setPage');
			
			$('.page').hide();
			$('#' + id).show();
			
			switch(id){
				case 'home':
					
					break;
				case 'credits':
					
					break;
				case 'help':
					this._helpAnimation(true);
					break;
				case 'play':
					
					break;
				default:
					KPF.utils.warn();
			}
		};
		
		
		/* ########################################## LANGUAGES UTILITIES */ {
		/**
		 * Defines application language
		 * @param lang {String}
		 */
		proto.langSet = function(lang){
			if(!lang)
				lang = (this.lang == 'fr') ? 'en' : 'fr';
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
			proto._helpAnimation = function(status){
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