(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.login')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
           {
                url: '/page-signin',
                config: { templateUrl: 'templates/login/page-signin.html', settings: {} }
            },
            {
                url: '/page-signup',
                config: { templateUrl: 'templates/login/page-signup.html', settings: {} }
            },
            {
                url: '/change-pwd',
                config: { templateUrl: 'templates/login/change-pwd.html', settings: {} }
            },
            {
                url: '/reset-pwd',
                config: { templateUrl: 'templates/login/reset-pwd.html', settings: {} }
            },
            {
                url: '/forgot-pwd',
                config: { templateUrl: 'templates/login/forgot-pwd.html', settings: {} }
            },
            {
                url: '/page-lock-screen',
                config: {
                    templateUrl: 'templates/login/page-lock-screen.html',
                    controller: 'PageLockScreenController',
                    settings: {}
                }
            }
            
        ];
    }
})(window,window.angular);