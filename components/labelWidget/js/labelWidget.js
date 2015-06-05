/*
 * Created by ankit.goel on 2/20/14.
 */

/* text widget component structure */

/*Dependency files
 * css-labelWidget.css
 * js-jQuery v2.03, underscore v1.6, backbone v1.0, jQueryUI v1.8, ResizeModule.js, DraggableModule.js,Utility.js
 * html-
 * */
var labelWidget = (function (o) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var isRoleAuthor = Role === "author",
        TextModel = Backbone.Model.extend({
            "default": {},
            initialize: function (options) {
                this.initObject = options;
                this["default"] = options;
            },
            reset: function () {
                this.set(this.initObject);
            },
            check: function (val) {
                var ans = this.get("answer"), v = [];

                if (typeof ans === "string") {
                    v = ans.split(',');
                } else {
                    v = ans;
                }
                return _.contains(v, val + "");
            }
        }),
        TextView = Backbone.View.extend({
            initialize: function (options) {
                var o = this;
                o.el = options.el;
                o.model = options.model;
                o.model.on({
                    "change:text": o.changeText.bind(o),
                    "change:textColor": o.colorText.bind(o),
                    "change:bgColor": o.colorBackground.bind(o),
                    "change:fontSize": o.changeFontSize.bind(o),
                    "change:Bold": o.makeFontBold.bind(o),
                    "change:Italic": o.makeFontItalic.bind(o),
                    "change:Underline": o.makeFontUnderLine.bind(o),
                    "change:align": o.align.bind(o),
                    "change:rotateLabelText": o.makeRotateLabel.bind(o)
                });
                o.align();
                o.el.find('textarea').on("keyup", function () {
                    $(this).css('height', 'auto');
                    $(this).height(this.scrollHeight);
                });
            },
            editableTextBlurred: function (e) {
                var o = this,
                    htmlstr = o.el.find("textarea").val(),
                    viewableText = o.el.find("label");
                o.el.find("textarea").hide();
                htmlstr = htmlstr.replace(/\n/g, "<br>");
                o.model.set("text", htmlstr.trim() ? htmlstr : "Hello! Enter Here");
                viewableText.css("display", "inline-block");
            },
            addTitle: function () {
                this.el.find("label").attr("title", "Click here to edit");
            },
            align: function () {
                this.el.find(".labelDecor").css("text-align", this.model.get("align"));
            },
            editMode: function (e) {
                e.preventDefault();
                var o = this,
                    divHtml = o.model.get("text"),
                    editableText = o.el.find('textarea');
                divHtml = divHtml.replace(/<br>/g, "\n");
                o.el.find('label').hide();
                editableText.show().val(divHtml);
                editableText.focus();
            },
            changeText: function () {
                this.el.find('label').html(this.model.get("text"));
            },
            colorText: function () {
                this.el.css("color", (this.model.get("textColor")));
            },
            colorBackground: function () {
                this.el.find("label").css("background", (this.model.get("bgColor")));
            },
//        changeFontFamily: function(){
//            this.el.css("font-family",(this.model.get("fontFamily")));
//        },
            changeFontSize: function () {
                this.el.css("font-size", (this.model.get("fontSize")));
            },
            makeFontBold: function () {
                if (this.model.get("Bold")) {
                    this.el.css("font-weight", "bold");
                } else {
                    this.el.css("font-weight", "normal");
                }
            },
            makeFontItalic: function () {
                if (this.model.get("Italic")) {
                    this.el.css("font-style", "italic");
                } else {
                    this.el.css("font-style", "normal");
                }
            },
            makeFontUnderLine: function () {
                if (this.model.get("Underline")) {
                    this.el.find('label').css("text-decoration", "underline");
                } else {
                    this.el.find('label').css("text-decoration", "none");
                }
            },
            makeRotateLabel: function () {
                var r = parseInt(this.model.get("rotateLabelText")) + "deg",
                    prefix = app.detect.isWebkit() ? "-webkit-" : app.detect.isFirefox() ? "-moz-" : "-ms-";
                this.el.find("label").css(prefix + "transform", "rotate(" + r + ")");
            },
            width: function () {
                this.el.width(parseInt(this.model.get("width")));
            },
            height: function () {
                this.el.height(parseInt(this.model.get("height")));
            },
            left: function () {
                this.el.css("left", parseInt(this.model.get("left")));
            },
            top: function () {
                this.el.css("top", parseInt(this.model.get("top")));
            },
            destroy: function () {
                this.model = undefined;
                this.el.remove();
            },
            updateModel: function () {
                var a = this.el;
                this.model.set({left: parseInt(a.css('left')), top: parseInt(a.css('top'))}, {silent: true});
            },
            checkAnswer: function () {
                return this.model.check(this.el.find('input').val());
            },
            reset: function () {
                this.model.reset();
                this.el.find('input').css("border", "2px solid transparent")[0].value = "";
            },
            correctVisual: function () {
                this.el.find('input').css("border", "2px solid green");
                return !0;
            }, wrongVisual: function () {
                this.el.find('input').css("border", "2px solid red");
                return !1;
            }
        }),
        colorSettingBG = {
            newGmail: [
                ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#4c1130", "rgba(0, 0, 0, 0)"]
            ],
            createColorWindow: function (el) {
                $(el).find('#bgColor').spectrum({
                    allowEmpty: true,
                    showInput: true,
                    className: "full-spectrum",
                    showPalette: true,
                    showSelectionPalette: true,
                    showAlpha: true,
                    maxPaletteSize: 10,
                    preferredFormat: "hex",
                    palette: this.newGmail
                });
            },
            show: function (el) {
                el.find('#bgColor').toggle();
            },
            hide: function (el) {
                el.find('#bgColor').toggle();
            },
            getColor: function (el) {
                var spectrum = $(el).find('#bgColor').spectrum("get");
                if (!spectrum.alpha) {
                    return spectrum.toName();
                } else {
                    return spectrum.toHexString();
                }
               },
            setColor: function (el, color) {
                $(el).find('#bgColor').spectrum("set", color);
            }
        },
        colorSettingText = {
            newGmail: [
                ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            createColorWindow: function (el) {
                $(el).find('#textColor').spectrum({
                    allowEmpty: true,
                    className: "full-spectrum",
                    showInitial: true,
                    showPalette: true,
                    showSelectionPalette: true,
                    showAlpha: true,
                    maxPaletteSize: 10,
                    preferredFormat: "hex",
                    palette: this.newGmail
                });
            },
            show: function (el) {
                el.find('#textColor').toggle();
            },
            hide: function (el) {
                el.find('#textColor').toggle();
            },
            getColor: function (el) {
                return $(el).find("#textColor").spectrum("get").toHexString();
            },
            setColor: function (el, color) {
                $(el).find('#textColor').spectrum("set", color);
            }
        },
        uiSetting = {
            //  authorParent: "author_content_container",
            widthDifference: isRoleAuthor ? 10 : 0,
            resizeAndDrag: function (el, resizeSetting, draggableSetting) {
                //typeof resizeModule!="undefined" && resizeModule.makeResize(el, resizeSetting.callback, resizeSetting.context);
                typeof draggableModule !== "undefined" && draggableModule.makeDraggable(el);
            },
            getWidgetTemplate: function (obj) {
                var prefix = app.detect.isWebkit() ? "-webkit-" : app.detect.isFirefox() ? "-moz-" : "-ms-";
                return $("<div></div>").attr("id", obj.id).css({
                    left: obj.left,
                    top: obj.top,
                    position: 'absolute',
                    //'font-family':obj.fontFamily,
                    'font-size': obj.fontSize,
                    'font-weight': obj.Bold ? "bold" : "normal",
                    'font-style': obj.Italic ? "italic" : "normal",
                    color: obj.textColor,
                    width: 'auto',
                    height: 'auto',
                    background: 'transparent',
                    border: '0px'
                }).append('<label class="labelDecor" style="padding:8px;text-decoration:' + (obj.Underline ? "underline" : "none") + ';background:' + obj.bgColor + ';' + prefix + 'transform:rotate(' + obj.rotateLabelText + 'deg);display:inline-block;transform-origin: center 0px;">' + obj.text + '</label><textarea style="display:none;resize: none; overflow-y: hidden;"></textarea>');
            },
            applyAuthorRelatedProperty: function (el, _this) {
                uiSetting.resizeAndDrag(el, {callback: function () {   //applying resizing and draggable to widget
                    uiSetting.changeHeightAndWidth(arguments[0].target);
                }, context: _this});
            }
        }, defaultSetting = {
            widgetType: "labelWidget",
            left: 0,
            top: 0,
            id: "",
            text: "Hello! Enter Here",
            textColor: "black",
            bgColor: "transparent",
            // fontFamily:"sans-serif",
            fontSize: "14pt",
            Bold: false,
            Italic: false,
            Underline: false,
            align: "center",
            rotateLabelText: "0"
        },
        popupManager = {
            popupInitialSetting: {
                popId: 'label_pop_singleton',
                labels: [/* "Enter Text",*/"Text Color", "Background Color"/*,"font-family"*/, "Font Size", "Bold", "Italic", "Underline", "Degree of Rotation"],
                inputName: [
                    {id: "textColor", type: "text", label: "Text color"/*, options: "black,white,green,blue,Red,yellow,magenta,maroon"*/},
                    {id: "bgColor", type: "text", label: "Background color"/*, options: "transparent,white,Red,green,blue,black,yellow,magenta,maroon"*/},
                    {id: "fontSize", type: "select", options: "30pt,29pt,28pt,27pt,26pt,25pt,24pt,23pt,22pt,21pt,20pt,19pt,18pt,17pt,16pt,15pt,14pt,13pt,12pt,11pt,10pt,9pt,8pt,7pt,6pt,5pt", label: "Font size"},
                    {id: "Bold", type: "checkbox", value: "false", checked: "", label: "Bold"},
                    {id: "Italic", type: "checkbox", value: "false", checked: "", label: "Italic"},
                    {id: "Underline", type: "checkbox", value: "false", checked: "", label: "Underline"},
                    {id: "isleftAlign", type: "radio", name: "align", groupLabel: "Text align", value: "left", label: "Left "},
                    {id: "isRightAlign", type: "radio", name: "align", value: "right", label: "Right "},
                    {id: "iscenterAlign", type: "radio", name: "align", value: "center", label: "Center"},
                    {id: "isjustifyAlign", type: "radio", name: "align", value: "justify", label: "Justify"},
                    {id: "rotateLabelText", type: "text", value: "", label: "Rotate", degree: true}
                ],
                buttonList: [
                    {id: "submit", html: "Submit"},
                    {id: "removeElement", html: "Remove"},
                    {id: "closeGraphpopup", html: "Close"}
                ]
            },
            count: 0,
            updateStatus: function (type, popupContainer) {
                if (type === "+") {
                    this.count++;
                }
                else {
                    this.count && (this.count--);
                    this.hide();
                }
                if (this.count <= 0) {
                    this.removePop();
                } else {
                    this.createPop(popupContainer);
                }
            },
            removePop: function () {
                $('#' + this.popupInitialSetting.popId).remove();
                $('#popup-overlay-label').remove();
            },
            createPop: function (popupContainer) {
                getConfigurationWindow(this.popupInitialSetting, popupContainer);
            },
            show: function (view, context) {
                this.updatePopFields(view);
                $('#popup-overlay-label').css('display', 'block');
                var p = $("#" + popupManager.popupInitialSetting.popId).css("display", "block");
                p.find('#submit').off('click', popupManager.updateWidget).on('click', {view: view}, popupManager.updateWidget);
                p.find("#removeElement").off('click').on('click', context.destroy);
            },
            updateWidget: function (e) {
                var m = e.data.view.model;
                var p = $('#' + popupManager.popupInitialSetting.popId);
                var s = popupManager.popupInitialSetting.inputName;
                for (var i = 0; i < s.length; i++) {
                    if (s[i].id === "left" || s[i].id === "top" || s[i].id === "width" || s[i].id === "height") {
                        m.set(s[i].id, parseInt(p.find('#' + s[i].id)[0].value));
                    } else if (s[i].type === "checkbox") {
                        m.set(s[i].id, p.find('#' + s[i].id)[0].checked);
                    } else if (s[i].type === "radio") {
                        if (p.find("#" + s[i].id).is(":checked")) {
                            m.set(s[i].name, p.find('#' + s[i].id).val());
                        }
                    } else if (s[i].id === "rotateLabelText") {
                        m.set(s[i].id, (-1) * parseInt(p.find('#' + s[i].id)[0].value));
                    } else {
                        m.set(s[i].id, p.find('#' + s[i].id)[0].value);
                    }
                }
                m.set("bgColor", colorSettingBG.getColor(p));
                m.set("textColor", colorSettingText.getColor(p));
                popupManager.hide();
            },
            updatePopFields: function (view) {
                var m = view.model;
                var p = $('#' + popupManager.popupInitialSetting.popId);
                var s = popupManager.popupInitialSetting.inputName;
                for (var i = 0; i < s.length; i++) {
                    if (s[i].id === "left" || s[i].id === "top" || s[i].id === "width" || s[i].id === "height") {
                        p.find('#' + s[i].id)[0].value = m.get(s[i].id) + 'px';
                    } else if (s[i].type === "checkbox") {
                        p.find('#' + s[i].id)[0].checked = m.get(s[i].id);
                    } else if (s[i].type === "radio") {
                        var radioName = s[i].name;
                        var radioVal = m.get(s[i].name);
                        p.find('input[name="' + radioName + '"][value="' + radioVal + '"]').prop('checked', true);
                    } else if (s[i].id === "rotateLabelText") {
                        p.find('#' + s[i].id)[0].value = (-1) * parseInt(m.get(s[i].id));
                    } else {
                        p.find('#' + s[i].id)[0].value = m.get(s[i].id);
                    }
                }
                colorSettingBG.setColor(p, m.get('bgColor'));
                colorSettingText.setColor(p, m.get('textColor'));
            },
            hide: function () {
                $('#popup-overlay-label').css('display', 'none');
                $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
            }
        };

    function getConfigurationWindow(setting, parent) {
        if ($('#' + setting.popId).length) {
            return false;
        }
        function makeSelect(i, s) {
            var list = s.split(','), a = '<select id="' + i + '">', k;
            for (k = 0; k < list.length; k++) {
                a = a + '<option value="' + list[k] + '">' + list[k] + '</option>';
            }
            return a + '</select>';
        }

        var popEl,
            labelNames = setting.labels,
            inputType = setting.inputName || [],
            buttonList = setting.buttonList || [],
            a = '<div class="popup-overlay" id="popup-overlay-label"></div><div id="' + setting.popId + '" class="popup_container"><div>',
            group = false, labelClass, i;
        for (i = 0; i < inputType.length; i++) {
            labelClass = '';
            if (inputType[i].type !== "radio" || (inputType[i].name !== group)) {
                a = a + '</div><div class="pop-row">';
            } else {
                labelClass = 'group-label';
            }

            if (inputType[i].type !== "radio") {
                a = a + '<label class="' + labelClass + '">' + inputType[i].label + '</label>';
            } else if (inputType[i].groupLabel !== undefined) {
                a = a + '<label class="' + labelClass + '">' + inputType[i].groupLabel + '</label>';
            }

            if (inputType[i].type === "select") {
                a = a + makeSelect(inputType[i].id, inputType[i].options);
            } else if (inputType[i].type === "text") {
                a = a + '<input type="' + inputType[i].type + '" id="' + inputType[i].id + '" value="' + inputType[i].value + '">';
            } else if (inputType[i].type === "checkbox") {
                a = a + '<input checked="' + inputType[i].checked + '" type="' + inputType[i].type + '" id="' + inputType[i].id + '" value="' + inputType[i].value + '">';
            } else if (inputType[i].type === "radio") {
                a = a + '<input type="' + inputType[i].type + '" id="' + inputType[i].id + '" name="' + inputType[i].name + '" value="' + inputType[i].value + '">';
            }

            if (inputType[i].type === "radio") {
                a = a + '<label class="radio-label">' + inputType[i].label + '</label>';
                group = inputType[i].name;
            }
            
            if(inputType[i].degree !== undefined){
                a = a + '&deg;';
            }
        }
        a = a + '<div style="clear: both;"></div>';
        for (var x = 0; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
        }
        $(parent).append(a + '</div>');
        popEl = $('#' + setting.popId);
        popEl.find('#closeGraphpopup').on("click", popupManager.hide.bind(popupManager));
        popEl.find("label:contains(Bold)").css("font-weight", "bold");
        popEl.find("label:contains(Underline)").css("text-decoration", "underline");
        popEl.find("label:contains(Italic)").css("font-style", "italic");
        if (app ? app.detect.isAndroid() : navigator.userAgent.match(/Android/i)) {
            popEl.find('#rotateLabelText').keyup(function (event) {
                var ob = this,
                    invalidChars = /[^0-9]/gi;
                if (invalidChars.test(ob.value)) {
                    ob.value = ob.value.replace(invalidChars, "");
                }
            });
        } else {
            popEl.find('#rotateLabelText').on("keypress", function (e) {
                var AllowableCharacters = '1234567890-';
                var k = document.all ? parseInt(e.keyCode) : parseInt(e.which);
                if (k !== 13 && k !== 8 && k !== 0) {
                    if ((e.ctrlKey === false) && (e.altKey === false)) {
                        return (AllowableCharacters.indexOf(String.fromCharCode(k)) !== -1);
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }

            });
        }
        colorSettingBG.createColorWindow(popEl);
        colorSettingText.createColorWindow(popEl);
        return true;
    }

    function labelWidget(options, labelContainer, popContainer) {
        /*defining all variable at once*/
        var _this = this, cSetting = {}, authParent, tView;
        /*Default setting of widget*/
        function init() {
            cSetting = $.extend({}, defaultSetting, options); //current setting based on options provided in instance making.
            cSetting.id = cSetting.id || (parseInt(Math.random() * 1000) + '_Label_' + Date.now());
            // authParent = $('#' + uiSetting.authorParent);
            if (!$(labelContainer).length || !$(popContainer).length) {
                // throw "Parent element is undefined";
                labelContainer = $('body');
                popContainer = $('body');
            } else {
                labelContainer = $(labelContainer);
                popContainer = $(popContainer);
            }

            labelContainer.append(uiSetting.getWidgetTemplate(cSetting));//appending widget html template
            tView = new TextView({model: new TextModel(cSetting), el: labelContainer.find('#' + cSetting.id)});
            if (isRoleAuthor) {

                uiSetting.applyAuthorRelatedProperty(tView.el, _this);

                popupManager.updateStatus('+', popContainer);

                tView.el.find("label").on('contextmenu', function () {
                    return false;
                });

                tView.el.find("label").mouse(function (event) {
//                   event.stopPropagation();
                    target_onclick(event);
                }, function (event) {
//                	  event.stopPropagation();
                    target_ondblclick(event);
                },400);

                tView.el.find('textarea').on("blur", tView.editableTextBlurred.bind(tView));

                tView.addTitle();
            }
        }

        function target_onclick(e) {
            tView.editMode(e);
        }

        function target_ondblclick(e) {
            tView.updateModel();
            popupManager.show(tView, _this);
        }

        init();
        /*
         *Api implementations for widget are here
         *
         */
        /*this will remove the widget from the screen*/
        _this.destroy = function () {
            if (!_this.deleted) {
                _this.deleted = true;
                tView.destroy();
                popupManager.updateStatus('-');
            }
        };
        /*This will reset the widget to its initial settings*/
        _this.reset = function () {
            if (!_this.deleted) {
                //tView.updateModel();
                //  tView.model.reset();
                //tView.el.find('input')[0].value='';
                //tView.reset();
                //   console.log("reset is called");
                return undefined;
            }
        };
        /*This will set the property*/
        _this.setProperty = function (x) {
            if (!_this.deleted) {
                tView.model.set(x);
            }
            return undefined;
        };
        /*This will get the property as per the value provided in the options*/
        _this.getProperty = function (x) {
            if (!_this.deleted) {
                return tView.model.get(x);
            }
            return undefined;
        };
        /*It will validate the widget against the user inputs*/
        _this.validate = function (type) {
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
        _this.getWidgetData = function () {
            if (!_this.deleted) {
                tView.updateModel();
                return tView.model.toJSON();
            }
            return undefined;
        };
        /*This will bring all the user input as each level of feedback*/
        _this.getUserAnswer = function () {
            if (!_this.deleted) {
//                return tView.el.find("input").val();
            }
            return undefined;
        };
        
        /*This will set the user answer*/
        _this.setUserAnswer = function () {
            if (!_this.deleted) {
                return true;
            }
            return undefined;
        };
        
        /*This will reveal the answers*/
        _this.revealAnswer = function() {
            if (!_this.deleted) {
                return true;
            }
            return undefined;
        };

        _this.getWidgetType = function () {
            return cSetting.widgetType;
        };
        _this.deactivate = function () {
            this.active = false;
        };
        _this.activate = function () {
            this.active = true;
        };

    }

    labelWidget.prototype.toString = function () {
        return "This is Label widget type";
    };

    return labelWidget;
})(window);