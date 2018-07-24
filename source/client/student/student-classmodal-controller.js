(function (window,angular) {
  'use strict';

  angular
    .module('ng-admin.student')
    .controller('ModalSetStudentClassController', ModalSetStudentClassController);


  ModalSetStudentClassController.$inject = [
      '$log',
      '$uibModal',
      '$controller',
      '$scope',
      '$window',
      '$route',
      '$scope',
      'ClassServices'
    ];
  function ModalSetStudentClassController( $log, $uibModal, $controller, $scope, $window, $route,ClassServices) {
    /* jshint validthis: true */
    var vmsetclassmodal = this;

    vmsetclassmodal.animationsEnabled = true;

    vmsetclassmodal.opensearch = opensearch;
    vmsetclassmodal.classname = '';
    vmsetclassmodal.modalInstance = undefined;
    $log.debug('ModalSetStudentClassController entered');
//    $log.debug($controller('StudentClassController as vmclass', {$scope: $scope}));
    vmsetclassmodal.vmclass = $controller('StudentClassController as vmclass', {$scope: $scope});

  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("ModalSetStudentClassController started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("ModalSetStudentClassController dismissed");
		$log.debugEnabled(false);
    });


    function opensearch() {
        $log.debug('opensearch entered');
        
      vmsetclassmodal.modalInstance = $uibModal.open({
        animation: vmsetclassmodal.animationsEnabled,
        templateUrl: 'myClasssearch.html',
        controller: 'StudentClassModalInstanceController as vmsearch',
        size: 'lg',
        resolve: {
          classname: function () {
            $log.debug("modal resolve", vmsetclassmodal.classname);
            return vmsetclassmodal.classname;
          }
        }
        
      });

      vmsetclassmodal.modalInstance.result.then(function (result) {
          $log.debug('search modalInstance result class:', result, $scope);
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

 
})(window,window.angular);
