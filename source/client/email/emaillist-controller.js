(function(window, angular, $) {
  'use strict';

  angular
    .module('ng-admin.email')
    .controller('ModalEmailListInstanceController', ModalEmailListInstanceController);

  ModalEmailListInstanceController.$inject = [
    '$log',
    '$uibModalInstance',
    'StudentServices',
    '$window',
    'Notification',
    'uiGridConstants',
    '$scope',
    'iddropdownFilter',
    '$uibModal',
    'Util',
    '$q',
    'moment'
  ];

  function ModalEmailListInstanceController($log, $uibModalInstance, StudentServices, $window, Notification, uiGridConstants,
    $scope, iddropdownFilter, $uibModal, Util, $q, moment) {
    /* jshint validthis: true */
    var vm = this;
    vm.cancel = cancel;
    vm.removeEmailList = removeEmailList;
    vm.updateEmailList = updateEmailList;
    vm.openEmail = openEmail;
    vm.gridOptions = {};
    vm.gridApi;
    vm.limits = [5, 10, 20, 50, 100, 200];
    vm.gridLength = {};
    vm.initialLength = 10;
    vm.rowheight = 50;
    vm.headerheight = 140;
    vm.getGridLength = getGridLength;
    vm.EmailList = {};
    vm.thisEmailList = [];
    vm.listStatus = [
      { "id": "read", "value": "read", "order": 1 },
      { "id": "new", "value": "new", "order": 2 },
    ];
    setGridLength(vm.initialLength);
    setgridOptions();
    getEmailList();


    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $log.debugEnabled(true);
      $log.debug("ModalEmailListInstanceController started");

    });
    $scope.$on('$destroy', function iVeBeenDismissed() {
      $log.debug("ModalEmailListInstanceController dismissed");
      $log.debugEnabled(false);
    });

    $.fn.Data.Portlet('emaillist-controller.js');

    function openEmail(selected) {
      var emailModal = vm;

      emailModal.item = selected;
      emailModal.animationsEnabled = true;

      emailModal.modalInstance = undefined;
      emailModal.retvlu = '';

      emailModal.modalInstance = $uibModal.open({
        animation: emailModal.animationsEnabled,
        templateUrl: 'templates/email/emailview.html',
        controller: 'ModalEmailViewInstanceController as vm',
        size: 'lg',
        windowClass: 'my-modal-popup',
        resolve: {
          item: function() {
            $log.debug('resolve item', emailModal.item);
            return emailModal.item;
          }

        }
      });
      emailModal.modalInstance.result.then(function(retvlu) {
        $log.debug('search modalInstance result :', retvlu);
        emailModal.retvlu = retvlu;
      }, function() {
        getEmailList();
        $log.info('Modal dismissed at: ' + new Date());
      });

    }


    function getEmailList() {
      $log.debug('getEmailList entered');
      var path = '../v1/emaillist';

      return StudentServices.getEmailLists(path).then(function(data) {
        $log.debug('getEmailLists returned data');
        $log.debug(data);
        var testdate;
        for(var i=0;i<data.EmailList.length;i++) {

          testdate = Util.datecheckconvert(data.EmailList[i].emaildate);
          
          if (!moment(testdate || moment() ).isBefore(moment().subtract(1,'days').endOf('day')) ) {
              // They are on the same day
              data.EmailList[i].datef = moment(testdate || moment()).format("HH:mm");
          } else {
              // They are not on the same day
              data.EmailList[i].datef = moment(testdate || moment()).format("MMM DD, YYYY");
          }          
          
        }

        vm.gridOptions.data = data.EmailList;

      }, function(error) {
        $log.debug('Caught an error getEmailLists:', error);
        vm.gridOptions.data = {};
        vm.message = error;
        Notification.error({ message: error, delay: 5000 });
        return ($q.reject(error));

      });
    }

    function setgridOptions() {

      vm.gridOptions = {
        enableFiltering: true,
        enableCellEditOnFocus: true,
        enableSorting: true,
        paginationPageSizes: vm.limits,
        paginationPageSize: vm.initialLength,
        rowHeight: vm.rowheight,
        appScopeProvider: vm,
        columnDefs: [
          {
            field: 'id',
            displayName: 'Open',
            enableFiltering: false,
            enableSorting: false,
            enableHiding: false,
            enableCellEdit: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.openEmail(row.entity)" role="button" class="btn btn-blue" style="padding:  0px 14px;"  ><i class="fa fa-folder-open-o"></i>&nbsp; Open</a></span></div>'
          },
          {
            field: 'status',
            displayName: 'Status',
            headerCellClass: Util.highlightFilteredHeader,
            enableCellEdit: true,
            enableFiltering: true,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            cellFilter: 'iddropdown:this',
            editDropdownIdLabel: 'id',
            editDropdownValueLabel: 'value',
            editDropdownOptionsArray: vm.listStatus,
            filter: {
              options: vm.listStatus
            }
          },
          {
            field: 'from',
            displayName: 'From',
            headerCellClass: Util.highlightFilteredHeader,
            enableCellEdit: false,
            enableFiltering: true
          },
          {
            field: 'emailto',
            displayName: 'To',
            headerCellClass: Util.highlightFilteredHeader,
            enableCellEdit: false,
            enableFiltering: true
          },
          {
            field: 'subject',
            displayName: 'Subject',
            headerCellClass: Util.highlightFilteredHeader,
            enableCellEdit: false,
            enableFiltering: true
          },
          {
            field: 'firstname',
            displayName: 'First Name',
            headerCellClass: Util.highlightFilteredHeader,
            enableCellEdit: false,
            enableFiltering: true
          },
          {
            field: 'lastname',
            displayName: 'Last Name',
            headerCellClass: Util.highlightFilteredHeader,
            enableCellEdit: false,
            enableFiltering: true
          },
          {
            field: 'emaildate',
            displayName: 'rawDate',
            visible: false,
            headerCellClass: Util.highlightFilteredHeader,
            enableCellEdit: false,
            enableFiltering: false,
            sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                  }            
          },
          {
            field: 'datef',
            displayName: 'Date',
            headerCellClass: Util.highlightFilteredHeader,
            enableCellEdit: false,
            enableFiltering: false
          },
          {
            field: 'id',
            displayName: 'Action',
            enableFiltering: false,
            enableSorting: false,
            enableHiding: false,
            enableCellEdit: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeEmailList(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
          }

        ],

        //rowHeight: 15,
        showGridFooter: false,
        enableColumnResizing: true,

        onRegisterApi: function(gridApi) {
          $log.debug('vm gridapi onRegisterApi');
          vm.gridApi = gridApi;

          gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            $log.debug('pagination changed');
            setGridLength(pageSize);
            vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);

          });

          gridApi.edit.on.afterCellEdit($scope,
            function(rowEntity, colDef, newValue, oldValue) {
              if (newValue != oldValue) {
                updateEmailList(rowEntity, 'Update');
              }
            });

        }
      };



    }

    function setGridLength(size) {
      vm.gridLength = {
        height: (size * vm.rowheight) + vm.headerheight + 'px'
      };
    }

    function getGridLength() {
      return vm.gridLength;
    }

    function removeEmailList(input) {
      $log.debug('removeEmailList entered', input);
      var path = "../v1/emaillist";
      var thedata = {
        id: input.id
      };
      var data = {};
      data.EmailListExistsList = {};

      //check nclasspays, nclasspgm, studentregistration, testcandidates
      return StudentServices.removeEmailList(thedata, path)
        .then(function(data) {
          $log.debug('removeEmailList returned data');
          $log.debug(data);
          vm.message = data.message;
          if ((typeof data === 'undefined' || data.error === true) &&
            typeof data !== 'undefined') {
            Notification.error({ message: vm.message, delay: 5000 });
            vm.EmailListFKExists = data.EmailListExistsList;
            return($q.reject(data));
          }
          else {
            Notification.success({ message: vm.message, delay: 5000 });
          }

          getEmailList().then(function(zdata) {
              $log.debug('getEmailList returned', zdata);
            },
            function(error) {
              $log.debug('Caught an error getEmailList after remove:', error);
              vm.thisEmailList = [];
              vm.message = error;
              Notification.error({ message: error, delay: 5000 });
              return ($q.reject(error));
            });
          return data;
        }).catch(function(e) {
          $log.debug('removeEmailList failure:');
          $log.debug("error", e);
          Notification.error({ message: e, delay: 5000 });
          throw e;
        });

    }

    function updateEmailList(rowEntity, updatetype) {
      var updpath = "../v1/emaillist";

      var thedata = {
        id: rowEntity.id,
        status: rowEntity.status
      };

      $log.debug('about updateEmailList ', thedata, updpath, updatetype);
      return StudentServices.updateEmailList(updpath, thedata)
        .then(function(data) {
          $log.debug('updateEmailList returned data');
          $log.debug(data);
          vm.thisEmailList = data;
          $log.debug(vm.thisEmailList);
          $log.debug(vm.thisEmailList.message);
          vm.message = vm.thisEmailList.message;
          if ((typeof vm.thisEmailList === 'undefined' || vm.thisEmailList.error === true) &&
            typeof data !== 'undefined') {
            Notification.error({ message: vm.message, delay: 5000 });
            return($q.reject(data));
          }
          else {
            Notification.success({ message: vm.message, delay: 5000 });
          }
          if (updatetype === 'Add') {
            getEmailList().then(function(zdata) {
                $log.debug('getEmailList returned', zdata);
              },
              function(error) {
                $log.debug('Caught an error getEmailList after remove:', error);
                vm.thisEmailList = [];
                vm.message = error;
                Notification.error({ message: error, delay: 5000 });
                return ($q.reject(error));
              });

          }

          return vm.thisEmailList;
        }).catch(function(e) {
          $log.debug('updateEmailList failure:');
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
