(function () {
    'use strict';
    angular
        .module('ng-admin', [
        'ui.grid',
        'ui.utils',
        'ui.mask',
        'ngRoute',
        'ui.bootstrap',
        'ui-notification',
        'lvl.directives.dragdrop',
        'toggle-switch',
     //   'ngTouch', 
        'ngMessages',
        'ngCookies',
        'ui.grid.pagination',
        'ui.grid.cellNav',
        'ui.grid.edit',
        'ui.grid.autoResize',
        'ui.grid.selection',
'ui.grid.resizeColumns', 
'ui.grid.pinning', 
'ui.grid.moveColumns',
'ui.grid.exporter',
'ui.grid.importer', 
'ui.grid.grouping' ,       
'ui.grid.saveState' ,
        'ui.select',
                'iso.directives',
                'ngSanitize',
    'angularFileUpload',
    'akoenig.deckgrid'
        //        'dynamicLayout'
        ])

    // allow DI for use in controllers, unit tests for lodash
    .constant('_', window._)
    .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'center',
            positionY: 'top'
        });
    })

//    .run(authrun)
    // use in views, ng-repeat="x in _.range(3)"
    .run(function ($rootScope) {
            $rootScope._ = window._;
        })
        .config(logConfig)
        .config(routeConfig)
        
    .run(function($rootScope, $location, $route, $routeParams) {
        console.log('locationpath',$location.path());
        console.log('$routeParams',$routeParams);

      $rootScope.$on('$routeChangeSuccess', function () {
            console.log('$routeChangeSuccess');
        console.log('routecurrent',$route.current);
      });
    })
    
    // Initialize the application
    .run(['$location', function AppRun($location) {
        //  debugger; // -->> here i debug the $location object to see what angular see's as URL
        console.log('$location setting in app');
        console.log($location);

    }]);
    
    $(document).ready(function() {
        console.log('fixing for drag-drop');
        jQuery.event.props.push('dataTransfer'); //prevent conflict with drag-drop
        console.log(jQuery.event.props);
    });
    
    logConfig.$inject = ['$logProvider'];
    routeConfig.$inject = ['$routeProvider', '$locationProvider'];
    //    flowConfig.$inject = ['flowFactoryProvider'];

    authrun.$inject = ['$rootScope', '$location', '$cookieStore', '$http', '$log'];
    function authrun($rootScope, $location, $cookieStore, $http, $log) {
        $log.debug('authrun entered');

        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        $log.debug('authrun globals', $rootScope.globals);
        
        if ($rootScope.globals.currentUser) {
//            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.authdata; // jshint ignore:line
            $log.debug('in currentUser');
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            $log.debug('check login on location change',$location.path());
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/page-signin', '/page-signup']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            
            $log.debug('check logn next', restrictedPage, loggedIn);
            
            if (restrictedPage && !loggedIn) {
                $log.debug('restricted and not logged in');
                $location.path('/page-signin');
            }
        });
    }

    function logConfig($logProvider) {
        $logProvider.debugEnabled(true);
    }

    function routeConfig($routeProvider, $locationProvider) {
        console.log('enter routeConfig');
        
        $routeProvider
            .when('/', {
                templateUrl: 'templates/states/main.html',
                controller: 'MainController'
            })
            .when('/page-signin', {
                templateUrl: 'templates/states/page-signin.html'
            })
            .when('/page-signup', {
                templateUrl: 'templates/states/page-signup.html'
            })
            .when('/page-lock-screen', {
                templateUrl: 'templates/states/page-lock-screen.html',
                controller: 'PageLockScreenController'
            })
            .when('/page-404', {
                templateUrl: 'templates/states/page-404.html',
                controller: 'Page404Controller'
            })
            .when('/page-500', {
                templateUrl: 'templates/states/page-500.html',
                controller: 'Page500Controller'
            })
           .when('/tournament', {
                templateUrl: 'templates/states/tournament.html'
            })
            .when('/tournament/id/:id', {
                templateUrl: 'templates/states/tournament.html'
            })
            .otherwise({
                redirectTo: '/page-signin'
     //           redirectTo: '/'
            });
        $locationProvider.html5Mode(false);
        //    $locationProvider.hashPrefix('!');
    }
})();
