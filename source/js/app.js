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
        'ui.grid.pagination',
        'ui.grid.cellNav',
        'ui.grid.edit',
        'ui.grid.autoResize',
        'ui.grid.selection',
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
      })
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
            .when('/form-components', {
                templateUrl: 'templates/states/form-components.html',
                controller: 'FormComponentsController'
            })
            .when('/form-layouts', {
                templateUrl: 'templates/states/form-layouts.html',
                controller: 'FromLayoutsController'
            })
            .when('/layout-boxed', {
                templateUrl: 'templates/states/layout-boxed.html',
                controller: 'NoneController'
            })
            .when('/layout-left-sidebar-collapsed', {
                templateUrl: 'templates/states/layout-left-sidebar-collapsed.html',
                controller: 'NoneController'
            })
            .when('/layout-left-sidebar', {
                templateUrl: 'templates/states/layout-left-sidebar.html',
                controller: 'NoneController'
            })
            .when('/layout-right-sidebar-collapsed', {
                templateUrl: 'templates/states/layout-right-sidebar-collapsed.html',
                controller: 'NoneController'
            })
            .when('/layout-right-sidebar', {
                templateUrl: 'templates/states/layout-right-sidebar.html',
                controller: 'NoneController'
            })
            .when('/page-404', {
                templateUrl: 'templates/states/page-404.html',
                controller: 'Page404Controller'
            })
            .when('/page-500', {
                templateUrl: 'templates/states/page-500.html',
                controller: 'Page500Controller'
            })
            .when('/ui-buttons', {
                templateUrl: 'templates/states/ui-buttons.html',
                controller: 'UiButtonsController'
            })
            .when('/ui-general', {
                templateUrl: 'templates/states/ui-general.html',
                controller: 'UiGeneralController'
            })
            .when('/ui-icons', {
                templateUrl: 'templates/states/ui-icons.html',
                controller: 'NoneController'
            })
            .when('/ui-modals', {
                templateUrl: 'templates/states/ui-modals.html',
                controller: 'NoneController'
            })
            .when('/ui-nestable-list', {
                templateUrl: 'templates/states/ui-nestable-list.html',
                controller: 'UiNestableListController'
            })
            .when('/ui-portlets', {
                templateUrl: 'templates/states/ui-portlets.html',
                controller: 'UiPortletsController'
            })
            .when('/ui-sliders', {
                templateUrl: 'templates/states/ui-sliders.html',
                controller: 'UiSlidersController'
            })
            .when('/ui-tabs-accordions-navs', {
                templateUrl: 'templates/states/ui-tabs-accordions-navs.html',
                controller: 'NoneController'
            })
            .when('/ui-typography', {
                templateUrl: 'templates/states/ui-typography.html',
                controller: 'UiTypographyController'
            })
            .when('/ui-notific8', {
                templateUrl: 'templates/states/ui-notific8.html',
                controller: 'UiNotific8Controller'
            })
            .when('/ui-toastr-notifications', {
                templateUrl: 'templates/states/ui-toastr-notifications.html',
                controller: 'UiToastrNotificationsController'
            })
            .when('/ui-select-dropdown', {
                templateUrl: 'templates/states/ui-select-dropdown.html',
                controller: 'UiSelectDropdownController'
            })
            .when('/table-basic-students', {
                templateUrl: 'templates/states/table-basic-students.html'
                    //controller is in template jade
                    //    controller: 'StudentsTableBasicController'
            })
            .when('/form-layouts-newstudent', {
                templateUrl: 'templates/states/form-layouts-newstudent.html'
                    //   controller: 'FormLayoutsControllerNewStudent'
            })
            .when('/form-layouts-editstudent/id/:id', {
                templateUrl: 'templates/states/form-layouts-editstudent.html'
            })
  //          .when('/form-layouts-editstudent/id', {
//                templateUrl: 'templates/states/form-layouts-editstudent.html' //this is wrong
 //           })
            .when('/form-layouts-editstudent/id/:id/myclass/:myclass', {
                templateUrl: 'templates/states/form-layouts-editstudent.html'
            })
            .when('/table-basic-attendance', {
                templateUrl: 'templates/states/table-basic-attendance.html'
                    //    controller: 'AttendanceTableBasicController'
            })
            .when('/table-basic-eventcreation', {
                templateUrl: 'templates/states/table-basic-eventcreation.html'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(false);
        //    $locationProvider.hashPrefix('!');
    }
})();
