/**
 * Created By Udesh Kumar
 * All Controller File
 * Date: 05/20/2015
 */


'use strict';

/* Controllers */

var primeDigitalControllers = angular.module('primeDigitalControllers', []);

/**
 * Prime Mathematic POC Controllers
 * To see which controller is scoped for which template see: js/app.js
 */
primeDigitalControllers.controller('appController', appController);
primeDigitalControllers.controller('DashboardCtrl', DashboardCtrl);
primeDigitalControllers.controller('StudentQuizCtrl', StudentQuizCtrl);
primeDigitalControllers.controller('TeacherDashboardCtrl', TeacherDashboardCtrl);
primeDigitalControllers.controller('QuizCtrl', QuizCtrl);
primeDigitalControllers.controller('ResultCtrl', ResultCtrl);
primeDigitalControllers.controller('QuestionCtrl', QuestionCtrl);



/**
 * @ngdoc controller
 * @name appController
 * @description
 *
 * Main Controller, will load on page load.
 * 
 * @param searchParams token
 *
 */
function appController($rootScope, $scope, $location, userServices, playerServices, appConstants) {
    var searchParams = $location.search(), token = '';

    //Check and set if token is passed
    if (searchParams['token']) {
        token = searchParams['token'];
    }
    /*
     function getQueryStringValue(key) {
     return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
     }
     token = getQueryStringValue('token');
     */


    //Get the Logged user information
    userServices.getUserInfo(token).then(function (data) {
        $rootScope.userInfo = data; // set User Information
    }, function (data) {
        console.log('User retrieval failed.')
    });

    //Get all quiz records
    playerServices.getQuizDataService().then(function (data) {
        $scope.quizData = playerServices.getAllQuizData();
    }, function (data) {
        console.log('Quiz retrieval failed.')
    });

    //Get all student Quiz records
    playerServices.getStudentQuizDataService().then(function (data) {
        $scope.studentQuizData = playerServices.getAllStudentQuizData();
    }, function (data) {
        console.log('student quiz retrieval failed.')
    });

    // Set App Constants
    $rootScope.appConstants = appConstants;

}

/**
 * @ngdoc controller
 * @name DashboardCtrl
 * @description
 *
 * Student Dashboard Controller
 * 
 */
function DashboardCtrl($rootScope, $scope, $location) {
    //Redirect to Teacher Dashboard if its Teacher looged in
    if ($rootScope.userInfo.role == 'teacher') {
        $location.path('/dashboard/');
        return;
    }
}


/**
 * @ngdoc controller
 * @name StudentQuizCtrl
 * @description
 *
 * To SHow the status of quiz for particular student
 * 
 * @param $routeParams sId  Student ID
 *
 */
function StudentQuizCtrl($rootScope, $routeParams, $scope, $location, playerServices) {

    //Redirect to Student Dashboard if its Student looged in
    if ($rootScope.userInfo.role == 'student') {
        $location.path('/');
        return;
    }
    // get Student ID from route Params
    var sId = $routeParams.sId;
    $scope.studentInfo = $rootScope.allStudents[sId];  //Get Particualr student record

    //Get All Quiz Records
    $scope.quizData = playerServices.getAllQuizData();

    //Get All Student Quiz Records
    $scope.studentQuizData = playerServices.getAllStudentQuizData();
    
    $scope.accordion = 0;
    
    //Change Accordion collapse
    $scope.collapse = function (testID) {
        $scope.accordion = testID;
    }
}


/**
 * @ngdoc controller
 * @name TeacherDashboardCtrl
 * @description
 *
 * Teacher Dashboard Controller
 * Show the list of students
 * 
 */
function TeacherDashboardCtrl($rootScope, $scope, $location, userServices) {
    //Redirect to Student Dashboard if its Student looged in
    if ($rootScope.userInfo.role == 'student') {
        $location.path('/');
        return;
    }
    //Get all students records
    userServices.fetchStudentsData().then(function (data) {
        $rootScope.allStudents = userServices.getAllStudents();
    }, function (data) {
        console.log('User retrieval failed.')
    });

}

/**
 * @ngdoc controller
 * @name QuizCtrl
 * @description
 *
 * To initialize the quiz
 * 
 * @param $routeParams sId Student ID
 * @param $routeParams quizId Quiz ID
 *
 */
function QuizCtrl($rootScope, $scope, $routeParams, $location, playerServices) {

    //set Student ID from route Params
    var studentid = $routeParams.sId;

    // Set studentid as Logged user id if logged as student
    if ($rootScope.userInfo.role == 'student') {
        studentid = $rootScope.userInfo.id;
    }

    //Redirect to Student Dashboard if Wrong Quiz ID else Initialize the quiz as well
    if (!playerServices.setQuiz($routeParams.quizId, studentid)) {
        $location.path('/');
        return;
    }

    // Get Result Data in case already attempted
    $scope.getResultArr = playerServices.getResultArr();

    // if already attempted, redirect to first question page. No need to show welcome page
    if (!$.isEmptyObject($scope.getResultArr)) {
        $location.path('/question/0');
        return;
    }

    // Get all questions
    $scope.questionArr = playerServices.getAllQuestion();
}


/**
 * @ngdoc controller
 * @name ResultCtrl
 * @description
 *
 * To Submit all the questions and show the result
 * 
 */
function ResultCtrl($rootScope, $scope, $location, playerServices) {

    //Redirect to Student Dashboard if quiz is not initialized
    if (!playerServices.checkQuizIniate()) {
        $location.path('/');
        return;
    }

    // Submit Questions
    playerServices.submitQuestions();

    // Get Result object
    var result = playerServices.getResult($rootScope.userInfo.id);
    $scope.result = result;
}


/**
 * @ngdoc controller
 * @name QuestionCtrl
 * @description
 *
 * Question Controller to show Questions
 * 
 * @param $routeParams qId   Question Id
 *
 */
function QuestionCtrl($rootScope, $scope, $routeParams, $location, playerServices) {

    //set Question ID from route Params
    var qId = parseInt($routeParams.qId);

    //Redirect to Student Dashboard if Wrong Questtion ID or quiz is not initialized
    if (!playerServices.checkQuizIniate() || !playerServices.showQuestion(qId)) {
        $location.path('/');
        return;
    }

    // Default value as false
    $scope.quizDeactive = false;

    // get All Quesstions
    $scope.questionArr = playerServices.getAllQuestion();

    // Get Result Data in case already attempted
    $scope.getResultArr = playerServices.getResultArr();

    // if already attempted, deactivate the question
    if (!$.isEmptyObject($scope.getResultArr)) {
        $scope.quizDeactive = true;
    }

    //set Current Question ID
    $scope.current = qId;

    // Total Question Count
    var totalQuestion = $scope.questionArr.length;

    // Next Question index
    $scope.next = parseInt(qId) + 1;
    // Default True valuww for next previous links show
    $scope.nextLink = true;
    $scope.prevLink = true;

    // Hide Next link if last question
    if ($scope.next > (totalQuestion - 1)) {
        $scope.nextLink = false;
    }
    // Previous Question index
    $scope.previous = parseInt(qId) - 1;

    // Hide Previous link if last question
    if ($scope.previous < 0) {
        $scope.prevLink = false;
    }

    /**
     * On View change
     */
    $scope.$on('$routeChangeStart', function (next, current) {
        // Store the User Answer State
        playerServices.storeUserAnswerData(qId);
    });
}