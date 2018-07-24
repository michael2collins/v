(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.student')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/table-basic-students',
                config: { templateUrl: 'templates/student/table-basic-students.html', settings: {} }
            },
            {
                url: '/form-layouts-newstudent',
                config: { templateUrl: 'templates/student/form-layouts-newstudent.html', settings: {} }
            },
            {
                url: '/form-layouts-editstudent/id/:id',
                config: { templateUrl: 'templates/student/form-layouts-editstudent.html', settings: {} }
            },
            {
                url: '/form-layouts-editstudent/id/:id/myclass/:myclass',
                config: { templateUrl: 'templates/student/form-layouts-editstudent.html', settings: {} }
            },
        ];
    }
    


})(window, window.angular);
