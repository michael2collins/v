import angular from 'angular';

export class DataImportController {

    constructor(
        StudentServices, $scope, $log, Notification, portalDataService
    ) {
        'ngInject';

        this.StudentServices = StudentServices;
        this.$scope = $scope;
        this.$log = $log;
        this.Notification = Notification;
        this.portalDataService = portalDataService;
    }

    $onInit() {
        console.log('entering DataImportController oninit');
        this.$ = angular.element;
        var vm = this;

        vm.active = [];
        vm.activate();

    }

    $onDestroy() {
        this.$log.debug("dataimport dismissed");
        this.$log.debugEnabled(false);
    }

    activate() {
        var vm = this;

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("dataimport started");

        });

        vm.portalDataService.Portlet('dataimport.js');
        var thetab = vm.StudentServices.getActiveTab();
        vm.$log.debug('activate the active tab', thetab);
        vm.active = thetab;

    }

    setActiveTab(activeTab, thecaller) {
        var vm = this;
        vm.$log.debug('set activetab as:', activeTab, thecaller);
        vm.StudentServices.setActiveTab(activeTab, thecaller);

    }

    getActiveTab() {
        var vm = this;
        var atab = vm.StudentServices.getActiveTab();
        vm.$log.debug('get activetab is:', atab);
        return atab;
    }


}
