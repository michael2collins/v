(function () {

    'use strict';

    angular
        .module('ng-admin')
        .controller('ForgotpwdController', ForgotpwdController);
        
        ForgotpwdController.$inject = [
            '$scope', 
            '$log',
            '$routeParams',
            '$location',
            'FlashService',
            'UserServices',
            'TournamentServices',
            '$q'
            ];
        function ForgotpwdController($scope, $log, $routeParams, 
                $location, FlashService, UserServices, TournamentServices, $q){
        /* jshint validthis: true */

            var pagevm = this;
            pagevm.forgotpwd = forgotpwd;
            pagevm.username;
            pagevm.dataLoading;
            pagevm.apiKey;
            
            $log.debug('enter ForgotpwdController');
            $log.debug('username', pagevm.username);

            (function initController() {
                // reset login status
                UserServices.ClearCredentials();
            })();

        //    $("body>.default-page").hide();
        //    $("body>.extra-page").html($(".page-content").html()).show();
        //    $('body').attr('id', 'signin-page');
    

            function forgotpwd() {
                $log.debug('controller forgotpwd function entered', pagevm.username);
                var path = '../v1/forgotpassword?username=' + pagevm.username;
                pagevm.dataLoading = true;

                 return UserServices.forgotpassword(path).then(function(data){
                    $log.debug('UserServices returned data');
                    $log.debug(data);
                    pagevm.apiKey = data.apiKey;
       //     $("body>.default-page").show();
        //    $("body>.extra-page").html($(".page-content").html()).hide();
        //    $('body').attr('id', '');
                        alert("Check your email for reset information");

                        $location.path('/');
                        return data;
                },
                function (error) {
                    $log.debug('Caught an error UserServices, going to notify:', error); 
                //    vm.message = error;
                //    Notification.error({message: error, delay: 5000});
                        UserServices.SetCredentials('','','');
                        TournamentServices.setapikey('');
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