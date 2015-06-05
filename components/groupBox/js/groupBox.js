/*
 Dependency files
 * css-groupBox.css
 * js-jQuery v2.03, underscore v1.6, backbone v1.0, jQueryUI v1.8, ResizeModule.js, DraggableModule.js,Utility.js
 * html-
 * */
/*global Backbone,_,$,window,app,Role,console*/
var groupBox = (function (o) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var minimum = {height: 25, width: 20},
    isRoleAuthor = Role === "author",
            ColorList = ["blue", "yellow", "grey", "pink", "aqua", "magenta", "brown", "rgb(0,131,149)", "rgb(123,26,105)", "orange"],
            defaultSetting = {
                widgetType: "groupBox",
                subViewCollection: [
                    {width: 80, height: 30, length: 5, left: 100, top: 250, id: "", type: "Free Text", userAnswer: ""}
                    /*,{width: 80, height: 30, length: 3, left: 200, top: 250, id: "", type: "Numeric",fontSize:"13px"},*/
                    /*{width: 80, height: 30, length: 6, left: 300, top: 250, id: "", type: "Free Text"}*/
                ],
                answer: "1|2",
                isMathEditorEnable: false,
                groupColor: "",
                ignoreSpace: true,
                count: "1",
                GroupId: "",
                fontSize: "15pt",
                isValidateGroupWise: false //this flag enables groupbox to validate on each box answers as individuals.
            }, singleModel = Backbone.Model.extend({
        "default": {},
        initialize: function (options) {
            this.initObject = options;
            this["default"] = options;
        },
        reset: function () {
            this.set(this.initObject);
        }
    }),
            singleView = Backbone.View.extend({
                initialize: function (options) {
                    var o = this;
                    o.model = options.model;
                    o.color = options.color;
                    o.model.on("change:width", o.width.bind(o));
                    o.model.on("change:height", o.height.bind(o));
                    o.model.on("change:left", o.left.bind(o));
                    o.model.on("change:top", o.top.bind(o));
                    o.model.on("change:length", o.length.bind(o));
                    o.model.on("change:type", o.type.bind(o));
                    o.model.on("change:userAnswer", o.userAnswer.bind(o));
                    o.render();
                    //o.el.find("input").on("keypress", o.applyLength.bind(o));
                    if (app ? app.detect.isAndroid() : navigator.userAgent.match(/Android/i)) {
                        o.el.find('input').keyup(function (event) {
                            var ob = this,
                                    invalidChars = /[^0-9]/gi;
                            if (invalidChars.test(ob.value)) {
                                ob.value = ob.value.replace(invalidChars, "");
                            }
                        });
                    } else {
                        o.el.find('input').on("keypress", function (e) {
                            var result;
                            if (o.model.get("type") === "Free Text") {
                                result = true;
                            } else if (o.model.get("type") === "Numeric") {
                                var AllowableCharacters = '1234567890.';
                                var k = document.all ? parseInt(e.keyCode, 10) : parseInt(e.which, 10);
                                if (k !== 13 && k !== 8 && k !== 0) {
                                    if ((e.ctrlKey === false) && (e.altKey === false)) {
                                        result = (AllowableCharacters.indexOf(String.fromCharCode(k)) !== -1);
                                    } else {
                                        result = true;
                                    }
                                } else {
                                    result = true;
                                }
                            }
                            return result;
                        });
                    }
                    o.el.find('.gbView').blur(function (event) {
                        o.updateModel();
                    });
                    o.length();
                    o.width();
                    o.height();
                    o.left();
                    o.top();
                    o.applyGroupColor();
                    o.userAnswer();
                },
                type: function () {
                    this.el.find("input").val("");
                },
                applyGroupColor: function () {
                    if (isRoleAuthor) {
                        this.el.css("border", "2px solid " + this.color);
                    } else {
                        this.el.css("border", "2px transparent");
                    }
                },
                userAnswer: function () {
                    this.el.find(".gbView").val(this.model.get("userAnswer"));
                },
                render: function () {
                    var o = this, id = o.model.get("id") ? o.model.get("id") : "GB_" + parseInt(Math.random() * 100000, 10);
                    this.model.set("id", id);
                    $('#' + uiSetting.authorParent).append(uiSetting.getWidgetTemplate(o.model.toJSON(), isRoleAuthor));
                    o.el = $("#" + o.model.get("id"));
                    o.el.find("input").attr("maxlength", this.model.get("length"));
                    if (isRoleAuthor) {
                        uiSetting.applyAuthorRelatedProperty(o.el, o);
                    }
                },
                length: function () {
                    var i = this.el.find(".gbView");
                    i[0].selectedIndex ? (i[0].selectedIndex = 1) : i.attr("maxlength", this.model.get("length")).val("");
                },
                options: function () {
                    var temp, options = this.model.get("options"), str = '', i;
                    if (this.model.get("category") === "Options") {
                        if (options instanceof Array) {
                            temp = options;
                        } else {
                            temp = options.split(",");
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
                    this.el.css("left", parseInt(this.model.get("left")));
                },
                top: function () {
                    this.el.css("top", parseInt(this.model.get("top")));
                },
                destroy: function () {
                    delete this.model;
                    this.el.remove();
                },
                updateModel: function () {
                    var a = this.el;
                    this.model.set({left: parseInt(a.css('left'), 10), top: parseInt(a.css('top'), 10), height: a.height(), width: a.width(), userAnswer: this.el.find('.gbView').val()}, {silent: true});
                },
                checkAnswer: function () {
                    return this.model.check(this.model.get("userAnswer"));
                },
                getUserInput: function () {
                    return this.model.get("userAnswer");
                },
                reset: function () {
                    var viewEl = this.el;
                    this.model.reset();
                    if (viewEl[0].nodeName.toLocaleLowerCase() === "select") {
                        viewEl.css("border", "2px solid " + this.color).find(".gbView")[0].selectedIndex = 0;
                    } else {
                        if (isRoleAuthor) {
                            viewEl.css("border", "2px solid " + this.color).find(".gbView")[0].value = "";
                        } else {
                            viewEl.css("border", "2px solid " + "transparent").find(".gbView")[0].value = "";
                        }
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
                revealAnswer: function (val) {
                    this.el.css("border", "2px solid orange").find(".gbView").val(val);
                },
                activate: function () {
                    this.el.find(".gbView").removeAttr("disabled");
                },
                deactivate: function () {
                    this.el.find(".gbView").attr("disabled", "disabled");
                }
            });

    var groupCollectionModel = Backbone.Model.extend({
        "default": {},
        initialize: function (options) {
            this.initObject = options;
            this["default"] = options;
        }}),
            groupCollectionView = Backbone.View.extend({
                //  subViewCollection: [],
                context: null,
                groupClass: null,
                initialize: function (option) {
                    var o = this;
                    o.active = true;
                    o.deleted = false;
                    o.model = option.model;
                    o.subViewCollection = [];
                    o.model.on("change:count", o.changeCount.bind(o));
                    o.model.on("change:fontSize", o.fontSize.bind(o));
                    _.each(o.model.get("subViewCollection"), function (model) {
                        o.subViewCollection.push(new singleView({model: new singleModel(model), color: o.model.get("groupColor")}));
                    });
                    o.groupClass = "GC" + Date.now();
                    o.applyViewClass();
                    o.fontSize();
                },
                applyViewClass: function () {
                    var gClass = this.groupClass;
                    _.each(this.subViewCollection, function (a) {
                        a.el.hasClass(gClass) || a.el.addClass(gClass);
                    });
                },
                updateCollection: function () {
                    _.invoke(this.subViewCollection, 'updateModel');
                    this.model.set("subViewCollection", _.map(this.subViewCollection, function (v) {
                        return v.model.toJSON();
                    }));
                },
                validate: function () {
                    var feedbackArray = [], temp, tempInput,
                            inputList = this.getUserAnswer(),
                            ansList = this.model.get("answer"), i;
                    if (!(ansList instanceof Array)) {
                        if (this.model.get("ignoreSpace")) {
                            ansList = $.trim(ansList).replace(/\s/g, "");
                        } else {
                            ansList = $.trim(ansList).replace(/\s+/g, " ");
                        }
                        ansList = ansList.split(uiSetting.seperator);
                    }

                    for (i = 0; i < inputList.length; i++) {
                        if (this.model.get("ignoreSpace")) {
                            tempInput = $.trim(inputList[i]).replace(/\s/g, "");
                        } else {
                            tempInput = $.trim(inputList[i]).replace(/\s+/g, " ");
                        }
                        temp = $.inArray(tempInput, ansList);
                        if (temp !== -1) {
                            feedbackArray.push(true);
                            this.subViewCollection[i].correctVisual();
                            ansList.remove(temp);
                        } else {
                            feedbackArray.push(false);
                            this.subViewCollection[i].wrongVisual();
                        }
                    }
                    return !_.contains(feedbackArray, false);
                },
                changeCount: function () {
                    var c = this.model.get("count"), l = this.subViewCollection.length, i;
                    if (c > l) {
                        for (i = 0; i < (c - l); i++) {
                            this.subViewCollection.push(new singleView({model: new singleModel(_.extend({}, defaultSetting.subViewCollection[0], {left: (Math.random() * 800), top: (Math.random() * 300)})), color: this.model.get("groupColor")}));
                            this.applyViewClass();
                        }
                    } else {
                        for (i = c; i < l; i++) {
                            this.subViewCollection[i].destroy();
                        }
                        this.subViewCollection.remove(c, l);
                    }
                    this.fontSize();
                },
                fontSize: function () {
                    var o = this;
                    _.each(o.subViewCollection, function (singleCollection) {
                        singleCollection.el.find('.gbView').css("font-size", o.model.get("fontSize"));
                    });
                },
                deactivate: function () {
                    this.active = false;
                    _.invoke(this.subViewCollection, 'deactivate');
                },
                activate: function () {
                    this.active = true;
                    _.invoke(this.subViewCollection, 'activate');
                },
                revealAnswer: function () {
                    var o = this;
                    var ansList = this.model.get("answer");
                    if (!(ansList instanceof Array)) {
                        ansList = ansList.split(uiSetting.seperator);
                    }
                    //    o.deactivate();
                    // var result=this.validate();
                    _.each(o.subViewCollection, function (obj, index) {
                        o.subViewCollection[index].revealAnswer(ansList[index]);
                    });
                    //_.invoke(this.subViewCollection, 'reveal');
                },
                getUserAnswer: function () {
                    var o = this;
                    var ans = _.map(this.subViewCollection, function (view) {
                        var val = view.getUserInput();
                        return val;
                    });
                    return ans;
                    //_.invoke(this.subViewCollection, 'reveal');
                },
                setUserAnswer: function (ansList) {
                    var o = this;
                    _.each(o.subViewCollection, function (obj, index) {
                        o.subViewCollection[index].model.set('userAnswer', ansList[index]);
                    });
                },
                destroy: function () {
                    this.deleted = true;
                    _.invoke(this.subViewCollection, 'destroy');
                    delete this.subViewCollection;
                },
                correctVisual: function () {
                    _.invoke(this.subViewCollection, 'correctVisual');
                    return true;
                },
                wrongVisual: function () {
                    _.invoke(this.subViewCollection, 'wrongVisual');
                    return false;
                },
                reset: function () {
                    _.invoke(this.subViewCollection, 'reset');
                }
            });

    var uiSetting = {
        authorParent: "author_content_container",
        seperator: "|",
        widthDifference: isRoleAuthor ? 10 : 0,
        heightDifference: isRoleAuthor ? 0 : 0,
        resizeAndDrag: function (el, resizeSetting, draggableSetting) {
            typeof resizeModule !== "undefined" && resizeModule.makeResize(el, resizeSetting.callback, resizeSetting.context);
            typeof draggableModule !== "undefined" && draggableModule.makeDraggable(el);
        },
        changeHeightAndWidth: function (a) {
            var w = $(a).width(),
                    h = $(a).height();
            /* if ($(a).find('.gbView')[0].nodeName.toLowerCase() == "select") {
             $(a).find('.gbView').css({width: (w - (uiSetting.widthDifference * 2)) + 'px', height: (h - uiSetting.heightDifference) + 'px', 'font-size': parseInt(h * .625) + 'px'});
             } else {
             */
            $(a).find('.gbView').css({width: (w - (uiSetting.widthDifference * 2)) + 'px', height: (h - uiSetting.heightDifference) + 'px'});
        },
        getWidgetTemplate: function (obj, roleTypeAuthor) {
            var str = '', styler;
            styler = 'text-align: center; margin-left:' + uiSetting.widthDifference + 'px;padding:0px;border:0px;';
            if (!roleTypeAuthor) {//This is for reader part.
                str = '<div id="' + obj.id + '" style="position:absolute;border:2px transparent;padding:0px;">' /* 'px" title="TextBox having ID is ' + obj.id + '">'*/
                        + '<input class="gbView" type="text" style="' + styler + 'background:transparent;"></div>';
            } else {//this is for author part.
                str = '<div title="GroupBox_' + popupManager.count + '__' + obj.id + '" class="wPar groupBox_popcaller" id="' + obj.id + '" style="position:absolute;padding:0px;">' /* 'px" title="TextBox having ID is ' + obj.id + '">'*/
                        + '<input class="gbView" type="text" style="' + styler + 'background:transparent;"></div>';
            }
            /*
             else if (obj.category == "Options") {
             str = '<div id="' + obj.id + '" style="width:' + obj.width + 'px;position: absolute;height:' + obj.height + 'px; left:' + obj.left + 'px;top:' + obj.top + 'px"><select class="wid" style="color:magenta;font-weight:bold;text-align:center;border:2px solid transparent;font-size:15px;margin-left:' + uiSetting.widthDifference + 'px;width:' + (obj.width - (uiSetting.widthDifference * 2)) + 'px;height:' + (obj.height - uiSetting.heightDifference) + 'px;font-size:' + parseInt(obj.height * .625) + 'px">';
             
             if (obj.options instanceof Array) {
             temp = obj.options;
             } else {
             temp = obj.options.split(",")
             }
             for (var i = 0; i < temp.length; i++) {
             str = str + '<option value="' + temp[i] + '">' + temp[i] + '</option>';
             }
             str = str + '</select>';
             }
             */
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
            popId: 'group_' + Date.now(),
            labels: ["Type", "Answer", "Left", "Top", "Height", "Width", "Length"],
            common: [
                /*  {id: "grouptype", type: "text", label: "Group Identifier"},*/
                /*   {id: "colorlist", type: "select", options: "red,green,yellow,blue,black,pink", label: "Color Selected"},*/
                {id: "count", type: "select", options: "1,2,3,4,5,6,7,8,9,10", label: "Number of boxes"},
                {id: "fontSize", type: "select", options: "40pt,39pt,38pt,37pt,36pt,35pt,34pt,33pt,32pt,31pt,30pt,29pt,28pt,27pt,26pt,25pt,24pt,23pt,22pt,21pt,20pt,19pt,18pt,17pt,16pt,15pt,14pt,13pt,12pt,11pt,10pt,9pt,8pt,7pt,6pt,5pt,4pt,3pt", label: "Font size"},
                {id: "answer", type: "text", label: "Answer"},
                {id: "ignoreSpace", type: "checkbox", label: "Ignore space"},
                {id: "itemlist", type: "select", options: "", label: "Box ID"},
                {id: "grouptype", type: "select", options: "Numeric,Free Text", label: "Textbox type"},
                {id: "length", type: "text", label: "Length"},
                {id: "left", type: "text", label: "Left"},
                {id: "top", type: "text", label: "Top"},
                {id: "height", type: "text", label: "Height"},
                {id: "width", type: "text", label: "Width"},
            ],
            buttonList: [
                {id: "applyChanges", html: "Apply Changes"},
                {id: "submit", html: "Submit"},
                /*{id: "removeElement", html: "Remove"},*/
                {id: "removeAll", html: "Remove All"},
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
            $('#popup-overlay-groupbox').remove();
        },
        createPop: function () {
            getConfigurationWindow(this.popupInitialSetting, $('#' + uiSetting.authorParent));
        },
        show: function (e) {
            var view = e.data.view,
                    context = e.data.context;
            popupManager.updatePopFields(view, this.id);
            $('#popup-overlay-groupbox').css('display', 'block');

            var p = $("#" + popupManager.popupInitialSetting.popId).css("display", "block");

            p.find('#submit').off('click').on('click', {view: view}, popupManager.updateWidget);

            p.find("#applyChanges").off("click").on("click", {view: view}, function (e) {
                var view = e.data.view;
                var subView = view.subViewCollection;
                popupManager.update_model_SubView(subView[$("#" + popupManager.popupInitialSetting.popId).find("#itemlist")[0].selectedIndex]);
            });

            p.find("#itemlist").off("change").on("change", {view: view}, function (e) {
                var v = e.data.view;
                popupManager.update_Popup_SubView(v.subViewCollection[ e.target.selectedIndex]);
            });
            //p.find("#removeElement").off('click').on('click', context.destroy);
            /*   if (view.model.get("category") == "Options") {
             p.find('#options').off('change').on('change', popupManager.updateInstantAnswer);
             p.find(".Simple_Text_Box").css("display", "none");
             p.find(".Options").css("display", "block");
             } else {*/
            //  p.find(".Simple_Text_Box").css("display","block");

            p.find("#removeAll").off("click").on("click", context.destroy);
        },
        updateWidget: function (e) {
            var hash = '#', m = e.data.view.model,
                    view = e.data.view, pis = popupManager.popupInitialSetting,
                    p = $(hash + pis.popId);
            //  var subView = view.subViewCollection;
            //  popupManager.update_model_SubView(subViewList[p.find("#itemlist")[0].selectedIndex]);
            p.find("#applyChanges").trigger("click");
            view.model.set("answer", p.find("#answer").val());
            view.model.set("count", p.find("#count").val());
            /*    var hash = '#';
             var m = e.data.view.model, pis = popupManager.popupInitialSetting;
             var p = $(hash + pis.popId);
             var updateCase = m.get("category");
             //updating common properties
             for (var i = 0; i < s.length; i++) {
             if (s[i].id == "left" || s[i].id == "top" || s[i].id == "width" || s[i].id == "height") {
             p.find(hash + s[i].id).val(m.get(s[i].id));
             m.set(s[i].id, p.find(hash + s[i].id).val());
             }
             }*/
            m.set('ignoreSpace', p.find("#ignoreSpace").is(":checked"));
            m.set('fontSize', p.find("#fontSize").val());
            popupManager.hide();
        },
        update_Popup_SubView: function (viewObject) {
            var p = $("#" + popupManager.popupInitialSetting.popId),
                    m = viewObject.model;
            p.find("#top").val(m.get("top"));
            p.find("#left").val(m.get("left"));
            p.find("#height").val(m.get("height"));
            p.find("#width").val(m.get("width"));
            p.find("#grouptype").val(m.get("type"));
            p.find("#length").val(m.get("length"));
        },
        update_model_SubView: function (viewObject) {
            var p = $("#" + popupManager.popupInitialSetting.popId),
                    m = viewObject.model,
                    el = viewObject.el,
                    parent = $('#' + uiSetting.authorParent);

            m.set("top", app.limitTop(el, parent, p.find("#top").val()) + "");

            m.set("left", app.limitLeft(el, parent, p.find("#left").val()) + "");

            m.set("height", app.limitHeight(el, parent, p.find("#height").val(), minimum.height));

            m.set("width", app.limitWidth(el, parent, p.find("#width").val(), minimum.width));

            m.set("type", p.find("#grouptype").val());
            m.set("length", p.find("#length").val());
            /*p.find("#left").val(viewObject.model.get("left"));
             p.find("#height").val(viewObject.model.get("height"));
             p.find("#width").val(viewObject.model.get("width"));
             p.find("#grouptype").val(viewObject.model.get("type"));*/
        },
        updatePopFields: function (view, id) {
            var makeSelect = function (o) {
                var a = "";
                for (var k = 0; k < o.length; k++) {
                    a = a + '<option index="' + k + '" value="' + o[k].model.id + '">' + o[k].model.id + '</option>';
                }
                return a;
            }, hash = "#",
                    m = view.model, pis = popupManager.popupInitialSetting,
                    p = $(hash + pis.popId),
                    viewList = view.subViewCollection,
                    indexSelected = 0, i;

            view.updateCollection();
            for (i = 0; i < viewList.length; i++) {
                if (viewList[i].el[0].id === id) {
                    indexSelected = i;
                    break;
                }
            }
            p.find("#count").val(viewList.length);
            p.find("#itemlist").html(makeSelect(viewList)).val(viewList[indexSelected].el[0].id);
            p.find("#answer").val(view.model.get("answer"));
            popupManager.update_Popup_SubView(viewList[indexSelected]);
            /*   var hash = '#';
             var m = view.model, pis = popupManager.popupInitialSetting;
             var p = $(hash + pis.popId), s = pis.common;
             var updateCase = m.get("category");
             var newList = p.find("." + updateCase);
             //updating common properties
             for (var i = 0; i < s.length; i++) {
             if (s[i].nodeName.toLowerCase() == "select") {
             var opt = typeof m.get("options") == "string" ? m.get("options").split(",") : m.get("options"), a = '';
             for (var l = 0; l < opt.length; l++) {
             a = a + '<option value="' + opt[l] + '">' + opt[l] + '</option>';
             }
             $(this).html(a).val(m.get("answer"));
             //  this.value = m.get("answer");
             }
             else if (s[i].id == "left" || s[i].id == "top" || s[i].id == "width" || s[i].id == "height") {
             p.find(hash + s[i].id).val(m.get(s[i].id) + 'px');
             } else {
             p.find(hash + s[i].id).val(m.get(s[i].id));
             }
             }*/
            p.find("#ignoreSpace")[0].checked = m.get('ignoreSpace');
            p.find("#fontSize").val(m.get('fontSize'));
        },
        updateInstantAnswer: function (e) {
            var opt = typeof e.target.value === "string" ? e.target.value.split(',') : e.target.value, a = '';
            for (var l = 0; l < opt.length; l++) {
                a = a + '<option value="' + opt[l] + '">' + opt[l] + '</option>';
            }
            $('#' + popupManager.popupInitialSetting.popId).find('select[attr="option"]').html(a);
        },
        hide: function () {
            $('#popup-overlay-groupbox').css('display', 'none');
            $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
        }
    };

    function getConfigurationWindow(setting, parent) {
        if (typeof $('#' + setting.popId)[0] !== "undefined") {
            return false;
        }
        function makeSelect(o) {
            var list = o.options.split(','),
                    a = '<select id="' + o.id + '">';
            for (var k = 0; k < list.length; k++) {
                a = a + '<option value="' + list[k] + '">' + list[k] + '</option>';
            }
            return a + '</select>';
        }

        var inputType = setting.common,
                buttonList = setting.buttonList || [],
                a = '<div class="popup-overlay" id="popup-overlay-groupbox"></div><div id="' + setting.popId + '" class="popup_container popup_container-groupbox">';
        for (var i = 0; i < inputType.length; i++) {
            if (i === 4) {
                a = a + '<div class="group_box_structure">';
            }
            a = a + '<div class="pop-row">';

            a = a + '<label>' + inputType[i].label + '</label>';
            if (inputType[i].type === "select") {
                a = a + makeSelect(inputType[i]);
            } else if (inputType[i].type === "text") {
                a = a + '<input type="' + inputType[i].type + '"id="' + inputType[i].id + '">';
            } else if (inputType[i].type === "checkbox") {
                a = a + '<input type="' + inputType[i].type + '"id="' + inputType[i].id + '" class="' + inputType[i].Class + '">';
            }
            a = a + '</div>';
        }
        a = a + '</div>';
        a = a + '<button class="button_decorator" style="float:none;margin-left:46%;" type="button" id="' + buttonList[0].id + '">' + buttonList[0].html + '</button><br>';
        for (var x = 1; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
        }
        $(parent).append(a + '</div>');
        $('#' + setting.popId).find('#closeGraphpopup').on("click", popupManager.hide.bind(popupManager));
    }

    function groupBox(options) {
        /*defining all variable at once*/
        var _this = this, cSetting = {}, authParent, collectionView;
        /*Default setting of widget*/
        function init() {
            var hash = '#';
            if (options.hasOwnProperty('left') || options.hasOwnProperty('top')) {
                defaultSetting.groupColor = (ColorList.length > popupManager.count) ? ColorList[popupManager.count] : ColorList[(popupManager.count % ColorList.length)];
                cSetting = $.extend({}, defaultSetting);
                cSetting.subViewCollection[0].left = options.left;
                cSetting.subViewCollection[0].top = options.top;
            } else {
                cSetting = $.extend({}, defaultSetting, options); //current setting based on options provided in instance making.
            }
            cSetting.GroupId = cSetting.GroupId || ('GB_' + Date.now());
            authParent = $(hash + uiSetting.authorParent);
            if (typeof authParent[0] === "undefined") {
                throw "Parent Element is Undefined";
            }
            if (isRoleAuthor) {
                popupManager.updateStatus('+');
            }
            collectionView = new groupCollectionView({model: new groupCollectionModel(cSetting)});
            if (isRoleAuthor) {
                authParent.delegate("." + collectionView.groupClass, "dblclick", {view: collectionView, context: _this}, popupManager.show);
            }
        }

        init();
        /*
         *Api implementations for widget are here
         *
         */

        /*this will remove the widget from the screen*/

        _this.destroy = function () {
            if (!collectionView.delected) {
                collectionView.destroy();
                popupManager.updateStatus('-');
            }
        };

        _this.getWidgetType = function () {
            return cSetting.widgetType;
        };
        /*This will reset the widget to its initial settings*/
        _this.reset = function () {
            if (!collectionView.deleted) {
                collectionView.active && collectionView.reset();
                console.log("reset is called");
            }
        };
        /*This will set the property*/
        _this.setProperty = function (x) {
            if (!collectionView.deleted) {
                // collectionView.model.set(x);
            }
            return undefined;
        };
        /*This will get the property as per the value provided in the options*/
        _this.getProperty = function (x) {
            if (!collectionView.deleted) {
                //        return collectionView.model.get(x);
            }
            return undefined;
        };
        /*It will validate the widget against the user inputs*/
        _this.validate = function (type) {
            if (!collectionView.deleted) {
                var result = collectionView.validate();
                if (type === "specific") {
                    collectionView.deactivate();
                    collectionView.revealAnswer();
                    result && collectionView.correctVisual();
                } else if (collectionView.model.get("isValidateGroupWise")) {
                    return result ? collectionView.correctVisual() : collectionView.wrongVisual();
                }
                return result;
            }
            return undefined;
        };
        /*It will give the all data associated with the widget*/
        _this.getWidgetData = function () {
            if (!collectionView.deleted) {
                collectionView.updateCollection();
                return collectionView.model.toJSON();
            }
            return undefined;
        };
        /*This will bring all the user input as each level of feedback*/
        _this.getUserAnswer = function () {
            if (!collectionView.deleted) {
                return collectionView.getUserAnswer();
                //    return tView.el.find("wid").val();
            }
            return undefined;
        };

        /*This will set the user answer*/
        _this.setUserAnswer = function (val) {
            if (!collectionView.deleted) {
                collectionView.setUserAnswer(val);
            }
            return undefined;
        };

        _this.deactivate = function () {
            if (!collectionView.deleted) {
                collectionView.deactivate();
            }
        };
        _this.activate = function () {
            if (!collectionView.deleted) {
                collectionView.activate();
            }
        };
        
        /*This will reveal the answers*/
        _this.revealAnswer = function () {
            if (!collectionView.deleted) {
                collectionView.revealAnswer();
            }
        };
    }

    groupBox.prototype.toString = function () {
        return "This is groupBox widget type";
    };
    return groupBox;
})
        (window);