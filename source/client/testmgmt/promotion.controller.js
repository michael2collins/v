export class ModalPromotionInstanceController {
  constructor(
    $log, TestingServices, $window, Notification, uiGridConstants, $scope, $q, portalDataService, UserServices

  ) {
    'ngInject';
    this.$log = $log;
    this.TestingServices = TestingServices;
    this.$window = $window;
    this.$q = $q;
    this.$scope = $scope;
    this.Notification = Notification;
    this.uiGridConstants = uiGridConstants;
    this.portalDataService = portalDataService;
        this.UserServices = UserServices;
  }
  $onDestroy() {
    this.$log.log("ModalPromotionInstanceController dismissed");
    //this.$log.logEnabled(false);
  }

  $onInit() {

    var vm = this;

        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('ModalPromotionInstanceController',vm.UserServices.isDebugEnabled());
        }

    vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
      vm.$log.log("ModalPromotionInstanceController started");

    });
    vm.$scope.$on('$destroy', function iVeBeenDismissed() {
      vm.$log.log("ModalPromotionInstanceController dismissed");
   //   vm.$log.logEnabled(false);
    });

    vm.message = '';
    vm.selectedStudents = [];
    vm.thiscoldef = {};
    vm.testcandidate;
    vm.headerheight = 140;
    vm.initialLength = 10;
    vm.rowheight = 32;


    vm.setGridLength(vm.initialLength);
    vm.rptgridOptionsnew = vm.TestingServices.getGrid();
    vm.rptgridApi = vm.TestingServices.getGridApi();
    vm.testDate = vm.TestingServices.getTestDate();
    vm.testTime = vm.TestingServices.getTestTime();

    vm.$log.log("TestDate:", vm.testDate);

    vm.portalDataService.Portlet('promotion.controller.js');
    vm.rptgridOptionsnew.onRegisterApi = function(gridApi) {
      var self = this;
      self.$log.log('vm gridapi onRegisterApi');
      self.rptgridApi = gridApi;

      gridApi.pagination.on.paginationChanged(self.$scope, function(newPage, pageSize) {
        self.$log.log('pagination changed');
        self.setGridLength(pageSize);
        vm.gridApi.core.notifyDataChange(self.uiGridConstants.dataChange.ALL);

      });

      gridApi.selection.on.rowSelectionChanged(self.$scope, function(row) {
        var msg = 'grid row selected ' + row.entity;
        self.$log.log(msg);

        var selectedStudentarr = self.grid.api.selection.getSelectedRows();
        self.$log.log('selected', selectedStudentarr);
        self.setSelectedArray(selectedStudentarr);

      });
      gridApi.selection.on.rowSelectionChangedBatch(self.$scope, function(rows) {
        self.$log.log("grid batch");
        var selectedStudentarr = self.grid.api.selection.getSelectedRows();
        self.$log.log('batch selected', selectedStudentarr);
        self.setSelectedArray(selectedStudentarr);

      });
      gridApi.edit.on.afterCellEdit(self.$scope,
        function(rowEntity, colDef, newValue, oldValue) {
          self.$log.log('rowEntity');
          self.$log.log(rowEntity);
          //Alert to show what info about the edit is available
          self.$log.log('Column: ' + colDef.name +
            ' newValue: ' + newValue + ' oldValue: ' + oldValue);
          if (newValue != oldValue) {
            //       updatetestcandidate(colDef,newValue,rowEntity);       
          }
        });
    };
  }

  setGridLength(size) {
    var vm = this;
    vm.gridLength = {
      height: (size * vm.rowheight) + vm.headerheight + 'px'
    };
  }

  getGridLength() {
    var vm = this;
    return vm.gridLength;
  }


  setSelectedArray(inputArray) {
    var vm = this;
    vm.$log.log("setSelectedArray entered", inputArray);
    vm.selectedStudents = [];

    if (inputArray.length > 0) {
      vm.selected = true;
      for (var i = 0, len = inputArray.length; i < len; i++) {
        var info = {
          ContactID: inputArray[i].contactID,
          studentname: inputArray[i].FirstName + ' ' + inputArray[i].LastName,
          FirstName: inputArray[i].FirstName,
          LastName: inputArray[i].LastName,
          rankType: inputArray[i].ranktype,
          nextClass: inputArray[i].nextClass,
          classcat: inputArray[i].classcat,
          agecat: inputArray[i].agecat,
          BeltSize: inputArray[i].BeltSize,
          ContactType: inputArray[i].ContactType,
          CurrentRank: inputArray[i].CurrentRank,
          RankAchievedInTest: inputArray[i].RankAchievedInTest,
          ReadyForNextRank: inputArray[i].ReadyForNextRank,
          address: inputArray[i].address,
          age: inputArray[i].age,
          birthday: inputArray[i].birthday,
          city: inputArray[i].city,
          contactpictureurl: inputArray[i].contactpictureurl,
          daysAttended: inputArray[i].daysAttended,
          daysSinceLastTest: inputArray[i].daysSinceLastTest,
          email: inputArray[i].email,
          lastpromoted: inputArray[i].lastpromoted,
          parent: inputArray[i].parent,
          phone: inputArray[i].phone,
          state: inputArray[i].state,
          zip: inputArray[i].zip,
          AttendPromoteTarget: inputArray[i].AttendPromoteTarget,
          DurationPromoteTarget: inputArray[i].DurationPromoteTarget,
          class: inputArray[i].class,
          rankForNextClass: inputArray[i].rankForNextClass,
          ranklistForNextClass: inputArray[i].ranklistForNextClass,
          ageForNextClass: inputArray[i].ageForNextClass,
          promote: inputArray[i].promote,
          recommendedClass: inputArray[i].recommendedClass,
          recommendedClassid: inputArray[i].recommendedClassid,
          recommendedPgmid: inputArray[i].recommendedPgmid,
          recommendedClassnm: inputArray[i].recommendedClassnm,
          recommendedPgmnm: inputArray[i].recommendedPgmnm,

          classWas: inputArray[i].classWas,
          pgmWas: inputArray[i].pgmWas,
          crid: inputArray[i].crid,
          cpid: inputArray[i].cpid,
          changeClass: inputArray[i].changeClass

        };
        vm.selectedStudents.push(info);
      }
    }
    else {
      vm.selected = false;
      return;
    }

    vm.$log.log("setarray", vm.selectedStudents);

  }

  updatetestcandidate(colDef, newValue, rowEntity) {
    var vm = this;
    var path = "../v1/testcandidateregistration";
    var indata = {
      changedColumn: colDef,
      newValue: newValue,
      ContactID: rowEntity.ContactID,
      testcandidate: vm.testcandidate,
    };

    vm.$log.log('about updatetestcandidate ', indata, path);

    return vm.TestingServices.updatetestcandidate(path, indata)
      .then(function(data) {
        vm.$log.log('updatetestcandidate returned data');
        vm.$log.log(data);
        vm.thiscoldef = data;
        vm.$log.log(vm.thiscoldef);
        vm.$log.log(vm.thiscoldef.message);
        vm.message = vm.thiscoldef.message;

      }).catch(function(e) {
        vm.$log.log('updatetestcandidate failure:');
        vm.$log.log("error", e);
        vm.message = e;
        vm.Notification.error({ message: e, delay: 5000 });
        throw e;
      });

  }

  promote() {
    var vm = this;
    vm.$log.log('hit promote');
    vm.rptgridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.COLUMN);

    var path = "../v1/testcandidatepromotion";
    var thedata = {
      testDate: vm.testDate.slice(0, 10),
      selectedStudents: vm.selectedStudents,
    };

    vm.$log.log('about promotetestcandidate ', thedata, path);

    return vm.TestingServices.promotetestcandidate(path, thedata)
      .then(function(data) {
        vm.$log.log('promotetestcandidate returned data');
        vm.$log.log(data);
        vm.message = data.message;
        if ((typeof data === 'undefined' || data.error === true) &&
          typeof data !== 'undefined') {
          vm.Notification.error({ message: vm.message, delay: 5000 });
          return (vm.$q.reject(data));
        }
        else {
          vm.Notification.success({ message: vm.message, delay: 5000 });
        }

      }).catch(function(e) {
        vm.$log.log('promotetestcandidate failure:');
        vm.$log.log("error", e);
        vm.message = e;
        vm.Notification.error({ message: e, delay: 5000 });
        throw e;
      });


  }


  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }
}
