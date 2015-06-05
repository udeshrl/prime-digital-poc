/*Dependency files
 * css-tallyMarks.css
 * js-jQuery v2.03, underscore v1.6, backbone v1.0, jQueryUI v1.8, ResizeModule.js, DraggableModule.js,Utility.js
 * html-
 * */
var tallyMarks = (function (o, $, Backbone, _) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var widgetLimit = 40, defaultSetting = {
        widgetType: "tallyMarks",
        width: 445,
        height: 110,
        answer: {
            tickCount: 0,
            ans: 0,
            maxNum: 10,
            minNum: 0,
            initNum: 0
        },
        hotSpot: [{
                className: "increaser",
                title: "Add tally marks",
                left: 25,
                top: 5,
                width: 150,
                height: 90
            }, {
                className: "decreaser",
                title: "Remove tally marks",
                left: 250,
                top: 5,
                width: 150,
                height: 90
            }],
        left: 100,
        top: 100

    };


    var createDummyMarks = function (num, cont) {

        $(cont).find(".tickbunch").remove();
        var s = {
            lineColor: "black",
            lineWidth: 2,
            lineGap: 8,
            lineHeight: 30,
            crossLineExtraX: 4,
            crossLineStartYCoord: 0,
            crossLineEndYCoord: 0,
            crossLineTopPercent: 20,
            svgHeight: 0, // will be calculated below
            svgWidth: 0
                    // will be calculated below
        };
        s.svgHeight = s.lineHeight + 10;
        s.svgWidth = s.crossLineExtraX + (s.lineWidth * 4) + (s.lineGap * 3) + s.crossLineExtraX + 10; // abstract;
        s.crossLineStartYCoord = (s.crossLineTopPercent / 100) * s.lineHeight; // Cross line starts 20% from top
        s.crossLineEndYCoord = (1 - s.crossLineTopPercent / 100) * s.lineHeight;

        for (var i = 0; i < num; i++) {
            var tickWrapper;
            if (i % 5 == 0) {
                tickWrapper = $('<div class="tickbunch"><svg class="svg_class" height="'
                        + s.svgHeight
                        + '" width="'
                        + s.svgWidth
                        + '" ></svg></div>');
                cont.append(tickWrapper);
            }
            if (!(i % 5 == 4)) {
                var l = document.createElementNS("http://www.w3.org/2000/svg",
                        "line");
                var xOffset = s.crossLineExtraX + s.lineGap * (i % 5)
                        + s.lineWidth * ((i % 5) + 1);
                l.setAttribute('x1', xOffset);// x1
                l.setAttribute('y1', 0);// y1
                l.setAttribute('x2', xOffset);// x2
                l.setAttribute('y2', s.lineHeight);// y2
                l.style.stroke = s.lineColor;
                l.style.strokeWidth = s.lineWidth;

                tickWrapper.find('svg').append(l);
            } else {
                var l = document.createElementNS("http://www.w3.org/2000/svg",
                        "line");
                l.setAttribute('x1', 0);// x1
                l.setAttribute('y1', s.lineHeight);// y1
                l.setAttribute('x2', s.crossLineExtraX + (s.lineGap * 3)
                        + (s.lineWidth * 5) + s.crossLineExtraX);// x2
                l.setAttribute('y2', 0);// y2
                l.style.stroke = s.lineColor;
                l.style.strokeWidth = s.lineWidth;

                tickWrapper.find('svg').append(l);
            }
        }

        if (Role === "author") {
            $('.tickbunch').css({
                'opacity': '0.2'
            });
        }

    };

    // function to get hotspot click event
    var hsClicked = function (e) {
        var view = e.data.view;
        var tickContainer = e.data.tick;

        var ele = e.currentTarget;
        var setting = _.extend({}, view.model.get("answer")); // get the clone of model
        setting.tickCount;
        var maxNum = setting.maxNum;
        var minNum = setting.minNum;

        if ($(ele).hasClass("increaser")) { // if click event is to increase marks
            if (setting.tickCount < maxNum) { // if tick count is less than max limit
                setting.tickCount++;

            }
        } else {
            if (setting.tickCount > minNum) { // if tick count is greater than min limit
                setting.tickCount--;

            }
        }
        view.model.set("answer", setting);
    };

    // function to check validation for popup
    var checkValidation = function (data) {
        var isValid = true;
        var msg = '';

        var max = parseInt(data.maxNum);
        var init = parseInt(data.initNum);
        var ans = parseInt(data.ans);
        if (init > max) {
            isValid = false;
            msg = 'Maximum value shoud be greater than or equal to  initial value';
        } else if (ans > max) {
            isValid = false;
            msg = 'Answer shoud be less than or equal to maximum value';
        } else if (max > widgetLimit) {
            isValid = false;
            msg = 'Maximum value shoud be less than or equal to ' + widgetLimit;
        }
        return {isValid: isValid, msg: msg}; // return result and message for error
    };

    var model = Backbone.Model.extend({
        "default": {},
        initialize: function (options) {
            this.initObject = options;
            this["default"] = options;
        },
        reset: function () {
            this.set(this.initObject);
        },
        check: function (val) {

            var ans = this.get("answer").ans, v = [];
            if (ans == val) {
                return true;
            }
            return false;
        }
    });



    var view = Backbone.View
            .extend({
                initialize: function (options) {
                    var o = this;
                    o.el = options.el;
                    o.active = true;
                    o.deleted = false;
                    o.model = options.model;
                    o.tickContainer = options.tickContainer;
                    o.model.on("change:answer", o.changeAnswer.bind(o));
                    o.changeAnswer();
                },
                destroy: function () {
                    delete this.model;
                    this.el.remove();
                },
                changeAnswer: function () { // will call each time on model value changed
                    var answers = this.model.get("answer");
                    createDummyMarks(answers.tickCount, this.tickContainer); // create marks on model value change
                },
                updateModel: function () {
                    var a = this.el, b, className = 'increaser';
                    var hotSpot = [];
                    a.find(".tally_hotSpotCan").each(function () {
                        b = $(this);
                        if ($(this).hasClass('decreaser')) {
                            className = 'decreaser';
                        }
                        hotSpot.push({
                            className: className,
                            title: b.attr('title'),
                            left: parseInt(b.css('left'), 10),
                            top: parseInt(b.css('top'), 10),
                            height: b.height(),
                            width: b.width()
                        });
                    });
                    this.model.set({
                        left: parseInt(a.css('left'), 10),
                        top: parseInt(a.css('top'), 10),
                        height: a.height(),
                        width: a.width(),
                        hotSpot: hotSpot
                    }, {
                        silent: true
                    });
                },
                checkAnswer: function () {
                    return this.model.check(this.model.get("answer").tickCount);
                },
                reset: function () {
                    this.model.reset();
                    var answers = _.extend({}, this.model.get("answer"));
                    answers.tickCount = answers.initNum;
                    this.model.set('answer', answers);
                    if (Role == "student") {
                        this.el.find('.decreaser').css("border", "2px solid transparent");
                    }
                },
                revealAnswer: function () {
                    console.log(this.model.get("answer"));
                    var answers = _.extend({}, this.model.get("answer"));
                    answers.tickCount = answers.ans;
                    this.model.set('answer', answers);
                },
                deactivate: function () {
                    this.active = false;
                },
                activate: function () {
                    this.active = true;
                },
                correctVisual: function () {
                    this.el.find('.decreaser').css("border", "2px solid green");
                    return true;
                },
                wrongVisual: function () {
                    this.el.find('.decreaser').css({"border": "2px solid red"});
                    return false;
                }
            });

    var uiSetting = {
        seperator: "|",
        authorParent: "author_content_container",
        widthDifference: Role == "author" ? 10 : 0,
        heightDifference: Role == "author" ? 0 : 0,
        resizeAndDrag: function (el, resizeSetting, draggableSetting) {
            typeof resizeModule != "undefined"
                    && resizeModule.makeResize(el, resizeSetting.callback,
                            resizeSetting.context);
            typeof draggableModule != "undefined"
                    && draggableModule.makeDraggable(el);
        },
        changeHeightAndWidth: function (a) {
            var w = $(a).width(), h = $(a).height();
        },
        getWidgetTemplate: function (obj, mode) { // create widget template
            var str = '', styler = '', temp;

            str = '<div id="'
                    + obj.id
                    + '" class="tally_mainContainer" style="position:absolute;left: '
                    + obj.left + 'px; top: ' + obj.top + 'px; width: '
                    + obj.width + 'px; height: ' + obj.height + 'px;">';
            $.each(obj.hotSpot, function (key, val) {
                styler = '';
                if (val.className == 'increaser') {
                    styler = 'border: 2px solid green';
                }

                str += '<div title="' + val.title
                        + '" class="tally_hotSpotCan ' + val.className
                        + '" style="position:absolute;left: ' + val.left
                        + 'px; top: ' + val.top + 'px; width: ' + val.width
                        + 'px; height: ' + val.height + 'px;' + styler + '">';
                if (val.className == 'decreaser') {
                    str += '<div id="tickMain"  class="tickContainer"></div>';
                }
                str += '</div>';
            });
            str += '</div>';

            return str;
        },
        applyAuthorRelatedProperty: function (el, _this) {
            uiSetting.resizeAndDrag(el, {
                callback: function () { // applying resizing and draggable to
                    // widget
                    uiSetting.changeHeightAndWidth(arguments[0].target);
                },
                context: _this
            });
        }
    }, popupManager = {
        popupInitialSetting: {
            popId: 'tallybox_pop_singleton',
            labels: ["Type", "Answer", "Left", "Top", "Height", "Width",
                "Length"],
            common: [{
                    id: "ans",
                    type: "text",
                    label: "Answer"
                }, {
                    id: "initNum",
                    type: "text",
                    label: "Initial value"
                },
                {
                    id: "maxNum",
                    type: "text",
                    label: "Maximum value"
                }, ],
            buttonList: [{
                    id: "submit",
                    html: "Submit"
                }, {
                    id: "removeElement",
                    html: "Remove"
                }, {
                    id: "closeGraphpopup",
                    html: "Close"
                }]
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
            $('#popup-overlay-tally').remove();
        },
        createPop: function () {
            getConfigurationWindow(this.popupInitialSetting, $('#'
                    + uiSetting.authorParent));
        },
        show: function (view, context) {
            this.updatePopFields(view);
            $('#popup-overlay-tally').css('display', 'block');
            $('#tally_validation_section .validation-msg').html('');
            var p = $("#" + popupManager.popupInitialSetting.popId).css(
                    "display", "block");
            p.find('#submit').off('click').on('click', {
                view: view
            }, popupManager.updateWidget);
            p.find("#removeElement").off('click').on('click', context.destroy);

        },
        updateWidget: function (e) { // update data model on popup submit 
            var hash = '#';
            var val, answer = {};
            var m = e.data.view.model, pis = popupManager.popupInitialSetting;
            var el = e.data.view.el;
            var parent = $('#' + uiSetting.authorParent);
            var p = $(hash + pis.popId);

            var s = pis.common; // applying status to common properties.

            // updating common properties
            for (var i = 0; i < s.length; i++) {
                val = p.find(hash + s[i].id).val();
                answer[s[i].id] = parseInt(val);
                //(!i) ? answer["maxNum"] = answer[s[i].id] + (10 - Math.round(answer[s[i].id] % 10)) : answer["minNum"] = answer[s[i].id];

            }
            answer["minNum"] = answer["initNum"];
            // check for validation
            var checkResult = checkValidation(answer);

            if (checkResult.isValid) { //if valid

                $('#tally_validation_section .validation-msg').html('');
                answer.tickCount = answer.maxNum;

                m.set("answer", answer); // set data model with new values

                popupManager.hide(); // hide popup manager
            } else {
                $('#tally_validation_section .validation-msg').html(checkResult.msg);
            }

        },
        updatePopFields: function (view) { // update values in popup input fields
            var hash = '#', answer, m = view.model, pis = popupManager.popupInitialSetting, p = $(hash
                    + pis.popId), s = pis.common;

            // updating common properties
            answer = m.get("answer");
            for (var i = 0; i < s.length; i++) {

                p.find(hash + s[i].id).val(answer[s[i].id]);
            }
        },
        hide: function () { //hide popup
            $('#popup-overlay-tally').css('display', 'none');
            $("#" + popupManager.popupInitialSetting.popId).css("display",
                    "none");
        }
    };

    // make popup window template
    function getConfigurationWindow(setting, parent) {
        if (typeof $('#' + setting.popId)[0] !== "undefined") {
            return false;
        }

        // make select box template
        function makeSelect(o) {
            var list = o.options.split(uiSetting.seperator), a = '<select id="'
                    + o.id + '" attr="' + o.attr + '" class="' + o.Class + '">';
            for (var k = 0; k < list.length; k++) {
                a = a + '<option value="' + list[k] + '">' + list[k]
                        + '</option>';
            }
            return a + '</select>';
        }

        var inputType = _.union(setting.boxType || [], setting.common || [],
                setting.optionType || []), buttonList = setting.buttonList
                || [], a = '<div class="popup-overlay" id="popup-overlay-tally"></div><div id="'
                + setting.popId + '" class="popup_container"><div id="tally_validation_section"><span class="validation-msg"></span></div>';

        // process all popup input elements and make popup template
        for (var i = 0; i < inputType.length; i++) {
            a = a + '<div class="pop-row">';
            a = a + '<label class="' + inputType[i].Class + '">'
                    + inputType[i].label + '</label>';
            if (inputType[i].type == "select") {
                a = a + makeSelect(inputType[i]);
            } else if (inputType[i].type == "text") {
                a = a + '<input type="' + inputType[i].type + '"id="'
                        + inputType[i].id + '" class="' + inputType[i].Class
                        + '">'
            }
            a = a + '</div>';
        }

        // process all button elements for popup
        for (var x = 0; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="'
                    + buttonList[x].id + '">' + buttonList[x].html
                    + '</button>';
        }
        $(parent).append(a + '</div>');

        $('#' + setting.popId).find('#closeGraphpopup').on("click",
                popupManager.hide.bind(popupManager));
        $('#' + setting.popId).find('#ans, #initNum, #maxNum').on("keypress", function (e) {
            var AllowableCharacters = '1234567890';
            var k = document.all ? parseInt(e.keyCode, 10) : parseInt(e.which, 10);
            if (k !== 13 && k !== 8 && k !== 0) {
                if ((e.ctrlKey == false) && (e.altKey == false)) {
                    return (AllowableCharacters.indexOf(String.fromCharCode(k)) !== -1);
                } else {
                    return true;
                }
            }
        });
        return true;
    }

    function tallyMarks(options) {
        /* defining all variable at once */
        var _this = this, cSetting = {}, authParent, tView, el, increaser, decreaser, tickContainer;
        /* Default setting of widget */
        function init() {
            var hash = '#';
            cSetting = $.extend({}, defaultSetting, options); // current
            // setting based
            // on options
            // provided in
            // instance
            // making.
            cSetting.id = cSetting.id || ('TM_' + Date.now());
            if (Role === "author") {
                cSetting.answer.tickCount = cSetting.answer.maxNum;
            } else {
                cSetting.answer.tickCount = cSetting.answer.initNum;
            }
            authParent = $(hash + uiSetting.authorParent);
            if (typeof authParent[0] === "undefined") {
                throw "Parent Element is Undefined";
            }
            // _this.active = true;
            // _this.deleted = false;
            authParent.append(uiSetting.getWidgetTemplate(cSetting, Role));// appending
            // widget
            // html
            // template
            el = authParent.find(hash + cSetting.id);
            increaser = el.find(".increaser");
            decreaser = el.find(".decreaser");
            tickContainer = el.find("#tickMain");

            tView = new view({
                model: new model(cSetting),
                el: el,
                tickContainer: tickContainer
            });

            var answers = tView.model.get("answer"); // get model answer object

            if (Role === "author") { // if author
                uiSetting.applyAuthorRelatedProperty(tView.el, _this);
                uiSetting.applyAuthorRelatedProperty(increaser, _this);
                uiSetting.applyAuthorRelatedProperty(decreaser, _this);
                popupManager.updateStatus('+');
                tView.el.bind('dblclick', {
                    view: tView,
                    context: _this
                }, function (e) {
                    e.data.view.updateModel();
                    popupManager.show(e.data.view, e.data.context);
                });
//				createDummyMarks(answers.maxNum, tickContainer);
            } else {  // if reader
                tView.el.css({
                    "border": "1px solid transparent"
                }); // remove border
                decreaser.css({
                    "border": "2px solid transparent",
                    "cursor": "pointer"
                }); // remove border
                increaser.css({
                    "border": "2px solid transparent",
                    "cursor": "pointer"
                }); // remove border

                increaser.off("click", hsClicked).on("click", {
                    view: tView,
                    tick: tickContainer
                }, hsClicked); // bind click event on increaser
                decreaser.off("click", hsClicked).on("click", {
                    view: tView,
                    tick: tickContainer
                }, hsClicked); // bind click event on decreaser
            }

        }
        init();
        /*
         * Api implementations for widget are here
         */
        /* this will remove the widget from the screen */
        this.destroy = function () {
            if (!tView.deleted) {
                tView.deleted = true;
                tView.destroy();
                popupManager.updateStatus('-');
            }
        };
        /* This will reset the widget to its initial settings */
        this.reset = function () {
            if (!tView.deleted && tView.active) {
                tView.reset();
            }
        };
        /* This will set the property */
        this.setProperty = function (x) {
            if (!tView.deleted) {
                tView.model.set(x);
            }
            return undefined;
        };
        /* This will get the property as per the value provided in the options */
        this.getProperty = function (x) {
            if (!tView.deleted) {
                return tView.model.get(x);
            }
            return undefined;
        };
        /* It will validate the widget against the user inputs */
        this.validate = function (type) {
            if (!tView.deleted) {
                var result = tView.checkAnswer();
                if (type === "specific") {
                    tView.deactivate();
                    tView.revealAnswer();
                    return result && tView.correctVisual();
                } else {
                    return result ? tView.correctVisual() : tView.wrongVisual();
                }

                return result;

            }
            return undefined;
        };
        /* It will give the all data associated with the widget */
        this.getWidgetData = function () {
            if (!tView.deleted) {
                tView.updateModel();
                return tView.model.toJSON();
            }
            return undefined;
        };
        /* This will bring all the user input as each level of feedback */
        this.getUserAnswer = function () {
            if (!tView.deleted) {
                return tView.model.get("answer");
            }
            return undefined;
        };

        /*This will set the user answer*/
        this.setUserAnswer = function (val) {
            if (!tView.deleted) {
                tView.model.set('answer', val);
                tView.changeAnswer();
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

        // This will return the widget type
        this.getWidgetType = function () {
            return cSetting.widgetType;
        };

        // This will deactivate the component. Component will not work
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

    tallyMarks.prototype.toString = function () {
        return "This is text box widget type";
    };
    return tallyMarks;
})(window, jQuery, Backbone, _);