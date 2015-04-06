
/* Services */

var studentServices = angular.module('vStudentServices', [])
    .factory('StudentServices', ['Restangular',  function StudentServices(Restangular) {
      return {
        /**
         * @function getStudents
         * @returns a Promise that eventually resolves to the list of students
         */
        getStudents: function() {
          var response = Restangular.all('students').getList().then(function(response) {
          });
          return response;
        }
      };
    }]);
