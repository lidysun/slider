# slider
响应式图片轮播插件，配置及默认参数：
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
