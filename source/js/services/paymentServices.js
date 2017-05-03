(function () {
    'use strict';

    angular
        .module('ng-admin')    
    .factory('PaymentServices', PaymentServices);
    
    PaymentServices.$inject = ['_', '$http', '$log', "$q"];

    function PaymentServices( _ , $http, $log, $q ) {
        var apikey;
 

    var service = {
             setapikey: setapikey,
			getStudentPaymentList: getStudentPaymentList,
            updateStudentPayment: updateStudentPayment,
            createPayer: createPayer,
            getStudentPayment: getStudentPayment,			
            setStudentPayment: setStudentPayment,
			getClassPayList: getClassPayList			
        };
        return service;
        
       function setapikey(key) {
       // $log.debug('setapikey', key);
         apikey = key;
       }


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
                    $log.debug('enter updateStudentPayment before put :' , StudentPayment);
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
        function getClassPayList(classpaypath) {
            return $http({method: 'GET', url: classpaypath}).
                success(function(data, status, headers, config) {
                    $log.debug('getClassPayList success:' + classpaypath);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getClassPayList failure:' + classpaypath);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        
        function createPayer(path, thedata ) {
                    $log.debug('createPayer data before :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }          
       // ---
        // PRIVATE METHODS.
        // ---
        function handleError( response ) {
            $log.debug('failure:');
            $log.debug(response);
            $log.debug('status',response.status);
            $log.debug('config',response.config);
            //debugger;
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
              //  return( $q.reject( "An unknown error occurred." ) );
              return(null);
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {
            $log.debug(' success:');
            $log.debug(response);
            if (response.data.error === true) {
                return( $q.reject( response.data.message ) ); 
            }
            return( response.data );
        }
        
        
        }
 })();  
