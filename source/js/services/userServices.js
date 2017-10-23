(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('UserServices', UserServices);

    UserServices.$inject = ['$http', '$q', '$log', '$rootScope',  '$cookieStore','$cookies'];

    function UserServices( $http, $q, $log, $rootScope,  $cookieStore, $cookies ) {
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
            getapikey: getapikey,
            isapikey: isapikey,
            forgotpassword: forgotpassword,
            resetpassword: resetpassword,
            changepassword: changepassword
//            getUser: getUser,
        };
        return service;
        
        function setapikey(key){
    //        $log.debug('UserServices setapikey', key);
            apikey = key;
            return apikey;
        }
        function getapikey(){
   //         $log.debug('UserServices getapikey', apikey);
            return apikey;
        }

        function isapikey(){

//cookies isn't working
            var cookiecheck = $cookies.getObject('globals');
//            $log.debug('cookie is:',cookiecheck, $cookies.getAll());

            if (typeof cookiecheck !== 'undefined') {
                if (typeof apikey !== 'undefined') {
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
        function forgotpassword(path) {
            $log.debug('forgotpassword service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        function resetpassword(path) {
            $log.debug('resetpassword service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        function changepassword(newpassword,oldpassword,username,email) {
            var path="/v1/changepassword";
            $log.debug('changepasswordpassword service entered');
            $log.debug('path',path);
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
            $log.debug('UserServices login entered:', username, password, path, data);
            
            var request = $http({
                method: "POST",
                url: path,
                data: {
                    thedata: data
                }
            });
            return( request.then( handleLogin, handleError ) );

        }

        function SetCredentials(username, password, apiKey) {
            //var authdata = username + ':' + password;
            $log.debug('SetCredentials entered', username,apiKey);
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
            $log.debug('SetCredentials globals', creds);
            $cookies.putObject('globals', creds, {
                    "path": "/", 
                    "domain":  "villaris.us", 
                    "secure": true, 
                    "expires": expireDate
            });
            $log.debug('SetCredentials exit', $cookies.getObject('globals'));

        }
        
        function ResetCredentials(username, apiKey) {
            //var authdata = username + ':' + password;
            $log.debug('ResetCredentials entered', username,apiKey);
            setapikey(apiKey);
            
            var authdata = apiKey;

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
            $http.defaults.headers.common['Authorization'] = authdata; 
 //           $cookieStore.put('globals', $rootScope.globals);
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $log.debug('ClearCredentials entered');
            
            $rootScope.globals = {};
            $cookieStore.remove('globals');
  //          $cookieStore.remove('globals');
            $http.defaults.headers.common['Authorization'] = '';
            setapikey('');
        }
    
        function getUserNames(path) {
            $log.debug('getUserNames service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getUserDetails() {
            $log.debug('getUserDetails service entered',userdetails);
            if (_.isEmpty(userdetails) && isapikey()) {
                var cookiecheck = $cookies.getObject('globals');
                var usernm = cookiecheck.currentUser.username;
                $log.debug('getUserDetails service refresh user',usernm);

                var path="../v1/userdetails?usernm=" + usernm;

                return getUserNames(path).then(function(data){
                    $log.debug('getUserNames returned data');
                    $log.debug(data);
                    userdetails.username = data.username;
                    userdetails.firstname = data.firstname;
                    userdetails.lastname = data.lastname;
                    userdetails.userid = data.userid;
                    userdetails.email = data.email;
                    userdetails.school = data.school;
                    userdetails.pictureurl = data.pictureurl;
                        return userdetails;
                },
                function (error) {
                    $log.debug('Caught an error getUserDetails refresh user , going to notify:', error); 
                    
//                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }
                );
            } else {
                    return ($q.resolve(userdetails));
//                return userdetails;
            }
            
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
        function handleLogin( response ) {
            $log.debug('UserServices handleLogin success:');
            userdetails.username = response.data.username;
            userdetails.firstname = response.data.firstname;
            userdetails.lastname = response.data.lastname;
            userdetails.email = response.data.email;
            $log.debug(response);
            return( response.data );
        }


        }
 })();
