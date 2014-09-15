(function(){

	window.Mixer = function(){

		this._audioCtx = null;
		this._el = null;

		this._bufferSrc = null;

		this._encodedSrc = [];
		this._usedEncodedSrcCounter = 0;

		this._sequencer = null;

		this._playbackItems = [];


	};

	var p = window.Mixer.prototype;

	p.setup = function(ctx, el){

		this._audioCtx = ctx;
		this._el = el;

		this._sequencer = new Sequencer();
		this._sequencer.setup(this._audioCtx, this._el.querySelector('.sequencer'));

		this._sequencer.play();

		this._createSound('../industrial_base.wav');
		this._createSound('../snare.wav');
		this._createSound('../synth_lead.wav');


	};

	p._createSound = function(url){

		request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.addEventListener('error', this._onError.bind(this), false);
		request.addEventListener('readystatechange', this._bufferLoaded.bind(this), false);

		request.send();	
	};

	p._onError = function(e){

		debugger;
	};

	p._bufferLoaded = function(e){

		// debugger;
		if (e.target.readyState < 4) return;


		var request = e.target;

		// this._encodedSrc = request.response;

		// this.createPlaybackItem();
		// this._bufferSrc = this._audioCtx.createBufferSource();
		var decodeAudio = this._audioCtx.decodeAudioData(request.response, this._onAudioDecoded.bind(this));
		
	
	};

	p._onAudioDecoded = function(data){

	
		// this._bufferSrc.buffer = data;

		// this._bufferSrc.connect(this._audioCtx.destination);
		// this._bufferSrc.start(0);

		// var playbackItem = new PlaybackItem();
		// playbackItem.setup(this._audioCtx, data, this._el.querySelector('.sequencer .content'));
		
		// this._sequencer.addToBeatLibrary(playbackItem);
		// this.connectToMaster(playbackItem.getOutNode());

		this._encodedSrc.push(data);

		console.log('on audio decoded !');

	};

	p.createPlaybackItem = function(connId,useBuff,buff){

		useBuff = useBuff || false;


		var srcObj = {recording: useBuff, buff: null};
		if (useBuff)
			srcObj.buff = buff;
		else{
			srcObj.buff = this._encodedSrc[this._usedEncodedSrcCounter];
			this._usedEncodedSrcCounter++;
		}
			

		var playbackItem = new PlaybackItem();
		playbackItem.setup(this._audioCtx, srcObj, this._el.querySelector('.sequencer .content'));
		
		this._sequencer.addToBeatLibrary(playbackItem);
		this.connectToMaster(playbackItem.getOutNode());

		var obj = {item: playbackItem, id:connId};

		this._playbackItems.push(obj);

		return obj;
	};

	p.getPlaybackItem = function(id){

		for (var i=0;i<this._playbackItems.length;i++){
			var item = this._playbackItems[i];
			if (item.id == id){
				return item.item;
			}
		}

	};

	p.updateNotes = function(obj){

		var id = obj.id;
		var item = this.getPlaybackItem(id);

		item.updateNotes(obj.index)

	};

	p.connectToMaster = function(node){

		node.connect(this._audioCtx.destination);
	};

	p.update = function(){

		this._sequencer.updateVisuals();	
	};


})();