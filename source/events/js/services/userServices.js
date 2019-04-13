(function () {
    'use strict';

    angular
        .module('ngadmin')
    .factory('UserServices', UserServices);

    UserServices.$inject = ['$http', '$q', '$log', '$rootScope', '$cookieStore','$cookies', 'Notification'];

    function UserServices( $http, $q, $log, $rootScope, $cookieStore, $cookies, Notification ) {
        var response;
        var apikey;
        var userdetails={};
        
        var service = {
            Login: Login,
            SetCredentials: SetCredentials,
            ResetCredentials: ResetCredentials,
            ClearCredentials: ClearCredentials,
            getUserNames: getUserNames,
            getUserDetails: getUserDetails,
            createUser: createUser,
            updateUser: updateUser,
            setapikey: setapikey,
            isapikey: isapikey,
            forgotpassword: forgotpassword,
            resetpassword: resetpassword,
            changepassword: changepassword
//            getUser: getUser,
        };
        return service;
        
        function setapikey(key){
            $log.log('UserServices setapikey', key);
            apikey = key;
        }

        function isapikey(){

//cookies isn't working
            var cookiecheck = $cookies.getObject('globals');
//            $log.log('cookie is:',cookiecheck, $cookies.getAll());

            if (typeof cookiecheck != 'undefined') {
                if (typeof apikey != 'undefined') {
                    return apikey.length > 0;
                } else {
                    //user refreshed page, but kept their browser session
                    //todo add session timeout
                    setapikey(cookiecheck.currentUser.authdata);
                    $http.defaults.headers.common['Authorization'] = cookiecheck.currentUser.authdata; 
                    return apikey.length > 0;
                }
            } else {
                return false;
                
            }

        }


        function isapikeyorig(){
            if (typeof apikey != 'undefined') {
    //            $log.log('UserServices isapikey', apikey);
                return apikey.length > 0;
            } else { return false; }

        }

        function forgotpassword(path) {
            $log.log('forgotpassword service entered');
            $log.log('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        function resetpassword(path) {
            $log.log('resetpassword service entered');
            $log.log('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        function changepassword(newpassword,oldpassword,username,email) {
            var path="/v1/changepassword";
            $log.log('changepasswordpassword service entered');
            $log.log('path',path);
            var data={
              username: username,
              newpassword: newpassword,
              oldpassword: oldpassword,
              email: email
            };

            var request = $http({
                method: "POST",
                url: path,
                data: {
                    thedata: data
                }
            });
            return( request.then( handleLogin, handleError ) );
        }
        
        function Login(username, password) {
            var path='/v1/login';
            var data={
              username: username,
              password: password
            };
            $log.log('UserServices login entered:', username, password, path, data);
            
            var request = $http({
                method: "POST",
                url: path,
                data: {
                    thedata: data
                }
            });
            return( request.then( handleLogin, handleError ) );

        }

        function SetCredentialsorig(username, password, apiKey) {
            //var authdata = username + ':' + password;
            $log.log('SetCredentials entered', username,apiKey);
            setapikey(apiKey);
            
            var authdata = apiKey;

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

        //    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $http.defaults.headers.common['Authorization'] = authdata; 
            $cookieStore.put('globals', $rootScope.globals);
        }

        function SetCredentials(username, password, apiKey, role) {
            //var authdata = username + ':' + password;
            $log.log('SetCredentials entered', username,apiKey, role);
            setapikey(apiKey);
            
            var authdata = apiKey;

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
            var creds = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
            
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1);            
              
        //    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $http.defaults.headers.common['Authorization'] = authdata; 
            //todo add expiration, secure, domain
            $log.log('SetCredentials globals', creds);
            $cookies.putObject('globals', creds, {
                    "path": "/", 
                    "domain":  "villaris.us", 
                    "secure": true, 
                    "expires": expireDate
            });
            $log.log('SetCredentials exit', $cookies.getObject('globals'));

        }



        function ResetCredentials(username, apiKey) {
            //var authdata = username + ':' + password;
            $log.log('ResetCredentials entered', username,apiKey);
            setapikey(apiKey);
            
            var authdata = apiKey;

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
            $http.defaults.headers.common['Authorization'] = authdata; 
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $log.log('ClearCredentials entered');
            
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common['Authorization'] = '';
            setapikey('');
        }
    
        function getUserNames(path) {
            $log.log('getUserNames service entered');
            $log.log('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getUserDetailsorig() {
            $log.log('getUserDetails service entered');

            return(userdetails);
        }

        function getUserDetails() {
            $log.log('getUserDetails service entered',userdetails);
            if (_.isEmpty(userdetails) && isapikey()) {
                var cookiecheck = $cookies.getObject('globals');
                var usernm = cookiecheck.currentUser.username;
                $log.log('getUserDetails service refresh user',usernm);

                var path="../v1/userdetails?usernm=" + usernm;

                getUserNames(path).then(function(data){
                    $log.log('getUserNames returned data');
                    $log.log(data);
                    userdetails.username = data.username;
                    userdetails.firstname = data.firstname;
                    userdetails.lastname = data.lastname;
                    userdetails.email = data.email;
                        return userdetails;
                },
                function (error) {
                    $log.log('Caught an error getUserDetails refresh user , going to notify:', error); 
                    
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }
                );
            } else {
                return userdetails;
            }
            
        }
        

        function createUser(path, thedata ) {
                    $log.log('createUser data before post :' , thedata);
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
                    $log.log('updateUser data before post :' , thedata);
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
            $log.log('UserServices failure:');
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
            $log.log('UserServices success:');
            $log.log(response);
            return( response.data );
        }
        function handleLogin( response ) {
            $log.log('UserServices success:');
            userdetails.username = response.data.username;
            userdetails.firstname = response.data.firstname;
            userdetails.lastname = response.data.lastname;
            userdetails.email = response.data.email;
            $log.log(response);
            return( response.data );
        }


        }
 })();
