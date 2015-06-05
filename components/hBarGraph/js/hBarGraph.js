/*
 * Created by ankit.goel on 2/20/14.
 */
/*global $, _, window, draggableModule*/
/* text widget component structure */

var hBarGraph = (function (o) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var isRoleAuthor = Role === "author";

    function create_X_axis(NumberOfLine, margin) {
        margin = parseInt(margin, 10);
        var i, str = '';
        for (i = 0; i < NumberOfLine; i++) {
            str = str + '<span data-number="' + i + '" class="horizontal-line c_f_both" style="bottom:' + (i * margin) + 'px;"></span>';
        }
        return str;
    }

//    function create_majorHorizontal_axis(NumberOfLine, margin) {
//        margin = parseInt(margin, 10);
//        var i, str = '';
//        for (i = 0; i < NumberOfLine; i++) {
//        str = str + '<span data-number="' + i + '" class="major-horizontal-line c_f_both" style="bottom:' + (i * margin) + 'px;"></span>';
//        }
//        return str;
//    }
    //creates the number of line on y-axis
    function create_Y_axis(NumberOfLine, margin, numberOfIntervals) {
        margin = parseInt(margin, 10);
        var i, str = '', j, minorMargin, majorMargin, minorLineMargin, k = 0;
        if (numberOfIntervals > 0) {
            minorMargin = margin / numberOfIntervals;
        }
        for (i = 0; i < NumberOfLine; i++) {
            majorMargin = i * margin;
            str = str + '<span data-number="' + i + '" class="vertical-line c_f_both" style="left:' + majorMargin + 'px;"></span>';
            k++;
            if (numberOfIntervals > 0) {
                if (i < NumberOfLine - 1) {
                    for (j = 1; j < numberOfIntervals; j++) {
                        minorLineMargin = majorMargin + (j * minorMargin);
                        str = str + '<span data-number="' + i + '" class="vertical-line c_f_both" style="visibility: hidden; left:' + minorLineMargin + 'px;"></span>';
                        k++;
                    }
                }
            }
        }
        return str;
    }

    function create_majorVertical_axis(NumberOfLine, margin, numberOfIntervals) {
        margin = parseInt(margin, 10);
        var i, str = '', j, minorMargin, majorMargin, minorLineMargin;
        if (numberOfIntervals > 0) {
            minorMargin = margin / numberOfIntervals;
        }
        for (i = 0; i < NumberOfLine; i++) {
            majorMargin = i * margin;
            if (i > 0) {
                str = str + '<span data-number="' + i + '" class="major-vertical-line c_f_both" style="left:' + majorMargin + 'px;"></span>';

            }
            if (numberOfIntervals > 0) {
                if (i < NumberOfLine - 1) {
                    for (j = 1; j < numberOfIntervals; j++) {
                        minorLineMargin = majorMargin + (j * minorMargin);
                        str = str + '<span data-number="' + i + '" class="minor-vertical-line c_f_both" style="left:' + minorLineMargin + 'px;"></span>';
                    }
                }
            }
        }
        return str;
    }

    //creates hotspot on intersection of vertical and horizontal grid
    function createDots(xLoop, yLoop, rW, mX, mY, numberOfIntervals) {
        var i, j = 0, DynamicSpanID = '', str = '';
        if (numberOfIntervals > 1) {
            yLoop = ((yLoop - 1) * numberOfIntervals) + 1;
            mY = mY / numberOfIntervals;
        }
        for (i = 0; i < xLoop - 1; i++) {
            for (j = 0; j < yLoop; j++) {
                DynamicSpanID = j + '_' + i;
                str = str + '<span class="hbar-round" id="' + DynamicSpanID + '"  data-row="' + j + '" data-column="' + i + '" style="width:' + (isRoleAuthor ? 10 : (10)) + 'px;height:' + mX + 'px;left:' + (isRoleAuthor ? (mY * j - rW) : /*(mY * (j - 1))*/(mY * j - rW)) + 'px; bottom:' + /* (mX * i )*/(mX * i) + 'px;"></span>';
            }
            if (isRoleAuthor) {
                DynamicSpanID = i + '_sel';
                str = str + '<span class="hbar-select" id="' + DynamicSpanID + '"  data-row="' + j + '" data-column="' + i + '" style="width:' + mX + 'px;left:' + ((mY * (j - 1)) + 1) + 'px; bottom:' + /* (mX * i )*/(((mX * i) + (mX / 2)) - 7) + 'px;">Edit</span>';
            }
        }
        return str;
    }

    // creates labels on x-axis (horizontal)
    function create_X_label(NumberOfLine, margin, labels_h_line, labelAllow) {
        margin = parseInt(margin, 10);
        var i, str = '', visibility = labelAllow ? 'visibility:visible' : 'visibility:hidden';
        if (!(labels_h_line instanceof Array)) {
            labels_h_line = labels_h_line.split(",");
        }
        for (i = 0; i < labels_h_line.length; i++) {
            str = str + '<span class="labelDecorator xAxisHoriZontalLabel" style=" bottom:' + (parseInt((margin / 2), 10) + parseInt((i * margin) - 7, 10)) + 'px;">' + (labels_h_line[i] || "") + '</span>';
        }
        return str + '<span  id="origin" class="labelDecorator xAxisHoriZontalLabel" style="bottom:-10px;' + visibility + '">0</span>';
    }

    //creates labels on y-axis(vertical)
    function create_Y_label(NumberOfLine, margin, labels_v_line, rotateXLabels) {
        margin = parseInt(margin, 10);
        var i, str = '', /*rotateXLabels= true,*/ wordWidth = 100, roundWidth = 5, Class = 'labelDecorator labels-straight-align';
        if (!(labels_v_line instanceof Array)) {
            labels_v_line = labels_v_line.split(",");
        }
        var leftFirstLabel = parseInt(((margin - wordWidth) + roundWidth) + margin * 0.2, 10);
        for (i = 0; i < labels_v_line.length; i++) {
            if (rotateXLabels) {
                str = str + '<span class="' + Class + ' yAxisVerticalLabel" style="width:' + wordWidth + 'px;  left:' + parseInt(margin + leftFirstLabel + ((i - 1) * margin), 10) + 'px;">' + (labels_v_line[i] || '') + '</span>';
            } else {
                str = str + '<span class="yAxisHoriZontalLabel" style="width:' + wordWidth + 'px;text-align:center;left:' + parseInt((i * margin) + margin - (wordWidth / 2)) + 'px;">' + (labels_v_line[i] || '') + '</span>';
            }
        }
        return str;
    }

    function xAxisDescription(el, setting) {
        var str = '', rotateXLabels = true;
        if (rotateXLabels) {
            str = str + '<span class="xAxisNameDecorator" style="width: ' + el.width() + 'px;">' + setting.graph_h_label + '</span>';
        } else {
            str = str + '<span class="xAxisNameDecorator xAxisNameNoRotate" style="width: ' + el.width() + 'px;">' + setting.graph_h_label + '</span>';
        }
        return str;
    }

    function graphMainLabel(id, setting) {
        var str = '';
        //str = str + '<span contenteditable="true" id="mainLabel_" class="mainLabelDecorator" style="width: ' + id.width() + 'px;">' + setting.graph_heading + '</span>';
        str = str + '<span id="mainLabel_" class="mainLabelDecorator" style="width: ' + id.width() + 'px;">' + setting.graph_heading + '</span>';
        return str;
    }

    function yAxisDescription(v) {
        //var str = '';
        return '<span class="yAxisNameDecorator" style="">' + v + '</span>';
    }

    function getSvg(p) {
        return '<svg class="svg_class" height="' + parseInt($(p).height() + 2, 10) + '" width="' + ($(p).width() + 10) + '" ></svg>';
    }

    var colorSetting = {
        id: "#hbarpicker",
        createColorWindow: function (el) {
            var options = {
                allowEmpty: false,
                color: "#ECC",
                showInput: true,
                className: "full-spectrum",
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                showAlpha: true,
                maxPaletteSize: 10,
                preferredFormat: "hex",
                appendTo: "#pickerContainer",
                hide: function (color) {
                    // updateBorders(color);
                    colorSetting.hide();
                },
                palette: [
                    ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                    ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                    ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                    ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                    ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                    ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                    ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                    ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
                ]
            };
            this.el = el;
            $(el).append('<div class="example" id="pickerContainer"><span title="Apply Lock" id="hBarLocker" style="cursor:pointer;font-weight:bold;top:47px;left:3px;position:absolute;">Unlock</span></div>');
            $(el).find('#pickerContainer').append('<input id="hbarpicker" type="text"/>');
            $(el).find(this.id).spectrum(options);
            this.hide(el);
        },
        show: function (id, data, width) {
            this.colorList = data.colorList;
            var rect = this.el.find('#' + id),
                    container = this.el.find('#pickerContainer');
            container.css({left: (parseInt(data.left, 10) + parseInt(width, 10) - parseInt(container.width(), 10)), top: (parseInt(data.top, 10) - parseInt(container.height(), 10) - 36)});
            var att = rect[0].getAttribute("barID"),
                    checker = container.find("#hBarLocker");
            // .find("#hBarLocker")
            //.css("display","block");
            //   var pick=container.find('#hbarpicker');
            var a = att.split('_')[1];

            container.show().attr('current', id);
            checker.html((a in data.lockValueList) ? "Locked" : "Unlocked");
            checker.off("click").on("click", function () {
                var el = this;
                if (el.innerHTML === "Unlocked") {
                    data.lockValueList[a] = att;
                    el.innerHTML = "Locked";
                } else {
                    delete data.lockValueList[a];
                    el.innerHTML = "Unlocked";
                }
                // colorSetting.hide();
            });
            this.setColor(container, rect.css("fill"));
        },
        HidePallete: function () {
            this.el.find('#pickerContainer').hide().find(this.id).spectrum("hide");
        },
        hide: function () {
            var color = this.el.find('#pickerContainer').hide().find(this.id).spectrum("hide").spectrum("get").toHexString();
            var c = this.el.find('#pickerContainer').attr('current');
            var el = $('#' + c);
            if (!!c) {
                el.css("fill", color);
                this.colorList.length && el.attr('index') && (this.colorList[el.attr('index')].color = color);
            }
        },
        remove: function () {
            this.el.find("#pickerContainer").remove();
        },
        getColor: function (el) {
            return $(el).find(this.id).spectrum("get").toHexString();
        },
        setColor: function (el, color) {
            $(el).find(this.id).spectrum("set", color);
        }
    },
    configuration = {
        authorParent: "author_content_container"
    },
    applyAuthorProperty = function (element) {
        //resizeModule.makeResize(el, resizeSetting.callback, resizeSetting.context);
        draggableModule.makeDraggable(element, draggableModuleCallback);
    }, draggableModuleCallback = function () {
        colorSetting.HidePallete();
    },
            popupManager = {
                popupInitialSetting: {
                    popId: 'graph_popup_hbarGraph',
                    inputName: [
                        {id: "h_line", value: "", type: "text", label: "Y-axis units"},
                        {id: "labels_h_line", type: "text", value: "", label: "Y-axis labels"},
                        {id: "margin_h_line", value: "", type: "text", label: "Y-axis interval width"},
                        {id: "v_line", value: "", type: "text", label: "X-axis units"},
                        {id: "labels_v_line", type: "text", value: "", label: "X-axis labels"},
                        {id: "numberOfIntervals", type: "text", value: "", label: "X-axis minor intervals"},
                        {id: "margin_v_line", value: "", type: "text", label: "X-axis interval width"},
                        {id: "isOriginAllow", type: "checkbox", value: "false", label: "Show graph origin"},
                        {id: "isVerticalLineAllow", type: "checkbox", value: "true", label: "Show vertical gridlines"},
                        {id: "isHorizontalLineAllow", type: "checkbox", value: "true", label: "Show horizontal gridlines"},
                        {id: "left", value: "", type: "text", label: "Left"},
                        {id: "top", value: "", type: "text", label: "Top"},
                    ],
                    buttonList: [
                        {id: "submit", html: "Submit"},
                        {id: "clearAllGraph", html: "Clear All"},
                        {id: "remove", html: "Remove"},
                        {id: "closeGraphpopup", html: "Close"}
                    ]
                },
                count: 0,
                updateStatus: function (type) {
                    var o = this;
                    if (type === "+") {
                        o.count++;
                    } else {
                        o.count && (o.count--);
                        o.hide();
                    }
                    if (o.count <= 0) {
                        o.removePop();

                    } else {
                        o.createPop();
                    }
                },
                removePop: function () {
                    $('#popup-overlay-hBar').remove();
                    $('#' + this.popupInitialSetting.popId).remove();
                    colorSetting.remove();
                },
                createPop: function () {
                    getConfigurationWindow(this.popupInitialSetting, $('#' + configuration.authorParent));
                },
                show: function (context, setting, rC, cC, el) {
                    var pop = $("#" + this.popupInitialSetting.popId);
                    setting.left = el.position().left;
                    setting.top = el.position().top;
                    setting.width = el.width();
                    setting.height = el.height();
                    popupManager.updatePopFields(setting);
                    $('#popup-overlay-hBar').css('display', 'block');
                    pop.css("display", "block");
                    pop.find("#remove").off("click", context.destroy).on("click", context.destroy);
                    pop.find("#closeGraphpopup").off("click", popupManager.hide).on("click", popupManager.hide);
                    pop.find("#submit").off("click", popupManager.updateWidget).on("click", {setting: setting, rC: rC, cC: cC}, popupManager.updateWidget);
                    pop.find("#clearAllGraph").off("click", context.reset).on("click", context.reset);
                },
                updatePopFields: function (setting) {
                    var p = $('#' + popupManager.popupInitialSetting.popId),
                            s = popupManager.popupInitialSetting.inputName, i;
                    for (i = 0; i < s.length; i++) {
                        if (s[i].id === "left" || s[i].id === "top" || s[i].id === "margin_h_line" || s[i].id === "margin_v_line") {
                            p.find('#' + s[i].id).val(parseInt(setting[s[i].id], 10) + "px");
                        } else if (s[i].type === "checkbox") {
                            p.find("#" + s[i].id)[0].checked = setting[s[i].id];
                        } else if (s[i].id === "h_line") {
                            p.find('#' + s[i].id).val(setting[s[i].id] - 1);
                        } else if (s[i].id === "v_line") {
                            p.find('#' + s[i].id).val(setting[s[i].id] - 1);
                        } else {
                            p.find('#' + s[i].id).val(setting[s[i].id]);
                        }
                    }
                },
                updateWidget: function (e) {
                    var m = e.data.setting,
                            p = $('#' + popupManager.popupInitialSetting.popId),
                            s = popupManager.popupInitialSetting.inputName,
                            el = $('#' + m.id),
                            i;
                    for (i = 0; i < s.length; i++) {
                        if (s[i].type === "checkbox") {
                            m[s[i].id] = p.find("#" + s[i].id).is(":checked");
                        } else if (s[i].id === "h_line") {
                            m[s[i].id] = 1 + parseInt(p.find('#' + s[i].id).val(), 10);
                        } else if (s[i].id === "v_line") {
                            m[s[i].id] = 1 + parseInt(p.find('#' + s[i].id).val(), 10);
                        } else {
                            m[s[i].id] = p.find('#' + s[i].id).val();
                        }
                    }
                    // m.stroke = colorSetting.getColor(p);
                    e.data.rC.length = 0;
                    e.data.cC.length = 0;
                    m.userAnswer.length = 0;
                    m.userAnswerLines.length = 0;
                    m.graphAnswer.length = 0;
                    m.graphAnswerLines.length = 0;
                    m.colorList.length = 0;
                    m.lockValueList = {};
                    createGraphUI(m, el);
                    attachEventOnRound(el, m);
                    popupManager.hide();
                },
                hide: function () {
                    $('#popup-overlay-hBar').css('display', 'none');
                    $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
                }
            },
    getConfigurationWindow = function (setting, parent) {
        if ($('#' + setting.popId).length) {
            return false;
        }
        var inputType = setting.inputName || [],
                buttonList = setting.buttonList || [],
                a = '<div class="popup-overlay" id="popup-overlay-hBar"></div><div id="' + setting.popId + '" class="popup_container">',
                i, x;
        for (i = 0; i < inputType.length; i++) {

            a = a + '<div class="pop-row">';
            a = a + '<label>' + inputType[i].label + '</label>';

            if (inputType[i].type === "select") {
                a = a + '<select id="' + inputType[i].id + '"></select>';
            } else {
                a = a + '<input type="' + inputType[i].type + '" id="' + inputType[i].id + '" value="' + inputType[i].value + '">';
            }

            a = a + '</div>';
        }

        for (x = 0; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
        }
        $(parent).append(a + '</div>');
        colorSetting.createColorWindow(parent);
    },
            /*  drawDots = function (el, data) {
             var l = data.userAnswer.length,
             u = data.userAnswer,
             i;
             for (i = 0; i < l; i++) {
             $(el).find("#" + u[i]).addClass('square-active');
             }
             },*/
            drawGraphHorizontal = function (el, data, cC, rC) {
                if (isRoleAuthor) {
                    colorSetting.HidePallete();
                }
                var findColor = function (id, list) {
                    var c,
                            i;
                    for (i = 0; i < list.length; i++) {
                        if (list[i].id === id) {
                            c = list[i].color;
                        }
                    }
                    return c;
                },
                        barEventHandler = function (e) {
                            if (!isRoleAuthor) {
                                return false;
                            }
                            var el = $('#' + data.id),
                                    off = el.position(),
                                    recSel = $(e.target).data('recid');
                            data.left = off.left;
                            data.top = off.top;
                            colorSetting.show(recSel, data, el.width());
                        }, createRect = function (obj) {
                    var r = document.createElementNS("http://www.w3.org/2000/svg", "rect"), key;
                    for (key in obj) {
                        r.setAttribute(key, obj[key]);
                    }
                    return r;
                },
                        defaultColor = "blue",
                        defaultStrokeColor = "#000000",
                        svg = $(el).find('svg')[0],
                        s = $.extend([], data.userAnswer),
                        r,
                        a,
                        h_line = parseInt(data.h_line, 10),
                        v_line = parseInt(data.v_line, 10),
                        mv_line = parseInt(data.margin_v_line, 10),
                        mh_line = parseInt(data.margin_h_line, 10),
                        bWidth = parseFloat(data.barWidth),
                        numberOfIntervals = parseInt(data.numberOfIntervals, 10),
                        color, len = (data.userAnswer.length),
                        i, id, removeElement = -1, toBeDeletedValue;
                if (numberOfIntervals > 1) {
                    mv_line = mv_line / numberOfIntervals;
                    v_line = ((v_line - 1) * numberOfIntervals) + 1;
                }
                $(el).find('svg').empty();
                for (i = 0; i < len; i++) {
                    a = s[i].split('_');
                    id = "hrect_" + i + "_" + Date.now();
                    r = createRect({
                        height: (mh_line) * bWidth,
                        width: (a[0] * mv_line),
                        x: 0,
                        y: ((h_line - a[1] - 2) * mh_line) + ((1 - bWidth) / 2) * mh_line,
                        id: id,
                        index: i,
                        barID: s[i]
                    });

                    if (isRoleAuthor) {
                        color = data.colorList[i].color;
                        var selId = $(el).find('#' + a[1] + '_sel');
                        selId.show();
                        selId.data('recid', id);
                        selId.on("click", barEventHandler);
                    } else {
                        color = findColor(s[i].split('_')[1], data.colorList);//data.colorList[i].color;
                    }
                    r.style.fill = color || defaultColor;
                    r.style.stroke = defaultStrokeColor;

                    $(svg.appendChild(r));
                    if (a[0] === "0") {
                        removeElement = i;
                        toBeDeletedValue = s[i];
                        $(el).find('#' + a[1] + '_sel').hide();
                        delete data.lockValueList[a[1]];

                    }
                }
                if (cC && rC && toBeDeletedValue) {
                    data.userAnswer.remove(removeElement);
                    data.colorList.remove(removeElement);
                    i = -1;
                    i = $.inArray(toBeDeletedValue.split('_')[1], cC);
                    cC.remove(i);
                    rC.remove(i);
                }

            }, drawHorizontalLine = function (targetArray, sourceArray, column_container, row_container) {
        var i, getData;
        targetArray = [];
        $.each(sourceArray, function (key, val) {
            getData = val.split('_');
            column_container.push(getData[1]);
            row_container.push(getData[0]);
            targetArray.push(val);
        });
        return targetArray;
    }, /* searchY = function (search_array, search_element) {
     var l = search_array.length, result = {found: false, rowPosition: null}, i;
     for (i = 0; i < l; i++) {
     if (search_element === search_array[i]) {
     result.found = true;
     result.rowPosition = i;
     return result;
     }
     }
     return result;
     },*/

            //gives the column position of vertical grid
            search = function (search_array, search_element) {
                var l = search_array.length, result = {found: false, columnPosition: null}, i;
                for (i = 0; i < l; i++) {
                    if (search_element === search_array[i]) {
                        result.found = true;
                        result.columnPosition = i;
                        return result;
                    }
                }
                return result;
                // creates the number of line on x-axis
            },
            createGraphUI = function (s, e) {
                var mv_line = parseInt(s.margin_v_line, 10),
                        mh_line = parseInt(s.margin_h_line, 10),
                        vLine = parseInt(s.v_line, 10),
                        hLine = parseInt(s.h_line, 10),
                        numberOfIntervals = parseInt(s.numberOfIntervals, 10),
                        str;
                e.empty();
                changeXandY(e, s);
                e.css({width: (vLine - 1) * mv_line, height: (hLine - 1) * mh_line});
                str = create_X_axis(hLine, mh_line) + /*create_majorHorizontal_axis(hLine, mh_line) +*/ create_majorVertical_axis(vLine, mv_line, numberOfIntervals) +
                        create_Y_axis(vLine, mv_line, numberOfIntervals) +
                        createDots(hLine, vLine, s.roundWidth, mh_line, mv_line, numberOfIntervals) +
                        create_X_label(hLine, mh_line, s.labels_h_line, s.isOriginAllow) +
                        create_Y_label(vLine, mv_line, s.labels_v_line, s.isLabelRotate) +
                        xAxisDescription(e, s) +
                        yAxisDescription(s.graph_v_label) +
                        graphMainLabel(e, s) +
                        getSvg(e);
                e.append(str);
                if (!s.isHorizontalLineAllow) {
                    e.find(".horizontal-line").not("[data-number=0]").css("visibility", "hidden"/*{width: "2%", left: "-2%"}*/);
                }
                if (!s.isVerticalLineAllow) {
                    e.find(".vertical-line").not("[data-number=0]").css("visibility", "hidden"/*{height: "2%", top: "100%"}*/);
                }
                e.find(".horizontal-line[data-number=0]").css({background: "#000"});
                e.find(".vertical-line[data-number=0]").css({background: "#000", bottom: "0", height: "110%"});
            },
            changeXandY = function (el, o) {
                $(el).css({"left": parseInt(o.left, 10) + "px", top: parseInt(o.top, 10) + "px"});
            };

    function getWidgetTemplate(obj) {
        return '<div id="' + obj.id + '" class="horizontal_graph_container"></div>';
    }

    function attachEventOnRound(a, data) {
        var roundClickHandler = function (event) {
            var defaultColor = "blue",
                    defaultStrokeColor = "#000000",
                    cSet = event.data.setting,
                    el = event.data.element,
                    row_container = cSet.row_container,
                    column_container = cSet.column_container,
                    dataCol = $(this).attr('data-column'),
                    dataRow = $(this).attr('data-row'),
                    temp,
                    r,
                    parent = $(el);
            if (_.contains(cSet.userAnswer, this.id)) {
                return false;
            }
            if (cSet.category === "hBarGraph") {
                if (_.contains(cSet.userAnswer, this.id)) {
                    return false;
                }
                /* if(this.id.split('_')[0]==="0"){
                 parent.find('#'+this.id.split('_')[1]+'_sel').hide();
                 return false;
                 }*/
                r = search(column_container, dataCol);
                if (!r.found) {
                    column_container.push(dataCol);
                    row_container.push(dataRow);
                    cSet.userAnswer.push(this.id);
                    if (isRoleAuthor) {
                        cSet.colorList.push({color: defaultColor, id: this.id.split('_')[1]});
                    }
                } else {
                    //  parent.find('span[data-column="' + dataCol + '"]').removeClass('square-active');
                    temp = cSet.userAnswer.indexOf(row_container[r.columnPosition] + '_' + dataCol);
                    cSet.userAnswer[temp] = this.id;
                    row_container[r.columnPosition] = dataRow;
                }
                drawGraphHorizontal(el, cSet, cSet.column_container, cSet.row_container);
            }
        },
                elList = a.find(".hbar-round"),
                i,
                lockList = data.lockValueList;

        if (!isRoleAuthor && !data.isLockEditable) {
            $.each(lockList, function (key, val) {
                elList = elList.not('[data-column="' + key + '"]');
            });
        }
        elList.css("cursor", "pointer").on("click", {setting: data, element: a}, roundClickHandler);
    }

    function updateSettings(cSetting, el) {
        cSetting.left = el.position().left;
        cSetting.top = el.position().top;
        cSetting.width = el.width();
        cSetting.height = el.height();
        if (isRoleAuthor) {
            cSetting.graphAnswer = cSetting.userAnswer;
            cSetting.graphAnswerLines = cSetting.userAnswerLines;
        }
//        cSetting.lockValueList = _.intersection(cSetting.lockValueList, cSetting.graphAnswer);
    }

    function hBarGraph(options) {
        var _this = this,
                cSetting = {},
                el,
                authParent,
                defaultSetting = {
                    widgetType: "hBarGraph",
                    category: "hBarGraph",
                    h_line: 5,
                    v_line: 6,
                    margin_h_line: 50,
                    margin_v_line: 50,
                    graphAnswer: [],
                    userAnswer: [],
                    colorList: [],
                    userAnswerLines: [],
                    graphAnswerLines: [],
                    isLabelRotate: false,
                    isOriginAllow: false,
                    graph_h_label: "",
                    graph_v_label: "",
                    graph_heading: "",
                    left: 100,
                    top: 100,
                    labels_h_line: ["1", "2", "3", "4"], //y-axis line labels
                    labels_v_line: ["1", "2", "3", "4", "5"], //x-axis line labels
                    //  stroke: "red",
                    strokeWidth: 2,
                    id: "",
                    roundWidth: 5,
                    wordWidth: 100,
                    barWidth: 1, //100% of margin between lines
                    isHorizontalLineAllow: true,
                    isVerticalLineAllow: true,
                    isLockEditable: true,
                    showMinorLines: false,
                    numberOfIntervals: 0,
                    column_container: [],
                    row_container: [],
                    lockValueList: {}
                    //opacity: 1
                },
        clearAll = function (e) {
            popupManager.hide();
            e.find('svg').empty();
            cSetting.userAnswer.length = 0;
            cSetting.row_container.length = 0;
            cSetting.column_container.length = 0;
            //e.find('.square-active').removeClass('square-active');
            if (isRoleAuthor) {
                cSetting.colorList.length = 0;
            }
            //cSetting.userAnswer.length = row_container.length = column_container.length =0;
        };

        function preInitWidget() {
            cSetting = $.extend({}, defaultSetting, options);//current setting based on options provided in instance making.
            cSetting.id = cSetting.id || 'Graph_' + Date.now();
            authParent = $('#' + configuration.authorParent);
            if (!authParent.length) {
                throw "Parent is Undefined, please check parent element id";
            }
            authParent.append(getWidgetTemplate(cSetting));
            el = authParent.find("#" + cSetting.id);
            _this.active = true;
            _this.deleted = false;
            createGraphUI(cSetting, el);
            attachEventOnRound(el, cSetting);
            if (isRoleAuthor) {
                applyAuthorProperty(el);
                cSetting.userAnswer = drawHorizontalLine(cSetting.userAnswer, cSetting.graphAnswer, cSetting.column_container, cSetting.row_container);
                // drawDots(el, cSetting);

                popupManager.updateStatus('+');
                el.bind('dblclick', {context: _this, setting: cSetting, rW: cSetting.row_container, cC: cSetting.column_container, el: el}, function (e) {
                    colorSetting.HidePallete();
                    popupManager.show(e.data.context, e.data.setting, e.data.rW, e.data.cC, e.data.el);
                });
                drawGraphHorizontal(el, cSetting);
            }
            else {
                //  cSetting.userAnswer = [];
                //  cSetting.userAnswerLines = [];
                cSetting.userAnswer = drawHorizontalLine(cSetting.userAnswer, cSetting.lockValueList, cSetting.column_container, cSetting.row_container);
                drawGraphHorizontal(el, cSetting);
            }
        }

        /*this will remove the widget from the screen*/
        _this.destroy = function () {
            if (!_this.deleted) {
                colorSetting.HidePallete();
                $('#' + cSetting.id).remove();
                _this.deleted = true;
                popupManager.updateStatus('-');
                popupManager.hide();
                _this.deleted = true;
            }
            return undefined;
        };

        /*This will reset the widget to its initial settings*/
        _this.reset = function () {
            if (!_this.deleted && _this.active) {
                clearAll(el);
                cSetting.userAnswer = drawHorizontalLine(cSetting.userAnswer, cSetting.lockValueList, cSetting.column_container, cSetting.row_container);
                drawGraphHorizontal(el, cSetting);
            }
        };

        /*This will set the property*/
        _this.setProperty = function () {
        };

        /*This will get the property as per the value provided in the options*/
        _this.getProperty = function () {
        };

        _this.getWidgetType = function () {
            return cSetting.widgetType;
        };

        /*It will validate the widget against the user inputs*/
        _this.validate = function (attemptType) {
            if (!_this.deleted) {
                var result,
                        readerAnswer = _.sortBy(cSetting.userAnswer),
                        graphAnswer = _.sortBy(_.extend([], cSetting.graphAnswer));
                result = graphAnswer.toString() === readerAnswer.toString();
                if (attemptType === "specific") {
                    if (!result) {
                        clearAll(el);
                        cSetting.userAnswer = drawHorizontalLine(cSetting.userAnswer, cSetting.graphAnswer, cSetting.column_container, cSetting.row_container);
                        drawGraphHorizontal(el, cSetting);
                    }
                    _this.deactivate();
                }
                return result;
            }
            return undefined;
        };
        /*It will give the all data associated with the widget*/
        _this.getWidgetData = function () {
            if (!_this.deleted) {
                updateSettings(cSetting, el);
                return cSetting;
            }
            return undefined;
        };
        /*This will bring all the user input as each level of feedback*/
        _this.getUserAnswer = function () {
            if (!_this.deleted) {
                return {userAnswer: cSetting.userAnswer, column_container: cSetting.column_container, row_container: cSetting.row_container};
            }
            return undefined;
        };
        /*This will set the user answer*/
        _this.setUserAnswer = function (val) {
            if (!_this.deleted) {
                cSetting.userAnswer = $.extend([], val.userAnswer);
                cSetting.column_container = $.extend([], val.column_container);
                cSetting.row_container = $.extend([], val.row_container);
                drawGraphHorizontal(el, cSetting);
            }
            return undefined;
        };

        /*This will reveal the answers*/
        _this.revealAnswer = function () {
            if (!_this.deleted) {
                clearAll(el);
                cSetting.userAnswer = drawHorizontalLine(cSetting.userAnswer, cSetting.graphAnswer, cSetting.column_container, cSetting.row_container);
                drawGraphHorizontal(el, cSetting);
            }
        };

        _this.deactivate = function () {
            if (!this.deleted) {
                _this.active = false;
                $('#' + cSetting.id).css({'pointer-events': 'none'});
            }
        };
        _this.activate = function () {
            if (!this.deleted) {
                _this.active = true;
                $('#' + cSetting.id).css({'pointer-events': 'auto'});
            }
        };
        preInitWidget();
    }

    return hBarGraph;
})(window);