export class PrintStudentController {
  constructor(
    $log, $uibModal, $location, $scope, $window
  ) {
    'ngInject';
    this.$log = $log;
    this.$uibModal = $uibModal;
    this.$location = $location;
    this.$scope = $scope;
    this.alldata = $scope.$parent.$resolve.alldata;
      this.disenable = $scope.$parent.$resolve.disenable;
      this.$window = $window

  }

  $onInit() {

    var vm = this;

    vm.animationsEnabled = true;

    vm.modalInstance = undefined;
    vm.$log.log('PrintStudentController entered ');

  }
  $onDestroy() {
    this.$log.log("PrintStudentController dismissed");
    //this.$log.logEnabled(false);
  }

   printcancel() {
      this.$scope.$parent.$uibModalInstance.dismiss('cancel');
   }


}
