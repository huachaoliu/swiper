/**
 * @param: api 
 * @param: step1=> 初始化数据 
 * @param: step2=> 自适应
 * @TODO: step3=>优化移动端滑动事件
 * @para: 移动端滑动时，当touchstart的时候，检测手势方向，滑动页面到指定位置，当手势离开时，判断左右距离，然后往近的地方滑动(即left:+1 or -1)
*/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
})(function ($) {
    var HzSwiper = function (container, options) {
        var _this_ = this;
        this.container = container;
        var defaultsConfig = {
            num: 0,
            lens: 3,
            timer: null,
            speed: 3000,
            cssSpeed: 500,
            transition: false,            
            active: 'swiper-active',
            swiper: $('.swiper'),
            swiperWidth: $(window).width(),
            swiperHeight: $(window).height(),
            swiperList: $('.swiper-list'),
            swiperNode: $('.swiper-list-node'),
            swiperNodeHtml: $('.swiper-list-node-html'),
            swiperNodeImg: $('.swiper-list-node-img'),
            arrow: $('.swiper-btn'),
            prev: $('.swiper-btn-prev'),
            next: $('.swiper-btn-next'),
            swiperBtn: $('.swiper-index-child')        
        };
        var opts = $.extend(defaultsConfig, options);
        // alert();
        this.initSwiper(opts);
    };
    HzSwiper.prototype = {
        constructor: HzSwiper,
        initSwiper: function (opts) {
            var _this_ = this;
            var ua = this.getUserAgent();
            this.layout(opts);
            switch(ua) {
                case 'ios':
                    _this_.animateMobileIos(opts);
                    break;
                case 'android':
                    _this_.animateMobileIos(opts);
                    break;
                default:        
                    setTimeout(function () {
                        if (_this_.checkSupportCSS3('transition') && opts.transition) {
                            _this_.translateComputer(opts);
                        } else {
                            _this_.animateComputer(opts);
                        }                                   
                    }, 1);
                    break;
            }
        },
        layout: function (opts) {
            opts.swiperNodeImg.width(opts.swiperWidth);
            var height = opts.swiperNodeImg.height() ? opts.swiperNodeImg.height() : opts.swiperHeight;
            this.container.css({
                width: opts.swiperWidth,
                height: height
            }); 
            opts.arrow.css({'lineHeight': height + 'px'});
             opts.swiperNodeHtml.css({
                width: opts.swiperWidth, 
                height: height           
            });
            opts.swiperList.width(opts.swiperWidth * opts.lens);
            opts.swiperNode.width(opts.swiperWidth);
            this.adaption(opts);                        
        },
        adaption: function (opts) {
            var _this_ = this;
            $(window).on('resize', function () {
                var width = $(window).width();
                var height = $(window).height();
                opts.swiperWidth = width;
                opts.swiperHeight = height;
                opts.swiperNodeImg.width(width);
                
                opts.swiperList.css({
                    width: width * opts.lens, 
                    left: _this_.checkSupportCSS3('transition') ? 0 : -(opts.num * width),
                    transform: _this_.checkSupportCSS3('transition') && 'translate3d('+-(opts.num * width)+'px,0px,0px)'
                });
                var imgHeight = opts.swiperNodeImg.height();
                opts.swiperNode.width(width);
                opts.swiperNodeHtml.css({
                    width: width, 
                    height: imgHeight ? imgHeight : opts.swiperHeight        
                });
                _this_.container.css({
                    width: opts.swiperWidth,
                    height: imgHeight ? imgHeight : opts.swiperHeight
                });  
            });
        },
        getUserAgent: function () {
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
        checkSupportCSS3: function (style) {
            var i;            
            var humpString = [];            
            var prefix = ['webkit', 'Moz', 'ms', '0'];
            var htmlStyle = document.documentElement.style;
            _toHumb = function (str) {
                return str.replace(/-(\w)/g, function ($0, $1) {
                    return $1.toUpperCase(); 
                });
            }
            for ( i in prefix) {
                humpString.push(_toHumb(prefix[i] + '-' + style));
                humpString.push(_toHumb(style));
            }

            for (var i in humpString) {
                if (humpString[i] in htmlStyle) return true;
                return false;
            }

        },
        createStyle: function () {
            var styleHtml = '<style></style>';
            $(styleHtml).html(uiStyle);
        },
        animateComputer: function (opts) {
            var _this_ = this;
            opts.swiperBtn.on('click', function () {
                var self = $(this);
                var index = self.index();
                if(self.hasClass(opts.active)) {
                    return false;
                } else {
                    opts.swiperBtn.removeClass(opts.active);
                    self.addClass(opts.active);
                    var _left = -parseInt(opts.swiperWidth) * index;
                    opts.swiperList.animate({
                        left: _left
                    });
                }
            });
            opts.prev.on('click', function () {
                opts.num++;
                if (opts.num > opts.lens - 1) opts.num = 0;
                _this_.startMove(opts);
            });
            opts.next.on('click', function () {
                opts.num--;
                if (opts.num < 0) opts.num = opts.lens - 1;
                _this_.startMove(opts);
            });
            this.container.hover(function () {
                clearInterval(opts.timer);
            }, function () {
                opts.timer = setInterval(function () {
                    _this_.autoPlay(opts);
                }, opts.speed);
            });
        },
        autoPlay: function (opts) {
            opts.num++;
            if (opts.num > opts.lens - 1) opts.num = 0;
            opts.swiperBtn.eq(opts.num).trigger('click');
        },
        animateMobileIos: function (opts) {
            var _this_ = this;
            opts.arrow.css({display: 'none'});
            var startX;
            var touchX;
            this.container.on('touchstart', function (e) {
                clearInterval(opts.timer);
                startX = e.originalEvent.changedTouches[0].pageX;
            });
            this.container.on('touchmove', function (e) {
                touchX = e.originalEvent.changedTouches[0].pageX;
            });
            this.container.on('touchmove', function (e) {
                if (touchX - startX >  0) {
                    opts.num++;
                    if (opts.num > opts.lens - 1) {
                        opts.num = 0;
                        _this_.startMove(opts);
                    } else {
                        return false;
                    }
                } else {
                    opts.num--;
                    if (opts.num < 0) {
                        opts.num = opts.lens - 1;
                        _this_.startMove(opts);
                    } else {
                        return false;
                    }
                }
                opts.timer = setInterval(function () {
                    _this_.autoPlay(opts);
                }, opts.speed);
            });
            opts.timer = setInterval(function () {
                _this_.autoPlay(opts);
            }, opts.speed);
        },
        animateMobileAndroid: function (opts) {},
        startMove: function (opts) {
            opts.swiperBtn.removeClass(opts.active);
            opts.swiperBtn.eq(opts.num).addClass(opts.active);
            opts.swiperList.animate({
               left: -parseInt(opts.swiperWidth) * opts.num
            })
        },
        translateComputer: function (opts) {
            var _this_ = this;
            var left;
            opts.swiperBtn.on('click', function () {
                var self = $(this);
                var index = self.index();
                if(self.hasClass(opts.active)) {
                    return false;
                } else {
                    opts.num = index;                    
                    left = -parseInt(opts.swiperWidth) * index;
                    _this_.translateMove(opts, left);
                }
            });
            opts.next.on('click', function () {
                if (opts.num > opts.lens - 2) {
                    opts.next.css({color: '#eee'});
                } else {
                    opts.num++;                  
                    opts.prev.css({color: '#fff'});  
                    left = -parseInt(opts.swiperWidth) * opts.num;
                    _this_.translateMove(opts, left);
                }
            });
            opts.prev.on('click', function () {
                if (opts.num < 1) {
                    opts.prev.css({color: '#eee'});
                } else {
                    opts.num--;                  
                    opts.next.css({color: '#fff'});                       
                    left = -parseInt(opts.swiperWidth) * opts.num;
                    _this_.translateMove(opts, left);
                }
            });
        },
        translateMove: function (opts, deraction) {
            opts.swiperList.css({
                transitionDuration: opts.cssSpeed + 'ms',
                transform: 'translate3d(' + deraction + 'px ,0 , 0)'
            });
            opts.swiperBtn.removeClass(opts.active);
            opts.swiperBtn.eq(opts.num).addClass(opts.active);
        }
    };

    $.fn.hzswiper = function (options) {
        var _this_ = this;
        return new HzSwiper(_this_, options);
    }
});