(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('EventServices', EventServices);

    EventServices.$inject = ['$http', '$q', '$log'];

    function EventServices( $http, $q, $log ) {
        var apikey;
        var activeTab = 'Event Information'; //default
        var response;
        var service = {
  //          getAllEvents: getAllEvents,
//            refreshEvents: refreshEvents,
             setapikey: setapikey,
            getEventSource: getEventSource,
            getColDefs: getColDefs,
            getColDefList: getColDefList,
            getEventNames: getEventNames,
            getEventDetails: getEventDetails,
            setColDefs: setColDefs,
            createEvent: createEvent,
            updateEvent: updateEvent,
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

     function setapikey(key) {
      //  $log.debug('setapikey', key);
         apikey = key;
     }
        
        function getEventNames(path) {
            $log.debug('getEventNames service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getEventDetails(path) {
            $log.debug('getEventDetails service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        

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

        function createEvent(path, thedata ) {
                    $log.debug('createEvent data before post :' , thedata);
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
                        method: "PUT",
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
            $log.debug('EventServices failure:');
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
            $log.debug('EventServices success:');
            $log.debug(response);
            return( response.data );
        }


        }
 })();
