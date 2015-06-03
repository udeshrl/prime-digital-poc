/**
 * Created by pallav.saxena on 4/4/2014.
 */
var divisionWidget = (function (o) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var defaultSetting = {
        widgetType: "divisionWidget",
        dividend: "5055",
        divisor: "5",
        left: 100,
        top: 100,
        id: "",
        isGridToggle: true,
        isStepsToggle: true,
        isAddExtraColumns: false,
        rowCount: 4,
        fontSize: "11pt", //font size
        dividendFields: [],
        columnCount: 6,
        userAttempt: {},
        authorAttempt: {},
        numberOfSetOfExtraSteps: 0
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
        check: function () {
            var o = this, uA = o.get("userAttempt"), aA = o.get("authorAttempt");
            return uA.quotientField.toString() == aA.quotientField.toString() && uA.firstSetOfStepFields.toString() == aA.firstSetOfStepFields.toString() && uA.remainderFields.toString() == aA.remainderFields.toString() && uA.extraStepFields.toString() == aA.extraStepFields.toString();
        }
    });
    var view = Backbone.View.extend({
        initialize: function (options) {
            var o = this;
            o.el = options.el;
            o.model = options.model;
            o.model.on("change:left", o.left.bind(o));
            o.model.on("change:top", o.top.bind(o));
            o.model.on("change:divisor", o.render.bind(o));
            o.model.on("change:dividend", o.render.bind(o));
            o.model.on("change:isGridToggle", o.toggleGrid.bind(o));
            o.model.on("change:isStepsToggle", o.toggleSteps.bind(o));
            o.model.on("change:fontSize", o.fontSize.bind(o));
            o.model.on("change:isAddExtraColumns", o.addExtraColumns.bind(o));
            o.model.on("change:numberOfSetOfExtraSteps", o.render.bind(o));
            o.deleted = false;
            o.active = true;
            o.toggleGrid(undefined);
            o.toggleSteps(undefined);
            o.addExtraColumns(undefined);
            o.fontSize(undefined);
            o.el.find('input').blur(function () {
                o.updateUserAnswer();
            });
        },
        fontSize: function () {
            var fontSize = this.model.get("fontSize");
            this.el.find("input.quotientField").css("font-size", fontSize);
            this.el.find("input.dividendField").css("font-size", fontSize);
            this.el.find("input.firstSetOfStepFields").css("font-size", fontSize);
            this.el.find("input.extraStepFields").css("font-size", fontSize);
            this.el.find("input.remainderFields").css("font-size", fontSize);
            this.el.find(".digit").css("font-size", fontSize);
        },
        toggleGrid: function (e) {
            if (this.model.get("isGridToggle")) {
                this.el.find(".Addgridsquare").css("border-bottom", "1px solid #f1f1f1").css("border-right", "1px solid #f1f1f1");
                this.el.find("#row1").parent().css("border-left", "1px solid #f1f1f1").css("border-top", "1px solid #f1f1f1");

            } else {
                this.el.find(".Addgridsquare").css("border-bottom", "none").css("border-right", "none");
                this.el.find("#row1").parent().css("border-left", "none").css("border-top", "none");

            }
            this.el.find("#r2c" + this.model.get("divisor").length).css("border-right", "1px solid #000");
        },
        toggleSteps: function () {
            if (this.model.get("isStepsToggle")) {
                this.el.find(".extraStepFields").parent().parent().css("display", "block");
            } else {
                this.el.find(".extraStepFields").parent().parent().css("display", "none");
            }
        },
        addExtraColumns: function () {
            if (this.model.get("isAddExtraColumns")) {
                uiSetting.createGrid(this.el, this.model.toJSON());
            } else {
                uiSetting.createGrid(this.el, this.model.toJSON());
            }
        },
        render: function () {
            console.log("render called");
            uiSetting.createGrid(this.el, this.model.toJSON());
            this.fontSize(undefined);
        },
        options: function () {
            var temp, options = this.model.get("options"), str = '';
            if (this.model.get("category") == "Options") {
                if (options instanceof Array) {
                    temp = options;
                } else {
                    temp = options.split(",");
                }
                for (var i = 0; i < temp.length; i++) {
                    str = str + '<option value="' + temp[i] + '">' + temp[i] + '</option>';
                }
                this.el.find('select').html(str);
            }
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
            this.deleted = true;
        },
        updateModel: function () {
            var a = this.el, b, val = [];
            a.find(".dividendField").each(function () {
                b = $(this);
                val.push(b.val());

            });
            this.model.set({
                dividendFields: val
            }, {
                silent: true
            });
            this.model.set("authorAttempt", this.getScreenInput());
            this.model.set({left: parseInt(a.css('left')), top: parseInt(a.css('top'))}, {silent: true});
        },
        getScreenInput: function () {
            var o = this;
            var quotientField = [], firstSetOfStepFields = [], remainderFields = [], extraStepFields = [];

            o.el.find('.quotientField').each(function () {
                quotientField.push($(this).val());
            });

            o.el.find('.firstSetOfStepFields').each(function () {
                firstSetOfStepFields.push($(this).val());
            });

            o.el.find('.remainderFields').each(function () {
                remainderFields.push($(this).val());
            });

            if (o.model.get("isStepsToggle")) {
                o.el.find('.extraStepFields').each(function () {
                    extraStepFields.push($(this).val());
                });
            }

            return {quotientField: quotientField, firstSetOfStepFields: firstSetOfStepFields, remainderFields: remainderFields, extraStepFields: extraStepFields};
        },
        setScreenInput: function () {
            var o = this, userAttempt = o.model.get('userAttempt');
            var firstSetOfStepFields = userAttempt.firstSetOfStepFields, quotientField = userAttempt.quotientField, remainderFields = userAttempt.remainderFields, extraStepFields = userAttempt.extraStepFields;
            o.el.find('.firstSetOfStepFields').each(function (index) {//this is for 1st carry applicable for addition.
                firstSetOfStepFields.push($(this).val(firstSetOfStepFields[index]));
            });

            o.el.find('.remainderFields').each(function (index) {//this is for 1st carry applicable for addition.
                remainderFields.push($(this).val(remainderFields[index]));
            });

            o.el.find('.quotientField').each(function (index) {//this is for 1st carry applicable for addition.
                quotientField.push($(this).val(quotientField[index]));
            });
            if (o.model.get("isStepsToggle")) {
                o.el.find('.extraStepFields').each(function (index) {
                    extraStepFields.push($(this).val(extraStepFields[index]));
                });
            }
        },
        checkAnswer: function () {
            //this.model.set("userAttempt", this.getScreenInput());
            return this.model.check();
        },
        updateUserAnswer: function () {
            var userAttempt = this.getScreenInput();
            this.model.set("userAttempt", userAttempt);
            return userAttempt;
        },
        updateUserAnswerWithVal: function (val) {
            this.model.set("userAttempt", val);
        },
        typeCheck: function (k) {
            return app.isDecimal(k);
        },
        reset: function () {
            this.el.find('input').val('');
        },
        correctVisual: function () {
            return !0;
        },
        wrongVisual: function () {
            return !1;
        },
        activate: function () {
            this.active = true;
            this.el.find("input").removeAttr("disabled");
        },
        deactivate: function () {
            this.active = false;
            this.el.find("input").attr("disabled", "disabled");
        },
        revealAnswer: function () {
            var answers = this.model.get("authorAttempt");
            if (answers.quotientField) {
                var ansList = this.el.find(".quotientField");
                var AnsAns = answers.quotientField;
                for (var i = 0; i < AnsAns.length; i++) {
                    ansList[i].value = AnsAns[i];
                }
            }

            if (answers.firstSetOfStepFields) {
                var ansList = this.el.find(".firstSetOfStepFields");
                var AnsAns = answers.firstSetOfStepFields;
                for (var i = 0; i < AnsAns.length; i++) {
                    ansList[i].value = AnsAns[i];
                }
            }

            if (answers.remainderFields) {
                var ansList = this.el.find(".remainderFields");
                var AnsAns = answers.remainderFields;
                for (var i = 0; i < AnsAns.length; i++) {
                    ansList[i].value = AnsAns[i];
                }
            }

            if (answers.extraStepFields) {
                var ansList = this.el.find(".extraStepFields");
                var AnsAns = answers.extraStepFields;
                for (var i = 0; i < AnsAns.length; i++) {
                    ansList[i].value = AnsAns[i];
                }
            }
        }
    });
    var uiSetting = {
        seperator: "|",
        authorParent: "author_content_container",
        widthDifference: Role == "author" ? 10 : 0,
        heightDifference: 6,
        resizeAndDrag: function (el, resizeSetting, draggableSetting) {
            typeof draggableModule != "undefined" && draggableModule.makeDraggable(el);
        },
        createGrid: function (el, data) {
            $(el).empty();
            var str = '';
            var dividend = data.dividend;
            var divisor = data.divisor;
            var divisionArc = 0;
            var answerRow = 1, questionRow = 1, firstSingleStepRow = 1, remainderRow = 1;
            var extraSetOfSteps = parseInt(data.numberOfSetOfExtraSteps) * 2;
            var noOfRow = data.rowCount = answerRow + questionRow + firstSingleStepRow + remainderRow + extraSetOfSteps;
            var extraColumns = 4;
            var noOfColumn;
            var digits = divisor + dividend;
            var tempExtraDividendDigits = [];

            //if extra columns are to be added 
            if (data.isAddExtraColumns) {
                noOfColumn = data.columnCount = dividend.length + divisor.length + divisionArc + extraColumns;
            } else {
                noOfColumn = data.columnCount = dividend.length + divisor.length + divisionArc;
            }

            //creating grid for division component
            function getColumn(r, c) {
                var p = '';
                //checking to disable grid if data is entered after unchecking the grid checkbox
                if (data.isGridToggle) {
                    for (var j = 0; j < c; j++) {
                        p = p + '<div id="r' + i + 'c' + (j + 1) + '" class="Addgridsquare"></div>';
                    }
                } else {
                    for (var j = 0; j < c; j++) {
                        p = p + '<div id="r' + i + 'c' + (j + 1) + '" class="Addgridsquare" style="border-bottom:none;border-right:none;"></div>';
                    }
                }
                return p;
            }

            for (var i = 1; i <= noOfRow; i++) {
                str = str + '<div id="row' + i + '" class="colCount' + data.columnCount + '" style="width: ' + data.columnCount * 41 + 'px ">' + getColumn(i, noOfColumn) + '</div><div class="clearRow" style="clear:left;"></div>';
            }

            $(el).append(str);


            if (data.isAddExtraColumns) {
                for (var j = (divisor.length + 1); j <= (digits.length + 4); j++) {
                    //inserting quotient fields
                    $(el).find("#r1c" + j).append('<input id="#r1c' + j + '" class="quotientField" type="text" maxlength="1" >');

                    //inserting first set of step fields
                    $(el).find("#r3c" + j).append('<input id="#r3c' + j + '" class="firstSetOfStepFields" type="text" maxlength="1" >');

                    //inserting remainder fields
                    $(el).find("#r" + noOfRow + "c" + j).append('<input id="#r4c' + j + '" class="remainderFields" type="text" maxlength="1" >');

                    //inserting line over remainder fields
                    $(el).find("#r" + noOfRow + "c" + j).css("border-top", "1px solid #000");

                    //inserting set of extra steps
                    if (extraSetOfSteps != 0) {
                        for (var k = 4, m = 0; m < extraSetOfSteps; k++, m++) {
                            $(el).find("#r" + k + "c" + j).append('<input id="#r' + k + 'c' + j + '" class="extraStepFields" type="text" maxlength="1" >');
                            if (k % 2 == 0) {
                                $(el).find("#r" + k + "c" + j).css("border-top", "1px solid black");
                            }
                        }
                    }
                }
            } else {
                for (var j = (divisor.length + 1); j <= (digits.length); j++) {
                    //inserting quotient fields
                    $(el).find("#r1c" + j).append('<input id="#r1c' + j + '" class="quotientField" type="text" maxlength="1" >');

                    //inserting first set of step fields
                    $(el).find("#r3c" + j).append('<input id="#r3c' + j + '" class="firstSetOfStepFields" type="text" maxlength="1" >');

                    //inserting remainder fields
                    $(el).find("#r" + noOfRow + "c" + j).append('<input id="#r4c' + j + '" class="remainderFields" type="text" maxlength="1" >');

                    //inserting line over remainder fields
                    $(el).find("#r" + noOfRow + "c" + j).css("border-top", "1px solid #000");

                    //inserting set of extra steps
                    if (extraSetOfSteps != 0) {
                        for (var k = 4, m = 0; m < extraSetOfSteps; k++, m++) {
                            $(el).find("#r" + k + "c" + j).append('<input id="#r' + k + 'c' + j + '" class="extraStepFields" type="text" maxlength="1" >');
                            if (k % 2 == 0) {
                                $(el).find("#r" + k + "c" + j).css("border-top", "1px solid black");
                            }
                        }
                    }
                }
            }

            //inserting line on top of dividend connecting arc
            if (data.isAddExtraColumns) {
                for (j = (divisor.length + 1); j <= (digits.length + 4); j++) {
                    $(el).find("#r2c" + j).css("border-top", "1px solid #000");
                }
                var dividendVal;
                //adding fields in dividend row in case of extending decimals
                var diviIndex = 0;
                for (var k = (dividend.length + divisor.length + 1); k <= (digits.length + 4); k++) {
                    dividendVal = '';
                    if (data.dividendFields[diviIndex] != undefined) {
                        dividendVal = data.dividendFields[diviIndex];
                    }
                    $(el).find("#r2c" + k).append('<input id="r2c' + k + '" class="dividendField" type="text" maxlength="1" value="' + dividendVal + '">');
                    diviIndex++;
                }
            } else {
                for (j = (divisor.length + 1); j <= (digits.length); j++) {
                    $(el).find("#r2c" + j).css("border-top", "1px solid #000");
                }
            }



            insertData(el, dividend, divisor, noOfRow, noOfColumn, divisionArc, data.isStepsToggle, data.isAddExtraColumns);

            if (app ? app.detect.isAndroid() : navigator.userAgent.match(/Android/i)) {
                el.find('input.extraStepFields, input.firstSetOfStepFields, input.remainderFields').attr("maxlength", "1").keyup(function (event) {
                    var ob = this;
                    var invalidChars = /[^0-9]/gi;
                    if (invalidChars.test(ob.value)) {
                        ob.value = ob.value.replace(invalidChars, "");
                    }
                });
            } else {
                el.find('input.extraStepFields, input.firstSetOfStepFields, input.remainderFields').attr("maxlength", "1").on("keypress", function (e) {
                    var AllowableCharacters = '1234567890';
                    var k = document.all ? parseInt(e.keyCode) : parseInt(e.which);
                    if (k != 13 && k != 8 && k != 0) {
                        if ((e.ctrlKey == false) && (e.altKey == false)) {
                            return (AllowableCharacters.indexOf(String.fromCharCode(k)) != -1);
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                });
            }
            if (app ? app.detect.isAndroid() : navigator.userAgent.match(/Android/i)) {
                el.find('input.dividendField, input.quotientField').attr("maxlength", "1").keyup(function (event) {
                    var ob = this;
                    var invalidChars = /[^0-9]/gi;
                    if (invalidChars.test(ob.value)) {
                        ob.value = ob.value.replace(invalidChars, "");
                    }
                });
            } else {
                el.find('input.dividendField, input.quotientField').attr("maxlength", "1").on("keypress", function (e) {
                    var AllowableCharacters = '1234567890.';
                    var k = document.all ? parseInt(e.keyCode) : parseInt(e.which);
                    if (k != 13 && k != 8 && k != 0) {
                        if ((e.ctrlKey == false) && (e.altKey == false)) {
                            return (AllowableCharacters.indexOf(String.fromCharCode(k)) != -1);
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                });
            }


        },
        getWidgetTemplate: function (data, mode) {
            var str = '<div id=' + data.id + ' class="divisionWidget" style="position:absolute;left:' + data.left + 'px;top:' + data.top + 'px;"></div>';
            return str + '';
        },
        applyAuthorRelatedProperty: function (el, _this) {
            uiSetting.resizeAndDrag(el, {callback: function () {   //applying resizing and draggable to widget
                }, context: _this});
        }
    },
    popupManager = {
        popupInitialSetting: {
            popId: 'divisionWidget_pop_singleton',
            labels: ["Type", "Answer", "Left", "Top", "Height", "Width", "Length"],
            inputName: [
                {id: "divisor", type: "text", label: "Divisor"},
                {id: "dividend", type: "text", label: "Dividend"},
                {id: "numberOfSetOfExtraSteps", type: "text", label: "Number of steps"},
                {id: "isGridToggle", type: "checkbox", value: "true", label: "Show grid"},
                {id: "isAddExtraColumns", type: "checkbox", value: "true", label: "Add columns"},
                {id: "fontSize", type: "select", options: "18pt|17pt|16pt|15pt|14pt|13pt|12pt|11pt|10pt|9pt|8pt", label: "Font size"},
                {id: "left", type: "text", label: "Left"},
                {id: "top", type: "text", label: "Top"},
                /*{id: "isStepsToggle", type: "checkbox", value: "true", label: "Show/Hide Steps"},*/
            ],
            buttonList: [
                {id: "submit", html: "Submit"},
                {id: "clearAllGraph", html: "Clear All"},
                {id: "removeElement", html: "Remove"},
                {id: "closeGraphpopup", html: "Close"},
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
            $('#popup-overlay-add').remove();
        },
        createPop: function () {
            getConfigurationWindow(this.popupInitialSetting, $('#' + uiSetting.authorParent));
        },
        show: function (view, context) {
            this.updatePopFields(view);

            $('#popup-overlay-add').css('display', 'block');
            var p = $("#" + popupManager.popupInitialSetting.popId);

            p.find("#add-validation-message").html(""); //making empty 
            p.find("#add-validation-message2").html(""); //making empty 

            p.find('#submit[type="button"]').attr('disabled', false); //enabling submit 

            p.css("display", "block");
            p.find('#submit').off('click').on('click', {view: view}, popupManager.updateWidget);
            p.find("#removeElement").off('click').on('click', context.destroy);
            p.find("#clearAllGraph").off('click').on('click', {view: view}, popupManager.clearAll);

            //validation
            p.find('#dividend').keyup(function () {
                var tempCheck = [], tempCheck2 = [];
                //alert(p.find('#questionOption').val());
                if (typeof p.find('#dividend').val() === "string") {

                    tempCheck = p.find('#dividend').val();
                    tempCheck = tempCheck.split(",");
                }

                for (var j = 0; j < tempCheck.length; j++) {
                    if (tempCheck[j] !== '') {
                        tempCheck2.push(tempCheck[j]);
                    }
                }
                if (tempCheck2.length < 1) {
                    p.find("#add-validation-message").html("Please enter the dividend").addClass("validation-msg");
                    p.find('#submit[type="button"]').attr('disabled', true);
                } else {
                    p.find("#add-validation-message").html("");
                    p.find('#submit[type="button"]').attr('disabled', false);
                }
            });

            p.find('#divisor').keyup(function () {
                var tempCheck = [], tempCheck2 = [];
                //alert(p.find('#questionOption').val());
                if (typeof p.find('#divisor').val() === "string") {

                    tempCheck = p.find('#divisor').val();
                    tempCheck = tempCheck.split(",");
                }

                for (var j = 0; j < tempCheck.length; j++) {
                    if (tempCheck[j] !== '') {
                        tempCheck2.push(tempCheck[j]);
                    }
                }
                if (tempCheck2.length < 1) {
                    p.find("#add-validation-message2").html("Please enter the divisor.").addClass("validation-msg");
                    p.find('#submit[type="button"]').attr('disabled', true);
                } else {
                    p.find("#add-validation-message2").html("");
                    p.find('#submit[type="button"]').attr('disabled', false);
                }
            });

            if (app ? app.detect.isAndroid() : navigator.userAgent.match(/Android/i)) {
                p.find('input#divisor').keyup(function (event) {
                    var ob = this;
                    var invalidChars = /[^0-9]/gi;
                    if (invalidChars.test(ob.value)) {
                        ob.value = ob.value.replace(invalidChars, "");
                    }
                });
            } else {
                p.find('input#divisor').on("keypress", function (e) {
                    var AllowableCharacters = '1234567890.';
                    var k = document.all ? parseInt(e.keyCode) : parseInt(e.which);
                    if (k != 13 && k != 8 && k != 0) {
                        if ((e.ctrlKey == false) && (e.altKey == false)) {
                            return (AllowableCharacters.indexOf(String.fromCharCode(k)) != -1);
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                });
            }

            if (app ? app.detect.isAndroid() : navigator.userAgent.match(/Android/i)) {
                p.find('input#dividend').keyup(function (event) {
                    var ob = this;
                    var invalidChars = /[^0-9]/gi;
                    if (invalidChars.test(ob.value)) {
                        ob.value = ob.value.replace(invalidChars, "");
                    }
                });
            } else {
                p.find('input#dividend').on("keypress", function (e) {
                    var AllowableCharacters = '1234567890.';
                    var k = document.all ? parseInt(e.keyCode) : parseInt(e.which);
                    if (k != 13 && k != 8 && k != 0) {
                        if ((e.ctrlKey == false) && (e.altKey == false)) {
                            return (AllowableCharacters.indexOf(String.fromCharCode(k)) != -1);
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                });
            }

        },
        updateWidget: function (e) {
            var m = e.data.view.model;
            var p = $('#' + popupManager.popupInitialSetting.popId);
            var s = popupManager.popupInitialSetting.inputName;

            for (var i = 0; i < s.length; i++) {
                if (s[i].type == "checkbox") {
                    m.set(s[i].id, p.find("#" + s[i].id).is(":checked"));
                } else {
                    m.set(s[i].id, p.find('#' + s[i].id).val());
                }
            }
            popupManager.hide();
        },
        clearAll: function (e) {
            e.data.view.reset();
            popupManager.hide();
        },
        updatePopFields: function (view) {
            var setting = view.model;
            var p = $('#' + popupManager.popupInitialSetting.popId);
            var s = popupManager.popupInitialSetting.inputName;
            for (var i = 0; i < s.length; i++) {
                if (s[i].id == "left" || s[i].id == "top" || s[i].id == "margin_h_line" || s[i].id == "margin_v_line") {
                    p.find('#' + s[i].id).val(parseInt(setting.get([s[i].id])) + "px");
                } else if (s[i].type == "checkbox") {
                    p.find("#" + s[i].id)[0].checked = setting.get([s[i].id]);
                } else {
                    p.find('#' + s[i].id).val(setting.get([s[i].id]));
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
            $('#popup-overlay-add').css('display', 'none');
            $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
        }
    };

    function insertData(el, dividend, divisor, rows, columns, divisionArc, noOfExtraSteps) {
        //var digits = divisor + dividend;
        var i = 0, j = 1;

        //inserting divisor into cells
        for (i, j; j <= divisor.length; j++, i++) {
            $(el).find("#r2c" + j).append('<div class="digit">' + divisor[i] + '</div>');
        }

        //inserting the arc
        //$(el).find("#r2c" + j).append('<div id="arc" class="digit"></div>');
        //j++;

        //inserting divisor arc straight line 
        $(el).find("#r2c" + divisor.length).css("border-right", "1px solid #000");

        //inserting the dividend
        for (i = 0, j; i < dividend.length; j++, i++) {
            $(el).find("#r2c" + j).append('<div class="digit">' + dividend[i] + '</div>');
        }

    }

    function getConfigurationWindow(setting, parent) {
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
        var inputType = setting.inputName || [],
                buttonList = setting.buttonList || [];
        var a = '<div class="popup-overlay" id="popup-overlay-add"></div><div id="' + setting.popId + '" class="popup_container">';
        for (var i = 0; i < inputType.length; i++) {
            a = a + '<div class="pop-row">';
            a = a + '<label>' + inputType[i].label + '</label>';
            if (inputType[i].type == "select") {
                a = a + makeSelect(inputType[i]);
            } else {
                a = a + '<input type="' + inputType[i].type + '" id="' + inputType[i].id + '" value="' + inputType[i].value + '">';
            }
            a = a + '</div>';
        }

        a = a + '<div id="add-validation-message"></div><div id="add-validation-message2"></div>';



        for (var x = 0; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
        }
        $(parent).append(a + '</div>');
        $('#' + setting.popId).find('#closeGraphpopup').on("click", popupManager.hide.bind(popupManager));
    }

    function divisionWidget(options) {
        /*defining all variable at once*/
        var _this = this, cSetting = {}, authParent, tView;
        /*Default setting of widget*/
        function init() {
            var el;
            var hash = '#';
            cSetting = $.extend({}, defaultSetting, options); //current setting based on options provided in instance making.
            cSetting.id = cSetting.id || ('AW_' + Date.now());
            authParent = $(hash + uiSetting.authorParent);
            if (typeof authParent[0] === "undefined") {
                throw "Parent Element is Undefined";
            }
            //    _this.active = true;
            //  _this.deleted = false;
            authParent.append(uiSetting.getWidgetTemplate(cSetting, Role));//appending widget html template
            el = authParent.find(hash + cSetting.id);
            uiSetting.createGrid(el, cSetting);
            tView = new view({model: new model(cSetting), el: authParent.find(hash + cSetting.id)});
            if (Role === "author") {
                uiSetting.applyAuthorRelatedProperty(tView.el, _this);
                popupManager.updateStatus('+');
                tView.el.bind('dblclick', {view: tView, context: _this}, function (e) {
                    e.data.view.updateModel();
                    popupManager.show(e.data.view, e.data.context);
                });
                tView.revealAnswer();
            }
        }
        init();
        /*
         *Api implementations for widget are here
         *
         */
        /*this will remove the widget from the screen*/
        this.destroy = function () {
            if (!tView.deleted) {
                //tView.deleted = true;
                tView.destroy();
                popupManager.updateStatus('-');
            }
        };
        /*This will reset the widget to its initial settings*/
        this.reset = function () {
            if (!tView.deleted) {
                tView.active && tView.reset();
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
            var result;
            if (!tView.deleted) {
                result = tView.checkAnswer();
                if (type === "specific") {
                    tView.revealAnswer();
                    this.deactivate();
                }
                return  result;
            }
            return undefined
        };
        /*It will give the all data associated with the widget*/
        this.getWidgetData = function () {
            if (!tView.deleted) {
                tView.updateModel();
                return tView.model.toJSON();
            }
            return undefined
        };
        /*This will bring all the user input as each level of feedback*/
        this.getUserAnswer = function () {
            if (!tView.deleted) {
                return tView.updateUserAnswer();
            }
            return undefined;
        };
        /*This will set the user answer*/
        this.setUserAnswer = function (val) {
            if (!tView.deleted) {
                tView.updateUserAnswerWithVal(val);
                tView.setScreenInput();
                return true;
            }
            return undefined;
        };
        
        /*This will reveal the answers*/
        this.revealAnswer = function () {
            if (!tView.deleted) {
                tView.revealAnswer();
                return true;
            }
            return undefined;
        };

        this.getWidgetType = function () {
            return cSetting.widgetType;
        };

        this.deactivate = function () {
            if (!tView.deleted) {
                //   tView.active = false;
                tView.deactivate();
            }
        };
        this.activate = function () {
            if (!tView.deleted) {
                //tView.active = true;
                tView.activate();
            }
        };

    }

    divisionWidget.prototype.deactivate = function () {
        this.active = false;
    };
    divisionWidget.prototype.activate = function () {
        this.active = true;
    };

    divisionWidget.prototype.toString = function () {
        return "This is Division Widget";
    };
    return divisionWidget;
})(window);