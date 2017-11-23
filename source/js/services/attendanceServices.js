(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('AttendanceServices', AttendanceServices);

    AttendanceServices.$inject = ['$http', '$q', '$log'];

    function AttendanceServices( $http, $q, $log ) {
        var apikey;
        var picFile = '';
        var theAttendance = '';
        var activeTab = 'Attendance Information'; //default
        var response;
        var code;
        var service = {
             setapikey: setapikey,
            refreshAttendances: refreshAttendances,
            getAttendanceHistory: getAttendanceHistory,
            setStudentReadyNextRank: setStudentReadyNextRank,
            getDOW: getDOW,
            getSchedule: getSchedule,
            getSchedules: getSchedules,
            getClasses: getClasses,
            updateAttendance: updateAttendance,
            updateSchedule: updateSchedule,
            removeSchedule: removeSchedule,
            setActiveTab: setActiveTab,
            getActiveTab: getActiveTab,
            getAttendanceSum: getAttendanceSum
        };
        return service;
        
        function getActiveTab() {
            return activeTab;
        }
        function setActiveTab(thetab) {
            activeTab = thetab;
        }
     function setapikey(key) {
   //     $log.debug('setapikey', key);
         apikey = key;
     }
        
        

        function refreshAttendances(path) {
            $log.debug('refreshAttendances service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getAttendanceHistory(path) {
            $log.debug('getAttendanceHistory service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getAttendanceSum(path) {
            $log.debug('getAttendanceSum service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getDOW() {
            var path = '../v1/DOW';
            $log.debug('getDOW service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function getSchedule(path) {
            $log.debug('getSchedule service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function getSchedules(path) {
            $log.debug('getSchedules service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function getClasses(path) {
            $log.debug('getClasses service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }

        function setStudentReadyNextRank(path, readyness, theclass) {
                    $log.debug('setStudentReadyNextRank before put :',path, readyness, theclass);
                    var dta = {
                        readyness: readyness,
                        theclass: theclass
                    };
                    var request = $http({
                        method: "PUT",
                        url: path,
                        data: dta
                    });
                    return( request.then( handleSuccess, handleError ) );
        }

        function removeSchedule( thedata, path ) {
            $log.debug('removeSchedule data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function updateAttendance(path, thedata ) {
                    $log.debug('updateAttendance data before post :' , thedata);
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
        function updateSchedule(path, thedata ) {
                    $log.debug('updateSchedule data before post :' , thedata);
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
            $log.debug(response, response.error);
            if (response.error === true || response.data === null) {
                $log.debug('attendanceServices error returned', response);
                response.message = "attendanceServices error returned";
                return ($q.reject(response));                        
            }
            
            return( response.data );
        }

        }
 })();
