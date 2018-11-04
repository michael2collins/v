//const { jQuery: $ } = window;

export class ModalEmailListInstanceController {
  constructor(
    $log, studentServices, $window, Notification, uiGridConstants,
    $scope, iddropdownFilter, $uibModal, util, $q, moment
  ) {
    'ngInject';
    console.log('entering ModalEmailListInstanceController controller');

    this.iddropdownFilter = iddropdownFilter;
    this.$log = $log;
    this.StudentServices = studentServices;
    this.$window = $window;
    this.Notification = Notification;
    this.uiGridConstants = uiGridConstants;
    this.$scope = $scope;
    this.$q = $q;
    this.moment = moment;
    this.Util = util;
    this.$uibModal = $uibModal;

  }
  $onInit() {

    this.gridOptions = {};
    this.gridApi;
    this.limits = [5, 10, 20, 50, 100, 200];
    this.gridLength = {};
    this.initialLength = 10;
    this.rowheight = 50;
    this.headerheight = 140;
    this.EmailList = {};
    this.thisEmailList = [];
    this.listStatus = [
      { "id": "read", "value": "read", "order": 1 },
      { "id": "new", "value": "new", "order": 2 },
    ];
    this.init();

    this.setGridLength(this.initialLength);
    this.setgridOptions();
    this.getEmailList();


    //    $.fn.Data.Portlet('emaillist-controller.js');
  }
  init() {
    var self=this;
    self.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      var vm = event.currentScope.$ctrl;
      vm.$log.debugEnabled(true);
      vm.$log.debug("ModalEmailListInstanceController started");

    });
    self.$scope.$on('$destroy', function iVeBeenDismissed() {
      self.$log.debug("ModalEmailListInstanceController dismissed");
      self.$log.debugEnabled(false);
    });
    
  }
  openEmail(selected) {
    var emailModal = this;

    emailModal.item = selected;
    emailModal.animationsEnabled = true;

    emailModal.modalInstance = undefined;
    emailModal.retvlu = '';
    var modalScope = emailModal.$scope.$new();

    emailModal.modalInstance = emailModal.$uibModal.open({
      animation: emailModal.animationsEnabled,
      //        template: './emailview.html',
      //        controller: 'ModalEmailViewInstanceController as vm',
      component: 'emailviewComponent',
      size: 'lg',
      windowClass: 'my-modal-popup',
      resolve: {
        item: function() {
          emailModal.$log.debug('resolve item', emailModal.item);
          return emailModal.item;
        }

      }
    });

    modalScope.modalInstance = emailModal.modalInstance;

    emailModal.modalInstance.opened.then(
        function(success) {
            emailModal.$log.debug('emailview ui opened:', success);

        },
        function(error) {
            emailModal.$log.debug('emailview ui failed to open, reason : ', error);
        }
    );


    emailModal.modalInstance.result.then(function(retvlu) {
      emailModal.$log.debug('search modalInstance result :', retvlu);
      emailModal.retvlu = retvlu;
    }, function() {
      emailModal.getEmailList();
      emailModal.$log.info('Modal dismissed at: ' + new Date());
    
      
    });
    

  }


  getEmailList() {
    var self = this;
    self.$log.debug('getEmailList entered');
    var path = '../v1/emaillist';

    return self.StudentServices.getEmailLists(path).then(function(data) {
      self.$log.debug('getEmailLists returned data');
      self.$log.debug(data);
      var testdate;
      for (var i = 0; i < data.EmailList.length; i++) {

        testdate = self.Util.datecheckconvert(data.EmailList[i].emaildate);

        if (!self.moment(testdate || self.moment()).isBefore(self.moment().subtract(1, 'days').endOf('day'))) {
          // They are on the same day
          data.EmailList[i].datef = self.moment(testdate || self.moment()).format("HH:mm");
        }
        else {
          // They are not on the same day
          data.EmailList[i].datef = self.moment(testdate || self.moment()).format("MMM DD, YYYY");
        }

      }

      self.gridOptions.data = data.EmailList;

    }, function(error) {
      self.$log.debug('Caught an error getEmailLists:', error);
      self.gridOptions.data = {};
      self.message = error;
      self.Notification.error({ message: error, delay: 5000 });
      return (self.$q.reject(error));

    });
  }

  setgridOptions() {
    var vm = this;
    vm.gridOptions = {
      enableFiltering: true,
      enableCellEditOnFocus: true,
      enableSorting: true,
      paginationPageSizes: vm.limits,
      paginationPageSize: vm.initialLength,
      rowHeight: vm.rowheight,
      appScopeProvider: vm,
      columnDefs: [{
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
          headerCellClass: vm.Util.highlightFilteredHeader,
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
          headerCellClass: vm.Util.highlightFilteredHeader,
          enableCellEdit: false,
          enableFiltering: true
        },
        {
          field: 'emailto',
          displayName: 'To',
          headerCellClass: vm.Util.highlightFilteredHeader,
          enableCellEdit: false,
          enableFiltering: true
        },
        {
          field: 'subject',
          displayName: 'Subject',
          headerCellClass: vm.Util.highlightFilteredHeader,
          enableCellEdit: false,
          enableFiltering: true
        },
        {
          field: 'firstname',
          displayName: 'First Name',
          headerCellClass: vm.Util.highlightFilteredHeader,
          enableCellEdit: false,
          enableFiltering: true
        },
        {
          field: 'lastname',
          displayName: 'Last Name',
          headerCellClass: vm.Util.highlightFilteredHeader,
          enableCellEdit: false,
          enableFiltering: true
        },
        {
          field: 'emaildate',
          displayName: 'rawDate',
          visible: false,
          headerCellClass: vm.Util.highlightFilteredHeader,
          enableCellEdit: false,
          enableFiltering: false,
          sort: {
            direction: vm.uiGridConstants.DESC,
            priority: 1
          }
        },
        {
          field: 'datef',
          displayName: 'Date',
          headerCellClass: vm.Util.highlightFilteredHeader,
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
        vm.$log.debug('vm gridapi onRegisterApi');
        vm.gridApi = gridApi;

        gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
          vm.$log.debug('pagination changed');
          vm.setGridLength(pageSize);
          vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

        });

        gridApi.edit.on.afterCellEdit(vm.$scope,
          function(rowEntity, colDef, newValue, oldValue) {
            if (newValue != oldValue) {
              vm.updateEmailList(rowEntity, 'Update');
            }
          });

      }
    };



  }

  setGridLength(size) {
    this.gridLength = {
      height: (size * this.rowheight) + this.headerheight + 'px'
    };
  }

  getGridLength() {
    return this.gridLength;
  }

  removeEmailList(input) {
    var vm = this;
    vm.$log.debug('removeEmailList entered', input);
    var path = "../v1/emaillist";
    var thedata = {
      id: input.id
    };
    var data = {};
    data.EmailListExistsList = {};

    //check nclasspays, nclasspgm, studentregistration, testcandidates
    return vm.StudentServices.removeEmailList(thedata, path)
      .then(function(data) {
        vm.$log.debug('removeEmailList returned data');
        vm.$log.debug(data);
        vm.message = data.message;
        if ((typeof data === 'undefined' || data.error === true) &&
          typeof data !== 'undefined') {
          vm.Notification.error({ message: vm.message, delay: 5000 });
          vm.EmailListFKExists = data.EmailListExistsList;
          return (vm.$q.reject(data));
        }
        else {
          vm.Notification.success({ message: vm.message, delay: 5000 });
        }

        vm.getEmailList().then(function(zdata) {
            vm.$log.debug('getEmailList returned', zdata);
          },
          function(error) {
            vm.$log.debug('Caught an error getEmailList after remove:', error);
            vm.thisEmailList = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));
          });
        return data;
      }).catch(function(e) {
        vm.$log.debug('removeEmailList failure:');
        vm.$log.debug("error", e);
        vm.Notification.error({ message: e, delay: 5000 });
        throw e;
      });

  }

  updateEmailList(rowEntity, updatetype) {
    var vm = this;
    var updpath = "../v1/emaillist";

    var thedata = {
      id: rowEntity.id,
      status: rowEntity.status
    };

    vm.$log.debug('about updateEmailList ', thedata, updpath, updatetype);
    return vm.StudentServices.updateEmailList(updpath, thedata)
      .then(function(data) {
        vm.$log.debug('updateEmailList returned data');
        vm.$log.debug(data);
        vm.thisEmailList = data;
        vm.$log.debug(vm.thisEmailList);
        vm.$log.debug(vm.thisEmailList.message);
        vm.message = vm.thisEmailList.message;
        if ((typeof vm.thisEmailList === 'undefined' || vm.thisEmailList.error === true) &&
          typeof data !== 'undefined') {
          vm.Notification.error({ message: vm.message, delay: 5000 });
          return (vm.$q.reject(data));
        }
        else {
          vm.Notification.success({ message: vm.message, delay: 5000 });
        }
        if (updatetype === 'Add') {
          vm.getEmailList().then(function(zdata) {
              vm.$log.debug('getEmailList returned', zdata);
            },
            function(error) {
              vm.$log.debug('Caught an error getEmailList after remove:', error);
              vm.thisEmailList = [];
              vm.message = error;
              vm.Notification.error({ message: error, delay: 5000 });
              return (vm.$q.reject(error));
            });

        }

        return vm.thisEmailList;
      }).catch(function(e) {
        vm.$log.debug('updateEmailList failure:');
        vm.$log.debug("error", e);
        vm.message = e;
        vm.Notification.error({ message: e, delay: 5000 });
        throw e;
      });
  }


  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }

}
