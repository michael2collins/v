(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.testmgmt')
        .run(appRun);
        
    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/table-basic-testcandidates',
                config: { templateUrl: 'templates/testmgmt/table-basic-testcandidates.html', settings: {} }
            }
        ];
    }
    

})(window, window.angular);
