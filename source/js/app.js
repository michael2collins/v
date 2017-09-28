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
    'akoenig.deckgrid',
    'color.picker',
    'angularMoment',
    'textAngular',
    'appFilereader',
    'angularSpectrumColorpicker','ui.bootstrap.dropdownToggle'
//    'ui.grid.autoFitColumns'
  //      'notifyme'

//    'omr.directives'
//    'webcam'
        //        'dynamicLayout'
        //
    
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
    
    // use in views, ng-repeat="x in _.range(3)"
    .run(function ($rootScope) {
            $rootScope._ = window._;
    })
    .config(logConfig)
    .config(routeConfig)
 //   .config(formatterConfig)
        
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

    }])
    
    .run(authrun);

//    formatterConfig.$inject = ['JSONFormatterConfigProvider'];
    logConfig.$inject = ['$logProvider'];
    routeConfig.$inject = ['$routeProvider', '$locationProvider'];
    //    flowConfig.$inject = ['flowFactoryProvider'];

    authrun.$inject = ['$rootScope', '$location', '$cookieStore', '$http', '$log', 'UserServices','$window','$cookies'];
    
    


    function authrun($rootScope, $location, $cookieStore, $http, $log, UserServices, $window, $cookies) {
        $log.debug('authrun entered');

    $(document).ready(function() {
        console.log('fixing for drag-drop');
        window.jQuery.event.props.push('dataTransfer'); //prevent conflict with drag-drop
        console.log(window.jQuery.event.props);

    if ('Notification' in window) {
    // request permission on page load for Notification
        console.log('onload permission check b4:',$window.Notification.permission);
        if ($window.Notification.permission !== 'denied') {
            $window.Notification.requestPermission().then(function(result) {
              if (result === 'denied') {
                console.log('Permission wasn\'t granted. Allow a retry.');
                return;
              }
              if (result === 'default') {
                console.log('The permission request was dismissed.');
                return;
              }
              // Do something with the granted permission.
                var notification = new $window.Notification('Notification title', {
                  icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
                  body: "Hey there! You've been notified!",
                });
            });        
        }
    }
        
    });


        var loggedIn=false;
        // keep user logged in after page refresh
//        var huh2 = $rootScope.globals || {}; 
//        var huh = $cookieStore.get('globals') || {};
        var huh3 = $cookies.get('globals') || {};
        $log.debug('authrun globals orig',  huh3) ;

        if (! _.isEmpty(huh3.currentUser)) {
//            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            $http.defaults.headers.common['Authorization'] = huh3.currentUser.authdata; // jshint ignore:line
            $log.debug('in currentUser');
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            $log.debug('check login on location change',$location.path());

            // keep user logged in after page refresh
//add later            $rootScope.globals = $cookieStore.get('globals') || {};
           // huh2 = $rootScope.globals || {};
            var huh = $cookies.get('globals') || {};
            huh3 = _.isEmpty(huh) ? null : JSON.parse(huh);
            
            $log.debug('authrun globals on $locationChangeStart', huh, huh3);

            if (huh3 !== null ) {
    //            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
                $http.defaults.headers.common['Authorization'] = huh3.currentUser.authdata; // jshint ignore:line
                $log.debug('in currentUser');
                loggedIn = true;
            }


            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/page-signin', '/page-signup', '/change-pwd','/reset-pwd','/forgot-pwd','/page-lock-screen']) === -1;
            var thekey = UserServices.isapikey();
        $log.debug('check logn next', restrictedPage, loggedIn);
        $log.debug('check userservices isapikey', thekey);
            
            if (restrictedPage && !loggedIn) {
                $log.debug('restricted and not logged in');
            //    alert('restricted page');
                $location.path('/page-signin');
            }
        });
    }

 /*   function formatterConfig(JSONFormatterConfigProvider) {

      // Enable the hover preview feature
      JSONFormatterConfigProvider.hoverPreviewEnabled = true;
    }
   */ 
    function logConfig($logProvider) {
        $logProvider.debugEnabled(true);
    }

    function routeConfig($routeProvider, $locationProvider) {
        console.log('enter routeConfig');
        
        $routeProvider
            .when('/main', {
                templateUrl: 'templates/states/main.html'
            })
            .when('/page-signin', {
                templateUrl: 'templates/states/page-signin.html'
            })
            .when('/page-signup', {
                templateUrl: 'templates/states/page-signup.html'
            })
            .when('/change-pwd', {
                templateUrl: 'templates/states/change-pwd.html'
            })
            .when('/reset-pwd', {
                templateUrl: 'templates/states/reset-pwd.html'
            })
            .when('/forgot-pwd', {
                templateUrl: 'templates/states/forgot-pwd.html'
            })
            .when('/page-lock-screen', {
                templateUrl: 'templates/states/page-lock-screen.html',
                controller: 'PageLockScreenController'
            })
            .when('/layout-left-sidebar', {
                templateUrl: 'templates/states/layout-left-sidebar.html'
    //            controller: 'NoneController'
            })
            .when('/table-basic-students', {
                templateUrl: 'templates/states/table-basic-students.html'
            })
            .when('/form-layouts-newstudent', {
                templateUrl: 'templates/states/form-layouts-newstudent.html'
            })
            .when('/form-layouts-editstudent/id/:id', {
                templateUrl: 'templates/states/form-layouts-editstudent.html'
            })
            .when('/form-layouts-editstudent/id/:id/myclass/:myclass', {
                templateUrl: 'templates/states/form-layouts-editstudent.html'
            })
            .when('/table-basic-attendance', {
                templateUrl: 'templates/states/table-basic-attendance.html'
            })
            .when('/table-basic-eventcreation', {
                templateUrl: 'templates/states/table-basic-eventcreation.html'
            })
            .when('/table-basic-testcandidates', {
                templateUrl: 'templates/states/table-basic-testcandidates.html'
            })
            .when('/table-basic-schedule', {
                templateUrl: 'templates/states/table-basic-schedule.php'
            })
            .when('/table-basic-program', {
                templateUrl: 'templates/states/table-basic-program.php'
            })
            .otherwise({
                redirectTo: '/page-signin'
     //           redirectTo: '/'
            });
        $locationProvider.html5Mode(false);
        //    $locationProvider.hashPrefix('!');
    }
})();
