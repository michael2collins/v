(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('StripeTableBasicController', StripeTableBasicController);

    StripeTableBasicController.$inject = [
    '$log',
    '$q',
    '$scope',
    '$interval',
    '$routeParams',
    '$location',
    '$cookies',
    'StudentServices',
    'Notification',
    'moment',
    'iddropdownFilter',
    'Util'
    ];

    function StripeTableBasicController(
        $log, $q, $scope, $interval, $routeParams, $location,$cookies, StudentServices, 
        Notification, moment, iddropdownFilter, Util ) {
        /* jshint validthis: true */

        var vm = this;
        var $ = angular.element; 
/*
        vm.getStripe = getStripe;
        vm.removeStripe = removeStripe;
        vm.addStripe = addStripe;
        vm.updateStripe = updateStripe;
*/        
        vm.Stripe={};
        vm.rankTypes=[];
        vm.thisStripe=[];
        //test
        if ($location.$$host === 'vdojo.villaris.us') {
        //prod
            vm.client_id = 'ca_Cgc6QSWZsRjvzsGTm6yalB9b8L8YEJrD';
            vm.redirectURI = 'https://vdojo.villaris.us/v/#/stripe-onboard';
        } else {
            vm.client_id = 'ca_Cgc6TWOkSRaJ3uagt0TJMsCXRXN3AtFJ';
            vm.redirectURI = 'https://vdojotest.villaris.us/v/#/stripe-onboard';
        }
        vm.send_state = Util.uuidv4();
        
        //after request we get a code or an error
        vm.stripe_code = $routeParams.code;
        vm.stripe_error = $routeParams.error;
        vm.stripe_error_description = $routeParams.error_description;
        vm.slim_session = $cookies.get('slim_session') || {};
        vm.csrfcheckstate = {};

        vm.stripe_scope = $routeParams.scope;
        vm.stripe_state = $routeParams.state;

        if (vm.stripe_code !== undefined) {
            storeusercred().then(function() {
                $log.debug('storeusercred done');
                alert('save code:' + vm.stripe_code);
                
             },function(error) {
                 return ($q.reject(error));
             });
        } else {
            setsession().then(function() {
                $log.debug('setsession done');

             },function(error) {
                 return ($q.reject(error));
             });
            
        }
        $log.debug('Routeparam is:');
        $log.debug($routeParams.code, $routeParams.scope, $routeParams.state);
        $log.debug('location is:', $location);


  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("stripe-onboard started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("stripe-onboard dismissed");
		$log.debugEnabled(false);
    });
//        activate();

       $.fn.Data.Portlet('stripe-onboard.js');
    
        function storeusercred() {
            $log.debug('storeusercred entered');
            var path='../v1/storeusercred';
            var thedata = {
                csrfstate: vm.stripe_state,
                client: vm.client_id,
                code: vm.stripe_code,
                slim_session: vm.slim_session,
                grant_type: 'authorization_code'
            };

            vm.csrfcheckstate = {};
            return StudentServices.storeusercred(thedata, path).then(function(data){
                    $log.debug('storeusercred returned data');
                    $log.debug(data);
                    vm.csrfcheckstate = data.csrfcheckstate;
                    return vm.csrfcheckstate;
                }, function(error) {
                    $log.debug('Caught an error storeusercred:', error); 
                    vm.csrfcheckstate = {};
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
    
        function setsession() {
            $log.debug('setsession entered');
            var path='../v1/setsession';
            var thedata = {
                csrfstate: vm.stripe_state,
                slim_session: vm.slim_session
            };

            return StudentServices.setsession(thedata, path).then(function(data){
                    $log.debug('setsession returned data');
                    $log.debug(data);
                    return;
                }, function(error) {
                    $log.debug('Caught an error setsession:', error); 
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
    
/*
        function activate() {

            getStripe().then(function() {
                $log.debug('getStripe activate done');
             },function(error) {
                 return ($q.reject(error));
             });
             
        }

        function removeStripe(input) {
            $log.debug('removeStripe entered',input);
            var path = "../v1/Stripe";
            var thedata = {
                id: input.id
            };
            var data = {};
            data.StripeExistsList = {};

            return StudentServices.removeStripe( thedata, path)
                .then(function(data){
                    $log.debug('removeStripe returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                //        vm.StripeFKExists = data.StripeExistsList;
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getStripe().then
                        (function(zdata) {
                         $log.debug('getStripe returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getStripe after remove:', error); 
                            vm.thisStripe = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeStripe failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function addStripe(rowEntity) {
            updateStripe(rowEntity,'Add');
        }
        function updateStripe(rowEntity,updatetype) {
            var updpath = "../v1/Stripe";

            var thedata = {
                id: rowEntity.id,
                Stripe: rowEntity.Stripe,
                ranktype: rowEntity.ranktype,
//                ranktype: Util.getByValue(vm.rankTypes, rowEntity.ranktype, 'id', 'value'),
                testdescription: rowEntity.testdescription
            };
            
            $log.debug('about updateStripe ',thedata, updpath, updatetype);
            return StudentServices.updateStripe(updpath, thedata)
                .then(function(data){
                    $log.debug('updateStripe returned data');
                    $log.debug(data);
                    vm.thisStripe = data;
                    $log.debug(vm.thisStripe);
                    $log.debug(vm.thisStripe.message);
                    vm.message = vm.thisStripe.message;
                    if ((typeof vm.thisStripe === 'undefined' || vm.thisStripe.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    if (updatetype === 'Add') {
                        getStripe().then
                            (function(zdata) {
                             $log.debug('getStripe returned', zdata);
                         },
                            function (error) {
                                $log.debug('Caught an error getStripe after add:', error); 
                                vm.thisStripe = [];
                                vm.message = error;
                                Notification.error({message: error, delay: 5000});
                                return ($q.reject(error));
                            });
                        
                    }
                    
                    return vm.thisStripe;
                }).catch(function(e) {
                    $log.debug('updateStripe failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        
        function getStripe() {
            $log.debug('getStripe entered');
            var path='../v1/Stripe';

            return StudentServices.getStripe(path).then(function(data){
                    $log.debug('getStripes returned data');
                    $log.debug(data);

                        vm.gridOptions.data = data.StripeList; 
                    return data.StripeList;
                }, function(error) {
                    $log.debug('Caught an error getStripes:', error); 
                    vm.StripeList = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
*/
    }

})(window,window.angular);
