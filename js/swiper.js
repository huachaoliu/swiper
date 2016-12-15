(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(jQuery)
    }
})(function ($) {
    var Swiper = function (options) {
        var defaults = {
            n: 0,
            timer: null,
            swp: $('.swiper'),
            swpList: $('.swiper-list'),
            swpNode: $('.swiper-list-node'),
            prev: $('.swiper-btn-prev'),
            next: $('.swiper-btn-next'),
            btn: $('.swiper-index-child'),
            nodeW: $(window).width(),
            height: $(window).height(),
            len: 3
        };
        var opt = $.extend(defaults, options);
        this.init(opt);
    }
    Swiper.prototype = {
        init: function (opt) {
            var ua = this.useAgent();
            this.layout(opt);
            switch(ua) {
                case 'ios':
                    break;
                case 'android':
                    break;
                case 'pc':
                     this.PcStart(opt);
                    break;
                default:                   
                    break;
            }
        },
        useAgent: function () {
            var ua = window.navigator.userAgent;
            var ipad = ua.match(/iPad/g);
            var iphone = ua.match(/iPhone/g);
            var ipod = ua.match(/iPod/g);            
            var android = ua.match(/Android/g);            
            if (ipad != null || iphone != null || ipod != null) {
                return 'ios';
            } else if (android != null) {
                return 'android';
            } else {
                return 'pc';
            }
        },
        layout: function (opt) {
            opt.swp.height(opt.height);
            opt.swpNode.width(opt.nodeW);
            opt.swpList.width(opt.nodeW * opt.len);
        },
        PcStart: function (opt) {
            opt.btn.on('click', function () {
                var _this = $(this);
                var index = _this.index();
                if (_this.hasClass('swiper-active')) {
                    return false;
                } else {
                    opt.btn.removeClass('swiper-active');
                    _this.addClass('swiper-active');
                    var _left = parseInt(opt.swpNode.width()) * index;
                    opt.swpList.animate({
                        left: -_left
                    });
                }
            });
            function autoPlay () {
                opt.n = opt.n > opt.btn.length ? 0 : ++opt.n;
                 opt.btn.eq(opt.n).trigger('click');
            }
            opt.timer = setInterval(autoPlay, 3000);
            opt.swp.hover(function () {
                clearInterval(opt.timer);
            }, function () {
                opt.timer = setInterval(autoPlay, 3000);
            });
        }
    }
    $.fn.swiper = function (options) {
        var _this = $(this);
        return new Swiper(options);
    };
});
