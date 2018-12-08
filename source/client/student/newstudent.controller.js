export class ModalNewStudentController {
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

    var vmnewstudentmodal = this;

    vmnewstudentmodal.animationsEnabled = true;

    vmnewstudentmodal.modalInstance = undefined;
    vmnewstudentmodal.thisstudent = '';
    vmnewstudentmodal.$log.debug('ModalNewStudentController entered ');

  }
  $onDestroy() {
    this.$log.debug("ModalNewStudentController dismissed");
    this.$log.debugEnabled(false);
  }

  openmodal() {
    var vmnewstudentmodal = this;

    vmnewstudentmodal.modalInstance = vmnewstudentmodal.$uibModal.open({
      animation: vmnewstudentmodal.animationsEnabled,
      component: 'newstudentinstComponent',
      size: 'md',
      resolve: {
        classname: function() {
          vmnewstudentmodal.$log.debug('return from open');
          return vmnewstudentmodal.thisstudent;
        }
      }
    });

    vmnewstudentmodal.modalInstance.opened.then(
      function(success) {
        vmnewstudentmodal.$log.debug('modalInstance ui opened:', success);

      },
      function(error) {
        vmnewstudentmodal.$log.debug('modalInstance ui failed to open, reason : ', error);
      }
    );

    vmnewstudentmodal.modalInstance.result.then(function(thisstudent) {
      vmnewstudentmodal.$log.debug('search modalInstance result thisstudent:', thisstudent);
      vmnewstudentmodal.thisstudent = thisstudent;
    }, function() {
      //todo: shoudl we get the student
      vmnewstudentmodal.$log.info('Modal dismissed at: ' + new Date());
    });

  }
   cancel() {
      this.$scope.$parent.$uibModalInstance.dismiss('cancel');
   }

}
