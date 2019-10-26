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
   renameFile(student, currentpicfile) {
      var vmstupicupload = this;
      vmstupicupload.$log.log('renameFile');
      vmstupicupload.$log.log(' student:');
      vmstupicupload.$log.log(student);
      vmstupicupload.$log.log('pic');
      vmstupicupload.$log.log(currentpicfile);

      return vmstupicupload.PhotoServices.renameStudentPicFile(vmstupicupload.renamepath, student, currentpicfile).then(function(data) {
         vmstupicupload.$log.log('renameFile returned data');
         vmstupicupload.$log.log(data);
         vmstupicupload.newpicfile = data.newpicfile;
         return vmstupicupload.newpicfile;
      });
   }

   ok() {
      var vmstupicupload = this;
      vmstupicupload.$log.log('hit ok');
      var thisstudent = vmstupicupload.PhotoServices.getTheStudent();
      vmstupicupload.picfile = vmstupicupload.PhotoServices.getstudentPicFile();
      vmstupicupload.picfile = vmstupicupload.renameFile(thisstudent, vmstupicupload.picfile);
      vmstupicupload.$log.log('got file for ok:', vmstupicupload.picfile);
//      vmstupicupload.$log.log('for student:', thisstudent);

      vmstupicupload.$scope.$parent.$uibModalInstance.close(vmstupicupload.picfile);
   }

   cancel() {
      this.$scope.$parent.$uibModalInstance.dismiss('cancel');
   }

}
