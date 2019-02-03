
export class BreadcrumbController {

    constructor(
        $scope,
        userServices,
        portalDataService,
        $log
    ) {
        'ngInject';
        console.log('breadcrumb portal controller');

        this.$scope = $scope;
        this.UserServices = userServices;
        this.$log = $log;
        this.portalDataService = portalDataService;

    }


    $onInit() {
        var vm = this;
        vm.$log.debug("breadcrumb controller entered");
        vm.userdta = { 'initial': 'init' };
        vm.data = null;
        vm.init();

    }

    $onDestroy() {
        this.$log.debug("breadcrumb dismissed");
        this.$log.debugEnabled(false);
    }

    init() {
        var vm = this;
        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            if (event == undefined) {
                return;
            }
            vm.$log.debugEnabled(true);
            if (current.originalPath !== '/page-signin') {
                vm.$log.debug('routechange in breadcrumb for success');
                vm.data = vm.portalDataService.get(current.originalPath);
                vm.isokf();
                vm.getUserDetails().then(function() {
                    vm.$log.debug('q return   getUserDetails returned');
                });
            }
            else {
                event.preventDefault();
            }
        });

    }

    getUserDetails() {
        var vm = this;

        vm.$log.debug('breadcrumb controller getUserDetails entered');
        return vm.UserServices.getUserDetails().then(function(data) {
                vm.$log.debug("breadcrumb controller service getuserdetails returned:", data);
                vm.userdta = data;
                return vm.userdta;
            },

            function(error) {
                vm.$log.debug('Caught an error getUserDetails, going to notify:', error);
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
