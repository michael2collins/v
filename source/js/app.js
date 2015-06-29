(function() {
    'use strict';
angular
    .module('ng-admin', [
        'ui.grid',    'ui.utils',
        'ngRoute',    
        'ui.bootstrap',    
        'ngTouch',  'ngMessages',
        'ui.grid.pagination',
        'ui.grid.cellNav', 
        'ui.grid.edit', 
        'ui.grid.selection'
        ])
    .config(logConfig)
    .config(routeConfig)
// Initialize the application
.run(['$location', function AppRun($location) {
  //  debugger; // -->> here i debug the $location object to see what angular see's as URL
}]);
    
    logConfig.$inject = ['$logProvider'];
    routeConfig.$inject = ['$routeProvider','$locationProvider'];
    
    function logConfig($logProvider){
        $logProvider.debugEnabled(true);
    }


    function routeConfig($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {templateUrl: 'templates/states/main.html', controller: 'MainController'})
        .when('/form-components', {templateUrl: 'templates/states/form-components.html', controller: 'FormComponentsController'})
        .when('/form-layouts', {templateUrl: 'templates/states/form-layouts.html', controller: 'FromLayoutsController'})
        .when('/layout-boxed', {templateUrl: 'templates/states/layout-boxed.html', controller: 'NoneController'})
        .when('/layout-left-sidebar-collapsed', {templateUrl: 'templates/states/layout-left-sidebar-collapsed.html', controller: 'NoneController'})
        .when('/layout-left-sidebar', {templateUrl: 'templates/states/layout-left-sidebar.html', controller: 'NoneController'})
        .when('/layout-right-sidebar-collapsed', {templateUrl: 'templates/states/layout-right-sidebar-collapsed.html', controller: 'NoneController'})
        .when('/layout-right-sidebar', {templateUrl: 'templates/states/layout-right-sidebar.html', controller: 'NoneController'})
        .when('/page-404', {templateUrl: 'templates/states/page-404.html', controller: 'Page404Controller'})
        .when('/page-500', {templateUrl: 'templates/states/page-500.html', controller: 'Page500Controller'})
        .when('/ui-buttons', {templateUrl: 'templates/states/ui-buttons.html', controller: 'UiButtonsController'})
        .when('/ui-general', {templateUrl: 'templates/states/ui-general.html', controller: 'UiGeneralController'})
        .when('/ui-icons', {templateUrl: 'templates/states/ui-icons.html', controller: 'NoneController'})
        .when('/ui-modals', {templateUrl: 'templates/states/ui-modals.html', controller: 'NoneController'})
        .when('/ui-nestable-list', {templateUrl: 'templates/states/ui-nestable-list.html', controller: 'UiNestableListController'})
        .when('/ui-portlets', {templateUrl: 'templates/states/ui-portlets.html', controller: 'UiPortletsController'})
        .when('/ui-sliders', {templateUrl: 'templates/states/ui-sliders.html', controller: 'UiSlidersController'})
        .when('/ui-tabs-accordions-navs', {templateUrl: 'templates/states/ui-tabs-accordions-navs.html', controller: 'NoneController'})
        .when('/ui-typography', {templateUrl: 'templates/states/ui-typography.html', controller: 'UiTypographyController'})
        .when('/ui-notific8', {templateUrl: 'templates/states/ui-notific8.html', controller: 'UiNotific8Controller'})
        .when('/ui-toastr-notifications', { templateUrl: 'templates/states/ui-toastr-notifications.html', controller: 'UiToastrNotificationsController'})
        .when('/ui-select-dropdown', { templateUrl: 'templates/states/ui-select-dropdown.html', controller: 'UiSelectDropdownController'})
        .when('/table-basic-students', {
            templateUrl: 'templates/states/table-basic-students.html'
            //controller is in template jade
        //    controller: 'StudentsTableBasicController'
            })
        .when('/form-layouts-newstudent', {
            templateUrl: 'templates/states/form-layouts-newstudent.html'
         //   controller: 'FormLayoutsControllerNewStudent'
            })
        .when('/form-layouts-editstudent', {
            templateUrl: 'templates/states/form-layouts-editstudent.html' 
         //   controller: 'FormLayoutsControllerEditStudent'
            })
        .when('/table-basic-attendance', {
            templateUrl: 'templates/states/table-basic-attendance.html'
        //    controller: 'AttendanceTableBasicController'
            })
        .otherwise({
            redirectTo: '/'
          });
        $locationProvider.html5Mode(true);  
    //    $locationProvider.hashPrefix('!'); 
    }
})();
