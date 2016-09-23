;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery"], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
    var defaults ={
        mask:true,
        maskClick:true,
    };
    var disableBodyScroll = function(){
        console.log("disableBodyScroll");
        document.addEventListener('touchmove',preventDefault);
    };
    var preventDefault=function(e) {
        e.preventDefault();
    }
    var stopPropagation=function(e){
        e.stopPropagation();
    }

    var enableBodyScroll = function(){
        document.removeEventListener('touchmove',preventDefault);
    };
    var elementsScroll=function(){
        console.log("a");
    }
    /*var methods={
        disableBodyScroll:disableBodyScroll,
        test:test
    }*/
    function preventBodyScroll(options){
        this.settings=$.extend({},defaults,options || {});
    }
    preventBodyScroll.prototype={
        init:function(options){
            console.log("a");
        },
        //methods:methods,
        disableBodyScroll:disableBodyScroll
    }
    // var h5PreventBodyScroll=function(options){
    //     return new preventBodyScroll(options);
    // }
    //window.h5PreventBodyScroll=h5PreventBodyScroll;
    window.h5PreventBodyScroll=preventBodyScroll;
}));