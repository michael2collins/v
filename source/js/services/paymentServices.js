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
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }
        function updateStudentPayment(path, StudentPayment) {
                    $log.debug('enter updateStudentPayment before put :' , StudentPayment);
        var request = $http({
            method: "PUT",
            url: path,
            data: StudentPayment
        });
        return( request.then( handleSuccess, handleError ) );
                    
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
        var request = $http({
            method: "PUT",
            url: path,
            data: mydata
        });
        return( request.then( handleSuccess, handleError ) );
                    
        }		
        function getStudentPaymentList(path) {
        var request = $http({
            method: "GET",
            url: path
        });
        return( request.then( handleSuccess, handleError ) );
            
        }
        function getClassPayList(path) {
        var request = $http({
            method: "GET",
            url: path
        });
        return( request.then( handleSuccess, handleError ) );
            
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
