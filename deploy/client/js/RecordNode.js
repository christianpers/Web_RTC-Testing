(function(){

	window.RecordNode = function(){

		this._audioCtx = null;
		this._el = null;
		this.node = null;
		this._buffers = [];

		this.record = false;

		

		this._recordTimeCheck = null;

		this._countdown = null;

		this._recordingNoticeEl = null;

	
	};

	var p = RecordNode.prototype;

	RecordNode.MAX_DURATION = 2000;

	p.setup = function(ctx, recordTriggerEl){

		this._audioCtx = ctx;
		this.node = ctx.createJavaScriptNode(4096,2,2);
		this._el = recordTriggerEl;

		this._countdown = new Countdown();
		this._countdown.setup(document.getElementById('countdown'));

		this._recordingNoticeEl = document.getElementById('recordingNotice');

		this._el.addEventListener('click', this.onRecordClick.bind(this)); 

		var self = this;
		this.node.onaudioprocess = function(e){
			self.audioProcess.call(self, e);
		}



	};

	p.getBufferWithIndex = function(index){

		return this._buffers[index].getBuffer();

	};

	p.getLatestBuffer = function(){

		return this._buffers[this._buffers.length-1].getBuffer();
	};


	p.onRecordClick = function(){

		// if (this.record) this.deactivateRecording();
		// else this.activateRecording();
		this._countdown.start();
		var self = this;
		setTimeout(function(){

			self.activateRecording();

		},3000);
	
	};

	p.audioProcess = function(e){

		this._recordingNoticeEl.innerHTML = '';

		if (!this.record) return;

		var currentTime = new Date().getTime();
		if (this._recordTimeCheck === null) this._recordTimeCheck = currentTime;
		var currentDiff = currentTime - this._recordTimeCheck;
		if (currentDiff > RecordNode.MAX_DURATION) return;

		var bufferItem = this._buffers[this._buffers.length-1];

		// console.log('audio process push to buffer', this._buffers.length-1);	

		var left = new Float32Array(e.inputBuffer.getChannelData(0));
		var right = new Float32Array(e.inputBuffer.getChannelData(1));
	
		var buffer = [left, right];
		bufferItem.record(buffer);

		this._recordingNoticeEl.innerHTML = 'recording';
	
	};

	p.activateRecording = function(){


		this.createNewBuffer();
		this._recordTimeCheck = null;
		this.record = true;

		
		

	};

	p.deactivateRecording = function(){

		this.record = false;

	};

	p.createNewBuffer = function(){

		var buffer = new RecordBufferItem();
		buffer.init();
		this._buffers.push(buffer);
			
	};





})();