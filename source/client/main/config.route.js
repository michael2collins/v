(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.main')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/main',
                config: { templateUrl: 'templates/main/main.html', settings: {} }
            }
        ];
    }
})(window,window.angular);