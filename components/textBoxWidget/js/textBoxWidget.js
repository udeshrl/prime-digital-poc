/*
 * Created by ankit.goel on 2/20/14.
 */

/* text widget component */

/*Dependency files
 * css-textBoxWidget.css
 * js-jQuery v2.03, underscore v1.6, backbone v1.0, jQueryUI v1.8, ResizeModule.js, DraggableModule.js,Utility.js
 * html-
 * */

/*textBoxWidget its a constructor*/
var textBoxWidget = (function (o, $, Backbone, _) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var minimum = {height: 25, width: 20}, //minimum height and widget of textBox widget that needs to be preserve

    /*This is the default setting that will be applied,
     if you create any instance without passing any options in thd configuration.
     */
    defaultSetting = {
        widgetType: "textBoxWidget",
        category: "Simple_Text_Box", //possible values for Category are ["Simple_Text_Box","Options"]
        type: "Free Text", /*possible values for type are [Numeric,Free Text,Journal entry]*/
        width: 80, //width of box in pixels
        height: 30, //height of box in pixels
        length: 5, //no of characters allow in box
        answer: [], //List of answers that will be used for reader
        left: 100, //total margin from Left in pixels, this value is basically map from parent element
        top: 100, //total margin from top in pixels, this value is basically map from parent element
        id: "", //Every instance of textBox will have unique ID.
        fontColor: "black", //color of textBox font
        fontSize: "16pt", //font-Size of textBox contents
        options: [], //different list items for option variant of textBox
        ignoreSpace: true,
        userAnswer: "",
        isMathEditorApplicable: false //Math Editor is applicable for current
    },
    model = Backbone.Model.extend({
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
            if (this.get("ignoreSpace")) {
                ans = $.trim(ans).replace(/\s/g, "");
                val = $.trim(val).replace(/\s/g, "");
            } else {
                ans = $.trim(ans).replace(/\s+/g, " ");
                val = $.trim(val).replace(/\s+/g, " ");

            }
            if (typeof ans === "string") {
                v = ans.split(uiSetting.seperator);
            } else {
                v = ans;
            }
            return _.contains(v, val + "");
        }
    }),
            view = Backbone.View.extend({
                initialize: function (options) {
                    var o = this;
                    o.el = options.el;
                    o.active = true;
                    o.deleted = false;
                    o.model = options.model;
                    o.model.on("change:width", o.width.bind(o));
                    o.model.on("change:height", o.height.bind(o));
                    o.model.on("change:left", o.left.bind(o));
                    o.model.on("change:top", o.top.bind(o));
                    o.model.on("change:length", o.length.bind(o));
                    o.model.on("change:type", o.type.bind(o));
                    o.model.on("change:fontSize", o.fontSize.bind(o));
                    o.model.on("change:userAnswer", o.userAnswer.bind(o));
                    /*update UI factors*/
                    o.fontSize();
                    o.length();
                    o.width();
                    o.height();
                    o.left();
                    o.top();
                    o.fontColor();
                    o.userAnswer();
                    if (o.model.get("category") === "Simple_Text_Box") {
                        if (app ? app.detect.isAndroid() : navigator.userAgent.match(/Android/i)) {
                            o.el.find('.tbwid').keyup(function () {
                                var ob = this;
                                var invalidChars = /[^0-9]/gi;
                                if (invalidChars.test(ob.value)) {
                                    ob.value = ob.value.replace(invalidChars, "");
                                }
                            });
                        } else {
                            o.el.find('.tbwid').on("keypress", function (e) {
                                if (o.model.get("type") === "Free Text") {
                                    return true;
                                } else if (o.model.get("type") === "Numeric") {
                                    var AllowableCharacters = '1234567890.';
                                    var k = document.all ? parseInt(e.keyCode, 10) : parseInt(e.which, 10);
                                    if (k !== 13 && k !== 8 && k !== 0) {
                                        if ((e.ctrlKey == false) && (e.altKey == false)) {
                                            return (AllowableCharacters.indexOf(String.fromCharCode(k)) !== -1);
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return true;
                                    }
                                }
                            });
                        }
                    } else if (o.model.get("category") === "Options") {
                        o.model.on("change:options", o.options.bind(o));
                        var opt = o.model.get("options");
                        if (opt.length > 0) {
                            opt = opt instanceof Array ? opt : opt.split(uiSetting.seperator);
                            this.el.find('.tbwid')[0].selectedIndex = 0;

                        }
                    }
                    o.el.find('.tbwid').blur(function (event) {
                        o.updateModel();
                    });

                },
                fontSize: function () {
                    this.el.find('.tbwid').css("font-size", this.model.get("fontSize"));
                },
                userAnswer: function () {
                    this.el.find(".tbwid").val(this.model.get("userAnswer"));
                },
                fontColor: function () {
                    this.el.find(".tbwid").css("color", this.model.get("fontColor"));
                },
                length: function () {
                    this.el.find(".tbwid").attr("maxlength", this.model.get("length")).val('');
                },
                type: function () {
                    /*CR- Journal entry text implementation*/
                    var styler = 'margin-left:' + uiSetting.widthDifference + 'px;padding:0px; border:0px;font-weight:normal !important;width:' + this.model.get("width") + 'px;height:' + this.model.get("height") + 'px;font-size:' + this.model.get("fontSize") + ';font-color:' + this.model.get("fontColor");
                    if (this.model.get("type") == "Journal entry") {
                        this.el.find('.tbwid').replaceWith("<textarea class='tbwid alignText' style='" + styler + "' maxlength='" + this.model.get("length") + ";' ></textarea>");
                    } else {
                        this.el.find('.tbwid').replaceWith('<input class="tbwid" type="text" style="' + styler + '" maxlength="' + this.model.get("length") + '" >');
                    }
                },
                options: function () {
                    var temp, options = this.model.get("options"), str = '', i;
                    if (this.model.get("category") === "Options") {
                        if (options instanceof Array) {
                            temp = options;
                        } else {
                            temp = options.split(uiSetting.seperator);
                        }
                        for (i = 0; i < temp.length; i++) {
                            str = str + '<option value="' + temp[i] + '">' + temp[i] + '</option>';
                        }
                        this.el.find('select').html(str);
                    }
                },
                width: function () {
                    this.el.width(parseInt(this.model.get("width"), 10));
                    uiSetting.changeHeightAndWidth(this.el);
                },
                height: function () {
                    this.el.height(parseInt(this.model.get("height"), 10));
                    uiSetting.changeHeightAndWidth(this.el);
                },
                left: function () {
                    this.el.css("left", parseInt(this.model.get("left"), 10) + "px");
                },
                top: function () {
                    this.el.css("top", parseInt(this.model.get("top"), 10) + "px");
                },
                destroy: function () {
                    delete this.model;
                    this.el.remove();
                },
                updateModel: function () {
                    var a = this.el;
                    this.model.set({left: parseInt(a.css('left'), 10), top: parseInt(a.css('top'), 10), height: a.height(), width: a.width(), userAnswer: this.el.find('.tbwid').val()}, {silent: true});

                },
                checkAnswer: function () {
                    return this.model.check(this.model.get("userAnswer"));
                },
                reset: function () {
                    this.model.reset();
                    if (this.model.get("type") == "Journal entry") {
                        this.el.css("border", "2px solid black");
                    } else {
                        this.el.css("border", "2px solid transparent");
                    }
                    if (this.el.find('.tbwid')[0].nodeName.toLocaleLowerCase() == "select") {
                        this.el.find('.tbwid')[0].selectedIndex = 0;
                    } else {
                        this.el.find('.tbwid')[0].value = "";
                    }
                },
                correctVisual: function () {
                    this.el.css("border", "2px solid green");
                    return true;
                },
                wrongVisual: function () {
                    this.el.css("border", "2px solid red");
                    return false;
                },
                revealAnswer: function () {
                    var result = this.checkAnswer(),
                            ans = this.model.get("answer");
                    if (ans instanceof Array) {
                        // ans = ans;
                    } else {
                        ans = ans.split(uiSetting.seperator);
                    }
                    result ? this.correctVisual() : this.el.css("border", "2px solid orange").find(".tbwid").val(ans[0]);
                    return result;
                },
                deactivate: function () {
                    this.el.find(".tbwid").attr("disabled", "disabled");
                    this.active = false;
                },
                activate: function () {
                    this.el.find(".tbwid").removeAttr("disabled");
                    this.active = true;
                }
            }),
            uiSetting = {
                seperator: "|",
                authorParent: "author_content_container",
                widthDifference: (Role === "author") ? 10 : 0,
                heightDifference: (Role === "author") ? 0 : 0,
                resizeAndDrag: function (el, resizeSetting, draggableSetting) {
                    typeof resizeModule !== "undefined" && resizeModule.makeResize(el, resizeSetting.callback, resizeSetting.context);
                    typeof draggableModule !== "undefined" && draggableModule.makeDraggable(el);
                },
                changeHeightAndWidth: function (a) {
                    var w = $(a).width(),
                            h = $(a).height();
                    if ($(a).find('.tbwid')[0].nodeName.toLowerCase() === "select") {
                        $(a).find('.tbwid').css({width: (w - (uiSetting.widthDifference * 2)) + 'px', height: (h - uiSetting.heightDifference) + 'px'});
                    } else {
                        $(a).find('.tbwid').css({width: (w - (uiSetting.widthDifference * 2)) + 'px', height: (h - uiSetting.heightDifference) + 'px'});
                    }
                },
                getWidgetTemplate: function (obj, mode) {
                    var str = '', styler = '', temp, i;
                    if (obj.category === "Simple_Text_Box") {
                        var borderColor = 'black';
                        styler = 'margin-left:' + uiSetting.widthDifference + 'px;padding:0px;border:0px;font-weight:normal !important;';
                        if (mode !== "author") {//This is for reader part.
                            if (obj.type != 'Journal entry') {
                                borderColor = 'transparent';
                            }
                            str = '<div id="' + obj.id + '" class="textBoxWidget" style="position:absolute;border:2px solid ' + borderColor + ';padding:0px;">'
                            //+ '<input class="tbwid" type="text" style="' + styler + '"></div>';
                            if (obj.type != 'Journal entry') {
                                str += '<input class="tbwid" type="text" style="' + styler + '">';
                            } else {
                                str += "<textarea class='tbwid alignText' style='" + styler + "'></textarea>";
                            }
                            str += '</div>';
                        } else {//this is for author part.
                            str = '<div class="wPar" id="' + obj.id + '" style="position:absolute;border:2px solid ' + borderColor + ';padding:0px;">' /* 'px" title="TextBox having ID is ' + obj.id + '">'*/
                            //  + '<input class="tbwid" type="text" style="' + styler + '"></div>';
                            if (obj.type != 'Journal entry') {
                                str += '<input class="tbwid" type="text" style="' + styler + '">';
                            } else {
                                str += "<textarea class='tbwid' style='" + styler + "'></textarea>";
                            }
                            str += "</div>";
                        }
                    } else if (obj.category === "Options") {
                        str = '<div id="' + obj.id + '" style="border:2px solid ' + (Role === "author" ? "black" : "transparent") + ';padding:0px;width:' + obj.width + 'px;position:absolute;height:' + obj.height + 'px; left:' + obj.left + 'px;top:' + obj.top + 'px">'
                                + '<select class="tbwid" style="border:0px;font-weight:normal;text-align:center;text-align:-webkit-center;margin-left:' + uiSetting.widthDifference + 'px;width:' + (obj.width - (uiSetting.widthDifference * 2)) + 'px;height:' + (obj.height - uiSetting.heightDifference) + 'px;">';
                        /* 'px" title="TextBox having ID is ' + obj.id + '">'*/
                        if (obj.options instanceof Array) {
                            temp = obj.options;
                        } else {
                            temp = obj.options.split(uiSetting.seperator);
                        }
                        for (i = 0; i < temp.length; i++) {
                            if (i === 0) {
                                str = str + '<option value="' + temp[i] + '">' + temp[i] + '</option>';
                            } else {
                                str = str + '<option value="' + temp[i] + '">' + temp[i] + '</option>';
                            }

                        }
                        str = str + '</select>';
                    }
                    return str;
                },
                applyAuthorRelatedProperty: function (el, _this) {
                    uiSetting.resizeAndDrag(el, {callback: function () {   //applying resizing and draggable to widget
                            uiSetting.changeHeightAndWidth(arguments[0].target);
                        }, context: _this});
                }
            },
    popupManager = {
        popupInitialSetting: {
            popId: 'textbox_pop_singleton',
            labels: ["Type", "Answer", "Left", "Top", "Height", "Width", "Length"],
            common: [
                {id: "fontSize", type: "select", options: "40pt|39pt|38pt|37pt|36pt|35pt|34pt|33pt|32pt|31pt|30pt|29pt|28pt|27pt|26pt|25pt|24pt|23pt|22pt|21pt|20pt|19pt|18pt|17pt|16pt|15pt|14pt|13pt|12pt|11pt|10pt|9pt|8pt|7pt|6pt|5pt|4pt|3pt", label: "Font size", attr: "box"/*, Class: "Simple_Text_Box"*/},
                {id: "left", type: "text", label: "Left"},
                {id: "top", type: "text", label: "Top"},
                {id: "height", type: "text", label: "Height"},
                {id: "width", type: "text", label: "Width"}
            ],
            boxType: [
                {id: "type", type: "select", options: "Numeric|Free Text|Journal entry", label: "Type", attr: "box", Class: "Simple_Text_Box"},
                {id: "answer", type: "text", label: "Answer", Class: "Simple_Text_Box"},
                {id: "ignoreSpace", type: "checkbox", label: "Ignore space", Class: "Simple_Text_Box"},
                {id: "length", type: "text", label: "Length", Class: "Simple_Text_Box"}
            ],
            optionType: [
                {id: "options", type: "text", label: "List options", Class: "Options"},
                {id: "answer", type: "select", options: "a,b", label: "Answer", attr: "option", Class: "Options"}
            ],
            buttonList: [
                {id: "submit", html: "Submit"},
                {id: "removeElement", html: "Remove"},
                {id: "closeGraphpopup", html: "Close"}
            ]
        },
        count: 0,
        updateStatus: function (type) {
            if (type === "+") {
                this.count++;
            } else {
                this.count && (this.count--);
                this.hide();
            }
            if (this.count <= 0) {
                this.removePop();
            } else {
                this.createPop();
            }
        },
        removePop: function () {
            $('#' + this.popupInitialSetting.popId).remove();
            $('#popup-overlay-text').remove();
        },
        createPop: function () {
            getConfigurationWindow(this.popupInitialSetting, $('#' + uiSetting.authorParent));
        },
        show: function (view, context) {
            this.updatePopFields(view);
            $('#popup-overlay-text').css('display', 'block');
            var p = $("#" + popupManager.popupInitialSetting.popId).css("display", "block");
            p.find('#submit').off('click').on('click', {view: view}, popupManager.updateWidget);
            p.find("#removeElement").off('click').on('click', context.destroy);

            if (view.model.get("category") === "Options") {
                p.find('#options').off('change').on('change', popupManager.updateInstantAnswer);
                p.find(".Simple_Text_Box").css("display", "none");
                p.find(".Options").css("display", "block");
            } else {
                p.find(".Simple_Text_Box").css("display", "inline-block");
                p.find(".Options").css("display", "none");
            }
        },
        updateWidget: function (e) {
            var hash = '#',
                    val,
                    m = e.data.view.model,
                    pis = popupManager.popupInitialSetting,
                    el = e.data.view.el,
                    parent = $('#' + uiSetting.authorParent),
                    p = $(hash + pis.popId),
                    updateCase = m.get("category"),
                    newList = p.find("." + updateCase),
                    s = pis.common,
                    i; //applying status to common properties.
            if (m.get("category") === "Simple_Text_Box") {
                newList.not('label').each(function () {
                    m.set(this.id, this.value.toString());
                });
            } else {
                newList.not('label').each(function () {
                    m.set(this.id, this.value);
                });
            }
            m.set('ignoreSpace', p.find("#ignoreSpace").is(":checked"));
            //updating common properties
            for (i = 0; i < s.length; i++) {
                val = p.find(hash + s[i].id).val();
                if (s[i].id === "left") {
                    m.set(s[i].id, app.limitLeft(el, parent, val) + "");
                } else if (s[i].id === "top") {
                    m.set(s[i].id, app.limitTop(el, parent, val) + "");
                } else if (s[i].id === "width") {
                    m.set(s[i].id, app.limitWidth(el, parent, val, minimum.width));
                } else if (s[i].id === "height") {
                    m.set(s[i].id, app.limitHeight(el, parent, val, minimum.height));
                } else {
                    m.set(s[i].id, val);
                }
            }
            popupManager.hide();
        },
        updatePopFields: function (view) {
            var hash = '#',
                    m = view.model, pis = popupManager.popupInitialSetting,
                    p = $(hash + pis.popId),
                    s = pis.common,
                    updateCase = m.get("category"),
                    newList = p.find("." + updateCase);
            if (updateCase === "Options") {
                newList.not('label').each(function () {
                    if (this.nodeName.toLocaleLowerCase() == "select") {
                        var opt = typeof m.get("options") == "string" ? m.get("options").split(uiSetting.seperator) : m.get("options"), a = '';
                        for (var l = 0; l < opt.length; l++) {
                            a = a + '<option value="' + opt[l] + '">' + opt[l] + '</option>';
                        }
                        $(this).html(a).val(m.get("answer"));
                    } else {
                        this.value = m.get(this.id).toString();
                    }
                });
                // newList.find(hash + pis.optionType[x].id).val(m.get(pis.optionType[i].id));
            } else if (updateCase == "Simple_Text_Box") {
                newList.not('label').each(function () {
                    this.value = m.get(this.id).toString();
                });
            }
            //updating common properties
            for (var i = 0; i < s.length; i++) {
                if (s[i].id == "left" || s[i].id == "top" || s[i].id == "width" || s[i].id == "height") {
                    p.find(hash + s[i].id).val(m.get(s[i].id) + 'px');
                } else {
                    p.find(hash + s[i].id).val(m.get(s[i].id));
                }
            }
            p.find("#ignoreSpace")[0].checked = m.get('ignoreSpace');

        },
        updateInstantAnswer: function (e) {
            var opt = typeof e.target.value == "string" ? e.target.value.split(uiSetting.seperator) : e.target.value, a = '';
            for (var l = 0; l < opt.length; l++) {
                a = a + '<option value="' + opt[l] + '">' + opt[l] + '</option>';
            }
            $('#' + popupManager.popupInitialSetting.popId).find('select[attr="option"]').html(a);
        },
        hide: function () {
            $('#popup-overlay-text').css('display', 'none');
            $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
        }
    },
    getConfigurationWindow = function (setting, parent) {
        if (typeof $('#' + setting.popId)[0] !== "undefined") {
            return false;
        }
        function makeSelect(o) {
            var list = o.options.split(uiSetting.seperator),
                    a = '<select id="' + o.id + '" attr="' + o.attr + '" class="' + o.Class + '">';
            for (var k = 0; k < list.length; k++) {
                a = a + '<option value="' + list[k] + '">' + list[k] + '</option>';
            }
            return a + '</select>';
        }

        var inputType = _.union(setting.boxType || [], setting.optionType || [], setting.common || []),
                buttonList = setting.buttonList || [],
                a = '<div class="popup-overlay" id="popup-overlay-text"></div><div id="' + setting.popId + '" class="popup_container">';
        for (var i = 0; i < inputType.length; i++) {
            a = a + '<div class="pop-row">';
            a = a + '<label class="' + inputType[i].Class + '">' + inputType[i].label + '</label>';
            if (inputType[i].type == "select") {
                a = a + makeSelect(inputType[i]);
            } else if (inputType[i].type == "text") {
                a = a + '<input type="' + inputType[i].type + '"id="' + inputType[i].id + '" class="' + inputType[i].Class + '">';
            }
            else if (inputType[i].type == "checkbox") {
                a = a + '<input type="' + inputType[i].type + '"id="' + inputType[i].id + '" class="' + inputType[i].Class + '">';
            }
            a = a + '</div>';
        }
        for (var x = 0; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
        }
        $(parent).append(a + '</div>');
        $('#' + setting.popId).find('#closeGraphpopup').on("click", popupManager.hide.bind(popupManager));
        return true;
    }

    function textBoxWidget(options) {
        /*defining all variable at once*/
        var _this = this, cSetting = {}, authParent, tView;
        /*Default setting of widget*/
        function init() {
            var hash = '#';
            cSetting = $.extend({}, defaultSetting, options); //current setting based on options provided in instance making.
            cSetting.id = cSetting.id || ('TB_' + Date.now());
            authParent = $(hash + uiSetting.authorParent);
            if (typeof authParent[0] === "undefined") {// throw exception if parent element is not available
                throw "Parent Element is Undefined";
            }
            authParent.append(uiSetting.getWidgetTemplate(cSetting, Role));//appending widget html template
            tView = new view({model: new model(cSetting), el: authParent.find(hash + cSetting.id)});
            if (Role === "author") {
                uiSetting.applyAuthorRelatedProperty(tView.el, _this);
                popupManager.updateStatus('+');
                tView.el.bind('dblclick', {view: tView, context: _this}, function (e) {
                    if ($(this).find("select")[0]) { //this piece of code is to hide the html drop down by removing the focus.
                        $(this).find("select").blur();
                    }
                    e.data.view.updateModel();
                    popupManager.show(e.data.view, e.data.context);
                });
            }
        }

        init();
        /*
         *Api implementations for widget are here
         */

        /*this will remove the widget from the screen*/
        this.destroy = function () {
            if (!tView.deleted) {
                tView.deleted = true;
                tView.destroy();
                popupManager.updateStatus('-');
            }
        };
        /*This will reset the widget to its initial settings*/
        this.reset = function () {
            if (!tView.deleted && tView.active) {
                tView.reset();
                console.log("reset is called");
            }
        };
        /*This will set the property*/
        this.setProperty = function (x) {
            if (!tView.deleted) {
                tView.model.set(x);
            }
            return undefined;
        };
        /*This will get the property as per the value provided in the options*/
        this.getProperty = function (x) {
            if (!tView.deleted) {
                return tView.model.get(x);
            }
            return undefined;
        };
        /*It will validate the widget against the user inputs*/
        this.validate = function (type) {
            if (!tView.deleted && tView.model.get("type") != 'Journal entry') {
                var result = tView.checkAnswer();
                if (type === "specific") {
                    tView.deactivate();
                    tView.revealAnswer();
                    return result && tView.correctVisual();
                } else {
                    return result ? tView.correctVisual() : tView.wrongVisual();
                }

            }
            return undefined;
        };
        /*It will give the all data associated with the widget*/
        this.getWidgetData = function () {
            if (!tView.deleted) {
                tView.updateModel();
                return tView.model.toJSON();
            }
            return undefined;
        };
        /*This will bring all the user input as each level of feedback*/
        this.getUserAnswer = function () {
            if (!tView.deleted) {

                return tView.model.get("userAnswer");
            }
            return undefined;
        };

        /*This will set the user answer*/
        this.setUserAnswer = function (val) {
            if (!tView.deleted) {
                tView.model.set("userAnswer", val);
                tView.userAnswer();
            }
            return undefined;
        };

        /*This will reveal the answers*/
        this.revealAnswer = function (val) {
            if (!tView.deleted) {
                tView.revealAnswer();
            }
            return undefined;
        };

        this.getWidgetType = function () {
            return cSetting.widgetType;
        };
        this.deactivate = function () {
            if (!tView.deleted) {
                tView.deactivate();
            }
        };
        this.activate = function () {
            if (!tView.deleted) {
                tView.activate();
            }
        };
    }

    textBoxWidget.prototype.toString = function () {
        return "This is text box widget type";
    };
    return textBoxWidget;
})(window, jQuery, Backbone, _);