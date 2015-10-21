(function () {
    'use strict';

    angular
        .module('ng-admin')    
    .factory('PaymentServices', PaymentServices);
    
    PaymentServices.$inject = ['_', '$http', '$log'];

    function PaymentServices( _ , $http, $log ) {
 

    var service = {
  
			getStudentPaymentList: getStudentPaymentList,
            updateStudentPayment: updateStudentPayment,
            getStudentPayment: getStudentPayment,			
            setStudentPayment: setStudentPayment			
        };
        return service;
        
  

        function getStudentPayment(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentPayment success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentPayment failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        function updateStudentPayment(path, StudentPayment) {
                    $log.debug('vm.data before put :' + StudentPayment);
            return $http({method: 'PUT', url: path, data: StudentPayment}).
                success(function(data, status, headers, config) {
                    $log.debug('updateStudentPayment success:' + path);
                    $log.debug(data);
                  
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('updateStudentPayment failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }	  
        function setStudentPayment(path, mystudent, myclassid, mypgmid) {
                    $log.debug('service set student class :' + myclassid);
                    $log.debug('service set student pgm :' + mypgmid);
					var mydata = {
						"mystudent": mystudent,
						"myclassid": myclassid,
						"mypgmid": mypgmid,
					};
                    $log.debug('service set studentx class mydata:' + JSON.stringify({data: mydata}) + ' sent to:' + path);
            return $http({method: 'PUT', url: path, data: mydata  }).
                success(function(data, status, headers, config) {
                    $log.debug('setStudentPayment success:' + data);
                    $log.debug(data);
                  
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('setStudentPayment failure:' + JSON.stringify({data: data}));
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }		
        function getStudentPaymentList(classlistpath) {
            return $http({method: 'GET', url: classlistpath}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentPaymentList success:' + classlistpath);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentPaymentList failure:' + classlistpath);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        
        }
 })();  
