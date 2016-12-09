(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('CalendarServices', CalendarServices);

    CalendarServices.$inject = ['$http', '$q', '$log'];

    function CalendarServices( $http, $q, $log ) {
        var apikey;
        var thetasknamelist = '';
        var response;
        var code;
        var service = {
  //          getAlltasknamelists: getAlltasknamelists,
             setapikey: setapikey,
            updatetasknamelist: updatetasknamelist,
            gettasknamelist: gettasknamelist
        };
        return service;
        
     function setapikey(key) {
   //     $log.debug('setapikey', key);
         apikey = key;
     }
        function gettasknamelist(path) {
            $log.debug('gettasknamelist service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function updatetasknamelist(path, thedata ) {
                    $log.debug('updatetasknamelist data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
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
