/*
 * Created by Udesh KumarS on 06/02/14.
 */

/* text widget component structure */

/*Dependency files
 * css-htmlEditor.css
 * js-jQuery v2.03, underscore v1.6, backbone v1.0, jQueryUI v1.8, ResizeModule.js, DraggableModule.js,Utility.js
 * html-
 * */
var htmlEditor = (function(o) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var model = Backbone.Model.extend({
        "default": {},
        initialize: function(options) {
            this.initObject = options;
            this["default"] = options;
        },
        reset: function() {
            this.set(this.initObject);
        }
    });
    var view = Backbone.View.extend({
        initialize: function(options) {
            var o = this;
            o.el = options.el;
            o.model = options.model;
        },
        width: function() {
            this.el.width(parseInt(this.model.get("width")));
        },
        height: function() {
            this.el.height(parseInt(this.model.get("height")));
        },
        left: function() {
            this.el.css("left", parseInt(this.model.get("left")));
        },
        top: function() {
            this.el.css("top", parseInt(this.model.get("top")));
        },
        destroy: function() {
            this.model = undefined;
            this.el.remove();
        },
        updateModel: function() {
            var a = this.el;
            var textVal = tinyMCE.activeEditor.getContent(); // get the content from html editor
            this.model.set('text', textVal); // add content in model text
        },
        reset: function() {
            this.model.reset();
        }
    });
    var uiSetting = {
        authorParent: "author_content_container",
        widthDifference: Role == "author" ? 10 : 0,
        getWidgetTemplate: function(obj, mode) {//overrride this method
            var content = '<div id="conentDiv">' + obj.text + '</div>';
            if (Role === "author") { // textarea required for html editor if author
                content += '<div id="editorDiv"><textarea>' + obj.text + '</textarea></div>'; 
            }
            return $("<div></div>").attr("id", obj.id).css({
                left: obj.left,
                top: obj.top,
                width: obj.width,
                height: obj.height,
                position: 'absolute',
                "z-index": contentZIndex
            }).append(content);
        }
    },
    defaultSetting = {
        widgetType: "htmlEditor",
        left: 0,
        top: 0,
        width: '978px',
        height: '480px',
        id: "",
        editorShow: false,
        text: ""
    },
    contentZIndex = -1,
    edtorTop= "-69px",
    edtorZIndex= 999,
    editorOpacity = "0.9";
    function htmlEditor(options) {
        /*defining all variable at once*/
        var _this = this, cSetting = {}, authParent, tView;
        /*Default setting of widget*/
        function init() {
            cSetting = $.extend({}, defaultSetting, options); //current setting based on options provided in instance making.
            cSetting.id = cSetting.id || (parseInt(Math.random() * 1000) + '_Content_' + Date.now());
            cSetting.top = defaultSetting.top;
            cSetting.left = defaultSetting.left;
            authParent = $('#' + uiSetting.authorParent);
            if (typeof authParent[0] === "undefined") {
                throw "Parent Element is Undefined";
            }
            _this.active = true;
            _this.deleted = false;
            authParent.append(uiSetting.getWidgetTemplate(cSetting, Role)); //appending widget html template

            tView = new view({model: new model(cSetting), el: authParent.find('#' + cSetting.id)});
            if (Role === "author") {

                tinymce.init({
                    selector: '#' + uiSetting.authorParent + " textarea",
                    theme: "modern",
                    plugins: [
                        "advlist autolink lists link image charmap hr anchor pagebreak",
                        "searchreplace wordcount visualblocks visualchars",
                        "insertdatetime media nonbreaking save table contextmenu directionality",
                        "emoticons template paste textcolor"
                    ],
                    toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | forecolor backcolor emoticons template",
                    height: cSetting.height,
                    menubar: "edit insert view format table tools",
                    statusbar: false,
                    image_advtab: true,
                    width: cSetting.width,
                    content_css: ["css/common/reset.css"],
                    templates: [
                        {title: 'Test template 1', content: 'Test 1'},
                        {title: 'Test template 2', content: 'Test 2'}
                    ]
                });
            }
        }



        init();
        /*
         *Api implementations for widget are here
         *
         */
        /*this will remove the widget from the screen*/
        this.destroy = function() {
            if (!_this.deleted) {
                _this.deleted = true;
                tView.destroy();
                popupManager.updateStatus('-');
            }
        };
        /*This will reset the widget to its initial settings*/
        this.reset = function() {
            if (!_this.deleted) {
                //tView.updateModel();
                //  tView.model.reset();
                //tView.el.find('input')[0].value='';
                //tView.reset();
                //   console.log("reset is called");
            }
        };
        /*This will set the property*/
        this.setProperty = function(x) {
            if (!_this.deleted) {
                tView.model.set(x);
            }
            return undefined;
        };
        /*This will get the property as per the value provided in the options*/
        this.getProperty = function(x) {
            if (!_this.deleted) {
                return tView.model.get(x);
            }
            return undefined;
        };
        /*It will validate the widget against the user inputs*/
        this.validate = function(type) {
            if (!_this.deleted) {
                return true;
//                if (type === "specific") {
//                    console.log("feedback type is::" + type);
//                }
                //return tView.checkAnswer()?tView.correctVisual():tView.wrongVisual();
            }
            return undefined;
        };
        /*It will give the all data associated with the widget*/
        this.getWidgetData = function() {
            if (!_this.deleted) {
                tView.updateModel();
                return tView.model.toJSON();
            }
            return undefined;
        };
        /*This will bring all the user input as each level of feedback*/
        this.getUserAnswer = function() {
            if (!_this.deleted) {
                return tView.el.find("input").val();
            }
            return undefined;
        };
        
        /*This will set the user answer*/
        this.setUserAnswer = function(val) {
            if (!_this.deleted) {
                return true;
            }
            return undefined;
        };
        
        /*This will reveal the answers*/
        this.revealAnswer = function() {
            if (!_this.deleted) {
                return true;
            }
            return undefined;
        };
        
        this.getWidgetType = function() {
            return cSetting.widgetType;
        }
        // Function to show/hide html editor
        this.showEditor = function(show) {
            if (show) { // show editor and hide simple content
                tView.el.find("#editorDiv").show();
                tView.el.find("#conentDiv").hide();
                tView.el.css({
                    "top": edtorTop,
                    "z-index": edtorZIndex,
                    "opacity": editorOpacity
                });
                cSetting.editorShow = true;
            } else { // hide editor and show simple content
                // update the content from editor
                var textVal = tinyMCE.activeEditor.getContent(); 
                tView.el.find("#conentDiv").html(textVal);
                tView.el.find("#editorDiv").hide();
                tView.el.find("#conentDiv").show();
                tView.el.css({
                    "top": 0,
                    "z-index": contentZIndex,
                    "opacity": 1
                });
                cSetting.editorShow = false;
            }
        }

    }

    htmlEditor.prototype.deactivate = function() {
        this.active = false;
    };
    htmlEditor.prototype.activate = function() {
        this.active = true;
    };
    htmlEditor.prototype.toString = function() {
        return "This is text box widget type";
    };
    return htmlEditor;
})(window);