const { jQuery: $ } = window;

export class PortalController {
    constructor(
        portalDataService,
        $log,
        $scope,
        userServices,
        studentServices,
        classServices,
        calendarServices,
        eventServices,
        testingServices,
        templateServices,
        paymentServices,
        statsServices
    ) {
        'ngInject';
        this.$log = $log;
        this.$scope = $scope;
        this.portalDataService = portalDataService;
        this.UserServices = userServices;
        this.ClassServices = classServices;
        this.StudentServices = studentServices;
            this.CalendarServices = calendarServices;
            this.TestingServices = testingServices;
            this.EventServices = eventServices;
            this.TemplateServices = templateServices;
            this.PaymentServices = paymentServices;
            this.StatsServices = statsServices;

    }
    
    $onDestroy() {
            this.$log.log("portal dismissed");
            //this.$log.logEnabled(false);
        }

    $onInit() {
          this.loadTopbar();
//          this.loadSidebar();
        this.current={};
        this.data = null;
        this.header = {
            layout_menu:'',
            layout_topbar:'',
            animation:'',
            header_topbar:'static',
            boxed:''
        };
        this.init();

        this.islogin();

        this.portalDataService.Portlet('portal.controller.js');
    }
    init() {
        var self=this;

        if (self.$log.getInstance(self.UserServices.isDebugEnabled()) !== undefined ) {
            self.$log = self.$log.getInstance('PortalController',self.UserServices.isDebugEnabled());
        }


        self.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            var vm = event.currentScope.$ctrl;
            vm.current = current;

            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log('routechange in portal for success');


            vm.header.animation = 'fadeInUp';
            setTimeout(function() {
                vm.header.animation = '';
            }, 100);


            if (-1 == $.inArray(vm.current.originalPath, ['/page-lock-screen', '/page-signup', '/page-signin', '/reset-pwd', '/change-pwd', '/forget-pwd'])) {
                //                activate();

                $("body>portal-component>div>.default-page").show();
                $("body>.extra-page").hide();
            }
            else {
                window.scrollTo(0, 0);
            }
            vm.header.boxed = '';
            vm.header.layout_topbar = '';
            vm.header.layout_menu = '';
            vm.header.header_topbar = '';
/*
            if ('/layout-left-sidebar' === vm.current.originalPath) {
                vm.$log.log("left sidebar entered");
                vm.header.boxed = '';
                vm.header.layout_topbar = '';
                vm.header.layout_menu = '';
                vm.header.header_topbar = '';
                $('#wrapper').removeClass('right-sidebar');
                $('body').removeClass('left-side-collapsed');
                $('body').removeClass('layout-boxed');
                $('body > .default-page').removeClass('container');
                $('#topbar .navbar-header').removeClass('logo-collapsed');
                $('body').addClass('sidebar-fixed');
                $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                    "height": $(window).height() - 50,
                    'width': '250px',
                    'wheelStep': 5,
                    
//            height: $(window).height() - 100,
//            width: '250px',
            size: '10px',
            railVisible: true,
            alwaysVisible: true,
            color: 'gray',
            railColor: 'gray'
//            wheelStep: 5
                    
                });
                
                $('body').removeClass('right-side-collapsed');
                $('body').removeClass('container');
            }

            else if ('/' === vm.current.originalPath) {
*/            
            if ('/' === vm.current.originalPath) {
                vm.$log.log("/ path entered");
                $('body').removeAttr('id'); // error 404, 500
            }
            else {
                vm.$log.log("else path entered");
                vm.header.boxed = '';
                vm.header.layout_topbar = '';
                vm.header.layout_menu = '';
                vm.header.header_topbar = '';
//                $('#wrapper').removeClass('right-sidebar');
//                $('body').removeClass('left-side-collapsed');
//                $('body').removeClass('right-side-collapsed');
//                $('body').removeClass('layout-boxed');
                $('body #page-wrapper').removeClass('animated');
                $('body > .default-page').removeClass('container');
                $('#topbar .navbar-header').removeClass('logo-collapsed');
                $('body').addClass('sidebar-fixed');
                $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                    "height": $(window).height() - 50,
                    'width': '250px',
                    'wheelStep': 5,
            size: '10px',
            railVisible: true,
            alwaysVisible: true,
            color: 'gray',
            railColor: 'gray'
                    
                });
            }

            vm.isokf();
            vm.$log.log('exit routechangesucess');


        });

        self.$scope.$on('$routeChangeError', function(event, current, previous) {
            var vm = event.currentScope.$ctrl;
            vm.$log.log('routechange in portal for error');
            vm.$log.log('originalPath');
            vm.$log.log(current.originalPath);
            vm.data = vm.portalDataService.get(current.originalPath);
            vm.$log.log('data in $routeChangeSuccess', vm.data);
            
        });

        $(document).ready(function() {

            $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
                // Avoid following the href location when clicking
                event.preventDefault();
                // Avoid having the menu to close when clicking
                event.stopPropagation();
                // Re-add .open to parent sub-menu item
                $(this).parent().siblings().removeClass('open');
                $(this).parent().toggleClass('open');
            });

        });
        
    }

    islogin() {

        this.$log.log('islogin');
        this.isok = this.UserServices.isapikey();

        if (this.isok) {
            this.$log.log('setting apikey for services');
            var thekey = this.UserServices.getapikey();
            //this.CalendarServices.setapikey(thekey);
            //this.TestingServices.setapikey(thekey);
            //this.EventServices.setapikey(thekey);
            //this.TemplateServices.setapikey(thekey);
            //this.StudentServices.setapikey(thekey);
            //this.PaymentServices.setapikey(thekey);
            //this.ClassServices.setapikey(thekey);
            this.UserServices.setapikey(thekey);
            //this.StatsServices.setapikey(thekey);


        }

    }

    isokf() {
        //        this.$log.log('isokf');
        this.isok = this.UserServices.isapikey();
        return this.isok;
    }

    loadTopbar() {
        this.$log.log("loadTopbar");
        $("[data-toggle='offcanvas']").on('click', function() {
            $('#sidebar-wrapper').toggleClass('active');
            return false;
        });
        // Setting toggle in mobile view 
        $('#setting-toggle').click(function() {
            this.$log.log('mobile toggle');
            $('.topbar-main').toggle();
        });
    }
}
