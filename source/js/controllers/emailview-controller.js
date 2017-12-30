(function(window, angular, $) {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalEmailViewInstanceController', ModalEmailViewInstanceController);

  ModalEmailViewInstanceController.$inject = [
    '$log',
    '$uibModalInstance',
    'StudentServices',
    '$window',
    'Notification',
    '$scope',
    'Util',
    '$q',
    '$sce',
    'moment',
    'item'
  ];

  function ModalEmailViewInstanceController($log, $uibModalInstance, StudentServices, $window, Notification,
    $scope, Util, $q, $sce, moment, item) {
    /* jshint validthis: true */
    $log.debug('item', item);
    var vm = this;
    vm.cancel = cancel;
    vm.removeEmailView = removeEmailView;
    vm.updateEmailView = updateEmailView;
    vm.data = {};
    vm.thisEmailView = [];
    getEmailView(item);


    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $log.debugEnabled(true);
      $log.debug("ModalEmailViewInstanceController started");

    });
    $scope.$on('$destroy', function iVeBeenDismissed() {
      $log.debug("ModalEmailViewInstanceController dismissed");
      $log.debugEnabled(false);
    });

    $.fn.Data.Portlet('emailview-controller.js');

    function getEmailView(item) {
      $log.debug('getEmailView entered');
      var input = item.id;
      return StudentServices.getEmailViews(input).then(function(data) {
        $log.debug('getEmailViews returned data');
        $log.debug(data);

        vm.message = data.message;
        if ((typeof data === 'undefined' || data.error === true) &&
          typeof data !== 'undefined') {
          Notification.error({ message: vm.message, delay: 5000 });
          $q.reject(data);
        }
        else {
          Notification.success({ message: vm.message, delay: 5000 });
          vm.data = data.EmailView[0];
          vm.data.body = $sce.trustAsHtml(data.EmailView[0].body);
          if (!moment(vm.data.emaildate || moment()).isBefore(moment().subtract(1,'days').endOf('day')) ) {
              // They are on the same day
              vm.data.datef = moment(vm.data.emaildate || moment()).format("HH:mm");
          } else {
              // They are not on the same day
              vm.data.datef = moment(vm.data.emaildate || moment()).format("MMM DD, YYYY");
          }          
        }
        return vm.data;
      }, function(error) {
        $log.debug('Caught an error getEmailViews:', error);
        vm.data = [];
        vm.message = error;
        Notification.error({ message: error, delay: 5000 });
        return ($q.reject(error));

      });
    }


    function removeEmailView(input) {
      $log.debug('removeEmailView entered', input);
      var path = "../v1/EmailView";
      var thedata = {
        id: input.id
      };
      var data = {};
      data.EmailViewExistsList = {};

      //check nclasspays, nclasspgm, studentregistration, testcandidates
      return StudentServices.removeEmailView(thedata, path)
        .then(function(data) {
          $log.debug('removeEmailView returned data');
          $log.debug(data);
          vm.message = data.message;
          if ((typeof data === 'undefined' || data.error === true) &&
            typeof data !== 'undefined') {
            Notification.error({ message: vm.message, delay: 5000 });
            vm.EmailViewFKExists = data.EmailViewExistsList;
            $q.reject(data);
          }
          else {
            Notification.success({ message: vm.message, delay: 5000 });
          }

          getEmailView().then(function(zdata) {
              $log.debug('getEmailView returned', zdata);
            },
            function(error) {
              $log.debug('Caught an error getEmailView after remove:', error);
              vm.thisEmailView = [];
              vm.message = error;
              Notification.error({ message: error, delay: 5000 });
              return ($q.reject(error));
            });
          return data;
        }).catch(function(e) {
          $log.debug('removeEmailView failure:');
          $log.debug("error", e);
          Notification.error({ message: e, delay: 5000 });
          throw e;
        });

    }

    function updateEmailView(rowEntity, updatetype) {
      var updpath = "../v1/EmailView";

      var thedata = {
        id: rowEntity.id,
        status: rowEntity.status
      };

      $log.debug('about updateEmailView ', thedata, updpath, updatetype);
      return StudentServices.updateEmailView(updpath, thedata)
        .then(function(data) {
          $log.debug('updateEmailView returned data');
          $log.debug(data);
          vm.thisEmailView = data;
          $log.debug(vm.thisEmailView);
          $log.debug(vm.thisEmailView.message);
          vm.message = vm.thisEmailView.message;
          if ((typeof vm.thisEmailView === 'undefined' || vm.thisEmailView.error === true) &&
            typeof data !== 'undefined') {
            Notification.error({ message: vm.message, delay: 5000 });
            $q.reject(data);
          }
          else {
            Notification.success({ message: vm.message, delay: 5000 });
          }
          if (updatetype === 'Add') {
            getEmailView().then(function(zdata) {
                getEmailCount();
                $log.debug('getEmailView returned', zdata);
              },
              function(error) {
                $log.debug('Caught an error getEmailView after remove:', error);
                vm.thisEmailView = [];
                vm.message = error;
                Notification.error({ message: error, delay: 5000 });
                return ($q.reject(error));
              });

          }

          return vm.thisEmailView;
        }).catch(function(e) {
          $log.debug('updateEmailView failure:');
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
