(function () {
    'use strict';

    angular
        .module('ngadmin')
    .factory('EventServices', EventServices);

    EventServices.$inject = ['$http', '$q', '$log'];

    function EventServices( $http, $q, $log ) {
        var activeTab = 1; //default
        var response;
        var service = {
  //          getAllEvents: getAllEvents,
//            refreshEvents: refreshEvents,
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
        function setActiveTab(thetab,thecaller) {
            $log.log('EventServices setActiveTab called', thetab, thecaller);
            activeTab = thetab;
        }
        
        function getEventNames(path) {
            $log.log('getEventNames service entered');
            $log.log('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getEventDetails(path) {
            $log.log('getEventDetails service entered');
            $log.log('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        

        function getEventSource(path) {
            $log.log('getEventSource service entered');
            $log.log('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        
        function getColDefs(path) {
            $log.log('getColDefs service entered');
            $log.log('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getColDefList(path) {
            $log.log('getColDefList service entered');
            $log.log('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }


        function setColDefs(path, thedata) {
            $log.log('setColDefs service entered before post:', thedata);
            $log.log('path',path);

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
                    $log.log('createEvent data before post :' , thedata);
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
                    $log.log('updateEvent data before post :' , thedata);
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
            $log.log('EventServices failure:');
            $log.log(response);
            $log.log('status',response.status);
            $log.log('config',response.config);
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
            $log.log('EventServices success:');
            $log.log(response);
            return( response.data );
        }


        }
 })();
