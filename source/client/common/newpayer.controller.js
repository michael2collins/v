export class ModalNewPayerController {
  constructor(
    $log, $uibModal, $location, $scope,$attrs
  ) {
    'ngInject';
    this.$log = $log;
    this.$uibModal = $uibModal;
    this.$location = $location;
    this.$scope = $scope;
        this.$attrs = $attrs;
  }

  $onInit() {
    var vmnewPayermodal = this;
    vmnewPayermodal.animationsEnabled = true;
//          vmnewPayermodal.disenable = vmnewPayermodal.$attrs.disenable;

    vmnewPayermodal.modalInstance = undefined;
    vmnewPayermodal.thisPayer = '';
    vmnewPayermodal.$log.log("ModalNewPayerController entered");

        vmnewPayermodal.$scope.$on('$viewContentLoaded', 
        function(event){ 
            vmnewPayermodal.disenable=vmnewPayermodal.$attrs.disenable;

        });

  }
  $onDestroy() {
    this.$log.log("ModalNewPayerController dismissed");
    //this.$log.logEnabled(false);
  }


  openmodal() {
    var vmnewPayermodal = this;

    vmnewPayermodal.modalInstance = vmnewPayermodal.$uibModal.open({
      animation: vmnewPayermodal.animationsEnabled,
//      templateUrl: 'newPayer.html',
//      controller: 'ModalNewPayerInstanceController as vmnew',
      component: 'newpayerinstComponent',
      //todo add newpayer component
      size: 'sm',
      resolve: {
        classname: function() {
          vmnewPayermodal.$log.log('return from open');
          return vmnewPayermodal.thisPayer;
        }
      }
    });
    vmnewPayermodal.modalInstance.result.then(function(thisPayer) {
      vmnewPayermodal.$log.log('search modalInstance result thisPayer:', thisPayer);
      vmnewPayermodal.thisPayer = thisPayer;
    }, function() {
      vmnewPayermodal.$log.info('Modal dismissed at: ' + new Date());
    });

  }
   cancel() {
      this.$scope.$parent.$uibModalInstance.dismiss('cancel');
   }

}
