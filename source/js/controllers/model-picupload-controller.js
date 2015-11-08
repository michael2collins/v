(function () {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalPicUploadController', ModalPicUploadController)
    .controller('ModalPicInstanceController', ModalPicInstanceController);


  ModalPicUploadController.$inject = [
      '$scope',
      '$log',
      '$uibModal'
    ];
  ModalPicInstanceController.$inject = [
      '$scope',
      '$log',
      '$uibModalInstance',
      'picfile'
    ];


  function ModalPicUploadController($scope, $log, $uibModal) {
    /* jshint validthis: true */
    var vmpicmodal = this;

    vmpicmodal.animationsEnabled = true;

    vmpicmodal.open = open;
    vmpicmodal.toggleAnimation = toggleAnimation;
    vmpicmodal.picfile = ''; //or should we get this from the db

    function open() {

      var modalInstance = $uibModal.open({
        animation: vmpicmodal.animationsEnabled,
        templateUrl: 'myPickupload.html',
        controller: 'ModalPicInstanceController',
        size: 'lg',
        resolve: {
          picfile: function () {
            return vmpicmodal.picfile;
          }
        }
      });

      modalInstance.result.then(function (selectedpic) {
        vmpicmodal.picfile = selectedpic;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


    function toggleAnimation() {
      vmpicmodal.animationsEnabled = !vmpicmodal.animationsEnabled;
    };


  }

  function ModalPicInstanceController($scope, $log, $uibModalInstance, picfile) {
    /* jshint validthis: true */
    var vmpicselect = this;
    vmpicselect.ok = ok;
    vmpicselect.cancel = cancel;

    vmpicselect.picfile = picfile;
    vmpicselect.selected = {
      pic: vmpicselect.picfile
    }

    function ok() {
      $uibModalInstance.close(vmpicselect.selected.pic);
    };

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    };

  }

})();
