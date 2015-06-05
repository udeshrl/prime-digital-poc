/*
 * Created by ankit.goel on 2/20/14.
 */
/*global $, _, window, draggableModule*/
/* text widget component structure */

/*Dependency files
 * css-graphWidget.css,spectrum.css
 * js-jQuery v2.03, underscore v1.6,, jQueryUI v1.8, ResizeModule.js, DraggableModule.js,spectrum.js
 * html-
 * */
var lineGraph = (function (o) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var isRoleAuthor = Role === "author";



    function create_X_axis(NumberOfLine, margin) {
        margin = parseInt(margin);
        var i, str = '';

        for (i = 0; i < NumberOfLine; i++) {
            str = str + '<span data-number="' + i + '" class="horizontal-line c_f_both" style="bottom:' + (i * margin) + 'px;"></span>';
        }
        return str;
    }
    function create_majorHorizontal_axis(NumberOfLine, margin) {
        margin = parseInt(margin, 10);
        var i, str = '';
        for (i = 0; i < NumberOfLine; i++) {
            if (i > 0) {
                str = str + '<span data-number="' + i + '" class="major-horizontal-line c_f_both" style="bottom:' + (i * margin) + 'px;"></span>';
            }
        }
        return str;
    }
    //creates the number of line on y-axis
    function create_Y_axis(NumberOfLine, margin) {
        margin = parseInt(margin);
        var i, str = '';

        for (i = 0; i < NumberOfLine; i++) {

            str = str + '<span data-number="' + i + '" class="vertical-line c_f_both" style="left:' + (i * margin) + 'px;"></span>';
        }
        return str;
    }
    function create_majorVertical_axis(NumberOfLine, margin) {
        margin = parseInt(margin, 10);
        var i, str = '', display = "none";

        for (i = 0; i < NumberOfLine; i++) {
            if (i > 0) {
                display = "block";
                str = str + '<span data-number="' + i + '" class="major-vertical-line c_f_both" style="left:' + (i * margin) + 'px; display:' + display + ';"></span>';
            }
        }
        return str;
    }
    //creates hotspot on intersection of vertical and horizontal grid
    function createDots(xLoop, yLoop, rW, mX, mY) {
        var i, j = 0, DynamicSpanID = '', str = '';
        for (i = 0; i < xLoop; i++) {
            for (j = 0; j < yLoop; j++) {
                DynamicSpanID = j + '_' + i;
                str = str + '<span class="lineg-round" id="' + DynamicSpanID + '"  data-row="' + j + '" data-column="' + i + '" style="left:' + (mY * j - rW) + 'px; bottom:' + (mX * i - rW) + 'px;"></span>';
            }
        }
        return str;
    }

    // creates labels on x-axis (horizontal)
    function create_X_label(NumberOfLine, margin, labels_h_line, labelAllow) {
        margin = parseInt(margin);
        var i, str = '', visibility = labelAllow ? 'visibility:visible' : 'visibility:hidden';
        if (!(labels_h_line instanceof Array)) {
            labels_h_line = labels_h_line.split(",");
        }
        for (i = 0; i < labels_h_line.length; i++) {
            str = str + '<span class="labelDecorator xAxisHoriZontalLabel" style=" bottom:' + (parseInt(margin) + parseInt((i * margin) - 7)) + 'px;">' + (labels_h_line[i] || "") + '</span>';
        }
        return str + '<span  id="origin" class="labelDecorator xAxisHoriZontalLabel" style="bottom:-10px;' + visibility + '">0</span>';
    }

    //creates labels on y-axis(vertical)
    function create_Y_label(NumberOfLine, margin, labels_v_line, rotateXLabels) {
        margin = parseInt(margin);
        var i, str = '', /*rotateXLabels= true,*/ wordWidth = 100, roundWidth = 5, Class = 'labelDecorator labels-straight-align';
        if (!(labels_v_line instanceof Array)) {
            labels_v_line = labels_v_line.split(",");
        }
        var leftFirstLabel = parseInt(((margin - wordWidth) + roundWidth) + margin * 0.2);
        //leftFirstLabel = -35;
        for (i = 0; i < labels_v_line.length; i++) {
            if (rotateXLabels) {
                str = str + '<span class="' + Class + ' yAxisVerticalLabel" style="width:' + (wordWidth) + 'px;  left:' + parseInt(margin + leftFirstLabel + ((i - 1) * margin)) + 'px;">' + (labels_v_line[i] || '') + '</span>';
            } else {
                str = str + '<span class="yAxisHoriZontalLabel" style="width:' + (wordWidth) + 'px;text-align:center;left:' + parseInt((i * margin) + margin - (wordWidth / 2)) + 'px;">' + (labels_v_line[i] || '') + '</span>';
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
        str = str + '<span contenteditable="true" id="mainLabel_" class="mainLabelDecorator" style="width: ' + id.width() + 'px;">' + setting.graph_heading + '</span>';
        return str;
    }

    function yAxisDescription(el, setting) {
        var str = '';
        str = str + '<span class="yAxisNameDecorator" style="">' + setting.graph_v_label + '</span>';
        return str;
    }

    function getSvg(p) {
        return '<svg class="svg_class" height="' + ($(p).height() + 2) + '" width="' + $(p).width() + '"style="margin-top:-1px" ></svg>';
    }

    var colorSetting = {
        newGmail: [
            ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
            ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
            ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
            ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
            ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
            ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
            ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
            ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130", "transparent"]
        ],
        createColorWindow: function (el) {
            $(el).find('#linegraphpicker').spectrum({
                allowEmpty: true,
                color: "#ECC",
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
            el.find('#linegraphpicker').toggle();
        },
        hide: function (el) {
            el.find('#linegraphpicker').toggle();
        },
        getColor: function (el) {
            return $(el).find("#linegraphpicker").spectrum("get").toHexString();
        },
        setColor: function (el, color) {
            $(el).find('#linegraphpicker').spectrum("set", color);
        }
    };


    var configuration = {
        authorParent: "author_content_container"
    },
    applyAuthorProperty = function (element) {
        //resizeModule.makeResize(el, resizeSetting.callback, resizeSetting.context);
        draggableModule.makeDraggable(element);
    },
            popupManager = {
                popupInitialSetting: {
                    popId: 'graph_popup_lineGraph',
                    //  labels: ["Left", "Top", "x axis", "y axis", "margin for x axis", "margin for y axis","Vertical axis label","Horizontal axis label", "Label Rotate Allow","Show Graph Origin"],
                    inputName: [
                        {id: "h_line", value: "", type: "text", label: "Y-axis units"},
                        {id: "labels_h_line", type: "text", value: "", label: "Y-axis labels"},
                        {id: "margin_h_line", value: "", type: "text", label: "Y-axis interval width"},
                        {id: "v_line", value: "", type: "text", label: "X-axis units"},
                        {id: "labels_v_line", type: "text", value: "", label: "X-axis labels"},
                        {id: "margin_v_line", value: "", type: "text", label: "X-axis interval width"},
                        {id: "isOriginAllow", type: "checkbox", value: "false", label: "Show graph origin"},
                        {id: "linegraphpicker", type: "text", label: "Line color"},
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
                        this.createPop();
                    }
                },
                removePop: function () {
                    $('#popup-overlay-line').remove();
                    $('#' + this.popupInitialSetting.popId).remove();
                },
                createPop: function () {
                    getConfigurationWindow(this.popupInitialSetting, $('#' + configuration.authorParent));
                },
                show: function (context, setting, rC, cC, el) {
                    setting.left = el.position().left;
                    setting.top = el.position().top;
                    setting.width = el.width();
                    setting.height = el.height();
                    popupManager.updatePopFields(setting);
                    var pop = $("#" + this.popupInitialSetting.popId);
                    $('#popup-overlay-line').css('display', 'block');
                    pop.css("display", "block");
                    pop.find("#remove").off("click").on("click", context.destroy);
                    pop.find("#closeGraphpopup").off("click").on("click", popupManager.hide);
                    pop.find("#submit").off("click").on("click", {setting: setting, rC: rC, cC: cC}, popupManager.updateWidget);
                    pop.find("#clearAllGraph").off("click").on("click", context.reset);
                },
                updatePopFields: function (setting) {
                    var p = $('#' + popupManager.popupInitialSetting.popId);
                    var s = popupManager.popupInitialSetting.inputName;
                    for (var i = 0; i < s.length; i++) {
                        if (s[i].id === "left" || s[i].id === "top" || s[i].id === "margin_h_line" || s[i].id === "margin_v_line") {
                            p.find('#' + s[i].id).val(parseInt(setting[s[i].id]) + "px");
                        } else if (s[i].type === "checkbox") {
                            p.find("#" + s[i].id)[0].checked = setting[s[i].id];
                        } else if (s[i].id === "v_line" || s[i].id === "h_line") {
                            p.find('#' + s[i].id).val(setting[s[i].id] - 1);
                        } else {
                            p.find('#' + s[i].id).val(setting[s[i].id]);
                        }
                    }
                    colorSetting.setColor(p, setting.stroke);
                },
                updateWidget: function (e) {
                    var m = e.data.setting;
                    var p = $('#' + popupManager.popupInitialSetting.popId);
                    var s = popupManager.popupInitialSetting.inputName;
                    var el = $('#' + m.id);
                    for (var i = 0; i < s.length; i++) {
                        if (s[i].type === "checkbox") {
                            m[s[i].id] = p.find("#" + s[i].id).is(":checked");
                        } else if (s[i].id === "v_line" || s[i].id === "h_line") {
                            m[s[i].id] = 1 + parseInt(p.find('#' + s[i].id).val());
                        } else {
                            m[s[i].id] = p.find('#' + s[i].id).val();
                        }
                    }
                    m.stroke = colorSetting.getColor(p);
                    e.data.rC.length = 0;
                    e.data.cC.length = 0;
                    m.userAnswer.length = 0;
                    m.userAnswerLines.length = 0;
                    m.graphAnswer.length = 0;
                    m.graphAnswerLines.length = 0;
                    m.lockValueList.length = 0;
                    m.lockValueListLines.length = 0;
                    createGraphUI(m, el);
                    attachEventOnRound(el, m, e.data.rC, e.data.cC);
                    popupManager.hide();
                },
                hide: function () {
                    $('#popup-overlay-line').css('display', 'none');
                    $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
                }
            },
    getConfigurationWindow = function (setting, parent) {
        if ($('#' + setting.popId).length) {
            return false;
        }
        var inputType = setting.inputName || [],
                buttonList = setting.buttonList || [];
        var a = '<div class="popup-overlay" id="popup-overlay-line"></div><div id="' + setting.popId + '" class="popup_container">';
        for (var i = 0; i < inputType.length; i++) {
            a = a + '<div class="pop-row">';
            a = a + '<label>' + inputType[i].label + '</label>';
            a = a + '<input type="' + inputType[i].type + '" id="' + inputType[i].id + '" value="' + inputType[i].value + '">';
            a = a + '</div>';
        }
        for (var x = 0; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
        }
        $(parent).append(a + '</div>');
        $(parent).append(
                $("<span></span>").attr({
            id: "lineGraphLocker"
        }).css({
            position: "absolute",
            visibility: "hidden",
            "font-weight": "bold"
        }).html("Locked"));
        colorSetting.createColorWindow($('#' + setting.popId));
    },
            drawDots = function (el, data) {
                var l = data.userAnswer.length, u = data.userAnswer;
                for (var i = 0; i < l; i++) {
                    $(el).find("#" + u[i]).addClass('round-active');
                }
            }, drawButtons = function () {
        var str = '';
        str += '<div class="graphButtons"><button id="createDots" type="button" class="button_decorator">Mark the points</button><button id="createLines" type="button" class="button_decorator">Join the points</button></div>';
        return str;
    }, btnCreateDots = function (e) {
        var setting = e.data.setting, el = e.data.el;
        setting.createDots = true;
        setting.createLines = false;
        el.find("#createDots").hide();
        el.find("#createLines").show();
    }, btnCreateLines = function (e) {
        var setting = e.data.setting, el = e.data.el;
        setting.createDots = false;
        setting.createLines = true;
        el.find("#createDots").hide();
        el.find("#createLines").hide();
    },
            getSvgLine = function (el, data) {
                $(el).find('svg').empty();
                var svg = $(el).find('svg')[0],
                        lineClickHandler = function () {
                            if (!isRoleAuthor)
                                return false;
                            //   var el = $('#' + data.id), locker = $('#' + configuration.authorParent).find("#lineGraphLocker").css({"visibility": "visible", left: el.position().left + el.width() + 5, top: el.position().top + 10});
                            var idList = this.id.split("#"), lockList = data.lockValueList, lockListLines = data.lockValueListLines, temp;
                            var strokeWidth = parseInt(this.style.strokeWidth);
                            if (strokeWidth === data.lockedStrokeWidth) {
                                this.style.strokeWidth = data.strokeWidth;
                                lockList.remove($.inArray(idList[1], lockList));
                                lockList.remove($.inArray(idList[2], lockList));
                                for (var i = 0; i < lockListLines.length; i++) {
                                    temp = lockListLines[i];
                                    if (temp[0] === idList[1] && temp[1] === idList[2]) {
                                        lockListLines.remove(i);
                                        break;
                                    }
                                }
                            } else {
                                this.style.strokeWidth = data.lockedStrokeWidth;
                                lockList.push(idList[1]);
                                lockList.push(idList[2]);
                                data.lockValueListLines.push([idList[1], idList[2]]);
                            }
                        },
                        createLine = function (obj) {
                            var i, r = document.createElementNS("http://www.w3.org/2000/svg", "line"), key;
                            for (key in obj) {
                                r.setAttribute(key, obj[key]);
                            }
                            return r;
                        }, isLineAvailableInLockList = function (a, b) {
                    return _.contains(data.lockValueList, a) && _.contains(data.lockValueList, b);
                }, line, id;
                if (data.userAnswer.length < 2) {
                    return false;
                }
                var h_line = parseInt(data.h_line);
                //  var v_line=parseInt(data.v_line);
                var mv_line = parseInt(data.margin_v_line);
                var mh_line = parseInt(data.margin_h_line);
                var s = $.extend([], data.userAnswerLines);
                s.sort();
                for (var i = 0; i < (data.userAnswerLines.length); i++) {
                    var a = s[i][0].split('_');
                    var b = s[i][1].split('_');
                    var svgReverse_ax1 = a[0];
                    var svgReverse_ay1 = (h_line - 1) - a[1];
                    var svgReverse_bx1 = b[0];
                    var svgReverse_by1 = (h_line - 1) - b[1];
                    id = 'lineId' + Date.now();
                    line = createLine({
                        x1: (svgReverse_ax1 * mv_line),
                        y1: (svgReverse_ay1 * mh_line) + 1,
                        x2: (svgReverse_bx1 * mv_line),
                        y2: (svgReverse_by1 * mh_line) + 1,
                        id: id + "#" + s[i][0] + "#" + s[i][1]
                    });
                    line.style.stroke = data.stroke;
                    if (isRoleAuthor) {
                        line.style.strokeWidth = isLineAvailableInLockList(s[i][0], s[i][1]) ? data.lockedStrokeWidth : data.strokeWidth;
                    } else {
                        line.style.strokeWidth = data.strokeWidth;
                    }
                    $(svg.appendChild(line)).click(lineClickHandler);
                }
            }, drawGraphLine = function (ua, ual, c, r) {
        var userAnswer, userAnswerLines, len = ua.length;
        userAnswer = $.extend([], ua);
        userAnswerLines = $.extend([], ual);
        for (var i = 0; i < len; i++) {
            var getData = ua[i].split('_');
            c.push(getData[1]);
            r.push(getData[0]);
        }
        return {userAnswer: userAnswer, userAnswerLines: userAnswerLines};
    }, searchY = function (search_array, search_element) {
        var l = search_array.length, result = {found: false, rowPosition: null};
        for (var i = 0; i < l; i++) {
            if (search_element === search_array[i]) {
                result.found = true;
                result.rowPosition = i;
                return result;
            }
        }
        return result;
    },
            createGraphUI = function (s, e) {//s->setting and e->element
                var mv_line = parseInt(s.margin_v_line);
                var mh_line = parseInt(s.margin_h_line);
                var vLine = parseInt(s.v_line);
                var hLine = parseInt(s.h_line);
                e.empty();
                var _str = '';

                e.css({width: (vLine - 1) * mv_line, height: (hLine - 1) * mh_line});
                _str = _str + create_X_axis(hLine, mh_line) + create_majorHorizontal_axis(hLine, mh_line) + create_majorVertical_axis(vLine, mv_line) +
                        create_Y_axis(vLine, mv_line) +
                        createDots(hLine, vLine, s.roundWidth, mh_line, mv_line) +
                        create_X_label(hLine, mh_line, s.labels_h_line, s.isOriginAllow) +
                        create_Y_label(vLine, mv_line, s.labels_v_line, s.isLabelRotate) +
                        xAxisDescription(e, s) +
                        yAxisDescription(e, s) +
                        graphMainLabel(e, s) +
                        getSvg(e) + drawButtons();
                e.append(_str);
                changeXandY(e, s);
                e.find('.graphButtons').css({"left": parseInt(e.outerWidth()) + "px"});
                e.find('#createDots').on("click", {setting: s, el: e}, btnCreateDots);
                e.find('#createLines').on("click", {setting: s, el: e}, btnCreateLines);
                if (!s.isHorizontalLineAllow) {
                    e.find(".horizontal-line").not("[data-number=0]").css({width: "2%", left: "-2%"});
                }
                if (!s.isVerticalLineAllow) {
                    e.find(".vertical-line").not("[data-number=0]").css({height: "2%", top: "100%"});
                }
                e.find(".horizontal-line[data-number=0]").css({background: "#000", width: "110%"});
                e.find(".vertical-line[data-number=0]").css({background: "#000"});
            },
            changeXandY = function (el, o) {
                $(el).css({"left": parseInt(o.left) + "px", top: parseInt(o.top) + "px"});

            };

    function getWidgetTemplate(obj) {
        return '<div id="' + obj.id + '" class="line_graph_container"></div>';
    }

    function attachEventOnRound(a, data, rC, cC) {
        var checkAnswerLine = function (array, subarray) {
            var i, tempArr, found = false;
            for (i = 0; i < array.length; i++) {
                tempArr = array[i];
                if ((tempArr[0] == subarray[0] && tempArr[1] == subarray[1]) || (tempArr[1] == subarray[0] && tempArr[0] == subarray[1]))
                {
                    found = true;
                    break;
                }
            }
            return found;
        }, roundClickHandler = function (event) {
            var cSet = event.data.setting,
                    el = event.data.element,
                    row_container = event.data.row,
                    column_container = event.data.col,
                    dataCol = $(this).attr('data-column'),
                    dataRow = $(this).attr('data-row'),
                    lineEndCoords = this.id;
            if (!cSet.createDots && !cSet.createLines) {
                return false;
            }
            if (cSet.createDots) {
                if (cSet.category === "lineGraph") {
                    var r = searchY(row_container, dataRow);
                    var lineStartCoords = cSet.userAnswer[cSet.userAnswer.length - 1];
                    var userLine = [];
                    if (!r.found) {
                        userLine.push(lineStartCoords, lineEndCoords);
                        column_container.push(dataCol);
                        row_container.push(dataRow);
                        cSet.userAnswer.push(lineEndCoords);

                    } else {
                        el.find('span[data-row="' + dataRow + '"]').removeClass('round-active');
                        var temp = cSet.userAnswer.indexOf(dataRow + '_' + column_container[r.rowPosition]);
                        cSet.userAnswer[temp] = lineEndCoords;
                        column_container[r.rowPosition] = dataCol;
                        //   console.log('cSet at  end' + cSet.userAnswerLines.toString());
                    }
                    $(this).addClass('round-active');
                }
            }
            if (cSet.createLines) {
                if (cSet.userAnswer.contains(lineEndCoords)) {
                    if (cSet.tempDot == '') {
                        cSet.tempDot = lineEndCoords;
                        $(this).addClass('round-selected');
                    } else if (cSet.tempDot == lineEndCoords) {
                        cSet.tempDot = '';
                        el.find('.round-selected').removeClass('round-selected');
                    } else {
                        var userLine = [];
                        userLine.push(cSet.tempDot, lineEndCoords);
                        userLine.sort();
                        if (!checkAnswerLine(cSet.userAnswerLines, userLine)) {
                            cSet.userAnswerLines.push(userLine);
                            getSvgLine(el, cSet);
                        }
                        cSet.tempDot = '';
                        el.find('.round-selected').removeClass('round-selected');
                    }

                }
            }
        }, list = a.find('.lineg-round'), i, lockList = data.lockValueList, len = lockList.length;

        if (!isRoleAuthor && !data.isLockEditable) {
            for (i = 0; i < len; i++) {
                list = list.not('[data-row="' + lockList[i].split('_')[0] + '"]');
                a.find('#' + lockList[i]).css({cursor: "pointer"}).on("click", {setting: data, element: a, row: rC, col: cC}, roundClickHandler);
            }
        }

        list.css({cursor: "pointer"}).on("click", {setting: data, element: a, row: rC, col: cC}, roundClickHandler);
    }

    function updateSettings(cSetting, el) {
        cSetting.left = el.position().left;
        cSetting.top = el.position().top;
        cSetting.width = el.width();
        cSetting.height = el.height();
        if (isRoleAuthor) {
            cSetting.graphAnswer = cSetting.userAnswer;
            cSetting.graphAnswerLines = cSetting.userAnswerLines;
            cSetting.lockValueList = _.unique(cSetting.lockValueList);
        }
    }

    function lineGraphWidget(options) {
        var _this = this,
                cSetting = {},
                column_container = [],
                row_container = [],
                el,
                authParent,
                defaultSetting = {
                    widgetType: "lineGraph",
                    category: "lineGraph",
                    h_line: 5,
                    v_line: 5,
                    margin_h_line: 50,
                    margin_v_line: 50,
                    graphAnswer: [],
                    userAnswer: [],
                    userAnswerLines: [],
                    graphAnswerLines: [],
                    left: 100,
                    top: 100,
                    labels_h_line: ["1", "2", "3", "4"],
                    labels_v_line: ["1", "2", "3", "4"],
                    stroke: "red",
                    strokeWidth: 3,
                    authorStrokeWidth: 5,
                    lockedStrokeWidth: 8,
                    id: "",
                    graph_h_label: "",
                    graph_v_label: "",
                    graph_heading: "",
                    roundWidth: 5,
                    isLabelRotate: false,
                    isOriginAllow: false,
                    isHorizontalLineAllow: true,
                    isVerticalLineAllow: true,
                    lockValueList: [],
                    lockValueListLines: [],
                    isLockEditable: false,
                    createDots: false,
                    createLines: false,
                    tempDot: ""
                },
        clearAll = function (e) {
            popupManager.hide();
            e.find('svg').empty();
            cSetting.userAnswer.length = 0;
            row_container.length = 0;
            cSetting.userAnswerLines.length = 0;
            column_container.length = 0;
            if (isRoleAuthor) {

                cSetting.lockValueList.length = 0;
            }
            e.find('.round-active').removeClass('round-active');
        };

        function preInitWidget() {
            var temp;
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
            cSetting.createDots = defaultSetting.createDots;
            cSetting.createLines = defaultSetting.createLines;
            cSetting.strokeWidth = defaultSetting.strokeWidth;
            createGraphUI(cSetting, el);
            attachEventOnRound(el, cSetting, row_container, column_container);
            if (isRoleAuthor) {
                applyAuthorProperty(el);
                temp = drawGraphLine(cSetting.userAnswer, cSetting.userAnswerLines, column_container, row_container);
                cSetting.userAnswer = temp.userAnswer;
                cSetting.strokeWidth = cSetting.authorStrokeWidth;
                cSetting.userAnswerLines = temp.userAnswerLines;
                drawDots(el, cSetting);
                getSvgLine(el, cSetting);
                popupManager.updateStatus('+');
                el.bind('dblclick', {context: _this, setting: cSetting, rW: row_container, cC: column_container, el: el}, function (e) {
                    popupManager.show(e.data.context, e.data.setting, e.data.rW, e.data.cC, e.data.el);
                });
            }
            else {
                cSetting.userAnswer = [];
                cSetting.userAnswerLines = [];
                temp = drawGraphLine(cSetting.lockValueList, cSetting.lockValueListLines, column_container, row_container);
                cSetting.userAnswer = temp.userAnswer;
                cSetting.userAnswerLines = temp.userAnswerLines;
                drawDots(el, cSetting);
                getSvgLine(el, cSetting);
            }
        }

        /*this will remove the widget from the screen*/
        _this.destroy = function () {
            if (!_this.deleted) {
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
                var temp = drawGraphLine(cSetting.lockValueList, cSetting.lockValueListLines, column_container, row_container);
                cSetting.userAnswer = temp.userAnswer;
                cSetting.userAnswerLines = temp.userAnswerLines;
                cSetting.createDots = false;
                cSetting.createLines = false;
                el.find("#createDots").show();
                el.find("#createLines").hide();
                drawDots(el, cSetting);
                getSvgLine(el, cSetting);
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
                var result = false, temp;
                var readerAnswer = $.extend([], cSetting.userAnswer);
                var graphAnswer = cSetting.graphAnswer;
                var graphAnswerLines = cSetting.graphAnswerLines;
                var readerAnswerLines = cSetting.userAnswerLines;
                readerAnswer.sort();
                graphAnswer.sort();
                graphAnswerLines.sort();
                readerAnswerLines.sort();
                if (graphAnswer.toString() === readerAnswer.toString() && graphAnswerLines.toString() === readerAnswerLines.toString()) {
                    //  console.log("forward Passed");
                    result = true;
                }
//                else if (graphAnswer.toString() !== readerAnswer.toString()) {
//                    var reverseAnswerElems = $.extend([], readerAnswer);
//                    reverseAnswerElems = reverseAnswerElems.reverse();
//                    var reverseAnswer = [];
//                    for (var i = 0; i < reverseAnswerElems.length; i++) {
//                        var item = $.extend([], reverseAnswerElems[i]);
//                        reverseAnswer[i] = item.reverse();
//                    }
//                    readerAnswer = reverseAnswer;
//                    result = graphAnswer.toString() === readerAnswer.toString();
//                }
                if (attemptType === "specific") {
                    if (!result) {
                        clearAll(el);
                        temp = drawGraphLine(cSetting.graphAnswer, cSetting.graphAnswerLines, column_container, row_container);
                        cSetting.userAnswer = temp.userAnswer;
                        cSetting.userAnswerLines = temp.userAnswerLines;
                        drawDots(el, cSetting);
                        getSvgLine(el, cSetting);
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
        _this.getUserAnswer = function () {
            if (!_this.deleted) {
                return {'userAnswer': cSetting.userAnswer, 'userAnswerLines': cSetting.userAnswerLines};
            }
            return undefined;
        };
        /*This will set the user answer*/
        _this.setUserAnswer = function (val) {
            if (!_this.deleted) {
                cSetting.userAnswer = $.extend([], val.userAnswer);
                cSetting.userAnswerLines = $.extend([], val.userAnswerLines);
                drawDots(el, cSetting);
                getSvgLine(el, cSetting);
            }
            return undefined;
        };

        /*This will reveal the answers*/
        _this.revealAnswer = function (val) {
            if (!_this.deleted) {
                clearAll(el);
                var temp = drawGraphLine(cSetting.graphAnswer, cSetting.graphAnswerLines, column_container, row_container);
                cSetting.userAnswer = temp.userAnswer;
                cSetting.userAnswerLines = temp.userAnswerLines;
                drawDots(el, cSetting);
                getSvgLine(el, cSetting);
            }
            return undefined;
        };

        _this.deactivate = function () {
            // !this.deleted || el.css({'pointer-events': 'none', 'opacity': '0'});
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

    return lineGraphWidget;
})
        (window);