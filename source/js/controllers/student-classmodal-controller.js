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
      '$scope'
    ];
  ModalInstanceController.$inject = [
      '$log',
      '$uibModalInstance',
      'classname',
      '$scope',
      '$controller',
      '$route'
    ];


  function ModalSetStudentClassController( $log, $uibModal, $controller, $scope) {
    /* jshint validthis: true */
    var vmsetclassmodal = this;

    vmsetclassmodal.animationsEnabled = true;

    vmsetclassmodal.opensearch = opensearch;
    vmsetclassmodal.classname = '';
    vmsetclassmodal.modalInstance = undefined;
    $log.debug('ModalSetStudentClassController entered');
//    console.log($controller('StudentClassController as vmclass', {$scope: $scope}));
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
            return vmsetclassmodal.classname;
          }
        }
      });
      vmsetclassmodal.modalInstance.result.then(function (classname) {
          console.log('search modalInstance result class:', classname);
        vmsetclassmodal.classname = classname;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    }
  }



  function ModalInstanceController( $log, $uibModalInstance, classname, $scope, $controller, $route) {
    /* jshint validthis: true */
    var vmsearch = this;
    console.log('modal class entered');
    console.log(vmsearch);
    vmsearch.vmclass = $controller('StudentClassController as vmclass', {$scope: $scope});
    
//    vmsearch.ok = ok;
//    vmsearch.cancel = cancel;
    vmsearch.closemodal = closemodal;
    vmsearch.classname = vmsearch.vmclass.studentclass;


 /*   function ok() {
      console.log('hit ok');
      console.log('got classname for ok:', vmsearch.classname);
      $uibModalInstance.close(vmsearch.classname);
    }*/

    function closemodal() {
      console.log('hit close');
      console.log('got classname for close:', vmsearch.vmclass.studentclass);
      $route.reload();
      $uibModalInstance.close(vmsearch.vmclass.studentclass);

    }
    

  }
 
})();
