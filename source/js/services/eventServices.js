(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('EventServices', EventServices);

    EventServices.$inject = ['$http', '$q', '$log'];

    function EventServices( $http, $q, $log ) {
        var activeTab = 'Event Information'; //default
        var response;
        var service = {
  //          getAllEvents: getAllEvents,
//            refreshEvents: refreshEvents,
            getEventSource: getEventSource,
            getColDefs: getColDefs,
            getColDefList: getColDefList,
            setColDefs: setColDefs,
//            updateEvent: updateEvent,
//            getEvent: getEvent,
            setActiveTab: setActiveTab,
            getActiveTab: getActiveTab
        };
        return service;
        
        function getActiveTab() {
            return activeTab;
        }
        function setActiveTab(thetab) {
            activeTab = thetab;
        }
        
        
/*
        function getAllEvents(path, configdata) {
            $log.debug('getAllEvents service entered');
            $log.debug('path',path);
            $log.debug('configdata',configdata);
            var themethod="POST";
            $log.debug('method',themethod);
            var request = $http({
                method: themethod,
                url: path,
              params: {
                        },
              headers: {'Content-Type': 'application/json'},
                data: configdata
            });
            $log.debug('request', request);
//            debugger;
            response = null;
            code = null;
            return( request.then( handleSuccess, handleError ) );
        }
*/


        function getEventSource(path) {
            $log.debug('getEventSource service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        
        function getColDefs(path) {
            $log.debug('getColDefs service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getColDefList(path) {
            $log.debug('getColDefList service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

/*        function getDOW() {
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

        function getEvent(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getEvent success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getEvent failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        function setStudentReadyNextRank(path, readyness) {
                    $log.debug('setStudentReadyNextRank before put :',path, readyness);
                    var dta = {
                        readyness: readyness
                    };
                    var request = $http({
                        method: "PUT",
                        url: path,
                        data: dta
                    });
                    return( request.then( handleSuccess, handleError ) );
        }
*/
        function setColDefs(path, thedata) {
            $log.debug('setColDefs service entered before post:', thedata);
            $log.debug('path',path);

            var request = $http({
                method: "POST",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }

        function updateEvent(path, thedata ) {
                    $log.debug('updateEvent data before post :' , thedata);
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
                return( $q.reject( "An unknown error occurred." ) );
              //return(null);
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
