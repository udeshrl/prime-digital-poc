/*
 * Created by ankit.goel on 2/20/14.
 * Clock widget component structure
 */
var clockWidget = (function (o) {
    if (o !== window) {
        throw "Please check scope of the Widget";
    }

    var configuration = {
        authorParent: "author_content_container"
    };

    applyAuthorProperty = function (el, resizeSetting, draggableSetting) {
        // resizeModule.makeResize(el, resizeSetting.callback,
        // resizeSetting.context);
        draggableModule.makeDraggable(el, draggableSetting.callback, draggableSetting.callback, draggableSetting.callback, draggableSetting.context);// ,draggableSetting.callback,draggableSetting.context
    };
    appendZero = function (val) {
        return (val.toString().length > 1) ? val : '0' + val;
    };
    function clockWidget(options) {
        var _this = this;
        var componentPath = "components/clockWidget/";
        var clockBgOptionsHeight = 50;
        var defaultSetting = {// Default setting of widget
            width: 300,
            height: 300,
            answer: {clock_hour: '300', clock_hour_lower: '300', clock_hour_higher: '300', clock_minute_lower: '60', clock_minute_higher: '60', display_Time: '10 : 10', clock_constaint: 'default', clock_bg: 'clock-1.png', clock_bg_height: 300, clock_bg_width: 300, clock_show_seconds: false, clock_non_interactive: false, clock_check_validation: true},
            left: 100,
            top: 100
        };
        var objClockOptions = {
            size: 300,
            centerColor: '#21344b',
            centerRadius: 5,
            centerStrokeWidth: 3,
            centerStrokeOpacity: 0.8,
            hourLength: 40, // the length of the image
            hourColor: '#0281FF',
            hourStrokeWidth: 6,
            hourStrokeOpacity: 0.8,
            minuteColor: '#C40403',
            minuteLength: 70, // the length of the image
            minuteStrokeWidth: 6,
            minuteStrokeOpacity: 0.8,
            secondLength: 60, // the length of the image
            secondColor: '#04FE04',
            secondStrokeWidth: 2,
            secondStrokeOpacity: 0.9,
            speed: 400,
            showSeconds: true,
            allowMinuteFullRotation: false,
            hourDraggable: true,
            minuteDraggable: true,
            onHourDragEnd: onHourDragEnd,
            onMinuteDragEnd: onMinuteDragEnd
        };

        var cSetting = $.extend({}, defaultSetting, options);// current setting
        // based on options
        // provided in
        // instance making.

        var widthDifferance = 10;
        var widget_id = 'Clock_' + Date.now();

        var authParent = $('#' + configuration.authorParent);

        var hour_ = 0;
        var hour_higher = 0;
        var hour_lower = 0;
        var minute_lower = 0;
        var minute_higher = 0;
        var display_hour = 0;
        var display_minute = 0;
        var constrain = "default";
        var attemptValue = 0;

        _this.active = true;
        _this.delete = false;

        _this.userAttempts = {};
        _this.authorInputs = {};

        var hourOption = [];
        var hourLowerOption = [];
        var hourHigherOption = [];
        var minuteOption = [];
        var minuteLowerOption = [];
        var minuteHigherOption = [];
        var clockBgs = [{'imgname': "clock-1.png", 'width': 300, 'height': 300}, {'imgname': "clock-2.png", 'width': 250, 'height': 250}, {'imgname': "clock-3.png", 'width': 200, 'height': 200}, {'imgname': "clock-7.png", 'width': 150, 'height': 150}, {'imgname': "clock-4.png", 'width': 300, 'height': 300}, {'imgname': "clock-5.png", 'width': 250, 'height': 250}, {'imgname': "clock-6.png", 'width': 200, 'height': 200}, {'imgname': "clock-8.png", 'width': 150, 'height': 150}]


        var widgetTemplate = '<div id="' + widget_id + '" data-hour-field="' + widget_id + '" data-minute-field="' + widget_id
                + '" data-event-log="' + widget_id + '" class="clockwrapper" style="left:' + cSetting.left + 'px; top:' + cSetting.top + 'px" >';

        for (var i = 0; i <= 60; i++) {
            if (i != 0 && i <= 12) {
                hourOption.push(appendZero(i));
            }
            if (i <= 4) {
                hourLowerOption.push(appendZero(i));
            }
            //if(i != 0) {
            minuteHigherOption.push(appendZero(i));
            //}
            if (i <= 5) {
                hourHigherOption.push(appendZero(i));
            }
            if (i < 60) {
                minuteOption.push(appendZero(i));
                minuteLowerOption.push(appendZero(i));
            }
        }
        var popupManager = {
            popupInitialSetting: {
                popId: 'clock_popup_id',
                // labels: ["Left", "Top", "x axis", "y axis", "margin for x
                // axis", "margin for y axis","Vertical axis label","Horizontal
                // axis label", "Label Rotate Allow","Show Graph Origin"],
                // Group elements should be in sequence
                inputName: [
                    {id: "clock_hour", name: "clock_hour", value: "", type: "select", options: hourOption, label: "Hour to display", group: false},
                    {id: "clock_hour_lower", name: "clock_hour_lower", value: "", options: hourLowerOption, type: "select", label: "Acceptable hour hand range", group: "clock_hour_range"},
                    {id: "clock_hour_higher", name: "clock_hour_higher", value: "", options: hourHigherOption, type: "select", label: "to", group: "clock_hour_range"},
                    {id: "clock_minute_lower", name: "clock_minute_lower", value: "", options: minuteLowerOption, type: "select", label: "Acceptable minute hand range", group: "clock_minute_range"},
                    {id: "clock_minute_higher", name: "clock_minute_higher", value: "", options: minuteHigherOption, type: "select", label: "to", group: "clock_minute_range", validation: true},
                    {id: "clock_rb_default", name: "clock_constaint", value: "default", type: "radio", label: "Neither", groupLabel: "Fix clock hands", group: "clock_constraints"},
                    {id: "clock_rb_hour", name: "clock_constaint", type: "radio", value: "hour", label: "Hour", group: "clock_constraints"},
                    {id: "clock_rb_minute", name: "clock_constaint", type: "radio", value: "minute", label: "Minute", group: "clock_constraints"},
//                    {id: "clock_show_seconds", name: "clock_show_seconds", type: "checkbox", label: "Show Seconds"},
//                    {id: "clock_non_interactive", name: "clock_non_interactive", type: "checkbox", label: "Non Interactive"},
//                    {id: "clock_check_validation", name: "clock_check_validation", type: "checkbox", label: "Allow Validation"},
                    {id: "clock_bg", name: "clock_bg", type: "clockImgs", options: clockBgs, label: "Clock style and size", group: false}
                ],
                buttonList: [
                    {id: "submit", html: "Submit"},
                    {id: "remove", html: "Remove"},
                    {id: "closeClockpopup", html: "Close"}
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
                $('#popup-overlay-clock').remove();
                _this.delete = true;
                $('#' + this.popupInitialSetting.popId).remove();
            },
            createPop: function () {
                getConfigurationWindow(this.popupInitialSetting, $('#' + configuration.authorParent));
            },
            show: function (context, setting, el) {
                setting.left = el.position().left;
                setting.top = el.position().top;
                setting.width = el.width();
                setting.height = el.height();
                popupManager.updatePopFields(setting);
                var pop = $("#" + this.popupInitialSetting.popId);
                $('#clock_validation_section .validation-msg').html('');
                $('#popup-overlay-clock').css('display', 'block');
                pop.css("display", "block");
                pop.find("#remove").off("click").on("click", context.destroy);
                pop.find("#closeClockpopup").off("click").on("click", popupManager.hide);
                pop.find("#submit").off("click").on("click", {setting: setting}, popupManager.updateWidget);
                pop.find('.clock-options div').bind('click', function () {
                    var imgSrc = $(this).children().data('imgname');
                    var imgWidth = $(this).children().data('imgwidth');
                    var imgHeight = $(this).children().data('imgheight');
                    pop.find('.clock-options #clock_bg').val(imgSrc);
                    pop.find('.clock-options #clock_bg_width').val(imgWidth);
                    pop.find('.clock-options #clock_bg_height').val(imgHeight);
                    pop.find('.clock-options div').removeClass('current');
                    $(this).addClass('current');
                });

            },
            updatePopFields: function (setting) {
                var p = $('#' + popupManager.popupInitialSetting.popId);
                var s = popupManager.popupInitialSetting.inputName;
                var userDisplay = {};
                userDisplay.clock_hour = parseFloat(setting.clock_hour / 30);
                userDisplay.clock_hour_lower = (setting.clock_hour_lower % 30) / 6;
                if (setting.clock_hour_higher % 30 != 0) {
                    userDisplay.clock_hour_higher = (setting.clock_hour_higher % 30) / 6;
                } else {
                    userDisplay.clock_hour_higher = (setting.clock_hour_higher - setting.clock_hour) / 6;
                }
                // hour_higher = (_this.authorInputs.hour_max% 30)/6;
                userDisplay.clock_minute_lower = setting.clock_minute_lower / 6;
                userDisplay.clock_minute_higher = setting.clock_minute_higher / 6;
                userDisplay.clock_constaint = setting.clock_constaint;
                userDisplay.clock_bg = setting.clock_bg;
                userDisplay.clock_bg_height = setting.clock_bg_height;
                userDisplay.clock_bg_width = setting.clock_bg_width;
//        		userDisplay.clock_show_seconds = setting.clock_show_seconds;
//        		userDisplay.clock_non_interactive = setting.clock_non_interactive;
//        		userDisplay.clock_check_validation = setting.clock_check_validation;
                for (var i = 0; i < s.length; i++) {
                    if (s[i].type == "checkbox") {
                        p.find("#" + s[i].id)[0].checked = userDisplay[s[i].id];
                    }
                    else if (s[i].type == "radio") {
                        var radioName = s[i].name;
                        var radioVal = userDisplay[s[i].name];
                        p.find('input[name="' + radioName + '"][value="' + radioVal + '"]').prop('checked', true);
                    } else if (s[i].type == "clockImgs") {
                        var imgVal = userDisplay[s[i].id];
                        $('.clock-options #clock_bg').val(imgVal);
                        $('.clock-options #clock_bg_height').val(userDisplay.clock_bg_height);
                        $('.clock-options #clock_bg_width').val(userDisplay.clock_bg_width);
                        $('.clock-options div').removeClass('current');
                        $('.clock-options div img[data-imgname="' + imgVal + '"]').parent().addClass('current');
                    } else {
                        p.find('#' + s[i].id).val(appendZero(userDisplay[s[i].id]));
                    }
                }
            },
            updateWidget: function (e) {
                var m = {};
                var p = $('#' + popupManager.popupInitialSetting.popId);
                var s = popupManager.popupInitialSetting.inputName;
                var el = $('#' + m.id);
                for (var i = 0; i < s.length; i++) {
                    if (s[i].type == "checkbox") {
                        m[s[i].id] = p.find("#" + s[i].id).is(":checked");
                    }
                    else if (s[i].type == "radio") {
                        if (p.find("#" + s[i].id).is(":checked"))
                            m[s[i].name] = p.find("#" + s[i].id).val();
                    } else if (s[i].type == "clockImgs") {
                        m[s[i].id] = p.find('#' + s[i].id).val();
                        m['clock_bg_height'] = p.find('#clock_bg_height').val();
                        m['clock_bg_width'] = p.find('#clock_bg_width').val();
                    }
                    else {
                        m[s[i].id] = p.find('#' + s[i].id).val();
                    }
                }
                if (checkValidation(m)) {

                    $('#clock_validation_section .validation-msg').html('');

                    _this.authorInputs.clock_hour = m.clock_hour * 30;
                    _this.authorInputs.clock_hour_lower = m.clock_hour * 30 + m.clock_hour_lower * 6;
                    _this.authorInputs.clock_hour_higher = m.clock_hour * 30 + m.clock_hour_higher * 6;
                    _this.authorInputs.clock_minute_lower = m.clock_minute_lower * 6;
                    _this.authorInputs.clock_minute_higher = m.clock_minute_higher * 6;
                    _this.authorInputs.clock_constaint = m.clock_constaint;
                    _this.authorInputs.clock_bg = m.clock_bg;
                    _this.authorInputs.clock_bg_height = m.clock_bg_height;
                    _this.authorInputs.clock_bg_width = m.clock_bg_width;
//	        		_this.authorInputs.clock_show_seconds 	= m.clock_show_seconds;
//	        		_this.authorInputs.clock_non_interactive 	= m.clock_non_interactive;
//	        		_this.authorInputs.clock_check_validation 	= m.clock_check_validation;
                    $.each(_this.authorInputs, function (key, val) {
                        cSetting.answer[key] = val;
                    });

                    showClockBg();
                    popupManager.hide();
                } else {
                    $('#clock_validation_section .validation-msg').html("Lower limit should be lesser than higher range value.");
                }
            },
            hide: function () {
                $('#popup-overlay-clock').css('display', 'none');
                $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
            }
        }, showClockBg = function () {
            var imgPath = 'url("' + componentPath + 'images/' + cSetting.answer.clock_bg + '")';
            var imgWidth = cSetting.answer.clock_bg_width + 'px';

            el.css({
                'background-image': imgPath,
                width: imgWidth});
            objClockOptions.size = cSetting.answer.clock_bg_width;
            objClockOptions.showSeconds = cSetting.answer.clock_show_seconds;
            el.children("svg").remove();
            _this.clock_hands = new Clock(widget_id, objClockOptions);
            _this.clock_hands.setTime(parseFloat(_this.authorInputs.display_Time.split(" : ")[0]), parseFloat(_this.authorInputs.display_Time.split(" : ")[1]));
        }, checkValidation = function (data) {
            var isValid = true;
            if ((parseFloat(data.clock_hour_lower) > parseFloat(data.clock_hour_higher)) ||
                    (parseFloat(data.clock_minute_lower) > parseFloat(data.clock_minute_higher))) { // Validating
                // time
                // range.
                isValid = false;
            }
            return isValid;
        }, getConfigurationWindow = function (setting, parent) {
            if (typeof $('#' + setting.popId)[0] !== "undefined") {
                return false;
            }

            function makeSelect(o) {
                var list = o.options,
                        a = '<select id="' + o.id + '" name="' + o.name + '">';
                for (var k = 0; k < list.length; k++) {
                    a = a + '<option value="' + list[k] + '">' + list[k] + '</option>';
                }
                return a + '</select>';
            }
            function getMaxClockBgHeight(list) {
                var maxHeight = 0;
                for (var k = 0; k < list.length; k++) {
                    if (maxHeight < list[k].height) {
                        maxHeight = list[k].height;
                    }
                }
                return maxHeight;
            }

            function makeClockImgs(o) {
                var list = o.options;
                var maxHeight = getMaxClockBgHeight(list), imgHeight;
                a = '<br /><div class="clock-options">';
                for (var k = 0; k < list.length; k++) {
                    imgHeight = list[k].height * (clockBgOptionsHeight / maxHeight);
                    a = a + '<div><img src="' + componentPath + 'images/' + list[k].imgname + '" align="absmiddle" data-imgwidth="' + list[k].width + '" data-imgheight="' + list[k].height + '" data-imgname="' + list[k].imgname + '" height="' + imgHeight + '" /></div>';
                    if ((k + 1) % 4 == 0) {
                        a += '<div style="display:block !important; width:100% ;height:0px;clear:both"></div>';
                    }
                }
                return a + '<input type="hidden" name="' + o.name + '" id="' + o.id + '" value=""><input type="hidden" name="clock_bg_height" id="clock_bg_height" value=""><input type="hidden" name="clock_bg_width" id="clock_bg_width" value=""></div>';
            }





            var inputType = setting.inputName || [],
                    buttonList = setting.buttonList || [];
            var a = '<div class="popup-overlay" id="popup-overlay-clock"></div><div id="' + setting.popId + '" class="popup_container">';
            var group = false;
            var labelClass = '';
            a = a + '<div>';
            for (var i = 0; i < inputType.length; i++) {
                labelClass = '';
                if ((inputType[i].group != group) || !inputType[i].group)
                    a = a + '</div><div class="pop-row">';
                else {
                    labelClass = 'group-label'
                }
                if (inputType[i].type != "radio") {
                    a = a + '<label class="' + labelClass + '">' + inputType[i].label + '</label>';
                } else if (inputType[i].groupLabel != undefined) {

                    a = a + '<label class="' + labelClass + '">' + inputType[i].groupLabel + '</label>';
                }

                if (inputType[i].type == "select") {
                    a = a + makeSelect(inputType[i]);
                } else if (inputType[i].type == "clockImgs") {
                    a = a + makeClockImgs(inputType[i]);
                }
                else {

                    a = a + '<input type="' + inputType[i].type + '" id="' + inputType[i].id + '" name="' + inputType[i].name + '" value="' + inputType[i].value + '">'
                }
                if (inputType[i].type == "radio") {
                    a = a + '<label class="radio-label">' + inputType[i].label + '</label>';
                }

                if (inputType[i].validation != undefined) {
                    a = a + '<div id="clock_validation_section"><span class="validation-msg"></span></div>';
                }
                group = inputType[i].group;
            }

            for (var x = 0; x < buttonList.length; x++) {
                a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
            }

            $(parent).append(a + '</div>');


// colorSetting.createColorWindow($('#' + setting.popId));
        };
        // var displayArea = "<div id='clock_displayarea'></div>";

        authParent.append(widgetTemplate);// Appending widget html template



        var el = authParent.find('#' + widget_id);

        _this.clock_hands = new Clock(widget_id, objClockOptions);// Creating
        // clock hands
        // for clock
        // instance.



        function onHourDragEnd() {

            _this.authorInputs.display_Time = ((this.hour.angle == 0) ? 12 : this.hour.angle / 30) + " : " + this.minute.angle / 6;
        }

        function onMinuteDragEnd() {
            _this.authorInputs.display_Time = ((this.hour.angle == 0) ? 12 : this.hour.angle / 30) + " : " + this.minute.angle / 6;
        }

        var setDefaultConfiguration = function () { // Setting default configuration
            // setting.
            _this.authorInputs.clock_hour = cSetting.answer.clock_hour;
            _this.authorInputs.clock_hour_lower = cSetting.answer.clock_hour_lower;
            _this.authorInputs.clock_hour_higher = cSetting.answer.clock_hour_higher;
            _this.authorInputs.clock_minute_lower = cSetting.answer.clock_minute_lower;
            _this.authorInputs.clock_minute_higher = cSetting.answer.clock_minute_higher;
            _this.authorInputs.display_Time = cSetting.answer.display_Time;
            _this.authorInputs.clock_constaint = cSetting.answer.clock_constaint;
            _this.authorInputs.clock_bg = cSetting.answer.clock_bg;
            _this.authorInputs.clock_bg_height = cSetting.answer.clock_bg_height;
            _this.authorInputs.clock_bg_width = cSetting.answer.clock_bg_width;
            _this.authorInputs.clock_show_seconds = cSetting.answer.clock_show_seconds;
            _this.authorInputs.clock_non_interactive = cSetting.answer.clock_non_interactive;
            _this.authorInputs.clock_check_validation = cSetting.answer.clock_check_validation;
        }
        var authorInputLength = (_.size(_this.authorInputs));

        if (authorInputLength == 0) {
            setDefaultConfiguration(); // Setting default configuration for pop-up.
        }

        showClockBg();


        _this.clock_hands.setTime(parseFloat(_this.authorInputs.display_Time.split(" : ")[0]), parseFloat(_this.authorInputs.display_Time.split(" : ")[1]));

        if (Role == "author") { // For author section
            // this.clock_hands.setTime( 10,10 );
            applyAuthorProperty(el, {callback: function () {   // applying resizing
                    // and draggable to
                    // widget
                    var w = $(arguments[0].target).width(),
                            h = $(arguments[0].target).height();// $(arguments[0].target).find('input').css({width:
                    // '300px', height: '300px'});
                }, context: this}, {callback: function (ev, ui) {   // applying
                    // resizing and
                    // draggable to
                    // widget
                }, callback: function (ev, ui) {   // applying resizing and
                    // draggable to widget
                }, callback: function (ev, ui) {   // applying resizing and
                    // draggable to widget
                }, context: this});

// el.append( popup_Template ); //Appending Pop-up for Clock instance.
//			getConfigutaionWindow();
            popupManager.updateStatus('+');
            el.bind('dblclick', {context: _this, setting: cSetting, el: el}, function (e) {
                popupManager.show(e.data.context, e.data.setting.answer, e.data.el);
            });
// $(el).dblclick( function() { //Double click event of clock instance.
// setUpClock();
// });
        } else { // For student section
            // this.clock_hands.setTime( _this.authorInputs.display_Time.split(" :
            // ")[0], _this.authorInputs.display_Time.split(" : ")[1] );
            // el.append(displayArea);
            // el.find('#clock_displayarea').html( parseInt(
            // _this.authorInputs.hour/30 ) + " : "+ parseInt(
            // _this.authorInputs.minute_min/6 ) );
            var isHourDraggable = (_this.authorInputs.clock_constaint == "hour") ? false : true;
            var isMinuteDraggable = (_this.authorInputs.clock_constaint == "minute") ? false : true;
            var isNonInteractive = _this.authorInputs.clock_non_interactive;
            var isAllowValidation = _this.authorInputs.clock_check_validation

            console.log(isHourDraggable + ":" + isMinuteDraggable);
            _this.clock_hands.setClockHand(isHourDraggable, isMinuteDraggable);
            if (isNonInteractive) {
                _this.deactivate();
            }
        }

        function removeItemFromWidgetList(instanceObj) { // Deleting item from
            // author.widgetList
            author.widgetList = _.without(author.widgetList, _.findWhere(author.widgetList, instanceObj));
        }
        this.displayTime = function () {
            return parseFloat(_this.authorInputs.clock_hour / 30) + " : " + parseFloat(_this.authorInputs.minute_min / 6);
        }
        /* this will remove the widget from the screen */
        this.destroy = function () {
            el.remove();
            _this.delete = true;
            popupManager.hide();
            removeItemFromWidgetList(this);
        };

        /* This will reset the widget to its initial settings */
        this.reset = function () {
            popupManager.hide();
            setDefaultConfiguration();
            el.css({left: cSetting.left + 'px', top: cSetting.top + 'px'});
            el.find('#clock_timeConsole').hide();
// console.log(cSetting.answer.display_Time);
            this.clock_hands.setTime(parseFloat(_this.authorInputs.display_Time.split(" : ")[0]), parseFloat(_this.authorInputs.display_Time.split(" : ")[1]));
        };

        /* This will initialise the widget as per data provided initially */
        this.initialization = function (options) {
            cSetting = $.extend(options, defaultSetting);
            setDefaultConfiguration();
            // this.initSetting = options;
        };

        /* This will set the property */
        this.setProperty = function (settingsObj) {
            if (typeof propertyName != "undefined") {
                el.offset({left: settingsObj.x});
                el.offset({top: settingsObj.y});
            } else {
                return "Pass object with properties to function.";
            }
        };

        /* This will get the property as per the value provided in the options */
        this.getProperty = function (propertyName) {
            if (typeof propertyName != "undefined") {
                if (propertyName.toLowerCase() == "x") {
                    return el.css('left');
                } else {
                    return el.css('top');
                }
            } else {
                return "Pass property name to function";
            }
        };

        /* It will validate the widget against the user inputs */
        this.validate = function (validationType) {
            if (isAllowValidation && !isNonInteractive) {
                if (typeof validationType != "undefined") {

                    attemptValue++;
                    _this.userAttempts[attemptValue] = {};
                    _this.userAttempts[attemptValue].hourHandAngle = _this.clock_hands.hour.angle == 0 ? 360 : _this.clock_hands.hour.angle;
                    _this.userAttempts[attemptValue].minnuteHandAngle = _this.clock_hands.minute.angle == 0 ? 360 : _this.clock_hands.minute.angle;

                    var hourHandLowerAngle = cSetting.answer.clock_hour_lower;
                    var hourHandHigherAngle = cSetting.answer.clock_hour_higher;
                    var minuteLowerAngle = cSetting.answer.clock_minute_lower;
                    var minuteHigherAngle = cSetting.answer.clock_minute_higher;

                    if ((hourHandLowerAngle >= 360) && (_this.userAttempts[attemptValue].hourHandAngle < hourHandLowerAngle)) {
                        hourHandLowerAngle = hourHandLowerAngle % 360;
                    }
                    if ((hourHandHigherAngle >= 360) && (hourHandLowerAngle < (hourHandHigherAngle % 360))) {
                        hourHandHigherAngle = hourHandHigherAngle % 360;
                    }

                    if (_this.userAttempts[attemptValue].minnuteHandAngle >= 360) { // if minute hand is on exact 12
                        _this.userAttempts[attemptValue].minnuteHandAngle = _this.userAttempts[attemptValue].minnuteHandAngle % 360;
                    }

                    if (((_this.userAttempts[attemptValue].hourHandAngle >= hourHandLowerAngle &&
                            _this.userAttempts[attemptValue].hourHandAngle <= hourHandHigherAngle) || !isHourDraggable) &&
                            ((_this.userAttempts[attemptValue].minnuteHandAngle >= minuteLowerAngle &&
                                    _this.userAttempts[attemptValue].minnuteHandAngle <= minuteHigherAngle) || !isMinuteDraggable)) {
                        _this.userAttempts[attemptValue].feedback = true;
                    } else {
                        _this.userAttempts[attemptValue].feedback = false;
                        if (validationType.toLowerCase() == "specific") {
                            _this.revileAnswer();
                        }
                    }
                    if (validationType.toLowerCase() == "specific") {
                        _this.deactivate();
                    }

                    return _this.userAttempts[attemptValue].feedback;
                } else {
                    return "Pass validation type ('generic'/'specific') to function.";
                }
            } else {
                return true;
            }
        };

        /* To revile correct answer */
        this.revealAnswer = function () {
            this.clock_hands.setTime(parseFloat(((cSetting.answer.clock_hour == 0) ? 12 : cSetting.answer.clock_hour / 30)), parseFloat(cSetting.answer.clock_minute_lower / 6));
        };
        

        /* It will give the all data associated with the widget */
        this.getWidgetData = function () {
            if (!_this.delete) {
                cSetting.id = el.attr('id');
                cSetting.left = el.position().left;
                cSetting.top = el.position().top;
                if (Role == "author") {
                    cSetting.answer = _this.authorInputs;
                }
                cSetting.width = el.width();
                cSetting.height = el.height();
                return cSetting;
            }
            else {
                return false;
            }
        };

        /* This will bring all the user input as each level of feedback */
        this.getUserAnswer = function (attemptCount) {
            return  _this.authorInputs.display_Time;
        };
        /*This will set the user answer*/
        this.setUserAnswer = function (val) {
            _this.authorInputs.display_Time = val;
            this.clock_hands.setTime(parseFloat(_this.authorInputs.display_Time.split(" : ")[0]), parseFloat(_this.authorInputs.display_Time.split(" : ")[1]));
            return true;
        };

        /* This is to get name of widget */
        this.getWidgetType = function () {
            return "clockWidget";
        }

        /* This will deactivate the current clock widget */
        this.deactivate = function () {
            $('#' + widget_id).addClass('clock_disabled');
        };

        /* This will activate the current clock widget */
        this.activate = function () {
            $('#' + widget_id).removeClass('clock_disabled');
        };
    }
    ;

    clockWidget.prototype.deactivate = function () {
        this.active = false;
    };

    clockWidget.prototype.activate = function () {
        this.active = true;
    };

    return clockWidget;

})(window);