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
      '$route'
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


  function ModalSetStudentClassController( $log, $uibModal, $controller, $scope, $window, $route) {
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
            return vmsetclassmodal.classname;
          }
        }
      });
      vmsetclassmodal.modalInstance.result.then(function (classname) {
          console.log('search modalInstance result class:', classname);
        vmsetclassmodal.classname = classname;
          $route.reload();

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


//    vmsearch.ok = ok;
//    vmsearch.cancel = cancel;
    vmsearch.closemodal = closemodal;
    vmsearch.classname = vmsearch.vmclass.studentclass;

 /*   function ok() {
      console.log('hit ok');
      console.log('got classname for ok:', vmsearch.classname);
      $uibModalInstance.close(vmsearch.classname);
    }*/

    function closemodal(contactid, classid, pgmid) {
      $log.debug('hit close', contactid, classid, pgmid);
      $log.debug('got classname for close:', vmsearch.vmclass.studentclass);
//      StudentServices.setActiveTab(2,'Modal studentclass controller');
      $log.debug('got class for close:', vmsearch.vmclass);

        vmsearch.vmclass.setStudentClass(contactid, classid, pgmid).then(function(data){
              $log.debug('modal setStudentClass returns', data);
            
        });
      $uibModalInstance.close(vmsearch.vmclass.studentclass);

    }
    

  }
 
})();
