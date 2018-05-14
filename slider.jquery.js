;(function($) {
    function Slider(opt) {
        var that = this,
            defaults = {
                speed: 1000, //动画过渡的速度(毫秒)
                delay: 2000, //每张幻灯片的间隔时间(毫秒)
                init: 0, //初始化延迟时间(毫秒),如果不需要延迟就设置为false
                pause: true, //当鼠标指针浮动在当前区域内时是否暂停自动播放
                autoplay: true, //是否允许自动播放
                fullscreen: false, //是否为全屏轮播
                easing: 'swing', //动画的缓动函数linear swing
                start: null, //每个动画前函数，参数为(容器,移动前的item)
                complete: null, //每个动画后函数，参数为(容器,移动后的item)
                keys: true, //键盘导航
                items: 'ul', //幻灯片的容器选择器 
                item: 'li', //需要滚动的选择器
                dots: true, //是否显示导航点
                arrows: true, //向前向后滚动箭头
                prev: '&lt;', // 向前文字或html
                next: '&gt;' // 向后文字或html
            };
        that.init = function(el, o) {
            that.opt = $.extend({}, defaults, o);
            that.el = el;
            that.ul = el.find(that.opt.items);
            //记录容器宽高值,取最大值
            that.max = [el.outerWidth(), el.outerHeight()];
            that.li = el.find(that.opt.item).each(function(index) {
                var $li = $(this),
                    width = $li.outerWidth(),
                    height = $li.outerHeight();
                if (width > that.max[0]) that.max[0] = width;
                if (height > that.max[1]) that.max[1] = height;
            });

            var opt = that.opt,
                max = that.max,
                ul = that.ul,
                li = that.li,
                len = li.length;
            that.i = 0;
            //容器样式初始化
            el.css({
                width: that.max[0],
                height: li.first().outerHeight(),
                overflow: 'hidden'
            });
            ul.css({
                position: 'relative',
                left: 0,
                width: (len * 100) + '%'
            });
            li.css({
                'float': 'left',
                width: max[0] + 'px'
            });
            opt.autoplay && setTimeout(function() {
                if (opt.delay) {
                    that.play();
                    if (opt.pause) {
                        el.on('mouseover mouseout', function(e) {
                            that.stop();
                            e.type == 'mouseout' && that.play();
                        });
                    }
                }
            }, opt.init);

            //键盘控制左、右
            if (opt.keys) {
                $(document).keydown(function(e) {
                    var key = e.which;
                    if (key == 37) {
                        that.prev();
                        that.play();
                    } else if (key == 39) {
                        that.next();
                        that.play();
                    }
                    // else if (key == 27) {
                    //     that.stop();
                    // }
                });
            }

            //导航点
            opt.dots && nav('dot');
            //箭头
            opt.arrows && nav('arrow');

            //全屏轮播
            if (opt.fullscreen) {
                var img = li.find('img');
                $(window).resize(function() {
                    that.r && clearTimeout(that.r);
                    that.r = setTimeout(function() {
                        var winWidth = $(window).width(),
                            style = {
                                width: winWidth
                            };
                        img.css('width', winWidth);
                        style.height = img.css('height');
                        // img.parent().css(style);
                        li.css(style);
                        el.css(style);
                    });
                }).resize();
            };
        };
        that.moveTo = function(index, callback) {
            if (that.t) {
                that.stop();
                that.play();
            }
            var opt = that.opt,
                el = that.el,
                ul = that.ul,
                li = that.li,
                current = that.i,
                target = li.eq(index);

            //动画前回调，参数(容器,移动前的item)
            $.isFunction(opt.start) && !callback && opt.start(el, li.eq(current));

            //如果一张幻灯片也没有或者索引无效
            if (!target.length) index = 0;
            if (index < 0) index = li.length - 1;
            target = li.eq(index);

            var speed = callback ? 5 : opt.speed,
                easing = opt.easing,
                obj = {
                    height: target.outerHeight()
                };
            if (!ul.queue('fx').length) {
                el.find('.dot').eq(index).addClass('active').siblings().removeClass('active');
                el.animate(obj.speed, easing) && ul.animate($.extend({
                    left: '-' + index + '00%'
                }, obj), speed, easing, function(data) {
                    that.i = index;
                    //动画后回调，参数(容器,移动后的item)
                    $.isFunction(opt.complete) && !callback && opt.complete(el, target);
                })
            }
        };
        that.play = function() {
            that.t = setInterval(function() {
                that.moveTo(that.i + 1);
            }, that.opt.delay);
        };
        that.stop = function() {
            that.t = clearInterval(that.t);
            return that;
        };
        that.next = function() {
            return that.stop().moveTo(that.i + 1);
        };
        that.prev = function() {
            return that.stop().moveTo(that.i - 1);
        };

        //创建导航点和箭头
        function nav(name, html) {
            if (name == 'dot') {
                html = '<ol class="dots">';
                $.each(that.li, function(index) {
                    html += '<li class="dot' + (index == that.i ? ' active' : '') + '">' + (index + 1) + '</li>';
                });
                html += '</ol>';
            } else {
                html = '<div class="';
                html = html + name + 's">' + html + name + ' prev">' + that.opt.prev + '</div>' + html + name + ' next">' + that.opt.next + '</div></div>';
            }
            that.el.addClass('has-' + name + 's').append(html).on('click', '.' + name, function() {
                var me = $(this);
                me.hasClass('dot') ? that.stop().moveTo(me.index()) : (me.hasClass('prev') ? that.prev() : that.next());
            });
        }
    }
    //挂载到$元素上
    $.fn.slider = function(o) {
        var len = this.length;
        return this.each(function(index) {
            var me = $(this),
                key = 'slider' + (len > 0 ? '-' + (index + 1) : ''),
                instance = (new Slider()).init(me, o);
            me.attr('data-key', key);
        });
    };
})(window.jQuery);

//调用
$(function() {
    $('.daigou-slider').slider({
        speed: 1500,
        autoplay: 1,
        fullscreen: 1
    });
});
