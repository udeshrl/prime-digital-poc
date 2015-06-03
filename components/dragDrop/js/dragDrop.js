/*
 Dependency files
 * css-dragDrop.css
 * js-jQuery v2.03, underscore v1.6, backbone v1.0, jQueryUI v1.8, ResizeModule.js, DraggableModule.js,Utility.js
 * html-
 * */
/*global $,Backbone,_,window,document,console,navigator,draggableModule,resizeModule,labelWidget,ImageUpload*/
var dragDrop = (function (o) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var isRoleAuthor = Role === "author",
            minimum = {
                height: 25,
                width: 20
            },
    timenow = Date.now(),
            dragObj = {
                left: 10,
                top: 10,
                height: 100,
                width: 100,
                volume: 1,
                isImageApplicable: true,
                imageInfo: {
                    height: 38,
                    id: "",
                    isResizeAllow: true,
                    left: 0,
                    src: "data:image/png;base64,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",
                    title: "Doggy",
                    top: 0,
                    widgetType: "ImageUpload",
                    width: 48
                },
                isTextApplicable: true,
                textInfo: {
                    Bold: false,
                    Italic: false,
                    Underline: false,
                    align: "center",
                    bgColor: "transparent",
                    fontSize: "14pt",
                    id: "",
                    left: 20,
                    rotateLabelText: "0",
                    text: "drag1",
                    textColor: "black",
                    top: 50,
                    widgetType: "labelWidget"
                }
            },
    transParentLineWidth = 20,
            dropObj = {
                height: 100,
                width: 100,
                left: 300,
                top: 200,
                volume: 1
            },
    // function to delete line on click

    lineClicked = function (e) {
        var ele = e.currentTarget,
                view, el, m, answer, lineIDref, lineID;
        view = e.data.view; // view
        el = view.el; // parent container
        m = view.model; // model
        lineIDref = $(ele).attr("id");
        lineID = lineIDref.replace("_ref", "");
        answer = m.get("answer");
        $(ele).remove();
        el.find("#" + lineID).remove();
        delete answer[lineID];
        return false;
    },
            // Create line between source and target
            createMatchedLine = function (source, target, lineColor, lineWidth, lineId,
                    parentEle) {

                function createLine(obj) {
                    var l = document.createElementNS("http://www.w3.org/2000/svg",
                            "line"),
                            key;
                    for (key in obj) {
                        l.setAttribute(key, obj[key]);
                    }
                    return l;
                }
                var x1 = source.left + (source.width / 2);
                var y1 = source.top + (source.height / 2);
                var x2 = target.left + (target.width / 2);
                var y2 = target.top + (target.height / 2);
                var l = createLine({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    id: lineId,
                    class: ''
                }); // append line element
                l.style.stroke = lineColor;
                l.style.strokeWidth = lineWidth;
                parentEle.append(l);
                var l2 = createLine({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    id: lineId + '_ref',
                    class: 'line-ref'
                }); // append line element
                l2.style.stroke = lineColor;
                l2.style.strokeWidth = transParentLineWidth;
                l2.style.strokeOpacity = 0;
                l2.style.cursor = 'pointer';
                parentEle.append(l2); // Append transparent line on same path for
                // better selection
            },
            dragClicked = function (e) {

                var ele = e.currentTarget,
                        view, el, m, markLine, popup, dragClass, dropClass, matchedLines, dragAreas, activeSource, sourceEle, targetEle, sourceData = {},
                        targetData = {},
                        lineId, targetList, sourceList;
                view = e.data.view; // view
                el = view.el; // main container element
                m = view.model; // model
                markLine = m.get("markLine"); // markline flag for creating lines
                dragClass = view.dragClass;
                dropClass = view.dropClass;
                popup = $("#" + popupManager.popupInitialSetting.popId); // popup id
                // remove active class from all areas
                el.find('.' + dragClass).removeClass('active');
                el.find('.' + dropClass).removeClass('active');
                $(ele).addClass('active'); // add active class to clicked area

                if (!markLine) { // if flag not set for create line
                    popup.find("#deleteDrag").show(); // show deletearea button in
                    popup.find("#deleteDrop").hide(); // hide deletearea for drop button in popup
                    popup.find("#widthArea").parent().show();
                    popup.find("#heightArea").parent().show();
                    popup.find("#leftArea").parent().show();
                    popup.find("#topArea").parent().show();
                    popup.find("#volume").parent().show();
                    popup.find("#widthArea").val(parseInt($(ele).css('width'), 10));
                    popup.find("#heightArea").val(parseInt($(ele).css('height'), 10));
                    popup.find("#leftArea").val(parseInt($(ele).css('left'), 10));
                    popup.find("#topArea").val(parseInt($(ele).css('top'), 10));
                    popup.find("#volume").val(parseFloat($(ele).data('vol'), 10));
                }
            },
            dropClicked = function (e) {
                var ele = e.currentTarget,
                        view, el, m, markLine, popup, dropClass, dragClass, answer, dragAreas, activeDrag, sourceEle, targetEle, sourceData = {},
                        targetData = {},
                        lineId, targetList, sourceList;
                view = e.data.view; // view
                el = view.el; // main container element
                m = view.model; // model
                markLine = m.get("markLine"); // markline flag for creating lines
                dropClass = view.dropClass;
                dragClass = view.dragClass;
                popup = $("#" + popupManager.popupInitialSetting.popId); // popup id

                if (markLine) { // if flag set for create line
                    answer = m.get("answer");
                    dragAreas = el.children('.' + dragClass); // get all source hot spots

                    activeDrag = el.children('.' + dragClass + '.active'); // get active source if any

                    el.find('.' + dragClass).removeClass('active'); // remove active class from all hot spots
                    el.find('.' + dropClass).removeClass('active'); // remove active class from all hot spots
                    if (activeDrag.length > 0) { // if source hot spot is selected
                        sourceEle = activeDrag; // get the selected source hot spot
                        targetEle = $(ele); // clicked target hot spot
                        // create source object
                        sourceData.id = sourceEle.attr("id");
                        sourceData.left = parseInt(sourceEle.css("left"));
                        sourceData.top = parseInt(sourceEle.css("top"));
                        sourceData.width = parseInt(sourceEle.css("width"));
                        sourceData.height = parseInt(sourceEle.css("height"));
                        // create target object
                        targetData.id = targetEle.attr("id");
                        targetData.left = parseInt(targetEle.css("left"));
                        targetData.top = parseInt(targetEle.css("top"));
                        targetData.width = parseInt(targetEle.css("width"));
                        targetData.height = parseInt(targetEle.css("height"));
                        // line id based on source and target id
                        lineId = sourceData.id + '_' + targetData.id;
                        // if line id is not there already
                        if (!answer[lineId]) {
                            // create new match line
                            createMatchedLine(sourceData, targetData, view.model
                                    .get("lineColor"), view.model.get("lineWidth"),
                                    lineId, view.el.find('svg'));
                            // add new line reference in matched lines object
                            answer[lineId] = {
                                'source': sourceData.id,
                                'target': targetData.id
                            };
                        }
                    }
                } else {
                    // remove active class from all areas
                    el.find('.' + dragClass).removeClass('active');
                    el.find('.' + dropClass).removeClass('active');
                    $(ele).addClass('active'); // add active class to clicked area
                    popup.find("#deleteDrop").show(); // show deletearea button in popup
                    popup.find("#deleteDrag").hide(); // hide deletearea for drag button in popup
                    popup.find("#widthArea").parent().show();
                    popup.find("#heightArea").parent().show();
                    popup.find("#leftArea").parent().show();
                    popup.find("#topArea").parent().show();
                    popup.find("#volume").parent().show();
                    popup.find("#widthArea").val(parseInt($(ele).css('width'), 10));
                    popup.find("#heightArea").val(parseInt($(ele).css('height'), 10));
                    popup.find("#leftArea").val(parseInt($(ele).css('left'), 10));
                    popup.find("#topArea").val(parseInt($(ele).css('top'), 10));
                    popup.find("#volume").val(parseFloat($(ele).data('vol'), 10));
                }
            },
            // function to check validation for popup
            checkValidation = function (data) {
                var isValid = true,
                        msg = '';
                return {
                    isValid: isValid,
                    msg: msg
                }; // return result and message for error
            },
            DragModel = Backbone.Model.extend({
                "default": {},
                initialize: function (options) {
                    this.initObject = options;
                    this["default"] = options;
                },
                reset: function () {
                    this.set(this.initObject);
                }
            }),
            DropModel = Backbone.Model.extend({
                "default": {},
                initialize: function (options) {
                    this.initObject = options;
                    this["default"] = options;
                },
                reset: function () {
                    this.set(this.initObject);
                }
            }),
            DragView = Backbone.View.extend({
                initialize: function (options) {
                    var o = this;
                    o.imageRepresenter = undefined;
                    o.textRepresenter = undefined;
                    o.model = options.model;
                    o.dragClass = options.dragClass;
                    o.commonClass = options.commonClass;
                    o.mainView = options.mainView;
                    o.el = $('<div></div>').attr('id', o.model.get('id')).css({
                        height: o.model.get("height"),
                        width: o.model.get("width"),
                        top: o.model.get("top"),
                        left: o.model.get("left"),
                        position: 'absolute',
                        border: '1px solid blue'
                    }).data('vol', o.model.get("volume")).addClass(o.dragClass + " " + o.commonClass);
                    options.parent.append(o.el);
                    o.model.on({
                        "change:width": o.width.bind(o),
                        "change:height": o.height.bind(o),
                        "change:left": o.left.bind(o),
                        "change:top": o.top.bind(o),
                        "change:textInfo": o.textInfo.bind(o),
                        "change:imageInfo": o.imageInfo.bind(o)
                    });
                    if (isRoleAuthor) {
                        uiSetting.applyAuthorRelatedProperty(o.el, o, o.mainView);
                    }
                    if (o.model.get("imageInfo")) {
                        if (!$.isEmptyObject(o.model.get("imageInfo"))) {
                            o.imageRepresenter = new ImageUpload(o.model.get("imageInfo"), o.el, $('body'));
                        }
                    }
                    if (o.model.get("textInfo")) {
                        if (!$.isEmptyObject(o.model.get("textInfo"))) {
                            o.textRepresenter = new labelWidget(o.model.get("textInfo"), o.el, $('body'));
                        }
                    }
                },
                textInfo: function () {
                },
                imageInfo: function () {
                },
                width: function () {
                    this.el.width(parseInt(this.model.get("width"), 10));
                },
                height: function () {
                    this.el.height(parseInt(this.model.get("height"), 10));
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
                    var a = this.el, imageInfo = {}, textInfo = {};
                    if (this.imageRepresenter) {
                        imageInfo = this.imageRepresenter.getWidgetData();
                    }
                    if (this.textRepresenter) {
                        textInfo = this.textRepresenter.getWidgetData();
                    }
                    this.model.set({
                        left: parseInt(a.css('left'), 10),
                        top: parseInt(a.css('top'), 10),
                        height: a.height(),
                        width: a.width(),
                        volume: parseFloat(a.data('vol'), 10),
                        imageInfo: imageInfo,
                        textInfo: textInfo
                    }, {
                        silent: true
                    });
                },
                reset: function () {
                    this.model.set(this.model["default"]);
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
                    this.active = true;
                },
                deactivate: function () {
                    this.active = false;
                }
            }),
            DropView = Backbone.View.extend({
                initialize: function (options) {
                    var o = this;
                    o.model = options.model;
                    o.model.on("change", o.render.bind(o));
                    o.dropClass = options.dropClass;
                    o.commonClass = options.commonClass;
                    o.el = $('<div></div>').attr('id', o.model.get('id')).addClass(
                            o.dropClass + " " + o.commonClass).css({
                        'background': 'none',
                        border: '1px solid blue',
                        position: 'absolute'
                    }).data('vol', o.model.get("volume"));
                    $(options.parent).append(o.el);
                    o.render();
                },
                width: function () {
                    this.el.width(parseInt(this.model.get("width"), 10));
                },
                render: function () {
                    this.height();
                    this.width();
                    this.left();
                    this.top();
                },
                height: function () {
                    this.el.height(parseInt(this.model.get("height"), 10));
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
                    this.model.set({
                        left: parseInt(a.css('left'), 10),
                        top: parseInt(a.css('top'), 10),
                        height: a.height(),
                        volume: parseFloat(a.data('vol'), 10),
                        width: a.width()
                    }, {
                        silent: true
                    });
                },
                reset: function () {
                },
                correctVisual: function () {

                },
                wrongVisual: function () {

                },
                revealAnswer: function (val) {

                },
                activate: function () {

                },
                deactivate: function () {

                }

            }),
            DragDropModel = Backbone.Model.extend({
                "default": null,
                initialize: function (option) {
                    this["default"] = option;
                },
                reset: function () {
                    this.set("readerAnswer", {}); // empty readerLine object, which contain reference of lines created in reader
                    this.set("readerAnswerVol", {}); // empty readerLine object, which contain reference of lines created in reader
                },
                check: function (val) {
                    var corrAns = this.get("answer"), userAns = this.get("readerAnswer"), userAnsVol = this.get("readerAnswerVol"), dropList = this.get("dropList"), corr = true;
                    _.each(userAns, function (ans, key) {
                        if (!corrAns[key]) {
                            corr = false;
                        }
                    });
                    if (corr) {
                        _.each(dropList, function (dropItem, key) {
                            if (dropItem.volume != 0) {
                                if (dropItem.volume != userAnsVol[key]) {
                                    corr = false;
                                }
                            }

                        });
                    }
                    return corr;
                }

            }),
            DragDropController = Backbone.View
            .extend({
                active: true,
                dragClass: null,
                dropClass: null,
                commonClass: null,
                deleted: false,
                initialize: function (option) {
                    var o = this;
                    o.model = option.model;
                    o.commonClass = "commonClass";
                    o.dragClass = "dragClass_" + parseInt(Math.random() * 100000) + "_" + Date.now();
                    o.dropClass = "dropClass_" + parseInt(Math.random() * 100000) + "_" + Date.now();
                    o.groupClass = "group_" + Date.now();
                    o.dragViewList = {};
                    o.dropViewList = {};
                    o.active = true;
                    o.deleted = false;
                    o.context = option.context;
                    o.el = $("<div></div>").attr('id', o.model.get('Id')).css({
                        width: o.model.get('width'),
                        height: o.model.get('height'),
                        background: 'none',
                        border: '1px solid #000',
                        position: 'absolute',
                        left: o.model.get('left'),
                        top: o.model.get('top')
                    }).addClass(o.groupClass);
                    o.el
                            .append('<div class="lineContainer"><svg class="svgLineContainer"  width="' + o.model.get('width') + 'px" height="' + o.model.get('height') + 'px"></svg></div>');
                    // o.model.on("change", o.updatePositionValues.bind(o));
                    $(option.parent).append(o.el);
                    if (isRoleAuthor) {
                        uiSetting.applyAuthorRelatedProperty(o.el, o, o);
                    }
                    o.render();
                },
                render: function () {
                    var o = this,
                            m = o.model,
                            id, readerAnswer, readerAnswerVol, dropId, dragId, key, dragVol, dropInstances = [], dropInstanceObj = {};
                    _.each(m.get('dropList'), function (dropSetting) {
                        id = dropSetting.id;
                        o.dropViewList[id] = new DropView({
                            model: new DropModel(dropSetting),
                            dragClass: o.dragClass,
                            dropClass: o.dropClass,
                            commonClass: o.commonClass,
                            parent: o.el
                        });
                        if (isRoleAuthor) {
                            uiSetting.applyAuthorRelatedProperty(o.dropViewList[id].el, o, o);
                            o.dropViewList[id].el.on("click", {view: o}, dropClicked);
                        } else {
                            $(o.dropViewList[id].el).droppable({
                                accept: "." + o.dragClass,
                                drop: function (event, ui) {
                                    var cloneDragItem, left, top;
                                    if (o.model.get("isCopyApplicable")) {
                                        left = ui.offset.left - ($(event.target).offset())['left'];
                                        top = ui.offset.top - ($(event.target).offset())['top'];
                                        cloneDragItem = ui.draggable.clone().removeAttr('id').removeAttr('class').css({left: left, top: top}).draggable({containment: "parent"});
                                        $(event.target).append(cloneDragItem);
                                    }
                                    readerAnswer = o.model.get("readerAnswer");
                                    readerAnswerVol = o.model.get("readerAnswerVol");
                                    dropId = $(this).attr('id');
                                    dragId = $(ui.draggable).attr('id');
                                    dragVol = $(ui.draggable).data('vol');
                                    key = dragId + "_" + dropId;
                                    dropInstanceObj = {};
                                    dropInstanceObj.left = left;
                                    dropInstanceObj.top = top;


                                    if (!readerAnswer[key]) {
                                        dropInstances = [];
                                        dropInstances.push(dropInstanceObj);
                                        readerAnswer[key] = {'source': dragId, 'target': dropId, 'dropInstances': dropInstances};
                                    } else {
                                        dropInstances = readerAnswer[key].dropInstances;
                                        dropInstances.push(dropInstanceObj);
                                        readerAnswer[key] = {'source': dragId, 'target': dropId, 'dropInstances': dropInstances};
                                    }
                                    if (readerAnswerVol[dropId]) {
                                        readerAnswerVol[dropId] = Math.round((readerAnswerVol[dropId] + dragVol) * 1e12) / 1e12;
                                    } else {
                                        readerAnswerVol[dropId] = dragVol;
                                    }

                                }
                            });
                        }
                    });
                    _.each(m.get('dragList'), function (dragSetting) {
                        id = dragSetting.id;
                        o.dragViewList[id] = new DragView({
                            model: new DragModel(dragSetting),
                            dragClass: o.dragClass,
                            dropClass: o.dropClass,
                            commonClass: o.commonClass,
                            parent: o.el,
                            mainView: o
                        });
                        if (isRoleAuthor) {
                            o.dragViewList[id].el.on("click", {
                                view: o
                            }, dragClicked);
                        } else {
                            $(o.dragViewList[id].el).draggable({
                                revert: "invalid",
                                zIndex: 1,
                                containment: 'parent',
                                helper: o.model.get("isCopyApplicable") ? "clone" : false
                            });
                        }

                    });
                },
                checkAnswer: function () {
                    return this.model.check(this.model.get("readerAnswer"));
                },
                updateCollection: function () {
                    var dragModelList = {};
                    var dropModelList = {};
                    var val = {};
                    this.model.set({
                        left: parseInt(this.el.css("left")),
                        top: parseInt(this.el.css("top")),
                        height: this.el.height(),
                        width: this.el.width()
                    }, {
                        silent: true
                    });
                    _.each(this.dragViewList, function (dragView) {
                        dragView.updateModel();
                        val = dragView.model.toJSON();
                        dragModelList[val.id] = val;
                    });
                    _.each(this.dropViewList, function (dropView) {
                        dropView.updateModel();
                        val = dropView.model.toJSON();
                        dropModelList[val.id] = val;
                    });
                    this.model.set({
                        dropList: dropModelList,
                        dragList: dragModelList
                    }, {
                        silent: true
                    });
                },
                updatePositionValues: function () {
                    var o = this;
                    o.el.css({
                        left: o.model.get("left"),
                        top: o.model.get("top"),
                        height: o.model.get("height"),
                        width: o.model.get("width")
                    });
                },
                validate: function () {

                },
                setUserAnswer: function (ansObj) {
                    var o = this;
                    o.model.set({
                        readerAnswer: ansObj.readerAnswer,
                        readerAnswerVol: ansObj.readerAnswerVol,
                    }, {
                        silent: true
                    });
                    _.each(ansObj.readerAnswer, function (draggedObj) {
                        _.each(draggedObj.dropInstances, function (dropInstanceObj) {
                            var cloneDragItem = o.el.find('#' + draggedObj.source).clone().removeAttr('id').removeAttr('class').css({left: dropInstanceObj.left, top: dropInstanceObj.top}).draggable({containment: "parent"});
                            o.el.find('#' + draggedObj.target).append(cloneDragItem);
                        });

                    });

                },
                getUserAnswer: function (ansObj) {
                    var o = this;
                    var readerAnswer = o.model.get('readerAnswer'), readerAnswerVol = o.model.get('readerAnswerVol');
                    return {readerAnswer: readerAnswer, readerAnswerVol: readerAnswerVol};
                },
                changeCount: function () {

                },
                deactivate: function () {

                },
                activate: function () {

                },
                revealAnswer: function () {

                },
                destroy: function () {
                    delete this.model;
                    this.el.remove();
                },
                correctVisual: function () {

                },
                wrongVisual: function () {

                },
                reset: function () {
                    var a = this.el;
                    this.model.reset(); // reset model
                    _.each(this.model.get('dropList'), function (val, key) {
                        a.find('#' + key).empty();
                    });
                    _.each(this.model.get('dragList'), function (val, key) {
                        a.find("#" + key).css({
                            left: val.left,
                            top: val.top,
                            height: val.height,
                            width: val.height
                        });
                    });
                }
            });
    var uiSetting = {
        authorParent: "author_content_container",
        seperator: "|",
        resizeAndDrag: function (el, resizeSetting, draggableSetting) {
            typeof resizeModule !== "undefined" && resizeModule.makeResize(el, resizeSetting.callback,
                    resizeSetting.callback, resizeSetting.callback,
                    resizeSetting.context);
            typeof draggableModule !== "undefined" && draggableModule
                    .makeDraggable(el, draggableSetting.callback,
                            draggableSetting.callback,
                            draggableSetting.callback,
                            draggableSetting.context);
        },
        changeHeightAndWidth: function (a, view) { // callback function on
            // resize and drag to change
            // line and svg properties
            var hsData = {},
                    m = view.model,
                    dragClass, dropClass, dropList = m
                    .get("dropList"),
                    dragList = m.get("dragList"),
                    answer = m
                    .get("answer"),
                    dragClass = view.dragClass,
                    dropClass = view.dropClass,
                    groupClass = view.groupClass,
                    el = view.el;

            function changeLineEnd(a) {
                var hsType = "",
                        svgCont, x, y, l, l2;

                if (a.hasClass(dragClass)) {
                    hsType = "source";
                } else if (a.hasClass(dropClass)) {
                    hsType = "target";
                } else if (a.hasClass(groupClass)) {
                    hsType = "mainContainer";
                }
                hsData.id = a.attr("id");
                hsData.left = parseInt(a.css("left"), 10);
                hsData.top = parseInt(a.css("top"), 10);
                hsData.width = parseInt(a.css("width"), 10);
                hsData.height = parseInt(a.css("height"), 10);

                if (hsType === "mainContainer") {
                    svgCont = el.find(".svgLineContainer")[0];
                    svgCont.setAttribute('width', hsData.width);
                    svgCont.setAttribute('height', hsData.height);
                } else {

                    $.each(answer, function (key, val) {
                        if (val[hsType] === hsData.id) {
                            x = hsData.left + (hsData.width / 2);
                            y = hsData.top + (hsData.height / 2);
                            l = el.find("#" + key)[0];
                            l2 = el.find("#" + key + '_ref')[0];

                            if (hsType === "source") {
                                l.setAttribute('x1', x); // x1
                                l.setAttribute('y1', y); // y1
                                l2.setAttribute('x1', x); // x1
                                l2.setAttribute('y1', y); // y1
                            } else if (hsType === "target") {
                                l.setAttribute('x2', x); // x1
                                l.setAttribute('y2', y); // y1
                                l2.setAttribute('x2', x); // x1
                                l2.setAttribute('y2', y); // y1
                            }
                        }
                    });
                    if (hsType === "source") {
                        dragList[hsData.id] = hsData;
                    } else if (hsType === "target") {
                        dropList[hsData.id] = hsData;
                    }
                }
            }
            changeLineEnd($(a));

        },
        getWidgetTemplate: function (obj, mode) { // create widget template
            var str = '',
                    styler = '',
                    temp;

            str = '<div id="' + obj.id + '" class="matchLine_mainContainer" style="position:absolute;left: ' + obj.left + 'px; top: ' + obj.top + 'px; width: ' + obj.width + 'px; height: ' + obj.height + 'px;">';
            $.each(obj.dragList, function (key, val) {
                str += createHotSpot(key, val);

            });

            $.each(obj.dropList, function (key, val) {
                str += createHotSpot(key, val);
            });
            str += '<div class="lineContainer"><svg class="svgLineContainer"  width="' + obj.width + 'px" height="' + obj.height + 'px"></svg></div>';
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
    },
    popupManager = {
        popupInitialSetting: {
            popId: 'dragndrop_pop_singleton',
            common: [{
                    id: "leftArea",
                    type: "text",
                    label: "Left",
                    check: false /* set true if you want to save value for this field in popup*/
                }, {
                    id: "topArea",
                    type: "text",
                    label: "Top",
                    check: false /* set true if you want to save value for this field in popup */
                }, {
                    id: "heightArea",
                    type: "text",
                    label: "Height",
                    check: false /* set true if you want to save value for this field in popup */
                }, {
                    id: "widthArea",
                    type: "text",
                    label: "Width",
                    check: false /* set true if you want to save value for this field in popup */
                }, {
                    id: "volume",
                    type: "text",
                    label: "Count / Value",
                    check: false /* set true if you want to save value for this field in popup */
                }],
            buttonList: [{
                    id: "createDragArea",
                    html: "Add drag area"
                }, {
                    id: "createDropArea",
                    html: "Add drop area"
                }, {
                    id: "configAnswer",
                    html: "Add answer"
                }, {
                    id: "applyAnswer",
                    html: "Save answer"
                }, {
                    id: "deleteDrag",
                    html: "Delete drag area"
                }, {
                    id: "deleteDrop",
                    html: "Delete drop area"
                }, {
                    id: "removeAll",
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
            $('#popup-overlay-dragDrop').remove();
        },
        createPop: function () {
            getConfigurationWindow(this.popupInitialSetting, $('#' + uiSetting.authorParent));
        },
        show: function (e) {
            if ($('#popup-overlay-label').css('display') != 'block') {
                var view = e.data.view,
                        context = e.data.context;
                popupManager.updatePopFields(view, this.id);

                $('#popup-overlay-dragDrop').css('display', 'block');

                var p = $("#" + popupManager.popupInitialSetting.popId).css(
                        "display", "block");
                typeof draggableModule !== "undefined" && draggableModule.makeDraggable(p); // make popup
                // draggable
                p.find('#submit').off('click', popupManager.updateWidget).on(
                        'click', {
                            view: view
                        }, popupManager.updateWidget);
                p.find("#widthArea").parent().hide();
                p.find("#heightArea").parent().hide();
                p.find("#leftArea").parent().hide();
                p.find("#topArea").parent().hide();
                p.find("#volume").parent().hide();
                // bind event for createDragArea button
                p.find('#createDragArea').off('click').on('click', {
                    view: view
                }, popupManager.createDragArea);
                // bind event for createDropArea button
                p.find('#createDropArea').off('click').on('click', {
                    view: view
                }, popupManager.createDropArea);
                // bind event for configAnswer button
                p.find('#configAnswer').off('click').on('click', {
                    view: view
                }, popupManager.configAnswer);
                // bind event for applyAnswer button
                p.find('#applyAnswer').off('click').on('click', {
                    view: view
                }, popupManager.applyAnswer);
                // bind event for deleteDrag button
                p.find('#deleteDrag').off('click').on('click', {
                    view: view
                }, popupManager.deleteDrag);
                // bind event for deleteDrop button
                p.find('#deleteDrop').off('click').on('click', {
                    view: view
                }, popupManager.deleteDrop);
                p.find("#removeAll").off("click").on("click", context.destroy);
                // bind blur event for width of drag/drop area
                p.find('#widthArea').off('blur').on('blur', {
                    view: view
                }, popupManager.widthArea);
                // bind blur event for height of drag/drop area
                p.find('#heightArea').off('blur').on('blur', {
                    view: view
                }, popupManager.heightArea);
                // bind blur event for left of drag/drop area
                p.find('#leftArea').off('blur').on('blur', {
                    view: view
                }, popupManager.leftArea);
                // bind blur event for top of drag/drop area
                p.find('#topArea').off('blur').on('blur', {
                    view: view
                }, popupManager.topArea);

                // bind blur event for volume of drag/drop area
                p.find('#volume').off('blur').on('blur', {
                    view: view
                }, popupManager.changeVolume);
            }
        },
        configAnswer: function (e) { // set flag to draw lines
            var hash = '#',
                    pis = popupManager.popupInitialSetting,
                    p = $(hash + pis.popId),
                    el = e.data.view.el,
                    m = e.data.view.model;
            m.set("markLine", true);
            p.find(hash + "configAnswer").hide();
            p.find(hash + "applyAnswer").show();
            p.find("#deleteDrag").hide();
            p.find("#deleteDrop").hide();
        },
        applyAnswer: function (e) { // apply matched lines between source and
            // target and remove option to
            var el = e.data.view.el,
                    hash = '#',
                    pis = popupManager.popupInitialSetting,
                    p, m;
            el.children('.' + e.data.view.dragClass).removeClass('active');
            el.children('.' + e.data.view.dropClass).removeClass('active');
            p = $(hash + pis.popId);
            m = e.data.view.model;
            m.set("markLine", false);
            p.find(hash + "configAnswer").show();
            p.find(hash + "applyAnswer").hide();
        },
        deleteDrag: function (e) { // delete hot spot
            var hash = '#',
                    dragList, dragViewList, hsData = {},
                    view, el, pis, p, dragClass, activeDrag, m, answer, hsType = "";
            view = e.data.view;
            el = view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);
            dragClass = view.dragClass;
            activeDrag = el.find('.' + dragClass + '.active'); // get selected
            // hot spot

            m = view.model; // get model

            answer = m.get("answer"); // get matched lines object

            hsType = "source";
            hsData.id = activeDrag.attr("id");
            $.each(answer, function (key, val) { // delete respected lines
                if (val[hsType] === hsData.id) {
                    el.find("#" + key).remove();
                    delete answer[key]; // delete reference of matched lines
                    // reference

                }
            });
            dragList = m.get("dragList");
            dragViewList = view.dragViewList;
            delete dragList[hsData.id]; // delete reference of drag/drop area from hot
            // spot object
            delete dragViewList[hsData.id]; // delete reference of drag/drop area from
            // hot spot object

            activeDrag.remove(); // remove hot spot
            p.find("#deleteDrag").hide(); // hide delete area button
        },
        deleteDrop: function (e) { // delete hot spot
            var hash = '#',
                    dropList, dropViewList, hsData = {},
                    view, el, pis, p, dropClass, activeDrop, m, answer, hsType = "";
            view = e.data.view;
            el = view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);
            dropClass = view.dropClass;
            activeDrop = el.find('.' + dropClass + '.active'); // get selected
            // hot spot

            m = view.model; // get model

            answer = m.get("answer"); // get matched lines object

            hsType = "target";
            hsData.id = activeDrop.attr("id");
            $.each(answer, function (key, val) { // delete respected lines
                if (val[hsType] === hsData.id) {
                    el.find("#" + key).remove();
                    delete answer[key]; // delete reference of matched lines
                    // reference

                }
            });
            dropList = m.get("dropList");
            dropViewList = view.dropViewList;
            delete dropList[hsData.id]; // delete reference of drag/drop area from hot
            // spot object
            delete dropViewList[hsData.id]; // delete reference of drag/drop area from
            // hot spot object

            activeDrop.remove(); // remove hot spot
            p.find("#deleteDrop").hide(); // hide delete area button
        },
        createDragArea: function (e) { // update values in popup input fields
            var view = e.data.view,
                    el = view.el,
                    val, m, dragId, draOgbjId, dragList;
            m = view.model;
            dragId = m.get('dragId');
            dragList = m.get('dragList');
            draOgbjId = 'drag' + dragId;
            dragObj.id = draOgbjId;
            dragObj.imageInfo.id = parseInt(Math.random() * 100000) + "_ImageUpload_" + Date.now();
            dragObj.textInfo.id = parseInt(Math.random() * 100000) + "_Label_" + Date.now();
            dragObj.textInfo.text = "drag" + parseInt(dragId + 1);
            view.dragViewList[draOgbjId] = new DragView({
                model: new DragModel(dragObj),
                dragClass: view.dragClass,
                dropClass: view.dropClass,
                commonClass: view.commonClass,
                parent: el,
                mainView: view
            });
            dragList[draOgbjId] = dragObj;
            view.dragViewList[draOgbjId].el.on("click", {
                view: view
            }, dragClicked);
            dragId++;
            m.set('dragId', dragId);
        },
        createDropArea: function (e) { // update values in popup input fields
            var view = e.data.view,
                    el = view.el,
                    val, m, dropId, dropObjId, dropList;
            m = view.model;
            dropId = m.get('dropId');
            dropList = m.get('dropList');
            dropObjId = 'drop' + dropId;
            dropObj.id = dropObjId;
            view.dropViewList[dropObjId] = new DropView({
                model: new DropModel(dropObj),
                dragClass: view.dragClass,
                dropClass: view.dropClass,
                commonClass: view.commonClass,
                parent: el
            });
            uiSetting.applyAuthorRelatedProperty(
                    view.dropViewList[dropObjId].el, view, view);
            dropList[dropObjId] = dropObj;
            view.dropViewList[dropObjId].el.on("click", {
                view: view
            }, dropClicked);
            dropId++;
            m.set('dropId', dropId);
        },
        widthArea: function (e) { // update width of selected area
            var hash = '#',
                    view, el, pis, p, commonClass, activeArea, val, parent, adjustedVal;
            view = e.data.view;
            el = view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);
            commonClass = view.commonClass;
            activeArea = el.find('.' + commonClass + '.active'); // get
            // selected
            // hot spot
            parent = activeArea.parent();
            val = p.find("#widthArea").val();
            adjustedVal = app
                    .limitWidth(activeArea, parent, val, minimum.width);
            p.find("#widthArea").val(adjustedVal);
            activeArea.css('width', adjustedVal + "px");
        },
        heightArea: function (e) { // update height of selected area
            var hash = '#',
                    view, el, pis, p, commonClass, activeArea, val, parent, adjustedVal;
            view = e.data.view;
            el = view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);
            commonClass = view.commonClass;
            activeArea = el.find('.' + commonClass + '.active'); // get
            // selected
            // hot spot
            parent = activeArea.parent();
            val = p.find("#heightArea").val();
            adjustedVal = app.limitHeight(activeArea, parent, val,
                    minimum.height);
            p.find("#heightArea").val(adjustedVal);
            activeArea.css('height', adjustedVal + "px");
        },
        leftArea: function (e) { // update left of selected area
            var hash = '#',
                    view, el, pis, p, commonClass, activeArea, val, parent, adjustedVal;
            view = e.data.view;
            el = view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);
            commonClass = view.commonClass;
            activeArea = el.find('.' + commonClass + '.active'); // get
            // selected
            // hot spot
            parent = activeArea.parent();
            val = p.find("#leftArea").val();
            adjustedVal = app.limitLeft(activeArea, parent, val);
            p.find("#leftArea").val(adjustedVal);
            activeArea.css('left', adjustedVal + "px");
        },
        topArea: function (e) { // update top of selected area
            var hash = '#',
                    view, el, pis, p, commonClass, activeArea, val, parent, adjustedVal;
            view = e.data.view;
            el = view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);
            commonClass = view.commonClass;
            activeArea = el.find('.' + commonClass + '.active'); // get
            // selected
            // hot spot
            parent = activeArea.parent();
            val = p.find("#topArea").val();
            adjustedVal = app.limitTop(activeArea, parent, val);
            p.find("#topArea").val(adjustedVal);
            activeArea.css('top', adjustedVal + "px");
        },
        changeVolume: function (e) { // update top of selected area
            var hash = '#',
                    view, el, pis, p, commonClass, activeArea, val;
            view = e.data.view;
            el = view.el;
            pis = popupManager.popupInitialSetting;
            p = $(hash + pis.popId);
            commonClass = view.commonClass;
            activeArea = el.find('.' + commonClass + '.active'); // get selected hot spot
            val = p.find("#volume").val();
            activeArea.data('vol', val);
        },
        updateWidget: function (e) {
            var hash = '#';
            var val, answer = {};
            var m = e.data.view.model,
                    pis = popupManager.popupInitialSetting;
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

                $('#dragndrop_validation_section').find('.validation-msg')
                        .html('');
                m.set(answer); // set data model with new values
                // m.set("lineColor", colorSettingLine.getColor(p));
                m.set("markLine", false);
                popupManager.hide(); // hide popup manager
            } else {
                $('#dragndrop_validation_section').find('.validation-msg')
                        .html(checkResult.msg);
            }
        },
        updatePopFields: function (view, id) {
            var hash = '#',
                    m = view.model,
                    pis = popupManager.popupInitialSetting,
                    p = $(hash + pis.popId),
                    s = pis.common;
            // updating common properties
            for (var i = 0; i < s.length; i++) {
                if (s[i].check) {
                    p.find(hash + s[i].id).val(m.get(s[i].id));
                }
            }
        },
        hide: function () {
            $('#popup-overlay-dragDrop').css('display', 'none');
            $("#" + popupManager.popupInitialSetting.popId).css("display",
                    "none");
        }
    };

    function getConfigurationWindow(setting, parent) {
        if ($('#' + setting.popId).length) {
            return false;
        }

        var inputType = _.union(setting.boxType || [], setting.common || [],
                setting.optionType || []),
                popEl, buttonList = setting.buttonList || [],
                a = '<div id="' + setting.popId + '" class="popup_container"><div id="dragndrop_validation_section"><span class="validation-msg"></span></div>';
        // process all popup input elements and make popup template
        for (var i = 0; i < inputType.length; i++) {
            a = a + '<div class="pop-row">';
            a = a + '<label class="' + inputType[i].Class + '">' + inputType[i].label + '</label>';
            if (inputType[i].type === "text") {
                a = a + '<input type="' + inputType[i].type + '"id="' + inputType[i].id + '" class="' + inputType[i].Class + '">';
            }
            a = a + '</div>';
        }

        // process all button elements for popup
        for (var x = 0; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
        }
        $(parent).append(a + '</div>');
        popEl = $('#' + setting.popId);
        popEl.find('#closePopup').on("click",
                popupManager.hide.bind(popupManager));
        return true;
    }

    function dragDrop(options) {
        /* defining all variable at once */
        var _this = this,
                cSetting = {},
                authParent, collectionView, el, defaultSetting = {
                    widgetType: "dragDrop",
                    answer: {},
                    lineColor: "#000",
                    lineWidth: "2",
                    readerAnswer: {},
                    readerAnswerVol: {},
                    dragList: {
                        'drag0': {
                            id: 'drag0',
                            left: 10,
                            top: 10,
                            height: 100,
                            width: 100,
                            volume: 1,
                            isImageApplicable: true,
                            imageInfo: {
                                height: 38,
                                id: "11_ImageUpload_" + timenow,
                                isResizeAllow: true,
                                left: 0,
                                src: "data:image/png;base64,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",
                                title: "Doggy",
                                top: 0,
                                widgetType: "ImageUpload",
                                width: 48
                            },
                            isTextApplicable: true,
                            textInfo: {
                                Bold: false,
                                Italic: false,
                                Underline: false,
                                align: "center",
                                bgColor: "transparent",
                                fontSize: "14pt",
                                id: "491_Label_" + timenow,
                                left: 20,
                                rotateLabelText: "0",
                                text: "drag1",
                                textColor: "black",
                                top: 50,
                                widgetType: "labelWidget"
                            }
                        }
                    },
                    isCopyApplicable: true,
                    dropList: {
                        'drop0': {
                            id: 'drop0',
                            height: 100,
                            width: 100,
                            left: 300,
                            volume: 1,
                            top: 10
                        }
                    },
                    width: 400,
                    height: 400,
                    dropId: 1,
                    dragId: 1
                };
        /* Default setting of widget */
        function init() {
            var hash = '#';
            cSetting = $.extend({}, defaultSetting, options); // current
            // setting based
            // on options
            // provided in
            // instance
            // making.
            cSetting.Id = cSetting.Id || ('DnD_' + Date.now());
            authParent = $(hash + uiSetting.authorParent);
            if (!authParent.length) {
                throw "Parent Element is Undefined";
            }
            cSetting.markLine = true;
            collectionView = new DragDropController({
                model: new DragDropModel(cSetting),
                parent: authParent,
                context: _this
            });
            el = authParent.find(hash + cSetting.Id);
            if (isRoleAuthor) {
                collectionView.model.set("markLine", false);
                $.each(cSetting.answer, function (key, val) {
                    createMatchedLine(cSetting.dragList[val.source],
                            cSetting.dropList[val.target], cSetting.lineColor,
                            cSetting.lineWidth, key, el.find('svg'));
                });
                popupManager.updateStatus('+');
                /*
                 * authParent.delegate("." + collectionView.groupClass,
                 * "dblclick", {view: collectionView, context: _this},
                 * popupManager.show); el.find('svg').on('click',
                 * 'line.line-ref', { view: collectionView }, lineClicked);
                 */
                authParent.find("." + collectionView.groupClass).on("dblclick", {
                    view: collectionView,
                    context: _this
                }, popupManager.show);
                el.find('svg').on('click', 'line.line-ref', {
                    view: collectionView
                }, lineClicked);
            } else {
                collectionView.model.set("markLine", true);
                el.css('border', 'none');
                el.find('.' + collectionView.commonClass).css('border', 'none');
            }
        }

        init();
        /*
         * Api implementations for widget are here
         *
         */

        /* this will remove the widget from the screen */

        _this.destroy = function () {
            if (!collectionView.deleted) {
                collectionView.deleted = true;
                collectionView.destroy();
                popupManager.updateStatus('-');
            }
        };
        _this.getWidgetType = function () {
            return cSetting.widgetType;
        };
        /* This will reset the widget to its initial settings */
        _this.reset = function () {
            if (!collectionView.deleted && collectionView.active) {
                collectionView.reset();
                // console.log("reset is called");
            }
        };
        /* This will set the property */
        _this.setProperty = function (x) {

            return undefined;
        };
        /* This will get the property as per the value provided in the options */
        _this.getProperty = function (x) {

            return undefined;
        };
        /* It will validate the widget against the user inputs */
        _this.validate = function (type) {
            if (!collectionView.deleted) {
                var result = collectionView.checkAnswer();
                if (type === "specific") {
                    collectionView.deactivate();
                    collectionView.revealAnswer();
                }

                return result;
            }
            return undefined;
        };
        /* It will give the all data associated with the widget */
        _this.getWidgetData = function () {
            if (!collectionView.deleted) {
                collectionView.updateCollection();
                return collectionView.model.toJSON();
            }
            return undefined;
        };
        /* This will bring all the user input as each level of feedback */
        _this.getUserAnswer = function () {
            if (!collectionView.deleted) {
                return collectionView.getUserAnswer();
            }
            return undefined;
        };
        
        /*This will reveal the answers*/
        _this.revealAnswer = function () {
            if (!collectionView.deleted) {
                collectionView.revealAnswer();
                return true;
            }
            return undefined;
        };

        /*This will set the user answer*/
        _this.setUserAnswer = function (ans) {
            if (!collectionView.deleted) {
                collectionView.setUserAnswer(ans);
            }
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
    }

    dragDrop.prototype.toString = function () {
        return "This is dragDrop widget";
    };
    return dragDrop;
})(window);