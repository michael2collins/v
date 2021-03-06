(function (window, angular) {
    'use strict';
 
    angular
        .module('ngadmin')
 
    .controller('AppController', AppControllerFirst)
    .controller('NoneController', AppControllerNone)
	.controller('HeaderController', AppControllerMain);


    AppControllerFirst.$inject = ['$scope', 
    '$routeParams', 
    'UserServices'
    ];
    AppControllerNone.$inject = ['$scope', 
    '$routeParams', 
    'UserServices'
    ];
    AppControllerMain.$inject = ['$scope', 
    '$routeParams', 
    'UserServices'
    ];	
	
    function AppControllerFirst( $scope, $routeParams, UserServices){
        /* jshint validthis: true */
        var vm = this;
        var $ = angular.element;
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
    vm.islogin = islogin;
    vm.userdta;

    function islogin() {
    //    console.log('islogin', UserServices.isapikey());
        return UserServices.isapikey();
    }

    $scope.$on('$routeChangeSuccess', function (event, current, previous){
        console.log('routechange in app for success');
        vm.header.animation = 'fadeInUp';
        setTimeout(function(){
            vm.header.animation = '';
        }, 100);
        
        vm.userdta = UserServices.getUserDetails();
        console.log('$routeChangeSuccess', vm.userdta);

        console.log('originalPath', current.originalPath);

        vm.data = $.fn.Data.get(current.originalPath);
        console.log('data in $routeChangeSuccess',vm.data);

        if(-1 == $.inArray(current.originalPath, [ '/page-lock-screen', '/page-signup', '/page-signin', '/info', '/reset-pwd', '/change-pwd', '/forgot-pwd' , '/terms' ])){
            $("body>.default-page").show();
//            $("body>.extra-page").hide();
        }
        else{
            window.scrollTo(0,0);
        }
  //      vm.header.boxed = '';
        vm.header.layout_topbar = '';
        vm.header.layout_menu = '';
        vm.header.header_topbar = '';

        if('/layout-left-sidebar' === current.originalPath){
            vm.header.boxed = '';
            vm.header.layout_topbar = '';
            vm.header.layout_menu = '';
            vm.header.header_topbar = '';
 //           $('#wrapper').removeClass('right-sidebar');
            $('body').removeClass('left-side-collapsed');
 //           $('body').removeClass('layout-boxed');
            $('body > .default-page').removeClass('container');
            $('#topbar .navbar-header').removeClass('logo-collapsed');
            $('body').addClass('sidebar-fixed');
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                "height": $(window).height() - 50,
                'width': '250px',
                'wheelStep': 5
            });
 //           $('body').removeClass('right-side-collapsed');
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
  //          $('#wrapper').removeClass('right-sidebar');
            $('body').removeClass('left-side-collapsed');
//            $('body').removeClass('right-side-collapsed');
//            $('body').removeClass('layout-boxed');
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
	function AppControllerNone( $scope, $routeParams){
        console.log('AppControllerNone');
    }

	function AppControllerMain( $scope, $routeParams){
    console.log('AppControllerMain');
    

    }
})(window,window.angular);    