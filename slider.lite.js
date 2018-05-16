/*精简版*/
$.fn.slider = function(opt) {
    var $slider = $(this);
    return $slider.each(function() {
        var $me = $(this);
        var defaults = {
            items: '.shop-products',
            item: 'li',
            quantity: 1,
            pause: 1,
            delay: 3000,
            speed: 1000,
            arrows: true,
            easing: 'swing',
            autoplay: true,
            starting: null,
            prev: '&lt',
            next: '&gt'
        };
        $me.opt = $.extend({}, defaults, opt);
        $me.i = 0;
        var $ul = $me.find($me.opt.items),
            $li = $ul.find($me.opt.item),
            len = $li.length,
            itemW = $li.eq(0).outerWidth(true);

        $ul.css({
            'position': 'relative',
            'width': len * itemW
        });

        $me.moveTo = function(index) {
            if ($me.opt.starting) {
                $.isFunction($me.opt.starting) && $me.opt.starting($me.opt);
            }
            var page = Math.ceil(len / $me.opt.quantity);
            index = index >= page ? 0 : index < 0 ? page - 1 : index;
            if ($me.t) {
                $me.stop();
                $me.play();
            }
            if (!$ul.queue('fx').length) {
                $ul.animate({
                    left: '-' + ($me.opt.quantity * itemW * index)
                }, $me.opt.speed, $me.opt.easing, function() {
                    $me.i = index;
                });
            }
        };

        $me.play = function() {
            clearInterval($me.t);
            $me.t = setInterval(function() {
                ++$me.i;
                $me.moveTo($me.i);
            }, $me.opt.delay);
            return $me;
        };

        $me.stop = function() {
            clearInterval($me.t);
            return $me;
        };

        $me.prev = function() {
            $me.moveTo($me.i - 1);
        };

        $me.next = function() {
            $me.moveTo($me.i + 1);
        };

        //鼠标滑过
        $me.hover(function() {
            $me.opt.pause && $me.stop();
        }, function(e) {
            $me.opt.autoplay && $me.play();
        });

        //左右箭头
        $me.opt.arrows && nav('arrow');

        function nav(name, html) {
            if (name == 'arrow') {
                html = '<div class="';
                html = html + name + 's">' + html + name + ' prev">' + $me.opt.prev + '</div>' + html + name + ' next">' + $me.opt.next + '</div></div>';
            }
            $me.addClass('has-' + name + 's').append(html).on('click', '.' + name, function() {
                var $btn = $(this);
                $btn.hasClass('prev') ? $me.prev() : $me.next();
            });
        }

        //自动播放
        $me.opt.autoplay && $me.play();
    });
};

/*调用*/
$('.slider_profile').each(function() {
    var $me = $(this);
    var $item = $me.find('.item');
    var length = $item.length;
    length > 4 && $me.slider({
        quantity: 4
    });
});