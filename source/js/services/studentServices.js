(function () {
    'use strict';

    angular
        .module('ng-admin')    
    .factory('StudentServices', StudentServices);
    
    StudentServices.$inject = ['$http','$log'];

    function StudentServices( $http, $log ) {
        var service = {
            getAllStudents: getAllStudents,
            getAllZips: getAllZips,
            getStudentLists: getStudentLists,
            getRankList: getRankList,
            updateStudent: updateStudent,
            getStudent: getStudent
        };
        return service;
        
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
                    $log.debug('vm.data before put :' + students);
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
