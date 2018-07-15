(function () {

    'use strict';

    angular
        .module('ng-admin.all')
        .controller('ResetpwdController', ResetpwdController);
        
        ResetpwdController.$inject = [
            '$scope', 
            '$log',
            '$routeParams',
            '$location',
            'FlashService',
            'UserServices',
            '$q'
            ];
        function ResetpwdController($scope, $log, $routeParams, 
                $location, FlashService, UserServices, $q){
        /* jshint validthis: true */

            var pagevm = this;
            pagevm.resetpwd = resetpwd;
            pagevm.compare = compare;
            pagevm.username;
            pagevm.password;
            pagevm.email;
            pagevm.confirm_password;
            pagevm.dataLoading;
            pagevm.apiKey;
            pagevm.isconfirm;
            
            $log.debug('enter ResetpwdController');
            $log.debug('username', pagevm.username);
            $log.debug('password', pagevm.password);
            $log.debug('confirm_password', pagevm.confirm_password);

            pagevm.re = /^[a-zA-Z]\w{3,14}$/;

            
            (function initController() {
                // reset login status
                UserServices.ClearCredentials();
            })();

        //    $("body>.default-page").hide();
        //    $("body>.extra-page").html($(".page-content").html()).show();
        //    $('body').attr('id', 'signin-page');

            function compare(repass) {
                $log.debug('compare',repass);
                pagevm.isconfirm = pagevm.password == repass ? true : false;
            }
    

            function resetpwd() {
                $log.debug('controller resetpwd function entered', pagevm.username, pagevm.password);
                $log.debug('token', $routeParams.token);
                pagevm.dataLoading = true;
                var path=encodeURI('../v1/resetpassword?user=' + pagevm.username + 
                    '&token=' + $routeParams.token +
                    '&newpassword=' + pagevm.password +
                    '&email=' + pagevm.email);

                 return UserServices.resetpassword(path).then(function(data){
                    $log.debug('UserServices resetpwd returned data');
                    $log.debug(data);
                    pagevm.apiKey = data.api_Key;
                        UserServices.ResetCredentials(data.username, data.api_key);
            $("body>.default-page").show();
            $("body>.extra-page").html($(".page-content").html()).hide();
            $('body').attr('id', '');
                        FlashService.Success("Password reset complete");

                        $location.path('/');
                        return data;
                },
                function (error) {
                    $log.debug('Caught an error UserServices resetpwd, going to notify:', error); 
                //    vm.message = error;
                //    Notification.error({message: error, delay: 5000});
                        UserServices.SetCredentials('','','');
                        UserServices.setapikey('');
                        FlashService.Err(error);
                    return ($q.reject(error));
                }).
                finally(function () { 
                    pagevm.dataLoading = false;
                }
                );

            }            
        }

})();    