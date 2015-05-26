'use strict';

/* Controllers */

var primeDigitalControllers = angular.module('primeDigitalControllers', []);

primeDigitalControllers.controller('appController', ['$rootScope', '$scope', '$http', 'userServices', 'playerServices',
    function ($rootScope, $scope, $http, userServices, playerServices) {
        userServices.getUserInfo().then(function (data) {
            $rootScope.userInfo = data;
        }, function (data) {
            console.log('User retrieval failed.')
        });
        playerServices.getQuizDataService().then(function (data) {
            $scope.quizData = playerServices.getAllQuizData();
        }, function (data) {
            console.log('Quiz retrieval failed.')
        });
    }]);

primeDigitalControllers.controller('DashboardCtrl', ['$rootScope', '$scope', '$http',
    function ($rootScope, $scope, $http) {
        $rootScope.loader = false;
    }]);

primeDigitalControllers.controller('QuizCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'playerServices',
    function ($rootScope, $scope, $routeParams, $location, playerServices) {
        if (!playerServices.setQuiz($routeParams.quizId)) {
            $location.path('/');
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
        var result = playerServices.getResult();
        $scope.totalQuestion = result.totalQuestion;
        var resultPercentage = parseInt(result.correctAns / result.totalQuestion * 100);
        $scope.correctAns = result.correctAns;
        $scope.resultPercentage = resultPercentage;
    }]);

primeDigitalControllers.controller('QuestionCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'playerServices',
    function ($rootScope, $scope, $routeParams, $location, playerServices) {
        var qId = parseInt($routeParams.qId);
        if (!playerServices.checkQuizIniate() || !playerServices.showQuestion(qId)) {
            $location.path('/');
            return;
        }
        
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
            
        });

        /**
         * On View change
         */
        $scope.$on('$routeChangeStart', function (next, current) {
            playerServices.storeUserAnswerData(qId);
        });
    }]);