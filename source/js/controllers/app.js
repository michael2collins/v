(function () {
    'use strict';
 
    angular
        .module('ng-admin')
 
    .controller('AppController', AppController);


    AppController.$inject = ['$scope', 
    '$routeParams', 
    'UserServices',
    'AttendanceServices',
    'EventServices',
    'StudentServices',
    'PaymentServices',
    'ClassServices',
    '$cookies',
    '$cookieStore',
    '$log'
    ];

    function AppController( $scope, $routeParams, 
         UserServices,
         AttendanceServices,
         EventServices, 
         StudentServices, 
         PaymentServices,
         ClassServices,
         $cookies,
         $cookieStore,
         $log
    ){
        /* jshint validthis: true */
        var vm = this;
 
    vm.data = {};
    vm.userdta={};
    vm.header = {
        layout_menu:'',
        layout_topbar:'',
        animation:'',
        header_topbar:'static',
        boxed:''
    };
    vm.loadTopbar = loadTopbar;
    vm.loadSidebar = loadSidebar;
    vm.islogin = islogin;
    vm.isokf = isokf;
    vm.isok;

    islogin();
    
    function isokf() {
//        $log.debug('isokf');
        vm.isok = UserServices.isapikey();
        return vm.isok;
    }


    function islogin() {

        $log.debug('islogin');
        vm.isok = UserServices.isapikey();

        if (vm.isok) {
            $log.debug('setting apikey for services');
            var thekey = UserServices.getapikey();
            AttendanceServices.setapikey(thekey);
            EventServices.setapikey(thekey);
            StudentServices.setapikey(thekey);
            PaymentServices.setapikey(thekey);
            ClassServices.setapikey(thekey);
            UserServices.setapikey(thekey);
            vm.userdta = UserServices.getUserDetails();
            loadSidebar();
            loadTopbar();
        }
        
    }

    $scope.$on('$routeChangeSuccess', function (event, current, previous){
        console.log('routechange in app for success');
        vm.header.animation = 'fadeInUp';
        setTimeout(function(){
            vm.header.animation = '';
        }, 100);

        vm.userdta = UserServices.getUserDetails();
        console.log('$routeChangeSuccess', vm.userdta);

        vm.data = $.fn.Data.get(current.originalPath);
        console.log('data in $routeChangeSuccess',vm.data);

        if(-1 == $.inArray(current.originalPath, ['/page-lock-screen', '/page-signup', '/page-signin','/reset-pwd','/change-pwd','/forget-pwd'])){
            $("body>.default-page").show();
            $("body>.extra-page").hide();
        }
        else{
            window.scrollTo(0,0);
        }
        vm.header.boxed = '';
        vm.header.layout_topbar = '';
        vm.header.layout_menu = '';
        vm.header.header_topbar = '';

        if('/layout-left-sidebar' === current.originalPath){
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
                'wheelStep': 5
            });
            $('body').removeClass('right-side-collapsed');
            $('body').removeClass('container');
        }

        else if('/' === current.originalPath){
            $('body').removeAttr('id'); // error 404, 500
        }
		else{
            vm.header.boxed = '';
            vm.header.layout_topbar = '';
            vm.header.layout_menu = '';
            vm.header.header_topbar = '';
            $('#wrapper').removeClass('right-sidebar');
            $('body').removeClass('left-side-collapsed');
            $('body').removeClass('right-side-collapsed');
            $('body').removeClass('layout-boxed');
            $('body #page-wrapper').removeClass('animated');
            $('body > .default-page').removeClass('container');
            $('#topbar .navbar-header').removeClass('logo-collapsed');
            $('body').addClass('sidebar-fixed');
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                "height": $(window).height() - 50,
                'width': '250px',
                'wheelStep': 5
            });
		}

 


    });
    $scope.$on('$routeChangeError', function (event, current, previous){
        console.log('routechange in app for error');
        console.log('originalPath');
        console.log(current.originalPath);
    });
    
    function loadTopbar() {
        console.log("loadTopbar");
        $("[data-toggle='offcanvas']").on('click', function () {
            $('#sidebar-wrapper').toggleClass('active');
            return false;
        });
        // Setting toggle in mobile view 
        $('#setting-toggle').click(function(){
            console.log('mobile toggle');
          $('.topbar-main').toggle();
        });
    }

    // Back To Top 
    $(window).scroll(function(){
        if ($(this).scrollTop() < 200) {
            $('#totop') .fadeOut();
        } else {
            $('#totop') .fadeIn();
        }
    });
    $('#totop').on('click', function(){
        $('html, body').animate({scrollTop:0}, 'fast');
        return false;
    });

    
     function loadSidebar(){
         console.log('loadSidebar');
            //BEGIN SIDEBAR FIXED
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                "height": $(window).height() - 50,
                'width': '250px',
                'wheelStep': 5
            });
            $(window).scroll(function(){
                if ($(this).scrollTop() > 50) {
                    if($('body').hasClass('topbar-fixed')){
                    } else{
                        $('.sidebar-fixed #sidebar-wrapper').css('top','0px');
                    }
                } else{
                    if($('body').hasClass('topbar-fixed')){
                    } else{
                        $('.sidebar-fixed #sidebar-wrapper').css('top','50px');
                    }
                }
            });
            //END SIDEBAR FIXED

            $('#menu-toggle').toggle(
                function() {
                console.log('menu-toggle');                    
                    if($('#wrapper').hasClass('right-sidebar')) {
                        $('body').addClass('right-side-collapsed');
                        $('.navbar-header').addClass('logo-collapsed');
                    } else{
                        $(this).find('i').removeClass('icon-arrow-left').addClass('icon-arrow-right');
                        $('body').addClass('left-side-collapsed');
                        $('.navbar-header').addClass('logo-collapsed');
                        $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({destroy: true});
                        $('#sidebar').css('height', 'auto');
                        $('#sidebar').css('width', '55px');
                        $('#sidebar').css('overflow', 'initial');
                        $('#sidebar .menu-scroll').css('overflow', 'initial');
                        $('body').removeClass('sidebar-fixed');
                    }
                }, function() {
                    if($('#wrapper').hasClass('right-sidebar')) {
                        $('body').removeClass('right-side-collapsed');
                        $('.navbar-header').removeClass('logo-collapsed');
                    } else{
                        $(this).find('i').removeClass('icon-arrow-right').addClass('icon-arrow-left');
                        $('body').removeClass('left-side-collapsed');
                        $('.navbar-header').removeClass('logo-collapsed');
                        $('body').addClass('sidebar-fixed');
                        $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                            "height": $(window).height() - 50,
                            'width': '250px',
                            'wheelStep': 5
                        });
                        $('#sidebar .menu-scroll').css('overflow', 'hidden');
                    }
                }
            );

            if($('#wrapper').hasClass('right-sidebar')) {
                $('ul#side-menu li').hover(function () {
                    if ($('body').hasClass('right-side-collapsed')) {
                        $(this).addClass('nav-hover');
                    }
                }, function () {
                    if ($('body').hasClass('right-side-collapsed')) {
                        $(this).removeClass('nav-hover');
                    }
                });
            } else{
                $('ul#side-menu li').hover(function () {
                    if ($('body').hasClass('left-side-collapsed')) {
                        $(this).addClass('nav-hover');
                    }
                }, function () {
                    if ($('body').hasClass('left-side-collapsed')) {
                        $(this).removeClass('nav-hover');
                    }
                });
            }

 
        }



    setTimeout(function(){
        var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');


        //BEGIN TODOS LIST
        $("#todos-list-sort").sortable();
        $("#todos-list-sort").disableSelection();


        $('#todos-list-add').click(function() {
            var index = $('#todos-list-sort > li').length;
            $('ul#todos-list-sort').append('<li><input type="checkbox" id="task-item-' + index + '" /><label for="task-item-' + index + '" >' + $("#todos-list-input").val() + '</label><a class="delete" href="javascript:;" data-hover="tooltip" data-original-title="remove"><span class="fa fa-trash-o"></span></a></li>');
            $("[data-hover='tooltip']").tooltip();
        });
        $( document ).on( 'click', '#todos-list-sort li a.delete', function() {
//mlc         $('#todos-list-sort li a.delete').live('click', function() {
            $(this).parent().remove();
        });
        //END TODOS LIST



        try {

        //BEGIN LINE CHART SPLINE
        var d2_1 = [["Jan", 181],["Feb", 184],["Mar", 189],["Apr", 180],["May", 190],["Jun", 183],["Jul", 185],["Aug", 188],["Sep", 202]];
        var d2_2 = [["Jan", 165],["Feb", 172],["Mar", 175],["Apr", 176],["May", 164],["Jun", 171],["Jul", 175],["Aug", 180],["Sep", 181]];
        var d2_3 = [["Jan", 128],["Feb", 131],["Mar", 140],["Apr", 150],["May", 140],["Jun", 144],["Jul", 146],["Aug", 155],["Sep", 158]];

        $.plot("#line-chart-spline", [{
            data: d2_1,
            label: "Children",
            color: "#2ecc71"
        },{
            data: d2_2,
            label: "Adults",
            color: "#e74c3c"
        },{
            data: d2_3,
            label: "Blackbelts",
            color: "#2980b9"
        }], {   
            series: {
                lines: {
                    show: !1
                },
                splines: {
                    show: !0,
                    tension: 0.4,
                    lineWidth: 2,
                    fill: 0
                },
                points: {
                    show: !0,
                    radius: 4
                }
            },
            grid: {
                borderColor: "#ffffff",
                borderWidth: 1,
                hoverable: !0
            },
            tooltip: !0,
            tooltipOpts: {
                content: "%x : %y",
                defaultTheme: false
            },
            xaxis: {
                tickColor: "#fafafa",
                mode: "categories"
            },
            yaxis: {
                tickColor: "#fafafa"
            },
            shadowSize: 0
        });
        //END LINE CHART SPLINE
            
        //BEGIN CHART TRAFFIC SOURCES
        var d6_1 = [39];
        var d6_2 = [41];
        var d6_3 = [20];
        $.plot('#traffice-sources-chart', [{
            data: d6_1,
            label: "Ages 4-7",
            color: "#e74c3c"
        },
            {
                data: d6_2,
                label: "Ages 8-12",
                color: "#2ecc71"
            },
            {
                data: d6_3,
                label: "Ages 13-17",
                color: "#3498db"
            }], {
            series: {
                pie: {
                    show: true
                }
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        });
        //END CHART TRAFFIC SOURCES

        //BEGIN CHART NEW CUSTOMER
        var d7 = [["Jan", 200],["Feb", 178],["Mar", 130],["Apr", 150],["May", 220],["Jun", 320]];
        $.plot("#new-customer-chart", [{
            data: d7,
            color: "#01b6ad"
        }], {
            series: {
                bars: {
                    align: "center",
                    lineWidth: 0,
                    show: !0,
                    barWidth: 0.6,
                    fill: 0.9
                }
            },
            grid: {
                borderColor: "#fafafa",
                borderWidth: 1,
                hoverable: !0
            },
            tooltip: !0,
            tooltipOpts: {
                content: "%x : %y",
                defaultTheme: false
            },
            xaxis: {
                tickColor: "#fafafa",
                mode: "categories"
            },
            yaxis: {
                tickColor: "#fafafa"
            },
            shadowSize: 0
        });
        //END CHART NEW CUSTOMER

        //BEGIN CHART DOWNLOAD UPLOAD
        var d8_1 = [["Jan", 80],["Feb", 76],["Mar", 110],["Apr", 90],["May", 123],["Jun", 150],["Jul", 170]];
        var d8_2 = [["Jan", 70],["Feb", 49],["Mar", 70],["Apr", 60],["May", 86],["Jun", 100],["Jul", 150]];
        $.plot("#internet-speed-chart", [{
            data: d8_1,
            label: "Adults",
            color: "#c0392b"
        },{
            data: d8_2,
            label: "Children",
            color: "#2ecc71"
        }], {
            series: {
                lines: {
                    show: !1
                },
                splines: {
                    show: !0,
                    tension: 0.4,
                    lineWidth: 2,
                    fill: 0.8
                },
                points: {
                    show: !0,
                    radius: 4
                }
            },
            grid: {
                borderColor: "#fafafa",
                borderWidth: 1,
                hoverable: !0
            },
            tooltip: !0,
            tooltipOpts: {
                content: "%x : %y",
                defaultTheme: false
            },
            xaxis: {
                tickColor: "#fafafa",
                mode: "categories"
            },
            yaxis: {
                tickColor: "#fafafa"
            },
            shadowSize: 0
        });
        //END CHART DOWNLOAD UPLOAD

        

        //BEGIN AREA CHART SPLINE
        var d9_1 = [["Jan", 67],["Feb", 91],["Mar", 36],["Apr", 150],["May", 28],["Jun", 123],["Jul", 38]];
        var d9_2 = [["Jan", 59],["Feb", 49],["Mar", 45],["Apr", 94],["May", 76],["Jun", 22],["Jul", 31]];
        $.plot("#area-chart-spline-db", [{
            data: d9_1,
            label: "Adults",
            color: "#ffce54"
        },{
            data: d9_2,
            label: "Children",
            color: "#B33F93"
        }], {
            series: {
                lines: {
                    show: !1
                },
                splines: {
                    show: !0,
                    tension: 0.4,
                    lineWidth: 2,
                    fill: 0.8
                },
                points: {
                    show: !0,
                    radius: 4
                }
            },
            grid: {
                borderColor: "#fafafa",
                borderWidth: 1,
                hoverable: !0
            },
            tooltip: !0,
            tooltipOpts: {
                content: "%x : %y",
                defaultTheme: true
            },
            xaxis: {
                tickColor: "#fafafa",
                mode: "categories"
            },
            yaxis: {
                tickColor: "#fafafa"
            },
            shadowSize: 0
        });
        //END AREA CHART SPLINE

/*
        //BEGIN JQUERY ANIMATE NUMBER
        $('#revenue-number').animateNumber({
            number: 3579.95,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#tax-number').animateNumber({
            number: 295.35,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#shipping-number').animateNumber({
            number: 30.00,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#quantity-number').animateNumber({
            number: 14,
            numberStep: comma_separator_number_step
        }, 5000);
        //END JQUERY ANIMATE number
*/
        //BEGIN CALENDAR
        $("#my-calendar").zabuto_calendar({
            language: "en"
        });

        } catch(e) {
                console.log(e.message, "from", e.stack);
                // You can send data to your server
                // sendError(data);
                //throw e;
        }

        
        //END CALENDAR
    },500);
	}

})();    