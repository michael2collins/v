import angular from 'angular';

export class ctrlDualListGrid {
   constructor(
      $scope, $log, StudentServices, $routeParams, uiGridConstants, $window, Notification, $controller, $timeout
   ) {
      'ngInject';
      this.$scope = $scope;
      this.$log = $log;
      this.StudentServices = StudentServices;
      this.$routeParams = $routeParams;
      this.$window = $window;
      this.Notification = Notification;
      //    this.$controller = $controller;
      this.$timeout = $timeout;
      this.uiGridConstants = uiGridConstants;
   }

   $onInit() {
      var vmDual = this;

      vmDual.userprefpath = "../v1/userprefcols/allstudents";
      vmDual.path = '../v1/students';

      vmDual.gcolumns = [];
      vmDual.userprefcols = [];
      vmDual.listA = [];
      vmDual.listB = [];
      vmDual.gridOptions = {};
      vmDual.gridApi = undefined;


      vmDual.userData = [
         { id: 1, colname: 'FirstName', default: 'true' },
         { id: 2, colname: 'ID', default: 'true' },
         { id: 3, colname: 'LastName', default: 'true' },
         { id: 4, colname: 'Email', default: 'true' },
         { id: 5, colname: 'Email2', default: 'false' },
         { id: 6, colname: 'Parent', default: 'false' },
         { id: 7, colname: 'Phone', default: 'true' },
         { id: 8, colname: 'AltPhone', default: 'false' },
         { id: 9, colname: 'Address', default: 'false' },
         { id: 10, colname: 'City', default: 'false' },
         { id: 11, colname: 'State', default: 'false' },
         { id: 12, colname: 'ZIP', default: 'false' },
         { id: 13, colname: 'Notes', default: 'false' },
         { id: 14, colname: 'Birthday', default: 'false' },
         { id: 15, colname: 'BeltSize', default: 'false' },
         { id: 16, colname: 'InstructorPaymentFree', default: 'false' },
         { id: 17, colname: 'ContactType', default: 'false' },
         { id: 18, colname: 'InstructorFlag', default: 'false' },
         { id: 19, colname: 'quickbooklink', default: 'false' },
         { id: 20, colname: 'instructorTitle', default: 'false' },
         { id: 21, colname: 'sex', default: 'false' },
         { id: 22, colname: 'medicalConcerns', default: 'false' },
         { id: 23, colname: 'GuiSize', default: 'false' },
         { id: 24, colname: 'studentclassstatus', default: 'false' },
         { id: 25, colname: 'LastPromoted', default: 'false' },
         { id: 26, colname: 'currentrank', default: 'false' },
         { id: 27, colname: 'ranktype', default: 'false' }
      ];

      vmDual.gridLength = {};
      vmDual.limits = [5, 10, 20, 50, 100, 200];
      vmDual.initialLength = 10;
      vmDual.rowheight = 25;
      vmDual.headerheight = 140;
      vmDual.setGridLength(vmDual.initialLength);

      vmDual.getUserPrefCols();
   }
   $onDestroy() {
      this.$log.debug("ctrlDualList dismissed");
      this.$log.debugEnabled(false);
   }

   toggleFiltering() {
      var vmDual = this;
      vmDual.$log.debug('toggleFiltering');
      vmDual.gridOptions.enableFiltering = !vmDual.gridOptions.enableFiltering;
   }
   requery() {
      var vmDual = this;
      vmDual.$log.debug('requery entered');
      vmDual.getAllStudents().then(function() {
         vmDual.$log.debug('refreshed students');
      });
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


   getUserPrefCols() {
      var vmDual = this;
      vmDual.$log.debug('getUserPrefCols entered');
      return vmDual.StudentServices.getUserPrefCols(vmDual.userprefpath).then(function(data) {
         vmDual.$log.debug('getUserPrefCols returned data');
         vmDual.userprefcols = data.userprefcols;
         vmDual.$log.debug(vmDual.userprefcols);
         var foundit;
         for (var j = 0, lenu = vmDual.userData.length; j < lenu; j++) {
            foundit = false;
            for (var i = 0, len = vmDual.userprefcols.length; i < len; i++) {
               //$log.debug('colprefs',vmDual.userprefcols[i].prefcolumn);
               if (vmDual.userData[j].colname == vmDual.userprefcols[i].prefcolumn) {
                  vmDual.listA.push(vmDual.userData.slice(j, j + 1)[0]); //A is the list that we display
                  //      $log.debug('listA:', vmDual.userData.slice(j,j+1)[0]);
                  foundit = true;
                  break; //skip as we found something
               }
            }
            if (!foundit) {
               //    $log.debug('listB:', vmDual.userData.slice(j,j+1)[0]);
               vmDual.listB.push(vmDual.userData.slice(j, j + 1)[0]); //B gets the not matches
            }

         }
         vmDual.$log.debug('listA', vmDual.listA);
         vmDual.$log.debug('listB', vmDual.listB);


         vmDual.setGridOptions();

         vmDual.requery();
         return vmDual.userprefcols;
      });
   }

   removeStudent(input) {
      var vm = this;
      vm.$log.debug('removeStudent entered', input);
      var path = '../v1/student';
      var thedata = {
         id: input.id
      };
      var data = {};
      data.StudentExistsList = {};

      return vm.ClassServices.removeStudent(thedata, path)
         .then(function(data) {
            vm.$log.debug('removeStudent returned data');
            vm.$log.debug(data);
            vm.message = data.message;
            if ((typeof data === 'undefined' || data.error === true) &&
               typeof data !== 'undefined') {
               vm.Notification.error({ message: vm.message, delay: 5000 });
               vm.StudentFKExists = data.StudentExistsList;
               return (vm.$q.reject(data));
            }
            else {
               vm.Notification.success({ message: vm.message, delay: 5000 });
            }

            vm.getAllStudents().then(function(zdata) {
                  vm.$log.debug('getStudent returned', zdata);
               },
               function(error) {
                  vm.$log.debug('Caught an error getStudent after remove:', error);
                  vm.gridOptions.data = [];
                  vm.message = error;
                  vm.Notification.error({ message: error, delay: 5000 });
                  return (vm.$q.reject(error));
               });
            return data;
         }).catch(function(e) {
            vm.$log.debug('removeStudent failure:');
            vm.$log.debug("error", e);
            vm.Notification.error({ message: e, delay: 5000 });
            throw e;
         });

   }

   getAllStudents() {
      var vmDual = this;
      vmDual.$log.debug('getAllStudents tb grid');
      var vm = vmDual.$scope.$parent.vm;

      var refreshpath = encodeURI(vmDual.path +
         '?contacttype=' + vm.getContactType() +
         '&thelimit=' + vm.getLimit() +
         '&status=' + vm.getStatus() +
         '&therank=' + vm.getRank());

      vmDual.$log.debug('refreshtheAttendance path:', refreshpath);

      return vmDual.StudentServices.getAllStudents(refreshpath).then(function(data) {
         vmDual.gridOptions.data = data.students;

         return vmDual.gridOptions.data;
      });
   }

   setGridOptions() {
      var vmDual = this;
      vmDual.gcolumns = [];

      vmDual.$log.debug('setGridOptions col count', vmDual.listA.length);

      for (var i = 0, len = vmDual.listA.length; i < len; i++) {
         if (vmDual.listA[i].colname == 'ID') {
            continue; //skip as we will add it at the end 
         }
         vmDual.gcolumns.push({ field: vmDual.listA[i].colname, enableFiltering: true, headerCellClass: vmDual.highlightFilteredHeader, enableCellEdit: false });

      }


      vmDual.gcolumns.push({
         name: 'ID',
         displayName: 'Edit',
         enableFiltering: false,
         enableSorting: false,
         enableHiding: false,
         enableCellEdit: false,
         cellTemplate: '<div class="ui-grid-cell-contents"><span> <a role="button" class="btn btn-blue" style="padding:  0px 14px;" href="/#/form-layouts-editstudent/id/{{COL_FIELD}}" ><i class="fa fa-edit"></i>&nbsp; Edit</a></span><span> <a role="button" class="btn btn-red" style="padding:  0px 14px;" ng-click="grid.appScope.removeStudent(row.entity)" ><i class="fa fa-trash"></i>&nbsp; Delete</a></span></div>'
      });


      vmDual.gridOptions = {
         enableFiltering: true,
         columnDefs: vmDual.gcolumns,
         paginationPageSizes: vmDual.limits,
         paginationPageSize: vmDual.initialLength,
         rowHeight: vmDual.rowheight,
         showGridFooter: true,
         appScopeProvider: vmDual,
         enableColumnResizing: true,
         onRegisterApi: function(gridApi) {
            vmDual.$log.debug('vmDual gridapi onRegisterApi');
            vmDual.gridApi = gridApi;

            gridApi.pagination.on.paginationChanged(vmDual.$scope, function(newPage, pageSize) {
               vmDual.$log.debug('pagination changed');
               vmDual.setGridLength(pageSize);
               vmDual.gridApi.core.notifyDataChange(vmDual.uiGridConstants.dataChange.ALL);

            });

         }
      };

      vmDual.$log.debug('gcolumns', vmDual.gcolumns);
      vmDual.$log.debug('gridOptions', vmDual.gridOptions);
   }

   highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
      if (col.filters[0].term) {
         return 'header-filtered';
      }
      else {
         return '';
      }
   }

   arrayObjectIndexOf(myArray, searchTerm, property) {
      for (var i = 0, len = myArray.length; i < len; i++) {
         if (myArray[i][property] === searchTerm) {
            return i;
         }
      }
      return -1;
   }


}
