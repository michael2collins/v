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


  function ModalPicUploadController($scope,  $log, $uibModal) {
    /* jshint validthis: true */
    var vmpicmodal = this;

    vmpicmodal.animationsEnabled = true;

    vmpicmodal.open = open;
    vmpicmodal.pic = ''; //or should we get this from the db
    vmpicmodal.student = '';
    vmpicmodal.modalInstance = undefined;
    vmpicmodal.somestud = $scope;

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

      vmpicmodal.modalInstance.result.then(function (selectedpic, student) {
        vmpicmodal.picfile = selectedpic;
        vmpicmodal.student = student;
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
    vmpicselect.renameFile = renameFile;
    vmpicselect.picpath = '../v1/studentfiles';
    vmpicselect.renamepath = '../vi/renamefile';
    vmpicselect.student = $scope;

    activate();

    function activate() {
      console.log("picselect student");
      console.log(vmpicselect.student);
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

    function renameFile(student, currentpicfile) {
      console.log('renameFile');
      console.log(' student:' );
      console.log(student);
      console.log('pic');
      console.log(currentpicfile);

      return StudentServices.renameStudentPicFile(vmpicselect.picpath, student, currentpicfile).then(function (data) {
        $log.debug('renameFile returned data');
        $log.debug(data.data);
        vmpicselect.newpicfile = data.data;

        return vmpicselect.newpicfile;
      });
    }

    function ok(student) {
      console.log('hit ok');
      vmpicselect.picFile = StudentServices.getstudentPicFile();
      vmpicselect.picFile = renameFile(student, vmpicselect.picfile);
      console.log('got file for ok:' + vmpicselect.picFile);
      console.log('for student:' + student);
      $uibModalInstance.close(vmpicselect.picFile, student);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }

})();
