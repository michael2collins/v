(function () {
    'use strict';

    angular
        .module('ng-admin')    
    .factory('ClassServices', ClassServices);
    
    ClassServices.$inject = ['_', '$http', '$q', '$log'];

    function ClassServices( _ , $http, $q, $log ) {
    var apikey;

    var xlistnew = [];
    var searchResult = {};
    
    var service = {
             setapikey: setapikey,
            setxlist: setxlist,
            getclass2: getclass2,
            distinctCat: distinctCat,
            distinctPgm: distinctPgm,
            distinctAge: distinctAge,
            getcat2: getcat2,
            getStudentClassList: getStudentClassList,
            getStudentClassPicture: getStudentClassPicture,
            getStudentClassPictureList: getStudentClassPictureList,
            getStudentClassStatuses: getStudentClassStatuses,
            updateStudentClass: updateStudentClass,
            getStudentClass: getStudentClass,            
            getClassPgm: getClassPgm,
            addStudentRegistration: addStudentRegistration,
            removeStudentRegistration: removeStudentRegistration,
            setStudentClass: setStudentClass,
            setClassSearchResult: setClassSearchResult,
            getPayersPartial: getPayersPartial,
            getPayerList: getPayerList,
            getFamily: getFamily,
            getListPrices: getListPrices,
            getPaymentplan: getPaymentplan,
            getPaymentplans: getPaymentplans,
            getPaymenttypes: getPaymenttypes,
            updatePaymentPlan: updatePaymentPlan,
            removePaymentPlan: removePaymentPlan,
            getClassSearchResult: getClassSearchResult,
            getPaymentpays: getPaymentpays,
            getPayerpayments: getPayerpayments,
            updatePaymentPay: updatePaymentPay,
            removePaymentPay: removePaymentPay
        };
        return service;

     function setapikey(key) {
//        $log.debug('ClassServices setapikey', key);
         apikey = key;
     }
        
        function setxlist(mylist) {
            xlistnew = mylist;
            $log.debug('setxlist', xlistnew);
        }
        
        function setClassSearchResult(result){
            $log.debug('ClassServices.setClassSearchResult entered', result);
            searchResult = result;
        }
        function getClassSearchResult(){
            $log.debug('ClassServices.getClassSearchResult entered', searchResult);
            return searchResult;
        }
        function distinctAge() {
            var request = $http({
                method: "get",
                url: "../v1/classages",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function distinctPgm() {
            var request = $http({
                method: "get",
                url: "../v1/classpgms",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function distinctCat() {
            var request = $http({
                method: "get",
                url: "../v1/classcats",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

      function getcat2(catquery) {
       //   console.log("querying for");
    //      console.log(catquery);
          var results=[];
     //     console.log(xlistnew.studentclasslist.length);
           for (var i=0; i < xlistnew.studentclasslist.length; i++) {
      //         console.log(xlistnew.studentclasslist[i].classcat);
               if (xlistnew.studentclasslist[i].classcat === catquery) {
                   results.push(xlistnew.studentclasslist[i]);
               }
           }
//          console.log("the getcat query result");
 //         console.log(results);
          return results;
      }

      function getclass2(catquery) {
   //       console.log("querying for");
    //      console.log(catquery);
          var results=[];
    //      console.log(xlistnew.studentclasslist.length);
           for (var i=0; i < xlistnew.studentclasslist.length; i++) {
     //          console.log(xlistnew.studentclasslist[i].class);
               if (xlistnew.studentclasslist[i].class === catquery) {
                   results.push(xlistnew.studentclasslist[i]);
               }
           }
      //    console.log("the getclass2 query result");
    //      console.log(results);
          return results;
      }

        function getClassPgm(path) {
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        
        function getStudentClass(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentClass success:' + path);
                    $log.debug(data);
                    //mlc do i need this? getStudentClassPicture(path);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentClass failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        function updateStudentClass(path, studentclass) {
                    $log.debug('vm.data before put :', studentclass);
            return $http({method: 'PUT', url: path, data: studentclass}).
                success(function(data, status, headers, config) {
                    $log.debug('updateStudentClass success:' + path);
                    $log.debug(data);
                  
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('updateStudentClass failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        function setStudentClass(path, mystudent, myclassid, mypgmid) {
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
                    $log.debug('setStudentClass success:' + data);
                    $log.debug(data);
                  
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('setStudentClass failure:' + JSON.stringify({data: data}));
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }        
        function getStudentClassPicture(classpicturepath) {
            return $http({method: 'GET', url: classpicturepath}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentClassPicture success:' + classpicturepath);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentClassPicture failure:' + classpicturepath);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }        
        function getStudentClassPictureList(classpicturepath) {
            return $http({method: 'GET', url: classpicturepath}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentClassPictureList success:' + classpicturepath);
                    $log.debug(data);
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentClassPictureList failure:' + classpicturepath);
                });
        }        
        function getStudentClassList(classlistpath) {
            return $http({method: 'GET', url: classlistpath}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentClassList success:' + classlistpath);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentClassList failure:' + classlistpath);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        function getStudentClassStatuses(classstatuspath) {
            return $http({method: 'GET', url: classstatuspath}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentClassStatuses success:' + classstatuspath);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentClassStatuses failure:' + classstatuspath);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        function addStudentRegistration(path, thedata ) {
                    $log.debug('addStudentRegistration data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        function removeStudentRegistration(path, thedata ) {
            $log.debug('removeStudentRegistration data before post :', path, thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function getPayersPartial(input) {
            $log.debug('getPayersPartial service entered:',input);
            var params = {
                input: input
            };
            return $http.get(
              '../v1/payerpartial',
              {params: params}
            ).then(function(response) {
                        $log.debug('getPayersPartial service success:');
                        $log.debug(response.data);
              return response.data;
            });
        }
        function getPayerList(path) {
            $log.debug('getPayerList service entered',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getFamily(path) {
            $log.debug('getFamily service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getListPrices(path) {
            $log.debug('getListPrices service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getPaymentplan(path) {
            $log.debug('getPaymentplan service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getPaymentplans(path) {
            $log.debug('getPaymentplans service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getPaymenttypes(path) {
            $log.debug('getPaymenttypes service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function updatePaymentPlan(path, thedata ) {
                    $log.debug('updatePaymentPlan data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }         
        function removePaymentPlan(path, thedata ) {
            $log.debug('removePaymentPlan data before post :', path, thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function getPaymentpays(path) {
            $log.debug('getPaymentpays service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getPayerpayments(path) {
            $log.debug('getPayerpayments service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function updatePaymentPay(path, thedata ) {
                    $log.debug('updatePaymentPay data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }         
        function removePaymentPay(path, thedata ) {
            $log.debug('removePaymentPay data before post :', path, thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        
        function handleError( response ) {
            $log.debug('failure:');
    
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
                return( $q.reject( "An unknown error occurred in ClassServices." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }

        function handleSuccess( response ) {
            $log.debug(' success:');
            $log.debug(response.data);
            return( response.data );
        }
        
        }
 })();  
