'use strict';

/* Services */

var primeDigitalUserServices = angular.module('primeDigitalUserServices', ['ngResource']);

primeDigitalUserServices.factory('userServices', ['$http', '$q', userServices]);

function userServices($http, $q) {
    var getUserInfo = function () {
        var def = $q.defer();

        $http.get("data/user.json")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
                    def.reject("Failed to get User");
                });
        return def.promise;
    }
    return {
        getUserInfo: getUserInfo
    };
}
