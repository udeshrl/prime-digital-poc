'use strict';

/* Services */

var primeDigitalPlayer = angular.module('primeDigitalPlayer', ['ngResource']);

primeDigitalPlayer.factory('playerServices', ['$http', '$q', playerServices]);

function playerServices($http, $q) {
    var allTestsJSON = '', testJSON = '';

    var quizData = {
        questionArr: {},
        ansArr: {},
        resultArr: {}

    }
    var getQuizDataService = function (quizId, userId) {
        var def = $q.defer();

        $http.get("data/quiz.json")
                .success(function (data) {
                    allTestsJSON = data;
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get Quiz");
                });
        return def.promise;
    }
    var getAllQuizData = function () {
        return allTestsJSON;
    };
    var setQuiz = function (qid) {
        if (allTestsJSON[qid]) {
            testJSON = allTestsJSON[qid];
            quizData = {
                questionArr: {},
                ansArr: {},
                resultArr: {}
            }
            return true;
        } else {
            return false;
        }
    };
    var getAllQuestion = function () {
        return testJSON.questionArr;
    };
    var getQuestionData = function (idx) {
        return testJSON.questionArr[idx];
    };

    var submitQuestions = function () {
        var allQData = quizData.questionArr, qData;
        var resultData = [];
        _.each(allQData, function (qData, qIndex) {

            resultData = [];
            _.each(qData.widgetList, function (elem, index) {
                resultData.push(elem.validate('generic'));
            });
            quizData.resultArr[qIndex] = resultData;
        });

    };

    var checkQuizIniate = function ($location, view) {
        if (testJSON == '') {
            return false;
        } else {
            return true;
        }

    };

    var getResult = function () {
        var allQData = quizData.resultArr, qData;
        var resultData = [], qResult;
        var totalQuestion = testJSON.questionArr.length, correctAns = 0;
        _.each(allQData, function (qData, qIndex) {
            qResult = true;
            for (var j = 0; j < qData.length; j++) {
                if (!qData[j]) {
                    qResult = false;
                    break
                }

            }
            if (qResult) {
                correctAns++;
            }
            resultData.push(qResult);
        });
        return {resultData: resultData, totalQuestion: totalQuestion, correctAns: correctAns};
    };

    var storeUserAnswerData = function (idx) {
        var qData = quizData.questionArr[idx];
        var ansData = [];
        _.each(qData.widgetList, function (elem, index) {
            ansData.push(elem.getUserAnswer());
        });
        quizData.ansArr[idx] = ansData;
    };

    var setUserAnswerData = function (idx) {
        if (quizData.ansArr && quizData.ansArr[idx]) {
            var widgetData = quizData.questionArr[idx];
            var answerData = quizData.ansArr[idx];
            _.each(widgetData.widgetList, function (elem, index) {
                elem.setUserAnswer(answerData[index]);
            });
        }
    };



    var showQuestion = function (idx) {

        var questionObj = {
            widgetList: []
        };
        if (quizData.questionArr[idx]) {
            questionObj = quizData.questionArr[idx];
            data = questionObj.data;
        } else {
            if (!testJSON.questionArr[idx]) {
                return false;
            }
            var strFullJson = testJSON.questionArr[idx];
            var strComponentJson = strFullJson.json;
            var data = JSON.parse(strComponentJson);
            data.filePath = strFullJson.filePath;//Note this is from separate variable
            questionObj.data = data;
        }
        $("#author_content_container").html('<iframe scrolling="no" style="pointer-events: none;" src="' + data.filePath + '" ></iframe>');
        //$('#author_content_container').load( htmlFile, function () {
        var imagesInContent = $('#author_content_container img');
        $.each(imagesInContent, function (idx, elem) {
            var oldSrc = $(elem).attr('src');
            var newSrc = 'html_template/' + oldSrc;
            $(elem).attr('src', newSrc);
        });
        questionObj.widgetList = [];

        _.each(data.widgetsData, function (elem, index) {
            var initSetting = elem[0];
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
        quizData.questionArr[idx] = questionObj;
        this.setUserAnswerData(idx);
        return true;
    };
    return {
        setQuiz: setQuiz,
        getAllQuizData: getAllQuizData,
        getQuizDataService: getQuizDataService,
        checkQuizIniate: checkQuizIniate,
        getAllQuestion: getAllQuestion,
        getQuestionData: getQuestionData,
        showQuestion: showQuestion,
        storeUserAnswerData: storeUserAnswerData,
        setUserAnswerData: setUserAnswerData,
        submitQuestions: submitQuestions,
        getResult: getResult
    };
}
