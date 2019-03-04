export class PaymentViewInstanceController {
  constructor(
    $log, $window,
    $scope, StudentServices, Notification, $q, $uibModal, $filter, portalDataService, UserServices

  ) {
    'ngInject';
    this.$log = $log;
    this.StudentServices = StudentServices;
    this.$window = $window;
    this.$scope = $scope;
    this.$q = $q;
    this.$uibModal = $uibModal;
    this.$filter = $filter;
    this.Notification = Notification;
    this.selectedRow = $scope.$parent.$resolve.selectedRow;
    this.portalDataService = portalDataService;
        this.UserServices = UserServices;

  }
  $onDestroy() {
    this.$log.log("PaymentViewInstanceController dismissed");
    //this.$log.logEnabled(false);
  }

  $onInit() {
    var vm = this;

    vm.$log.log('selectedRow', vm.selectedRow);
    vm.thisInvoice = {};
    vm.$scope.selectedRow = vm.selectedRow;
    vm.activate;
  }
  activate() {
    var vm = this;
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('PaymentViewInstanceController',vm.UserServices.isDebugEnabled());
        }
    vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
      vm.$log.log("PaymentViewInstanceController started");

    });

//    vm.portalDataService.Portlet('paymentview.controller.js');

  }

  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }

  email() {
    var vm = this;
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
      mc_currency: vm.selectedRow.mc_currency,
      item_name1: vm.selectedRow.item_name1,
      mc_gross_1: vm.selectedRow.mc_gross_1,
      quantity1: vm.selectedRow.quantity1,
      item_name2: vm.selectedRow.item_name2,
      mc_gross_2: vm.selectedRow.mc_gross_2,
      quantity2: vm.selectedRow.quantity2,
      item_name3: vm.selectedRow.item_name3,
      mc_gross_3: vm.selectedRow.mc_gross_3,
      quantity3: vm.selectedRow.quantity3,
      item_name4: vm.selectedRow.item_name4,
      mc_gross_4: vm.selectedRow.mc_gross_4,
      quantity4: vm.selectedRow.quantity4,
      item_name5: vm.selectedRow.item_name5,
      mc_gross_5: vm.selectedRow.mc_gross_5,
      quantity5: vm.selectedRow.quantity5,
      payment_gross: vm.selectedRow.payment_gross
    };

    vm.$log.log('about emailInvoice ', thedata, updpath, 'Add');
    return vm.StudentServices.emailInvoice(updpath, thedata)
      .then(function(data) {
        vm.$log.log('emailInvoice returned data');
        vm.$log.log(data);
        vm.thisInvoice = data;
        vm.$log.log(vm.thisInvoice);
        vm.$log.log(vm.thisInvoice.message);
        vm.message = vm.thisInvoice.message;
        if ((typeof vm.thisInvoice === 'undefined' || vm.thisInvoice.error === true) &&
          typeof data !== 'undefined') {
          vm.Notification.error({ message: vm.message, delay: 5000 });
          return (vm.$q.reject(data));
        }
        else {
          vm.Notification.success({ message: vm.message, delay: 5000 });
        }

        return vm.thisInvoice;
      }).catch(function(e) {
        vm.$log.log('email failure:');
        vm.$log.log("error", e);
        vm.message = e;
        vm.Notification.error({ message: e, delay: 5000 });
        throw e;
      });


  }

}
