(function () {

    'use strict';

    angular
        .module('ng-admin')
        .controller('ResetpwdController', ResetpwdController);
        
        ResetpwdController.$inject = [
            '$scope', 
            '$log',
            '$routeParams',
            '$location',
            'FlashService',
            'UserServices',
            'TournamentServices',
            '$q'
            ];
        function ResetpwdController($scope, $log, $routeParams, 
                $location, FlashService, UserServices, TournamentServices, $q){
        /* jshint validthis: true */

            var pagevm = this;
            pagevm.login = login;
            pagevm.username;
            pagevm.password;
            pagevm.dataLoading;
            pagevm.apiKey;
            
            $log.debug('enter ResetpwdController');
            $log.debug('username', pagevm.username);
            $log.debug('password', pagevm.password);
            
            (function initController() {
                // reset login status
                UserServices.ClearCredentials();
            })();

        //    $("body>.default-page").hide();
        //    $("body>.extra-page").html($(".page-content").html()).show();
        //    $('body').attr('id', 'signin-page');
    

            function login() {
                $log.debug('controller login function entered', pagevm.username, pagevm.password);
                
                pagevm.dataLoading = true;

                 return UserServices.Login(pagevm.username, pagevm.password).then(function(data){
                    $log.debug('UserServices returned data');
                    $log.debug(data);
                    pagevm.apiKey = data.apiKey;
                        UserServices.SetCredentials(pagevm.username, pagevm.password, pagevm.apiKey);
                        TournamentServices.setapikey(pagevm.apiKey);
                        UserServices.setapikey(pagevm.apiKey);
            $("body>.default-page").show();
            $("body>.extra-page").html($(".page-content").html()).hide();
            $('body').attr('id', '');

                        $location.path('/');
                        return data;
                },
                function (error) {
                    $log.debug('Caught an error UserServices, going to notify:', error); 
                //    vm.message = error;
                //    Notification.error({message: error, delay: 5000});
                        UserServices.SetCredentials('','','');
                        TournamentServices.setapikey('');
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