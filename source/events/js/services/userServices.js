(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('UserServices', UserServices);

    UserServices.$inject = ['$http', '$q', '$log', '$rootScope', '$cookieStore'];

    function UserServices( $http, $q, $log, $rootScope, $cookieStore ) {
        var response;

        var service = {
            Login: Login,
            SetCredentials: SetCredentials,
            ClearCredentials: ClearCredentials,
            getUserNames: getUserNames,
            getUserDetails: getUserDetails,
            createUser: createUser,
            updateUser: updateUser,
//            getUser: getUser,
        };
        return service;
        
        function Login(username, password) {
            var path='/v1/login';
            var data={
              username: username,
              password: password
            };
            $log.debug('UserServices login entered:', username, password, path, data);
            
            var request = $http({
                method: "POST",
                url: path,
                data: {
                    thedata: data
                }
            });
            return( request.then( handleSuccess, handleError ) );

        }

        function SetCredentials(username, password, apiKey) {
            //var authdata = username + ':' + password;
            $log.debug('SetCredentials entered', username);
            var authdata = apiKey;

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

        //    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $http.defaults.headers.common['Authorization'] = authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $log.debug('ClearCredentials entered');
            
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = '';
        }
    
        function getUserNames(path) {
            $log.debug('getUserNames service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getUserDetails(path) {
            $log.debug('getUserDetails service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        

        function createUser(path, thedata ) {
                    $log.debug('createUser data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        
        function updateUser(path, thedata ) {
                    $log.debug('updateUser data before post :' , thedata);
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
            $log.debug('UserServices failure:');
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
            $log.debug('UserServices success:');
            $log.debug(response);
            return( response.data );
        }


        }
 })();
