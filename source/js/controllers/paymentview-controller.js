(function(window, angular, $) {
  'use strict';


  angular
    .module('ng-admin')
    .controller('PaymentViewInstanceController', PaymentViewInstanceController);

  PaymentViewInstanceController.$inject = [
    '$log',
    '$uibModalInstance',
    '$window',
    '$scope',
    '$uibModal',
    'selectedRow',
    '$filter'
  ];



  function PaymentViewInstanceController($log, $uibModalInstance, $window, 
    $scope, $uibModal, selectedRow, $filter) {
    /* jshint validthis: true */
    $log.debug('selectedRow', selectedRow);
    var vm = this;
    vm.cancel = cancel;
    vm.selectedRow = selectedRow;
    $scope.selectedRow = selectedRow;
    
    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $log.debugEnabled(true);
      $log.debug("PaymentViewInstanceController started");

    });
    $scope.$on('$destroy', function iVeBeenDismissed() {
      $log.debug("PaymentViewInstanceController dismissed");
      $log.debugEnabled(false);
    });

    $.fn.Data.Portlet('paymentview-controller.js');

 
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }


})(window, window.angular, window.$);
