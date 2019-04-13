const { jQuery: $ } = window;

export class SidebarController {
    constructor(
        $log,
        $scope,
        userServices,
        $cookies
    ) {
        'ngInject';
        this.UserServices = userServices;
        this.$log = $log;
        this.$scope = $scope;
        this.$cookies = $cookies;
    }


    $onInit() {
        this.$log.log("sidebar controller oninit");
        this.isok = false;

        this.islogin();
        this.loadSidebar();

        this.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            var vm = event.currentScope.$ctrl;
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log('routechange in sidebar for success');
            vm.isokf();

        });

    }

    $onDestroy() {
        this.$log.log("sidebar dismissed");
        //this.$log.logEnabled(false);
    }

    islogin() {
        var self = this;

        if (self.$log.getInstance(self.UserServices.isDebugEnabled()) !== undefined ) {
            self.$log = self.$log.getInstance('SidebarController',self.UserServices.isDebugEnabled());
        }

        self.$log.log('islogin sidebar controller');
        self.isok = self.UserServices.isapikey();

    }
    isPayer() {
        return this.UserServices._$cookies.getObject('globals').currentUser.role == 'payer' ? true : false;
    }
    isAdminOperator() {
        
        return this.UserServices._$cookies.getObject('globals').currentUser.role == 'admin' 
            || this.UserServices._$cookies.getObject('globals').currentUser.role == 'operator'  ? true : false;
    }
    isokf() {
        //        this.$log.log('isokf');
        this.isok = this.UserServices.isapikey();
        return this.isok;
    }


    loadSidebar() {
        var self = this;
        self.$log.log('loadSidebar');


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
