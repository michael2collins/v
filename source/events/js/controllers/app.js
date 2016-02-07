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



    },50);
    }
})();    