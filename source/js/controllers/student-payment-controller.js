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
    'Notification'
    ];

    function StudentPaymentController($scope, $rootScope, $routeParams,
            $log, $http, $location, $timeout, ClassServices, StudentServices, PaymentServices, $q, Notification) {
        /* jshint validthis: true */
        var vmpayment = this;

        vmpayment.getStudentPayment = getStudentPayment;
        vmpayment.getStudentClassPayList = getStudentClassPayList;
        vmpayment.updateStudentPayment = updateStudentPayment;
        vmpayment.updateStudentPayment2 = updateStudentPayment2;
        vmpayment.getFamily = getFamily;
        vmpayment.getListPrices = getListPrices;

        vmpayment.StudentPayment = [];
        vmpayment.disabled = undefined;
        vmpayment.ClassPayList = [];
        vmpayment.FamilyList = [];
        vmpayment.PriceList = [];
        vmpayment.payerlist = [];
        vmpayment.studentpayer;

        vmpayment.path = '../v1/studentclass/' + $routeParams.id;
        $log.debug('studentid: ' + $routeParams.id);

        vmpayment.classpaylistpath = '../v1/studentclasspaylist';
        vmpayment.updateclasspaylistpath = '../v1/studentclasspaylist/'  + $routeParams.id;

        vmpayment.setclasspath = '../v1/studentclass/id/' + $routeParams.id + '/myclass/' + $routeParams.myclass;
        $log.debug('studentid: ' + $routeParams.id);
        $log.debug('StudentPayment: ' + $routeParams.myclass);
        vmpayment.StudentPayment.contactID = $routeParams.id;
        

        vmpayment.xtagTransform = xtagTransform;

        activate();

        function activate() {
            console.log('payment activate');
            $q.all([
                  getPayerList().then(function(){
                      $log.debug('getPayerList ready');
        
                  }).catch(function(e){
                        $log.debug("getPayerList error in activate", e);
                  })
                ])
                .then(function() {
                    $log.debug('student-payment activation done');
            });
           // getStudentPayment();
        }

        function xtagTransform(newTag) {
            console.log('tagTransform');
            console.log(newTag);
            var item = {
                classpaynametmp: newTag};

                return item;
        }

        function getStudentPayment() {
            //mlc todo fix this, why grab studentclass?
            return ClassServices.getStudentClass(vmpayment.path).then(function (data) {
                $log.debug('getStudentPayment returned data');
                $log.debug(data.data);
                vmpayment.StudentPayment = data.data;
//                getStudentClassPayList();
//                getFamily();
                return vmpayment.StudentPayment;
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

        function getStudentClassPayList() {
            return PaymentServices.getClassPayList(vmpayment.classpaylistpath).then(function(data){
                    $log.debug('getStudentClassPayList returned data');
                    $log.debug(data.data);
                    vmpayment.ClassPayList = data.data;

                    return vmpayment.ClassPayList;
                });
        }

        function updateStudentPayment() {
            $log.debug('about updateStudentPayment ', vmpayment.StudentPayment);
            return PaymentServices.updateStudentPayment(vmpayment.updateclasspaylistpath, vmpayment.StudentPayment).then(function (data) {
                $log.debug('updateStudentPayment returned data: goto', vmpayment.path);
                $log.debug(data.data);
            //    vmpayment.StudentPayment = data.data;
                getStudentPayment();
            });
        }
        function updateStudentPayment2() {
            $log.debug('about updateStudentPayment2 ', vmpayment.StudentPayment,vmpayment.updateclasspaylistpath);
            vmpayment.StudentPayment.classpaynametmp = vmpayment.StudentPayment.classPayName;
            return PaymentServices.updateStudentPayment(vmpayment.updateclasspaylistpath, vmpayment.StudentPayment).then(function (data) {
                $log.debug('updateStudentPayment returned data: goto', vmpayment.path);
                $log.debug(data.data);
            //    vmpayment.StudentPayment = data.data;
                getStudentPayment();
            });
        }

        /*
                function setStudentPayment(mystudent, myclassid, mypgmid) {
                            var setclasspath = '../v1/StudentPayment/id/' + $routeParams.id + '/myclass/' + myclassid + '/mypgm/' + mypgmid;
                            $log.debug('studentid: ' + $routeParams.id);
                            $log.debug('StudentPayment: ' + myclassid);
                            $log.debug('studentpgm: ' + mypgmid);

                            $log.debug('about setStudentPayment ', mystudent);
                            $log.debug('for class ', myclassid);
                    return PaymentServices.setStudentPayment(setclasspath, mystudent, myclassid, mypgmid).then(function(data){
                            $log.debug('setStudentPayment returned data: ');
                            $log.debug(data.data);
                            vmpayment.StudentPayment = data.data;
                            getStudentPayment();
                        });
                }
        */
    }

})();
