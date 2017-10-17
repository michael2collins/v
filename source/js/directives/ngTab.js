(function () {
    'use strict';

    angular
        .module('ng-admin')
    .directive("ngTab", function($parse, $compile){
        return {
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                });
            }
        };
    })
    .directive('myCustomDropdown', function() {
      return {
        template: '<select class="ui-grid-filter-select ui-grid-filter-input-0" ng-model="colFilter.term" ng-options="option.value as option.value for option in colFilter.options track by option.value"></select>'
      };
    })

    .directive('myCustomDropdownid', function() {
      return {
        template: '<select class="ui-grid-filter-select ui-grid-filter-input-0" ng-model="colFilter.term" ng-options="option.id as option.value for option in colFilter.options track by option.id"></select>'
      };
    });

 })();  