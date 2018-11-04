export class ModalEmailViewInstanceController {
  constructor(
    $log, studentServices, $window, Notification,
    $scope, util, $q, $sce, moment, $uibModal
  ) {
    'ngInject';
    console.log('entering ModalEmailViewInstanceController controller');

    this.$log = $log;
    this.$sce = $sce;
    this.StudentServices = studentServices;
    this.$window = $window;
    this.Notification = Notification;
    this.$scope = $scope;
    this.$q = $q;
    this.moment = moment;
    this.Util = util;
    this.$uibModal = $uibModal;
    this.item = $scope.$parent.$resolve.item;

  }
  $onInit() {

    this.data = this.item;
    this.thisEmailView = [];
    this.init();
    this.getEmailView(this.item);
    //    $.fn.Data.Portlet('emailview-controller.js');

  }
  init() {
    var self=this;
    this.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      var vm = event.currentScope.$ctrl;
      vm.$log.debugEnabled(true);
      vm.$log.debug("ModalEmailViewInstanceController started");

    });
    this.$scope.$on('$destroy', function iVeBeenDismissed() {
      self.$log.debug("ModalEmailViewInstanceController dismissed");
      self.$log.debugEnabled(false);
    });

    
  }
  getEmailView(item) {
    var vm = this;
    vm.$log.debug('getEmailView entered');
    var input = item.id;
    return vm.StudentServices.getEmailViews(input).then(function(data) {
      vm.$log.debug('getEmailViews returned data');
      vm.$log.debug(data);
      var testdate;

      vm.message = data.message;
      if ((typeof data === 'undefined' || data.error === true) &&
        typeof data !== 'undefined') {
        vm.Notification.error({ message: vm.message, delay: 5000 });
        return (vm.$q.reject(data));
      }
      else {
        vm.Notification.success({ message: vm.message, delay: 5000 });
        vm.data = data.EmailView[0];
        vm.data.body = vm.$sce.trustAsHtml(data.EmailView[0].body);

        testdate = vm.Util.datecheckconvert(vm.data.emaildate);

        if (!vm.moment(testdate || vm.moment()).isBefore(vm.moment().subtract(1, 'days').endOf('day'))) {
          // They are on the same day
          vm.data.datef = vm.moment(testdate || vm.moment()).format("HH:mm");
        }
        else {
          // They are not on the same day
          vm.data.datef = vm.moment(testdate || vm.moment()).format("MMM DD, YYYY");
        }
      }
      return vm.data;
    }, function(error) {
      vm.$log.debug('Caught an error getEmailViews:', error);
      vm.data = [];
      vm.message = error;
      vm.Notification.error({ message: error, delay: 5000 });
      return (vm.$q.reject(error));

    });
  }

  removeEmailView(input) {
    var vm = this;
    vm.$log.debug('removeEmailView entered', input);
    var path = "../v1/emailview";
    var thedata = {
      id: input.id
    };
    var data = {};
    data.EmailViewExistsList = {};

    //check nclasspays, nclasspgm, studentregistration, testcandidates
    return vm.StudentServices.removeEmailView(thedata, path)
      .then(function(data) {
        vm.$log.debug('removeEmailView returned data');
        vm.$log.debug(data);
        vm.message = data.message;
        if ((typeof data === 'undefined' || data.error === true) &&
          typeof data !== 'undefined') {
          vm.Notification.error({ message: vm.message, delay: 5000 });
          vm.EmailViewFKExists = data.EmailViewExistsList;
          return (vm.$q.reject(data));
        }
        else {
          vm.Notification.success({ message: vm.message, delay: 5000 });
        }

        vm.getEmailView().then(function(zdata) {
            vm.$log.debug('getEmailView returned', zdata);
          },
          function(error) {
            vm.$log.debug('Caught an error getEmailView after remove:', error);
            vm.thisEmailView = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));
          });
        return data;
      }).catch(function(e) {
        vm.$log.debug('removeEmailView failure:');
        vm.$log.debug("error", e);
        vm.Notification.error({ message: e, delay: 5000 });
        throw e;
      });

  }

  updateEmailView(input) {
    var vm = this;
    var updpath = "../v1/emailview";

    var thedata = {
      id: input.id,
      status: input.status
    };

    vm.$log.debug('about updateEmailView ', thedata, updpath);
    return vm.StudentServices.updateEmailView(updpath, thedata)
      .then(function(data) {
        vm.$log.debug('updateEmailView returned data');
        vm.$log.debug(data);
        vm.thisEmailView = data;
        vm.$log.debug(vm.thisEmailView);
        vm.$log.debug(vm.thisEmailView.message);
        vm.message = vm.thisEmailView.message;
        if ((typeof vm.thisEmailView === 'undefined' || vm.thisEmailView.error === true) &&
          typeof data !== 'undefined') {
          vm.Notification.error({ message: vm.message, delay: 5000 });
          return (vm.$q.reject(data));
        }
        else {
          vm.getEmailView(vm.data).then(function(zdata) {
              vm.$log.debug('getEmailView returned', zdata);
            },
            function(error) {
              vm.$log.debug('Caught an error getEmailView after remove:', error);
              vm.thisEmailView = [];
              vm.message = error;
              vm.Notification.error({ message: error, delay: 5000 });
              return (vm.$q.reject(error));
            });
        }


        return vm.thisEmailView;
      }).catch(function(e) {
        vm.$log.debug('updateEmailView failure:');
        vm.$log.debug("error", e);
        vm.message = e;
        vm.Notification.error({ message: e, delay: 5000 });
        throw e;
      });
  }

  eforward() {
    this.$log.debug("eforward entered");
    this.newEmail('forward');
  }
  ereply() {
    this.$log.debug("ereply entered");
    this.newEmail('reply');

  }

  newEmail(newtype) {
    var emailModal = this;
    emailModal.data.emailtype = newtype;

    emailModal.animationsEnabled = true;

    emailModal.modalInstance = undefined;
    emailModal.retvlu = '';
    var modalScope = emailModal.$scope.$new();

    emailModal.modalInstance = emailModal.$uibModal.open({
      animation: emailModal.animationsEnabled,
      //      template: './email.html',
      //      controller: 'ModalEmailInstanceController as vm',
      component: 'emailComponent',
      size: 'md',
//      scope: emailModal.$scope,
      windowClass: 'my-modal-popup',
      resolve: {
        myinitial: function() { return emailModal.data },
        contactform: function() {
          //    $scope.contactform.emailpick = vm.data.from;
          return emailModal.$scope.form.read;
        }
      }
    });
    modalScope.modalInstance = emailModal.modalInstance;

    emailModal.modalInstance.result.then(function(retvlu) {
      emailModal.$log.debug('search modalInstance result :', retvlu);
      emailModal.retvlu = retvlu;
    }, function() {
      emailModal.$log.info('Modal dismissed at: ' + new Date());
    });

  }

  markRead() {
    this.$log.debug("markRead entered");
    this.data.status = "read";
    this.updateEmailView(this.data);

  }
  markUnread() {
    this.$log.debug("markUnread entered");
    this.data.status = "new";
    this.updateEmailView(this.data);

  }
  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }

}
