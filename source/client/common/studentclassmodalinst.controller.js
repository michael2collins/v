export class StudentClassModalInstanceController {
  constructor(
    $log, $scope, $controller, $route, StudentServices,$attrs
  ) {
    'ngInject';
    this.$log = $log;
    this.StudentServices = StudentServices;
    this.$controller = $controller;
    this.$route = $route;
    this.$scope = $scope;
    this.classname = $scope.$parent.$resolve.classname;
    this.vmclass = $scope.$parent.$parent.vmclass;
        this.$attrs = $attrs;
  }

  $onInit() {
    var vmsearch = this;
      vmsearch.showpics = true;
      vmsearch.showlist = false;
        vmsearch.$scope.$on('$viewContentLoaded', 
        function(event){ 
            vmsearch.disenable=vmsearch.$attrs.disenable;

        });
      
//    vmsearch.vmclass = 
//      vmsearch.$controller('StudentClassController as vmclass', { $scope: vmsearch.$scope });

  }

  $onDestroy() {
    this.$log.log("StudentClassModalInstanceController dismissed");
    //this.$log.logEnabled(false);
  }
   list() { //switching to pics when clicked
      var vm = this;
      vm.showpics = true;
      vm.showlist = false;
      vm.$log.log('list', vm.showlist);

   }
   pics() { //switching to list when clicked
      var vm = this;
      vm.showpics = false;
      vm.showlist = true;
      vm.$log.log('pics', vm.showpics);

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
