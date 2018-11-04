export class ModalNewPayerController {
  constructor(
    $log, $uibModal, $location, $scope
  ) {
    'ngInject';
    this.$log = $log;
    this.$uibModal = $uibModal;
    this.$location = $location;
    this.$scope = $scope;
  }

  $onInit() {
    var vmnewPayermodal = this;
    vmnewPayermodal.animationsEnabled = true;

    vmnewPayermodal.modalInstance = undefined;
    vmnewPayermodal.thisPayer = '';
    vmnewPayermodal.$log.debug("ModalNewPayerController entered");

  }
  $onDestroy() {
    this.$log.debug("ModalNewPayerController dismissed");
    this.$log.debugEnabled(false);
  }


  openmodal() {
    var vmnewPayermodal = this;

    vmnewPayermodal.modalInstance = vmnewPayermodal.$uibModal.open({
      animation: vmnewPayermodal.animationsEnabled,
//      templateUrl: 'newPayer.html',
//      controller: 'ModalNewPayerInstanceController as vmnew',
      component: 'newpayerComponent',
      //todo add newpayer component
      size: 'sm',
      resolve: {
        classname: function() {
          vmnewPayermodal.$log.debug('return from open');
          return vmnewPayermodal.thisPayer;
        }
      }
    });
    vmnewPayermodal.modalInstance.result.then(function(thisPayer) {
      vmnewPayermodal.$log.debug('search modalInstance result thisPayer:', thisPayer);
      vmnewPayermodal.thisPayer = thisPayer;
    }, function() {
      vmnewPayermodal.$log.info('Modal dismissed at: ' + new Date());
    });

  }
   cancel() {
      this.$scope.$parent.$uibModalInstance.dismiss('cancel');
   }

}
