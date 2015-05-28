'use strict';

/* Controllers */

var primeDigitalControllers = angular.module('primeDigitalControllers', []);

primeDigitalControllers.controller('appController', ['$rootScope', '$scope', '$location', '$routeParams', '$http', 'userServices', 'playerServices', 'appURL', 'appName',
    function ($rootScope, $scope, $location, $routeParams, $http, userServices, playerServices, appURL, appName) {
        var searchParams = $location.search(), token = '';
        if (searchParams['token']) {
            token = searchParams['token'];
        }
//        function getQueryStringValue(key) {
//            return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
//        }
//        token = getQueryStringValue('token');
        userServices.getUserInfo(token).then(function (data) {
            $rootScope.userInfo = data;
        }, function (data) {
            console.log('User retrieval failed.')
        });
        playerServices.getQuizDataService().then(function (data) {
            $scope.quizData = playerServices.getAllQuizData();
        }, function (data) {
            console.log('Quiz retrieval failed.')
        });
        playerServices.getStudentQuizDataService().then(function (data) {
            $scope.studentQuizData = playerServices.getAllStudentQuizData();
        }, function (data) {
            console.log('student retrieval failed.')
        });

        $rootScope.appName = appName;
        $rootScope.appURL = appURL;
    }]);

primeDigitalControllers.controller('DashboardCtrl', ['$rootScope', '$scope', '$location', '$http',
    function ($rootScope, $scope, $location, $http) {
        if ($rootScope.userInfo.role == 'teacher') {
            $location.path('/dashboard/');
            return;
        }
    }]);

primeDigitalControllers.controller('StudentQuizCtrl', ['$rootScope', '$routeParams', '$scope', '$location', '$http', 'playerServices',
    function ($rootScope, $routeParams, $scope, $location, $http, playerServices) {
        if ($rootScope.userInfo.role == 'student') {
            $location.path('/');
            return;
        }
        var sId = $routeParams.sId;
        $scope.quizData = playerServices.getAllQuizData();
        $scope.studentQuizData = playerServices.getAllStudentQuizData();
        $scope.studentInfo = $rootScope.allStudents[sId];

    }]);

primeDigitalControllers.controller('TeacherDashboardCtrl', ['$rootScope', '$scope', '$location', '$http', 'userServices',
    function ($rootScope, $scope, $location, $http, userServices) {
        if ($rootScope.userInfo.role == 'student') {
            $location.path('/');
            return;
        }
        userServices.fetchStudentsData().then(function (data) {
            $rootScope.allStudents = userServices.getAllStudents();
        }, function (data) {
            console.log('User retrieval failed.')
        });

    }]);

primeDigitalControllers.controller('QuizCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'playerServices',
    function ($rootScope, $scope, $routeParams, $location, playerServices) {
        var studentid = $routeParams.sId;
        if ($rootScope.userInfo.role == 'student') {
            studentid = $rootScope.userInfo.id;
        }
        if (!playerServices.setQuiz($routeParams.quizId, studentid)) {
            $location.path('/');
            return;
        }
        $scope.getResultArr = playerServices.getResultArr();
        if (!$.isEmptyObject($scope.getResultArr)) {
            $location.path('/question/0');
            return;
        }
        $scope.questionArr = playerServices.getAllQuestion();
    }]);

primeDigitalControllers.controller('ResultCtrl', ['$rootScope', '$scope', '$location', 'playerServices',
    function ($rootScope, $scope, $location, playerServices) {

        playerServices.submitQuestions();
        if (!playerServices.checkQuizIniate()) {
            $location.path('/');
            return;
        }
        var result = playerServices.getResult($rootScope.userInfo.id);
        $scope.result = result;
    }]);

primeDigitalControllers.controller('QuestionCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'playerServices',
    function ($rootScope, $scope, $routeParams, $location, playerServices) {
        var qId = parseInt($routeParams.qId);
        if (!playerServices.checkQuizIniate() || !playerServices.showQuestion(qId)) {
            $location.path('/');
            return;
        }
        $scope.quizDeactive = false;
        $scope.questionArr = playerServices.getAllQuestion();
        $scope.getResultArr = playerServices.getResultArr();
        if (!$.isEmptyObject($scope.getResultArr)) {
            $scope.quizDeactive = true;
        }
        var current = $routeParams.qId;
        $scope.current = current;
        var totalQuestion = $scope.questionArr.length;
        $scope.next = parseInt(current) + 1;
        $scope.nextLink = true;
        $scope.prevLink = true;
        if ($scope.next > (totalQuestion - 1)) {
            $scope.nextLink = false;
        }
        $scope.previous = parseInt(current) - 1;
        if ($scope.previous < 0) {
            $scope.prevLink = false;
        }

        $scope.currentQuestion = playerServices.getQuestionData(qId);

        /**
         * On View Content Loaded
         */
        $scope.$on('$viewContentLoaded', function () {

        });

        /**
         * On View change
         */
        $scope.$on('$routeChangeStart', function (next, current) {
            playerServices.storeUserAnswerData(qId);
        });
    }]);