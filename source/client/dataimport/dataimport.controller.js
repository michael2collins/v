import angular from 'angular';

export class DataImportController {

    constructor(
        StudentServices, $scope, $log, Notification, portalDataService,UserServices
    ) {
        'ngInject';

        this.StudentServices = StudentServices;
        this.$scope = $scope;
        this.$log = $log;
        this.Notification = Notification;
        this.portalDataService = portalDataService;
        this.UserServices = UserServices;
    }

    $onInit() {
        this.$ = angular.element;
        var vm = this;

        vm.active = [];
        vm.activate();

    }

    $onDestroy() {
        this.$log.log("dataimport dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('DataImportController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("dataimport started");

        });

//        vm.portalDataService.Portlet('dataimport.js');
        var thetab = vm.StudentServices.getActiveTab();
        vm.$log.log('activate the active tab', thetab);
        vm.active = thetab;

    }

    setActiveTab(activeTab, thecaller) {
        var vm = this;
        vm.$log.log('set activetab as:', activeTab, thecaller);
        vm.StudentServices.setActiveTab(activeTab, thecaller);

    }

    getActiveTab() {
        var vm = this;
        var atab = vm.StudentServices.getActiveTab();
        vm.$log.log('get activetab is:', atab);
        return atab;
    }


}
