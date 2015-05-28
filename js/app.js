'use strict';

/* App Module */

var primeDigitalApp = angular.module('primeDigitalApp', [
    'ngRoute',
    'primeDigitalAnimations',
    'primeDigitalControllers',
    'primeDigitalFilters',
    'primeDigitalUserServices',
    'primeDigitalPlayer'
]);

primeDigitalApp.constant('appName', 'Scholastic PR1ME Mathematics - POC');
primeDigitalApp.constant('appURL', 'http://localhost/prime-digital-poc/');

primeDigitalApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/quiz/:quizId/:sId', {
                    templateUrl: 'partials/quiz.html',
                    controller: 'QuizCtrl'
                }).
                when('/result', {
                    templateUrl: 'partials/result.html',
                    controller: 'ResultCtrl'
                }).
                when('/question/:qId', {
                    templateUrl: 'partials/question.html',
                    controller: 'QuestionCtrl',
                    reloadOnSearch: false,
                    abstract: true,
                }).
                when('/dashboard', {
                    templateUrl: 'partials/teacher_dashboard.html',
                    controller: 'TeacherDashboardCtrl'
                }).
                when('/student/:sId', {
                    templateUrl: 'partials/student_quiz.html',
                    controller: 'StudentQuizCtrl',
                    reloadOnSearch: false,
                    abstract: true,
                }).
                otherwise({
                    templateUrl: 'partials/student_dashboard.html',
                    controller: 'DashboardCtrl'
                });
    }]);