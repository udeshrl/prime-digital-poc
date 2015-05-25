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

primeDigitalApp.constant('appName', 'AuthMagix');
primeDigitalApp.constant('appURL', 'http://localhost/PDPOC/');

primeDigitalApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/quiz/:quizId', {
                    templateUrl: 'partials/quiz.html',
                    controller: 'QuizCtrl'
                }).
                when('/result', {
                    templateUrl: 'partials/result.html',
                    controller: 'ResultCtrl'
                }).
                when('/quiz/question/:qId', {
                    templateUrl: 'partials/question.html',
                    controller: 'QuestionCtrl',
                    reloadOnSearch: false,
                    abstract: true,
                }).
                when('/mydashboard', {
                    templateUrl: 'partials/student_dashboard.html',
                    controller: 'DashboardCtrl'
                }).
                otherwise({
                    templateUrl: 'partials/student_dashboard.html',
                    controller: 'DashboardCtrl'
                });
    }]);