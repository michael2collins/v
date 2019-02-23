(function () {

    'use strict';

    angular
        .module('ngadmin')
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
            pagevm.username = null;
            pagevm.password = null;
            pagevm.dataLoading = false;
            pagevm.apiKey;
//            pagevm.init = init;
            
            $log.log('enter PageSigninController');
            $log.log('username', pagevm.username);
            $log.log('password', pagevm.password);
            
            (function initController() {
                // reset login status
                UserServices.ClearCredentials();
            })();

            

//                $("body>.default-page").hide();
//                $("body>.extra-page").html($(".page-content").html()).show();
                $('body').attr('id', 'signin-page');

            function login() {
                $log.log('controller login function entered', pagevm.username, pagevm.password);
                
                pagevm.dataLoading = true;

                 return UserServices.Login(pagevm.username, pagevm.password).then(function(data){
                    $log.log('UserServices returned data');
                    $log.log(data);
                    pagevm.apiKey = data.apiKey;
                        UserServices.SetCredentials(pagevm.username, pagevm.password, pagevm.apiKey);
                        TournamentServices.setapikey(pagevm.apiKey);
                        UserServices.setapikey(pagevm.apiKey);
            $("body>.default-page").show();
            $("body>.extra-page").html($(".page-content").html()).hide();
//            $('body').attr('id', 'signin-page');

                        $location.path('/#');
                        return data;
                },
                function (error) {
                    $log.log('Caught an error UserServices, going to notify:', error); 
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