/**
 * Created By Udesh Kumar
 * Filters
 * Date: 05/29/2015
 */

var primeDigitalFilters = angular.module('primeDigitalFilters', []);


primeDigitalFilters.filter('renderHTMLCorrectly', renderHTMLCorrectly);


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