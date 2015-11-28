(function () {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalPicUploadController', ModalPicUploadController)
    .controller('ModalPicInstanceController', ModalPicInstanceController);


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
      'StudentServices'
    ];


  function ModalPicUploadController($scope,  $log, $uibModal) {
    /* jshint validthis: true */
    var vmpicmodal = this;

    vmpicmodal.animationsEnabled = true;

    vmpicmodal.open = open;
    vmpicmodal.pic = ''; //or should we get this from the db
    vmpicmodal.student = '';
    vmpicmodal.modalInstance = undefined;
    vmpicmodal.somestud = $scope;

    function open() {

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
        vmpicmodal.picfile = selectedpic;
        vmpicmodal.student = student;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

  }

  function ModalPicInstanceController($scope, $log, $uibModalInstance, picfile, StudentServices) {
    /* jshint validthis: true */
    var vmpicselect = this;
    vmpicselect.ok = ok;
    vmpicselect.cancel = cancel;
    vmpicselect.picfile = picfile;
    vmpicselect.picfilelist = [];
    vmpicselect.getFiles = getFiles;
    vmpicselect.renameFile = renameFile;
    vmpicselect.picpath = '../v1/studentfiles';
    vmpicselect.renamepath = '../v1/renamefile';
    vmpicselect.student = StudentServices.getTheStudent();
    vmpicselect.newpicfile = '';
    vmpicselect.okpicFile = '';
    vmpicselect.highlightFilteredHeader = highlightFilteredHeader;


    activate();
    setGridOptions();

    function activate() {
      console.log("picselect student");
      console.log(vmpicselect.student);
      getFiles();
    }

    function getFiles() {
      console.log('getfiles');
      return StudentServices.getstudentPicFiles(vmpicselect.picpath).then(function (data) {
        $log.debug('getstudentPicFiles returned data');
        $log.debug(data.data);
        vmpicselect.picfileList = data.data;
        vmpicselect.gridOptions.data = data.data.files;
        
        return vmpicselect.picfileList;
      }); 
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

   function setGridOptions() {
            vmpicselect.gridOptions = {
            enableFiltering: true,
            enableRowSelection: true,
            enableSelectAll: false,
            paginationPageSizes: [10, 50, 100],
            paginationPageSize: 10,
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

})();
