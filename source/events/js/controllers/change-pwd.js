(function () {
    'use strict';

    angular
        .module('ng-admin')
        .controller('ChangepwdController', ChangepwdController);
        
        ChangepwdController.$inject = [
            '$scope', 
            '$log',
            '$routeParams',
            'FlashService',
            'Notification',
            'UserServices',
            '$q',
            '$location'
            ];
        function ChangepwdController($scope, $log, $routeParams, 
            FlashService, Notification, UserServices, $q, $location){
        /* jshint validthis: true */

            var vm=this;
            vm.changepwd = changepwd;
            vm.compare = compare;
            vm.dataLoading;
            vm.password;
            vm.oldpassword;
            vm.isconfirm;
            vm.confirm_password;

            vm.userdta = UserServices.getUserDetails();            
            
            $log.debug('enter ChangepwdController',vm.userdta);
//            $("body>.default-page").hide();
//            $("body>.extra-page").html($(".page-content").html()).show();
//            $('body').attr('id', 'signup-page');

            vm.re = /^[a-zA-Z]\w{3,14}$/;
           
            function compare(repass) {
                $log.debug('compare',repass);
                vm.isconfirm = vm.password == repass ? true : false;
            }
            
            function changepwd() {
                $log.debug('controller register function entered');
                vm.dataLoading = true;
                var thedata = {
                    username: vm.userdta.username,
                    confirm_password: vm.confirm_password,
                    password: vm.password,
                    oldpassword: vm.oldpassword
                };
                var path = '/v1/changepassword';
                $log.debug('controller register thedata:', thedata);
                
                vm.dataLoading = true;

                 return UserServices.createUser(path, thedata).then(function(data){
                    $log.debug('register returned data');
                    $log.debug(data);
//                            alert('Change successful', true);
                Notification.success({message: 'Change successful', delay: 5000});

                            $location.path('/#');
                        return data;
                },
                function (error) {
                    $log.debug('Caught an error , going to notify:', error); 
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