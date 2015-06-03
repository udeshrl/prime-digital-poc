/**
 * Created By Udesh Kumar
 * Player Services File
 * Date: 05/20/2015
 */

'use strict';
/* Services */

var primeDigitalPlayer = angular.module('primeDigitalPlayer', ['ngResource']);

primeDigitalPlayer.factory('playerServices', playerServices);

/**
 * @ngdoc factory
 * @name playerServices
 * @description
 *
 * Player Service
 * 
 */
function playerServices($http, $q) {
    var allTestsJSON = '', testJSON = '', allStudentQuizData = {};

    var quizData = {
        studentID: '',
        questionArr: {},
        ansArr: {},
        resultQuestionObj: {},
        totalQuestion: 0,
        correctAns: 0,
        resultPercentage: 0,
        resultArr: {}

    }

    /**
     * @ngdoc function
     * @name getQuizDataService
     * @description
     *
     * Get All Quiz records from JSON
     * 
     */
    var getQuizDataService = function () {
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

    /**
     * @ngdoc function
     * @name getStudentQuizDataService
     * @description
     *
     * Get All Student Quiz records from JSON
     * 
     */
    var getStudentQuizDataService = function () {
        var def = $q.defer();
        $http.get("data/student_quiz.json")
                .success(function (data) {
                    allStudentQuizData = data;
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get Quiz");
                });
        return def.promise;
    }

    /**
     * @ngdoc function
     * @name getAllQuizData
     * @description
     *
     * Return all quiz records
     * 
     * @return {object}
     * 
     */
    var getAllQuizData = function () {
        return allTestsJSON;
    };

    /**
     * @ngdoc function
     * @name getAllStudentQuizData
     * @description
     *
     * Return All Student Quiz records
     * 
     * @return {object}
     * 
     */
    var getAllStudentQuizData = function () {
        return allStudentQuizData;
    };

    /**
     * @ngdoc function
     * @name setQuiz
     * @description
     *
     * Initiate Quiz
     * 
     * @param {string} qid Quiz ID
     * @param {string} studentid Student ID
     * 
     * @return {boolean} True if quiz id is correct, false otherwise
     * 
     */
    var setQuiz = function (qid, studentid) {
        if (allTestsJSON[qid]) {
            testJSON = allTestsJSON[qid];
            quizData = {
                studentID: '',
                questionArr: {},
                ansArr: {},
                resultArr: {}
            }
            quizData.studentID = studentid;
            quizData.totalQuestion = testJSON.questionArr.length;
            var studentQuizData = getStudentQuizData(studentid, qid);
            if (studentQuizData) {
                quizData.ansArr = studentQuizData.ansArr;
                quizData.resultArr = studentQuizData.resultArr;
                quizData.resultQuestionObj = studentQuizData.resultQuestionObj;
                quizData.totalQuestion = studentQuizData.totalQuestion;
                quizData.correctAns = studentQuizData.correctAns;
                quizData.resultPercentage = studentQuizData.resultPercentage;
            }

            return true;
        } else {
            return false;
        }
    };

    /**
     * @ngdoc function
     * @name getAllQuestion
     * @description
     *
     * Return All Question records
     * 
     * @param {array}
     * 
     */
    var getAllQuestion = function () {
        return testJSON.questionArr;
    };

    /**
     * @ngdoc function
     * @name getQuizTitle
     * @description
     *
     * Return Quiz Title
     * 
     * @param {string}
     * 
     */
    var getQuizTitle = function () {
        return testJSON.title;
    };

    /**
     * @ngdoc function
     * @name getQuizTitle
     * @description
     *
     * Return Student ID
     * 
     * @param {string}
     * 
     */
    var getStudentID = function () {
        return quizData.studentID;
    };


    /**
     * @ngdoc function
     * @name getQuestionData
     * @description
     *
     * Get Question Object with component Objects
     * 
     * @param {string} idx question index
     * 
     * @return {object}
     * 
     */
    var getQuestionData = function (idx) {
        return testJSON.questionArr[idx];
    };

    /**
     * @ngdoc function
     * @name getResultArr
     * @description
     *
     * Return Result object
     * 
     * @return {object}
     * 
     */
    var getResultArr = function () {
        return quizData.resultArr;
    };

    /**
     * @ngdoc function
     * @name getQuizData
     * @description
     *
     * Return QuizData
     * 
     * @return {object}
     * 
     */
    var getQuizData = function () {
        return quizData;
    };

    /**
     * @ngdoc function
     * @name getStudentQuizData
     * @description
     *
     * Get Student's Quiz Record if already attempted
     * 
     * @param {string} studentID
     * @param {string} testID
     * 
     * @return {object/false} object if record found, false false otherwise
     * 
     */
    var getStudentQuizData = function (studentID, testID) {
        var key = studentID + '_' + testID;
        if (allStudentQuizData[key]) {
            return allStudentQuizData[key];
        }
        return false;
    };


    /**
     * @ngdoc function
     * @name submitQuestions
     * @description
     *
     * Submit all the questions and store the result
     * 
     */
    var submitQuestions = function () {
        var allQData = quizData.questionArr, qData;
        var resultData = [];

        //Loop all question
        _.each(allQData, function (qData, qIndex) {

            resultData = [];
            //Loop all components for that question
            _.each(qData.widgetList, function (elem, index) {
                resultData.push(elem.validate('generic')); // validate user answer for all component and store result in array
            });

            quizData.resultArr[qIndex] = resultData;
        });
    };


    /**
     * @ngdoc function
     * @name checkQuizIniate
     * @description
     *
     * Check if quiz is initiated
     * 
     * @return {boolean} True if quiz is initiated, false otherwise
     * 
     */
    var checkQuizIniate = function () {
        if (testJSON == '') {
            return false;
        } else {
            return true;
        }

    };


    /**
     * @ngdoc function
     * @name getResult
     * @description
     *
     * Get Quiz result and store the result in DB
     * 
     * @param {string} sid Student ID
     * 
     */
    var getResult = function (sid) {
        var allQData = quizData.resultArr, qData;
        var resultQuestionObj = {}, qResult;
        var totalQuestion = testJSON.questionArr.length, correctAns = 0, resultPercentage = '';

        //Loop all questions
        _.each(allQData, function (qData, qIndex) {
            qResult = true;

            // combine components result for question
            for (var j = 0; j < qData.length; j++) {
                if (!qData[j]) { // set question answer as false if any component's answer is false
                    qResult = false;
                    break
                }
            }
            if (qResult) {
                correctAns++;
            }
            resultQuestionObj[qIndex] = qResult;
        });

        //calculate percentage
        resultPercentage = parseInt(correctAns / totalQuestion * 100);

        // create key based on student and quiz id
        var key = sid + '_' + testJSON.testID;

        // Create Student quiz object
        var resultObj = {};
        resultObj.ID = key;
        resultObj.testID = testJSON.testID;
        resultObj.studentID = sid;
        resultObj.ansArr = quizData.ansArr;
        resultObj.resultArr = quizData.resultArr;
        quizData.resultQuestionObj = resultObj.resultQuestionObj = resultQuestionObj;
        quizData.totalQuestion = resultObj.totalQuestion = totalQuestion;
        quizData.correctAns = resultObj.correctAns = correctAns;
        quizData.resultPercentage = resultObj.resultPercentage = resultPercentage;



        // merge student quiz object with all records
        allStudentQuizData[key] = resultObj

        console.log(JSON.stringify(resultObj));
        return {resultQuestionObj: resultQuestionObj, totalQuestion: totalQuestion, correctAns: correctAns, resultPercentage: resultPercentage};
    };


    /**
     * @ngdoc function
     * @name storeUserAnswerData
     * @description
     *
     * Fetch the User Answers and stor in object for that question
     * 
     * @param {string} idx question index
     * 
     */
    var storeUserAnswerData = function (idx) {
        var qData = quizData.questionArr[idx];
        var ansData = [];
        // Loop all components
        _.each(qData.widgetList, function (elem, index) {
            ansData.push(jQuery.extend({}, elem.getUserAnswer())); // get and store user answers
        });
        quizData.ansArr[idx] = ansData;
    };


    /**
     * @ngdoc function
     * @name setUserAnswerData
     * @description
     *
     * Set User's Answer data for question
     * 
     * @param {string} idx question index
     * 
     */
    var setUserAnswerData = function (idx) {
        if (quizData.ansArr && quizData.ansArr[idx]) {
            var widgetData = quizData.questionArr[idx];
            var answerData = quizData.ansArr[idx];
            // Loop All components
            _.each(widgetData.widgetList, function (elem, index) {
                elem.setUserAnswer(answerData[index]); // set user answer in component
            });
        }
    };


    /**
     * @ngdoc function
     * @name revealAnswer
     * @description
     *
     * Reveal Answers
     * 
     * @param {string} idx question index
     * 
     */
    var revealAnswer = function (idx) {
        var widgetData = quizData.questionArr[idx];
        // Loop All components
        _.each(widgetData.widgetList, function (elem, index) {
            elem.deactivate(); // deactivate component
        });
    };


    /**
     * @ngdoc function
     * @name deactivateQuestion
     * @description
     *
     * Deactivate Question
     * 
     * @param {string} idx question index
     * 
     */
    var deactivateQuestion = function (idx) {
        var widgetData = quizData.questionArr[idx];
        // Loop All components
        _.each(widgetData.widgetList, function (elem, index) {
            elem.deactivate(); // deactivate component
        });
    };

    /**
     * @ngdoc function
     * @name activateQuestion
     * @description
     *
     * Activate Question
     * 
     * @param {string} idx question index
     * 
     */
    var activateQuestion = function (idx) {
        var widgetData = quizData.questionArr[idx];
        // Loop All components
        _.each(widgetData.widgetList, function (elem, index) {
            elem.activate(); // deactivate component
        });
    };



    /**
     * @ngdoc function
     * @name resetQuestion
     * @description
     *
     * Reset Question
     * 
     * @param {string} idx question index
     * 
     */
    var resetQuestion = function (idx, role) {
        var widgetData = quizData.questionArr[idx];
        // Loop All components
        _.each(widgetData.widgetList, function (elem, index) {
            elem.reset(); // Reset component
        });
        if (role == 'student') {
            delete quizData.ansArr[idx];
        }
    };


    /**
     * @ngdoc function
     * @name showQuestion
     * @description
     *
     * Initiate Question and render it in player
     * 
     * @param {string} idx question index
     * 
     * @return {boolean} True if quiz id is correct, false otherwise
     * 
     */
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
            data.filePath = strFullJson.filePath; //Note this is from separate variable
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
        if (!$.isEmptyObject(quizData.resultArr)) {
            this.deactivateQuestion(idx);
        }

        return true;
    };
    return {
        setQuiz: setQuiz,
        getAllQuizData: getAllQuizData,
        getQuizDataService: getQuizDataService,
        checkQuizIniate: checkQuizIniate,
        getQuizData: getQuizData,
        getQuizTitle: getQuizTitle,
        getStudentID: getStudentID,
        getAllQuestion: getAllQuestion,
        getQuestionData: getQuestionData,
        resetQuestion: resetQuestion,
        showQuestion: showQuestion,
        storeUserAnswerData: storeUserAnswerData,
        setUserAnswerData: setUserAnswerData,
        submitQuestions: submitQuestions,
        revealAnswer: revealAnswer,
        activateQuestion: activateQuestion,
        deactivateQuestion: deactivateQuestion,
        getStudentQuizDataService: getStudentQuizDataService,
        getStudentQuizData: getStudentQuizData,
        getResultArr: getResultArr,
        getAllStudentQuizData: getAllStudentQuizData,
        getResult: getResult
    };
}
