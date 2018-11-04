//import angular from 'angular';

export class ModalPicSearchController {

   constructor(
      $scope, $log, PhotoServices, $route

   ) {
      'ngInject';
      this.$scope = $scope;
      this.$log = $log;
      this.PhotoServices = PhotoServices;
      this.$route = $route;
      this.picfile = $scope.$parent.$resolve.picfile;

   }
   $onInit() {
      console.log('entering ModalPicSearchController oninit');
      var vmpicselect = this;
      vmpicselect.picfilelist = [];
      vmpicselect.picpath = '../v1/studentfiles';
      vmpicselect.renamepath = '../v1/renamefile';
      vmpicselect.student = {};
      vmpicselect.newpicfile = '';
      vmpicselect.okpicFile = '';
      vmpicselect.activate();
   }


   activate() {
      var vmpicselect = this;
      vmpicselect.$log.debug("picselect student");
      vmpicselect.$log.debug(vmpicselect.student);
      vmpicselect.student = vmpicselect.PhotoServices.getTheStudent();
   }


   renameFile(student, currentpicfile) {
      var vmpicselect = this;
      vmpicselect.$log.debug('renameFile');
      vmpicselect.$log.debug(' student:');
      vmpicselect.$log.debug(student);
      vmpicselect.$log.debug('pic');
      vmpicselect.$log.debug(currentpicfile);

      return vmpicselect.PhotoServices.renameStudentPicFile(vmpicselect.renamepath, student, currentpicfile).then(function(data) {
         vmpicselect.$log.debug('renameFile returned data');
         vmpicselect.$log.debug(data);
         vmpicselect.newpicfile = data.newpicfile;
         return vmpicselect.newpicfile;
      });
   }


   ok() {
      var vmpicselect = this;
      vmpicselect.$log.debug('hit ok');
      var thisstudent = vmpicselect.PhotoServices.getTheStudent();
      vmpicselect.okpicFile = vmpicselect.PhotoServices.getstudentPicFile();
      vmpicselect.okpicFile = vmpicselect.renameFile(thisstudent, vmpicselect.okpicFile);
      vmpicselect.$log.debug('got file for ok:', vmpicselect.okpicFile);
      vmpicselect.$log.debug('for student:', thisstudent);

      vmpicselect.$scope.$parent.$uibModalInstance.close(vmpicselect.okpicFile);
   }

   cancel() {
      this.$scope.$parent.$uibModalInstance.dismiss('cancel');
   }

}
