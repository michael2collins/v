(function(window,angular) {
    'use strict';
    angular
        .module('ng-admin')
        .factory('Util', Util);

    Util.$inject = ['$log'];

    function Util( $log ) {
        var utility = {
            maxObjArr: maxObjArr,
            getByValue: getByValue,
            highlightFilteredHeader: highlightFilteredHeader
        };
        
        return utility;

        function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }
            
        function maxObjArr(arr,attr) {
            $log.debug('maxObjArr entered', arr, attr);
            var res = Math.max.apply(Math,arr.map(function(o){return o[attr];}));
            return res;
        }
        function getByValue(arr, value, attr, resvlu) {
            $log.debug('getByValue entered', arr, value, attr, resvlu);
        
          var result  = arr.filter(function(o){return o[attr] == value;} );
        
          return result? result[0][resvlu] : null; // or undefined
        
        }
        
    }
})(window,window.angular);
