/*jshint esversion: 6 */
(function(window,angular,crypto,Uint8Array) {
    'use strict';
    angular
        .module('ng-admin')
        .factory('Util', Util);

    Util.$inject = ['$log'];

    function Util( $log ) {
        var utility = {
            maxObjArr: maxObjArr,
            getByValue: getByValue,
            uuidv4: uuidv4,
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

        //https://gist.github.com/jed/982883
        function uuidv4() {
/*jslint bitwise: true */            
          return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
          );
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
})(window,window.angular,window.crypto,window.Uint8Array);
