
/* Services */
/*
var studentServices = angular.module('vStudentServices', [])
    .factory('StudentServices', ['Restangular',  function StudentServices(Restangular) {
      return {
        /
         * @function getStudents
         * @returns a Promise that eventually resolves to the list of students
         /
        getStudents: function() {
          var response = Restangular.all('students').getList().then(function(response) {
          });
          return response;
        }
      };
    }]);
*/
//var module = angular.module('app', []);
//module.service('StudentServices', function()  {
(function () {
    'use strict';

    angular
        .module('ng-admin')    
    .factory('StudentServices', function( $http, $log ) {
     var service = {
        getAllStudents: function(path, callback) {
               $http.get(path).success(callback);
        },
        getStudent: function(path, callback) {
            $log.debug(path);
               $http.get(path).success( callback
               );
        }
     };
     return service;
});
 })();  
