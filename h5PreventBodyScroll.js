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
        mask:true,//是否显示蒙层
        maskClick:true,//允许蒙层关闭
        appendEle:'body',
        maskClickName:".h5PreventBodyScroll",
        onEventBindTo:document,//动态绑定到document
        triggerEle:null,//页面上触发click元素
        scrollEle:[],//需要绑定scroll的元素
        scrollTemp:''
    };
    var disableBodyScroll = function(){
        document.addEventListener('mousewheel',preventDefault);
        document.addEventListener('touchmove',preventDefault);

    };
    var enableBodyScroll = function(){
        document.removeEventListener('mousewheel',preventDefault);
        document.removeEventListener('touchmove',preventDefault);

    };
    var preventDefault=function(e) {
        e.preventDefault();
    }
    var stopPropagation=function(e){
        e.stopPropagation();
    }
    var elementsScroll=function(e){
        var isLandscape;//标志是否横竖向
        var _this=this;
        for(var i=0;i<this.settings.scrollEle.length;i++){
            console.log(_this.settings.scrollEle[i]);
            //(function(i){
                $(_this.settings.html).on("touchstart",_this.settings.scrollEle[i],function(e){
                    startX = e.originalEvent.changedTouches[0].pageX;/*jquery不能使用e.changedTouches[0].pageX获取坐标*/
                    startY = e.originalEvent.changedTouches[0].pageY;
                });
                //document已经preventDefault，不能将事件绑定在document上，没有效果
                $(_this.settings.html).on("touchmove",_this.settings.scrollEle[i],function(e){
                     stopPropagation(e);
                     var rangeX=e.originalEvent.changedTouches[0].pageX-startX;
                     var rangeY=e.originalEvent.changedTouches[0].pageY-startY;
                     isLandscape=Math.abs(rangeY) < Math.abs(rangeX) ?true:false;//true横向，false纵向
                     // 只能纵向滚
                    if(isLandscape){
                        preventDefault(e);
                        return false;
                    }
                    scrollTopOrBottom(rangeY,this,e);
                });
            //})(i);

            /*$(this.settings.html).on("mousewheel",this.settings.scrollEle[i],function(e){
                stopPropagation(e);
                var rangeY = e.wheelDelta || e.detail || 0;
                scrollTopOrBottom(rangeY,this,e);
            });*/
        }
    }
    var scrollTopOrBottom=function(rangeY,ele,e){
        var box = $(ele).get(0);
        if($(box).height() + box.scrollTop >= box.scrollHeight){
            if(rangeY < 0) {
                preventDefault(e);
                return false;
            }
        }
        if(box.scrollTop === 0){
            if(rangeY > 0) {
                preventDefault(e);
                return false;
            }
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
                console.log(this.settings.triggerEle);
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
            this.settings.html.append(this.settings.scrollTemp==""?"":this.settings.scrollTemp);
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
        elementsScroll:elementsScroll,
    }
    // var h5PreventBodyScroll=function(options){
    //     return new preventBodyScroll(options);
    // }
    //window.h5PreventBodyScroll=h5PreventBodyScroll;
    window.h5PreventBodyScroll=preventBodyScroll;
}));