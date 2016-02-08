(function () {

    'use strict';

    angular
        .module('ng-admin')
        .controller('PageSigninController', PageSigninController);
        
        PageSigninController.$inject = [
            '$scope', 
            '$log',
            '$routeParams',
            '$location',
            'FlashService',
            'UserServices',
            'TournamentServices',
            '$q'
            ];
        function PageSigninController($scope, $log, $routeParams, 
                $location, FlashService, UserServices, TournamentServices, $q){
        /* jshint validthis: true */

            var pagevm = this;
            pagevm.login = login;
            pagevm.username;
            pagevm.password;
            pagevm.dataLoading;
            pagevm.apiKey;
            
            $log.debug('enter PageSigninController');
            $log.debug('username', pagevm.username);
            $log.debug('password', pagevm.password);
            
            (function initController() {
                // reset login status
                UserServices.ClearCredentials();
            })();
    

            function login() {
                $log.debug('controller login function entered', pagevm.username, pagevm.password);
                
                pagevm.dataLoading = true;

                 return UserServices.Login(pagevm.username, pagevm.password).then(function(data){
                    $log.debug('UserServices returned data');
                    $log.debug(data);
                    pagevm.apiKey = data.apiKey;
                        UserServices.SetCredentials(pagevm.username, pagevm.password, pagevm.apiKey);
                        TournamentServices.setapikey(pagevm.apiKey);
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
//            $("body>.default-page").hide();
  //          $("body>.extra-page").html($(".page-content").html()).show();
    //        $('body').attr('id', 'signin-page');
        }

})();    