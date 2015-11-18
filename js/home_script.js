/**
 * Created by JebySun on 2015/7/12.
 */
$(function(){
    var boxWidthDefault = 240;
    var boxHeightDefault = 160;
    var marginWidth = 4;

    /**
     * 根据网页宽度计算每个box的宽度
     * @returns {boxWidth}
     */
    var calBoxWidth = function() {
        var windowWidth = $(window).width();
        var docWidth = $(document).width();
        var num = Math.floor(windowWidth/boxWidthDefault);
        var leftWidth = windowWidth-num*boxWidthDefault-(num+1)*marginWidth;
        return boxWidthDefault + leftWidth/num;
    };

    /**
     * 调整box尺寸
     */
    var resizeBoxWidth = function() {
        var boxWidth = calBoxWidth();
        $(".box").width(boxWidth).height(boxHeightDefault);
    };

    /**
     * 调整浏览器窗口大小事件处理
     */
    $(window).resize(function(){
        resizeBoxWidth();
    });

    /**
     * 初始化
     */
    var init = function() {
        resizeBoxWidth();
    }();

    //css动画执行完成后改变样式
    $(".box").each(function() {
        var box = this;
        this.addEventListener("webkitAnimationEnd", function(){
            $(box).css("background-color", "#B1FF3D").text("JavaScript");
        }, false);
    });

});