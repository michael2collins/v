(function () {
    'use strict';
 
    angular
        .module('ng-admin')
 
    .controller('AppController', AppControllerFirst)
    .controller('NoneController', AppControllerNone)
	.controller('MainController', AppControllerMain);


    AppControllerFirst.$inject = ['$scope', 
    '$routeParams', 
    ];
    AppControllerNone.$inject = ['$scope', 
    '$routeParams', 
    ];
    AppControllerMain.$inject = ['$scope', 
    '$routeParams', 
    ];	
	
    function AppControllerFirst( $scope, $routeParams){
        /* jshint validthis: true */
        var vm = this;
 
    vm.data = {};
    vm.header = {
        layout_menu:'',
        layout_topbar:'',
        animation:'',
        header_topbar:'static',
        boxed:''
    };
    vm.loadTopbar = loadTopbar;
    vm.loadSidebar = loadSidebar;

    $scope.$on('$routeChangeSuccess', function (event, current, previous){
        console.log('routechange in app for success');
        vm.header.animation = 'fadeInUp';
        setTimeout(function(){
            vm.header.animation = '';
        }, 100);
        console.log('originalPath', current.originalPath);

        vm.data = $.fn.Data.get(current.originalPath);
        console.log('data in $routeChangeSuccess',vm.data);

        if(-1 == $.inArray(current.originalPath, ['/page-500', '/page-404', '/page-lock-screen', '/page-signup', '/page-signin'])){
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

   /*     if('/layout-left-sidebar' === current.originalPath){
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
        else if('/layout-left-sidebar-collapsed' === current.originalPath){
            vm.header.boxed = '';
            vm.header.layout_topbar = 'logo-collapsed';
            vm.header.layout_menu = '';
            $('#wrapper').removeClass('right-sidebar');
            $('body').removeClass('right-side-collapsed');
            $('body').addClass('left-side-collapsed');
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({destroy: true});
            $('body').removeClass('sidebar-fixed');
            $('body').removeClass('layout-boxed');
            $('body > .default-page').removeClass('container');
            $('#sidebar').css('width', '55px');
            $('#sidebar').css('height', 'auto');
            $('#sidebar').css('overflow', 'initial');
            $('#sidebar .menu-scroll').css('overflow', 'initial');
        }
        else if('/layout-right-sidebar' === current.originalPath){
            vm.header.boxed = '';
            vm.header.layout_topbar = '';
            vm.header.layout_menu = 'right-sidebar';
            vm.header.header_topbar = '';
            $('body').removeClass('right-side-collapsed');
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
        }
        else if('/layout-right-sidebar-collapsed' === current.originalPath){
            vm.header.boxed = '';
            vm.header.layout_topbar = 'logo-collapsed';
            vm.header.layout_menu = 'right-sidebar';
            $('body').removeClass('layout-boxed');
            $('body > .default-page').removeClass('container');
            $('body').removeClass('left-side-collapsed');
            $('body').addClass('right-side-collapsed');
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({destroy: true});
            $('body').removeClass('sidebar-fixed');
            $('body > .default-page').removeClass('container');
            $('#sidebar').css('width', '55px');
            $('#sidebar').css('height', 'auto');
            $('#sidebar').css('overflow', 'initial');
            $('#sidebar .menu-scroll').css('overflow', 'initial');
        }
        else if('/layout-boxed' === current.originalPath){
            $('#wrapper').removeClass('right-sidebar');
            $('body').removeClass('left-side-collapsed');
            $('body').removeClass('right-side-collapsed');
            $('body').addClass('layout-boxed');
            $('body > .default-page').addClass('container');
            $('#topbar .navbar-header').removeClass('logo-collapsed');
            $('body').addClass('sidebar-fixed');
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                "height": $(window).height() - 50,
                'width': '250px',
                'wheelStep': 5
            });

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
*/


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

 /*   vm.loadtempsetting = function(){
        // Template Setting 
        $('#template-setting > a.btn-template-setting').click(function(){
            if($('#template-setting').css('right') < '0'){
                $('#template-setting').css('right', '0');
            } else {
                $('#template-setting').css('right', '-251px');
            }
        });

        $('#template-setting > .content-template-setting #layout-setting').change(function() {
            if ($('body').hasClass('layout-boxed')) {
                $('body').removeClass('layout-boxed');
                $('body > .default-page').removeClass('container');
            } else {
                $('body').addClass('layout-boxed');
                $('body > .default-page').addClass('container');
            }
        });
        $('#template-setting > .content-template-setting #header-setting').change(function() {
            if ($('body').hasClass('topbar-fixed')) {
                $('body').removeClass('topbar-fixed');
            } else {
                $('body').addClass('topbar-fixed');
                $('.sidebar-fixed #sidebar-wrapper').css('top','0px');
            }
        });
        $('#template-setting > .content-template-setting #sidebar-setting').change(function() {
            if ($('body').hasClass('sidebar-fixed')) {
                $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({destroy: true});
                $('body').removeClass('sidebar-fixed');
                $('#sidebar').css('height', 'auto');
            } else {
                $('body').addClass('sidebar-fixed');
                $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                    "height": $(window).height() - 50,
                    'width': '250px',
                    'wheelStep': 5
                });
                $('.sidebar-fixed #sidebar-wrapper').css('top','0px');
            }
        });

        // Begin Change Color Theme
        var setColorTheme = function (color) {
            $.cookie('#color-style', color);
            $('#color-style').attr('href', 'css/themes/' + color + '.css');
        };
        $('ul.color-theme > li').click(function () {
            var color = $(this).attr('data-style');
            setColorTheme(color);
        });
        if ($.cookie('#color-style')) {
            setColorTheme($.cookie('#color-style'));
        }
        // End Change Color Theme

        // Begin Change Style
        $('#change-style').change(function(){
            if($(this).val() == '0'){
                $('#theme-style').attr('href', 'css/style-mango.css');
            } else{
                $('#theme-style').attr('href', 'css/style-none-border-bottom.css');
            }
        });
        // End Change Style
    };
*/
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

            //BEGIN SIDEBAR SEARCH FORM
            $('.search-form > .input-icon > input').focus(function() {
                $('.search-form > .input-icon > i.btn-search').removeClass('icon-magnifier').addClass('icon-close');
            });
            $('.search-form > .input-icon > input').focusout(function() {
                $('.search-form > .input-icon > i.btn-search').removeClass('icon-close').addClass('icon-magnifier');
            });
            $('.search-form > .input-icon > i.btn-search').click(function() {
                $('.search-form > .input-icon > input').val('');
            });
            $('.btn-search-collapsed').click(function() {
                $('.search-form').toggleClass('search-form-collapsed');
                $(this).find('i').toggleClass('icon-magnifier icon-close');
            });
            //END SIDEBAR SEARCH FORM
        }

    }
	function AppControllerNone( $scope, $routeParams){
        console.log('AppControllerNone');
    }

	function AppControllerMain( $scope, $routeParams){
    console.log('AppControllerMain');
    
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

/* JVECTORMAP exception after tab dispkay
        //BEGIN JQUERY JVECTORMAP
        $('.widget-weather').css('height','300px');
        $('#world-map').css('width',$('.col-lg-6').width());
        $('#world-map').css('height','400px');
        $('#world-map').vectorMap({
            map: 'world_mill_en',
            scaleColors: ['#B33F93', '#B33F91'],
            normalizeFunction: 'polynomial',
            hoverOpacity: 0.7,
            hoverColor: false,
            markerStyle: {
                initial: {
                    "fill": '#B33F93',
                    "stroke": '#B33F93',
                    "stroke-width": 10,
                    "stroke-opacity": 0.5
                }
            },
            backgroundColor: 'transparent',
            markers: [
                {latLng: [41.90, 12.45], name: 'Vatican City'},
                {latLng: [-0.52, 166.93], name: 'Nauru'},
                {latLng: [-8.51, 179.21], name: 'Tuvalu'},
                {latLng: [7.11, 171.06], name: 'Marshall Islands'},
                {latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis'},
                {latLng: [3.2, 73.22], name: 'Maldives'},
                {latLng: [35.88, 14.5], name: 'Malta'},
                {latLng: [12.05, -61.75], name: 'Grenada'},
                {latLng: [-4.61, 55.45], name: 'Seychelles'},
                {latLng: [7.35, 134.46], name: 'Palau'},
                {latLng: [42.5, 1.51], name: 'Andorra'},
                {latLng: [6.91, 158.18], name: 'Federated States of Micronesia'},
                {latLng: [1.3, 103.8], name: 'Singapore'},
                {latLng: [1.46, 173.03], name: 'Kiribati'},
                {latLng: [-21.13, -175.2], name: 'Tonga'},
                {latLng: [-20.2, 57.5], name: 'Mauritius'},
                {latLng: [26.02, 50.55], name: 'Bahrain'}
            ]
        });
        $( window ).resize(function() {
            $('#world-map').css('width',$('.col-lg-6').width());
            $('#world-map').css('height','300px');
        });
        //END JQUERY JVECTORMAP
*/
/* don't know we'd use this
        //BEGIN JQUERY ANIMATE NUMBER
        $({value: 0}).animate({value: $('.tp-chart input').attr("rel")}, {
            duration: 5000,
            easing:'swing',
            step: function()
            {
                $('.tp-chart input').val(Math.ceil(this.value)).trigger('change');
            }
        });
        $({value: 0}).animate({value: $('.is-chart input').attr("rel")}, {
            duration: 5000,
            easing:'swing',
            step: function()
            {
                $('.is-chart input').val(Math.ceil(this.value)).trigger('change');
            }
        });
        $('#tp-number').animateNumber({
            number: 55,
            numberStep: comma_separator_number_step
        }, 5000);
        $({value: 0}).animate({value: $('.tp-chart input').attr("rel")}, {
            duration: 5000,
            easing:'swing',
            step: function()
            {
                $('.tp-chart input').val(Math.ceil(this.value)).trigger('change');
            }
        });

        $(".dial").knob({
            'draw' : function () {
                $(this.i).val(this.cv + '%');
            },
            'fgColor': '#e74c3c'
        });
        $({value: 0}).animate({value: $('.stats-chart.visits-stats input').attr("rel")}, {
            duration: 5000,
            easing:'swing',
            step: function()
            {
                $('.stats-chart.visits-stats input').val(Math.ceil(this.value)).trigger('change');
            }
        });
        $({value: 0}).animate({value: $('.stats-chart.pageviews-stats input').attr("rel")}, {
            duration: 5000,
            easing:'swing',
            step: function()
            {
                $('.stats-chart.pageviews-stats input').val(Math.ceil(this.value)).trigger('change');
            }
        });
        $('#bg-number').animateNumber({
            number: 13287,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#at-number').animateNumber({
            number: 8636,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#tm-number').animateNumber({
            number: 853,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#gr-number').animateNumber({
            number: 15,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#is-number').animateNumber({
            number: 1305,
            numberStep: comma_separator_number_step
        }, 5000);
        $({value: 0}).animate({value: $('.is-chart input').attr("rel")}, {
            duration: 5000,
            easing:'swing',
            step: function()
            {
                $('.is-chart input').val(Math.ceil(this.value)).trigger('change');
            }
        });
        $('#visits-number').animateNumber({
            number: 3790,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#pageviews-number').animateNumber({
            number: 54387,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#earning-number').animateNumber({
            number: 50645,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#new-customer-number').animateNumber({
            number: 3420,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#users-number').animateNumber({
            number: 15,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#app-number').animateNumber({
            number: 32890,
            numberStep: comma_separator_number_step
        }, 5000);
        //END JQUERY ANIMATE NUMBER
*/
        //BEGIN SKYCON
/*        var icons = new Skycons({"color": "white"});

        icons.set("clear-day", Skycons.CLEAR_DAY);
        icons.set("clear-night", Skycons.CLEAR_NIGHT);
        icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
        icons.set("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
        icons.set("cloudy", Skycons.CLOUDY);
        icons.set("rain", Skycons.RAIN);
        icons.set("sleet", Skycons.SLEET);
        icons.set("snow", Skycons.SNOW);
        icons.set("wind", Skycons.WIND);
        icons.set("fog", Skycons.FOG);

        icons.play();
*/        //END SKYCON

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
        //END CALENDAR
    },50);
    }
})();    