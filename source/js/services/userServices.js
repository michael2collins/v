import angular from 'angular';

export class UserServices {
    constructor($http, $q, $log, $rootScope, $cookies, _, Util) {
        'ngInject';
        
        this.apikey = {};
        this.userdetails = {};
        this._$http = $http;
        this._$q = $q;
        this._$log = $log;
        this._$rootScope = $rootScope;
//        this._$cookieStore = $cookieStore;
        this._$cookies = $cookies;
        this.__ = _;
        this.Util = Util;
    }

    getUserOptions(path) {
        var self=this;
        self._$log.log('getUserOptions service entered');
        self._$log.log('path', path);
        var request = self._$http({
            method: "GET",
            url: path,
            ignoreLoadingBar: true
        });
        return (request.then(self.handleSuccess, self.handleError));

    }

    setUserOptions(path, thedata) {
        var self = this;
        self._$log.log('setUserOptions data before post :', thedata);
        var request = self._$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    setapikey(key) {
        var self = this;
        self.apikey = key;
        return self.apikey;
    }

    getapikey() {
        var self = this;
        return self.apikey;
    }

    isapikey() {
//        var self = this;

        //cookies isn't working
        var cookiecheck = this._$cookies.getObject('globals');
        //            self._$log.log('cookie is:',cookiecheck, $cookies.getAll());

        if (typeof cookiecheck !== 'undefined') {
            if (typeof this.apikey !== 'undefined' && !this.Util.isEmptyObject(this.apikey)) {
                return this.apikey.length > 0;
            }
            else {
                //user refreshed page, but kept their browser session
                //todo add session timeout
                this.setapikey(cookiecheck.currentUser.authdata);
                this._$http.defaults.headers.common['Authorization'] = cookiecheck.currentUser.authdata;
                return this.apikey.length > 0;
            }
        }
        else {
            return false;

        }

    }

    forgotpassword(path) {
        var self = this;
        self._$log.log('forgotpassword service entered');
        self._$log.log('path', path);

        return (self._$http.get(path).then(self.handleSuccess, self.handleError));
    }

    resetpassword(path) {
        var self = this;
        self._$log.log('resetpassword service entered');
        self._$log.log('path', path);

        return (self._$http.get(path).then(self.handleSuccess, self.handleError));
    }

    changepassword(newpassword, oldpassword, username, email) {
        var self = this;
        var path = "/v1/changepassword";
        self._$log.log('changepasswordpassword service entered');
        self._$log.log('path', path);
        var data = {
            username: username,
            newpassword: newpassword,
            oldpassword: oldpassword,
            email: email
        };

        var request = self._$http({
            method: "POST",
            url: path,
            data: {
                thedata: data
            }
        });
        return (request.then(self.handleLogin, self.handleError));
    }

    Login(username, password) {
        var self = this;
        var path = '/v1/login';
        var data = {
            username: username,
            password: password
        };
        self._$log.log('UserServices login entered:', username, password, path, data);

        var request = self._$http({
            method: "POST",
            url: path,
            data: {
                thedata: data
            }
        });
        return (request.then(self.handleLogin, self.handleError));

    }

    SetCredentials(username, password, apiKey, role) {
        var self = this;
        //var authdata = username + ':' + password;
        self._$log.log('SetCredentials entered', username, apiKey, role);
        self.setapikey(apiKey);

        var authdata = apiKey;

        self._$rootScope.globals = {
            currentUser: {
                username: username,
                role: role,
                authdata: authdata
            }
        };
        var creds = {
            currentUser: {
                username: username,
                role: role,
                authdata: authdata
            }
        };

        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);

        //    self._$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
        self._$http.defaults.headers.common['Authorization'] = authdata;
        //todo add expiration, secure, domain
        self._$log.log('SetCredentials globals', creds);
        self._$cookies.putObject('globals', creds, {
            "path": "/",
            "domain": "villaris.us",
            "secure": true,
            "expires": expireDate
        });
        self._$log.log('SetCredentials exit', self._$cookies.getObject('globals'));

    }

    ResetCredentials(username, apiKey) {
        var self = this;
        //var authdata = username + ':' + password;
        self._$log.log('ResetCredentials entered', username, apiKey);
        self.setapikey(apiKey);

        var authdata = apiKey;

        self._$rootScope.globals = {
            currentUser: {
                username: username,
                authdata: authdata
            }
        };
        self._$http.defaults.headers.common['Authorization'] = authdata;
        //           $cookieStore.put('globals', $rootScope.globals);
        self._$cookies.put('globals', self._$rootScope.globals);
    }

    ClearCredentials() {
        var self = this;
        self._$log.log('ClearCredentials entered');

        self._$rootScope.globals = {};
//        self._$cookieStore.remove('globals');
        self._$cookies.remove('globals');
        //          $cookieStore.remove('globals');
        self.setapikey('');
        
        var creds = {
            currentUser: {
                username: '',
                authdata: ''
            }
        };

        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() - 1);

        //    self._$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
        self._$http.defaults.headers.common['Authorization'] = '';
        //todo add expiration, secure, domain
        self._$log.log('SetCredentials globals', creds);
        self._$cookies.putObject('globals', creds, {
            "path": "/",
            "domain": "villaris.us",
            "secure": true,
            "expires": expireDate
        });
        
    }

    getUserNames(path) {
        var self = this;
        self._$log.log('getUserNames service entered');
        self._$log.log('path', path);

        return (self._$http.get(path).then(self.handleSuccess, self.handleError));
    }

    setUserDetailOptions(input) {
        this.userdetails.options = input;
    }
    isDebugEnabled() {
        if (_.isEmpty(this.userdetails)) {
//            console.log('isdebugenabled is empty');
            return false;
        } else {
 //           console.log('isdebugenabled is not empty',this.userdetails.options );
            return JSON.parse(this.userdetails.options).debug == "Off" ? false : true;
        }
    }
    getUserDetails() {
        var self = this;
        self._$log.log('getUserDetails service entered', self.userdetails);
//        if (self.__.isEmpty(self.userdetails) && self.isapikey()) {
        var cookiecheck = self._$cookies.getObject('globals');
        if (self.__.isEmpty(self.userdetails) && cookiecheck !== undefined) {
            var usernm = cookiecheck.currentUser.username;
            self._$log.log('getUserDetails service refresh user', usernm);

            var path = "../v1/userdetails?usernm=" + usernm;

            return self.getUserNames(path).then(function(data) {
                    self._$log.log('userServices getUserNames returned data');
                    self._$log.log(data);
                    self.userdetails.username = data.username;
                    self.userdetails.firstname = data.firstname;
                    self.userdetails.lastname = data.lastname;
                    self.userdetails.userid = data.userid;
                    self.userdetails.email = data.email;
                    self.userdetails.school = data.school;
                    self.userdetails.pictureurl = data.pictureurl;
                    self.userdetails.options = data.options;
                    self.userdetails.role = data.role;
                    return self.userdetails;
                },
                function(error) {
                    self._$log.log('Caught an error getUserDetails refresh user , going to notify:', error);

                    //                    Notification.error({message: error, delay: 5000});
                    return (self._$q.reject(error));
                }
            );
        }
        else {
            return (self._$q.resolve(self.userdetails));
            //                return userdetails;
        }

    }


    createUser(path, thedata) {
        var self = this;
        self._$log.log('createUser data before post :', thedata);
        var request = self._$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    updateUser(path, thedata) {
        var self = this;
        self._$log.log('updateUser data before post :', thedata);
        var request = self._$http({
            method: "PUT",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    // ---
    // PRIVATE METHODS.
    // ---
    handleError(response) {
        var self = this;
        self._$log.log('UserServices failure:');
        self._$log.log(response);
        self._$log.log('status', response.status);
        self._$log.log('config', response.config);
        //debugger;
        if (!angular.isObject(response.data) ||
            !response.data.message
        ) {
            return (self._$q.reject("An unknown error occurred."));
            //return(null);
        }
        // Otherwise, use expected error message.
        return (self._$q.reject(response.data.message));
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
     handleSuccess(response) {
/*        var self = this;
        self._$log.log('UserServices success:');
        self._$log.log(response);
*/
        return (response.data);
    }

    handleLogin(response) {
/*        var self = this;
        self._$log.log('UserServices self.handleLogin success:');
        
        self.userdetails.username = response.data.username;
        self.userdetails.firstname = response.data.firstname;
        self.userdetails.lastname = response.data.lastname;
        self.userdetails.email = response.data.email;
        self.userdetails.pictureurl = response.data.pictureurl;
        self.userdetails.school = response.data.school;
        self._$log.log(response);
  */      
        return (response.data);
    }


}
