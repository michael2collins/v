(function (window,angular) {
  'use strict';

  angular
    .module('ng-admin.student')
    .controller('ModalNewStudentController', ModalNewStudentController);

  ModalNewStudentController.$inject = [
      '$log',
      '$uibModal',
      '$location'
    ];


  function ModalNewStudentController( $log, $uibModal, $location) {
    /* jshint validthis: true */
    var vmnewstudentmodal = this;
    
    vmnewstudentmodal.animationsEnabled = true;
    
    vmnewstudentmodal.openmodal = openmodal;
    vmnewstudentmodal.modalInstance = undefined;
    vmnewstudentmodal.thisstudent = '';
    $log.debug('ModalNewStudentController entered ');


    function openmodal() {

      vmnewstudentmodal.modalInstance = $uibModal.open({
        animation: vmnewstudentmodal.animationsEnabled,
        templateUrl: 'newStudent.html',
        controller: 'ModalNewStudentController as vmnew',
        size: 'sm',
        resolve: {
          classname: function () {
              $log.debug('return from open');
            return vmnewstudentmodal.thisstudent;
          }
        }
      });
      vmnewstudentmodal.modalInstance.result.then(function (thisstudent) {
          $log.debug('search modalInstance result thisstudent:', thisstudent);
          vmnewstudentmodal.thisstudent = thisstudent;
      }, function () {
          $log.info('Modal dismissed at: ' + new Date());
      });

    }
    
  }


})(window,window.angular);
