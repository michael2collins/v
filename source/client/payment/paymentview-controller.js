(function(window, angular, $) {
  'use strict';


  angular
    .module('ng-admin.payment')
    .controller('PaymentViewInstanceController', PaymentViewInstanceController);

  PaymentViewInstanceController.$inject = [
    '$log',
    '$uibModalInstance',
    '$window',
    '$scope',
    'StudentServices',
    'Notification',
    '$q',
    '$uibModal',
    'selectedRow',
    '$filter'
  ];



  function PaymentViewInstanceController($log, $uibModalInstance, $window,
    $scope, StudentServices, Notification, $q, $uibModal, selectedRow, $filter) {
    /* jshint validthis: true */
    $log.debug('selectedRow', selectedRow);
    var vm = this;
    vm.cancel = cancel;
    vm.email = email;
    vm.selectedRow = selectedRow;
    vm.thisInvoice = {};
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

    function email() {
      var updpath = "../v1/paymentemail";

      var thedata = {
        amt: vm.selectedRow.inv_amt,
        invdate: vm.selectedRow.invdate,
        paymentdate: vm.selectedRow.npdate,
        invstatus: vm.selectedRow.inv_status,
        paymentstatus: vm.selectedRow.npstatus,
        paymentid: vm.selectedRow.paymentid,
        invoice: vm.selectedRow.invoice,
        updatetype: 'EmailPaid',
        payerEmail: vm.selectedRow.payer_email,
        payerid: vm.selectedRow.payerid,
        payerfirstname: vm.selectedRow.npfirst_name,
        payerlastname: vm.selectedRow.nplast_name,
        txn_id: vm.selectedRow.txn_id,
        ipn_track_id: vm.selectedRow.ipn_track_id,
        num_cart_items: vm.selectedRow.num_cart_items,
        shipping: 0,
        nptype: vm.selectedRow.nptype,
      	mc_currency : vm.selectedRow.mc_currency,
      	item_name1  : vm.selectedRow.item_name1,
        mc_gross_1  : vm.selectedRow.mc_gross_1,
        quantity1   : vm.selectedRow.quantity1,
        item_name2	: vm.selectedRow.item_name2,
        mc_gross_2	: vm.selectedRow.mc_gross_2,
        quantity2	  : vm.selectedRow.quantity2,
        item_name3	: vm.selectedRow.item_name3,
        mc_gross_3	: vm.selectedRow.mc_gross_3,
        quantity3	  : vm.selectedRow.quantity3,
        item_name4	: vm.selectedRow.item_name4,
        mc_gross_4	: vm.selectedRow.mc_gross_4,
        quantity4	  : vm.selectedRow.quantity4,
        item_name5	: vm.selectedRow.item_name5,
        mc_gross_5	: vm.selectedRow.mc_gross_5,
        quantity5   : vm.selectedRow.quantity5,
        payment_gross: vm.selectedRow.payment_gross
      };

      $log.debug('about emailInvoice ', thedata, updpath, 'Add');
      return StudentServices.emailInvoice(updpath, thedata)
        .then(function(data) {
          $log.debug('emailInvoice returned data');
          $log.debug(data);
          vm.thisInvoice = data;
          $log.debug(vm.thisInvoice);
          $log.debug(vm.thisInvoice.message);
          vm.message = vm.thisInvoice.message;
          if ((typeof vm.thisInvoice === 'undefined' || vm.thisInvoice.error === true) &&
            typeof data !== 'undefined') {
            Notification.error({ message: vm.message, delay: 5000 });
            return($q.reject(data));
          }
          else {
            Notification.success({ message: vm.message, delay: 5000 });
          }

          return vm.thisInvoice;
        }).catch(function(e) {
          $log.debug('email failure:');
          $log.debug("error", e);
          vm.message = e;
          Notification.error({ message: e, delay: 5000 });
          throw e;
        });


    }

  }


})(window, window.angular, window.$);
