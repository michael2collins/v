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
