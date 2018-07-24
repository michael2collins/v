(function (window,angular) {
  'use strict';

  angular
    .module('ng-admin.student')
    .controller('StudentClassModalInstanceController', StudentClassModalInstanceController);


  StudentClassModalInstanceController.$inject = [
      '$log',
      '$uibModalInstance',
      'classname',
      '$scope',
      '$controller',
      '$route',
      'StudentServices'
    ];


  function StudentClassModalInstanceController( $log, $uibModalInstance, classname, $scope, $controller, $route, StudentServices) {
    /* jshint validthis: true */
    var vmsearch = this;
    $log.debug('modal class entered');
    
    vmsearch.vmclass = $controller('StudentClassController as vmclass', {$scope: $scope});
    $log.debug(vmsearch.vmclass);


    vmsearch.closemodal = closemodal;

    function closemodal(contactid, classid, pgmid) {
      $log.debug('hit close', contactid, classid, pgmid);
      $log.debug('got classname for close:', vmsearch.vmclass.studentclass);

      vmsearch.vmclass.studentclass = vmsearch.vmclass.getClassPgm(classid,pgmid);      
//      vmsearch.vmclass.studentclass.classid=classid;
//      vmsearch.vmclass.studentclass.contactid=contactid;
//      vmsearch.vmclass.studentclass.pgmid=pgmid;
      $log.debug('got class for close:', vmsearch.vmclass.studentclass);

      $uibModalInstance.close(vmsearch.vmclass.studentclass);

    }
    

  }
 
})(window,window.angular);
