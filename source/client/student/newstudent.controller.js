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
    vmnewstudentmodal.$log.log('ModalNewStudentController entered ');

  }
  $onDestroy() {
    this.$log.log("ModalNewStudentController dismissed");
    //this.$log.logEnabled(false);
  }

  openmodal() {
    var vmnewstudentmodal = this;

    vmnewstudentmodal.modalInstance = vmnewstudentmodal.$uibModal.open({
      animation: vmnewstudentmodal.animationsEnabled,
      component: 'newstudentinstComponent',
      size: 'md',
      resolve: {
        classname: function() {
          vmnewstudentmodal.$log.log('return from open');
          return vmnewstudentmodal.thisstudent;
        }
      }
    });

    vmnewstudentmodal.modalInstance.opened.then(
      function(success) {
        vmnewstudentmodal.$log.log('modalInstance ui opened:', success);

      },
      function(error) {
        vmnewstudentmodal.$log.log('modalInstance ui failed to open, reason : ', error);
      }
    );

    vmnewstudentmodal.modalInstance.result.then(function(thisstudent) {
      vmnewstudentmodal.$log.log('search modalInstance result thisstudent:', thisstudent);
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
