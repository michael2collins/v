import angular from 'angular';

export class ctrlDualList {
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
      vmDual.isCollapsed =true;
      vmDual.thecolumns = [];
      vmDual.selectedA = [];
      vmDual.selectedB = [];
      vmDual.userprefcols = [];
      vmDual.listA = [];
      vmDual.listB = [];
      vmDual.checkedA = false;
      vmDual.checkedB = false;

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
//         { id: 16, colname: 'InstructorPaymentFree', default: 'false' },
         { id: 16, colname: 'ContactType', default: 'false' },
         { id: 17, colname: 'InstructorFlag', default: 'false' },
         { id: 18, colname: 'quickbooklink', default: 'false' },
         { id: 19, colname: 'instructorTitle', default: 'false' },
         { id: 20, colname: 'sex', default: 'false' },
         { id: 21, colname: 'medicalConcerns', default: 'false' },
         { id: 22, colname: 'GuiSize', default: 'false' },
         { id: 23, colname: 'studentclassstatus', default: 'false' },
//         { id: 24, colname: 'LastPromoted', default: 'false' },
//         { id: 25, colname: 'currentrank', default: 'false' },
         { id: 24, colname: 'ranktype', default: 'false' }
      ];
      vmDual.items = vmDual.userData;


      vmDual.getUserPrefCols();
   }
   $onDestroy() {
      this.$log.debug("ctrlDualList dismissed");
      this.$log.debugEnabled(false);
   }

   getUserPrefCols() {
      var vmDual = this;
      vmDual.$log.debug('columns getUserPrefCols entered');
      return vmDual.StudentServices.getUserPrefCols(vmDual.userprefpath).then(function(data) {
         vmDual.$log.debug('columns getUserPrefCols returned data');
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



         return vmDual.userprefcols;
      });
   }

   submit() {
      var vmDual = this;
      vmDual.$log.debug('hit submit');
      vmDual.createUserPrefCols().then(function() {
         vmDual.$log.debug('createUserPrefCols ready to close');
      }).catch(function(e) {
         alert("try again", e);
      });
   }

   colreset() {
      var vmDual = this;
      vmDual.$log.debug('hit reset');
      vmDual.listA = [];
      vmDual.listB = [];
      var thisdta;
      var foundit;
      vmDual.$log.debug('dta:', vmDual.userData);

      for (var j = 0, lenu = vmDual.userData.length; j < lenu; j++) {
         vmDual.$log.debug("loop entered", vmDual.userData[j].default);
         foundit = false;
         if (vmDual.userData[j].default === "true") {
            thisdta = vmDual.userData.slice(j, j + 1)[0];
            vmDual.$log.debug('thisdta listA', thisdta);
            vmDual.listA.push(thisdta); //A is the list that we display
            foundit = true;
            continue; //skip as we found something
         }
         if (!foundit) {
            thisdta = vmDual.userData.slice(j, j + 1)[0];
            vmDual.listB.push(thisdta); //B gets the not matches
         }
      }
      vmDual.$log.debug('listA', vmDual.listA);


      vmDual.createUserPrefCols().then(function() {
         vmDual.$log.debug('createUserPrefCols ready to close');
      }).catch(function(e) {
         alert("try again", e);
      });
   }

   createUserPrefCols() {
      var vmDual = this;
      vmDual.$log.debug('about createUserPrefCols ', vmDual.listA);

      return vmDual.StudentServices.createUserPrefCols(vmDual.userprefpath, vmDual.listA)
         .then(function(data) {
            vmDual.$log.debug('createUserPrefCols returned data');
            vmDual.$log.debug(data);
            vmDual.thecolumns = data;
            vmDual.$log.debug(vmDual.thecolumns);
            vmDual.$log.debug(vmDual.thecolumns.message);
            vmDual.message = vmDual.thecolumns.message;
            vmDual.$window.location.reload();
            return vmDual.thecolumns;
         }).catch(function(e) {
            vmDual.$log.debug('createUserPrefCols failure:');
            vmDual.$log.debug("error", e);
            vmDual.message = e;
            vmDual.Notification.error({ message: e, delay: 5000 });
            throw e;
         });
   }

   arrayObjectIndexOf(myArray, searchTerm, property) {
      for (var i = 0, len = myArray.length; i < len; i++) {
         if (myArray[i][property] === searchTerm) {
            return i;
         }
      }
      return -1;
   }

   aToB(vm) {
      var vmDual = vm;
      vmDual.$log.debug('aToB');
      var i;
      for (i in vmDual.selectedA) {
         if (vmDual.selectedA.hasOwnProperty(i)) {
            var moveId = vmDual.arrayObjectIndexOf(vmDual.items, vmDual.selectedA[i], "id");
            vmDual.listB.push(vmDual.items[moveId]);
            var delId = vmDual.arrayObjectIndexOf(vmDual.listA, vmDual.selectedA[i], "id");
            vmDual.listA.splice(delId, 1);
         }
      }
      vmDual.reset();
   }

   bToA(vm) {
      var vmDual = vm;
      vmDual.$log.debug('bToA');
      var i;
      for (i in vmDual.selectedB) {
         if (vmDual.selectedB.hasOwnProperty(i)) {
            var moveId = vmDual.arrayObjectIndexOf(vmDual.items, vmDual.selectedB[i], "id");
            vmDual.listA.push(vmDual.items[moveId]);
            var delId = vmDual.arrayObjectIndexOf(vmDual.listB, vmDual.selectedB[i], "id");
            vmDual.listB.splice(delId, 1);
         }
      }
      vmDual.reset();
   }

   reset() {
      var vmDual = this;
      vmDual.selectedA = [];
      vmDual.selectedB = [];
      vmDual.toggle = 0;

   }

   toggleA() {
      var vmDual = this;
      var i;
      if (vmDual.selectedA.length > 0) {
         vmDual.selectedA = [];
      }
      else {
         for (i in vmDual.listA) {
            if (vmDual.listA.hasOwnProperty(i)) {
               vmDual.selectedA.push(vmDual.listA[i].id);
            }
         }
      }
   }

   toggleB() {
      var vmDual = this;
      var i;
      if (vmDual.selectedB.length > 0) {
         vmDual.selectedB = [];
      }
      else {
         for (i in vmDual.listB) {
            if (vmDual.listB.hasOwnProperty(i)) {
               vmDual.selectedB.push(vmDual.listB[i].id);
            }
         }
      }
   }

   drop(dragEl, dropEl, direction) {
      var vmDual = this;

      var drag = angular.element(dragEl);
      var drop = angular.element(dropEl);
      var id = drag.attr("id");
      var ela = document.getElementById(dragEl);
      var el = ela.getElementsByTagName("input");

      if (!angular.element(el).attr("checked")) {
         angular.element(el).triggerHandler('click');
      }

      direction(vmDual);
      vmDual.$scope.$digest();
   }

}
