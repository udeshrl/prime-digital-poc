/**
 * @author Manideep Karnati
 */

var freeDraw = (function (o) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var defaultSetting = {
        widgetType: "freeDraw",
        category: "Add_Just_Canvas",
        width: 300,
        height: 120,
        left: 100,
        top: 100,
        id: "",
        options: [],
        savedDataToRedraw: ""
    };
    var model = Backbone.Model.extend({
        "default": {},
        initialize: function (options) {
            this.initObject = options;
            this["default"] = options;
        },
        reset: function () {
            this.set(this.initObject);
        }
    });
    var view = Backbone.View.extend({
        initialize: function (options) {
            var o = this;
            o.el = options.el;
            o.model = options.model;
            o.model.on("change:width", o.width.bind(o));
            o.model.on("change:height", o.height.bind(o));
            o.model.on("change:left", o.left.bind(o));
            o.model.on("change:top", o.top.bind(o));
            o.model.on("change:savedDataToRedraw", o.savedDataToRedraw.bind(o));
            o.savedDataToRedraw();
        },
        savedDataToRedraw: function () {
            var canvasEle = this.el[0].getElementsByTagName("canvas");
            var val = this.model.get("savedDataToRedraw");
            for (var i = 0; i < canvasEle.length; i++) {
                var canvasId = $(canvasEle[i]).attr('id');
                var img = document.createElement('img'); // create a Image Element
                img.src = val[canvasId];   //image source
                var ctx2 = canvasEle[i].getContext('2d');
                ctx2.drawImage(img, 0, 0);  // drawing image onto second canvas element
            }
        },
        options: function () {
            var temp, options = this.model.get("options"), str = '';
            if (this.model.get("category") == "Options") {
                if (options instanceof Array) {
                    temp = options;
                } else {
                    temp = options.split(",")
                }
                for (var i = 0; i < temp.length; i++) {
                    str = str + '<option value="' + temp[i] + '">' + temp[i] + '</option>';
                }
                this.el.find('select').html(str);
            }
        },
        width: function () {
            this.el.width(parseInt(this.model.get("width")));
            uiSetting.changeHeightAndWidth(this.el);
        },
        height: function () {
            this.el.height(parseInt(this.model.get("height")));
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
            this.model.set({left: parseInt(a.css('left')), top: parseInt(a.css('top')), height: a.height(), width: a.width()}, {silent: true});
        },
        saveCanvas: function (canvasData) {
            this.model.set("savedDataToRedraw", canvasData);
            //console.log(this.model.get("id") +"----"+this.model.get("savedDataToRedraw"));
            return this.model.get("savedDataToRedraw");
        }
    });
    var uiSetting = {
        authorParent: "author_content_container",
        widthDifference: Role == "author" ? 10 : 0,
        heightDifference: 6,
        resizeAndDrag: function (el, resizeSetting, draggableSetting) {

            typeof resizeModule != "undefined" && resizeModule.makeResize(el, resizeSetting.callback, resizeSetting.context);

            typeof draggableModule != "undefined" && draggableModule.makeDraggable(el);
            // $("#author_content_containe").find(".btn").removeClass("ui-resizable-handle");
        },
        changeHeightAndWidth: function (a) {
            var w = $(a).width(),
                    h = $(a).height();
            // if u want to change the height and width of the inner contents of the component u can use this method..

            /*if ($(a).find('.dwid')[0].nodeName.toLowerCase() == "select") {
             //$(a).find('.dwid').css({width: w  + 'px', height: h  + 'px'});
             } else {
             //$(a).find('.dwid').css({width: w  + 'px', height: h  + 'px'});
             }*/

        },
        getWidgetTemplate: function (obj, mode) {
            var str = '', styler = '', temp;
            if (obj.category == "Add_Just_Canvas") {
                styler = 'margin-left:' + uiSetting.widthDifference + 'px;width:' + (obj.width - (uiSetting.widthDifference * 2)) + 'px;height:' + (obj.height - 6) + 'px;';
                if (mode !== "author") {
                    if (mode === "student") {
                        str = '<div class="dwPar readerdwPar" id="' + obj.id + '" style="width:' + obj.width + 'px;height:' + obj.height + 'px;left:' + obj.left + 'px;top:' + obj.top + 'px">' +
                                '<canvas class="dwid" id="canvas' + obj.id + '" storkeStyle="" type="text" width = "' + (obj.width) + '" height= "' + obj.height + '" style="margin-left: ' + uiSetting.widthDifference + 'px;" ></canvas>' +
                                '<div class="btnOuter" id="btn' + obj.id + '" style="position:relative;height:26px;width: 162px;top: -34px;float: right;background: transparent;"></div></div>';
                    } else if (mode === "teacher") {
                        str = '<div class="dwPar readerdwPar" id="' + obj.id + '" style="width:' + obj.width + 'px;height:' + obj.height + 'px;left:' + obj.left + 'px;top:' + obj.top + 'px">' +
                                '<img class="dwid" id="canvas' + obj.id + '" storkeStyle="" type="text" width = "' + (obj.width) + '" height= "' + obj.height + '" style="margin-left: ' + uiSetting.widthDifference + 'px;" /></div>';
                    }//This is for reader part.

                } else {//this is for author part.
                    str = '<div class="dwPar" id="' + obj.id + '" style="width:' + obj.width + 'px;height:' + obj.height + 'px;left:' + obj.left + 'px;top:' + obj.top + 'px">' /* 'px" title="TextBox having ID is ' + obj.id + '">'*/
                            + '<div class="btnOuter" id="btn' + obj.id + '" style="position:relative;height:26px;width: 162px;top: -36px;float: right;background: transparent;border: 1px solid transparent !important;"><div class="toolbarForFD"><div type="button" title="Pen Tool" class="btnPen error authrTB" value="Pen" onclick=""></div> ' +
                            '<div type="button" title= "Erase" class="btnEarsor error authrTB" value="Eraser" onclick=""></div> ' +
                            '<div type="button" class="btnClear error authrTB" title="Erase All" value="Clear" onclick=""></div>' +
                            '<div type="button" class="btnColor error authrTB" title="Color" value="Color" onclick=""></div></div></div></div>';
                }
            } else if (obj.category == "Options") {
                str = '<div id="' + obj.id + '" style="width:' + obj.width + 'px;position: absolute;height:' + obj.height + 'px; left:' + obj.left + 'px;top:' + obj.top + 'px"><select class="dwid" style="color:magenta;font-weight:bold;text-align:center;border:2px solid transparent;font-size:15px;margin-left:' + uiSetting.widthDifference + 'px;width:' + (obj.width - (uiSetting.widthDifference * 2)) + 'px;height:' + (obj.height - uiSetting.heightDifference) + 'px;font-size:' + parseInt(obj.height * .625) + 'px">';

                if (obj.options instanceof Array) {
                    temp = obj.options;
                } else {
                    temp = obj.options.split(",");
                }
                for (var i = 0; i < temp.length; i++) {
                    str = str + '<option value="' + temp[i] + '">' + temp[i] + '</option>';
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
            popId: 'freeDraw_pop_singleton',
            labels: ["Left", "Top", "Height", "Width"],
            common: [
                {id: "left", type: "text", label: "Left"},
                {id: "top", type: "text", label: "Top"},
                {id: "height", type: "text", label: "Height"},
                {id: "width", type: "text", label: "Width"}
            ],
            buttonList: [
                {id: "submit", html: "Submit"},
                {id: "removeElement", html: "Remove"},
                {id: "closeFDGraphpopup", html: "Close"}
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
            $('#popup-overlay-draw').remove();
        },
        createPop: function () {
            getConfigurationWindow(this.popupInitialSetting, $('#' + uiSetting.authorParent));
        },
        show: function (view, context) {
            this.updatePopFields(view);
            $('#popup-overlay-draw').css('display', 'block');
            var p = $("#" + popupManager.popupInitialSetting.popId);

            p.css("display", "block");
            p.css("z-index", 501);
            p.find('#submit').off('click').on('click', {view: view}, popupManager.updateWidget);

            p.find("#removeElement").off('click').on('click', context.destroy);
            if (view.model.get("category") == "Options") {
                p.find('#options').off('change').on('change', popupManager.updateInstantAnswer);
                //p.find(".Simple_Text_Box").css("display", "none");
                p.find(".Options").css("display", "block");

            } else {
                //p.find(".Simple_Text_Box").css("display", "block");
                p.find(".Options").css("display", "none");
            }
        },
        updateWidget: function (e) {
            var hash = '#';
            var m = e.data.view.model, pis = popupManager.popupInitialSetting;
            var p = $(hash + pis.popId);
            var updateCase = m.get("category");
            var newList = p.find("." + updateCase);
            var s = pis.common; //applying status to common properties.
            if (m.get("category") == "Add_Just_Canvas") {
                newList.not('label').each(function () {
                    //this.value=m.get(this.id).toString();
                    m.set(this.id, this.value.toString());
                });
            } else {
                newList.not('label').each(function () {
                    m.set(this.id, this.value);
                });
            }
            //updating common properties
            for (var i = 0; i < s.length; i++) {
                if (s[i].id == "left" || s[i].id == "top" || s[i].id == "width" || s[i].id == "height") {
                    //p.find(hash + s[i].id).val(m.get(s[i].id));
                    m.set(s[i].id, p.find(hash + s[i].id).val());
                }
            }
            popupManager.hide();
        },
        updatePopFields: function (view) {
            var hash = '#';
            var m = view.model, pis = popupManager.popupInitialSetting;
            var p = $(hash + pis.popId), s = pis.common;

            var updateCase = m.get("category");
            var newList = p.find("." + updateCase);

            if (updateCase == "Options") {
                newList.not('label').each(function () {
                    if (this.nodeName.toLocaleLowerCase() == "select") {
                        var opt = typeof m.get("options") == "string" ? m.get("options").split(",") : m.get("options"), a = '';
                        for (var l = 0; l < opt.length; l++) {
                            a = a + '<option value="' + opt[l] + '">' + opt[l] + '</option>';
                        }
                        $(this).html(a).val(m.get("answer"));
                        //  this.value = m.get("answer");
                    } else {
                        this.value = m.get(this.id).toString();
                    }
                });
                // newList.find(hash + pis.optionType[x].id).val(m.get(pis.optionType[i].id));
            } else if (updateCase == "Add_Just_Canvas") {
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
        },
        updateInstantAnswer: function (e) {
            var opt = typeof e.target.value == "string" ? e.target.value.split(',') : e.target.value, a = '';
            for (var l = 0; l < opt.length; l++) {
                a = a + '<option value="' + opt[l] + '">' + opt[l] + '</option>';
            }
            $('#' + popupManager.popupInitialSetting.popId).find('select[attr="option"]').html(a);
        },
        hide: function () {
            $('#popup-overlay-draw').css('display', 'none');
            $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
        }
    };

    function getConfigurationWindow(setting, parent) {
        if (typeof $('#' + setting.popId)[0] !== "undefined") {
            return false;
        }
        function makeSelect(o) {
            var list = o.options.split(','),
                    a = '<select id="' + o.id + '" attr="' + o.attr + '" class="' + o.Class + '">';
            for (var k = 0; k < list.length; k++) {
                a = a + '<option value="' + list[k] + '">' + list[k] + '</option>';
            }
            return a + '</select>';
        }
        var inputType = setting.common || [], buttonList = setting.buttonList || [],
                a = '<div class="popup-overlay" id="popup-overlay-draw"></div><div id="' + setting.popId + '" class="popup_container">';
        for (var i = 0; i < inputType.length; i++) {
            a = a + '<div class="pop-row">';
            a = a + '<label class="' + inputType[i].Class + '">' + inputType[i].label + '</label>';
            if (inputType[i].type == "select") {
                a = a + makeSelect(inputType[i]);
            } else if (inputType[i].type == "text") {
                a = a + '<input type="' + inputType[i].type + '"id="' + inputType[i].id + '" class="' + inputType[i].Class + '">';
            }
            a = a + '</div>';
        }
        for (var x = 0; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
        }
        $(parent).append(a + '</div>');
        $('#closeFDGraphpopup').on("click", popupManager.hide.bind(popupManager));
        return true;
    }
    var colorSetting = {
        newGmail: [["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"], ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"], ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"], ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"], ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]],
        createColorWindow: function (el, id) {
            $(el).find('#color' + id).spectrum({
                allowEmpty: true,
                color: "#000",
                showInput: true,
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
            el.find('#color' + id).toggle();
        },
        hide: function (el) {
            el.find('#color' + id).toggle();
        },
        getColor: function (el) {
            return $(el).find('#color' + id).spectrum("get").toHexString();
        },
        setColor: function (el, color) {
            $(el).find('#color' + id).spectrum("set", color);
        }
    };
    function freeDraw(options) {
        /*defining all variable at once*/
        var _this = this, cSetting = {}, authParent, tView;
        /*Default setting of widget*/
        function init() {
            var hash = '#';
            cSetting = $.extend({}, defaultSetting, options); //current setting based on options provided in instance making.
            cSetting.id = cSetting.id || ('FD_' + Date.now());
            authParent = $(hash + uiSetting.authorParent);
            if (typeof authParent[0] === "undefined") {
                throw "Parent Element is Undefined";
            }
            _this.active = true;
            _this.deleted = false;
            authParent.append(uiSetting.getWidgetTemplate(cSetting, Role));//appending widget html template
            tView = new view({model: new model(cSetting), el: authParent.find(hash + cSetting.id)});
            if (Role === "author") {
                uiSetting.applyAuthorRelatedProperty(tView.el, _this);
                popupManager.updateStatus('+');
                authParent.find("#btn" + cSetting.id).removeClass("ui-resizable-handle");
                tView.el.bind('dblclick', {view: tView, context: _this}, function (e) {
                    e.data.view.updateModel();
                    popupManager.show(e.data.view, e.data.context);
                });
            } else if (Role === "student") {
                authParent.find("#btn" + cSetting.id).append("<div class='toolbarForFD'><div type='button' title='Pen Tool' class='btnPen error' value='Pen' onclick='sketcher" + cSetting.id + ".pen();'></div> " +
                        "<div type='button' title= 'Erase' class='btnEarsor error' value='Eraser' onclick='sketcher" + cSetting.id + ".eraser();'></div> " +
                        "<div type='button' class='btnClear error' title='Erase All' value='Clear' onclick='sketcher" + cSetting.id + ".clear();'></div>" +
                        "<input onChange='sketcher" + cSetting.id + ".color(color" + cSetting.id + ");' title='Color' id='color" + cSetting.id + "' class='btnColor error'  type='text' value='undefined' style='display: none;'></div>");
                window['sketcher' + cSetting.id ] = new Sketcher("canvas" + cSetting.id);
                colorSetting.createColorWindow($('#btn' + cSetting.id), cSetting.id);
            } else if (Role === "teacher") {

                //Teacher logic goes here
                var canvasEle = document.getElementsByTagName("img");
                var canvasSavedData = JSON.parse(localStorage.getItem('dataOfCanvas'));
                for (var i = 0; i < canvasEle.length; i++) {
                    var canvasId = $(canvasEle[i]).attr('id');
                    canvasEle[i].setAttribute('src', canvasSavedData[canvasId]);
                }
            }
        }

        init();
        /*
         *Api implementations for widget are here
         *
         */
        /*this will remove the widget from the screen*/
        this.destroy = function () {
            if (!_this.deleted) {
                _this.deleted = true;
                tView.destroy();
                popupManager.updateStatus('-');
            }
        };
        /*This will reset the widget to its initial settings*/
        this.reset = function () {
            if (!_this.deleted) {

                var modelId = "sketcher" + cSetting.id;
                window[modelId ].clear();

                console.log("reset is called");
            }
        };
        /*This will set the property*/
        this.setProperty = function (x) {
            if (!_this.deleted) {
                tView.model.set(x);
            }
            return undefined;
        };
        /*This will get the property as per the value provided in the options*/
        this.getProperty = function (x) {
            if (!_this.deleted) {
                return tView.model.get(x);
            }
            return undefined;
        };
        /*It will validate the widget against the user inputs*/
        this.validate = function (type) {
            return true; // below code is for teacher

            if (!_this.deleted) {
                if (type === "specific") {
                    console.log("feedback type is::" + type);
                }
                //var ctx = $("#canvas" + cSetting.id).get(0).getContext("2d");
                var canvasEle = document.getElementsByTagName("canvas");
                var dataOfCanvas = new Object;
                for (var i = 0; i < canvasEle.length; i++) {
                    var canvasId = $(canvasEle[i]).attr('id');
                    dataOfCanvas[canvasId] = canvasEle[i].toDataURL();
                }
                localStorage.setItem("dataOfCanvas", JSON.stringify(dataOfCanvas));
                return tView.saveCanvas(dataOfCanvas);
            }
            return undefined;
        };
        /*It will give the all data associated with the widget*/
        this.getWidgetData = function () {
            if (!_this.deleted) {
                tView.updateModel();
                return tView.model.toJSON();
            }
            return undefined;
        };
        /*This will bring all the user input as each level of feedback*/
        this.getUserAnswer = function () {
            if (!_this.deleted) {
                //var ctx = $("#canvas" + cSetting.id).get(0).getContext("2d");
                var canvasEle = document.getElementsByTagName("canvas");
                var dataOfCanvas = new Object;
                for (var i = 0; i < canvasEle.length; i++) {
                    var canvasId = $(canvasEle[i]).attr('id');
                    dataOfCanvas[canvasId] = canvasEle[i].toDataURL();
                }
                return tView.saveCanvas(dataOfCanvas);
            }
            return undefined;
        };

        /*This will set the user answer*/
        this.setUserAnswer = function (canvasData) {
            if (!_this.deleted) {
                tView.model.set("savedDataToRedraw", canvasData);
            }
            return undefined;
        };
        
        /*This will reveal the answers*/
        this.revealAnswer = function () {
            return undefined;
        };
        
    }

    freeDraw.prototype.deactivate = function () {
        this.active = false;
    };
    freeDraw.prototype.activate = function () {
        this.active = true;
    };
    freeDraw.prototype.toString = function () {
        return "This is free draw widget type";
    };
    return freeDraw;
})(window);