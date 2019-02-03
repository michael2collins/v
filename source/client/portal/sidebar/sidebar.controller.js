const { jQuery: $ } = window;

export class SidebarController {
    constructor(
        $log,
        $scope,
        userServices
    ) {
        'ngInject';
        console.log('constructor sidebar controller');
        this.UserServices = userServices;
        this.$log = $log;
        this.$scope = $scope;
    }


    $onInit() {
        this.$log.debug("sidebar controller oninit");
        this.isok = false;

        this.islogin();
        this.loadSidebar();

        this.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            var vm = event.currentScope.$ctrl;
            vm.$log.debugEnabled(true);
            vm.$log.debug('routechange in sidebar for success');
            vm.isokf();

        });

    }

    $onDestroy() {
        this.$log.debug("sidebar dismissed");
        this.$log.debugEnabled(false);
    }

    islogin() {
        var self = this;

        self.$log.debug('islogin sidebar controller');
        self.isok = self.UserServices.isapikey();

    }


    isokf() {
        //        this.$log.debug('isokf');
        this.isok = this.UserServices.isapikey();
        return this.isok;
    }


    loadSidebar() {
        var self = this;
        self.$log.debug('loadSidebar');


        $(window).scroll(function() {
            if ($(this).scrollTop() > 50) {
                if ($('body').hasClass('topbar-fixed')) {}
                else {
                    $('.sidebar-fixed #sidebar-wrapper').css('top', '0px');
                }
            }
            else {
                if ($('body').hasClass('topbar-fixed')) {}
                else {
                    $('.sidebar-fixed #sidebar-wrapper').css('top', '50px');
                }
            }
        });
        
    }

}
