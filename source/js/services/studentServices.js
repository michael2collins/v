(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('StudentServices', StudentServices);

    StudentServices.$inject = ['$http', '$q', '$log'];

    function StudentServices( $http, $q, $log ) {
        var apikey;
        
        var picFile = '';
        var theStudent = '';
        var activeTab = 1; //default
        var service = {
             setapikey: setapikey,
            getAllStudents: getAllStudents,
            getAllZips: getAllZips,
            getStudentLists: getStudentLists,
            getStudentHistory: getStudentHistory,
            getRankList: getRankList,
            getStudentRanks: getStudentRanks,
            addStudentRank: addStudentRank,
            removeStudentRank: removeStudentRank,
            getStudentRankTypes: getStudentRankTypes,
            updateStudent: updateStudent,
            getStudent: getStudent,
            getstudentPicFile: getstudentPicFile,
            getstudentPicFiles: getstudentPicFiles,
            setstudentPicFile: setstudentPicFile,
            renameStudentPicFile: renameStudentPicFile,
            getRankPartial: getRankPartial,
            getRank: getRank,
            setTheStudent: setTheStudent,
            getTheStudent: getTheStudent,
            setActiveTab: setActiveTab,
            getContactTypeCounts: getContactTypeCounts,
            getActiveTab: getActiveTab,
            createStudent: createStudent,
            getUserPrefCols: getUserPrefCols,
            refreshStudents: refreshStudents,
            createUserPrefCols: createUserPrefCols,
            saveStudentPic: saveStudentPic,
            getNotifications: getNotifications,
            removeNotification: removeNotification,
            sendEmail: sendEmail,
            refreshEmails: refreshEmails,
            getEmailcount: getEmailcount,
            updateEmailList: updateEmailList,
            removeEmailList: removeEmailList,
            getEmailLists: getEmailLists,
            getEmailViews: getEmailViews
        };
        return service;


        function getActiveTab() {
            return activeTab;
        }
        function setActiveTab(thetab,thecaller) {
            $log.debug('StudentServices setActiveTab called', thetab, thecaller);
            activeTab = thetab;
        }

     function setapikey(key) {
//        $log.debug('StudentServices setapikey', key);
         apikey = key;
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

     function refreshStudents(input) {
        var params = {input: input};
        return $http.get(
          '../v1/studentnames',
          {params: params}
        ).then(function(response) {
                    $log.debug('refreshStudents service success:');
                    $log.debug(response.data);
          return response.data;
        });
      }
     function refreshEmails(input) {
        var params = {input: input};
        var request = $http({
            method: "get",
            url: '../v1/emails',
            params: params                
        });
        return( request.then( handleSuccess, handleError ) );
      }
     function getEmailViews(input) {
        var params = {input: input};
        var request = $http({
            method: "get",
            url: '../v1/emailview',
            params: params                
        });
        return( request.then( handleSuccess, handleError ) );
      }

     function getRankPartial(input,ranktype) {
                    $log.debug('getRankPartial service entered:',input,ranktype);
        var params = {
            input: input,
            ranktype: ranktype
        };
        return $http.get(
          '../v1/rankpartial',
          {params: params}
        ).then(function(response) {
                    $log.debug('getRankPartial service success:');
                    $log.debug(response.data);
          return response.data;
        });
      }
     function getRank(ranktype) {
                    $log.debug('getRank service entered:',ranktype);
        var params = {
            ranktype: ranktype
        };
        return $http.get(
          '../v1/rank',
          {params: params}
        ).then(function(response) {
                    $log.debug('getRank service success:');
                    $log.debug(response.data);
          return response.data;
        });
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

      function saveStudentPic( student, picnm) {
          $log.debug('saveStudentPic :',student,picnm);
          student.picnm = picnm;
          var path = '../v1/pic';

            return $http({method: 'PUT', url: path, data: student}).
                success(function(data, status, headers, config) {
                    $log.debug('saveStudentPic success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('saveStudentPic failure:' + path);
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

        function addStudentRank( thedata ) {
            $log.debug('addStudentRank data before post :' , thedata);
            var path = "../v1/studentrank";
            var request = $http({
                method: "POST",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function removeStudentRank( thedata ) {
            $log.debug('removeStudentRank data before post :' , thedata);
            var path = "../v1/studentrank";
            var request = $http({
                method: "DELETE",
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
            $log.debug('StudentServices getStudentLists entered', apikey);
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('StudentServices getStudentLists success:' , path, apikey);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('StudentServices getStudentLists failure:', path, apikey);
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
        function getStudentRanks(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentRanks success:' + path);
                    $log.debug(data);
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentRanks failure:' + path);
                });
        }
        function getStudentRankTypes(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentRankTypes success:' + path);
                    $log.debug(data);
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentRankTypes failure:' + path);
                });
        }
        function getNotifications(path) {
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeNotification( thedata ) {
            $log.debug('removeNotification data before post :' , thedata);
            var path = "../v1/notification";
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function getEmailcount(path) {
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function getEmailLists(path) {
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeEmailList( thedata, path ) {
            $log.debug('removeEmailList data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateEmailList(path, thedata ) {
                    $log.debug('updateEmailList data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function sendEmail(path, thedata ) {
            $log.debug('send email data before post :' , path, thedata);
            var request = $http({
                method: "POST",
                url: path,
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        


        }
 })();
