'use strict';

/* Services */

var primeDigitalUserServices = angular.module('primeDigitalUserServices', ['ngResource']);

primeDigitalUserServices.factory('userServices', ['$http', '$q', userServices]);

function userServices($http, $q) {
    var students = [];
    var getUserInfo = function (token) {
        var def = $q.defer();
        if (token == '') {
            token = 'STUDENT2001'; // Default token
        }
        $http.get("data/mock/" + token + ".json")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get User");
                });
        return def.promise;
    }

    var fetchStudentsData = function () {
        var def = $q.defer();
        $http.get("data/students.json")
                .success(function (data) {
                    students = data.students;
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get User");
                });
        return def.promise;
    }

    var getAllStudents = function () {
        return students;
    };
    return {
        getUserInfo: getUserInfo,
        getAllStudents: getAllStudents,
        fetchStudentsData: fetchStudentsData
    };
}
