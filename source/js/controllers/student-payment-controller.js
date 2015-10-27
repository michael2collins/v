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
    'PaymentServices'
    ];

    function StudentPaymentController($scope, $rootScope, $routeParams,
            $log, $http, $location, $timeout, ClassServices, PaymentServices) {
        /* jshint validthis: true */
        var vmpayment = this;

        vmpayment.getStudentPayment = getStudentPayment;
		vmpayment.getStudentClassPayList = getStudentClassPayList;
        vmpayment.updateStudentPayment = updateStudentPayment;
        vmpayment.initclasslist = initclasslist;

        vmpayment.StudentPayment = [];
		vmpayment.ClassPayList = [];

        vmpayment.path = '../v1/studentclass/' + $routeParams.id;
        $log.debug('studentid: ' + $routeParams.id);

        vmpayment.classpaylistpath = '../v1/studentclasspaylist';		
		
        vmpayment.setclasspath = '../v1/studentclass/id/' + $routeParams.id + '/myclass/' + $routeParams.myclass;
        $log.debug('studentid: ' + $routeParams.id);
        $log.debug('StudentPayment: ' + $routeParams.myclass);
        vmpayment.StudentPayment.contactID = $routeParams.id;

        vmpayment.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];
        console.log('colors');
        console.log(vmpayment.availableColors);
        vmpayment.singleDemo = {};
        vmpayment.singleDemo.color = '';

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

        function getStudentPayment() {
            return ClassServices.getStudentClass(vmpayment.path).then(function (data) {
                $log.debug('getStudentPayment returned data');
                $log.debug(data.data);
                vmpayment.StudentPayment = data.data;
				getStudentClassPayList();
                return vmpayment.StudentPayment;
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
            return ClassServices.updateStudentClass(vmpayment.path, vmpayment.StudentPayment).then(function (data) {
                $log.debug('updateStudentPayment returned data: goto', vmpayment.path);
                $log.debug(data.data);
                vmpayment.StudentPayment = data.data;
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
