export class PhotoUploadController {

    constructor(
        $scope, $log, FileUploader, PhotoServices

    ) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;
        this.PhotoServices = PhotoServices;
        this.FileUploader = FileUploader;

    }
    $onInit() {
        console.log('entering PhotoUploadController oninit');
        var vmstupicupload = this;
        vmstupicupload.picfile = '';
        vmstupicupload.activate();
    }
    activate() {
        var vmstupicupload = this;
        vmstupicupload.uploader = new vmstupicupload.FileUploader({
            url: '../v1/upload.php'
        });
        // FILTERS

        vmstupicupload.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        vmstupicupload.uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            vmstupicupload.picfile = fileItem.file.name;
            vmstupicupload.PhotoServices.setstudentPicFile(vmstupicupload.picfile);
        };
        vmstupicupload.uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        vmstupicupload.uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        console.info('uploader', vmstupicupload.uploader);
    }


}
