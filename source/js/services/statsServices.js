(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('StatsServices', StatsServices);

    StatsServices.$inject = ['$http', '$q', '$log'];

    function StatsServices( $http, $q, $log ) {
        var apikey;

        var service = {
            getStudentStats: getStudentStats,
            getStudentStatsMonths: getStudentStatsMonths,
            setapikey: setapikey
        };
        return service;

        function setapikey(key) {
        //        $log.debug('StatsServices setapikey', key);
         apikey = key;
        }

        function getStudentStats( thedata ) {
                    $log.debug('getStudentStats data before post :' , thedata);
                    var path = '../v1/studentstats';
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return(request.then( handleSuccess, handleError ) );
        }        

        function getStudentStatsMonths( thedata ) {
                    $log.debug('getStudentStatsMonths data before post :' , thedata);
                    var path = '../v1/studentstatsmonths'
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function handleError( response ) {
            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            $log.debug('failure:');

            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {
            $log.debug(' success:');
            $log.debug(response.data);
            return( response );
        }
    }
 })();
