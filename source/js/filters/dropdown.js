(function (window,angular) {
    'use strict';

    angular
        .module('ng-admin')
        .filter('iddropdown', function() {
          return function (input, context) {
            
            try {
            
                var map = context.col.colDef.editDropdownOptionsArray;
                var idField = context.col.colDef.editDropdownIdLabel;
                var valueField = context.col.colDef.editDropdownValueLabel;
                var initial = context.row.entity[context.col.field];
                if (typeof map !== "undefined") {
                  for (var i = 0; i < map.length; i++) {
                    if (map[i][idField] == input) {
                      return map[i][valueField];
                    }
                  }
                } else if (initial) {
                  return initial;
                }
                return input;
              
          } catch (e) {
//            context.grid.appScope.log("Error: " + e);
            console.log("error: " + e);
          }
        };
        })
        .filter('textDate', ['$filter', function ($filter) {
          //https://github.com/Joiler/ui-grid-edit-datepicker
              return function (input, format) {
                  var date = new Date(input);
                  return $filter('date')(date, format);
              };
          }])
            .filter('fractionFilter', function () {
              return function (value) {
                return Number(value).toFixed(0);
              };
            })
            
            .filter('currencyFilter', function () {
              var currencyMap = {
                'dollar': '$',
                'pound': '£',
                'euro': '€'
              };
              
              return function (value, scope) {
                var curlookup = scope.row.entity.currency === undefined ? 'dollar' : scope.row.entity.currency;
                return currencyMap[curlookup] + Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              };
            })

;})(window,window.angular);
