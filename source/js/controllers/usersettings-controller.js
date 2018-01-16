(function(window, angular, $) {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalUserSettingsInstanceController', ModalUserSettingsInstanceController);

  ModalUserSettingsInstanceController.$inject = [
    '$log',
    '$uibModalInstance',
    'UserServices',
    '$window',
    'Notification',
    '$scope',
    'Util',
    '$q',
    '$sce',
    'moment',
    '$uibModal'
  ];

  function ModalUserSettingsInstanceController($log, $uibModalInstance, UserServices, $window, Notification,
    $scope, Util, $q, $sce, moment, $uibModal) {
    /* jshint validthis: true */
    var vm = this;
    vm.cancel = cancel;
    vm.getUserOptions = getUserOptions;
    vm.setUserOptions = setUserOptions;

    vm.userOptions = {};
    vm.okoptions = [true, false];
    vm.okNotify = true;
    vm.mydelay = 10;

    getUserOptions();


    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $log.debugEnabled(true);
      $log.debug("ModalUserSettingsInstanceController started");

    });
    $scope.$on('$destroy', function iVeBeenDismissed() {
      $log.debug("ModalUserSettingsInstanceController dismissed");
      $log.debugEnabled(false);
    });

    $.fn.Data.Portlet('usersettings-controller.js');
    
    function getUserOptions() {
      $log.debug('getUserOptions entered');
      var path = "../v1/useroptions";
      return UserServices.getUserOptions(path).then(function(data) {
          $log.debug("main controller service getUserOptions returned:", data);
          if ((typeof data.options === 'undefined' || data.options.error === true) &&
            typeof data !== 'undefined') {
            var themsg = {
              message: data.message + ': ' +
                (typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
              delay: 5000
            };
            Notification.error(themsg);
            $q.reject(data);
          }
          else {
            try {
              vm.userOptions = JSON.parse(data.options);
              vm.okNotify = (vm.userOptions.notify ? vm.userOptions.notify : false);
              vm.mydelay = (vm.userOptions.delay ? vm.userOptions.delay : 30);
              //Notification.success({message: vm.message, delay: 5000});
            }
            catch (e) {
              $log.debug(e instanceof SyntaxError); // true
              $log.debug(e.message); // "missing ; before statement"
              $log.debug(e.name); // "SyntaxError"
              $log.debug(e.fileName); // "Scratchpad/1"
              $log.debug(e.lineNumber); // 1
              $log.debug(e.columnNumber); // 4
              $log.debug(e.stack); // "@Scratchpad/1:2:3\n"
              Notification.error(e.message);
              $q.reject(data);
            }

          }

          return vm.userOptions;
        },

        function(error) {
          $log.debug('Caught an error getUserOptions, going to notify:', error);
          vm.userOptions = [];
          vm.message = error;
          Notification.error({ message: error, delay: 5000 });
          return ($q.reject(error));
        }).
      finally(function() {});

    }

    function setUserOptions() {
      var updpath = "../v1/useroptions";
      var thedata = { 
        "options": {
         "delay": vm.mydelay,
         "notify": vm.okNotify
        }
      };
      $log.debug('about setUserOptions ', thedata, updpath);
      return UserServices.setUserOptions(updpath, thedata)
        .then(function(data) {
          $log.debug('setUserOptions returned data');
          $log.debug(data);
          if ((typeof data.message === 'undefined' || data.error === true) &&
            typeof data !== 'undefined') {
            var themsg = {
              message: data.message + ': ' +
                (typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
              delay: 5000
            };
            Notification.error(themsg);
            $q.reject(data);
          }
          else {
            Notification.success({ message: data.message, delay: 5000 });
          }

          return data;
        }).catch(function(e) {
          $log.debug('setUserOptions failure:');
          $log.debug("error", e);
          vm.message = e;
          Notification.error({ message: e, delay: 5000 });
          throw e;
        });
    }
        
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }


})(window, window.angular, window.$);
