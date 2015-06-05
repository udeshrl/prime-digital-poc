/**
 * Created By Udesh Kumar
 * User Services File
 * Date: 05/25/2015
 */

'use strict';

/* Services */

var primeDigitalUserServices = angular.module('primeDigitalUserServices', ['ngResource']);

primeDigitalUserServices.factory('userServices', userServices);


/**
 * @ngdoc factory
 * @name userServices
 * @description
 *
 * User related Service
 * 
 */
function userServices($http, $q) {
    var students = [];

    /**
     * @ngdoc function
     * @name getUserInfo
     * @description
     *
     * Get User information from JSON
     * 
     * @param {string} token
     * 
     */
    var getUserInfo = function (token) {
        var def = $q.defer();
        if (token == '') {
//            token = 'STUDENT2001'; // Default token
            token = 'TEACHER1001'; // Default token
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

     /**
     * @ngdoc function
     * @name fetchStudentsData
     * @description
     *
     * Get all students record from JSON
     * 
     */
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
    
    /**
     * @ngdoc function
     * @name getAllStudents
     * @description
     *
     * Return all students records
     * 
     */
    var getAllStudents = function () {
        return students;
    };
    return {
        getUserInfo: getUserInfo,
        getAllStudents: getAllStudents,
        fetchStudentsData: fetchStudentsData
    };
}
