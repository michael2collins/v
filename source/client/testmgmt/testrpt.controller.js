export class ModalTestRptInstanceController {
  constructor(
    $log, TestingServices, $window, Notification, uiGridConstants, $scope, UserServices
  ) {
    'ngInject';

    this.$log = $log;
    this.TestingServices = TestingServices;
    this.$window = $window;
    this.Notification = Notification;
    this.uiGridConstants = uiGridConstants;
    this.$scope = $scope;
        this.UserServices = UserServices;

  }
  $onInit() {
    var vm = this;

        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('ModalTestRptInstanceController',vm.UserServices.isDebugEnabled());
        }

    vm.rptLayout = vm.TestingServices.getRptLayout();
    vm.path = '../v1/' + vm.rptLayout;
    vm.message = '';
    vm.rptgridOptionsnew = vm.TestingServices.getGrid();
    vm.rptgridApi = vm.TestingServices.getGridApi();
    vm.testDate = vm.TestingServices.getTestDate();
    vm.testTime = vm.TestingServices.getTestTime();

    vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
      vm.$log.log("ModalTestRptInstanceController started");

    });
    vm.$scope.$on('$destroy', function iVeBeenDismissed() {
      vm.$log.log("ModalTestRptInstanceController dismissed");
    //  vm.$log.logEnabled(false);
    });


    vm.rptgridOptionsnew.onRegisterApi = function(gridApi) {
      vm.rptgridApi = gridApi;

    };
  }
  printAll() {
    var vm = this;
    vm.$log.log('hit print');
    vm.$log.log('ModalTestRptInstanceController ready to close');
    vm.rptgridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.COLUMN);
    vm.rptgridApi.grid.api.exporter.pdfExport('visible', 'visible');
  }

  printSelected() {
    var vm = this;
    vm.$log.log('hit print sel');
    vm.$log.log('ModalTestRptInstanceController ready to close');
    vm.rptgridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.COLUMN);
    vm.rptgridApi.grid.api.exporter.pdfExport('selected', 'visible');
  }

  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }


}
