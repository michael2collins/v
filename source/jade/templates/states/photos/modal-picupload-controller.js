(function (window, angular) {
  'use strict';

  angular
    .module('ng-admin.all')
    .controller('ModalPicSearchController', ModalPicSearchController);


  ModalPicSearchController.$inject = [
      '$scope',
      '$log',
      '$uibModalInstance',
      'picfile',
      'PhotoServices',
      '$route'
    ];

  function ModalPicSearchController($scope, $log, $uibModalInstance, picfile, PhotoServices, $route) {
    /* jshint validthis: true */
    var vmpicselect = this;
    vmpicselect.ok = ok;
    vmpicselect.cancel = cancel;
    vmpicselect.picfile = picfile;
    vmpicselect.picfilelist = [];
    vmpicselect.renameFile = renameFile;
    vmpicselect.picpath = '../v1/studentfiles';
    vmpicselect.renamepath = '../v1/renamefile';
    vmpicselect.student = PhotoServices.getTheStudent();
    vmpicselect.newpicfile = '';
    vmpicselect.okpicFile = '';


    activate();

    function activate() {
      $log.debug("picselect student");
      $log.debug(vmpicselect.student);
    }


    function renameFile(student, currentpicfile) {
      $log.debug('renameFile');
      $log.debug(' student:' );
      $log.debug(student);
      $log.debug('pic');
      $log.debug(currentpicfile);

      return PhotoServices.renameStudentPicFile(vmpicselect.renamepath, student, currentpicfile).then(function (data) {
        $log.debug('renameFile returned data');
        $log.debug(data);
        vmpicselect.newpicfile = data.newpicfile;
        return vmpicselect.newpicfile;
      });
    }


    function ok() {
      $log.debug('hit ok');
      var thisstudent = PhotoServices.getTheStudent();
      vmpicselect.okpicFile = PhotoServices.getstudentPicFile();
      vmpicselect.okpicFile = renameFile(thisstudent, vmpicselect.okpicFile);
      $log.debug('got file for ok:', vmpicselect.okpicFile);
      $log.debug('for student:' ,thisstudent);

      $uibModalInstance.close(vmpicselect.okpicFile);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }

})(window, window.angular);
