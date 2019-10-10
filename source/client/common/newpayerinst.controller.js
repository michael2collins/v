export class ModalNewPayerInstanceController {
  constructor(
    $log, PaymentServices, $window, Notification, $scope
  ) {
    'ngInject';

    this.$log = $log;
    this.PaymentServices = PaymentServices;
    this.$window = $window;
    this.Notification = Notification;
    this.$scope = $scope;
  }

  $onInit() {
    var vmnew = this;
    vmnew.$log.log('modal ModalNewPayerInstanceController entered');
    vmnew.$log.log(vmnew);

    vmnew.thisPayer = '';
    vmnew.message = '';
  }
  $onDestroy() {
    this.$log.log("ModalNewPayerInstanceController dismissed");
    //this.$log.logEnabled(false);
  }


  submit() {
    var self = this;
    self.$log.log('hit submit');
    self.createPayer().then(function() {
      self.$log.log('createPayer ready to close', self.thisPayer);
      self.$scope.$parent.$uibModalInstance.close(self.thisPayer);
    }).catch(function(e) {
      // alert("try again", e);
    });
  }

  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }

  createPayer() {
    var self = this;
    self.$log.log('about createPayer ', self);
    var path = "../v1/payer";
    var thedata = {
      payerName: self.payerName,
      payerEmail: self.payerEmail,
      createInvoice: self.createInvoice
    };
    return self.PaymentServices.createPayer(path, thedata)
      .then(function(data) {
        self.$log.log('createPayer returned data');
        self.$log.log(data);
        self.thisPayer = data;
        self.$log.log(self.thisPayer);
        self.$log.log(self.thisPayer.message);
        self.message = self.thisPayer.message;
        self.Notification.success({ message: self.message, delay: 5000 });
        return self.thisPayer;
      }).catch(function(e) {
        self.$log.log('createPayer failure:');
        self.$log.log("error", e);
        self.message = e;
        self.Notification.error({ message: e, delay: 5000 });
        throw e;
      });
  }

}
