
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
App.factory('StudentServices', [ '$http', '$scope',  function( $http, $scope ) {
  return {

          /**
         * @function getStudents
         * @returns a Promise that eventually resolves to the list of students
         */
        getStudents: function() {
			
			 $http.get('/testdata/students.json').
			 success(function(data, status, headers, config) {
				 console.log('got students');
				 $scope.status = status;
				 $scope.students = data;
				 console.log(data);
			 }).
			 error(function (data, status, headers, config) {
					 //  Do some error handling here
				$scope.data = data || "Request Failed";
				$scope.status = status;
			 });   	
			 return $scope.students;

        }
  };
}]);