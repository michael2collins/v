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
    'PaymentServices'
    ];

    function StudentPaymentController($scope, $rootScope, $routeParams,
            $log, $http, $location, $timeout, ClassServices, StudentServices, PaymentServices) {
        /* jshint validthis: true */
        var vmpayment = this;

        vmpayment.getStudentPayment = getStudentPayment;
        vmpayment.getStudentClassPayList = getStudentClassPayList;
        vmpayment.updateStudentPayment = updateStudentPayment;
        vmpayment.updateStudentPayment2 = updateStudentPayment2;
        vmpayment.getFamily = getFamily;
        vmpayment.initclasslist = initclasslist;

        vmpayment.StudentPayment = [];
        vmpayment.disabled = undefined;
        vmpayment.ClassPayList = [];
        vmpayment.FamilyList = [];

        vmpayment.path = '../v1/studentclass/' + $routeParams.id;
        $log.debug('studentid: ' + $routeParams.id);

        vmpayment.classpaylistpath = '../v1/studentclasspaylist';
        vmpayment.updateclasspaylistpath = '../v1/studentclasspaylist/'  + $routeParams.id;

        vmpayment.setclasspath = '../v1/studentclass/id/' + $routeParams.id + '/myclass/' + $routeParams.myclass;
        $log.debug('studentid: ' + $routeParams.id);
        $log.debug('StudentPayment: ' + $routeParams.myclass);
        vmpayment.StudentPayment.contactID = $routeParams.id;
        
        vmpayment.familypath = '../v1/family/' + $routeParams.id;

        vmpayment.xtagTransform = xtagTransform;

        initclasslist();

        function initclasslist() {
            $timeout(function () {
                activate();

            }, 2000);
        }

        function activate() {
            console.log('payment activate');

            getStudentPayment();
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
                getStudentClassPayList();
                getFamily();
                return vmpayment.StudentPayment;
            });
            
        }

        function getFamily() {
            return StudentServices.getFamily(vmpayment.familypath).then(function(data){
                    $log.debug('getFamily returned data');
                    $log.debug(data.data);
                    vmpayment.FamilyList = data.data;

                    return vmpayment.FamilyList;
                });
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
