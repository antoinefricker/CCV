
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
		
		this.cbks = {};
		this.cbks.videoAskRestartTimeoutId = null;
		this.cbks.videoAskRestart = this.videoAskRestart.bind(this);
		this.cbks.videoRestart = this.videoRestart.bind(this);
		Object.seal(this.cbks);
		
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
		
		this.videoSource.removeEventListener('ended', this.cbks.videoRestart);
		
		this.view.removeChild(this.video);
		this.video.destroy(true);
		this.video = null;
		this.videoSource = null;
		this.texture = null;
		
		this.view.removeChild(this.border);
		this.border.destroy();
		this.border = null;
		
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
		
		if(this.loop)
			this.videoSource.addEventListener('ended', this.cbks.videoAskRestart);
		
		this.video = new PIXI.Sprite(this.texture);
		this.video.width = this.scene.size.x;
		this.video.height = this.scene.size.y;
		this.view.addChild(this.video);
		
		this.border = new PIXI.Graphics();
		this.border.lineStyle(4, 0xffffff, 1);
		this.border.drawRect(this.pos.x, this.pos.y, this.scene.size.x - this.pos.x, this.scene.size.y - this.pos.y)
		this.view.addChild(this.border);
	};
	proto.videoAskRestart = function(){
		if(this.cbks.videoAskRestartTimeoutId)
			return;
		
		this.cbks.videoAskRestartTimeoutId = window.setTimeout(this.cbks.videoRestart, CCV.global.SCENE_REPLAY_DELAY);
	};
	proto.videoRestart = function(){
		window.clearTimeout(this.cbks.videoAskRestartTimeoutId);
		this.cbks.videoAskRestartTimeoutId = null;
		
		if(!this.videoSource)
			return;
		
		this.videoSource.currentTime = 0;
		this.videoSource.play();
	};
}