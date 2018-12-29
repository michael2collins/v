export class StudentClassModalInstanceController {
  constructor(
    $log, $scope, $controller, $route, StudentServices
  ) {
    'ngInject';
    this.$log = $log;
    this.StudentServices = StudentServices;
    this.$controller = $controller;
    this.$route = $route;
    this.$scope = $scope;
    this.classname = $scope.$parent.$resolve.classname;
    this.vmclass = $scope.$parent.$parent.vmclass;
  }

  $onInit() {
    var vmsearch = this;

//    vmsearch.vmclass = 
//      vmsearch.$controller('StudentClassController as vmclass', { $scope: vmsearch.$scope });

  }

  $onDestroy() {
    this.$log.debug("StudentClassModalInstanceController dismissed");
    this.$log.debugEnabled(false);
  }

  closemodal(contactid, classid, pgmid) {
    var vmsearch = this;
    vmsearch.$log.debug('hit close', contactid, classid, pgmid);
    vmsearch.$log.debug('got classname for close:', vmsearch.vmclass.studentclass);

    vmsearch.vmclass.studentclass = vmsearch.vmclass.getClassPgm(classid, pgmid);
    vmsearch.$log.debug('got class for close:', vmsearch.vmclass.studentclass);

    vmsearch.$scope.$parent.$uibModalInstance.close(vmsearch.vmclass.studentclass);

  }


}