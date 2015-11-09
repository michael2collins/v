(function () {
    'use strict';

    angular
        .module('ng-admin')
        .controller('StudentUploadController', StudentUploadController);
    StudentUploadController.$inject = [
    '$scope',
    '$log',
        'FileUploader',
      'StudentServices'
    ];

    function StudentUploadController($scope, $log, FileUploader, StudentServices) {
        /* jshint validthis: true */
        var vmstupicupload = this;
      vmstupicupload.picfile = '';

        vmstupicupload.uploader = new FileUploader({
            url: '../v1/upload.php'
        });
        // FILTERS

        vmstupicupload.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

//        vmstupicupload.uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/ , filter, options) {
//            console.info('onWhenAddingFileFailed', item, filter, options);
//        };
/*        vmstupicupload.uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        vmstupicupload.uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        vmstupicupload.uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        vmstupicupload.uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        vmstupicupload.uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
  */      vmstupicupload.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
          vmstupicupload.picfile = fileItem.file.name;
          StudentServices.setstudentPicFile(vmstupicupload.picfile);
        };
        vmstupicupload.uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        vmstupicupload.uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
/*        vmstupicupload.uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        vmstupicupload.uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };
*/
        console.info('uploader', vmstupicupload.uploader);

    }
})();
