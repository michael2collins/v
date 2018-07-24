(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.portal')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/layout-left-sidebar',
                config: { templateUrl: 'templates/portal/layout-left-sidebar.html', settings: {} }
                //            controller: 'NoneController'
            },
        ];
    }
    

})(window, window.angular);
