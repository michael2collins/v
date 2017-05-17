(function () {
    'use strict';

    angular
        .module('ng-admin')
        .controller('StudentPaymentController', StudentPaymentController);
    StudentPaymentController.$inject = [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$log',
    '$http',
    '$location',
    '$timeout',
    'ClassServices',
    'StudentServices',
    'PaymentServices',
    '$q',
    'Notification',
    '_'
    ];

    function StudentPaymentController($scope, $rootScope, $routeParams,
            $log, $http, $location, $timeout, ClassServices, StudentServices, PaymentServices, $q, Notification, _) {
        /* jshint validthis: true */
        var vmpayment = this;

        vmpayment.getFamily = getFamily;
        vmpayment.getListPrices = getListPrices;
        vmpayment.getPaymentplan = getPaymentplan;

        vmpayment.StudentPayment = [];
        vmpayment.disabled = undefined;
        vmpayment.ClassPayList = [];
        vmpayment.FamilyList = [];
        vmpayment.PriceList = [];
        vmpayment.payerlist = [];
        vmpayment.studentpayer;

        vmpayment.PaymentPlanList=[];
        vmpayment.PaymentPlans=[];
        vmpayment.PaymentTypes=[];

        vmpayment.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
        vmpayment.bdateformat = vmpayment.formats[4];
        vmpayment.dateopen = dateopen;
        vmpayment.dateheadopen = dateheadopen;
        vmpayment.updatePaymentPlan = updatePaymentPlan;
        vmpayment.removePaymentPlan = removePaymentPlan;
        vmpayment.payerSet = payerSet;
        vmpayment.autoExpand = autoExpand;
        vmpayment.head = {};

        vmpayment.status = {};
        vmpayment.statushead = {
            opened: false
        };

        function getPriceDate(input) {
            $log.debug('getPriceDate',input);
          //  var theDate = moment(input).format('YYYY-MM-DD');
          var theDate = new Date(input);
            return theDate;
        }

        activate();

        function autoExpand(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
        		var scrollHeight = element.scrollHeight -60; // replace 60 by the sum of padding-top and padding-bottom
            element.style.height =  scrollHeight + "px";    
            $log.debug('autoexpand',scrollHeight);
            element.style.minHeight = "35px";
        }
        
        function payerSet() {
            $log.debug('payerSet entered');
            vmpayment.head.payerid = vmpayment.studentpayer;
            $q.all([
                  getFamily().then(function(){
                      $log.debug('getPayerList ready');
        
                  }).catch(function(e){
                        $log.debug("getFamily error in payerSet", e);
                  }),
                  getListPrices().then(function(){
                      $log.debug('getListPrices ready');
        
                  }).catch(function(e){
                        $log.debug("getListPrices error in payerSet", e);
                  }),
                  getPaymentplan().then(function(){
                      $log.debug('getPaymentplan ready');
        
                  }).catch(function(e){
                        $log.debug("getPaymentplan error in payerSet", e);
                  })
                ])
                .then(function() {
                    $log.debug(' payerSet done');
            });

        }
        function dateopen($event,iter) {
            $log.debug("dateopen:", vmpayment.status);
            vmpayment.status[iter].opened = true;
        }
        function dateheadopen($event) {
            $log.debug("dateheadopen:", vmpayment.statushead);
            vmpayment.statushead.opened = true;
        }

        function activate() {
            $log.debug('payment activate');
            $q.all([
                  getPayerList().then(function(){
                      $log.debug('getPayerList ready');
        
                  }).catch(function(e){
                        $log.debug("getPayerList error in activate", e);
                  }),
                  getPaymentplans().then(function(){
                      $log.debug('getPaymentplans ready');
        
                  }).catch(function(e){
                        $log.debug("getPayerList error in activate", e);
                  }),
                  getPaymenttypes().then(function(){
                      $log.debug('getPaymenttypes ready');
        
                  }).catch(function(e){
                        $log.debug("getPayerList error in activate", e);
                  })
                ])
                .then(function() {
                    $log.debug('student-payment activation done');
            });
        }

        function getPayerList() {
                var path = '../v1/payers/' +  $routeParams.id;
            $log.debug('getPayerList entered',path);
             return ClassServices.getPayerList(path).then(function(data){
                    $log.debug('getPayerList returned data');
                    $log.debug(data);
                    vmpayment.payerlist = data.payerlist; 
                    if ((typeof data.payerlist === 'undefined' || data.payerlist.error === true)  && typeof data !== 'undefined') {  
                        vmpayment.payerlist = [];
                        Notification.error({message: data, delay: 5000});
                        $q.reject(data);
                    }
                    return vmpayment.payerlist;
                },
                function (error) {
                    $log.debug('Caught an error getPayerList, going to notify:', error); 
                    vmpayment.payerlist = [];
                    vmpayment.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vmpayment.loading = false; 
                    vmpayment.loadAttempted = true;
                }
                );
    
        }
    
        function getFamily() {
            var familypath = '../v1/family/' + vmpayment.studentpayer;
            $log.debug('getPayerList entered',familypath);
             return ClassServices.getFamily(familypath).then(function(data){
                    $log.debug('getFamily returned data');
                    $log.debug(data);
                    vmpayment.FamilyList = data.FamilyList;
                    if ((typeof data.FamilyList === 'undefined' || data.FamilyList.error === true)  && typeof data !== 'undefined') {  
                        vmpayment.FamilyList = [];
                        Notification.error({message: data, delay: 5000});
                        $q.reject(data);
                    }
                    return vmpayment.FamilyList;
                },
                function (error) {
                    $log.debug('Caught an error getFamily, going to notify:', error); 
                    vmpayment.FamilyList = [];
                    vmpayment.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vmpayment.loading = false; 
                    vmpayment.loadAttempted = true;
                }
                );
    
        }
    
        function getListPrices() {
            var path = '../v1/listprices/' + vmpayment.studentpayer;
            $log.debug('getListPrices entered',path);
             return ClassServices.getListPrices(path).then(function(data){
                    $log.debug('getListPrices returned data');
                    $log.debug(data);
                    vmpayment.PriceList = data.PriceList;
                    if ((typeof data.PriceList === 'undefined' || data.PriceList.error === true)  && typeof data !== 'undefined') {  
                        vmpayment.PriceList = [];
                        Notification.error({message: data, delay: 5000});
                        $q.reject(data);
                    }
                    return vmpayment.PriceList;
                },
                function (error) {
                    $log.debug('Caught an error getListPrices, going to notify:', error); 
                    vmpayment.PriceList = [];
                    vmpayment.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vmpayment.loading = false; 
                    vmpayment.loadAttempted = true;
                }
                );
    
        }
    
        function getPaymentplan() {
            var path = '../v1/paymentplan/' + vmpayment.studentpayer;
            $log.debug('getPaymentplan entered',path);
             return ClassServices.getPaymentplan(path).then(function(data){
                    $log.debug('getPaymentplan returned data');
                    $log.debug(data);
                    vmpayment.PaymentPlanList = data.PaymentPlanList;

                    if ((typeof data.PaymentPlanList === 'undefined' || data.PaymentPlanList.error === true)  && typeof data !== 'undefined') {  
                        vmpayment.PaymentPlanList = [];
                        Notification.error({message: data, delay: 5000});
                        $q.reject(data);
                    } else {
                        for (var iter=0,len=vmpayment.PaymentPlanList.length;iter<len;iter++) {
                            if (_.isEmpty(vmpayment.PaymentPlanList[iter].Pricesetdate)) {
                                vmpayment.PaymentPlanList[iter].Pricesetdate = getPriceDate(new Date());
                            } else {
                                vmpayment.PaymentPlanList[iter].Pricesetdate = getPriceDate(vmpayment.PaymentPlanList[iter].Pricesetdate);
                            }
                            vmpayment.status[iter] = {
                                opened: false
                                };
                        }
                    }
                    return vmpayment.PaymentPlanList;
                },
                function (error) {
                    $log.debug('Caught an error PaymentPlan, going to notify:', error); 
                    vmpayment.PaymentPlanList = [];
                    vmpayment.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vmpayment.loading = false; 
                    vmpayment.loadAttempted = true;
                }
                );
    
        }
        function getPaymenttypes() {
            var path = '../v1/paymenttypes';
            $log.debug('getPaymenttypes entered',path);
             return ClassServices.getPaymenttypes(path).then(function(data){
                    $log.debug('getPaymenttypes returned data');
                    $log.debug(data);
                    vmpayment.PaymentTypes = data.paymenttypes;
                    if ((typeof data.paymenttypes === 'undefined' || data.paymenttypes.error === true)  && typeof data !== 'undefined') {  
                        vmpayment.PaymentTypes = [];
                        Notification.error({message: data, delay: 5000});
                        $q.reject(data);
                    }
                    return vmpayment.PaymentTypes;
                },
                function (error) {
                    $log.debug('Caught an error PaymentTypes, going to notify:', error); 
                    vmpayment.PaymentTypes = [];
                    vmpayment.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vmpayment.loading = false; 
                    vmpayment.loadAttempted = true;
                }
                );
    
        }
        function getPaymentplans() {
            var path = '../v1/paymentplans' ;
            $log.debug('getPaymentplans entered',path);
             return ClassServices.getPaymentplans(path).then(function(data){
                    $log.debug('getPaymentplans returned data');
                    $log.debug(data);
                    vmpayment.PaymentPlans = data.paymentplans;
                    if ((typeof data.paymentplans === 'undefined' || data.paymentplans.error === true)  && typeof data !== 'undefined') {  
                        vmpayment.PaymentPlans = [];
                        Notification.error({message: data, delay: 5000});
                        $q.reject(data);
                    }
                    return vmpayment.PaymentPlans;
                },
                function (error) {
                    $log.debug('Caught an error PaymentPlans, going to notify:', error); 
                    vmpayment.PaymentPlans = [];
                    vmpayment.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vmpayment.loading = false; 
                    vmpayment.loadAttempted = true;
                }
                );
    
        }

        function removePaymentPlan(input) {
            $log.debug('removePaymentPlan entered',input);
            var path = "../v1/paymentplan";
            var thedata = {
                studentid: $routeParams.id,
                paymenttype: input.paymenttype,
                PaymentPlan: input.PaymentPlan
            };
            return ClassServices.removePaymentPlan(path, thedata)
                .then(function(data){
                    $log.debug('removePaymentPlan returned data');
                    $log.debug(data);
                    getPaymentplan();
                    return data;
                }).catch(function(e) {
                    $log.debug('removePaymentPlan failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function updatePaymentPlan(input,mode) {
            
            var path = "../v1/paymentplan";
                //PriceSetby set on server
            var thedata = {
                studentid: $routeParams.id,
                payerid: input.payerid,
                paymenttype: input.paymenttype,
                PaymentNotes: input.PaymentNotes,
                PaymentPlan: input.PaymentPlan,
                PaymentAmount: input.PaymentAmount,
                Pricesetdate: input.Pricesetdate,
                payOnDayOfMonth: input.payOnDayOfMonth,
                paymentid: input.paymentid,
                mode: mode
            };
            $log.debug('about updatePaymentPlan ', path, thedata, input);
            return ClassServices.updatePaymentPlan( path, thedata ).then(function (data) {
                $log.debug('updatePaymentPlan returned data: ');
                $log.debug(data);
                if ( data.error === true  || typeof data === 'undefined') {  
                    Notification.error({message: data.error === true ? data.error : "data error", delay: 5000});
                    $q.reject(data);
                }

                getPaymentplan();
                
            },function(error) {
                    $log.debug('updatePaymentPlan ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }        
    }

})();
