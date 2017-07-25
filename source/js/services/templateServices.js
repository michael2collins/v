(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('TemplateServices', TemplateServices);

    TemplateServices.$inject = ['$http', '$q', '$log', '$window'];

    function TemplateServices( $http, $q, $log, $window ) {
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
             gettemplateDetails: gettemplateDetails,
             gettemplateNames: gettemplateNames,
             createtemplate: createtemplate,
             removetemplate: removetemplate,
             updateTemplate: updateTemplate
        };
        return service;
        
     function setapikey(key) {
   //     $log.debug('setapikey', key);
         apikey = key;
     }

        function createtemplate(path, thedata ) {
                    $log.debug('createtemplate data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function removetemplate(path, thedata ) {
                    $log.debug('removetemplate data before delete :' , thedata);
                    var request = $http({
                        method: "DELETE",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function updateTemplate(path, thedata ) {
                    $log.debug('updateTemplate data before put :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        
        function gettemplateDetails(path) {
            $log.debug('gettemplateDetails service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function gettemplateNames(path) {
            $log.debug('gettemplateNames service entered');
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
            $log.debug(response, response.error);
            if (response.error === true || response.data === null) {
                $log.debug('templateServices error returned', response);
                response.message = "templateServices error returned";
                return ($q.reject(response));                        
            }
            
            return( response.data );
        }


        }
 })();
