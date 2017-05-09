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

if(!CCV.audio.HowlerPlugin){
	
	CCV.audio.HowlerPlugin = function(channel){
		var self = this;
		
		this.channel = channel;
		
		this.soundId = null;
		this.sound =  new Howl({
			preload: true,
			autoplay: false,
			src: this.channel.file,
			volume: 0
		});
	};
	proto = CCV.audio.HowlerPlugin.prototype;
	
	proto.setVolume = function(val){
		if(!this.sound || !this.soundId)
			return;
		
		this.sound.volume(val, this.soundId);
	};
	proto.destroy = function(){
		if(this.sound)
			this.sound.unload();
		this.channel = null;
		this.soundId = null;
		this.sound = null;
	};
	proto.isPlaying = function(){
		return this.sound && this.soundId && this.sound.playing(this.soundId);
	};
	proto.start = function(){
		// not initalized
		if(!this.sound)
			return false;
		
		// no double call
		if(this.isPlaying())
			return true;
		
		
		this.soundId = this.sound.play();
		this.sound.loop(this.channel.isLoop, this.soundId);
		return true
	};
	proto.pause = function(){
		if(!this.sound || !this.soundId || !this.isPlaying())
			return false;
		
		this.sound.pause(this.soundId);
		return true;
	};
	proto.stop = function(){
		if(!this.sound || !this.soundId || !this.isPlaying())
			return false;
		
		this.sound.stop(this.soundId);
		this.soundId = null;
		
		return true;
	};
}

// ----------------------------------------------------------------------
// CCV.app.AudioChannel
// ----------------------------------------------------------------------

if(!CCV.audio.NativeAudioPlugin){
	
	CCV.audio.NativeAudioPlugin = function(channel) {
	};
	proto = CCV.audio.NativeAudioPlugin.prototype;
	
	proto.setVolume = function(val){
		
	};
	proto.destroy = function(){
		
	};
	proto.isPlaying = function(){
		
	};
	proto.start = function(fadeIn){
		
	};
	proto.pause = function(fadeOut){
		
	};
	proto.stop = function(fadeOut){
		
	};
}

if(!CCV.audio.AudioChannel){
	
	/**
	 * @param data
	 * @param autoRender
	 * @constructor
	 */
	CCV.audio.AudioChannel = function(data){
		var self = this;
		
		this.file = CCV.global.AUDIO_FOLDER + data.file;
		this.isLoop = data.isLoop !== false;
		this.volumeCoef = KPF.utils.isan(data.volume) ? data.volume : 1;
		
		// volume getter/setter
		this._volume = 0;
		Object.defineProperty(this, 'volume', {
			get: function(){
				return self._volume;
			},
			set: function(volume){
				self._volume = KPF.utils.clamp(volume, 0, 1);
				this.plugin.setVolume(self._volume * self.volumeCoef * CCV.global.AUDIO_GLOBAL_VOLUME);
			}
		});
		
		// register instance in CCV.core.Player (required to pause/restart channels when user enters/quits player
		CCV.player.registerAudioChannel(this);
	};
	proto = CCV.audio.AudioChannel.prototype;
	
	
	proto.init = function(){
		if(this.plugin)
			return;
		
		this._volume = 0;
		this.plugin = (window.plugins && window.plugins.NativeAudio) ?
			new CCV.audio.NativeAudioPlugin(this) :
			new CCV.audio.HowlerPlugin(this);
	};
	proto.destroy = function(){
		if(!this.plugin)
			return;
		
		this.stop(false);
		this.plugin.destroy();
		this.plugin = null;
	};
	proto.isPlaying = function(){
		return this.plugin && this.plugin.isPlaying();
	};
	proto.start = function(fadeIn){
		if(!this.plugin || !this.plugin.start())
			return;
		
		TweenMax.killTweensOf(this);
		if(fadeIn === true){
			TweenMax.to(this, CCV.global.AUDIO_FADEIN_LENGTH, {
				volume: 1,
				immediateRender: true,
				startAt: {
					volume: 0
				}
			});
		}
		else{
			this.volume = 1;
		}
	};
	proto.pause = function(fadeOut){
		if(!this.isPlaying())
			return;
		
		TweenMax.killTweensOf(this);
		if(fadeOut === true){
			TweenMax.to(this, CCV.global.AUDIO_FADEOUT_LENGTH, {
				volume: 0,
				onComplete: function(){
					self.pause(false);
				}
			});
		}
		else{
			this.plugin.pause();
		}
	};
	proto.stop = function(fadeOut){
		var self = this;
		
		if(!this.isPlaying())
			return;
		
		TweenMax.killTweensOf(this);
		if(fadeOut === true){
			TweenMax.to(this, CCV.global.AUDIO_FADEOUT_LENGTH, {
				volume: 0,
				onComplete: function(){
					self.stop(false);
				}
			});
		}
		else{
			this.plugin.stop();
		}
	};
}