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
    vmnew.$log.debug('modal ModalNewPayerInstanceController entered');
    vmnew.$log.debug(vmnew);

    vmnew.thisPayer = '';
    vmnew.message = '';
  }
  $onDestroy() {
    this.$log.debug("ModalNewPayerInstanceController dismissed");
    this.$log.debugEnabled(false);
  }


  submit() {
    var self = this;
    self.$log.debug('hit submit');
    self.createPayer().then(function() {
      self.$log.debug('createPayer ready to close', self.thisPayer);
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
    self.$log.debug('about createPayer ', self);
    var path = "../v1/payer";
    var thedata = {
      payerName: self.payerName
    };
    return self.PaymentServices.createPayer(path, thedata)
      .then(function(data) {
        self.$log.debug('createPayer returned data');
        self.$log.debug(data);
        self.thisPayer = data;
        self.$log.debug(self.thisPayer);
        self.$log.debug(self.thisPayer.message);
        self.message = self.thisPayer.message;
        self.Notification.success({ message: self.message, delay: 5000 });
        return self.thisPayer;
      }).catch(function(e) {
        self.$log.debug('createPayer failure:');
        self.$log.debug("error", e);
        self.message = e;
        self.Notification.error({ message: e, delay: 5000 });
        throw e;
      });
  }

}
