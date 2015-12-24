(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('AttendanceServices', AttendanceServices);

    AttendanceServices.$inject = ['$http', '$q', '$log'];

    function AttendanceServices( $http, $q, $log ) {
        var picFile = '';
        var theAttendance = '';
        var activeTab = 'Attendance Information'; //default
        var service = {
            getAllAttendances: getAllAttendances,
            updateAttendance: updateAttendance,
            getAttendance: getAttendance,
            createAttendance: createAttendance,
        };
        return service;

        function getAllAttendances(path) {
            $log.debug('getAllAttendances service entered');
            var request = $http({
                method: "get",
                url: path,
            //    params: {
            //        action: "get"
            //    }
            });
            return( request.then( handleSuccess, handleError ) );
        }

        function getAttendance(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getAttendance success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getAttendance failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        function createAttendance(path, thedata ) {
                    $log.debug('createAttendance data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                    //    params: {
                    //        action: "add"
                    //    },
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        
        function updateAttendance(path, Attendances) {
                    $log.debug('updateAttendance vm.data before put :' , Attendances);
            return $http({method: 'PUT', url: path, data: Attendances}).
                success(function(data, status, headers, config) {
                    $log.debug('updateAttendance success:' + path);
                    $log.debug(data);

                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('updateAttendance failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        // ---
        // PRIVATE METHODS.
        // ---
        function handleError( response ) {
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
            return( response.data );
        }

/*            function getFriends() {
                    var request = $http({
                        method: "get",
                        url: "api/index.cfm",
                        params: {
                            action: "get"
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                // I remove the friend with the given ID from the remote collection.
                function removeFriend( id ) {
                    var request = $http({
                        method: "delete",
                        url: "api/index.cfm",
                        params: {
                            action: "delete"
                        },
                        data: {
                            id: id
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }

                */


        }
 })();
