import angular from 'angular';

export class StripeTableBasicController {
    constructor(
        $log, $q, $scope, $interval, $routeParams, $location, $cookies, StudentServices,
        Notification, moment, iddropdownFilter, Util, portalDataService

    ) {
        'ngInject';
        this.$log = $log;
        this.$q = $q;
        this.$scope = $scope;
        this.$interval = $interval;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.$cookies = $cookies;
        this.StudentServices = StudentServices;
        this.Notification = Notification;
        this.moment = moment;
        this.Util = Util;
        this.iddropdownFilter = iddropdownFilter;
        this.portalDataService = portalDataService;
    }
    $onInit() {
        var vm = this;
        var $ = angular.element;

        vm.Stripe = {};
        vm.stripedata = [];
        vm.rankTypes = [];
        vm.thisStripe = [];
        //test
        if (vm.$location.$$host === 'vdojo.villaris.us') {
            //prod
            vm.client_id = 'ca_Cgc6QSWZsRjvzsGTm6yalB9b8L8YEJrD';
            vm.redirectURI = 'https://vdojo.villaris.us/v1/storeusercred';
        }
        else {
            vm.client_id = 'ca_Cgc6TWOkSRaJ3uagt0TJMsCXRXN3AtFJ';
            vm.redirectURI = 'https://vdojotest.villaris.us/v1/storeusercred';
        }
        vm.send_state = vm.Util.uuidv4();

        //after request we get a code or an error
        vm.stripe_code = vm.$routeParams.code;
        vm.stripe_error = vm.$routeParams.error;
        vm.stripe_error_description = vm.$routeParams.error_description;
        vm.auth_session = vm.$cookies.get('slim_session');

        vm.csrfcheckstate = {};
        vm.stripe_scope = vm.$routeParams.scope;
        vm.stripe_state = vm.$routeParams.state;

        vm.$log.log('Routeparam is:');
        vm.$log.log(vm.$routeParams.code, vm.$routeParams.scope, vm.$routeParams.state);
        vm.$log.log('location is:', vm.$location);

        vm.activate();

    }
    activate() {
        var vm = this;
        vm.setsession().then(function() {
            vm.$log.log('setsession done');

        }, function(error) {
            return (vm.$q.reject(error));
        });

        vm.getStripe().then(function() {
            vm.$log.log('getStripe activate done');
        }, function(error) {
            return (vm.$q.reject(error));
        });

    }

    setsession() {
        var vm = this;
        vm.$log.log('setsession entered');
        var path = '../v1/setsession';
        var thedata = {
            csrfstate: vm.send_state,
            auth_session: vm.auth_session
        };

        return vm.StudentServices.setsession(path, thedata).then(function(data) {
            vm.$log.log('setsession returned data');
            vm.$log.log(data);
            return;
        }, function(error) {
            vm.$log.log('Caught an error setsession:', error);
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }



    removeStripe() {
        var vm = this;
        vm.$log.log('removeStripe entered');
        var path = "../v1/revokestripe";

        return vm.StudentServices.removeStripe(path)
            .then(function(data) {
                vm.$log.log('removeStripe returned data');
                vm.$log.log(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getStripe().then(function(zdata) {
                        vm.$log.log('getStripe returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getStripe after remove:', error);
                        vm.stripedata = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.log('removeStripe failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }
    getStripe() {
        var vm = this;
        vm.$log.log('getStripe entered');
        var path = '../v1/stripe';

        return vm.StudentServices.getStripe(path).then(function(data) {
            vm.$log.log('getStripes returned data');
            vm.$log.log(data);

            vm.stripedata = data.StripeList;
            return vm.stripedata;
        }, function(error) {
            vm.$log.log('Caught an error getStripes:', error);
            vm.stripedata = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }

    /*
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
                
                $log.log('about updateStripe ',thedata, updpath, updatetype);
                return StudentServices.updateStripe(updpath, thedata)
                    .then(function(data){
                        $log.log('updateStripe returned data');
                        $log.log(data);
                        vm.thisStripe = data;
                        $log.log(vm.thisStripe);
                        $log.log(vm.thisStripe.message);
                        vm.message = vm.thisStripe.message;
                        if ((typeof vm.thisStripe === 'undefined' || vm.thisStripe.error === true)  
                                && typeof data !== 'undefined') {  
                            Notification.error({message: vm.message, delay: 5000});
                            return($q.reject(data));
                        } else {
                            Notification.success({message: vm.message, delay: 5000});
                        }
                        if (updatetype === 'Add') {
                            getStripe().then
                                (function(zdata) {
                                 $log.log('getStripe returned', zdata);
                             },
                                function (error) {
                                    $log.log('Caught an error getStripe after add:', error); 
                                    vm.thisStripe = [];
                                    vm.message = error;
                                    Notification.error({message: error, delay: 5000});
                                    return ($q.reject(error));
                                });
                            
                        }
                        
                        return vm.thisStripe;
                    }).catch(function(e) {
                        $log.log('updateStripe failure:');
                        $log.log("error", e);
                        vm.message = e;
                        Notification.error({message: e, delay: 5000});
                        throw e;
                    });
            }
    */

    /*        function storeusercred() {
                $log.log('storeusercred entered');
                var path='../v1/storeusercred';
                var thedata = {
                    csrfstate: vm.stripe_state,
                    client: vm.client_id,
                    code: vm.stripe_code,
                    slim_session: vm.slim_session,
                    grant_type: 'authorization_code'
                };

                vm.csrfcheckstate = {};
                return StudentServices.storeusercred(path, thedata).then(function(data){
                        $log.log('storeusercred returned data');
                        $log.log(data);
                        vm.csrfcheckstate = data.csrfcheckstate;
                        return vm.csrfcheckstate;
                    }, function(error) {
                        $log.log('Caught an error storeusercred:', error); 
                        vm.csrfcheckstate = {};
                        vm.message = error;
                        Notification.error({message: error, delay: 5000});
                        return ($q.reject(error));
                        
                    }
                    );
            }
    */

}
