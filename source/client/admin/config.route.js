(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.admin')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/table-basic-rptbuilder',
                config: { templateUrl: 'templates/admin/table-basic-rptbuilder.html', settings: {} }
            },
            {
                url: '/table-basic-schedule',
                config: { templateUrl: 'templates/admin/table-basic-schedule.html', settings: {} }
            },
            {
                url: '/table-basic-program',
                config: { templateUrl: 'templates/admin/table-basic-program.html', settings: {} }
            },
            {
                url: '/table-basic-htmltemplate',
                config: { templateUrl: 'templates/admin/table-basic-htmltemplate.html', settings: {} }
            },
            {
                url: '/table-basic-testtype',
                config: { templateUrl: 'templates/admin/table-basic-testtype.html', settings: {} }
            },
            {
                url: '/stripe-onboard',
                config: { templateUrl: 'templates/admin/stripe_onboard.php', settings: {} }
            },
            {
                url: '/table-basic-classpgm',
                config: { templateUrl: 'templates/admin/table-basic-classpgm.html', settings: {} }
            },
            {
                url: '/table-basic-classrank',
                config: { templateUrl: 'templates/admin/table-basic-classrank.html', settings: {} }
            },
            {
                url: '/table-basic-classtest',
                config: { templateUrl: 'templates/admin/table-basic-classtest.html', settings: {} }
            },
            {
                url: '/table-basic-basic',
                config: { templateUrl: 'templates/admin/table-basic-basic.html', settings: {} }
            },
            {
                url: '/table-basic-rank',
                config: { templateUrl: 'templates/admin/table-basic-ranks.html', settings: {} }
            },
            {
                url: '/table-basic-class',
                config: { templateUrl: 'templates/admin/table-basic-class.html', settings: {} }
            },
        ];
    }
    

})(window, window.angular);
