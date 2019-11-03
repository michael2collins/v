//import angular from 'angular';

export class ModalPicSearchController {

   constructor(
      $scope, $log, PhotoServices, $route, PhotoUtil

   ) {
      'ngInject';
      this.$scope = $scope;
      this.$log = $log;
      this.PhotoServices = PhotoServices;
      this.$route = $route;
      this.picfile = $scope.$parent.$resolve.picfile;
      this.PhotoUtil = PhotoUtil;
   }
   $onInit() {
      var vmpicselect = this;
      vmpicselect.picfilelist = [];
      vmpicselect.path = vmpicselect.PhotoUtil.getPath(vmpicselect.dataToPass.type);

      vmpicselect.picpath = '../v1/studentfiles' + '?type=' + vmpicselect.dataToPass.type;

      vmpicselect.renamepath = '../v1/renamefile';
      vmpicselect.student = {};
      vmpicselect.newpicfile = '';
      vmpicselect.okpicFile = '';
      vmpicselect.activate();
   }


   activate() {
      var vmpicselect = this;
      vmpicselect.$log.log("picselect student");
      vmpicselect.$log.log(vmpicselect.student);
      vmpicselect.student = vmpicselect.PhotoServices.getTheStudent();
   }


   renameFile(student, currentpicfile) {
      var vmpicselect = this;
      vmpicselect.$log.log('renameFile');
      vmpicselect.$log.log(' student:');
      vmpicselect.$log.log(student);
      vmpicselect.$log.log('pic');
      vmpicselect.$log.log(currentpicfile);

      return vmpicselect.PhotoServices.renameStudentPicFile(vmpicselect.renamepath, student, currentpicfile).then(function(data) {
         vmpicselect.$log.log('renameFile returned data');
         vmpicselect.$log.log(data);
         vmpicselect.newpicfile = data.newpicfile;
         return vmpicselect.newpicfile;
      });
   }


   ok() {
      var vmpicselect = this;
      vmpicselect.$log.log('hit ok');
      var thisstudent = vmpicselect.PhotoServices.getTheStudent();
      vmpicselect.okpicFile = vmpicselect.PhotoServices.getstudentPicFile();
      vmpicselect.okpicFile = vmpicselect.renameFile(thisstudent, vmpicselect.okpicFile);
      vmpicselect.$log.log('got file for ok:', vmpicselect.okpicFile);
      vmpicselect.$log.log('for student:', thisstudent);

      vmpicselect.$scope.$parent.$uibModalInstance.close(vmpicselect.okpicFile);
   }

   cancel() {
      this.$scope.$parent.$uibModalInstance.dismiss('cancel');
   }

}
