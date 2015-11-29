(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('StudentServices', StudentServices);

    StudentServices.$inject = ['$http','$log'];

    function StudentServices( $http, $log ) {
        var picFile = '';
        var theStudent = '';
        var service = {
            getAllStudents: getAllStudents,
            getAllZips: getAllZips,
            getStudentLists: getStudentLists,
            getRankList: getRankList,
            updateStudent: updateStudent,
            getStudent: getStudent,
            getstudentPicFile: getstudentPicFile,
            getstudentPicFiles: getstudentPicFiles,
            setstudentPicFile: setstudentPicFile,
            renameStudentPicFile: renameStudentPicFile,
            setTheStudent: setTheStudent,
            getTheStudent: getTheStudent
        };
        return service;

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
