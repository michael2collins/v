(function(window, angular) {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalTestRptInstanceController', ModalTestRptInstanceController);

  ModalTestRptInstanceController.$inject = [
    '$log',
    '$uibModalInstance',
    'TestingServices',
    '$window',
    'Notification',
    'uiGridConstants',
    '$scope'
  ];

  function ModalTestRptInstanceController($log, $uibModalInstance, TestingServices, $window, Notification, uiGridConstants, $scope) {
    /* jshint validthis: true */
    var vm = this;

    vm.rptLayout = TestingServices.getRptLayout();
    vm.path = '../v1/' + vm.rptLayout;
    vm.printAll = printAll;
    vm.printSelected = printSelected;
    vm.cancel = cancel;
    vm.message = '';
    vm.rptgridOptionsnew = TestingServices.getGrid();
    vm.rptgridApi = TestingServices.getGridApi();
    vm.testDate = TestingServices.getTestDate();
    vm.testTime = TestingServices.getTestTime();

    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $log.debugEnabled(true);
      $log.debug("ModalTestRptInstanceController started");

    });
    $scope.$on('$destroy', function iVeBeenDismissed() {
      $log.debug("ModalTestRptInstanceController dismissed");
      $log.debugEnabled(false);
    });


    vm.rptgridOptionsnew.onRegisterApi = function(gridApi) {
      vm.rptgridApi = gridApi;

    };

    function printAll() {
      $log.debug('hit print');
      $log.debug('ModalTestRptInstanceController ready to close');
      vm.rptgridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
      vm.rptgridApi.grid.api.exporter.pdfExport('visible', 'visible');
    }

    function printSelected() {
      $log.debug('hit print sel');
      $log.debug('ModalTestRptInstanceController ready to close');
      vm.rptgridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
      vm.rptgridApi.grid.api.exporter.pdfExport('selected', 'visible');
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }


})(window, window.angular);
