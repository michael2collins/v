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
    this.okNotify = true;
    this.mydelay = 10;
    this.init();
    
    this.portalDataService.Portlet('header.controller.js');
  }
  $onDestroy() {
    this.$log.debug("app dismissed");
    this.$log.debugEnabled(false);
  };

  init() {
    var self=this;
    self.getUserOptions();
    
    self.$scope.$watch('idle', function(value) {
      if (Boolean(value)) self.Idle.setIdle(value);
    });
    self.$scope.$watch('timeout', function(value) {
      if (Boolean(value)) self.Idle.setTimeout(value);
    });
    self.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      var vm = event.currentScope.$ctrl;
      vm.$log.debugEnabled(true);
      vm.$log.debug('routechange in app for success');

      vm.$log.debugEnabled(true);
      vm.$log.debug("ModalUserSettingsInstanceController started");

    });    
  }
  getUserOptions() {
    var self=this;
    self.$log.debug('getUserOptions entered');
    var path = "../v1/useroptions";
    return self.UserServices.getUserOptions(path).then(function(data) {
        self.$log.debug("usersettings controller service getUserOptions returned:", data);
        if ((typeof data.options === 'undefined' || data.options.error === true) &&
          typeof data !== 'undefined') {
          var themsg = {
            message: data.message + ': ' +
              (typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
            delay: 5000
          };
          self.Notification.error(themsg);
          return (self.$q.reject(data));
        }
        else {
          try {
            self.userOptions = JSON.parse(data.options);
            self.okNotify = (self.userOptions.notify ? self.userOptions.notify : false);
            self.mydelay = (self.userOptions.delay ? self.userOptions.delay : 30);
            self.idle = (self.userOptions.idle ? self.userOptions.idle : 20 * 60);
            self.timeout = (self.userOptions.timeout ? self.userOptions.timeout : 5 * 60);
            self.Title.setAsIdle(self.idle);
            self.Idle.setIdle(self.idle);
            self.Idle.setTimeout(self.timeout);
            //reset the timer
            self.Idle.watch();

            //self.Notification.success({message: self.message, delay: 5000});
          }
          catch (e) {
            self.$log.debug(e instanceof SyntaxError); // true
            self.$log.debug(e.message); // "missing ; before statement"
            self.$log.debug(e.name); // "SyntaxError"
            self.$log.debug(e.fileName); // "Scratchpad/1"
            self.$log.debug(e.lineNumber); // 1
            self.$log.debug(e.columnNumber); // 4
            self.$log.debug(e.stack); // "@Scratchpad/1:2:3\n"
            self.Notification.error(e.message);
            return (self.$q.reject(data));
          }

        }

        return self.userOptions;
      },

      function(error) {
        self.$log.debug('Caught an error getUserOptions, going to notify:', error);
        self.userOptions = [];
        self.message = error;
        self.Notification.error({ message: error, delay: 5000 });
        return (self.$q.reject(error));
      }).
    finally(function() {});

  }

  setUserOptions() {
    var self=this;
    var updpath = "../v1/useroptions";
    var thedata = {
      "options": {
        "delay": self.mydelay,
        "notify": self.okNotify,
        "idle": self.idle,
        "timeout": self.timeout
      }
    };
    self.$log.debug('about setUserOptions ', thedata, updpath);
    return self.UserServices.setUserOptions(updpath, thedata)
      .then(function(data) {
        self.$log.debug('setUserOptions returned data');
        self.$log.debug(data);
        if ((typeof data.message === 'undefined' || data.error === true) &&
          typeof data !== 'undefined') {
          var themsg = {
            message: data.message + ': ' +
              (typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
            delay: 5000
          };
          self.Notification.error(themsg);
          return (self.$q.reject(data));
        }
        else {
          self.Notification.success({ message: data.message, delay: 5000 });
          self.getUserOptions();
        }

        return data;
      }).catch(function(e) {
        self.$log.debug('setUserOptions failure:');
        self.$log.debug("error", e);
        self.message = e;
        self.Notification.error({ message: e, delay: 5000 });
        throw e;
      });
  }

  cancel() {
    this.$scope.$parent.modalInstance.dismiss('cancel');    
  }

}
