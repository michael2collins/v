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

        //BEGIN SIDEBAR FIXED
/*        $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
            height: $(window).height() - 100,
            width: '250px',
            size: '10px',
            railVisible: true,
            alwaysVisible: true,
            color: 'gray',
            railColor: 'gray',
            wheelStep: 5
        });
*/

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
        
        //END SIDEBAR FIXED
/*
        $('#menu-toggle').toggle(
            function() {
                self.$log.debug('menu-toggle');
                if ($('#wrapper').hasClass('right-sidebar')) {
                    $('body').addClass('right-side-collapsed');
                    $('.navbar-header').addClass('logo-collapsed');
                }
                else {
                    $(this).find('i').removeClass('icon-arrow-left').addClass('icon-arrow-right');
                    $('body').addClass('left-side-collapsed');
                    $('.navbar-header').addClass('logo-collapsed');
//                    $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({ destroy: true });
                    $('#sidebar').css('height', 'auto');
                    $('#sidebar').css('width', '55px');
                    $('#sidebar').css('overflow', 'initial');
                    $('#sidebar .menu-scroll').css('overflow', 'initial');
                    $('body').removeClass('sidebar-fixed');
                }
            },
            function() {
                if ($('#wrapper').hasClass('right-sidebar')) {
                    $('body').removeClass('right-side-collapsed');
                    $('.navbar-header').removeClass('logo-collapsed');
                }
                else {
                    $(this).find('i').removeClass('icon-arrow-right').addClass('icon-arrow-left');
                    $('body').removeClass('left-side-collapsed');
                    $('.navbar-header').removeClass('logo-collapsed');
                    $('body').addClass('sidebar-fixed');
         /*           $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                        "height": $(window).height() - 50,
                        'width': '250px',
                        'wheelStep': 5
                    });
        * /            
                    $('#sidebar .menu-scroll').css('overflow', 'hidden');
                }
            }
        );
*/
/*
        if ($('#wrapper').hasClass('right-sidebar')) {
            $('ul#side-menu li').hover(function() {
                if ($('body').hasClass('right-side-collapsed')) {
                    $(this).addClass('nav-hover');
                }
            }, function() {
                if ($('body').hasClass('right-side-collapsed')) {
                    $(this).removeClass('nav-hover');
                }
            });
        }
        else {
        
            $('ul#side-menu li').hover(function() {
                if ($('body').hasClass('left-side-collapsed')) {
                    $(this).addClass('nav-hover');
                }
            }, function() {
                if ($('body').hasClass('left-side-collapsed')) {
                    $(this).removeClass('nav-hover');
                }
            });
        }
*/
    }

}
