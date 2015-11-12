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
      'picfile',
      'StudentServices'
    ];


  function ModalPicUploadController($scope, $log, $uibModal) {
    /* jshint validthis: true */
    var vmpicmodal = this;

    vmpicmodal.animationsEnabled = true;

    vmpicmodal.open = open;
    vmpicmodal.pic = ''; //or should we get this from the db
    vmpicmodal.modalInstance = undefined;

    function open() {

       vmpicmodal.modalInstance = $uibModal.open({
        animation: vmpicmodal.animationsEnabled,
        templateUrl: 'myPickupload.html',
        controller: 'ModalPicInstanceController as vmpicselect',
        size: 'lg',
        resolve: {
          picfile: function () {
            return vmpicmodal.picFile;
          }
        }
      });

      vmpicmodal.modalInstance.result.then(function (selectedpic) {
        vmpicmodal.picfile = selectedpic;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

  }

  function ModalPicInstanceController($scope, $log, $uibModalInstance, picfile, StudentServices) {
    /* jshint validthis: true */
    var vmpicselect = this;
    vmpicselect.ok = ok;
    vmpicselect.cancel = cancel;
    vmpicselect.picfile = picfile;
    vmpicselect.picfilelist = [];
    vmpicselect.getFiles = getFiles;
    vmpicselect.picpath = '../v1/studentfiles';

    activate();

    function activate() {
      getFiles();
    }

    function getFiles() {
      console.log('getfiles');
            return StudentServices.getstudentPicFiles(vmpicselect.picpath).then(function (data) {
                $log.debug('getstudentPicFiles returned data');
                $log.debug(data.data);
                vmpicselect.picfileList = data.data;

                return vmpicselect.picfileList;
            });
        }

    function ok() {
      console.log('hit ok');
      vmpicselect.picFile = StudentServices.getstudentPicFile();
      console.log('got file for ok:' + vmpicselect.picFile);
      $uibModalInstance.close(vmpicselect.picFile);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }

})();
