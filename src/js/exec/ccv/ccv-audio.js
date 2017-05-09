var CCV;
var proto;

if (!CCV){
	CCV = {};
}

if (!CCV.audio){
	CCV.audio = {};
}




// ----------------------------------------------------------------------
// CCV.app.AudioChannel
// ----------------------------------------------------------------------
if(!CCV.audio.AudioChannel){
	
	/**
	 * @param data
	 * @param autoRender
	 * @constructor
	 */
	CCV.audio.AudioChannel = function(data, autoRender){
		var self = this;
		
		this.file = CCV.global.AUDIO_FOLDER + data.file;
		this.isLoop = data.isLoop !== false;
		this.volumeCoef = KPF.utils.isan(data.volume) ? data.volume : 1;
		
		/** @var {Howl} */
		this.sound  = null;
		
		// --- define volume getter/setter
		this._volume = 0;
		Object.defineProperty(this, 'volume', {
			get: function(){
				return self._volume;
			},
			set: function(volume){
				self._volume = volume;
				self.render();
			}
		});
		
		// register instance in CCV.core.Player
		CCV.player.registerAudioChannel(this);
	};
	proto = CCV.audio.AudioChannel.prototype;
	
	proto.render = function(){
		if(this.sound)
			this.sound.volume(this._volume, this.soundId);
	};
	proto.soundInit = function(){
		if(this.sound)
			return;
		
		this.sound =  new Howl({
			preload: true,
			autoplay: false,
			src: this.file,
			volume: 0
		});
		this._volume = 0;
	};
	proto.soundDispose = function(){
		if(!this.sound)
			return;
		
		this.stop(false);
		this.sound.unload();
		this.sound = null;
	};
	proto.isPlaying = function(){
		return this.soundId && this.sound && this.sound.playing(this.soundId);
	};
	proto.start = function(doTransition){
		if(!this.sound){
			//console.log('sound has not been initialized');
			return;
		}
		if(this.isPlaying()){
			//console.log('cancel start method sound is already playing');
			return;
		}
		
		this.soundId = this.sound.play();
		this.sound.loop(this.isLoop, this.soundId);
		
		if(doTransition === true){
			TweenMax.killTweensOf(this);
			TweenMax.to(this, 2, {
				volume: this.volumeCoef * CCV.global.AUDIO_GLOBAL_VOLUME
			});
		}
		else{
			this.volume = this.volumeCoef * CCV.global.AUDIO_GLOBAL_VOLUME;
		}
	};
	proto.pause = function(doTransition){
		if(!this.soundId || !this.isPlaying())
			return false;
		
		this.sound.pause(this.soundId);
		return true;
	};
	proto.stop = function(doTransition){
		var self = this;
		
		if(!this.soundId || !this.isPlaying())
			return;
		
		if(doTransition === true){
			TweenMax.killTweensOf(this);
			TweenMax.to(this, 2, {
				volume: 0,
				onComplete: function(){
					self.stop(false);
				}
			});
		}
		else{
			this.sound.stop(this.soundId);
			this.soundId = null;
		}
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