(function($){
	//컨텐츠 최소 높이 설정
	function ConMinHeight(element, headerId, footerId){
		this.$header = $(headerId);
		this.$footer = $(footerId);
		this.headerHeight = 0;
		this.footerHeight = 0;
		
		this.init(element);
	}
	ConMinHeight.prototype = {
		init : function(element){
			this.$content = $(element);
			this.winHeight = $(window).outerHeight();
			if( this.$header.length ){
				this.headerHeight = this.$header.outerHeight();
			}
			if( this.$footer.length ){
				this.footerHeight = this.$footer.outerHeight();
			}
			this.contentHeight = this.winHeight - this.headerHeight - this.footerHeight;
			console.log(this.contentHeight, this.winHeight, this.headerHeight, this.footerHeight);
			this.$content.css({
                'height' : this.contentHeight+'px'
            });
		}
	}
	
	$.defaultConMinHeight = {
		headerId : null,
		footerId : null
	}

	$.fn.conMinHeight = function(optionList){

		this.each(function(index){
			var options = $.extend(null, $.defaultConMinHeight, optionList);
			var conMinHeight = new ConMinHeight(this, options.headerId, options.footerId);
		})

		return this;
	}
	
	//footer topbutton(따라다니는 탑버튼)
	function TopButton(element, footerId){
		this.$footer = $(footerId);
		this.winScroll = 0;

		this.init(element);
		this.scroll();
		this.moveTop();
		this.resize();
	}

	TopButton.prototype = {
		init : function(element){
			this.$topBtn = $(element);
			this.winHeight = window.innerHeight;
			if( this.$footer.length ){ //footer 값이 없을때
				this.footOffset = this.$footer.offset().top;
			}else{
				this.footOffset = $('body').outerHeight();
			}
		},
		scroll : function(){
			var me = this;
			$(window).scroll(function(){
				me.winScroll = $(window).scrollTop();
				me.setPosition();
			});
		},
		setPosition : function(){
			//console.log(this.winScroll, this.winHeight, this.footOffset);
			if( this.winScroll + this.winHeight <= this.footOffset ){
				this.$topBtn.css({
					'display' : 'block',
					'position' : 'fixed',
					'bottom' : 0
				});
				if( this.winScroll == 0){
					this.$topBtn.css({
						'display':'none'
					});
				}
			}else{
				this.$topBtn.css({
					'display' : 'block',
					'position' : 'absolute',
					'bottom' : this.$footer.outerHeight()
				});
			}
		},
		moveTop : function(){
			var me = this;
			me.$topBtn.on('click',function(){
				$('html, body').animate({scrollTop:0},500);
			});
		},
		resize : function(){
			var me = this;

			$(window).resize(function(){
				me.init();
			});
		}
	}

	$.defaultTopButton = {
		footerId : null
	}

	$.fn.topButton = function(optionList){

		this.each(function(index){
			var options = $.extend(null, $.defaultTopButton, optionList);
			var topButton = new TopButton(this, options.footerId);
		})

		return this;
	}

	//레이어 팝업 열기
	function LayerOpen(element){
		this.$overlay = null;
		this.scrollTop = null;
		this.browserHeight = null;
		this.popHeight = null;
		this.layerTop = null;
		this.popTop = null;
		this.menuHeight = null;
		this.$layer = $(element);
		
		this.init(element);
		this.open();
	}

	LayerOpen.prototype.init = function(element){
		this.$overlay = $('.overlay');
		this.scrollTop = $(window).scrollTop();
		this.browserHeight = window.innerHeight;
		this.popHeight = this.$layer.innerHeight();
		this.layerTop = ( this.browserHeight - this.popHeight )/2 ;
		if(this.layerTop < 0){
            this.layerTop = 0;
        }
		this.popTop = this.layerTop + this.scrollTop;
	},
	LayerOpen.prototype.open = function(){
		this.$layer.css({ 'top' : this.popTop }).show();
		this.$overlay.show();
	}


	$.fn.layerOpen = function(){
		this.each(function(index){
			var layerOpen = new LayerOpen(this);
		});
	}
	
	//레이어 팝업 닫기
	function LayerClose(element){
		this.$overlay = null;
		this.$layer = $(element);

		this.init(element);
	}

	LayerClose.prototype.init = function(element){
		this.$overlay = $('.overlay');
		this.$overlay.hide();
		this.$layer.hide().attr('style','');
	}

	$.fn.layerClose = function(element){
		this.each(function(index){
			var layerClose = new LayerClose(this);
		});
	}
	
	function RadialMenu(element, distance, duration, delayTime){
		this.distance = distance;
		this.duration = duration;
		this.delayTime = delayTime;
		
		this.init(element);
		this.position();
		this.clickMask();
	}
	
	RadialMenu.prototype.init = function(element){
		this.$wrap = $(element);
		this.$standard = this.$wrap.find('.inner');
		this.$menu = this.$wrap.find('li');
		this.$mask = this.$wrap.find('.mask');
		this.amount = this.$menu.length;
		this.xPosition = [];
		this.yPosition = [];
		this.open = false;
	},
	RadialMenu.prototype.position = function(){
		this.degree = 180 / (this.amount-1);
		for(var i=0; i<this.amount ; i++){
			this.angle = (( i * this.degree ) + 90) * ( Math.PI / 180 );
			this.x = ( Math.cos( this.angle ) * this.distance ).toFixed(3);
			this.y = ( Math.sin( this.angle ) * this.distance ).toFixed(3);
			this.xPosition.push(this.x);
			this.yPosition.push(this.y);
		}
	},
	RadialMenu.prototype.action = function(e){
		var me = this;

		if( !me.$menu.is(':animated') ){
			if( me.open == false ){
				me.$standard.each(function(){
					for(var i=0; i<me.amount; i++){
						me.$menu.eq(i).delay( i*me.delayTime ).animate({
							'left' : me.xPosition[i] + 'px',
							'bottom' : me.yPosition[i] + 'px'
						}, me.duration, 'easeOutBack');
					}
				});

				me.open = true;
			}else{
				me.$standard.each(function(){
					for(var i=0; i<me.amount; i++){
						me.$menu.eq(i).delay(((me.amount-1)-i)*me.delayTime).animate({
							'left' : 0,
							'bottom': 0
						}, me.duration, 'easeInOutCubic');
					}
				});
				me.open = false;
			}
		}
	},
	RadialMenu.prototype.clickMask = function(){
		var me = this;
		me.$mask.click(function(){
			me.action();
		});
	}

	$.defaultRadialMenu = {
		distance : 150, 
		duration : 300, 
		delayTime : 70
	}

	$.fn.radialMenu = function(optionList){

		this.each(function(index){
			var options = $.extend(null, $.defaultRadialMenu, optionList);
			var radialMenu = new RadialMenu(this, options.distance, options.duration, options.delayTime);
		})

		return this;
	}

})(jQuery)
