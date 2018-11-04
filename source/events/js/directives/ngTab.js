(function () {
    'use strict';

    angular
        .module('ngadmin')
    .directive("ngTab", function($parse, $compile){
    return {
        link: function (scope, element, attrs) {
            element.click(function(e) {
                e.preventDefault();
            });
        }
    };
});
 })();  