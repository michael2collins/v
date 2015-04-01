
/* Services */

var studentServices = angular.module('studentServices', ['ngResource']);

studentServices.factory('Student', ['$resource',
  function($resource){
    'use strict';
    return $resource('students/:studentId.json', {}, {
      query: {method:'GET', params:{studentId:'students'}, isArray:true}
    });
  }]);
