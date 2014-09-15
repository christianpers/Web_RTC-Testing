(function(){

	window.SequencerUI = function(){

		this.sequencerCanvasCtx = null;
		this.sequencerCanvasEl = null;
		this.sequencerMousedownTracker = [];
		this.activeNotes = [];
		this._id = undefined;

		this._UIDirection = 'horizontal';

	};

	var p = window.SequencerUI.prototype;

	p.setup = function(id){

		this._id = id;

		var screenHeight = document.documentElement.clientHeight;
		var screenWidth = document.documentElement.clientWidth;

		if (screenWidth < screenHeight){
			this._UIDirection = 'vertical';
		}

		var wrapper = document.getElementById('sequencerUI');


		var seqUIObj = this.createSeqUI(wrapper);
		this.sequencerCanvasCtx = seqUIObj.ctx;
		this.sequencerCanvasEl = seqUIObj.el;
		this.drawSeqUI(wrapper);
		this.sequencerCanvasEl.addEventListener('mousedown', this.onSequencerMousedown.bind(this));
		
	};

	p.createSeqUI = function(parent){

		var screenHeight = document.documentElement.clientHeight;
		var screenWidth = document.documentElement.clientWidth;

		var height = 40;
		var width = (screenWidth-100);

		if (this._UIDirection == 'vertical'){
			height = screenHeight -100;
			width = 40;
		}

		var canvas = document.createElement('canvas');
		canvas.className = 'sequencerItem';

		

		canvas.height = height;
		canvas.width = width;

		parent.appendChild(canvas);

		var ctx = canvas.getContext('2d');
		var ret = {ctx: ctx, el: canvas};
		return ret;

	};

	p.drawSeqUI = function(){

		var screenHeight = document.documentElement.clientHeight;
		var screenWidth = document.documentElement.clientWidth;

		var pushBoxPos = (this.sequencerMousedownTracker.length == 0) ? true : false;

		var margin = 2;
		var height = this.sequencerCanvasEl.height;
		var width = this.sequencerCanvasEl.width/16-margin;

		if (this._UIDirection == 'vertical'){
			height = this.sequencerCanvasEl.height/16-margin;
			width = this.sequencerCanvasEl.width;
		}

		this.sequencerCanvasCtx.clearRect(0,0, this.sequencerCanvasEl.width, this.sequencerCanvasEl.height);
		
		for (var i=0;i<16;i++){
			var x = (margin + (width+(margin/16))) * i;
			var y = 0;
			if (screenWidth < screenHeight){
				y = (margin + (height+(margin/16))) * i;
				x = 0;
			}
			this.sequencerCanvasCtx.fillStyle = "rgba(102,184,122,1)";
			// if (i == note) this.sequencerCanvasCtx.fillStyle = "rgba(102,184,122,.5)";
			if (this.activeNotes.indexOf(i) > -1) this.sequencerCanvasCtx.fillStyle = "rgba(47,90,58,1)";
			this.sequencerCanvasCtx.fillRect(x,y,width, height);
			if (pushBoxPos){
				var obj = {x:x,y:y,height:height, width: width};
				this.sequencerMousedownTracker.push(obj);
			}
		}
	};

	p.onSequencerMousedown = function(e){

		if (e.touches){
			e = e.touches[0];
		}

		var x = e.x;
		var y = e.y;
		var parentOffsetLeft = e.target.offsetLeft;
		var parentOffsetTop = e.target.offsetTop;

		var relativeX = x - parentOffsetLeft;
		var relativeY = y - parentOffsetTop;
		var clickedNoteIndex = undefined;

		for (var i=0;i<this.sequencerMousedownTracker.length;i++){
			var item = this.sequencerMousedownTracker[i];

			if (this._UIDirection == 'vertical'){
				if (relativeY >= item.y && relativeY <=(item.y + item.height))
					clickedNoteIndex = i;
			
			}else{
				if (relativeX >= item.x && relativeX <= (item.x + item.width))
					clickedNoteIndex = i;
			}		
		}

		if (clickedNoteIndex !== undefined){
			for (var i=0;i<this.activeNotes.length;i++){
				var noteIndex = this.activeNotes[i];
				if (noteIndex == clickedNoteIndex){
					this.activeNotes.splice(i,1);
					// console.log('remove note !');
					window.sendNoteReg(noteIndex, this._id);
					return;
				}
			}
			this.activeNotes.push(clickedNoteIndex);
			window.sendNoteReg(clickedNoteIndex, this._id);
			// console.log('add note !');
		}

	};

	p.update = function(){

		this.drawSeqUI();	
	};

})();