;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery"], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
    var startX,startY;
    var defaults ={
        mask:true,
        maskClick:true,
        appendEle:'body',
        maskClickName:".h5PreventBodyScroll",
        onEventBindTo:document,
        triggerEle:null,
        scrollEle:[],
        scrollTemp:'',
    };
    var disableBodyScroll = function(){
        document.addEventListener('touchmove',preventDefault);
        document.addEventListener('mousewheel',preventDefault);
    };
    var enableBodyScroll = function(){
        document.removeEventListener('touchmove',preventDefault);
        document.removeEventListener('mousewheel',preventDefault);
    };
    var preventDefault=function(e) {
        e.preventDefault();
    }
    var stopPropagation=function(e){
        e.stopPropagation();
    }
    var elementsScroll=function(e){
        var isLandscape;//标志是否横竖向
        for(var i=0;i<this.settings.scrollEle.length;i++){
            $(this.settings.html).on("touchstart",this.settings.scrollEle[i],function(e){
                startX = e.originalEvent.changedTouches[0].pageX;/*jquery不能使用e.changedTouches[0].pageX获取坐标*/
                startY = e.originalEvent.changedTouches[0].pageY;
                console.log("x:"+startX+",y:"+startY);
            });
            $(this.settings.html).on("touchmove",this.settings.scrollEle[i],function(e){
                 e.stopPropagation();
                 var rangeX=e.originalEvent.changedTouches[0].pageX-startX;
                 var rangeY=e.originalEvent.changedTouches[0].pageY-startY;
                 isLandscape=Math.abs(rangeY) < Math.abs(rangeX) ?true:false;//true横向，false纵向
                 console.log("rangeX:"+startX+",rangeY:"+startY);
                 var box = $(this).get(0);
                 console.log($(box).height());
                 console.log(box.scrollHeight);
                 console.log(box.scrollTop);
                if($(box).height() + box.scrollTop >= box.scrollHeight){
                    if(rangeY < 0) {
                        e.preventDefault();
                        return false;
                    }
                }
                if(box.scrollTop === 0){
                    if(rangeY > 0) {
                        e.preventDefault();
                        return false;
                    }
                }
            });
        }
    }
    /*var methods={
        disableBodyScroll:disableBodyScroll,
        test:test
    }*/
    function preventBodyScroll(options){
        this.settings=$.extend({},defaults,options || {});
    }
    preventBodyScroll.prototype={
        init:function(){
            if($(this.settings.triggerEle).attr("show")!=undefined){
                this.show("#"+$(this.settings.triggerEle).attr("show"));
            }
            else{
                this.htmlTemplate();
            }
            this.disableBodyScroll();
        },
        htmlTemplate:function(){
            var randomId="id"+(new Date()).getTime();
            this.settings.html=$('<div class="h5PreventBodyScroll '+(this.settings.mask?'':'maskFalse')+'" id="'+randomId+'"></div>');
            this.settings.html.appendTo(this.settings.appendEle);
            $(this.settings.triggerEle).attr("show",randomId);
            this.bindEvent();
        },
        bindEvent:function(){
            if(this.settings.maskClick){
                /*被点击绑定在document上在IOS无效（测试系统9.3），解决方法：在被点击事件加上cursor: pointer;样式*/
                $(this.settings.onEventBindTo).on("click",this.settings.maskClickName,$.proxy(function(event){
                     var $target = $(event.target);
                     if($target.is(this.settings.maskClickName)){
                        this.closed(this.settings.html.attr("id"));
                     }
                },this));
            }
        },
        show:function(id){
            $(id).show();
        },
        closed:function(id){
            if(id==undefined){
                $(this.settings.maskClickName).hide();
            }
            else{
                $("#"+id).hide();
            }
            this.enableBodyScroll();
        },
        disableBodyScroll:disableBodyScroll,
        enableBodyScroll:enableBodyScroll,
        elementsScroll:elementsScroll
    }
    // var h5PreventBodyScroll=function(options){
    //     return new preventBodyScroll(options);
    // }
    //window.h5PreventBodyScroll=h5PreventBodyScroll;
    window.h5PreventBodyScroll=preventBodyScroll;
}));