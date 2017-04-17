(function () {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalSetStudentClassController', ModalSetStudentClassController)
    .controller('ModalInstanceController', ModalInstanceController);


  ModalSetStudentClassController.$inject = [
      '$log',
      '$uibModal',
      '$controller',
      '$scope',
      '$window',
      '$route',
      'ClassServices'
    ];
  ModalInstanceController.$inject = [
      '$log',
      '$uibModalInstance',
      'classname',
      '$scope',
      '$controller',
      '$route',
      'StudentServices'
    ];


  function ModalSetStudentClassController( $log, $uibModal, $controller, $scope, $window, $route,ClassServices) {
    /* jshint validthis: true */
    var vmsetclassmodal = this;

    vmsetclassmodal.animationsEnabled = true;

    vmsetclassmodal.opensearch = opensearch;
    vmsetclassmodal.classname = '';
    vmsetclassmodal.modalInstance = undefined;
    $log.debug('ModalSetStudentClassController entered');
    console.log($controller('StudentClassController as vmclass', {$scope: $scope}));
    vmsetclassmodal.vmclass = $controller('StudentClassController as vmclass', {$scope: $scope});


    function opensearch() {
        $log.debug('opensearch entered');
        
      vmsetclassmodal.modalInstance = $uibModal.open({
        animation: vmsetclassmodal.animationsEnabled,
        templateUrl: 'myClasssearch.html',
        controller: 'ModalInstanceController as vmsearch',
        size: 'lg',
        resolve: {
          classname: function () {
            console.log("modal resolve", vmsetclassmodal.classname);
            return vmsetclassmodal.classname;
          }
        }
        
      });

      vmsetclassmodal.modalInstance.result.then(function (result) {
          console.log('search modalInstance result class:', result, $scope);
//        ClassServices.setClassSearchResult(result);
//        vmsetclassmodal.classname = result;
//        vmsetclassmodal.vmclass.studentclass2 = result;
        $scope.$parent.vmclass.studentclass = result;
      //    $route.reload();

   //   $window.location.href = '/#/form-layouts-editstudent/id/' + vmsetclassmodal.vmclass.studentclass.contactID;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    }
  }

 

  function ModalInstanceController( $log, $uibModalInstance, classname, $scope, $controller, $route, StudentServices) {
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
 
})();
