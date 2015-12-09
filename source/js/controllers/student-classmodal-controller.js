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
      '$controller'
    ];


  function ModalSetStudentClassController( $log, $uibModal, $controller, $scope) {
    /* jshint validthis: true */
    var vmsetclassmodal = this;

    vmsetclassmodal.animationsEnabled = true;

    vmsetclassmodal.opensearch = opensearch;
    vmsetclassmodal.classname = '';
    vmsetclassmodal.modalInstance = undefined;
    console.log('hmm');
//    console.log($controller('StudentClassController as vmclass', {$scope: $scope}));
    vmsetclassmodal.vmclass = $controller('StudentClassController as vmclass', {$scope: $scope});


    function opensearch() {

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



  function ModalInstanceController( $log, $uibModalInstance, classname, $scope, $controller) {
    /* jshint validthis: true */
    var vmsearch = this;
    console.log('modal class entered');
    console.log(vmsearch);
    vmsearch.vmclass = $controller('StudentClassController as vmclass', {$scope: $scope});
    
    vmsearch.ok = ok;
    vmsearch.cancel = cancel;
    vmsearch.classname = classname;


    function ok() {
      console.log('hit ok');
      console.log('got classname for ok:', vmsearch.classname);
      $uibModalInstance.close(vmsearch.classname);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }
 
})();
