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
      console.log('entering ModalPicListerController oninit');


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
      vmpicsearch.$log.debug("picselect student");
      vmpicsearch.$log.debug(vmpicsearch.student);
      vmpicsearch.student = vmpicsearch.PhotoServices.getTheStudent();
      vmpicsearch.getFiles();
   }


   getFiles() {
      var vmpicsearch = this;
      vmpicsearch.$log.debug('getfiles');
      return vmpicsearch.PhotoServices.getstudentPicFiles(vmpicsearch.picpath).then(function(data) {
         vmpicsearch.$log.debug('getstudentPicFiles returned data');
         vmpicsearch.$log.debug(data);
         vmpicsearch.picfileList = data;
         vmpicsearch.gridOptions.data = data.files;
         vmpicsearch.$timeout(function() {
            vmpicsearch.$log.debug('getfiles timeout');
            //         $log.debug(vmpicsearch.gridApi);
            if (vmpicsearch.gridApi.selection.selectRow) {
               //        vmpicsearch.gridApi.selection.getSelectedRows();
               vmpicsearch.$log.debug('selectRow');
               vmpicsearch.gridApi.selection.selectRow(vmpicsearch.gridOptions.data[0]);
            }
         });
         return vmpicsearch.picfileList;
      });
   }

   renameFile(student, currentpicfile) {
      var vmpicsearch = this;
      vmpicsearch.$log.debug('renameFile');
      vmpicsearch.$log.debug(' student:');
      vmpicsearch.$log.debug(student);
      vmpicsearch.$log.debug('pic');
      vmpicsearch.$log.debug(currentpicfile);

      return vmpicsearch.PhotoServices.renameStudentPicFile(
         vmpicsearch.renamepath, student, currentpicfile).then(function(data) {
         vmpicsearch.$log.debug('renameFile returned data');
         vmpicsearch.$log.debug(data);
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
            vmpicsearch.$log.debug('gridApi onRegisterApi', vmpicsearch.gridApi);
            //          $log.debug(gridApi);
            //          $log.debug(vmpicsearch);
            vmpicsearch.$log.debug(vmpicsearch.$scope);
            gridApi.selection.on.rowSelectionChanged(vmpicsearch.$scope, function(row) {
               var msg = 'row selected ' + row.entity.name;
               vmpicsearch.$log.debug(msg);
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
      vmpicsearch.$log.debug('hit ok');
      var thisstudent = vmpicsearch.PhotoServices.getTheStudent();
      vmpicsearch.okpicFile = vmpicsearch.PhotoServices.getstudentPicFile();
      vmpicsearch.okpicFile = vmpicsearch.renameFile(thisstudent, vmpicsearch.okpicFile);
      vmpicsearch.$log.debug('got file for ok:', vmpicsearch.okpicFile);
      vmpicsearch.$log.debug('for student:', thisstudent);

      vmpicsearch.$scope.$parent.$uibModalInstance.close(vmpicsearch.okpicFile);
   }

   cancel() {
      this.$scope.$parent.$uibModalInstance.dismiss('cancel');
   }

}
