/*Dependency files
 * css-matchTheLine.css
 * js-jQuery v2.03, underscore v1.6, backbone v1.0, jQueryUI v1.8, ResizeModule.js, DraggableModule.js,Utility.js
 * html-
 * */
var matchTheLine = (function (o, $, Backbone, _) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }

    var isAuthor = Role === "author";

    var minimum = {height: 25, width: 25}; //minimum height and widget of hotspot that needs to be preserve

    var widgetLimit = 40, defaultSetting = {
        widgetType: "matchTheLine",
        width: 500,
        height: 300,
        lineColor: "#000",
        lineWidth: "2",
        lockedLineWidth: "4",
        sourceHotSpot: {},
        targetHotSpot: {},
        matchedLines: {},
        readerLines: {},
        lockedLines: {},
        left: 100,
        top: 100,
        hsId: 0,
    },
            hotSpot = {
                hsId: '',
                top: 5,
                width: 50,
                height: 50
            },
    targetHotSpotLeft = 250,
            sourceHotSpotLeft = 25,
            transParentLineWidth = 20,
            lineAlreadyClicked = false,
            lineAlreadyClickedTimeout;


    // Create line between source and target
    var createMatchedLine = function (source, target, lineColor, lineWidth, lineId, parentEle) {

        var x1 = source.left + (source.width / 2);
        var y1 = source.top + (source.height / 2);

        var x2 = target.left + (target.width / 2);
        var y2 = target.top + (target.height / 2);

        var l = document.createElementNS("http://www.w3.org/2000/svg", "line");

        l.setAttribute('x1', x1);// x1
        l.setAttribute('y1', y1);// y1
        l.setAttribute('x2', x2);// x2
        l.setAttribute('y2', y2);// y2
        l.setAttribute('id', lineId);
        l.style.stroke = lineColor;
        l.style.strokeWidth = lineWidth;

        parentEle.append(l); // append line element

        // New transparent line element
        var l2 = document.createElementNS("http://www.w3.org/2000/svg", "line");

        l2.setAttribute('class', 'line-ref');// x1
        l2.setAttribute('x1', x1);// x1
        l2.setAttribute('y1', y1);// y1
        l2.setAttribute('x2', x2);// x2
        l2.setAttribute('y2', y2);// y2
        l2.setAttribute('id', lineId + '_ref'); // change line id for reference
        l2.style.stroke = lineColor;
        l2.style.strokeWidth = transParentLineWidth;
        l2.style.strokeOpacity = 0;
        l2.style.cursor = 'pointer';

        parentEle.append(l2); // Append transparent line on same path for better selection
    };

    // function to create hotspot
    var createHotSpot = function (key, val) {
        var str = '<div id="hsId' + val.hsId + '" class="matchLine_hotSpotCan ' + val.className
                + '" style="position:absolute;left: ' + val.left + 'px; top: '
                + val.top + 'px; width: ' + val.width + 'px; height: '
                + val.height + 'px;"></div>';

        return str;
    };

    // function to get hotspot click event
    var hsClicked = function (e) {

        var ele = e.currentTarget, view, el, m, markLine, popup, matchedLines, sourceHotspots,
                activeSource, sourceEle, targetEle, sourceData = {}, targetData = {}, lineId, targetList, sourceList;

        view = e.data.view; // view
        el = view.el;   // main container element
        m = view.model; // model

        markLine = m.get("markLine"); // markline flag for creating lines

        popup = $("#" + popupManager.popupInitialSetting.popId);  // popup id

        if (markLine) { // if flag set for create line

            if (isAuthor) {
                matchedLines = m.get("matchedLines"); // get matched line object
            } else {
                matchedLines = m.get("readerLines"); // get matched line object
            }

            sourceHotspots = el.children('.source'); // get all source hot spots

            activeSource = el.children('.matchLine_hotSpotCan.active'); // get active source if any

            el.find('.matchLine_hotSpotCan').removeClass('active'); // remove active class from all hot spots
            if (!isAuthor) {
                el.find('.matchLine_hotSpotCan').css({
                    "border": "none"
                });
            }

            if (activeSource.length == 0) {
                $(ele).addClass('active'); // add active class to element
                if (!isAuthor) {
                    $(ele).css({
                        "border": "2px solid black"
                    });
                }
            } else if (($(ele).hasClass("source") && activeSource.hasClass("source")) || ($(ele).hasClass("target") && activeSource.hasClass("target"))) { // if click event is source hotSpot

                $(ele).addClass('active'); // add active class to element
                if (!isAuthor) {
                    $(ele).css({
                        "border": "2px solid black"
                    });
                }

            } else {

                if (activeSource.length > 0) { // if source hot spot is selected
                    if (activeSource.hasClass("source")) {
                        sourceEle = activeSource; // get the selected target hot spot
                        targetEle = $(ele);       // clicked target hot spot
                    } else {
                        sourceEle = $(ele);       // clicked source hot spot
                        targetEle = activeSource; // get the selected target hot spot
                    }


                    // create source object
                    sourceData.hsId = sourceEle.attr("id");
                    sourceData.left = parseInt(sourceEle.css("left"));
                    sourceData.top = parseInt(sourceEle.css("top"));
                    sourceData.width = parseInt(sourceEle.css("width"));
                    sourceData.height = parseInt(sourceEle.css("height"));

                    // create target object
                    targetData.hsId = targetEle.attr("id");
                    targetData.left = parseInt(targetEle.css("left"));
                    targetData.top = parseInt(targetEle.css("top"));
                    targetData.width = parseInt(targetEle.css("width"));
                    targetData.height = parseInt(targetEle.css("height"));

                    // line id based on source and target id
                    lineId = sourceData.hsId + '_' + targetData.hsId;

                    // if line id is not there already
                    if (!matchedLines[lineId]) {

                        // create new match line
                        createMatchedLine(sourceData, targetData, view.model.get("lineColor"), view.model.get("lineWidth"), lineId, view.el.find('svg'));

                        // add new line reference in matched lines object
                        matchedLines[lineId] = {'source': sourceData.hsId, 'target': targetData.hsId};
                    }
                }
            }

        } else {

            // remove active class from all hotspots
            el.find('.matchLine_hotSpotCan').removeClass('active');
            $(ele).addClass('active'); // add active class to clicked hotspot
            popup.find("#deleteHs").show(); // show deletehotspot button in popup
            popup.find("#widthSpot").parent().show();
            popup.find("#heightSpot").parent().show();
            popup.find("#leftSpot").parent().show();
            popup.find("#topSpot").parent().show();
            popup.find("#widthSpot").val(parseInt($(ele).css('width'), 10));
            popup.find("#heightSpot").val(parseInt($(ele).css('height'), 10));
            popup.find("#leftSpot").val(parseInt($(ele).css('left'), 10));
            popup.find("#topSpot").val(parseInt($(ele).css('top'), 10));
        }
    };

    // function to delete line on click
    var lineClicked = function (e) {
        var ele = e.currentTarget, view, el, m, matchedLines, lockedLines, lineIDref, lineID, deleteLine;
        view = e.data.view; // view
        el = view.el; // parent container
        m = view.model; // model

        if (lineAlreadyClicked)
        { // double click code
            lineAlreadyClicked = false; // reset
            clearTimeout(lineAlreadyClickedTimeout); // prevent this from happening
            if (isAuthor) {
                lockedLines = m.get("lockedLines");


                lineIDref = $(ele).attr("id");
                lineID = lineIDref.replace("_ref", "");

                if (lockedLines[lineID]) {
                    el.find("#" + lineID).css('stroke-width', m.get("lineWidth"));
                    delete lockedLines[lineID];
                }
                else {
                    el.find("#" + lineID).css('stroke-width', m.get("lockedLineWidth"));
                    var lineData = lineID.split("_");
                    lockedLines[lineID] = {'source': lineData[0], 'target': lineData[1]};
                }
            }
        }
        else
        {
            lineAlreadyClicked = true;
            lineAlreadyClickedTimeout = setTimeout(function () { // single click code

                lineAlreadyClicked = false; // reset when it happens

                deleteLine = true;


                lineIDref = $(ele).attr("id");
                lineID = lineIDref.replace("_ref", "");
                lockedLines = m.get("lockedLines");
                if (isAuthor) {
                    matchedLines = m.get("matchedLines");

                    if (lockedLines[lineID]) {
                        delete lockedLines[lineID];
                    }
                } else {
                    matchedLines = m.get("readerLines");
                    if (lockedLines[lineID]) {
                        deleteLine = false;
                    }
                }
                if (deleteLine) {
                    $(ele).remove();
                    el.find("#" + lineID).remove();
                    delete matchedLines[lineID];
                }
            }, 300); // <-- dblclick tolerance here
        }
        return false;

    };

    // function to lock/unlock line on double click
    var lockUnclockLine = function (e) {
        if (lineAlreadyClicked)
        {
            lineAlreadyClicked = false; // reset
            clearTimeout(lineAlreadyClickedTimeout); // prevent this from happening
            console.log('double');
        }
        else
        {
            lineAlreadyClicked = true;
            lineAlreadyClickedTimeout = setTimeout(function () {
                lineAlreadyClicked = false; // reset when it happens
                console.log('single');
                // do what needs to happen on single click. 
                // use el instead of $(this) because $(this) is 
                // no longer the element
            }, 300); // <-- dblclick tolerance here
        }
        return false;
        var ele = e.currentTarget, view, el, m, lockedLines, lineIDref, lineID;

        view = e.data.view; // view
        el = view.el; // parent container
        m = view.model; // model
        lockedLines = m.get("lockedLines");


        lineIDref = $(ele).attr("id");
        lineID = lineIDref.replace("_ref", "");

        if (lockedLines[lineID]) {
            el.find("#" + lineID).css('stroke-width', m.get("lineWidth"));
            delete lockedLines[lineID];
        }
        else {
            el.find("#" + lineID).css('stroke-width', m.get("lockedLineWidth"));
            lockedLines.push(lineID);
        }
    };

    // function to check validation for popup
    var checkValidation = function (data) {
        var isValid = true, msg = '';
        return {
            isValid: isValid,
            msg: msg
        }; // return result and message for error
    };

    var model = Backbone.Model.extend({
        "default": {},
        initialize: function (options) {
            this.initObject = $.extend({}, options);
            this['default'] = options;
        },
        reset: function () {
            this.set("readerLines", $.extend({}, this.get("lockedLines"))); // empty readerLine object, which contain reference of lines created in reader
        },
        check: function (val) {

            var corrAns = this.get("matchedLines"), userAns = this.get("readerLines");
            if (_.isEqual(corrAns, userAns)) {
                return true;
            }
            return false;
        }
    });

    var view = Backbone.View.extend({
        initialize: function (options) {
            var o = this;
            o.el = options.el;
            o.active = true;
            o.deleted = false;
            o.model = options.model;
            o.model.on("change:lineColor", o.changeLineColor.bind(o));
        },
        destroy: function () {
            delete this.model;
            this.el.remove();
        },
        changeLineColor: function () {
            var a = this.el, matchedLines = this.model.get("matchedLines"), lineEl, lineColor = this.model.get("lineColor");
            $.each(matchedLines, function (key, val) {
                lineEl = a.find("#" + key);
                lineEl.css("stroke", lineColor);
            });
        },
        updateModel: function () {
            var a = this.el, b, className = 'increaser',
                    hotSpot = [], sourceHotspots = {}, targetHotspots = {}, val, hsId;

            a.find(".matchLine_hotSpotCan").each(function () {
                b = $(this);
                val = {};
                hsId = b.attr('id');

                val.hsId = parseInt(hsId.replace("hsId", ""), 10);

                val.left = parseInt(b.css('left'), 10);
                val.top = parseInt(b.css('top'), 10);
                val.width = b.width();
                val.height = b.height();

                if ($(this).hasClass('source')) {
                    val.className = 'source';
                    sourceHotspots["hsId" + val.hsId] = val;
                }
                else {
                    val.className = 'target';
                    targetHotspots["hsId" + val.hsId] = val;
                }

            });
            this.model.set({
                left: parseInt(a.css('left'), 10),
                top: parseInt(a.css('top'), 10),
                height: a.height(),
                width: a.width(),
                sourceHotSpot: sourceHotspots,
                targetHotSpot: targetHotspots
            }, {
                silent: true
            });
        },
        checkAnswer: function () {
            return this.model.check(this.model.get("readerLines"));
        },
        reset: function () {
            var a = this.el;
            this.model.reset(); // reset model
            a.find('svg').empty(); // remove all lines
            this.createLockedLines();

        },
        createLockedLines: function () {
            var view = this, a = view.el, readerLines, sourceHotSpot, targetHotSpot;
            readerLines = view.model.get("readerLines");
            sourceHotSpot = view.model.get("sourceHotSpot");
            targetHotSpot = view.model.get("targetHotSpot");
            $.each(readerLines, function (key, val) {
                createMatchedLine(sourceHotSpot[val.source],
                        targetHotSpot[val.target], view.model.get("lineColor"), view.model.get("lineWidth"), key, a.find('svg'));
            });

        },
        revealAnswer: function () {
            var view = this, a = view.el, matchedLines, sourceHotSpot, targetHotSpot;
            matchedLines = view.model.get("matchedLines");
            sourceHotSpot = view.model.get("sourceHotSpot");
            targetHotSpot = view.model.get("targetHotSpot");
            $.each(matchedLines, function (key, val) {
                createMatchedLine(sourceHotSpot[val.source],
                        targetHotSpot[val.target], view.model.get("lineColor"), view.model.get("lineWidth"), key, a.find('svg'));
            });
        },
        deactivate: function () {
            this.active = false;
        },
        activate: function () {
            this.active = true;
        }
    });

    var colorSettingLine = {
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
            $(el).find('#lineColor').spectrum({
                allowEmpty: true,
                //   color: "#f00",
                // showInitial: true,
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
            el.find('#lineColor').toggle();
        },
        hide: function (el) {
            el.find('#lineColor').toggle();
        },
        getColor: function (el) {
            var spectrum = $(el).find('#lineColor').spectrum("get");
            if (!spectrum.alpha) {
                return spectrum.toName();
            } else {
                return spectrum.toHexString();
            }
            //  return $(el).find('#lineColor').spectrum("get").toName();
        },
        setColor: function (el, color) {
            $(el).find('#lineColor').spectrum("set", color);
        }
    };

    var uiSetting = {
        seperator: "|",
        authorParent: "author_content_container",
        resizeAndDrag: function (el, resizeSetting, draggableSetting) {
            typeof resizeModule != "undefined"
                    && resizeModule.makeResize(el, resizeSetting.callback, resizeSetting.callback, resizeSetting.callback,
                            resizeSetting.context);
            typeof draggableModule != "undefined"
                    && draggableModule.makeDraggable(el, draggableSetting.callback, draggableSetting.callback, draggableSetting.callback,
                            draggableSetting.context);
        },
        changeHeightAndWidth: function (a, view) { // callback function on resize and drag to change line and svg properties
            var hsData = {}, m = view.model, targetHotSpot = m.get("targetHotSpot"),
                    sourceHotSpot = m.get("sourceHotSpot"),
                    matchedLines = m.get("matchedLines"),
                    el = view.el;

            function changeLineEnd(a) {
                var hsType = "", svgCont, x, y, l, l2;

                if (a.hasClass("source")) {
                    hsType = "source";
                }
                else if (a.hasClass("target")) {
                    hsType = "target";
                }
                else if (a.hasClass("matchLine_mainContainer")) {
                    hsType = "mainContainer";
                }
                hsData.hsId = a.attr("id");
                hsData.left = parseInt(a.css("left"), 10);
                hsData.top = parseInt(a.css("top"), 10);
                hsData.width = parseInt(a.css("width"), 10);
                hsData.height = parseInt(a.css("height"), 10);

                if (hsType === "mainContainer") {
                    svgCont = el.find(".svgLineContainer")[0];
                    svgCont.setAttribute('width', hsData.width);
                    svgCont.setAttribute('height', hsData.height);
                } else {

                    $.each(matchedLines, function (key, val) {
                        if (val[hsType] === hsData.hsId) {
                            x = hsData.left + (hsData.width / 2);
                            y = hsData.top + (hsData.height / 2);
                            l = el.find("#" + key)[0];
                            l2 = el.find("#" + key + '_ref')[0];

                            if (hsType === "source") {
                                l.setAttribute('x1', x);// x1
                                l.setAttribute('y1', y);// y1
                                l2.setAttribute('x1', x);// x1
                                l2.setAttribute('y1', y);// y1
                            }
                            else if (hsType === "target") {
                                l.setAttribute('x2', x);// x1
                                l.setAttribute('y2', y);// y1
                                l2.setAttribute('x2', x);// x1
                                l2.setAttribute('y2', y);// y1
                            }
                        }
                    });
                    if (hsType === "source") {
                        sourceHotSpot[hsData.hsId] = hsData;
                    }
                    else if (hsType === "target") {
                        targetHotSpot[hsData.hsId] = hsData;
                    }
                }
            }
            changeLineEnd($(a));

        },
        getWidgetTemplate: function (obj, mode) { // create widget template
            var str = '', styler = '', temp;

            str = '<div id="'
                    + obj.id
                    + '" class="matchLine_mainContainer" style="position:absolute;left: '
                    + obj.left + 'px; top: ' + obj.top + 'px; width: '
                    + obj.width + 'px; height: ' + obj.height + 'px;">';
            $.each(obj.sourceHotSpot, function (key, val) {
                str += createHotSpot(key, val);

            });

            $.each(obj.targetHotSpot, function (key, val) {
                str += createHotSpot(key, val);
            });
            str += '<div class="lineContainer"><svg class="svgLineContainer"  width="'
                    + obj.width + 'px" height="' + obj.height + 'px"></svg></div>';
            str += '</div>';

            return str;
        },
        applyAuthorRelatedProperty: function (el, _this, view) {
            uiSetting.resizeAndDrag(el, {
                callback: function () { // applying resizing and draggable to
                    // widget
                    uiSetting.changeHeightAndWidth(arguments[0].target, view);
                },
                context: _this
            }, {
                callback: function () { // applying resizing and draggable to
                    // widget
                    uiSetting.changeHeightAndWidth(arguments[0].target, view);
                },
                context: _this
            });
        }
    }, popupManager = {
        popupInitialSetting: {
            popId: 'matchLine_pop_singleton',
            common: [{
                    id: "lineColor",
                    type: "text",
                    label: "Line color",
                    check: false   //set true if you want to save value for this field in popup
                },
                {
                    id: "widthSpot",
                    type: "text",
                    label: "Width",
                    check: false   //set true if you want to save value for this field in popup
                },
                {
                    id: "heightSpot",
                    type: "text",
                    label: "Height",
                    check: false   //set true if you want to save value for this field in popup
                },
                {
                    id: "leftSpot",
                    type: "text",
                    label: "Left",
                    check: false   //set true if you want to save value for this field in popup
                },
                {
                    id: "topSpot",
                    type: "text",
                    label: "Top",
                    check: false   //set true if you want to save value for this field in popup
                }],
            buttonList: [{
                    id: "createSource",
                    html: "Add source hotspot"
                }, {
                    id: "createTarget",
                    html: "Add target hotspot"
                }, {
                    id: "configAnswer",
                    html: "Add answer"
                }, {
                    id: "applyAnswer",
                    html: "Save answer"
                }, {
                    id: "deleteHs",
                    html: "Remove hotspot"
                }, {
                    id: "clearAll",
                    html: "Clear All"
                }, {
                    id: "removeElement",
                    html: "Remove"
                }, {
                    id: "closePopup",
                    html: "Close"
                }, {
                    id: "submit",
                    html: "Submit"
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
        },
        createPop: function () {
            getConfigurationWindow(this.popupInitialSetting, $('#' + uiSetting.authorParent));
        },
        show: function (view, context) {

            this.updatePopFields(view);
            $('#matchLine_validation_section .validation-msg').html('');


            var p = $("#" + popupManager.popupInitialSetting.popId).css("display", "block"), m = view.model;

            typeof draggableModule != "undefined" && draggableModule.makeDraggable(p); // make popup draggable

            p.find("#configAnswer").show();
            p.find("#applyAnswer").hide();
            p.find("#deleteHs").hide();
            p.find("#widthSpot").parent().hide();
            p.find("#heightSpot").parent().hide();
            p.find("#leftSpot").parent().hide();
            p.find("#topSpot").parent().hide();

            m.set("markLine", false); // set mark line flag as false

            // bind event for submit button
            p.find('#submit').off('click').on('click', {
                view: view
            }, popupManager.updateWidget);

            // bind event for createSource button
            p.find('#createSource').off('click').on('click', {
                view: view
            }, popupManager.createSource);

            // bind event for configAnswer button
            p.find('#configAnswer').off('click').on('click', {
                view: view
            }, popupManager.configAnswer);

            // bind event for applyAnswer button
            p.find('#applyAnswer').off('click').on('click', {
                view: view
            }, popupManager.applyAnswer);

            // bind event for createTarget button
            p.find('#createTarget').off('click').on('click', {
                view: view
            }, popupManager.createTarget);

            // bind event for clearAll button
            p.find('#clearAll').off('click').on('click', {
                view: view
            }, popupManager.clearAll);

            // bind event for delete Hot spot button
            p.find('#deleteHs').off('click').on('click', {
                view: view
            }, popupManager.deleteHs);

            // bind event for remove button
            p.find("#removeElement").off('click').on('click', context.destroy);

            // bind blur event for width of hot spot
            p.find('#widthSpot').off('blur').on('blur', {
                view: view
            }, popupManager.widthHs);

            // bind blur event for height of hot spot
            p.find('#heightSpot').off('blur').on('blur', {
                view: view
            }, popupManager.heightHs);

            // bind blur event for left of hot spot
            p.find('#leftSpot').off('blur').on('blur', {
                view: view
            }, popupManager.leftHs);

            // bind blur event for top of hot spot
            p.find('#topSpot').off('blur').on('blur', {
                view: view
            }, popupManager.topHs);

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
                if (s[i].check) {
                    val = p.find(hash + s[i].id).val();
                    answer[s[i].id] = val;
                }
            }
            // check for validation
            var checkResult = checkValidation(answer);

            if (checkResult.isValid) { // if valid

                $('#matchLine_validation_section .validation-msg').html('');
                m.set(answer); // set data model with new values
                m.set("lineColor", colorSettingLine.getColor(p));
                m.set("markLine", false);

                popupManager.hide(); // hide popup manager
            } else {
                $('#matchLine_validation_section .validation-msg').html(
                        checkResult.msg);
            }

        },
        createSource: function (view) { // update values in popup input fields
            var el = view.data.view.el, val, sourceHotspots, m, hsId, hotspothtml;

            m = view.data.view.model;
            sourceHotspots = m.get("sourceHotSpot");
            hsId = m.get("hsId");
            val = hotSpot;
            val.hsId = hsId;
            val.className = 'source';
            val.left = sourceHotSpotLeft;
            sourceHotspots["hsId" + val.hsId] = val;
            hotspothtml = createHotSpot(hsId, val);
            el.append(hotspothtml);
            el.find("#hsId" + val.hsId).off("click").on("click", {
                view: view.data.view
            }, hsClicked); // bind click event on source
            hsId++;
            m.set("hsId", hsId);
            uiSetting.applyAuthorRelatedProperty(el.find("#hsId" + val.hsId), this, view.data.view);
        },
        createTarget: function (view) { // create target hotspot
            var el = view.data.view.el, val, targetHotSpots, m, hsId, hotspothtml;
            m = view.data.view.model;

            targetHotSpots = m.get("targetHotSpot");  // target hot spots 

            hsId = m.get("hsId"); // hot spot counter

            val = hotSpot; // default hotspot object
            val.hsId = hsId;
            val.className = 'target'; // target class name for target object
            val.left = targetHotSpotLeft;
            targetHotSpots["hsId" + val.hsId] = val;
            hotspothtml = createHotSpot(hsId, val);
            el.append(hotspothtml);
            el.find("#hsId" + val.hsId).off("click").on("click", {
                view: view.data.view
            }, hsClicked); // bind click event on source
            hsId++;
            m.set("hsId", hsId);
            uiSetting.applyAuthorRelatedProperty(el.find("#hsId" + val.hsId), this, view.data.view);
        },
        configAnswer: function (e) { // set flag to draw lines
            var hash = '#',
                    pis = popupManager.popupInitialSetting,
                    p = $(hash + pis.popId),
                    el = e.data.view.el,
                    m = e.data.view.model;
            m.set("markLine", true);
            el.find('.matchLine_hotSpotCan').removeClass('active'); // remove active class from all hot spots
            p.find(hash + "configAnswer").hide();
            p.find(hash + "applyAnswer").show();
            p.find("#deleteHs").hide();
        },
        clearAll: function (e) { // clear all the lines
            var el = e.data.view.el, m;
            el.find('svg').html('');
            m = e.data.view.model;
            m.set("matchedLines", {});
        },
        deleteHs: function (e) { // delete hot spot
            var hash = '#', allHotSpot, hsData = {}, el, pis, p, activeSpot, m, matchedLines, lockedLines, hsType = "";
            el = e.data.view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);

            activeSpot = el.find('.matchLine_hotSpotCan.active'); // get selected hot spot

            m = e.data.view.model; // get model

            matchedLines = m.get("matchedLines"); // get matched lines object

            lockedLines = m.get("lockedLines");


            hsType = "";
            if (activeSpot.hasClass("source")) { // if selected hot spot is source
                hsType = "source";
            }
            else if (activeSpot.hasClass("target")) { // if target
                hsType = "target";
            }

            hsData.hsId = activeSpot.attr("id");

            $.each(matchedLines, function (key, val) { // delete respected lines
                if (val[hsType] === hsData.hsId) {
                    el.find("#" + key).remove();
                    delete matchedLines[key]; // delete reference of matched lines reference

                    if (lockedLines[key]) {
                        delete lockedLines[key];
                    }
                }
            });
            if (hsType === "source") {
                allHotSpot = m.get("sourceHotSpot");
            }
            else if (hsType === "target") {
                allHotSpot = m.get("targetHotSpot");
            }
            delete allHotSpot[hsData.hsId]; // delete reference of hot spot from hot spot object

            activeSpot.remove(); // remove hot spot
            p.find("#deleteHs").hide(); // hide delete hotspot button
        },
        widthHs: function (e) { // update width of selected hotspot
            var hash = '#', el, pis, p, activeSpot, val, parent, adjustedVal;
            el = e.data.view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);

            activeSpot = el.find('.matchLine_hotSpotCan.active'); // get selected hot spot
            parent = activeSpot.parent();
            val = p.find("#widthSpot").val();
            adjustedVal = app.limitWidth(activeSpot, parent, val, minimum.width);
            p.find("#widthSpot").val(adjustedVal);
            activeSpot.css('width', adjustedVal + "px");
        },
        heightHs: function (e) { // update height of selected hotspot
            var hash = '#', el, pis, p, activeSpot, val, parent, adjustedVal;
            el = e.data.view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);

            activeSpot = el.find('.matchLine_hotSpotCan.active'); // get selected hot spot
            parent = activeSpot.parent();
            val = p.find("#heightSpot").val();
            adjustedVal = app.limitHeight(activeSpot, parent, val, minimum.height);
            p.find("#heightSpot").val(adjustedVal);
            activeSpot.css('height', adjustedVal + "px");
        },
        leftHs: function (e) { // update left of selected hotspot
            var hash = '#', el, pis, p, activeSpot, val, parent, adjustedVal;
            el = e.data.view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);

            activeSpot = el.find('.matchLine_hotSpotCan.active'); // get selected hot spot
            parent = activeSpot.parent();
            val = p.find("#leftSpot").val();
            adjustedVal = app.limitLeft(activeSpot, parent, val);
            p.find("#leftSpot").val(adjustedVal);
            activeSpot.css('left', adjustedVal + "px");
        },
        topHs: function (e) { // update top of selected hotspot
            var hash = '#', el, pis, p, activeSpot, val, parent, adjustedVal;
            el = e.data.view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);

            activeSpot = el.find('.matchLine_hotSpotCan.active'); // get selected hot spot
            parent = activeSpot.parent();
            val = p.find("#topSpot").val();
            adjustedVal = app.limitTop(activeSpot, parent, val);
            p.find("#topSpot").val(adjustedVal);
            activeSpot.css('top', adjustedVal + "px");
        },
        applyAnswer: function (e) { // apply matched lines between source and target and remove option to 
            var el = e.data.view.el, hash = '#',
                    pis = popupManager.popupInitialSetting, p, m;
            el.find('.matchLine_hotSpotCan').removeClass('active'); // remove active class from all hot spots
            p = $(hash + pis.popId);
            m = e.data.view.model;

            m.set("markLine", false);
            p.find(hash + "configAnswer").show();
            p.find(hash + "applyAnswer").hide();
        },
        updatePopFields: function (view) { // update values in popup inputfields

            var hash = '#', m = view.model, pis = popupManager.popupInitialSetting, p = $(hash + pis.popId), s = pis.common;

            // updating common properties
            for (var i = 0; i < s.length; i++) {
                if (s[i].check) {
                    p.find(hash + s[i].id).val(m.get(s[i].id));
                }
            }
            colorSettingLine.setColor(p, m.get('lineColor'));
        },
        hide: function () { // hide popup
            $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
        },
    };

    // make popup window template
    function getConfigurationWindow(setting, parent) {
        if (typeof $('#' + setting.popId)[0] !== "undefined") {
            return false;
        }

        var inputType = _.union(setting.boxType || [], setting.common || [],
                setting.optionType || []), popEl, buttonList = setting.buttonList
                || [], a = '<div id="' + setting.popId + '" class="popup_container"><div id="matchLine_validation_section"><span class="validation-msg"></span></div>';

        // process all popup input elements and make popup template
        for (var i = 0; i < inputType.length; i++) {
            a = a + '<div class="pop-row">';
            a = a + '<label class="' + inputType[i].Class + '">'
                    + inputType[i].label + '</label>';
            if (inputType[i].type === "text") {
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

        popEl = $('#' + setting.popId);

        popEl.find('#closePopup').on("click",
                popupManager.hide.bind(popupManager));
        colorSettingLine.createColorWindow(popEl);
        return true;
    }

    function matchTheLine(options) {
        /* defining all variable at once */
        var _this = this, cSetting = {}, authParent, tView, el, source, target, tickContainer;
        /* Default setting of widget */
        function init() {
            var hash = '#';
            cSetting = $.extend({}, defaultSetting, options); // current setting based on options provided in instance making.
            console.log(defaultSetting);
            cSetting.id = cSetting.id || ('TM_' + Date.now());

            cSetting.markLine = true;


            authParent = $(hash + uiSetting.authorParent);
            if (typeof authParent[0] === "undefined") {
                throw "Parent Element is Undefined";
            }


            authParent.append(uiSetting.getWidgetTemplate(cSetting, Role));// appending widget html template
            el = authParent.find(hash + cSetting.id);
            tView = new view({
                model: new model(cSetting),
                el: el
            });
            source = el.find(".source");
            target = el.find(".target");


            if (isAuthor) { // if author
                tView.model.set("markLine", false);
                $.each(cSetting.matchedLines, function (key, val) {
                    createMatchedLine(cSetting.sourceHotSpot[val.source],
                            cSetting.targetHotSpot[val.target], cSetting.lineColor, cSetting.lineWidth, key, el.find('svg'));
                });

                $.each(cSetting.lockedLines, function (key, val) {
                    el.find("#" + key).css('stroke-width', cSetting.lockedLineWidth);
                });

                uiSetting.applyAuthorRelatedProperty(tView.el, _this, tView);
                source.each(function (el) {
                    uiSetting.applyAuthorRelatedProperty(this, _this, tView);
                });
                target.each(function (el) {
                    uiSetting.applyAuthorRelatedProperty(this, _this, tView);
                });

                popupManager.updateStatus('+');
                tView.el.bind('dblclick', {
                    view: tView,
                    context: _this
                }, function (e) {
                    e.data.view.updateModel();
                    popupManager.show(e.data.view, e.data.context);
                });

            } else { // if reader
                tView.model.set("markLine", true);
                tView.model.set("readerLines", $.extend({}, cSetting.lockedLines));
                tView.createLockedLines();

                tView.el.css({
                    "border": "1px solid transparent"
                }); // remove border
                source.css({
                    "border": "2px solid transparent",
                    "cursor": "pointer"
                }); // remove border
                target.css({
                    "border": "2px solid transparent",
                    "cursor": "pointer"
                }); // remove border


            }
            source.off("click", hsClicked).on("click", {
                view: tView
            }, hsClicked); // bind click event on source
            target.off("click", hsClicked).on("click", {
                view: tView
            }, hsClicked); // bind click event on target

            el.find('svg').on('click', 'line.line-ref', {
                view: tView
            }, lineClicked);

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
                return tView.model.get("readerLines");
//               return tView.model.get("answer").ans;
            }
            return undefined;
        };

        /*This will set the user answer*/
        this.setUserAnswer = function (val) {
            if (!tView.deleted) {
                tView.model.set("readerLines", val);
                tView.createLockedLines();
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

    matchTheLine.prototype.toString = function () {
        return "This is text box widget type";
    };
    return matchTheLine;
})(window, jQuery, Backbone, _);