(function () {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalPicUploadController', ModalPicUploadController)
    .controller('ModalPicInstanceController', ModalPicInstanceController)
    .controller('ModalPicInstance2Controller', ModalPicInstance2Controller);


  ModalPicUploadController.$inject = [
      '$scope',
      '$log',
      '$uibModal'
    ];
  ModalPicInstanceController.$inject = [
      '$scope',
      '$log',
      '$uibModalInstance',
      'picfile',
      'StudentServices',
      '$route'
    ];
  ModalPicInstance2Controller.$inject = [
      '$scope',
      '$log',
      '$uibModalInstance',
      'picfile',
      'StudentServices',
      'uiGridConstants',
      '$timeout',
      '$route'
    ];


  function ModalPicUploadController($scope,  $log, $uibModal) {
    /* jshint validthis: true */
    var vmpicmodal = this;

    vmpicmodal.animationsEnabled = true;

    vmpicmodal.openpick = openpick;
    vmpicmodal.opensearch = opensearch;
    vmpicmodal.pic = ''; //or should we get this from the db
    vmpicmodal.student = '';
    vmpicmodal.modalInstance = undefined;

    function openpick() {

      vmpicmodal.modalInstance = $uibModal.open({
        animation: vmpicmodal.animationsEnabled,
        templateUrl: 'myPickupload.html',
        controller: 'ModalPicInstanceController as vmpicselect',
        size: 'lg',
        resolve: {
          picfile: function () {
            return vmpicmodal.picFile;
          }
        }
      });
      vmpicmodal.modalInstance.result.then(function (selectedpic, student) {
          console.log('pick upload modalInstance result picfile:', selectedpic);
        vmpicmodal.picfile = selectedpic;
        vmpicmodal.student = student;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }
    

    function opensearch() {

      vmpicmodal.modalInstance = $uibModal.open({
        animation: vmpicmodal.animationsEnabled,
        templateUrl: 'myPicksearch.html',
        controller: 'ModalPicInstance2Controller as vmpicsearch',
        size: 'lg',
        resolve: {
          picfile: function () {
            return vmpicmodal.picFile;
          }
        }
      });
      vmpicmodal.modalInstance.result.then(function (selectedpic, student) {
          console.log('picsearch modalInstance result picfile:', selectedpic);
        
        vmpicmodal.picfile = selectedpic;
        vmpicmodal.student = student;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    }
  }

  function ModalPicInstanceController($scope, $log, $uibModalInstance, picfile, StudentServices, $route) {
    /* jshint validthis: true */
    var vmpicselect = this;
    vmpicselect.ok = ok;
    vmpicselect.cancel = cancel;
    vmpicselect.picfile = picfile;
    vmpicselect.picfilelist = [];
    vmpicselect.renameFile = renameFile;
    vmpicselect.picpath = '../v1/studentfiles';
    vmpicselect.renamepath = '../v1/renamefile';
    vmpicselect.student = StudentServices.getTheStudent();
    vmpicselect.newpicfile = '';
    vmpicselect.okpicFile = '';


    activate();

    function activate() {
      console.log("picselect student");
      console.log(vmpicselect.student);
    }


    function renameFile(student, currentpicfile) {
      console.log('renameFile');
      console.log(' student:' );
      console.log(student);
      console.log('pic');
      console.log(currentpicfile);

      return StudentServices.renameStudentPicFile(vmpicselect.renamepath, student, currentpicfile).then(function (data) {
        $log.debug('renameFile returned data');
        $log.debug(data.data);
        vmpicselect.newpicfile = data.data.newpicfile;
        return vmpicselect.newpicfile;
      });
    }


    function ok() {
      console.log('hit ok');
      var thisstudent = StudentServices.getTheStudent();
      vmpicselect.okpicFile = StudentServices.getstudentPicFile();
      vmpicselect.okpicFile = renameFile(thisstudent, vmpicselect.okpicFile);
      console.log('got file for ok:', vmpicselect.okpicFile);
      console.log('for student:' ,thisstudent);

      $uibModalInstance.close(vmpicselect.okpicFile, thisstudent);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }


  function ModalPicInstance2Controller($scope, $log, $uibModalInstance, picfile, StudentServices, uiGridConstants, $timeout, $route) {
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
    vmpicsearch.student = StudentServices.getTheStudent();
    vmpicsearch.newpicfile = '';
    vmpicsearch.okpicFile = '';
    vmpicsearch.highlightFilteredHeader = highlightFilteredHeader;
    vmpicsearch.gridApi = undefined;

    activate();
    setGridOptions();

    function activate() {
        console.log("picselect student");
        console.log(vmpicsearch.student);
        getFiles();
    }


    function getFiles() {
      console.log('getfiles');
      return StudentServices.getstudentPicFiles(vmpicsearch.picpath).then(function (data) {
        $log.debug('getstudentPicFiles returned data');
        $log.debug(data.data);
        vmpicsearch.picfileList = data.data;
        vmpicsearch.gridOptions.data = data.data.files;
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
      console.log('renameFile');
      console.log(' student:' );
      console.log(student);
      console.log('pic');
      console.log(currentpicfile);

      return StudentServices.renameStudentPicFile(vmpicsearch.renamepath, student, currentpicfile).then(function (data) {
        $log.debug('renameFile returned data');
        $log.debug(data.data);
        vmpicsearch.newpicfile = data.data.newpicfile;
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
                    console.log('gridApi onRegisterApi',vmpicsearch.gridApi);
        //          console.log(gridApi);
        //          console.log(vmpicsearch);
                console.log($scope);
                    gridApi.selection.on.rowSelectionChanged($scope,function(row){
                        var msg = 'row selected ' + row.entity.name;
                        console.log(msg);
                        StudentServices.setstudentPicFile(row.entity.name);

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
      console.log('hit ok');
      var thisstudent = StudentServices.getTheStudent();
      vmpicsearch.okpicFile = StudentServices.getstudentPicFile();
      vmpicsearch.okpicFile = renameFile(thisstudent, vmpicsearch.okpicFile);
      console.log('got file for ok:', vmpicsearch.okpicFile);
      console.log('for student:' ,thisstudent);

      $uibModalInstance.close(vmpicsearch.okpicFile, thisstudent);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }
 
})();
