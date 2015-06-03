/**
 * Created by pallav.saxena on 4/4/2014.
 */
var additionWidget = (function (o) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var defaultSetting = {
        widgetType: "additionWidget",
        questionOption: "234.15,70",
        left: 100,
        top: 100,
        id: "",
        isUnitLabelAllow: true,
        isGridToggle: true,
        isCarryAllow: true,
        isFullAbbreviationAllowed: false,
        rowCount: 5,
        columnCount: 7,
        fontSize: "11pt", //font size
        maxDecimalLength: 2,
        dollarExists: 0,
        centExists: 0,
        symbol: '+',
        userAttempt: {},
        authorAttempt: {}
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
            var count = 0;
            for (var i = 0; i < uA.carryField.toString().length; i++) {
                if (uA.carryField.toString().split(",")[i] !== '') {
                    count++;
                }
            }

            if (count == 0) {
                return uA.answerField.toString() == aA.answerField.toString();
            } else {
                return uA.carryField.toString() == aA.carryField.toString() && uA.answerField.toString() == aA.answerField.toString();
            }
        }
    });
    var view = Backbone.View.extend({
        initialize: function (options) {
            var o = this;
            o.el = options.el;
            o.model = options.model;
            o.model.on("change:left", o.left.bind(o));
            o.model.on("change:top", o.top.bind(o));
            o.model.on("change:questionOption", o.render.bind(o));
            o.model.on("change:isUnitLabelAllow", o.toggleUnitLabel.bind(o));
            o.model.on("change:isGridToggle", o.toggleGrid.bind(o));
            o.model.on("change:isCarryAllow", o.toggleCarryAllow.bind(o));
            o.model.on("change:fontSize", o.fontSize.bind(o));
            o.model.on("change:isFullAbbreviationAllowed", o.toggleFullAbbreviationAllowed.bind(o));
            o.deleted = false;
            o.active = true;
            o.toggleGrid(undefined);
            o.toggleCarryAllow(undefined);
            o.toggleUnitLabel(undefined);
            o.toggleFullAbbreviationAllowed(undefined);
            o.fontSize(undefined);
            o.el.find('input').blur(function () {
                o.updateUserAnswer();
            });
            //o.el.delegate("input","keypress",o.applyLength.bind(o));
            //o.el.find('input').on('change', o.applyLength.bind(o));	
        },
        fontSize: function () {
            var fontSize = this.model.get("fontSize");
            var carryFontSize = parseInt(fontSize, 10) - 2;
            this.el.find("input.carryField").css("font-size", carryFontSize + 'pt');
            this.el.find("input.answerField").css("font-size", fontSize);
            this.el.find(".digit").css("font-size", fontSize);
            this.el.find("#row1 .digit").css("font-size", "inherit");
        },
        toggleUnitLabel: function () {
            if (this.model.get("isUnitLabelAllow")) {
                this.el.find("#row1").css("display", "block");
                this.el.find("#row2").css("border-top", "none");
            } else {
                this.el.find("#row1").css("display", "none");
            }

        },
        toggleCarryAllow: function () {
            if (this.model.get("isCarryAllow")) {
                this.el.find("#row2").css("display", "block");
                this.el.find("#row3").css("border-top", "none");
            } else {
                this.el.find("#row2").css("display", "none");
            }
        },
        toggleFullAbbreviationAllowed: function () {
            var columns = this.model.get("columnCount"), dollarExists = this.model.get("dollarExists"), centExists = this.model.get("centExists"), maxDecimalLength = this.model.get("maxDecimalLength"), x = columns - 2 - maxDecimalLength, y = columns - maxDecimalLength;
            if (dollarExists == 1) {
                x--;
            }
            if (centExists == 1) {
                x--;
                y--;
            }
            if (maxDecimalLength > 0) {
                x--;
                y--;
            }
            var tempCol = columns;
            var width;
            var colorList = ['#2BC0E0', '#8490C8', '#F17192', '#F8941C', '#A6CE38', '#2DB48D', '#2184C6', '#C76CAB', '#CE9D7A', '#7B757E', '#2BC0E0'];
            var colorList2 = ['#49669E', '#C74968', '#CA6C1D', '#49669E'];
            for (var i = 0; i < columns; i++) {
                this.el.find("#r1c" + (columns - i)).children().remove();
            }

            if (this.model.get("isFullAbbreviationAllowed")) {
                var colWidth = 91;
                var LabelList1 = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten thousands', 'Hundred thousands', 'Millions', 'Ten millions', 'Hundred millions', 'Billions', 'Ten billions'];
                var LabelList2 = ['Tenths', 'Hundredths', 'Thousandths', 'Ten thousandths'];
                this.el.find(".col").removeClass("Addgridsquare");
                this.el.find(".col").addClass("AddgridsquareFull");
            } else {
                var colWidth = 41;
                var LabelList1 = ['O', 'T', 'H', 'Th', 'T Th', 'H Th', 'M', 'T M', 'H M', 'B', 'T B'];
                var LabelList2 = ['Tth', 'Hth', 'Thth', 'T Thth'];
                this.el.find(".col").removeClass("AddgridsquareFull");
                this.el.find(".col").addClass("Addgridsquare");
            }
            var str = '<div class="digit">';
            var width = (columns * colWidth) + "px";
            this.el.find(".row").css("width", width);
            this.el.find("input.carryField").css("width", colWidth + "px");
            this.el.find("input.answerField").css("width", colWidth + "px");
            for (var i = 0; i < x; i++) {
                this.el.find("#r1c" + (y)).append(str + LabelList1[i] + '<div>').css("background-color", colorList[i]);
                y--;
            }


            if (centExists == 1) {
                tempCol--;
            }
            for (var j = maxDecimalLength - 1; j >= 0; j--) {
                this.el.find("#r1c" + (tempCol)).append(str + LabelList2[j] + '<div>').css("background-color", colorList2[j]);
                tempCol--;
            }
        },
        toggleGrid: function (e) {
            if (this.model.get("isGridToggle")) {
                this.el.find(".Addgridsquare").css("border-bottom", "1px solid #f1f1f1").css("border-right", "1px solid #f1f1f1");
                this.el.find("#row1").parent().css("border-left", "1px solid #f1f1f1").css("border-top", "1px solid #f1f1f1");
                this.el.find(".AddgridsquareFull").css("border-bottom", "1px solid #f1f1f1").css("border-right", "1px solid #f1f1f1");
            } else {
                this.el.find(".Addgridsquare").css("border-bottom", "none").css("border-right", "none");
                this.el.find("#row1").parent().css("border-left", "none").css("border-top", "none");
                this.el.find(".AddgridsquareFull").css("border-bottom", "none").css("border-right", "none");
            }
        },
        render: function () {
            console.log("render called");
            uiSetting.createGrid(this.el, this.model.attributes);
            this.toggleFullAbbreviationAllowed(undefined);
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
            var a = this.el;
            this.model.set("authorAttempt", this.getScreenInput());
            this.model.set({left: parseInt(a.css('left')), top: parseInt(a.css('top'))}, {silent: true});
        },
        getScreenInput: function () {
            var o = this;
            var carryField = [], answerField = [];
            if (this.model.get("isCarryAllow")) {
                o.el.find('.carryField').each(function () {//this is for 1st carry applicable for addition.
                    carryField.push($(this).val());
                });
            }

            if (this.model.get("isFullAbbreviationAllowed")) {

            }

            o.el.find('.answerField').each(function () {//this is for 1st carry applicable for addition.
                answerField.push($(this).val());
            });
            return {answerField: answerField, carryField: carryField};
            //o.model.set("authorAttempt",{answerField:answerField,carryField:carryField});
        },
        setScreenInput: function () {
            var o = this, userAttempt = o.model.get('userAttempt');
            var carryField = userAttempt.carryField, answerField = userAttempt.answerField;
            if (this.model.get("isCarryAllow")) {
                o.el.find('.carryField').each(function (index) {//this is for 1st carry applicable for addition.
                    carryField.push($(this).val(carryField[index]));
                });
            }

            if (this.model.get("isFullAbbreviationAllowed")) {

            }

            o.el.find('.answerField').each(function (index) {//this is for 1st carry applicable for addition.
                answerField.push($(this).val(answerField[index]));
            });
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
        /*applyLength: function (e) {
         return (e.target.value.length < this.model.get("charLimit") && this.typeCheck(e.which)) ? true : false;
         },*/
        typeCheck: function (k) {
            /*   var r = !1;
             if u(this.model.get("type") === "freeText") {
             r = true;
             } else if (this.model.get("type") === "numeric") {
             r = app.isDecimal(k);
             }
             return r;
             */
            return app.isDecimal(k);
        },
        reset: function () {
            //  this.model.reset();
            this.el.find('input').val('');
        },
        correctVisual: function () {
            //this.el.css("border", "2px solid green");
            return !0;
        },
        wrongVisual: function () {
            //this.el.css("border", "2px solid red");
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
            // var result = this.checkAnswer();
            var answers = this.model.get("authorAttempt");
            if (this.model.get("isCarryAllow")) {
                if (answers.carryField) {
                    var carryList = this.el.find(".carryField");
                    var carryAns = answers.carryField;
                    for (var i = 0; i < carryAns.length; i++) {
                        carryList[i].value = carryAns[i];
                    }
                }
            }
            if (answers.answerField) {
                var ansList = this.el.find(".answerField");
                var AnsAns = answers.answerField;
                for (var i = 0; i < AnsAns.length; i++) {
                    ansList[i].value = AnsAns[i];
                }
            }
            //return result;
        }
    });
    var uiSetting = {
        seperator: "|",
        authorParent: "author_content_container",
        widthDifference: Role == "author" ? 10 : 0,
        heightDifference: 6,
        resizeAndDrag: function (el, resizeSetting, draggableSetting) {
            //  typeof resizeModule != "undefined" && resizeModule.makeResize(el, resizeSetting.callback, resizeSetting.context);
            typeof draggableModule != "undefined" && draggableModule.makeDraggable(el);
        },
        createGrid: function (el, data) {
            $(el).empty();
            var str = '';
            var qLIst = data.questionOption;
            var carryRow = 1, UnitRow = 1, AnswerRow = 1, symbolCol = 1, extraCol = 1, dollarColumn = 0, centColumn = 0;
            var decimalLengthContainerInitial = [];
            var decimalLengthInitial;
            var listWhole = [];
            var maxDecimal = 0, maxWhole;
            var temp = [];
            var dec = 0;
            var dollarExists = 0, centExists = 0;
            var tagDollar = [], tagCent = [];
            //checking if data is string and then splitting it with ,
            if (typeof data.questionOption === "string") {
                qLIst = data.questionOption.split(",");
            }



            //putting the question numbers in a temporary array after eliminating ' ' (spaces encountered)  
            for (var j = 0; j < qLIst.length; j++) {
                if (jQuery.inArray("$", qLIst[j], 0) == 0) {
                    var numberWithoutDollar = qLIst[j].slice(1, qLIst[j].length);
                    qLIst[j] = numberWithoutDollar;
                    dollarExists = 1;
                    dollarColumn = 1;
                    tagDollar[j] = j;
                }

                var lastChar;
                lastChar = qLIst[j].substr(qLIst[j].length - 1);
                if (lastChar == '¢') {
                    var numberWithoutCent = qLIst[j].slice(0, qLIst[j].length - 1);
                    /*alert("numberwithoutcent"+qLIst[j].substr(0, qLIst[j].length - 1));*/
                    qLIst[j] = numberWithoutCent;
                    centExists = 1;
                    centColumn = 1;
                    tagCent[j] = j;
                }

                if (qLIst[j] !== '') {
                    temp.push(qLIst[j]);
                }
            }

            //restoring the list back in to the same variable used without the spaces now 
            qLIst = temp;
            for (var i = 0; i < qLIst.length; i++) {
                listWhole.push(Math.round(qLIst[i]));
                if (Math.floor(parseFloat(qLIst[i])) !== parseFloat(qLIst[i])) {
                    decimalLengthInitial = qLIst[i].toString().split(".")[1].length || 0;
                    decimalLengthContainerInitial.push(decimalLengthInitial);
                    maxDecimal = Math.max.apply(Math, decimalLengthContainerInitial);
                }

                if (!(isNaN(qLIst[i]) || qLIst[i].indexOf(".") < 0)) {
                    dec++;
                }
            }
            maxWhole = Math.max.apply(Math, listWhole).toString().length;
            if (dec == 0) {
                maxDecimal = 0;
            } else {
                maxDecimal = Math.max.apply(Math, decimalLengthContainerInitial);
            }

            if (!isFinite(maxDecimal)) {
                maxDecimal = 1;
            }

            data.maxDecimalLength = maxDecimal;
            data.dollarExists = dollarExists;
            data.centExists = centExists;
            var noOfRow = data.rowCount = qLIst.length + carryRow + UnitRow + AnswerRow;
            /*var noOfColumn = data.columnCount = _.max(_.map(qLIst, function (q) {
             return q.length;
             })) + symbolCol;*/

            //var noOfColumn = data.columnCount = maxWhole + maxDecimal + symbolCol + extraRow;
            var sum = 0;
            $.each(qLIst, function () {
                sum += parseFloat(this) || 0;
            });
            sum = sum.toFixed(maxDecimal);
            var noOfColumn = data.columnCount = (sum.toString().length) + symbolCol + dollarColumn + centColumn + extraCol;
            function getColumn(r, c) {
                var p = '';
                //checking to disable grid if data is entered after unchecking the grid checkbox
                if (data.isGridToggle) {
                    for (var j = 0; j < c; j++) {
                        p = p + '<div id="r' + i + 'c' + (j + 1) + '" class="col"></div>';
                    }
                } else {
                    for (var j = 0; j < c; j++) {
                        p = p + '<div id="r' + i + 'c' + (j + 1) + '" class="col" style="border-bottom:none;border-right:none;"></div>';
                    }
                }

                return p;
            }

            for (var i = 1; i <= noOfRow; i++) {
                str = str + '<div id="row' + i + '" class="row" style="width: ' + data.columnCount * 41 + 'px ">' + getColumn(i, noOfColumn) + '</div><div class="clearRow" style="clear:left;"></div>';
            }
            $(el).append(str);
            insertData(el, qLIst, centExists, tagCent, tagDollar, noOfRow, noOfColumn, data.symbol, data.isUnitLabelAllow, data.isCarryAllow, data.isFullAbbreviationAllowed, dollarExists, maxDecimal);
            if (app ? app.detect.isAndroid() : navigator.userAgent.match(/Android/i)) {
                el.find('input').attr("maxlength", "1").keyup(function (event) {
                    var ob = this;
                    var invalidChars = /[^0-9]/gi;
                    if (invalidChars.test(ob.value)) {
                        ob.value = ob.value.replace(invalidChars, "");
                    }
                });
            } else {
                el.find('input').attr("maxlength", "1").on("keypress", function (e) {
                    var AllowableCharacters = '1234567890.$,¢';
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
            var str = '<div id=' + data.id + ' class="additionWidget" style="position:absolute;left:' + data.left + 'px;top:' + data.top + 'px;"></div>';
            return str + '';
        },
        applyAuthorRelatedProperty: function (el, _this) {
            uiSetting.resizeAndDrag(el, {callback: function () {   //applying resizing and draggable to widget
                    // uiSetting.changeHeightAndWidth(arguments[0].target);
                }, context: _this});
        }
    },
    popupManager = {
        popupInitialSetting: {
            popId: 'additionWidget_pop_singleton',
            labels: ["Type", "Answer", "Left", "Top", "Height", "Width", "Length"],
            inputName: [
                {id: "questionOption", type: "text", label: "Numbers to add"},
                {id: "isUnitLabelAllow", type: "checkbox", value: "true", label: "Show place value header"},
                {id: "isFullAbbreviationAllowed", type: "checkbox", value: "true", label: "Show header in full"},
                {id: "isCarryAllow", type: "checkbox", value: "true", label: "Show regrouping superscript"},
                {id: "isGridToggle", type: "checkbox", value: "true", label: "Show grid"},
                {id: "fontSize", type: "select", options: "18pt|17pt|16pt|15pt|14pt|13pt|12pt|11pt|10pt|9pt|8pt", label: "Font size"},
                {id: "left", type: "text", label: "Left"},
                {id: "top", type: "text", label: "Top"},
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
            p.find('#submit[type="button"]').attr('disabled', false); //enabling submit 

            p.css("display", "block");
            p.find('#submit').off('click').on('click', {view: view}, popupManager.updateWidget);
            p.find("#removeElement").off('click').on('click', context.destroy);
            p.find("#clearAllGraph").off('click').on('click', {view: view}, popupManager.clearAll);
            //validation
            p.find('#questionOption').keyup(function () {
                var tempCheck = [], tempCheck2 = [];
                //alert(p.find('#questionOption').val());
                if (typeof p.find('#questionOption').val() === "string") {

                    tempCheck = p.find('#questionOption').val();
                    tempCheck = tempCheck.split(",");
                }

                for (var j = 0; j < tempCheck.length; j++) {
                    if (tempCheck[j] !== '') {
                        tempCheck2.push(tempCheck[j]);
                    }
                }
                if (tempCheck2.length < 2) {
                    p.find("#add-validation-message").html("Please enter minimum two numbers.").addClass("validation-msg");
                    p.find('#submit[type="button"]').attr('disabled', true);
                } else {
                    p.find("#add-validation-message").html("");
                    p.find('#submit[type="button"]').attr('disabled', false);
                }
            });
            if (app ? app.detect.isAndroid() : navigator.userAgent.match(/Android/i)) {
                p.find('input#questionOption').keyup(function (event) {
                    var ob = this;
                    var invalidChars = /[^0-9]/gi;
                    if (invalidChars.test(ob.value)) {
                        ob.value = ob.value.replace(invalidChars, "");
                    }
                });
            } else {
                p.find('input#questionOption').on("keypress", function (e) {
                    var AllowableCharacters = '1234567890.,$¢';
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
                    //m[s[i].id] = p.find('#' + s[i].id).val();
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
    function insertData(el, numberList, centExists, tagCent, tagDollar, rows, columns, symbol, unitLabelAllow, carryAllow, fullAbbreviationAllowed, dollarExists, maxDecimalLength) {
        var decimalLengthContainer = [];
        var decimalLength;
        var LabelList = ['O', 'T', 'H', 'Th', 'T Th', 'H Th', 'M', 'T M', 'H M', 'B', 'T B'];
        var LabelList2 = ['Tth', 'Hth', 'Thth', 'T Thth'];
        var decCount = 0;
        var colorList = ['#2BC0E0', '#8490C8', '#F17192', '#F8941C', '#A6CE38', '#2DB48D', '#2184C6', '#C76CAB', '#CE9D7A', '#7B757E', '#2BC0E0'];
        var colorList2 = ['#49669E', '#C74968', '#CA6C1D', '#49669E'];
        if (typeof numberList === "string") {
            numberList = numberList.split(",");
        }

        for (var i = 0; i < numberList.length; i++) {
            if (!isFinite(maxDecimalLength)) {
                maxDecimalLength = 1;
            }
            numberList[i] = parseFloat(numberList[i]).toFixed(maxDecimalLength);
        }

        //if the decimal count is 0 use this to create grid else the other piece of code 
//        if (decCount == 0) {
        var l = 3, m, tempCol;
        tempCol = columns;
        if (centExists == 1) {
            tempCol--;
        }

        for (var i = 0; i < numberList.length; i++) {


            var digits = ("" + numberList[i]).split("");
            m = tempCol - digits.length + 1;
            for (var j = 0; j < digits.length; j++) {

                $(el).find("#r" + l + "c" + m).append('<div class="digit">' + digits[j] + '</div>');
                m++;
            }

            if (dollarExists == 1) {
                if (tagDollar[i] == i) {
                    $(el).find("#r" + l + "c2").append('<div class="digit">$</div>');
                }
            }
            if (centExists == 1) {
                if (tagCent[i] == i) {
                    $(el).find("#r" + l + "c" + columns).append('<div class="digit">¢</div>');
                }
            }




            l++;
        }

        // insertAnswerFields()
        for (var i = 0; i <= columns; i++) {
            $(el).find("#r" + rows + "c" + i).append('<input id="#r' + rows + 'c' + i + '" class="answerField" type="text" maxlength="1" >');
            $(el).find("div#r" + (rows - 1) + "c" + i).css("border-bottom", "none");
        }


        // insert carryFields()
        for (var i = 0; i <= columns; i++) {
            $(el).find("#r2c" + i).append('<input class="carryField" type="text" maxlength="1" >');
        }

        if (centExists == 1) {
            $(el).find("#r1c" + (columns - maxDecimalLength - 1)).css("background-color", "grey");
        } else {
            $(el).find("#r1c" + (columns - maxDecimalLength)).css("background-color", "grey");
        }

        // insert additionSignLabel
        $(el).find("#r" + (rows - 1) + "c1").append('<div class="digit"><span class="additionDecorator">' + symbol + '</span></div>');
        $(el).find("input.answerField").parent().css("padding", "0");
        $(el).find("input.answerField").parent().parent().css("border-top", "1px solid black");
        $(el).find("#row2").children().css("padding", "0");
        if (!unitLabelAllow) {
            $(el).find("#row1").css("display", "none");
        }
        if (!carryAllow) {
            $(el).find("#row2").css("display", "none");
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

        a = a + '<div id="add-validation-message"></div>';
        for (var x = 0; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
        }
        $(parent).append(a + '</div>');
        $('#' + setting.popId).find('#closeGraphpopup').on("click", popupManager.hide.bind(popupManager));
    }

    function additionWidget(options) {
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
            authParent.append(uiSetting.getWidgetTemplate(cSetting, Role)); //appending widget html template
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
                // return tView.el.find("wid").val();
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

    additionWidget.prototype.deactivate = function () {
        this.active = false;
    };
    additionWidget.prototype.activate = function () {
        this.active = true;
    };
    additionWidget.prototype.toString = function () {
        return "This is Addition Widget";
    };
    return additionWidget;
})(window);