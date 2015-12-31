(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('StudentServices', StudentServices);

    StudentServices.$inject = ['$http', '$q', '$log'];

    function StudentServices( $http, $q, $log ) {
        var picFile = '';
        var theStudent = '';
        var activeTab = 'Student Information'; //default
        var service = {
            getAllStudents: getAllStudents,
            getAllZips: getAllZips,
            getStudentLists: getStudentLists,
            getFamily: getFamily,
            getStudentHistory: getStudentHistory,
            getRankList: getRankList,
            updateStudent: updateStudent,
            getStudent: getStudent,
            getstudentPicFile: getstudentPicFile,
            getstudentPicFiles: getstudentPicFiles,
            setstudentPicFile: setstudentPicFile,
            renameStudentPicFile: renameStudentPicFile,
            setTheStudent: setTheStudent,
            getTheStudent: getTheStudent,
            setActiveTab: setActiveTab,
            getContactTypeCounts: getContactTypeCounts,
            getActiveTab: getActiveTab,
            createStudent: createStudent,
            getUserPrefCols: getUserPrefCols,
            createUserPrefCols: createUserPrefCols
        };
        return service;


        function getActiveTab() {
            return activeTab;
        }
        function setActiveTab(thetab) {
            activeTab = thetab;
        }
        
        function getstudentPicFile() {
          $log.debug('getStuPicfile: ' + picFile);
          return picFile;
        }
        function setTheStudent(student) {
            theStudent = student;
        }
        function getTheStudent(){
            $log.debug('getTheStudent', theStudent);
            return theStudent;
        }

      function getstudentPicFiles(path) {
          $log.debug('getStuPicfiles ');
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getStuPicfiles success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStuPicfiles failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

      function renameStudentPicFile(path, student, oldpicfile) {
          $log.debug('renameStudentPicFile ');
          $log.debug(student);
          $log.debug('pic');
          $log.debug(oldpicfile);
          $log.debug('path');
          $log.debug(path);
          student.oldpicfile = oldpicfile;
          

            return $http({method: 'PUT', url: path, data: student}).
                success(function(data, status, headers, config) {
                    $log.debug('renameStudentPicFile success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('renameStudentPicFile failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }


      function setstudentPicFile(pic) {
          $log.debug('setStuPicfile: ' + pic);
          picFile = pic;
        } 

        function getAllStudents(path) {
            $log.debug('getAllStudents service entered');
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getAllStudents success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getAllStudents failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        function getUserPrefCols(path) {
            $log.debug('getUserPrefCols service entered with path:', path);
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getUserPrefCols success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getUserPrefCols failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        function createUserPrefCols(path, thedata ) {
                    $log.debug('createUserPrefCols data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        
        function getFamily(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getFamily success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getFamily failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        function getStudentHistory(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentHistory success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentHistory failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        function getStudent(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudent success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudent failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

/*        function createStudent(path, thedata) {
                    $log.debug('createStudent data before post :' , thedata);
                return $http({method: 'POST', url: path, data: thedata}).then(function(response) {
                    $log.debug('createStudent success:' + path);
                    $log.debug(response.data);

                    return response.data;
                }).catch(function(e) {
                    $log.debug('createStudent failure:' + path);
                    $log.debug("error", e);
                    throw e;
                });
        }
 */       
        function createStudent(path, thedata ) {
                    $log.debug('createStudent data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                    //    params: {
                    //        action: "add"
                    //    },
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        
/*            function getFriends() {
                    var request = $http({
                        method: "get",
                        url: "api/index.cfm",
                        params: {
                            action: "get"
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                // I remove the friend with the given ID from the remote collection.
                function removeFriend( id ) {
                    var request = $http({
                        method: "delete",
                        url: "api/index.cfm",
                        params: {
                            action: "delete"
                        },
                        data: {
                            id: id
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                */
                // ---
                // PRIVATE METHODS.
                // ---
                // I transform the error response, unwrapping the application dta from
                // the API response payload.
                function handleError( response ) {
                    // The API response from the server should be returned in a
                    // nomralized format. However, if the request was not handled by the
                    // server (or what not handles properly - ex. server error), then we
                    // may have to normalize it on our end, as best we can.
                    $log.debug('failure:');

                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    // Otherwise, use expected error message.
                    return( $q.reject( response.data.message ) );
                }
                // I transform the successful response, unwrapping the application data
                // from the API response payload.
                function handleSuccess( response ) {
                    $log.debug(' success:');
                    $log.debug(response.data);
                    return( response.data );
                }
        
                
/*        function createStudent(path, thedata) {
                    $log.debug('createStudent data before post :' , thedata);
            return $http({method: 'POST', url: path, data: thedata }).
                success(function(data, status, headers, config) {
                    $log.debug('createStudent success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('createStudent failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
*/

        function updateStudent(path, students) {
                    $log.debug('updateStudent vm.data before put :' , students);
            return $http({method: 'PUT', url: path, data: students}).
                success(function(data, status, headers, config) {
                    $log.debug('updateStudent success:' + path);
                    $log.debug(data);

                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('updateStudent failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        function getAllZips(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getAllZips success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getAllStudents failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        function getContactTypeCounts() {
            var path='../v1/contacttypes';
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('StudentServices getContactTypes success:' + path);
                    $log.debug(data);
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getContactTypes failure:' + path);
                });
        }
        
        function getStudentLists(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentLists success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentLists failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        function getRankList(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getRankList success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getRankList failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        }
 })();
