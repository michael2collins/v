const { jQuery: $ } = window;
import angular from 'angular';

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
        statsServices,
        $window,
        $element
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
        this.$window = $window;
        this.$element = $element;
    }

    $onDestroy() {
        this.$log.log("portal dismissed");
    }

    $onInit() {
        this.current = {};
        this.data = null;
        this.header = {
            layout_menu: '',
            layout_topbar: '',
            animation: '',
            header_topbar: 'static',
            boxed: ''
        };
        this.init();

        this.islogin();

        this.portalDataService.Portlet('portal.controller.js');
    }
    scrollToTop() {
        if (typeof jQuery == 'undefined') {
            return window.scrollTo(0, 0);
        }
        else {
            var body = $('html, body');
            body.animate({ scrollTop: 0 }, '600', 'swing');
        }
        $('#totop').fadeOut();
        //        console.log("scrollToTop");
        return true;
    }
    init() {
        var self = this;

        if (self.$log.getInstance(self.UserServices.isDebugEnabled()) !== undefined) {
            self.$log = self.$log.getInstance('PortalController', self.UserServices.isDebugEnabled());
        }

        // Setup a timer
        var timeout;

        // Listen for scroll events
        angular.element(this.$element).on('wheel', function portalScrollListener() {
            //console.log( 'no debounce' );

            // If there's a timer, cancel it
            if (timeout) {
                self.$window.cancelAnimationFrame(timeout);
            }

            // Setup the new requestAnimationFrame()
            timeout = self.$window.requestAnimationFrame(function() {

                // Run our scroll functions
                //		console.log( 'debounced' );
                if ($('body').scrollTop() < 20) {
                    console.log("under 20", $('body').scrollTop());
                    $('#totop').fadeOut();
                }
                else {
                    //                console.log("over 150");
                    $('#totop').fadeIn();
                }

            });

        });
        self.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            var vm = event.currentScope.$ctrl;
            vm.current = current;

            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log('routechange in portal for success');


            vm.header.animation = 'fadeInUp';
            setTimeout(function() {
                vm.header.animation = '';
            }, 100);

            vm.scrollToTop();

            if (-1 == $.inArray(vm.current.originalPath, ['/page-lock-screen', '/page-signup', '/page-signin', '/reset-pwd', '/change-pwd', '/forget-pwd'])) {
                //                activate();

                $("body>portal-component>div>.default-page").show();
                $("body>.extra-page").hide();
            }
            else {
                vm.$window.scrollTo(0, 0);
            }
            if ('/' === vm.current.originalPath) {
                vm.$log.log("/ path entered");
                $('body').removeAttr('id'); // error 404, 500
            }
            else {
                vm.$log.log("else path entered");
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



    }

    islogin() {

        this.$log.log('islogin');
        this.isok = this.UserServices.isapikey();

        if (this.isok) {
            this.$log.log('setting apikey for services');
            var thekey = this.UserServices.getapikey();
            this.UserServices.setapikey(thekey);
        }

    }

    isokf() {
        this.isok = this.UserServices.isapikey();
        return this.isok;
    }
}
