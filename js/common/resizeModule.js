/**
 * Created by ankit.goel on 3/18/14.
 */

var resizeModule = {
    resizeClass: "ui-resizable-handle",
    jqueryUIClass: "ui-resizable",
    init: function () {
        //   $('#container').append('<div id="abc" style="left:100px;top:200px;position:relative;height:100px;width:100px;background:red;"></div>');
        //   $('#container').append('<div id="abc1" style="left:200px;top:30px;position:relative;height:100px;width:100px;background:red;"></div>');
        $('body').on('click', this.checkResizeAvailable.bind(this));
        //  this.makeResize(document.getElementById('abc'), function (event, ui) {                console.log(event.target.id);            }, null);
    },
    checkResizeAvailable: function (e) {
        var notElement = $("." + this.jqueryUIClass).children().hasClass(this.resizeClass);
        if (notElement) {
            $('.' + this.resizeClass).removeClass(this.resizeClass);
        }
    },
    makeResize: function (el,onResizeCallback,onStartCallBack,onStopCallBack,context) {
        var defaultSetting = {
            handles: "all",
            containment: "parent"
        };
        $(el).resizable({
            handles: defaultSetting.handles,
            containment: defaultSetting.containment,
            resize: function (event, ui) {
                if (typeof onResizeCallback === "function")
                    onResizeCallback.call(context, event, ui);
            },
            start:function(event, ui){
                if (typeof onStartCallBack === "function")
                    onStartCallBack.call(context, event, ui);
            },
            stop:function(event, ui){
                if (typeof onStopCallBack === "function")
                    onStopCallBack.call(context, event, ui);
            }
        });
        $(el).on("click", {o: this}, this.applyEvent);
        this.hideAllResize();
        this.startElementResize(el);
    },
    applyEvent: function (e) {
        e.stopPropagation();
        e.data.o.checkResizeAvailable();
        e.data.o.startElementResize(this);
    },
    startElementResize: function (el) {
        //console.log($(el).children().hasClass(this.resizeClass))
        for(var i=0;i<$(el).children().length;i++)
        {
            if(!$(el).children().eq(i).hasClass("tickContainer") && !$(el).children().eq(i).hasClass("lineContainer") && !$(el).children().eq(i).hasClass("matchLine_hotSpotCan") && !$(el).children().eq(i).hasClass("tickImg") && !$(el).children().eq(i).hasClass("audioWrapper") && !$(el).children().eq(i).hasClass("commonClass"))
            {
                $(el).children().eq(i).addClass(this.resizeClass);
            }
        }

        //console.log($(el).children().length)
    },
    hideElementResize: function (el) {
        $(el).children().removeClass(this.resizeClass);
    },
    hideAllResize: function () {
        $('.' + this.resizeClass).removeClass(this.resizeClass);
    }
};