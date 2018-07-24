(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.payment')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/table-basic-paymenttracking',
                config: { templateUrl: 'templates/payment/table-basic-paymenttracking.php', settings: {} }
            },
            {
                url: '/form-layouts-paymenttracking/id/:id',
                config: { templateUrl: 'templates/payment/table-basic-paymenttracking.php', settings: {} }
            },
        ];
    }
    


})(window, window.angular);
