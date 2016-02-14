(function () {
    'use strict';

    angular
        .module('ng-admin')
        .controller('PageSignupController', PageSignupController);
        
        PageSignupController.$inject = [
            '$scope', 
            '$log',
            '$routeParams',
            'FlashService',
            'UserServices',
            '$q',
            '$location'
            ];
        function PageSignupController($scope, $log, $routeParams, 
            FlashService, UserServices, $q, $location){
        /* jshint validthis: true */

            var vm=this;
            vm.register = register;
            vm.compare = compare;
            vm.dataLoading;
            vm.firstname;
            vm.username;
            vm.lastname;
            vm.email;
            vm.password;
            vm.isconfirm;
            vm.confirm_password;
            
            
            $log.debug('enter PageSignupController');
//            $("body>.default-page").hide();
//            $("body>.extra-page").html($(".page-content").html()).show();
//            $('body').attr('id', 'signup-page');

            vm.re = /^[a-zA-Z]\w{3,14}$/;
           
            function compare(repass) {
                $log.debug('compare',repass);
                vm.isconfirm = vm.password == repass ? true : false;
            }
            
            function register() {
                $log.debug('controller register function entered');
                vm.dataLoading = true;
                var thedata = {
                    username: vm.username,
                    confirm_password: vm.confirm_password,
                    firstname: vm.firstname,
                    lastname: vm.lastname,
                    email: vm.email,
                    password: vm.password
                };
                var path = '/v1/register';
                $log.debug('controller register thedata:', thedata);
                
                vm.dataLoading = true;

                 return UserServices.createUser(path, thedata).then(function(data){
                    $log.debug('register returned data');
                    $log.debug(data);
                            FlashService.Success('Registration successful', true);
                            $location.path('/page-signin');
                        return data;
                },
                function (error) {
                    $log.debug('Caught an error Registration, going to notify:', error); 
                //    vm.message = error;
                //    Notification.error({message: error, delay: 5000});
                        FlashService.Err(error);
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vm.dataLoading = false;
                }
                );

            }            
            
            
        }
})();    