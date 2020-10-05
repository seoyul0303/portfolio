var PORTFOLIO = window.PORTFOLIO || {};
PORTFOLIO = (function($) {

    "use strict";
    var standard = "";

    var common = {
        mobileConfirm : function(){
            if(window.innerWidth <= 960){
                $("body").removeClass().addClass("mobile");
                standard = "mobile";
            }else{
                $("body").removeClass().addClass("desktop");
                standard = "desktop";
            }
        },

        imgChange : function(selector){
            $(selector).each(function(){
                var desktopSrc = $(this).attr("data-desktop");
                var mobileSrc = $(this).attr("data-mobile");
                if (window.innerWidth <= 768) {
                    $(this).attr("style", "background-image:url("+mobileSrc+")");
                }else {
                    $(this).attr("style", "background-image:url("+desktopSrc+")");
                }
            });
        },

        listOpener : function(){
            var windowHeight= $(window).height();

            $(".project li").each(function(i){
                var scrollTop = $(window).scrollTop();
                var contentTop = $(this).offset().top; 

                if( scrollTop > contentTop - (windowHeight*0.5) ){
                    $(this).addClass('on');
                }else{
                    $(this).removeClass('on');
                }
            });
        },

        scroll : function(){
            var me = this;
            $(window).on("scroll", function(){
                common.listOpener();
            });
        },

        resize : function(){
            var me = this;
            $(window).resize(function(){
                common.mobileConfirm();
                common.imgChange('.detail .img');
            });
        },

        init : function(){
            common.mobileConfirm();
            common.scroll();
            common.listOpener();
            common.imgChange('.detail .img');
            common.resize();
        }
    };

    //ready
    $(document).ready(function(){
        common.init();

        //landscape check
        window.addEventListener("orientationchange", function() {
            var orientation = window.orientation;
            common.sliderHeightSetting();
            common.sliderShareBtnSetting();
            switch (orientation) {
                case 0:
                    $("html").removeClass("landscape");
                    break;
                case 90:
                    $("html").addClass("landscape");
                    break;
                case -90:
                    $("html").addClass("landscape");
                    break;
            }
        }, false);


        $(window).resize(function(){
            orientation();
        });

        function orientation(){
            var browerWidth = $(window).width();
            var browerHeight = $(window).height();

            if( browerHeight > browerWidth ){
                $("html").removeClass("landscape");
            }else{
                $("html").addClass("landscape");
            }
        }
        orientation();
    });
    //ready end

    return{
        // closeBtnClick : common.closeBtnClick
    }

})(jQuery);
