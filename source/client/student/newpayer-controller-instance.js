(function (window, angular) {
  'use strict';

  angular
    .module('ng-admin.student')
    .controller('ModalNewPayerInstanceController', ModalNewPayerInstanceController);


  ModalNewPayerInstanceController.$inject = [
      '$log',
      '$uibModalInstance',
      'PaymentServices',
      '$window',
      'Notification'
    ];


  function ModalNewPayerInstanceController( $log, $uibModalInstance, PaymentServices, $window, Notification) {
    /* jshint validthis: true */
    var vmnew = this;
    $log.debug('modal newPayer entered');
    $log.debug(vmnew);

    vmnew.submit = submit;
    vmnew.cancel = cancel;
    vmnew.thisPayer = '';
    vmnew.message = '';


    function submit() {
      $log.debug('hit submit');
      createPayer().then(function(){
          $log.debug('createPayer ready to close', vmnew.thisPayer);
          $uibModalInstance.close(vmnew.thisPayer);
      }).catch(function(e){
         // alert("try again", e);
      });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function createPayer() {
            $log.debug('about createPayer ', vmnew);
            var path = "../v1/payer";
            var thedata = {
              payerName: vmnew.payerName
            };
            return PaymentServices.createPayer(path, thedata)
                .then(function(data){
                    $log.debug('createPayer returned data');
                    $log.debug(data);
                    vmnew.thisPayer = data;
                    $log.debug(vmnew.thisPayer);
                    $log.debug(vmnew.thisPayer.message);
                    vmnew.message = vmnew.thisPayer.message;
                    Notification.success({message: vmnew.message, delay: 5000});
                    return vmnew.thisPayer;
                }).catch(function(e) {
                    $log.debug('createPayer failure:');
                    $log.debug("error", e);
                    vmnew.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
    }

  }
 
})(window,window.angular);
