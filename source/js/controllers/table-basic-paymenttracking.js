(function (window,angular,$) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('PaymentTrackingController', PaymentTrackingController);

    PaymentTrackingController.$inject = [
        '$scope',
        '$log',
        'ClassServices',
        'StudentServices',
        'Notification',
        '$q',
    ];

    function PaymentTrackingController($scope, $log, ClassServices, StudentServices, Notification, $q) {
        /* jshint validthis: true */
        var vm = this;

        vm.getPayersPartial = getPayersPartial;
        vm.refreshStudents = refreshStudents;
        vm.getPayerStudent = getPayerStudent;
        vm.payers=[];
        vm.refreshstudentlist = [];
        vm.studentpick;
        vm.payerName;
        
        $scope.$on('$routeChangeSuccess', function(event, current, previous) {
    		$log.debugEnabled(true);
            $log.debug("table-basic-paymenttracking started");
          
        });
        $scope.$on('$destroy', function iVeBeenDismissed() {
            $log.debug("table-basic-paymenttracking dismissed");
    		$log.debugEnabled(false);
        });


       $.fn.Data.Portlet('table-basic-paymenttracking.js');
    
        function getPayersPartial(theinput) {
            $log.debug('getPayers entered');
            
            return ClassServices.getPayersPartial(theinput).then(function(data){
                    $log.debug('controller getPayersPartial returned data',theinput);
                    $log.debug(data);
                    if ((typeof data.payerlist === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        vm.message = data.message  ;
                        Notification.error({message: vm.message , delay: 5000});
                        $q.reject(data);
                    } else {
                        vm.payers = data.payerlist;
                    }
                    return vm.payers;

                });
            
        }
        function refreshStudents(theinput) {
            if (theinput.length === 0 || theinput === undefined) {
                return;
            }
            return StudentServices.refreshStudents(theinput).then(function(data) {
                $log.debug('controller refreshStudents returned data');
                $log.debug(data);
                if ((typeof data.refreshstudentlist === 'undefined' || data.error === true)  
                        && typeof data !== 'undefined') {  
                    vm.message = data.message  ;
                    Notification.error({message: vm.message , delay: 5000});
                    $q.reject(data);
                } else {
                    vm.refreshstudentlist = data;
                }
                
                return vm.refreshstudentlist;
            });

        }
        function getPayerStudent(theinput,thetype) {
            var thisid = (theinput.ID !== undefined) ? theinput.ID : ( theinput.payerid !== undefined ) ? theinput.payerid : undefined;
            if (thisid === undefined) {
                return;
            }
            var thedata = {
                    theinput: thisid ,
                    thetype: thetype
                };
            var path = "../v1/payerstudent";
            return StudentServices.getPayerStudent(path,thedata).then(function(data) {
                $log.debug('controller getPayerStudent returned data');
                $log.debug(data);
                $log.debug(data.message);
                vm.message = data.message  ;
                if ((typeof data.studentpayerlist === 'undefined' || data.error === true)  
                        && typeof data !== 'undefined') {  
                    Notification.error({message: vm.message + ': ' + (
                        typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""), delay: 5000});
                    $q.reject(data);
                } else {
                    vm.payerstudentlist = data.studentpayerlist;
                    if (data.studentpayerlist[0].thetype === 'payer') {
                        refreshStudents(data.studentpayerlist[0].firstname + ' ' + data.studentpayerlist[0].lastname).then(function() {
                            vm.studentpick = vm.refreshstudentlist.refreshstudentlist[0];
                        });
                    } else {
                        getPayersPartial(data.studentpayerlist[0].payername).then(function() {
                            vm.payerName = vm.payers[0]
                        });
                    }
                    Notification.success({message: vm.message, delay: 5000});
                }
            }, function(error) {
                    $log.debug('Caught an error getPayerStudent:', error); 
                    vm.payerstudentlist = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
            );

        }
        
    }

})(window,window.angular,window.$);
