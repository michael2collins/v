(function(window, angular, $) {
  'use strict';

  angular
    .module('ng-admin.all')
    .controller('ModalPromotionInstanceController', ModalPromotionInstanceController);

  ModalPromotionInstanceController.$inject = [
    '$log',
    '$uibModalInstance',
    'TestingServices',
    '$window',
    'Notification',
    'uiGridConstants',
    '$scope',
    '$q'
  ];

  function ModalPromotionInstanceController($log, $uibModalInstance, TestingServices, $window, Notification, uiGridConstants, $scope, $q) {
    /* jshint validthis: true */
    var vm = this;

    vm.promote = promote;
    vm.cancel = cancel;
    vm.message = '';
    vm.selectedStudents = [];
    vm.thiscoldef = {};
    vm.testcandidate;
    vm.headerheight = 140;
    vm.initialLength = 10;
    vm.rowheight = 25;
    
    vm.getGridLength = getGridLength;

    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $log.debugEnabled(true);
      $log.debug("ModalPromotionInstanceController started");

    });
    $scope.$on('$destroy', function iVeBeenDismissed() {
      $log.debug("ModalPromotionInstanceController dismissed");
      $log.debugEnabled(false);
    });

    setGridLength(vm.initialLength);
    vm.rptgridOptionsnew = TestingServices.getGrid();
    vm.rptgridApi = TestingServices.getGridApi();
    vm.testDate = TestingServices.getTestDate();
    vm.testTime = TestingServices.getTestTime();

    $log.debug("TestDate:", vm.testDate);

    $.fn.Data.Portlet('promotion-controller.js');


    function setGridLength(size) {
      vm.gridLength = {
        height: (size * vm.rowheight) + vm.headerheight + 'px'
      };
    }

    function getGridLength() {
      return vm.gridLength;
    }

    vm.rptgridOptionsnew.onRegisterApi = function(gridApi) {
      $log.debug('vm gridapi onRegisterApi');
      vm.rptgridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
        $log.debug('pagination changed');
        setGridLength(pageSize);
        vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        var msg = 'grid row selected ' + row.entity;
        $log.debug(msg);

        var selectedStudentarr = this.grid.api.selection.getSelectedRows();
        $log.debug('selected', selectedStudentarr);
        setSelectedArray(selectedStudentarr);

      });
      gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
        $log.debug("grid batch");
        var selectedStudentarr = this.grid.api.selection.getSelectedRows();
        $log.debug('batch selected', selectedStudentarr);
        setSelectedArray(selectedStudentarr);

      });
      gridApi.edit.on.afterCellEdit($scope,
        function(rowEntity, colDef, newValue, oldValue) {
          $log.debug('rowEntity');
          $log.debug(rowEntity);
          //Alert to show what info about the edit is available
          $log.debug('Column: ' + colDef.name +
            ' newValue: ' + newValue + ' oldValue: ' + oldValue);
          if (newValue != oldValue) {
            //       updatetestcandidate(colDef,newValue,rowEntity);       
          }
        });
    };

    function setSelectedArray(inputArray) {
      $log.debug("setSelectedArray entered", inputArray);
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

      $log.debug("setarray", vm.selectedStudents);

    }

    function updatetestcandidate(colDef, newValue, rowEntity) {
      var path = "../v1/testcandidateregistration";
      var indata = {
        changedColumn: colDef,
        newValue: newValue,
        ContactID: rowEntity.ContactID,
        testcandidate: vm.testcandidate,
      };

      $log.debug('about updatetestcandidate ', indata, path);

      return TestingServices.updatetestcandidate(path, indata)
        .then(function(data) {
          $log.debug('updatetestcandidate returned data');
          $log.debug(data);
          vm.thiscoldef = data;
          $log.debug(vm.thiscoldef);
          $log.debug(vm.thiscoldef.message);
          vm.message = vm.thiscoldef.message;

        }).catch(function(e) {
          $log.debug('updatetestcandidate failure:');
          $log.debug("error", e);
          vm.message = e;
          Notification.error({ message: e, delay: 5000 });
          throw e;
        });

    }

    function promote() {
      $log.debug('hit promote');
      vm.rptgridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
      //      vm.rptgridApi.grid.api.exporter.pdfExport('selected', 'visible');

/*
{  
   "field":"changeClass",
   "cellClass":"grid-align",
   "visible":true,
   "enableCellEdit":true,
   "type":"boolean",
//   "cellTemplate":"<span class='bigcheck'><input ng-model='row.entity.changeClass'  type='checkbox' class='bigcheck'/><span class='bigcheck-target'</span>"
   "cellTemplate":"<input ng-model='row.entity.changeClass'  type='checkbox' />"
},
{  
   "field":"lastpromoted",
   "visible":true,
   "enableCellEditOnFocus":false,
   "enableCellEdit":false
},
{  
   "field":"promote",
   "cellClass":"grid-align",
   "visible":true,
   "enableCellEdit":true,
   "type":"boolean",
   "cellTemplate":"<span class='bigcheck'><input ng-model='row.entity.promote'  type='checkbox' class='bigcheck'/><span class='bigcheck-target'</span>"
}
*/

      var path = "../v1/testcandidatepromotion";
      var thedata = {
        testDate: vm.testDate.slice(0,10),
        selectedStudents: vm.selectedStudents,
      };

      $log.debug('about promotetestcandidate ', thedata, path);

      return TestingServices.promotetestcandidate(path, thedata)
        .then(function(data) {
          $log.debug('promotetestcandidate returned data');
          $log.debug(data);
          vm.message = data.message;
          if ((typeof data === 'undefined' || data.error === true) &&
            typeof data !== 'undefined') {
            Notification.error({ message: vm.message, delay: 5000 });
            return($q.reject(data));
          }
          else {
            Notification.success({ message: vm.message, delay: 5000 });
          }

        }).catch(function(e) {
          $log.debug('promotetestcandidate failure:');
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
