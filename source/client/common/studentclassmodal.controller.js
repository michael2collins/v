export class ModalSetStudentClassController {
  constructor(
    $log, $uibModal, $controller, $scope, $window, $route, ClassServices, $attrs
  ) {
    'ngInject';
    this.$log = $log;
    this.ClassServices = ClassServices;
    this.$window = $window;
    this.$uibModal = $uibModal;
    this.$controller = $controller;
    this.$route = $route;
    this.$scope = $scope;
    this.$attrs = $attrs;
  }

  $onInit() {
    var vmsetclassmodal = this;

    vmsetclassmodal.animationsEnabled = true;

    vmsetclassmodal.classname = '';
    vmsetclassmodal.modalInstance = undefined;
 //   vmsetclassmodal.vmclass =
//      vmsetclassmodal.$controller('StudentClassController as $ctrl', { $scope: vmsetclassmodal.$scope });
    vmsetclassmodal.studentclass='';
      vmsetclassmodal.searchclass = vmsetclassmodal.$attrs.mode == "add" ? "fa fa-search" : "fas fa-pencil-alt";
      vmsetclassmodal.searchtext = vmsetclassmodal.$attrs.mode == "add" ? "Search" : "";

    vmsetclassmodal.init();
  
  }

  $onDestroy() {
    this.$log.log("ModalSetStudentClassController dismissed");
    //this.$log.logEnabled(false);
  }
  init() {
    var self = this;

    self.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      //self.$log.logEnabled(true);
      self.$log.log("ModalSetStudentClassController started");

    });

  }
  opensearch() {
    var vmsetclassmodal = this;
    vmsetclassmodal.$log.log('opensearch entered');
    var modalScope = vmsetclassmodal.$scope.$new();
    modalScope.vmclass = vmsetclassmodal.$scope.$parent.$ctrl;
    vmsetclassmodal.studentclassparent = vmsetclassmodal.$scope.$parent.$ctrl.studentclassparent;
    
    vmsetclassmodal.modalInstance = vmsetclassmodal.$uibModal.open({
      animation: vmsetclassmodal.animationsEnabled,
//      templateUrl: 'myClasssearch.html',
//      controller: 'StudentClassModalInstanceController as vmsearch',
      component: 'studentclassmodalinstComponent',
      //todo change to component
      scope: modalScope,
      size: 'lg',
      resolve: {
        classname: function() {
          vmsetclassmodal.$log.log("modal resolve", vmsetclassmodal.classname);
          return vmsetclassmodal.classname;
        }
      }

    });
    modalScope.modalInstance = vmsetclassmodal.modalInstance;

    vmsetclassmodal.modalInstance.result.then(function(result) {
      vmsetclassmodal.$log.log('search modalInstance result class:', result, vmsetclassmodal.$scope);
      vmsetclassmodal.$scope.$parent.$ctrl.studentclass = result;
      vmsetclassmodal.studentclass=result;
      vmsetclassmodal.update('studentclass', vmsetclassmodal.studentclassparent.studentclass);
    }, function() {
      vmsetclassmodal.$log.info('Modal dismissed at: ' + new Date());
    });

  }
    update(prop, value) {
        var vmclass=this;
           vmclass.onUpdate( {studentclassparent: vmclass.studentclassparent, prop: prop, value: vmclass.studentclassparent.studentclass});
  }
  
}
