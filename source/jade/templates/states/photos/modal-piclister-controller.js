(function (window, angular) {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalPicListerController', ModalPicListerController);


  ModalPicListerController.$inject = [
      '$scope',
      '$log',
      '$uibModalInstance',
      'picfile',
      'PhotoServices',
      'uiGridConstants',
      '$timeout',
      '$route'
    ];

  function ModalPicListerController($scope, $log, $uibModalInstance, picfile, PhotoServices, uiGridConstants, $timeout, $route) {
    /* jshint validthis: true */
    var vmpicsearch = this;
    vmpicsearch.ok = ok;
    vmpicsearch.cancel = cancel;
    vmpicsearch.picfile = picfile;
    vmpicsearch.picfilelist = [];
    vmpicsearch.getFiles = getFiles;
    vmpicsearch.renameFile = renameFile;
    vmpicsearch.picpath = '../v1/studentfiles';
    vmpicsearch.renamepath = '../v1/renamefile';
    vmpicsearch.student = PhotoServices.getTheStudent();
    vmpicsearch.newpicfile = '';
    vmpicsearch.okpicFile = '';
    vmpicsearch.highlightFilteredHeader = highlightFilteredHeader;
    vmpicsearch.gridApi = undefined;

    activate();
    setGridOptions();

    function activate() {
        $log.debug("picselect student");
        $log.debug(vmpicsearch.student);
        getFiles();
    }


    function getFiles() {
      $log.debug('getfiles');
      return PhotoServices.getstudentPicFiles(vmpicsearch.picpath).then(function (data) {
        $log.debug('getstudentPicFiles returned data');
        $log.debug(data);
        vmpicsearch.picfileList = data;
        vmpicsearch.gridOptions.data = data.files;
        $timeout(function() {
            $log.debug('getfiles timeout');
   //         $log.debug(vmpicsearch.gridApi);
            if(vmpicsearch.gridApi.selection.selectRow){
        //        vmpicsearch.gridApi.selection.getSelectedRows();
                $log.debug('selectRow');
              vmpicsearch.gridApi.selection.selectRow(vmpicsearch.gridOptions.data[0]);
            }
        });
        return vmpicsearch.picfileList;
      }); 
    }

    function renameFile(student, currentpicfile) {
      $log.debug('renameFile');
      $log.debug(' student:' );
      $log.debug(student);
      $log.debug('pic');
      $log.debug(currentpicfile);

      return PhotoServices.renameStudentPicFile(vmpicsearch.renamepath, student, currentpicfile).then(function (data) {
        $log.debug('renameFile returned data');
        $log.debug(data);
        vmpicsearch.newpicfile = data.newpicfile;
        return vmpicsearch.newpicfile;
      });
    }

   function setGridOptions() {
            vmpicsearch.gridOptions = {
            enableFiltering: true,
            enableRowSelection: true,
            enableSelectAll: false,
            multiSelect: false,
            rowHeight: 128,
            showGridFooter: true,
            onRegisterApi: function( gridApi ) {
                  //set gridApi on scope
                vmpicsearch.gridApi = gridApi;
                    $log.debug('gridApi onRegisterApi',vmpicsearch.gridApi);
        //          $log.debug(gridApi);
        //          $log.debug(vmpicsearch);
                $log.debug($scope);
                    gridApi.selection.on.rowSelectionChanged($scope,function(row){
                        var msg = 'row selected ' + row.entity.name;
                        $log.debug(msg);
                        PhotoServices.setstudentPicFile(row.entity.name);
      
                  });
            },
            paginationPageSizes: [3, 50, 100],
            paginationPageSize: 3,
            columnDefs: [
                // default
                {
                    field: 'name',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'size',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'modtime',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {name: 'picture',
                    field: 'name', 
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <img width="80px" ng-src="./images/students/{{grid.getCellValue(row, col)}}"/></span></div>'
                }
                
            ]};

        }

    function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }


    function ok() {
      $log.debug('hit ok');
      var thisstudent = PhotoServices.getTheStudent();
      vmpicsearch.okpicFile = PhotoServices.getstudentPicFile();
      vmpicsearch.okpicFile = renameFile(thisstudent, vmpicsearch.okpicFile);
      $log.debug('got file for ok:', vmpicsearch.okpicFile);
      $log.debug('for student:' ,thisstudent);

      $uibModalInstance.close(vmpicsearch.okpicFile);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }
 
})(window, window.angular);
