Role = "student";
var widgetData = {};
var author = {
    testid: '',
    questionArr: {},
    urlParams: {}
};
var current = 0;

var savedData = function () {
    var data = {};
    var questionID = author.urlParams['pdqid'];
    if (questionID) { //This reads from localstorage
        if (questionID != undefined && localStorage.getItem(questionID) != null) {
            var lsQuestionData = JSON.parse(localStorage.getItem(questionID));
            data.widgetsData = lsQuestionData.widgetsData;
            data.filePath = lsQuestionData.filePath.replace(/^\/+/, '');
            data.avatarData = lsQuestionData.avatarData;

        }
    }
    else { //This reads from datafile
        var data = testJSON;
//        var strComponentJson = strFullJson.json;
//        data = JSON.parse(strComponentJson);
//        data.filePath = strFullJson.filePath;//Note this is from separate variable
    }
    return data;
};


var setQuestion = function () {
    var data = {};

    var questionID = author.urlParams['pdqid'];
    if (questionID) { //This reads from localstorage
        if (questionID != undefined && localStorage.getItem(questionID) != null) {
            var lsQuestionData = JSON.parse(localStorage.getItem(questionID));
            data.widgetsData = lsQuestionData.widgetsData;
            data.filePath = lsQuestionData.filePath.replace(/^\/+/, '');
            data.avatarData = lsQuestionData.avatarData;

        }
    }
    else { //This reads from datafile
        var data = testJSON;
//        var strComponentJson = strFullJson.json;
//        data = JSON.parse(strComponentJson);
//        data.filePath = strFullJson.filePath;//Note this is from separate variable
    }
    return data;
};
$(function () {
    var match,
            pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

    while (match = search.exec(query))
        author.urlParams[decode(match[1])] = decode(match[2]);

    var dataSaved = savedData();

    var navBtns = '';
    $.each(dataSaved.questionArr, function (idx, elem) {
        var val = idx + 1;
        navBtns += '<button class="navBtns" data-navid=' + idx + '>' + val + '</button>';
    });
    $('#authorPagination').html(navBtns);

    getQuestion(current);

    function getQuestion(idx) {
        var questionObj = {
            widgetList: []
        };
        if (author.questionArr[idx]) {
            questionObj = author.questionArr[idx];
            data = questionObj.data;
        } else {
            var strFullJson = dataSaved.questionArr[idx];
            var strComponentJson = strFullJson.json;
            var data = JSON.parse(strComponentJson);
            data.filePath = strFullJson.filePath;//Note this is from separate variable
            questionObj.data = data;



        }
        document.getElementById("author_content_container").innerHTML = '<iframe scrolling="no" style="pointer-events: none;" src="' + data.filePath + '" ></iframe>';
        //$('#author_content_container').load( htmlFile, function () {
        var imagesInContent = $('#author_content_container img');
        $.each(imagesInContent, function (idx, elem) {
            var oldSrc = $(elem).attr('src');
            var newSrc = 'html_template/' + oldSrc;
            $(elem).attr('src', newSrc);
        });
        questionObj.widgetList = [];

        _.each(data.widgetsData, function (elem, index) {
            console.log(data.userWidgetData);
            var initSetting  = elem[0];
            if (data['userWidgetData'] && data['userWidgetData'][index]) {
                initSetting = data['userWidgetData'][index];
            }
            //console.log(elem)
            if (elem[1] === "clockWidget")
            {
                questionObj.widgetList.push(new clockWidget(initSetting));
            }
            else if (elem[1] === "multipleSelect")
            {
                questionObj.widgetList.push(new multipleSelect(initSetting));
            }
            else if (elem[1] === "textBoxWidget")
            {
                questionObj.widgetList.push(new textBoxWidget(initSetting));
            }
            else if (elem[1] === "vBarGraph")
            {
                questionObj.widgetList.push(new vBarGraph(initSetting));
            }
            else if (elem[1] === "hBarGraph")
            {
                questionObj.widgetList.push(new hBarGraph(initSetting));
            }
            else if (elem[1] === "lineGraph")
            {
                questionObj.widgetList.push(new lineGraph(initSetting));
            }
            else if (elem[1] === "tallyMarks")
            {
                questionObj.widgetList.push(new tallyMarks(initSetting));
            }
            else if (elem[1] === "additionWidget")
            {
                questionObj.widgetList.push(new additionWidget(initSetting));
            }
            else if (elem[1] === "subtractionWidget")
            {
                questionObj.widgetList.push(new subtractionWidget(initSetting));
            }
            else if (elem[1] === "multiplicationWidget")
            {
                questionObj.widgetList.push(new multiplicationWidget(initSetting));
            }
            else if (elem[1] === "divisionWidget")
            {
                questionObj.widgetList.push(new divisionWidget(initSetting));
            }
            else if (elem[1] === "freeDraw")
            {
                questionObj.widgetList.push(new freeDraw(initSetting));
            }
            else if (elem[1] === "labelWidget")
            {
                questionObj.widgetList.push(new labelWidget(initSetting, $("#author_content_container"), $("#author_content_container")));
            }
            else if (elem[1] === "groupBox")
            {
                questionObj.widgetList.push(new groupBox(initSetting));
            }
            else if (elem[1] === "matchTheLine")
            {
                questionObj.widgetList.push(new matchTheLine(initSetting));
            }
            else if (elem[1] === "htmlEditor")
            {
                questionObj.widgetList.push(new htmlEditor(initSetting));
            }
            else if (elem[1] === "ImageUpload") {
                questionObj.widgetList.push(new ImageUpload(initSetting, $("#author_content_container"), $("#author_content_container")));
            }
            else if (elem[1] === "dragDrop") {
                questionObj.widgetList.push(new dragDrop(initSetting));
            }
        });
        author.questionArr[idx] = questionObj;


//        if (dataSaved.avatarData != undefined && dataSaved.avatarData.isExist == undefined) {
//            author.avatarInstance = new avatarWidget({avatarIcon: dataSaved.avatarData.avatarIcon, left: dataSaved.avatarData.position.left, top: dataSaved.avatarData.position.top});
//        }
    }

    $('.navBtns').on(app.detect.isMobile() ? 'touchstart' : 'click', function () {
        var qData = author.questionArr[current];
        var userWidgetData = [];
        _.each(qData.widgetList, function (elem, index) {
            userWidgetData.push(elem.getWidgetData());
        });
        author.questionArr[current].data.userWidgetData = userWidgetData;
        current = $(this).data('navid');
        getQuestion(current);
    });
    //initWidgetList();
    //});
    //}



    $('#btn-submit-generic').on(app.detect.isMobile() ? 'touchstart' : 'click', reader.submitGeneric);
//		$('#apiSubmitSpecific').on('click', reader.submitSpecific);
    $('#btn-reset').on(app.detect.isMobile() ? 'touchstart' : 'click', reader.reset);
//		$('#apiData').on('click', reader.getWidgetData);
//		$('#apiActivate').on('click', reader.activate);
//		$('#apiDeactivate').on('click', reader.deactivate);
});

var reader = {
    entry: function () {
        console.log('something in handler');
        return "entry return";
    },
    apiResult: function (apiReturn) {
        $("#apiOutput").html(JSON.stringify(apiReturn));
    },
    getWidgetData: function (e) {
        var widgetData = {}, widgetTypes = [], temp = undefined;//widgetData 		=  widgetData || {};
        for (var i = 0; i < author.widgetList.length; i++) { //Pushing JSON data to an object array
            temp = author.widgetList[i].getWidgetData();
            if (!!temp) {
                widgetData[i] = {};
                widgetData[i][0] = author.widgetList[i].getWidgetData();
                var widgetType = author.widgetList[i].getWidgetType();
                if (widgetType) {
                    widgetData[i][1] = widgetType;
                    widgetTypes.push(widgetType);
                }

            }
            else {
                author.widgetList.splice(i, 1);
            }
        }
        reader.apiResult({"widgetData": widgetData, "widgetTypes": widgetTypes});
    },
    submitGeneric: function () {
        var resultArray = [], feedbackMsg, ansStatus;

        for (var i = 0; i < author.widgetList.length; i++) {
            resultArray.push(author.widgetList[i].validate('generic'));
        }
        if (!_.contains(resultArray, false)) {
            feedbackMsg = "Correct!!\n";
            ansStatus = 'correct';
        } else {
            feedbackMsg = "Incorrect!!\nTry again.";
            ansStatus = 'incorrect';
        }


//        if (author.avatarInstance != undefined)
//        {
//            author.avatarInstance.setMessage({msg: feedbackMsg, ansStatus: ansStatus});
//        }
//        else
//        {
        alert(feedbackMsg);
//        }
//			$('#btn-submit-generic').hide();
//			$('#btn-reset').show();

    },
    submitSpecific: function () {
        var resultArray = [], temp = undefined;
        for (var i = 0; i < author.widgetList.length; i++) {
            resultArray.push(author.widgetList[i].validate('specific'));
        }
        if (!_.contains(resultArray, false)) {
            reader.apiResult("Specific : This is Correct!!");
        } else {
            reader.apiResult("Specific : This is Wrong");
        }
    },
    reset: function () {
        var temp = undefined;
        for (var i = 0; i < author.widgetList.length; i++) {
            author.widgetList[i].reset();
        }
        if (author.avatarInstance != undefined)
            author.avatarInstance.hide();
//			$('#btn-reset').hide();
//			$('#btn-submit-generic').show();

//			reader.apiResult("Reset all completed");
    },
    activate: function () {
        var temp = undefined;
        for (var i = 0; i < author.widgetList.length; i++) {
            author.widgetList[i].activate();

        }
        reader.apiResult("Activate all !!");
    },
    deactivate: function () {
        var temp = undefined;
        for (var i = 0; i < author.widgetList.length; i++) {
            author.widgetList[i].deactivate();
        }
        reader.apiResult("Deactivated all");
    }
};



function check() { // Validating all instances on template
    var feedbackMsg = '', resultArray = [];

    _.each(author.widgetList, function (elem, index) {
        //console.log(elem instanceof MultipleSelect)
        // var obj = elem.validate('specific');
        resultArray.push(elem.validate('generic'));
        //feedbackMsg += " widget : "+ elem.validate('specific') +"\n";

    });

    console.log(resultArray[0]);
    if (!_.contains(resultArray, false)) {
        alert("This is Correct!!");
    } else {
        alert("This is Wrong");
    }
    //alert(feedbackMsg);
}
function final_check() { //Validating all instances on template and disable instances on template.
    var feedbackMsg = '';
    _.each(author.widgetList, function (elem, index) {
        if (elem instanceof clockWidget)
        {
            feedbackMsg += "Clock1 : " + elem.validate('generic') + "\n";
        }
        else if (elem instanceof MultipleSelect)
        {
            var obj = elem.validate('generic');
            feedbackMsg += "Multiple Select " + obj.grpId + " : " + obj.validate + "\n";
        }
    });

    //alert(feedbackMsg);
}

