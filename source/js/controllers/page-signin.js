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
            'AttendanceServices',
            'CalendarServices',
            'EventServices',
            'StudentServices',
            'PaymentServices',
            'ClassServices',
            'TestingServices',
            'TemplateServices',
            '$cookieStore',
            '$q'
            ];
        function PageSigninController($scope, $log, $routeParams, 
                $location, FlashService, UserServices, AttendanceServices, CalendarServices,
                EventServices, StudentServices, PaymentServices, ClassServices, TestingServices,TemplateServices,$cookieStore,
                $q){
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

        //    $("body>.default-page").hide();
        //    $("body>.extra-page").html($(".page-content").html()).show();
        //    $('body').attr('id', 'signin-page');
    

            function login() {
                $log.debug('controller login function entered', pagevm.username, pagevm.password);
                
                pagevm.dataLoading = true;

                 return UserServices.Login(pagevm.username, pagevm.password).then(function(data){
                    $log.debug('UserServices login returned data');
                    $log.debug(data, data.error);
                    if (data.error === true) {
                        $log.debug('UserServices error returned', data.error);
                        UserServices.SetCredentials('','','');
                        AttendanceServices.setapikey('');
                        CalendarServices.setapikey('');
                        EventServices.setapikey('');
                        StudentServices.setapikey('');
                        PaymentServices.setapikey('');
                        ClassServices.setapikey('');
                        UserServices.setapikey('');
                        TestingServices.setapikey('');
                        TemplateServices.setapikey('');
                        FlashService.Err(data.message);
                        return ($q.reject(data));                        
                    }
                    pagevm.apiKey = data.apiKey;
                        UserServices.SetCredentials(pagevm.username, pagevm.password, pagevm.apiKey);

                        AttendanceServices.setapikey(pagevm.apiKey);
                        CalendarServices.setapikey(pagevm.apiKey);
                        EventServices.setapikey(pagevm.apiKey);
                        StudentServices.setapikey(pagevm.apiKey);
                        PaymentServices.setapikey(pagevm.apiKey);
                        ClassServices.setapikey(pagevm.apiKey);
                        UserServices.setapikey(pagevm.apiKey);
                        TestingServices.setapikey(pagevm.apiKey);
                        TemplateServices.setapikey(pagevm.apiKey);
            $("body>.default-page").show();
            $("body>.extra-page").html($(".page-content").html()).hide();
            $('body').attr('id', '');

                        $location.path('/main');
                        return data;
                },
                function (error) {
                    $log.debug('Caught an error UserServices, going to notify:', error); 
                //    vm.message = error;
                //    Notification.error({message: error, delay: 5000});
                        UserServices.SetCredentials('','','');
                        AttendanceServices.setapikey('');
                        CalendarServices.setapikey('');
                        EventServices.setapikey('');
                        StudentServices.setapikey('');
                        PaymentServices.setapikey('');
                        ClassServices.setapikey('');
                        UserServices.setapikey('');
                        TestingServices.setapikey('');
                        TemplateServices.setapikey('');
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