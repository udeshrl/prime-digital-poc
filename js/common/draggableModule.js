/**
 * Created by ankit.goel on 3/18/14.
 */

var draggableModule = {
    draggableClass: "custom-drag-class",
    checkResizeAvailable: function (e) {
        var notElement = $("." + this.jqueryUIClass).children().hasClass(this.resizeClass);
        if (notElement) {
            $('.' + this.resizeClass).removeClass(this.resizeClass);
        }
    },
    makeDraggable: function (el, onDragCallback, onStartCallback, onStopCallback, context) {
        var defaultSetting = {
            addClass: false,
            containment: "parent",
            cursor: "pointer"
        };
        $(el).addClass(this.draggableClass).draggable({
            addClass: defaultSetting.addClass,
            containment: defaultSetting.containment,
            cursor: defaultSetting.cursor,
            drag: function (event, ui) {
                if (typeof onDragCallback === "function")
                    onDragCallback.call(context, event, ui);
            },
            start: function (event, ui) {
                if (typeof onStartCallback === "function")
                    onStartCallback.call(context, event, ui);
            },
            stop: function (event, ui) {
                if (typeof onStopCallback === "function")
                    onStopCallback.call(context, event, ui);
            }
        });
    },
    disableDrag: function (el) {
        $(el).draggable("option", "disabled", true);
    },
    enableDrag: function (el) {
        $(el).draggable("option", "disabled", false);
    },
    removeDrag: function (el) {
        $(el).removeClass(this.draggableClass).draggable("destroy");
    },
    getDraggableList:function(){
        return $("."+this.draggableClass);
    }
};
