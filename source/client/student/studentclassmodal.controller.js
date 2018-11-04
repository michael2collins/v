export class ModalSetStudentClassController {
  constructor(
    $log, $uibModal, $controller, $scope, $window, $route, ClassServices
  ) {
    'ngInject';
    this.$log = $log;
    this.ClassServices = ClassServices;
    this.$window = $window;
    this.$uibModal = $uibModal;
    this.$controller = $controller;
    this.$route = $route;
    this.$scope = $scope;
  }

  $onInit() {
    var vmsetclassmodal = this;

    vmsetclassmodal.animationsEnabled = true;

    vmsetclassmodal.classname = '';
    vmsetclassmodal.modalInstance = undefined;
    vmsetclassmodal.vmclass =
      vmsetclassmodal.$controller('StudentClassController as $ctrl', { $scope: vmsetclassmodal.$scope });

    vmsetclassmodal.init();

  }

  $onDestroy() {
    this.$log.debug("ModalSetStudentClassController dismissed");
    this.$log.debugEnabled(false);
  }
  init() {
    var self = this;
    self.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
      self.$log.debugEnabled(true);
      self.$log.debug("ModalSetStudentClassController started");

    });

  }
  opensearch() {
    var vmsetclassmodal = this;
    vmsetclassmodal.$log.debug('opensearch entered');
    var modalScope = vmsetclassmodal.$scope.$new();
    modalScope.vmclass = vmsetclassmodal.$scope.$parent.$ctrl;


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
          vmsetclassmodal.$log.debug("modal resolve", vmsetclassmodal.classname);
          return vmsetclassmodal.classname;
        }
      }

    });
    modalScope.modalInstance = vmsetclassmodal.modalInstance;

    vmsetclassmodal.modalInstance.result.then(function(result) {
      vmsetclassmodal.$log.debug('search modalInstance result class:', result, vmsetclassmodal.$scope);
      vmsetclassmodal.$scope.$parent.$ctrl.studentclass = result;
    }, function() {
      vmsetclassmodal.$log.info('Modal dismissed at: ' + new Date());
    });

  }
}
