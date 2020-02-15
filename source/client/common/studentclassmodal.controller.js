export class ModalSetStudentClassController {
  constructor(
    $log, $uibModal, $controller, $scope, $window, $route, ClassServices, $attrs, $rootScope
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
    this.$rootScope = $rootScope;
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
//      vmsetclassmodal.disenable = true;
    vmsetclassmodal.init();
        vmsetclassmodal.$scope.$on('$viewContentLoaded', 
        function(event){ 
            vmsetclassmodal.disenable=vmsetclassmodal.$attrs.disenable;

        });
  
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
    var classcat = vmsetclassmodal.studentclassparent.$filter('filter')
      (vmsetclassmodal.studentclassparent.xlistnew.studentclasslist, 
        {class: vmsetclassmodal.$attrs.cls, 
         pgm: vmsetclassmodal.$attrs.pgm})[0].classcat[0][0];
    var pgmcat = vmsetclassmodal.studentclassparent.$filter('filter')
      (vmsetclassmodal.studentclassparent.xlistnew.studentclasslist, 
        {class: vmsetclassmodal.$attrs.cls, 
         pgm: vmsetclassmodal.$attrs.pgm})[0].pgmcat[0][0];
    var agecat = vmsetclassmodal.studentclassparent.$filter('filter')
      (vmsetclassmodal.studentclassparent.xlistnew.studentclasslist, 
        {class: vmsetclassmodal.$attrs.cls, 
         pgm: vmsetclassmodal.$attrs.pgm})[0].agecat[0][0];
    
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

    vmsetclassmodal.modalInstance.rendered.then(
        function(success) {
          vmsetclassmodal.$log.log('vmsetclassmodal ui rendered:', success);
          vmsetclassmodal.studentclassparent.catset(classcat);
          vmsetclassmodal.studentclassparent.pgmset(pgmcat);
          vmsetclassmodal.studentclassparent.ageset(agecat);
    //vmsetclassmodal.$rootScope.$broadcast('iso-init', {name:null, params:null});
//      vmsetclassmodal.studentclassparent.$scope.$emit('iso-method', { name: null, params: null });
//      vmsetclassmodal.studentclassparent.$scope.$emit('iso-method', { name: 'arrange', params: null });
        vmsetclassmodal.studentclassparent.reset(agecat,pgmcat,classcat);
      vmsetclassmodal.disenable = vmsetclassmodal.$attrs.disenable;
        
        },
        function(error) {
            vmsetclassmodal.$log.log('vmsetclassmodal ui failed to render, reason : ', error);
        }
    );


  }
    update(prop, value) {
        var vmclass=this;
           vmclass.onUpdate( {studentclassparent: vmclass.studentclassparent, prop: prop, value: vmclass.studentclassparent.studentclass});
  }
  
}
