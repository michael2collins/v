export class ModalTestRptInstanceController {
  constructor(
    $log, TestingServices, $window, Notification, uiGridConstants, $scope
  ) {
    'ngInject';
    console.log('entering ModalTestRptInstanceController controller');

    this.$log = $log;
    this.TestingServices = TestingServices;
    this.$window = $window;
    this.Notification = Notification;
    this.uiGridConstants = uiGridConstants;
    this.$scope = $scope;

  }
  $onInit() {
    var vm = this;

    vm.rptLayout = vm.TestingServices.getRptLayout();
    vm.path = '../v1/' + vm.rptLayout;
    vm.message = '';
    vm.rptgridOptionsnew = vm.TestingServices.getGrid();
    vm.rptgridApi = vm.TestingServices.getGridApi();
    vm.testDate = vm.TestingServices.getTestDate();
    vm.testTime = vm.TestingServices.getTestTime();

    vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      vm.$log.debugEnabled(true);
      vm.$log.debug("ModalTestRptInstanceController started");

    });
    vm.$scope.$on('$destroy', function iVeBeenDismissed() {
      vm.$log.debug("ModalTestRptInstanceController dismissed");
      vm.$log.debugEnabled(false);
    });


    vm.rptgridOptionsnew.onRegisterApi = function(gridApi) {
      vm.rptgridApi = gridApi;

    };
  }
  printAll() {
    var vm = this;
    vm.$log.debug('hit print');
    vm.$log.debug('ModalTestRptInstanceController ready to close');
    vm.rptgridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.COLUMN);
    vm.rptgridApi.grid.api.exporter.pdfExport('visible', 'visible');
  }

  printSelected() {
    var vm = this;
    vm.$log.debug('hit print sel');
    vm.$log.debug('ModalTestRptInstanceController ready to close');
    vm.rptgridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.COLUMN);
    vm.rptgridApi.grid.api.exporter.pdfExport('selected', 'visible');
  }

  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }


}
