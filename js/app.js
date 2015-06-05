/**
 * Created By Udesh Kumar
 * Configuration File
 * Date: 05/20/2015
 */

'use strict';

/**
 * Configure the app with all its modules and dependencies.
 * @type {{config:function}}
 */

var primeDigitalApp = angular.module('primeDigitalApp', [
    'ngRoute',
    'ui.bootstrap',
    'primeDigitalControllers',
    'primeDigitalFilters',
    'primeDigitalUserServices',
    'primeDigitalPlayer'
]);

/**
 * Define App Constants
 */
primeDigitalApp.constant('appConstants', {
    appName: "Scholastic PR1ME Mathematics - POC",
    appURL: "http://localhost/prime-digital-poc/",
    copyright: "&#153; &#174; &#38; &copy; 2015, 2012 Scholastic Inc. All Rights Reserved."
});


/**
 * Configures the routes for the main views of this single page app. URLs are hash locations (http://example.com/#/home)
 *
 * These populate the ng-view section in index.html
 */
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