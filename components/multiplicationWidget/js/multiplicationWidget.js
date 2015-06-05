/**
 * Created by pallav.saxena on 4/4/2014.
 */
var multiplicationWidget = (function (o) {
    "use strict";
    if (o !== window) {
        throw "Please check scope of the Widget";
    }
    var defaultSetting = {
        widgetType: "multiplicationWidget",
        questionOption: "111,77",
        left: 100,
        top: 100,
        id: "",
        isUnitLabelAllow: true,
        isGridToggle: true,
        isCarryAllow: true,
        isMidAnswerToggle: true,
        isFullAbbreviationAllowed: false,
        rowCount: 5,
        columnCount: 7,
        fontSize: "11pt", //font size
        symbol: '&#215;',
        userAttempt: {},
        authorAttempt: {},
        numberOfCarryRows: 2
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
                return uA.carryField.toString() == aA.carryField.toString() && uA.answerField.toString() == aA.answerField.toString() && uA.midAnswerField.toString() == aA.midAnswerField.toString();
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
            o.model.on("change:numberOfCarryRows", o.render.bind(o));
            o.model.on("change:isUnitLabelAllow", o.toggleUnitLabel.bind(o));
            o.model.on("change:isGridToggle", o.toggleGrid.bind(o));
            o.model.on("change:isMidAnswerToggle", o.toggleMidAnswer.bind(o));
            o.model.on("change:isCarryAllow", o.toggleCarryAllow.bind(o));
            o.model.on("change:fontSize", o.fontSize.bind(o));
            o.model.on("change:isFullAbbreviationAllowed", o.toggleFullAbbreviationAllowed.bind(o));
            o.deleted = false;
            o.active = true;
            o.toggleGrid(undefined);
            o.toggleMidAnswer(undefined);
            o.toggleCarryAllow(undefined);
            o.toggleUnitLabel(undefined);
            o.toggleFullAbbreviationAllowed(undefined);
            o.fontSize(undefined);
            o.el.find('input').blur(function () {
                o.updateUserAnswer();
            });
        },
        fontSize: function () {
            var fontSize = this.model.get("fontSize");
            var carryFontSize = parseInt(fontSize, 10) - 2;
            this.el.find("input.carryField").css("font-size", carryFontSize + 'pt');
            this.el.find("input.midAnswerField").css("font-size", fontSize);
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
        toggleMidAnswer: function (e) {
            if (this.model.get("isMidAnswerToggle")) {
                this.el.find(".midAnswerField").parent().parent().css("display", "block");

            } else {
                this.el.find(".midAnswerField").parent().parent().css("display", "none");
            }
        },
        toggleFullAbbreviationAllowed: function () {
            var columns = this.el.find("input.answerField").parent().parent().attr("class").slice(8);
            var column, orgColumn;
            column = columns.split('#')[0];
            orgColumn = columns.split('#')[1];
            if (this.model.get("isFullAbbreviationAllowed")) {

                var width2 = (column * 91) + "px";
                var LabelList2 = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten thousands', 'Hundred thousands', 'Millions', 'Ten millions', 'Hundred millions', 'Billions', 'Ten billions'];
                var LabelList3 = ['Tenths', 'Hundredths', 'Thousandths', 'Ten thousandths'];

                this.el.find("input.carryField").parent().removeClass("Addgridsquare");
                this.el.find("input.carryField").parent().addClass("AddgridsquareFull");

                this.el.find("input.answerField").parent().removeClass("Addgridsquare");
                this.el.find("input.answerField").parent().addClass("AddgridsquareFull");

                this.el.find("input.midAnswerField").parent().removeClass("Addgridsquare");
                this.el.find("input.midAnswerField").parent().addClass("AddgridsquareFull");

                this.el.find("div.digit").parent().removeClass("Addgridsquare");
                this.el.find("div.digit").parent().addClass("AddgridsquareFull");

                this.el.find("div.digit").parent().siblings().removeClass("Addgridsquare");
                this.el.find("div.digit").parent().siblings().addClass("AddgridsquareFull");


                this.el.find("div.digit").parent().parent().css("width", width2);
                this.el.find("input.carryField").parent().parent().css("width", width2);
                this.el.find("input.answerField").parent().parent().css("width", width2);
                this.el.find("input.midAnswerField").parent().parent().css("width", width2);

                this.el.find("input.carryField").css("width", "91px");
                this.el.find("input.answerField").css("width", "91px");
                this.el.find("input.midAnswerField").css("width", "91px");

                //to position the unit labels
                var numbers = [], decimalLengthContainer = [], maxDecimalLength = -1, decimalLength;
                if (typeof this.model.get("questionOption") === "string") {
                    numbers = this.model.get("questionOption").split(",");
                }

                //Pushing the decimals in decimalLengthContainer []
                for (var i = 0; i < numbers.length; i++) {
                    if (Math.floor(parseFloat(numbers[i])) !== parseFloat(numbers[i])) {
                        decimalLength = numbers[i].toString().split(".")[1].length || 0;
                        decimalLengthContainer.push(decimalLength);
                        maxDecimalLength = Math.max.apply(Math, decimalLengthContainer);
                    }
                    /*
                     if (!(isNaN(numbers[i]) || numbers[i].indexOf(".")<0)) {
                     decCount++;
                     }  */
                }

                var str = '<div class="digit">';
                for (var i = 0; i < column; i++) {
                    this.el.find("#r1c" + (column - i)).children().remove();
                }
                //+2 to not generate a label on symbol row
                var x = orgColumn - 2 - maxDecimalLength - 1, y = (column - (maxDecimalLength + 1));
                for (var i = 0; i < x; i++, y--) {
                    //+1 to avoiding starting from decimal point
                    this.el.find("#r1c" + y).append(str + LabelList2[i] + '<div>');

                }

                var tempCol = column;
                for (var j = maxDecimalLength - 1; j >= 0; j--, tempCol--) {
                    this.el.find("#r1c" + tempCol).append(str + LabelList3[j] + '<div>');
                }
            } else {

                var width1 = column * 41;
                var LabelList1 = ['O', 'T', 'H', 'Th', 'T Th', 'H Th', 'M', 'T M', 'H M', 'B', 'T B'];
                var LabelList3 = ['Tth', 'Hth', 'Thth', 'T Thth'];

                this.el.find("input.carryField").parent().removeClass("AddgridsquareFull");
                this.el.find("input.carryField").parent().addClass("Addgridsquare");

                this.el.find("input.answerField").parent().removeClass("AddgridsquareFull");
                this.el.find("input.answerField").parent().addClass("Addgridsquare");

                this.el.find("input.midAnswerField").parent().removeClass("AddgridsquareFull");
                this.el.find("input.midAnswerField").parent().addClass("Addgridsquare");

                this.el.find("div.digit").parent().removeClass("AddgridsquareFull");
                this.el.find("div.digit").parent().addClass("Addgridsquare");

                this.el.find("div.digit").parent().siblings().removeClass("AddgridsquareFull");
                this.el.find("div.digit").parent().siblings().addClass("Addgridsquare");


                this.el.find("div.digit").parent().parent().css("width", width1);
                this.el.find("input.carryField").parent().parent().css("width", width1);
                this.el.find("input.answerField").parent().parent().css("width", width1);
                this.el.find("input.midAnswerField").parent().parent().css("width", width1);

                this.el.find("input.carryField").css("width", "41px");
                this.el.find("input.answerField").css("width", "41px");
                this.el.find("input.midAnswerField").css("width", "41px");

                //to position the unit labels
                var numbers = [], decimalLengthContainer = [], maxDecimalLength = -1, decimalLength;
                if (typeof this.model.get("questionOption") === "string") {
                    numbers = this.model.get("questionOption").split(",");
                }

                //Pushing the decimals in decimalLengthContainer []
                for (var i = 0; i < numbers.length; i++) {
                    if (Math.floor(parseFloat(numbers[i])) !== parseFloat(numbers[i])) {
                        decimalLength = numbers[i].toString().split(".")[1].length || 0;
                        decimalLengthContainer.push(decimalLength);
                        maxDecimalLength = Math.max.apply(Math, decimalLengthContainer);
                    }
                    /*
                     if (!(isNaN(numbers[i]) || numbers[i].indexOf(".")<0)) {
                     decCount++;
                     }  */
                }

                var str = '<div class="digit">';
                for (var i = 0; i < column; i++) {
                    this.el.find("#r1c" + (column - i)).children().remove();
                }
                //+2 to not generate a label on symbol row
                var x = orgColumn - 2 - maxDecimalLength - 1, y = (column - (maxDecimalLength + 1));
                for (var i = 0; i < x; i++, y--) {
                    //+1 to avoiding starting from decimal point
                    this.el.find("#r1c" + y).append(str + LabelList1[i] + '<div>');

                }

                var tempCol = column;
                for (var j = maxDecimalLength - 1; j >= 0; j--, tempCol--) {
                    this.el.find("#r1c" + tempCol).append(str + LabelList3[j] + '<div>');
                }

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
            uiSetting.createGrid(this.el, this.model.toJSON());
            this.toggleMidAnswer(undefined);
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
            var carryField = [], midAnswerField = [], answerField = [];

            if (this.model.get("isCarryAllow")) {
                o.el.find('.carryField').each(function () {//this is for 1st carry applicable for addition.
                    carryField.push($(this).val());
                });
            }

            if (this.model.get("isMidAnswerToggle")) {
                o.el.find('.midAnswerField').each(function () {
                    midAnswerField.push($(this).val());
                });
            }


            o.el.find('.answerField').each(function () {
                answerField.push($(this).val());
            });
            return {answerField: answerField, carryField: carryField, midAnswerField: midAnswerField};
        },
        setScreenInput: function () {
            var o = this, userAttempt = o.model.get('userAttempt');
            var carryField = userAttempt.carryField, answerField = userAttempt.answerField, midAnswerField = userAttempt.midAnswerField;
            if (this.model.get("isCarryAllow")) {
                o.el.find('.carryField').each(function (index) {//this is for 1st carry applicable for addition.
                    carryField.push($(this).val(carryField[index]));
                });
            }

            if (this.model.get("isMidAnswerToggle")) {
                o.el.find('.midAnswerField').each(function (index) {//this is for 1st carry applicable for addition.
                    midAnswerField.push($(this).val(midAnswerField[index]));
                });
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
        typeCheck: function (k) {
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

            if (answers.midAnswerField) {
                var midAnsList = this.el.find(".midAnswerField");
                var midAns = answers.midAnswerField;
                for (var i = 0; i < midAns.length; i++) {
                    midAnsList[i].value = midAns[i];
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
            var str = '', str2 = '';
            var qLIst = data.questionOption;
            var carryRow = parseInt(data.numberOfCarryRows), UnitRow = 1, AnswerRow = 1, symbolCol = 1, extraCol = 1, decCol = 0;
            var decimalLengthContainerInitial = [];
            var decimalLengthInitial;
            var listWhole = [];
            var maxDecimal = 0, maxWhole;
            var temp = [], temp2 = [];
            var numberOfRowsForMidAnswerFields;
            var dec = 0;

            if (typeof data.questionOption === "string") {
                qLIst = data.questionOption.split(",");
            }

            //condition to remove rows for mid answer fields when in case of decimal
            if ((qLIst[qLIst.length - 1]).toString().indexOf(".") !== -1) {
                numberOfRowsForMidAnswerFields = qLIst[qLIst.length - 1].length - 1;
            } else {
                for (var k = 0; k < qLIst.length; k++) {
                    if (qLIst[k] !== '') {
                        temp2.push(qLIst[k]);
                    }
                }
                numberOfRowsForMidAnswerFields = temp2[temp2.length - 1].length;
            }


            //if extra , are encountered 
            for (var j = 0; j < qLIst.length; j++) {
                if (qLIst[j] !== '') {
                    temp.push(qLIst[j]);
                }
            }

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
                decCol = 1;
            }

            if (!isFinite(maxDecimal)) {
                maxDecimal = 1;
            }


            var noOfRow = data.rowCount = qLIst.length + carryRow + UnitRow + AnswerRow;

            var tempNumberOfColumn = maxWhole + maxDecimal + symbolCol + extraCol + decCol;
            var productAnswer = app.getMultiply(qLIst[0], qLIst[1]);

            var tempNumberOfColumn2 = parseFloat(productAnswer).toString().length + extraCol;

            var noOfColumn = data.columnCount;

            if (tempNumberOfColumn > tempNumberOfColumn2) {
                noOfColumn = data.columnCount = tempNumberOfColumn;
            } else {
                noOfColumn = data.columnCount = parseInt(tempNumberOfColumn2);
            }

            function getColumn(r, c) {
                var p = '';

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
                str = str + '<div id="row' + i + '" class="colCount' + data.columnCount + '#' + tempNumberOfColumn + '" style="width: ' + data.columnCount * 41 + 'px ">' + getColumn(i, noOfColumn) + '</div><div class="clearRow" style="clear:left;"></div>';
            }
            for (var i = (noOfRow + 1); i <= (numberOfRowsForMidAnswerFields + noOfRow); i++) {
                str2 = str2 + '<div id="row' + i + '" class="colCount' + data.columnCount + '#' + tempNumberOfColumn + '" style="width: ' + data.columnCount * 41 + 'px ">' + getColumn(i, noOfColumn) + '</div><div class="clearRow" style="clear:left;"></div>';
            }

            $(el).append(str);
            $(el).append(str2);

            insertData(el, qLIst, noOfRow, noOfColumn, data.symbol, data.isUnitLabelAllow, data.isCarryAllow, numberOfRowsForMidAnswerFields, carryRow, data.isFullAbbreviationAllowed, tempNumberOfColumn);

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
            var str = '<div id=' + data.id + ' class="multiplicationWidget" style="position:absolute;left:' + data.left + 'px;top:' + data.top + 'px;"></div>';
            return str + '';
        },
        applyAuthorRelatedProperty: function (el, _this) {
            uiSetting.resizeAndDrag(el, {callback: function () {   //applying resizing and draggable to widget
                }, context: _this});
        }
    },
    popupManager = {
        popupInitialSetting: {
            popId: 'multiplicationWidget_pop_singleton',
            labels: ["Type", "Answer", "Left", "Top", "Height", "Width", "Length"],
            inputName: [
                {id: "questionOption", type: "text", label: "Numbers to multiply"},
                {id: "isMidAnswerToggle", type: "checkbox", value: "true", label: "Show partial products"},
                {id: "isUnitLabelAllow", type: "checkbox", value: "true", label: "Show place value header"},
                {id: "isFullAbbreviationAllowed", type: "checkbox", value: "true", label: "Show header in full"},
                {id: "numberOfCarryRows", type: "text", label: "Number of regrouping superscript rows"},
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
            $('#popup-overlay-multi').remove();
        },
        createPop: function () {
            getConfigurationWindow(this.popupInitialSetting, $('#' + uiSetting.authorParent));
        },
        show: function (view, context) {
            this.updatePopFields(view);
            $('#popup-overlay-multi').css('display', 'block');
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
                    var AllowableCharacters = '1234567890.,';
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
                p.find('input#numberOfCarryRows').keyup(function (event) {
                    var ob = this;
                    var invalidChars = /[^0-9]/gi;
                    if (invalidChars.test(ob.value)) {
                        ob.value = ob.value.replace(invalidChars, "");
                    }
                });
            } else {
                p.find('input#numberOfCarryRows').on("keypress", function (e) {
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
            $('#popup-overlay-multi').css('display', 'none');
            $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
        }
    };

    function insertData(el, numberList, rows, columns, symbol, unitLabelAllow, carryAllow, numberOfRowsForMidAnswerFields, numberOfCarryRowsInsert, fullAbbreviationAllowed, orgColumn) {
        var decimalLengthContainer = [];
        var decimalLength;
        var maxDecimalLength;
        var LabelList = ['O', 'T', 'H', 'Th', 'T Th', 'H Th', 'M', 'T M', 'H M', 'B', 'T B'];
        var LabelList2 = ['Tth', 'Hth', 'Thth', 'T Thth'];
        var decCount = 0;
        var colorList = ['#2BC0E0', '#8490C8', '#F17192', '#F8941C', '#A6CE38', '#2DB48D', '#2184C6', '#C76CAB', '#CE9D7A', '#7B757E', '#2BC0E0'];
        var colorList2 = ['#49669E', '#C74968', '#CA6C1D', '#49669E'];

        if (typeof numberList === "string") {
            numberList = numberList.split(",");
        }

        //Pushing the decimals in decimalLengthContainer []
        for (var i = 0; i < numberList.length; i++) {
            if (Math.floor(parseFloat(numberList[i])) !== parseFloat(numberList[i])) {
                decimalLength = numberList[i].toString().split(".")[1].length || 0;
                decimalLengthContainer.push(decimalLength);
            }

            if (!(isNaN(numberList[i]) || numberList[i].indexOf(".") < 0)) {
                decCount++;
            }
        }

        //Calculating the max decimal number
        if (decCount == 0) {
            maxDecimalLength = 0;
        } else {
            maxDecimalLength = Math.max.apply(Math, decimalLengthContainer);
        }

        for (var i = 0; i < numberList.length; i++) {
            if (!isFinite(maxDecimalLength)) {
                maxDecimalLength = 1;
            }
            numberList[i] = parseFloat(numberList[i]).toFixed(maxDecimalLength);
        }

        //if the decimal count is 0 use this to create grid else the other piece of code 
        if (decCount == 0) {
            for (var i = 0; i < numberList.length; i++) {
                for (var l = numberOfCarryRowsInsert + 2; l <= rows - 1; l++) {
                    var digits = ("" + numberList[i]).split("");
                    for (var j = 0; j < digits.length; j++) {
                        for (var m = columns - digits.length + 1; m <= columns; m++) {
                            $(el).find("#r" + l + "c" + m).append('<div class="digit">' + digits[j] + '</div>');
                            j++;
                        }
                    }
                    i++;
                }
            }
        } else {
            for (var i = 0; i < numberList.length; i++) {
                for (var l = numberOfCarryRowsInsert + 2; l <= rows - 1; l++) {
                    var digits = ("" + numberList[i]).split("");
                    for (var j = 0; j < digits.length; j++) {
                        for (var m = columns - digits.length + 1; m <= columns; m++) {
                            if (digits[j] != "X") {
                                $(el).find("#r" + l + "c" + m).append('<div class="digit">' + digits[j] + '</div>');
                            }
                            j++;
                        }
                    }
                    i++;
                }
            }
        }

        //insertMidAnswerFields
        for (var i = 0; i < numberOfRowsForMidAnswerFields; i++) {
            for (var j = 1; j <= columns; j++) {
                $(el).find("#r" + (rows + i) + "c" + j).append('<input id="mr' + (rows + i) + 'c' + j + '" class="midAnswerField" type="text" maxlength="1" >');
                //$(el).find("div#r" + (rows + i - 1) + "c" + j).css("border-bottom","none");
            }
        }

        $(el).find("#row" + rows).css("border-top", "1px solid black");

        // insertAnswerFields()
        for (var i = 0; i <= columns; i++) {
            $(el).find("#r" + (rows + numberOfRowsForMidAnswerFields) + "c" + i).append('<input id="#r' + (rows + numberOfRowsForMidAnswerFields) + 'c' + i + '" class="answerField" type="text" maxlength="1" >');
            $(el).find("div#r" + (rows + numberOfRowsForMidAnswerFields - 1) + "c" + i).css("border-bottom", "none");
        }


        // insert carryFields
        for (var j = 0; j < (numberOfCarryRowsInsert); j++) {
            for (var i = 0; i <= columns; i++) {
                $(el).find("#r" + (2 + j) + "c" + i).append('<input class="carryField" type="text" maxlength="1" >');
            }
        }
        // insert background color on decimal header
        $(el).find("#r1c" + (columns - maxDecimalLength)).css("background-color", "grey");

        // to make height of carryField parent 20px
        $(".carryField").parent().addClass("height20");

        // insert unitPlacesLabels()
        if (!fullAbbreviationAllowed) {
            var x = orgColumn - 2 - maxDecimalLength - 1, y = (columns - (maxDecimalLength + 1));
            var str = '<div class="digit">';
            if (maxDecimalLength == 0) {
                y = columns;
                for (var i = 0; i <= x; i++, y--) {
                    //+1 to avoiding starting from decimal point
                    $(el).find("#r1c" + y).append(str + LabelList[i] + '<div>').css("background-color", colorList[i]);
                }
            } else {
                for (var i = 0; i < x; i++, y--) {
                    //+1 to avoiding starting from decimal point
                    $(el).find("#r1c" + y).append(str + LabelList[i] + '<div>').css("background-color", colorList[i]);
                }
            }



            var tempCol = columns;
            for (var j = maxDecimalLength - 1; j >= 0; j--, tempCol--) {
                $(el).find("#r1c" + tempCol).append(str + LabelList2[j] + '<div>').css("background-color", colorList2[j]);
            }
        } else {
            var LabelList4 = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten thousands', 'Hundred thousands', 'Millions', 'Ten millions', 'Hundred millions', 'Billions', 'Ten billions'];
            var LabelList5 = ['Tenths', 'Hundredths', 'Thousandths', 'Ten thousandths'];
            var x = orgColumn - 2 - maxDecimalLength - 1, y = (columns - (maxDecimalLength + 1));
            var str = '<div class="digit">';
            var tempColumns = columns;
            var width2 = tempColumns * 91;

            if (maxDecimalLength == 0) {
                y = columns;
                for (var i = 0; i <= x; i++, y--) {
                    //+1 to avoiding starting from decimal point
                    $(el).find("#r1c" + y).append(str + LabelList4[i] + '<div>').css("background-color", colorList[i]);
                }
            } else {
                for (var i = 0; i < x; i++, y--) {
                    //+1 to avoiding starting from decimal point
                    $(el).find("#r1c" + y).append(str + LabelList4[i] + '<div>').css("background-color", colorList[i]);
                }
            }


            var tempCol = columns;
            for (var j = maxDecimalLength - 1; j >= 0; j--, tempCol--) {
                $(el).find("#r1c" + tempCol).append(str + LabelList5[j] + '<div>').css("background-color", colorList2[j]);
            }

            $(el).find("input.carryField").parent().removeClass("Addgridsquare");
            $(el).find("input.carryField").parent().addClass("AddgridsquareFull");

            $(el).find("input.answerField").parent().removeClass("Addgridsquare");
            $(el).find("input.answerField").parent().addClass("AddgridsquareFull");

            $(el).find("input.midAnswerField").parent().removeClass("Addgridsquare");
            $(el).find("input.midAnswerField").parent().addClass("AddgridsquareFull");

            $(el).find("div.digit").parent().removeClass("Addgridsquare");
            $(el).find("div.digit").parent().addClass("AddgridsquareFull");

            $(el).find("div.digit").parent().siblings().removeClass("Addgridsquare");
            $(el).find("div.digit").parent().siblings().addClass("AddgridsquareFull");


            $(el).find("div.digit").parent().parent().css("width", width2);
            $(el).find("input.carryField").parent().parent().css("width", width2);
            $(el).find("input.answerField").parent().parent().css("width", width2);
            $(el).find("input.midAnswerField").parent().parent().css("width", width2);

            $(el).find("input.carryField").css("width", "91px");
            $(el).find("input.answerField").css("width", "91px");
            $(el).find("input.midAnswerField").css("width", "91px");
        }



        $(el).find("input.answerField").parent().css("padding", "0");
        $(el).find("input.answerField").parent().parent().css("border-top", "1px solid black");
        $(el).find("#row2").children().css("padding", "0");

        // insert multiplicationSignLabel
        $(el).find("#r" + (rows - 1) + "c1").append('<div class="digit">' + symbol + '</div>').css("font-size", "21px");

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
        var a = '<div class="popup-overlay" id="popup-overlay-multi"></div><div id="' + setting.popId + '" class="popup_container">';
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

    function multiplicationWidget(options) {
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
        this.revealAnswer = function (val) {
            if (!tView.deleted) {
                tView.revealAnswer();
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

    multiplicationWidget.prototype.deactivate = function () {
        this.active = false;
    };
    multiplicationWidget.prototype.activate = function () {
        this.active = true;
    };

    multiplicationWidget.prototype.toString = function () {
        return "This is Multiplication Widget";
    };
    return multiplicationWidget;
})(window);