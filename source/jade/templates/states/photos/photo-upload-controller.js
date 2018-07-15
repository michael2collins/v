(function (window,angular) {
    'use strict';

    angular
        .module('ng-admin.all')
        .controller('PhotoUploadController', PhotoUploadController);
    PhotoUploadController.$inject = [
    '$scope',
    '$log',
        'FileUploader',
      'PhotoServices'
    ];

    function PhotoUploadController($scope, $log, FileUploader, PhotoServices) {
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

        vmstupicupload.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
          vmstupicupload.picfile = fileItem.file.name;
          PhotoServices.setstudentPicFile(vmstupicupload.picfile);
        };
        vmstupicupload.uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        vmstupicupload.uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        console.info('uploader', vmstupicupload.uploader);

    }
})(window,window.angular);
