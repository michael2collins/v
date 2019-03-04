const { jQuery: $ } = window;

export class BreadcrumbController {

    constructor(
        $scope,
        userServices,
        portalDataService,
        $log,
        UserServices
    ) {
        'ngInject';

        this.$scope = $scope;
        this.UserServices = userServices;
        this.$log = $log;
        this.portalDataService = portalDataService;
        this.UserServices = UserServices;

    }


    $onInit() {
        var vm = this;
        vm.$log.log("breadcrumb controller entered");
        vm.userdta = { 'initial': 'init' };
        vm.data = null;
        vm.init();

    }

    $onDestroy() {
        this.$log.log("breadcrumb dismissed");
        //this.$log.logEnabled(false);
    }

    init() {
        var vm = this;

        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('BreadcrumbController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            if (event == undefined) {
                return;
            }
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            if (current.originalPath !== '/page-signin') {
                vm.$log.log('routechange in breadcrumb for success');
                vm.data = vm.portalDataService.get(current.originalPath);
                    $("[data-toggle='offcanvas']").click();
                vm.isokf();
                vm.getUserDetails().then(function() {
                    vm.$log.log('q return   getUserDetails returned');
                });
            }
            else {
                event.preventDefault();
            }
        });

    }

    getUserDetails() {
        var vm = this;

        vm.$log.log('breadcrumb controller getUserDetails entered');
        return vm.UserServices.getUserDetails().then(function(data) {
                vm.$log.log("breadcrumb controller service getuserdetails returned:", data);
                vm.userdta = data;
                return vm.userdta;
            },

            function(error) {
                vm.$log.log('Caught an error getUserDetails, going to notify:', error);
                vm.userdta = [];
                vm.message = error;
                return (vm.$q.reject(error));
            }).
        finally(function() {});

    }

    isokf() {
        this.isok = this.UserServices.isapikey();
        return this.isok;
    }

}
