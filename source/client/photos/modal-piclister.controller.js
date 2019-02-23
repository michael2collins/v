//import angular from 'angular';

export class ModalPicListerController {

   constructor(
      $scope, $log, PhotoServices, uiGridConstants, $timeout, $route, Util

   ) {
      'ngInject';
      this.$scope = $scope;
      this.$log = $log;
      this.PhotoServices = PhotoServices;
      this.uiGridConstants = uiGridConstants;
      this.$timeout = $timeout;
      this.$route = $route;
      this.picfile = $scope.$parent.$resolve.picfile;
      this.Util = Util;
   }
   $onInit() {

      var vmpicsearch = this;
      vmpicsearch.picfilelist = [];
      vmpicsearch.picpath = '../v1/studentfiles';
      vmpicsearch.renamepath = '../v1/renamefile';
      vmpicsearch.student = {};
      vmpicsearch.newpicfile = '';
      vmpicsearch.okpicFile = '';
      vmpicsearch.gridApi = undefined;

      vmpicsearch.activate();
      vmpicsearch.setGridOptions();
   }
   activate() {
      var vmpicsearch = this;
      vmpicsearch.$log.log("picselect student");
      vmpicsearch.$log.log(vmpicsearch.student);
      vmpicsearch.student = vmpicsearch.PhotoServices.getTheStudent();
      vmpicsearch.getFiles();
   }


   getFiles() {
      var vmpicsearch = this;
      vmpicsearch.$log.log('getfiles');
      return vmpicsearch.PhotoServices.getstudentPicFiles(vmpicsearch.picpath).then(function(data) {
         vmpicsearch.$log.log('getstudentPicFiles returned data');
         vmpicsearch.$log.log(data);
         vmpicsearch.picfileList = data;
         vmpicsearch.gridOptions.data = data.files;
         vmpicsearch.$timeout(function() {
            vmpicsearch.$log.log('getfiles timeout');
            //         $log.log(vmpicsearch.gridApi);
            if (vmpicsearch.gridApi.selection.selectRow) {
               //        vmpicsearch.gridApi.selection.getSelectedRows();
               vmpicsearch.$log.log('selectRow');
               vmpicsearch.gridApi.selection.selectRow(vmpicsearch.gridOptions.data[0]);
            }
         });
         return vmpicsearch.picfileList;
      });
   }

   renameFile(student, currentpicfile) {
      var vmpicsearch = this;
      vmpicsearch.$log.log('renameFile');
      vmpicsearch.$log.log(' student:');
      vmpicsearch.$log.log(student);
      vmpicsearch.$log.log('pic');
      vmpicsearch.$log.log(currentpicfile);

      return vmpicsearch.PhotoServices.renameStudentPicFile(
         vmpicsearch.renamepath, student, currentpicfile).then(function(data) {
         vmpicsearch.$log.log('renameFile returned data');
         vmpicsearch.$log.log(data);
         vmpicsearch.newpicfile = data.newpicfile;
         return vmpicsearch.newpicfile;
      });
   }

   setGridOptions() {
      var vmpicsearch = this;
      vmpicsearch.gridOptions = {
         enableFiltering: true,
         enableRowSelection: true,
         enableSelectAll: false,
         multiSelect: false,
         rowHeight: 128,
         showGridFooter: true,
         onRegisterApi: function(gridApi) {
            //set gridApi on scope
            vmpicsearch.gridApi = gridApi;
            vmpicsearch.$log.log('gridApi onRegisterApi', vmpicsearch.gridApi);
            //          $log.log(gridApi);
            //          $log.log(vmpicsearch);
            vmpicsearch.$log.log(vmpicsearch.$scope);
            gridApi.selection.on.rowSelectionChanged(vmpicsearch.$scope, function(row) {
               var msg = 'row selected ' + row.entity.name;
               vmpicsearch.$log.log(msg);
               vmpicsearch.PhotoServices.setstudentPicFile(row.entity.name);

            });
         },
         paginationPageSizes: [3, 50, 100],
         paginationPageSize: 3,
         columnDefs: [
            // default
            {
               field: 'name',
               headerCellClass: vmpicsearch.Util.highlightFilteredHeader,
               enableCellEdit: false
            }, {
               field: 'size',
               headerCellClass: vmpicsearch.Util.highlightFilteredHeader,
               enableCellEdit: false
            }, {
               field: 'modtime',
               headerCellClass: vmpicsearch.Util.highlightFilteredHeader,
               enableCellEdit: false
            }, {
               name: 'picture',
               field: 'name',
               headerCellClass: vmpicsearch.Util.highlightFilteredHeader,
               enableCellEdit: false,
               cellTemplate: '<div class="ui-grid-cell-contents"><span> <img width="80px" ng-src="./images/students/{{grid.getCellValue(row, col)}}"/></span></div>'
            }

         ]
      };

   }



   ok() {
      var vmpicsearch = this;
      vmpicsearch.$log.log('hit ok');
      var thisstudent = vmpicsearch.PhotoServices.getTheStudent();
      vmpicsearch.okpicFile = vmpicsearch.PhotoServices.getstudentPicFile();
      vmpicsearch.okpicFile = vmpicsearch.renameFile(thisstudent, vmpicsearch.okpicFile);
      vmpicsearch.$log.log('got file for ok:', vmpicsearch.okpicFile);
      vmpicsearch.$log.log('for student:', thisstudent);

      vmpicsearch.$scope.$parent.$uibModalInstance.close(vmpicsearch.okpicFile);
   }

   cancel() {
      this.$scope.$parent.$uibModalInstance.dismiss('cancel');
   }

}
