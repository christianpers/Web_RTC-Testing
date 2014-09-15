(function(){

	window.Countdown = function(){

		this._el = null;

		this._ctx = null;

		this._startTime = new Date().getTime();

	};

	var p = Countdown.prototype;

	Countdown.DURATION = 3000;

	p.setup = function(el){

		var h = document.documentElement.clientHeight;
		var w = document.documentElement.clientWidth;
		this._el = el;
		this._el.style.position = 'absolute';
		this._el.style.top = '0';
		this._el.style.left = '0';
		this._el.style.display = 'none';
		// this._el.height = h;
		// this._el.width = w;

		this._ctx = this._el.getContext('2d');




	};

	p.start = function(){

		var h = document.documentElement.clientHeight;
		var w = document.documentElement.clientWidth;

		this._el.style.display = 'block';

		this._el.height = h;
		this._el.width = w;

		this._startTime = new Date().getTime();
		this._update();
	};

	p.stop = function(){

		this._el.style.display = 'none';

	};

	p._update = function(){

		var timeNow = new Date().getTime();
		var timeLeft = timeNow - (this._startTime + Countdown.DURATION);

		// console.log(timeLeft);

		var numberToShow = 0;
		
		var posTimeLeft = Math.abs(timeLeft);
		var zoomLvl = ( (Math.floor( Math.abs( posTimeLeft/1000 ) * 10 ) ) ) % 10;
		if (posTimeLeft > 2000){
			numberToShow = 3;
		}else if (posTimeLeft >  1000){
			numberToShow = 2;
		}else{
			numberToShow = 1;
		}


		var ctx = this._ctx;

		ctx.clearRect(0,0,this._el.width, this._el.height);
		// ctx.scale(.5, .5);
		ctx.fillText(numberToShow.toString(), this._el.width/2,this._el.height/2);
		ctx.font = zoomLvl*30+'px Helvetica';
		ctx.fill();

		console.log(numberToShow.toString(), ' zoom: ',zoomLvl);
		
	

		if (timeLeft >= 0){
			this.stop();
			return;
		}

		var self = this;
		setTimeout(function(){

			self._update();
		},60);

	};



	


})();