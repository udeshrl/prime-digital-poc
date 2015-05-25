'use strict';

/* Controllers */

var primeDigitalControllers = angular.module('primeDigitalControllers', []);

primeDigitalControllers.controller('appController', ['$rootScope', '$scope', '$http', 'userServices',
    function ($rootScope, $scope, $http, userServices) {
        userServices.getUserInfo().then(function (data) {
            $rootScope.userInfo = data;
        }, function (data) {
            console.log('User retrieval failed.')
        });
    }]);

primeDigitalControllers.controller('DashboardCtrl', ['$rootScope', '$scope', '$http',
    function ($rootScope, $scope, $http) {
        $rootScope.loader = false;
    }]);

primeDigitalControllers.controller('QuizCtrl', ['$rootScope', '$scope', '$routeParams', 'playerServices',
    function ($rootScope, $scope, $routeParams, playerServices) {
        playerServices.getQuizDataService($routeParams.quizId, $rootScope.userInfo.id).then(function (data) {
            $scope.questionArr = playerServices.getAllQuestion();
        }, function (data) {
            console.log('Quiz retrieval failed.')
        });
    }]);

primeDigitalControllers.controller('ResultCtrl', ['$rootScope', '$scope', '$location', 'playerServices',
    function ($rootScope, $scope, $location, playerServices) {

        playerServices.submitQuestions();
        if (!playerServices.checkQuizIniate()) {
            $location.path('/');
            return;
        }
        var result = playerServices.getResult();
        $scope.totalQuestion = result.totalQuestion;
        var resultPercentage = parseInt(result.correctAns / result.totalQuestion * 100);
        $scope.correctAns = result.correctAns;
        $scope.resultPercentage = resultPercentage;
    }]);

primeDigitalControllers.controller('QuestionCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'playerServices',
    function ($rootScope, $scope, $routeParams, $location, playerServices) {
        if (!playerServices.checkQuizIniate()) {
            $location.path('/');
            return;
        }
        var qId = parseInt($routeParams.qId);
        $scope.questionArr = playerServices.getAllQuestion();
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
            playerServices.showQuestion(qId);
        });

        /**
         * On View change
         */
        $scope.$on('$routeChangeStart', function (next, current) {
            playerServices.storeUserAnswerData(qId);
        });
    }]);