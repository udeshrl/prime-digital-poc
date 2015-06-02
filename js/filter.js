/**
 * Created By Udesh Kumar
 * Filters
 * Date: 05/29/2015
 */

var primeDigitalFilters = angular.module('primeDigitalFilters', []);


primeDigitalFilters.filter('renderHTMLCorrectly', renderHTMLCorrectly);
primeDigitalFilters.filter('isEmpty', isEmpty);
primeDigitalFilters.filter('length', length);


/**
 * @ngdoc Filter
 * @name renderHTMLCorrectly
 * @description
 *
 * To render HTML in view
 * 
 * @param Html
 *
 */
function renderHTMLCorrectly($sce)
{
    return function (stringToParse)
    {
        return $sce.trustAsHtml(stringToParse);
    }
}

/**
 * @ngdoc Filter
 * @name isEmpty
 * @description
 *
 * To check if object empty
 * 
 * @param object
 * 
 * @return {boolean}
 *
 */
function isEmpty() {
    var bar;
    return function (obj) {
        for (bar in obj) {
            if (obj.hasOwnProperty(bar)) {
                return false;
            }
        }
        return true;
    };
}

/**
 * @ngdoc Filter
 * @name length
 * @description
 *
 * To check keys length of object
 * 
 * @param object
 * 
 * @return {number}
 *
 */
function length() {
    return function (obj) {
        return Object.keys(obj).length
    };
}