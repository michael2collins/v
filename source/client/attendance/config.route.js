(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.attendance')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            
            {
                url: '/table-basic-attendance',
                config: { templateUrl: 'templates/attendance/table-basic-attendance.html', settings: {} }
            },
        ];
    }
    



})(window, window.angular);
