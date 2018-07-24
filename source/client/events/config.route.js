(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.events')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/table-basic-eventcreation',
                config: { templateUrl: 'templates/events/table-basic-eventcreation.html', settings: {} }
            },
        ];
    }
    


})(window, window.angular);
