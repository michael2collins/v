(function (window, angular) {
  'use strict';

  angular
    .module('ng-admin.student')
    .controller('ModalNewPayerController', ModalNewPayerController);

  ModalNewPayerController.$inject = [
      '$log',
      '$uibModal'
    ];


  function ModalNewPayerController( $log, $uibModal, $location) {
    /* jshint validthis: true */
    var vmnewPayermodal = this;
    
    vmnewPayermodal.animationsEnabled = true;
    
    vmnewPayermodal.openmodal = openmodal;
    vmnewPayermodal.modalInstance = undefined;
    vmnewPayermodal.thisPayer = '';
    $log.debug('ModalNewPayerController entered ');


    function openmodal() {

      vmnewPayermodal.modalInstance = $uibModal.open({
        animation: vmnewPayermodal.animationsEnabled,
        templateUrl: 'newPayer.html',
        controller: 'ModalNewPayerInstanceController as vmnew',
        size: 'sm',
        resolve: {
          classname: function () {
              $log.debug('return from open');
            return vmnewPayermodal.thisPayer;
          }
        }
      });
      vmnewPayermodal.modalInstance.result.then(function (thisPayer) {
          $log.debug('search modalInstance result thisPayer:', thisPayer);
          vmnewPayermodal.thisPayer = thisPayer;
      }, function () {
          $log.info('Modal dismissed at: ' + new Date());
      });

    }
    
  }


})(window,window.angular);
