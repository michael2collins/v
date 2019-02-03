export class ModalUserSettingsInstanceController {
  constructor($log,
    userServices,
    Notification, portalDataService,
    $scope, util, $q, $sce, moment, $uibModal, Idle, Title) {
    'ngInject';
    console.log('entering usersettings controller');

    this.$log = $log;
    this.$uibModal = $uibModal;
    this.UserServices = userServices;
    this.portalDataService = portalDataService;
    this.Notification = Notification;
    this.$q = $q;
    this.$scope = $scope;
    this.Idle = Idle;
    this.Title = Title;
    this.$sce = $sce;
    this.moment = moment;
    this.Util = util;
  }
  $onInit() {
    console.log("initializing usersettings...");
    this.userOptions = {};
    this.okoptions = [true, false];
    this.debugoptions = ["On", "Off"];
    this.okNotify = true;
    this.debugOn = "Off";
    this.mydelay = 10;
    this.init();
    
    this.portalDataService.Portlet('header.controller.js');
  }
  $onDestroy() {
    this.$log.debug("app dismissed");
    this.$log.debugEnabled(false);
  };

  init() {
    var vm=this;
    vm.getUserOptions();
    
    vm.$scope.$watch('idle', function(value) {
      if (Boolean(value)) vm.Idle.setIdle(value);
    });
    vm.$scope.$watch('timeout', function(value) {
      if (Boolean(value)) vm.Idle.setTimeout(value);
    });
    vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      var vm = event.currentScope.$ctrl;
      vm.$log.debugEnabled(true);
      vm.$log.debug('routechange in app for success');

      vm.$log.debugEnabled(true);
      vm.$log.debug("ModalUserSettingsInstanceController started");

    });    
  }
  getUserOptions() {
    var vm=this;
    vm.$log.debug('getUserOptions entered');
    var path = "../v1/useroptions";
    return vm.UserServices.getUserOptions(path).then(function(data) {
        vm.$log.debug("usersettings controller service getUserOptions returned:", data);
        if ((typeof data.options === 'undefined' || data.options.error === true) &&
          typeof data !== 'undefined') {
          var themsg = {
            message: data.message + ': ' +
              (typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
            delay: 5000
          };
          vm.Notification.error(themsg);
          return (vm.$q.reject(data));
        }
        else {
          try {
            vm.userOptions = JSON.parse(data.options);
            vm.okNotify = (vm.userOptions.notify ? vm.userOptions.notify : false);
            vm.debugOn = (vm.userOptions.debug ? vm.userOptions.debug : "Off");
            vm.mydelay = (vm.userOptions.delay ? vm.userOptions.delay : 30);
            vm.idle = (vm.userOptions.idle ? vm.userOptions.idle : 20 * 60);
            vm.timeout = (vm.userOptions.timeout ? vm.userOptions.timeout : 5 * 60);
            vm.Title.setAsIdle(vm.idle);
            vm.Idle.setIdle(vm.idle);
            vm.Idle.setTimeout(vm.timeout);
            //reset the timer
            vm.Idle.watch();

          }
          catch (e) {
            vm.$log.debug(e instanceof SyntaxError); // true
            vm.$log.debug(e.message); // "missing ; before statement"
            vm.$log.debug(e.name); // "SyntaxError"
            vm.$log.debug(e.fileName); // "Scratchpad/1"
            vm.$log.debug(e.lineNumber); // 1
            vm.$log.debug(e.columnNumber); // 4
            vm.$log.debug(e.stack); // "@Scratchpad/1:2:3\n"
            vm.Notification.error(e.message);
            return (vm.$q.reject(data));
          }

        }

        return vm.userOptions;
      },

      function(error) {
        vm.$log.debug('Caught an error getUserOptions, going to notify:', error);
        vm.userOptions = [];
        vm.message = error;
        vm.Notification.error({ message: error, delay: 5000 });
        return (vm.$q.reject(error));
      }).
    finally(function() {});

  }

  setUserOptions() {
    var vm=this;
    var updpath = "../v1/useroptions";
    var thedata = {
      "options": {
        "delay": vm.mydelay,
        "notify": vm.okNotify,
        "idle": vm.idle,
        "timeout": vm.timeout,
        "debug": vm.debugOn
      }
    };
    vm.$log.debug('about setUserOptions ', thedata, updpath);
    return vm.UserServices.setUserOptions(updpath, thedata)
      .then(function(data) {
        vm.$log.debug('setUserOptions returned data');
        vm.$log.debug(data);
        if ((typeof data.message === 'undefined' || data.error === true) &&
          typeof data !== 'undefined') {
          var themsg = {
            message: data.message + ': ' +
              (typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
            delay: 5000
          };
          vm.Notification.error(themsg);
          return (vm.$q.reject(data));
        }
        else {
          vm.Notification.success({ message: data.message, delay: 5000 });
          vm.getUserOptions();
        }

        return data;
      }).catch(function(e) {
        vm.$log.debug('setUserOptions failure:');
        vm.$log.debug("error", e);
        vm.message = e;
        vm.Notification.error({ message: e, delay: 5000 });
        throw e;
      });
  }

  cancel() {
    this.$scope.$parent.modalInstance.dismiss('cancel');    
  }

}
