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
    this.$log.log("StudentClassModalInstanceController dismissed");
    //this.$log.logEnabled(false);
  }

  closemodal(contactid, classid, pgmid) {
    var vmsearch = this;
    vmsearch.$log.log('hit close', contactid, classid, pgmid);
    vmsearch.$log.log('got classname for close:', vmsearch.vmclass.studentclass);

    vmsearch.vmclass.studentclass = vmsearch.vmclass.getClassPgm(classid, pgmid);
    vmsearch.$log.log('got class for close:', vmsearch.vmclass.studentclass);

    vmsearch.$scope.$parent.$uibModalInstance.close(vmsearch.vmclass.studentclass);

  }


}
