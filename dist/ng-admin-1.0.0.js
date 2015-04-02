"use strict";
var App = angular.module('ng-admin', [
    'ngRoute',
    'ui.bootstrap'//,
  //  'studentServices'
]);

App.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {templateUrl: 'templates/states/main.html', controller: 'MainController'})
//        .when('/charts', {templateUrl: 'templates/states/charts.html', controller: 'ChartsController'})
//        .when('/form-components', {templateUrl: 'templates/states/form-components.html', controller: 'FormComponentsController'})
//        .when('/form-dropzone-file-upload', {templateUrl: 'templates/states/form-dropzone-file-upload.html', controller: 'NoneController'})
//        .when('/form-layouts', {templateUrl: 'templates/states/form-layouts.html', controller: 'FromLayoutsController'})
        .when('/form-layouts-newlead', {templateUrl: 'templates/states/form-layouts-newlead.html', controller: 'FromLayoutsController'})
        .when('/form-layouts-newstudent', {templateUrl: 'templates/states/form-layouts-newstudent.html', controller: 'FromLayoutsController'})
        .when('/form-layouts-newpayment', {templateUrl: 'templates/states/form-layouts-newpayment.html', controller: 'FromLayoutsController'})
        .when('/form-layouts-newtest', {templateUrl: 'templates/states/form-layouts-newtest.html', controller: 'FromLayoutsController'})
        .when('/form-layouts-newweek', {templateUrl: 'templates/states/form-layouts-newweek.html', controller: 'FromLayoutsController'})
        .when('/table-basic-attendance', {templateUrl: 'templates/states/table-basic-attendance.html', controller: 'TableBasicController'})
        .when('/table-basic-leads', {templateUrl: 'templates/states/table-basic-leads.html', controller: 'TableBasicController'})
        .when('/table-basic-students', {templateUrl: 'templates/states/table-basic-students.html', controller: 'StudentsTableBasicController'})
        .when('/table-basic-managetest', {templateUrl: 'templates/states/table-basic-managetest.html', controller: 'TableBasicController'})
        .when('/table-basic-paymenttracking', {templateUrl: 'templates/states/table-basic-paymenttracking.html', controller: 'TableBasicController'})
//        .when('/form-multiple-file-upload', {templateUrl: 'templates/states/form-multiple-file-upload.html', controller: 'FormMultipleUploadFileController'})
//        .when('/form-validation', {templateUrl: 'templates/states/form-validation.html', controller: 'FormValidationController'})
//        .when('/form-wizard', {templateUrl: 'templates/states/form-wizard.html', controller: 'FormWizardController'})
        .when('/layout-boxed', {templateUrl: 'templates/states/layout-boxed.html', controller: 'NoneController'})
        .when('/layout-left-sidebar-collapsed', {templateUrl: 'templates/states/layout-left-sidebar-collapsed.html', controller: 'NoneController'})
        .when('/layout-left-sidebar', {templateUrl: 'templates/states/layout-left-sidebar.html', controller: 'NoneController'})
        .when('/layout-right-sidebar-collapsed', {templateUrl: 'templates/states/layout-right-sidebar-collapsed.html', controller: 'NoneController'})
        .when('/layout-right-sidebar', {templateUrl: 'templates/states/layout-right-sidebar.html', controller: 'NoneController'})
        .when('/page-404', {templateUrl: 'templates/states/page-404.html', controller: 'Page404Controller'})
        .when('/page-500', {templateUrl: 'templates/states/page-500.html', controller: 'Page500Controller'})
        .when('/page-blank', {templateUrl: 'templates/states/page-blank.html', controller: 'NoneController'})
//        .when('/page-fullcalendar', {templateUrl: 'templates/states/page-fullcalendar.html', controller: 'PageFullcalendarController'})
//        .when('/page-portfolio', {templateUrl: 'templates/states/page-portfolio.html', controller: 'PagePortfolioController'})
//        .when('/page-invoice', {templateUrl: 'templates/states/page-invoice.html', controller: 'NoneController'})
        .when('/page-lock-screen', {templateUrl: 'templates/states/page-lock-screen.html', controller: 'PageLockScreenController'})
//        .when('/page-pricing-table', {templateUrl: 'templates/states/page-pricing-table.html', controller: 'NoneController'})
        .when('/page-signin', {templateUrl: 'templates/states/page-signin.html', controller: 'PageSigninController'})
        .when('/page-signup', {templateUrl: 'templates/states/page-signup.html', controller: 'PageSignupController'})
//        .when('/table-advanced', {templateUrl: 'templates/states/table-advanced.html', controller: 'TableAdvancedController'})
//        .when('/table-basic', {templateUrl: 'templates/states/table-basic.html', controller: 'TableBasicController'})
//        .when('/table-editable', {templateUrl: 'templates/states/table-editable.html', controller: 'TableEditableController'})
//        .when('/table-responsive', {templateUrl: 'templates/states/table-responsive.html', controller: 'TableResponsiveController'})
//        .when('/table-datatables', {templateUrl: 'templates/states/table-datatables.html', controller: 'TableDatatablesController'})
//        .when('/transitions', {templateUrl: 'templates/states/transitions.html', controller: 'TransitionsController'})
//        .when('/ui-buttons', {templateUrl: 'templates/states/ui-buttons.html', controller: 'UiButtonsController'})
//        .when('/ui-general', {templateUrl: 'templates/states/ui-general.html', controller: 'UiGeneralController'})
//        .when('/ui-icons', {templateUrl: 'templates/states/ui-icons.html', controller: 'NoneController'})
//        .when('/ui-modals', {templateUrl: 'templates/states/ui-modals.html', controller: 'NoneController'})
//        .when('/ui-nestable-list', {templateUrl: 'templates/states/ui-nestable-list.html', controller: 'UiNestableListController'})
//        .when('/ui-portlets', {templateUrl: 'templates/states/ui-portlets.html', controller: 'UiPortletsController'})
//        .when('/ui-sliders', {templateUrl: 'templates/states/ui-sliders.html', controller: 'UiSlidersController'})
//        .when('/ui-tabs-accordions-navs', {templateUrl: 'templates/states/ui-tabs-accordions-navs.html', controller: 'NoneController'})
//        .when('/ui-typography', {templateUrl: 'templates/states/ui-typography.html', controller: 'UiTypographyController'})
//        .when('/ui-notific8', {templateUrl: 'templates/states/ui-notific8.html', controller: 'UiNotific8Controller'})
//        .when('/ui-toastr-notifications', { templateUrl: 'templates/states/ui-toastr-notifications.html', controller: 'UiToastrNotificationsController'})
//        .when('/ui-select-dropdown', { templateUrl: 'templates/states/ui-select-dropdown.html', controller: 'UiSelectDropdownController'})
        .otherwise({
            redirectTo: '/'
          });
}]);

App.controller('AppController', function($scope, $routeParams){
 
    $scope.data = {};
    $scope.header = {
        layout_menu:'',
        layout_topbar:'',
        animation:'',
        header_topbar:'static',
        boxed:''
    };

    $scope.$on('$routeChangeSuccess', function (event, current, previous){
        $scope.header.animation = 'fadeInUp';
        setTimeout(function(){
            $scope.header.animation = '';
        }, 100);

        $scope.data = $.fn.Data.get(current.originalPath);

        if(-1 == $.inArray(current.originalPath, ['/page-500', '/page-404', '/page-lock-screen', '/page-signup', '/page-signin'])){
            $("body>.default-page").show();
            $("body>.extra-page").hide();
        }
        else{
            window.scrollTo(0,0);
        }
        $scope.header.boxed = '';
        $scope.header.layout_topbar = '';
        $scope.header.layout_menu = '';
        $scope.header.header_topbar = '';

        if('/layout-left-sidebar' === current.originalPath){
            $scope.header.boxed = '';
            $scope.header.layout_topbar = '';
            $scope.header.layout_menu = '';
            $scope.header.header_topbar = '';
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
            $scope.header.boxed = '';
            $scope.header.layout_topbar = 'logo-collapsed';
            $scope.header.layout_menu = '';
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
            $scope.header.boxed = '';
            $scope.header.layout_topbar = '';
            $scope.header.layout_menu = 'right-sidebar';
            $scope.header.header_topbar = '';
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
            $scope.header.boxed = '';
            $scope.header.layout_topbar = 'logo-collapsed';
            $scope.header.layout_menu = 'right-sidebar';
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
            $scope.header.boxed = '';
            $scope.header.layout_topbar = '';
            $scope.header.layout_menu = '';
            $scope.header.header_topbar = '';
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

    $scope.loadTopbar = function() {
        $("[data-toggle='offcanvas']").on('click', function () {
            $('#sidebar-wrapper').toggleClass('active');
            return false;
        });
        /****************************************************/
        /************ Setting toggle in mobile view *********/
        $('#setting-toggle').click(function(){
          $('.topbar-main').toggle();
        });
        /************ Setting toggle in mobile view *********/
        /****************************************************/
    };

    $scope.loadtempsetting = function(){
        /*************************/
        /*** Template Setting ***/
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

    /***********************************/
    /************ Back To Top *********/
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
    /************ Back To Top *********/
    /*********************************/

    
    $scope.loadSidebar = function(){
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
        };

});
App.controller('NoneController', function($scope, $routeParams){

});

App.controller('MainController', function($scope, $routeParams){
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
        $('#todos-list-sort li a.delete').live('click', function() {
            $(this).parent().remove();
        });
        //END TODOS LIST

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

        //BEGIN SKYCON
        var icons = new Skycons({"color": "white"});

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
        //END SKYCON
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

        //BEGIN CALENDAR
        $("#my-calendar").zabuto_calendar({
            language: "en"
        });
        //END CALENDAR
    },50);
});
App.controller('DashboardBlogController', function($scope, $routeParams){
    var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');

    /*****************************/
    /********* TAB BLOG **********/

    //BEGIN JQUERY FLOT CHART
    var d2 = [["Jan 1", 93],["Jan 3", 78],["Jan 5", 47],["Jan 7", 35],["Jan 9", 48],["Jan 11", 26],["Jan 13", 49],["Jan 15", 96],["Jan 17", 54],["Jan 19", 99],["Jan 21", 92],["Jan 23", 43]];
    $.plot("#site-stats-chart", [{
        data: d2,
        color: "#01b6ad"
    }], {
        series: {
            bars: {
                align: "left",
                lineWidth: 0,
                show: !0,
                barWidth: 0.4,
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
    //END JQUERY FLOT CHART

    /********* TAB BLOG ***********/
    /*****************************/
});
App.controller('DashboardShoppingController', function($scope, $routeParams){
    var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');

    /***********************************/
    /********* TAB SHOPPING ************/

    //BEGIN JQUERY FLOT CHART
    var d1 = [["Jan", 200],["Feb", 120],["Mar", 199],["Apr", 157],["May", 163],["Jun", 192],["Jul", 130],["Aug", 126],["Sep", 206]];
    $.plot("#sp-chart-orders", [{
        data: d1,
        color: "#5cb85c"
    }], {
        series: {
            lines: {
                show: !0,
                fill: true,
                fillColor: {
                    colors: [{
                        opacity: 0.0
                    }, {
                        opacity: 0.2
                    }]
                }
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
    //END JQUERY FLOT CHART

    //BEGIN JQUERY KNOB
    $(".dial").knob({
        'draw' : function () {
            $(this.i).val(this.cv + '%');
        },
        'fgColor': '#B8BEC8'
    });
    $({value: 0}).animate({value: $('.ls-chart input').attr("rel")}, {
        duration: 5000,
        easing:'swing',
        step: function()
        {
            $('.ls-chart input').val(Math.ceil(this.value)).trigger('change');
        }
    });
    $({value: 0}).animate({value: $('.ao-chart input').attr("rel")}, {
        duration: 5000,
        easing:'swing',
        step: function()
        {
            $('.ao-chart input').val(Math.ceil(this.value)).trigger('change');
        }
    });
    //END JQUERY KNOB

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
    $('#ls-number').animateNumber({
        number: 252983,
        numberStep: comma_separator_number_step
    }, 5000);
    $('#ao-number').animateNumber({
        number: 6320,
        numberStep: comma_separator_number_step
    }, 5000);
    //END JQUERY ANIMATE NUMBER

    /********* TAB SHOPPING ***********/
    /*********************************/

    $(".dial").css("top", 0);
    //$(".dial").css("left", 90);
});
;(function($){
    $.fn.Data = function(){};
    var $this = $.fn.Data;

    $.fn.Data.pages = {
        '/': {title:'Dashboard', 'breadcrumb':['Dashboard']},
//        '/charts': {title:'Charts', 'breadcrumb':['Charts', 'Page Charts']},
//        '/form-components': {title:'Form Components', 'breadcrumb':['Form', 'Form Components']},
//        '/form-dropzone-file-upload': {title:'Form Dropzone File Upload', 'breadcrumb':['Form', 'Form Dropzone File Upload']},
//        '/form-editors': {title:'Form Editors', 'breadcrumb':['Form', 'Form Editors']},
//        '/form-layouts': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newlead': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newpayment': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newstudent': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newtest': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newweek': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/table-basic-students': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/table-basic-leads': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/table-basic-attendance': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/table-basic-managetest': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/table-basic-paymenttracking': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
//        '/form-multiple-file-upload': {title:'Form Multiple File Upload', 'breadcrumb':['Form', 'Form Multiple File Upload']},
//        '/form-validation': {title:'Form Validation', 'breadcrumb':['Form', 'Form Validation']},
//        '/form-wizard': {title:'Form Wizard', 'breadcrumb':['Form', 'Form Wizard']},
        '/layout-boxed': {title:'Layout Boxed', 'breadcrumb':['Layout', 'Layout Boxed']},
        '/layout-left-sidebar-collapsed': {title:'Layout Left Sidebar Collapsed', 'breadcrumb':['Layout', 'Layout Left Sidebar Collapsed']},
        '/layout-left-sidebar': {title:'Layout Left Sidebar', 'breadcrumb':['Layout', 'Layout Left Sidebar']},
        '/layout-right-sidebar-collapsed': {title:'Layout Right Sidebar Collapsed', 'breadcrumb':['Layout', 'Layout Right Sidebar Collapsed']},
        '/layout-right-sidebar': {title:'Layout Right Sidebar', 'breadcrumb':['Layout', 'Layout Right Sidebar']},
        '/page-404': {title:'Page 404', 'breadcrumb':['Page', 'Page 404']},
        '/page-500': {title:'Page 500', 'breadcrumb':['Page', 'Page 500']},
        '/page-blank': {title:'Page Blank', 'breadcrumb':['Page', 'Page Blank']},
        '/page-fullcalendar': {title:'Page Fullcalendar', 'breadcrumb':['Page', 'Page Fullcalendar']},
//        '/page-invoice': {title:'Page Invoice', 'breadcrumb':['Page', 'Page Invoice']},
        '/page-lock-screen': {title:'Page Lock Screen', 'breadcrumb':['Page', 'Page Lock Screen']},
//        '/page-pricing-table': {title:'Page Pricing Table', 'breadcrumb':['Page', 'Page Pricing Table']},
        '/page-signin': {title:'Page Signin', 'breadcrumb':['Page', 'Page Signin ']},
        '/page-signup': {title:'Page Signup', 'breadcrumb':['Page', 'Page Signup ']},
//        '/page-portfolio': {title:'Page Portfolio', 'breadcrumb':['Page', 'Page Porfolio ']},
//        '/table-advanced': {title:'Table Advanced', 'breadcrumb':['Table', 'Table Advanced']},
//        '/table-basic': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
//        '/table-editable': {title:'Table Editable', 'breadcrumb':['Table', 'Table Editable']},
//        '/table-responsive': {title:'Table Responsive', 'breadcrumb':['Table', 'Table Responsive']},
//        '/table-datatables': {title:'Table Datatalbes', 'breadcrumb':['Table', 'Table Datatables']},
//        '/transitions': {title:'Transitions', 'breadcrumb':['Transitions', 'Page Transitions']},
 //       '/ui-buttons': {title:'UI Buttons', 'breadcrumb':['Ui', 'Ui Buttons']},
 //       '/ui-general': {title:'UI General', 'breadcrumb':['Ui', 'Ui General']},
//        '/ui-icons': {title:'UI Icons', 'breadcrumb':['Ui', 'Ui Icons']},//
//        '/ui-modals': {title:'UI Modals', 'breadcrumb':['Ui', 'Ui Modals']},
//        '/ui-nestable-list': {title:'UI Nestable List', 'breadcrumb':['Ui', 'Ui Nestable List']},
//        '/ui-portlets': {title:'UI Portlets', 'breadcrumb':['Ui', 'Ui Portlets ']},
//        '/ui-sliders': {title:'UI Sliders', 'breadcrumb':['Ui', 'Ui Sliders']},
//        '/ui-tabs-accordions-navs': {title:'UI Tabs Accordions Navs', 'breadcrumb':['Ui', 'Ui Tabs Accordions Navs']},
//        '/ui-typography': {title:'UI Typography', 'breadcrumb':['Ui', 'Ui Typography']},
 //       '/ui-notific8': {title:'UI Notific8', 'breadcrumb':['UI', 'UI Notific8']},
 //       '/ui-toastr-notification': {title:'Ui Toastr Notification', 'breadcrumb':['UI', 'UI Toastr Notification']},
 //       '/ui-select-dropdown': {title:'UI Select Dropdown', 'breadcrumb':['UI', 'UI Select Dropdown']}
    };

    $.fn.Data.get = function(id){
        if(id && $this.pages[id]){
            return $this.pages[id];
        }
    };

    $.fn.Data.Portlet = function(){
        /*************************/
        /******** Portlet *******/
        $(".portlet").each(function(index, element) {
            var me = $(this);
            $(">.portlet-header>.tools>i", me).click(function(e){
                if($(this).hasClass('fa-chevron-up')){
                    $(">.portlet-body", me).slideUp('fast');
                    $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
                }
                else if($(this).hasClass('fa-chevron-down')){
                    $(">.portlet-body", me).slideDown('fast');
                    $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
                }
                else if($(this).hasClass('fa-cog')){
                    //Show modal
                }
                else if($(this).hasClass('fa-refresh')){
                    //$(">.portlet-body", me).hide();
                    $(">.portlet-body", me).addClass('wait');

                    setTimeout(function(){
                        //$(">.portlet-body>div", me).show();
                        $(">.portlet-body", me).removeClass('wait');
                    }, 1000);
                }
                else if($(this).hasClass('fa-times')){
                    me.remove();
                }
            });
        });
        /******** Portlet *******/
        /***********************/
    };
})(jQuery);
App.controller('FormComponentsController', function($scope, $routeParams){
    $.fn.Data.Portlet();
    setTimeout(function(){
        //BEGIN PLUGINS DATE RANGE PICKER
        $('input[name="daterangepicker-default"]').daterangepicker();
        $('input[name="daterangepicker-date-time"]').daterangepicker({ timePicker: true, timePickerIncrement: 30, format: 'MM/DD/YYYY h:mm A' });
        $('.reportrange').daterangepicker(
            {
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                startDate: moment().subtract('days', 29),
                endDate: moment()
            },
            function(start, end) {
                $('.reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
        );
        $('.reportrange span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        //END PLUGINS DATE RANGE PICKER
        //BEGIN PLUGINS DATE PICKER
        $('.datepicker-default').datepicker();
        $('.datepicker-years').datepicker({
            startView: 1,
            minViewMode: 2
        });
        $('.input-daterange').datepicker({
            format: "dd-mm-yyyy"
        });
        $('.datepicker-inline').datepicker({
            format: "dd-mm-yyyy",
            startView: 2,
            minViewMode: 1
        });
        //END PLUGINS DATE PICKER
        //BEGIN PLUGINS DATETIME PICKER
        $('.datetimepicker-default').datetimepicker();
        $('.datetimepicker-disable-date').datetimepicker({
            pickDate: false
        });
        $('.datetimepicker-disable-time').datetimepicker({
            pickTime: false
        });
        $('.datetimepicker-start').datetimepicker();
        $('.datetimepicker-end').datetimepicker();
        $('.datetimepicker-start').on("change.dp",function (e) {
            $('.datetimepicker-end').data("DateTimePicker").setStartDate(e.date);
        });
        $('.datetimepicker-end').on("change.dp",function (e) {
            $('.datetimepicker-start').data("DateTimePicker").setEndDate(e.date);
        });
        //END PLUGINS DATETIME PICKER
        //BEGIN PLUGINS TIME PICKER
        $('.timepicker-default').timepicker();
        $('.timepicker-24hr').timepicker({
            autoclose: true,
            minuteStep: 1,
            showSeconds: true,
            showMeridian: false
        });
        //END PLUGINS TIME PICKER
        //BEGIN PLUGINS CLOCKFACE TIME PICKER
        $('.clockface-default').clockface();
        $('.clockface-component').clockface({
            format: 'HH:mm',
            trigger: 'manual'
        });
        $('#btn-clockface-component').click(function(e){
            e.stopPropagation();
            $('.clockface-component').clockface('toggle');
        });
        $('.clockface-inline').clockface({
            format: 'H:mm'
        }).clockface('show', '14:30');
        //END PLUGINS CLOCKFACE TIME PICKER
        //BEGIN PLUGINS COLOR PICKER
        $('.colorpicker-default').colorpicker();
        $('.colorpicker-rgba').colorpicker();
        $('.colorpicker-component').colorpicker({
            format: 'hex'
        }).on('changeColor', function(ev) {
            $('.colorpicker-component span i').css('color',ev.color.toHex());
            $('.colorpicker-component input').val(ev.color.toHex());
        });
        //END PLUGINS COLOR PICKER
        // BEGIN PLUGIN MASK INPUT
        $("#date").mask("99/99/9999");
        $("#phone").mask("(999) 999-9999");
        $("#product-key").mask("(aa) 99-999");
        // END PLUGIN MASK INPUT
        setTimeout(function(){
            $('.make-switch').bootstrapSwitch();
        }, 50);
    }, 100);
});
App.controller('FromLayoutsController', function($scope, $routeParams){
    var menu_h = $('#sidebar').height();
    $('#form-layouts-newlead ul.nav-pills li a').live('click', function() {
        var tab_id = $(this).attr('href');
        var tab_h = $(tab_id).height();
        if(tab_h < menu_h){
            $(tab_id).css('height', '960px');
        }
    });
});
App.controller('FromLayoutsController', function($scope, $routeParams){
    var menu_h = $('#sidebar').height();
    $('#form-layouts-newpayment ul.nav-pills li a').live('click', function() {
        var tab_id = $(this).attr('href');
        var tab_h = $(tab_id).height();
        if(tab_h < menu_h){
            $(tab_id).css('height', '960px');
        }
    });
});
App.controller('FromLayoutsController', function($scope, $routeParams){
    var menu_h = $('#sidebar').height();
    $('#form-layouts-newstudent ul.nav-pills li a').live('click', function() {
        var tab_id = $(this).attr('href');
        var tab_h = $(tab_id).height();
        if(tab_h < menu_h){
            $(tab_id).css('height', '960px');
        }
    });
});
App.controller('FromLayoutsController', function($scope, $routeParams){
    var menu_h = $('#sidebar').height();
    $('#form-layouts-newtest ul.nav-pills li a').live('click', function() {
        var tab_id = $(this).attr('href');
        var tab_h = $(tab_id).height();
        if(tab_h < menu_h){
            $(tab_id).css('height', '960px');
        }
    });
});
App.controller('FromLayoutsController', function($scope, $routeParams){
    var menu_h = $('#sidebar').height();
    $('#form-layouts-newweek ul.nav-pills li a').live('click', function() {
        var tab_id = $(this).attr('href');
        var tab_h = $(tab_id).height();
        if(tab_h < menu_h){
            $(tab_id).css('height', '960px');
        }
    });
});
App.controller('FromLayoutsController', function($scope, $routeParams){
    var menu_h = $('#sidebar').height();
    $('#form-layouts ul.nav-pills li a').live('click', function() {
        var tab_id = $(this).attr('href');
        var tab_h = $(tab_id).height();
        if(tab_h < menu_h){
            $(tab_id).css('height', '960px');
        }
    });
});
App.controller('Page404Controller', function ($scope, $routeParams){
    $("body>.default-page").hide();
    $("body>.extra-page").html($(".page-content").html()).show();
    $('body').attr('id', 'error-page');
});
App.controller('Page500Controller', function ($scope, $routeParams){
    $("body>.default-page").hide();
    $("body>.extra-page").html($(".page-content").html()).show();
    $('body').attr('id', 'error-page');
});
App.controller('PageFullcalendarController', function ($scope, $routeParams){
    /* initialize the external events
     -----------------------------------------------------------------*/

    var eventDrag = function(el){
        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim(el.text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        el.data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        el.draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });
    };

    $('#external-events div.external-event').each(function() {
        eventDrag($(this));
    });


    /* initialize the calendar
     -----------------------------------------------------------------*/

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function(date, allDay) { // this function is called when something is dropped

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }

        }
    });

    var addEvent = function (name) {
        name = name.length === 0 ? "Untitled Event" : name;
        var html = $('<div class="external-event label label-default">' + name + '</div>');
        $('#event-block').append(html);
        eventDrag(html);
    };

    $('#event-add').on('click', function () {
        var name = $('#event-name').val();
        addEvent(name);
    });
});
App.controller('PageLockScreenController', function ($scope, $routeParams){
    $("body>.default-page").hide();
    $("body>.extra-page").html($(".page-content").html()).show();
    $('body').attr('id', 'lock-screen');
});
App.controller('PageSigninController', function ($scope, $routeParams){
    $("body>.default-page").hide();
    $("body>.extra-page").html($(".page-content").html()).show();
    $('body').attr('id', 'signin-page');
});
App.controller('PageSignupController', function ($scope, $routeParams){
    $("body>.default-page").hide();
    $("body>.extra-page").html($(".page-content").html()).show();
    $('body').attr('id', 'signup-page');
});
App.controller('TableBasicController', function($scope, $routeParams){
    $.fn.Data.Portlet();
});
App.controller('TableBasicController', function($scope, $routeParams){
    $.fn.Data.Portlet();
});
App.controller('TableBasicController', function($scope, $routeParams){
    $.fn.Data.Portlet();
});
App.controller('TableBasicController', function($scope, $routeParams){
    $.fn.Data.Portlet();
});
App.controller('StudentsTableBasicController', function($scope, $routeParams){
    $.fn.Data.Portlet();
    setTimeout(function(){
        // Init
        var spinner = $( ".spinner" ).spinner();
        var table = $('#table_id').dataTable( {
            "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
        } );

        var tableTools = new $.fn.dataTable.TableTools( table, {
            "sSwfPath": "../vendors/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
            "buttons": [
                "copy",
                "csv",
                "xls",
                "pdf",
                { "type": "print", "buttonText": "Print me!" }
            ]
        } );
        $(".DTTT_container").css("float","right");

    },50);

});
App.directive("ngDropzone", function($parse, $compile){
    return {
        link: function($scope, element, attributes){
            $(attributes.$$element).dropzone({
                url: "http://www.torrentplease.com/dropzone.php",
                maxFilesize: 100,
                paramName: "uploadfile",
                maxThumbnailFilesize: 5,
                init: function() {
                    //$scope.files.push({file: 'added'}); // here works
                    this.on('success', function(file, json) {
                    });

                    this.on('addedfile', function(file) {
                        $scope.$apply(function(){
                            //alert(file);
                            //$scope.files.push({file: 'added'});
                        });
                    });

                    this.on('drop', function(file) {
                        //alert('file');
                    });

                }

            });
        }
    };
});

App.directive("ngMenu", function($parse, $compile){
    return {
        link: function($scope, element, attributes){
            $scope._menu = {status:[], collapse:{}, hover:[]};

            $scope._menu.mouseleave = function(){
                for(var j=0; j<$scope._menu.hover.length; j++){
                    $scope._menu.hover[j] = '';
                }
            };
            $scope._menu.mouseover = function(i){
                for(var j=0; j<$scope._menu.hover.length; j++){
                    $scope._menu.hover[j] = '';
                }
                $scope._menu.hover[i] = 'nav-hover';
            };
            $scope._menu.collapse = function(i){
                $scope._menu.status[i] = !$scope._menu.status[i];

                var current = attributes.$$element.find('a[index='+i+']');

                current.parent('li').addClass('active').siblings().removeClass('active').children('ul').each(function(){
                    $scope._menu.status[$(this).attr('index')] = true;
                });

                if(current.hasClass('btn-fullscreen')){
                    if (!document.fullscreenElement &&
                        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement){
                        if (document.documentElement.requestFullscreen) {
                            document.documentElement.requestFullscreen();
                        } else if (document.documentElement.msRequestFullscreen) {
                            document.documentElement.msRequestFullscreen();
                        } else if (document.documentElement.mozRequestFullScreen) {
                            document.documentElement.mozRequestFullScreen();
                        } else if (document.documentElement.webkitRequestFullscreen) {
                            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                        }
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                    }
                }
            };

            attributes.$$element.find('li').children('a').each(function(index, value){
                $scope._menu.status[index] = true;
                $(this).attr({'ng-click': '_menu.collapse('+index+')', 'index':index});
                $('>ul', $(this).parent('li')).attr({'collapse': '_menu.status['+index+']', 'index':index});
            });

            $(">li", attributes.$$element).each(function(index, value){
                $scope._menu.hover[index] = '';
                $(this).attr({'ng-mouseleave':'_menu.mouseleave()', 'ng-mouseover': '_menu.mouseover('+index+')', 'ng-class':'_menu.hover['+index+']'});
            });

            element.html($compile(element.html())($scope));
        }
    };
});
App.directive("ngTab", function($parse, $compile){
    return {
        link: function (scope, element, attrs) {
            element.click(function(e) {
                e.preventDefault();
            });
        }
    };
});
App.directive("scrollSpy", function($window){
    return {
        restrict: 'A',
        controller: function ($scope) {
            $scope.spies = [];
            this.addSpy = function (spyObj) {
                $scope.spies.push(spyObj);
            };
        },
        link: function (scope, elem, attrs) {
            function toggleChevron(e) {
                $(e.target)
                    .prev('.panel-heading')
                    .find("i.indicator")
                    .toggleClass('glyphicon-chevron-left glyphicon-chevron-down');
            }
            $('#accordion1').on('hidden.bs.collapse', toggleChevron);
            $('#accordion1').on('shown.bs.collapse', toggleChevron);
            //END ACCORDION WITH ICONS

            //BEGIN JQUERY SLIMSCROLL
            $('.scrollspy-example').slimScroll({
                "height": "200",
                "railVisible": true,
                "alwaysVisible": true
            });
            //END JQUERY SLIMSCROLL
        }
    };
});

App.directive('spy', function ($location, $anchorScroll){
    return {
        restrict: "A",
        require: "^scrollSpy",
        link: function(scope, elem, attrs, affix) {
            elem.click(function () {
                $location.hash(attrs.spy);
                $anchorScroll();
            });

            affix.addSpy({
                id: attrs.spy,
                in: function() {
                    elem.addClass('active');
                },
                out: function() {
                    elem.removeClass('active');
                }
            });
        }
    };
});

/* Services */

var studentServices = angular.module('studentServices', ['ngResource']);

studentServices.factory('Student', ['$resource',
  function($resource){
    'use strict';
    return $resource('students/:studentId.json', {}, {
      query: {method:'GET', params:{studentId:'students'}, isArray:true}
    });
  }]);
