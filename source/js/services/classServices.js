(function () {
    'use strict';

    angular
        .module('ng-admin')    
    .factory('ClassServices', ClassServices);
    
    ClassServices.$inject = ['_', '$http', '$q', '$log'];

    function ClassServices( _ , $http, $q, $log ) {
    var apikey;

    var xlistnew = [];
    
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
            getStudentClassStatuses: getStudentClassStatuses,
            updateStudentClass: updateStudentClass,
            getStudentClass: getStudentClass,            
            setStudentClass: setStudentClass            
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
          console.log("querying for");
          console.log(catquery);
          var results=[];
          console.log(xlistnew.studentclasslist.length);
           for (var i=0; i < xlistnew.studentclasslist.length; i++) {
               console.log(xlistnew.studentclasslist[i].classcat);
               if (xlistnew.studentclasslist[i].classcat === catquery) {
                   results.push(xlistnew.studentclasslist[i]);
               }
           }
          console.log("the getcat query result");
          console.log(results);
          return results;
      }

      function getclass2(catquery) {
          console.log("querying for");
          console.log(catquery);
          var results=[];
          console.log(xlistnew.studentclasslist.length);
           for (var i=0; i < xlistnew.studentclasslist.length; i++) {
               console.log(xlistnew.studentclasslist[i].class);
               if (xlistnew.studentclasslist[i].class === catquery) {
                   results.push(xlistnew.studentclasslist[i]);
               }
           }
          console.log("the getclass2 query result");
          console.log(results);
          return results;
      }

        function getStudentClass(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentClass success:' + path);
                    $log.debug(data);
                    getStudentClassPicture(path);
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
