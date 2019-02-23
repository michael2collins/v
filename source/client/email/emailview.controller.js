export class ModalEmailViewInstanceController {
  constructor(
    $log, studentServices, $window, Notification,
    $scope, util, $q, $sce, moment, $uibModal, UserServices
  ) {
    'ngInject';

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
        this.UserServices = UserServices;

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
    var vm=this;
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('ModalEmailViewInstanceController',vm.UserServices.isDebugEnabled());
        }

    this.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      var vm = event.currentScope.$ctrl;
      //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
      vm.$log.log("ModalEmailViewInstanceController started");

    });
    this.$scope.$on('$destroy', function iVeBeenDismissed() {
      self.$log.log("ModalEmailViewInstanceController dismissed");
      //self.$log.logEnabled(false);
    });

    
  }
  getEmailView(item) {
    var vm = this;
    vm.$log.log('getEmailView entered');
    var input = item.id;
    return vm.StudentServices.getEmailViews(input).then(function(data) {
      vm.$log.log('getEmailViews returned data');
      vm.$log.log(data);
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
      vm.$log.log('Caught an error getEmailViews:', error);
      vm.data = [];
      vm.message = error;
      vm.Notification.error({ message: error, delay: 5000 });
      return (vm.$q.reject(error));

    });
  }

  removeEmailView(input) {
    var vm = this;
    vm.$log.log('removeEmailView entered', input);
    var path = "../v1/emailview";
    var thedata = {
      id: input.id
    };
    var data = {};
    data.EmailViewExistsList = {};

    //check nclasspays, nclasspgm, studentregistration, testcandidates
    return vm.StudentServices.removeEmailView(thedata, path)
      .then(function(data) {
        vm.$log.log('removeEmailView returned data');
        vm.$log.log(data);
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
            vm.$log.log('getEmailView returned', zdata);
          },
          function(error) {
            vm.$log.log('Caught an error getEmailView after remove:', error);
            vm.thisEmailView = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));
          });
        return data;
      }).catch(function(e) {
        vm.$log.log('removeEmailView failure:');
        vm.$log.log("error", e);
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

    vm.$log.log('about updateEmailView ', thedata, updpath);
    return vm.StudentServices.updateEmailView(updpath, thedata)
      .then(function(data) {
        vm.$log.log('updateEmailView returned data');
        vm.$log.log(data);
        vm.thisEmailView = data;
        vm.$log.log(vm.thisEmailView);
        vm.$log.log(vm.thisEmailView.message);
        vm.message = vm.thisEmailView.message;
        if ((typeof vm.thisEmailView === 'undefined' || vm.thisEmailView.error === true) &&
          typeof data !== 'undefined') {
          vm.Notification.error({ message: vm.message, delay: 5000 });
          return (vm.$q.reject(data));
        }
        else {
          vm.getEmailView(vm.data).then(function(zdata) {
              vm.$log.log('getEmailView returned', zdata);
            },
            function(error) {
              vm.$log.log('Caught an error getEmailView after remove:', error);
              vm.thisEmailView = [];
              vm.message = error;
              vm.Notification.error({ message: error, delay: 5000 });
              return (vm.$q.reject(error));
            });
        }


        return vm.thisEmailView;
      }).catch(function(e) {
        vm.$log.log('updateEmailView failure:');
        vm.$log.log("error", e);
        vm.message = e;
        vm.Notification.error({ message: e, delay: 5000 });
        throw e;
      });
  }

  eforward() {
    this.$log.log("eforward entered");
    this.newEmail('forward');
  }
  ereply() {
    this.$log.log("ereply entered");
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
      emailModal.$log.log('search modalInstance result :', retvlu);
      emailModal.retvlu = retvlu;
    }, function() {
      emailModal.$log.info('Modal dismissed at: ' + new Date());
    });

  }

  markRead() {
    this.$log.log("markRead entered");
    this.data.status = "read";
    this.updateEmailView(this.data);

  }
  markUnread() {
    this.$log.log("markUnread entered");
    this.data.status = "new";
    this.updateEmailView(this.data);

  }
  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }

}
