(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('TestingServices', TestingServices);

    TestingServices.$inject = ['$http', '$q', '$log', '$window'];

    function TestingServices( $http, $q, $log, $window ) {
        var apikey;
        var thetasknamelist = '';
        var response;
        var code;
        var currentCalendarEvent;
        var notifylist = [];
        var intervalValue = 5000; //milli
        var okNotify;
        var checktime;

        var service = {
  //          getAlltasknamelists: getAlltasknamelists,
             setapikey: setapikey,
             getTestTypes: getTestTypes
        };
        return service;
        
     function setapikey(key) {
   //     $log.debug('setapikey', key);
         apikey = key;
     }
        function getTestTypes(path) {
            $log.debug('getTestTypes service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        // ---
        // PRIVATE METHODS.
        // ---
        function handleError( response ) {
            $log.debug('failure:');
            $log.debug(response);
            $log.debug('status',response.status);
            $log.debug('config',response.config);
            //debugger;
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
              //  return( $q.reject( "An unknown error occurred." ) );
              return(null);
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {
            $log.debug(' success:');
            $log.debug(response);
            return( response.data );
        }


        }
 })();
