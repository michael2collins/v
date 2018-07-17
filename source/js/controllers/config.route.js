(function(window, angular, Stripe) {
    'use strict';

    angular
        .module('ng-admin.all')
        .run(appRun)
        .run(authrun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
/*            {
                url: '/avengers',
                config: {
                    templateUrl: 'app/avengers/avengers.html',
                    controller: 'Avengers',
                    controllerAs: 'vm',
                    title: 'avengers',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Avengers'
                    }
                }
            },
*/
/*            {
                url: '/main',
                config: { templateUrl: 'templates/states/main.html', settings: {} }
            },
 */           {
                url: '/page-signin',
                config: { templateUrl: 'templates/states/page-signin.html', settings: {} }
            },
            {
                url: '/page-signup',
                config: { templateUrl: 'templates/states/page-signup.html', settings: {} }
            },
            {
                url: '/change-pwd',
                config: { templateUrl: 'templates/states/change-pwd.html', settings: {} }
            },
            {
                url: '/reset-pwd',
                config: { templateUrl: 'templates/states/reset-pwd.html', settings: {} }
            },
            {
                url: '/forgot-pwd',
                config: { templateUrl: 'templates/states/forgot-pwd.html', settings: {} }
            },
            {
                url: '/page-lock-screen',
                config: {
                    templateUrl: 'templates/states/page-lock-screen.html',
                    controller: 'PageLockScreenController',
                    settings: {}
                }
            },
            {
                url: '/layout-left-sidebar',
                config: { templateUrl: 'templates/states/layout-left-sidebar.html', settings: {} }
                //            controller: 'NoneController'
            },
            {
                url: '/table-basic-students',
                config: { templateUrl: 'templates/states/table-basic-students.html', settings: {} }
            },
            {
                url: '/form-layouts-newstudent',
                config: { templateUrl: 'templates/states/form-layouts-newstudent.html', settings: {} }
            },
            {
                url: '/form-layouts-editstudent/id/:id',
                config: { templateUrl: 'templates/states/form-layouts-editstudent.html', settings: {} }
            },
            {
                url: '/form-layouts-editstudent/id/:id/myclass/:myclass',
                config: { templateUrl: 'templates/states/form-layouts-editstudent.html', settings: {} }
            },
            {
                url: '/table-basic-attendance',
                config: { templateUrl: 'templates/states/table-basic-attendance.html', settings: {} }
            },
            {
                url: '/table-basic-eventcreation',
                config: { templateUrl: 'templates/states/table-basic-eventcreation.html', settings: {} }
            },
            {
                url: '/table-basic-testcandidates',
                config: { templateUrl: 'templates/states/table-basic-testcandidates.html', settings: {} }
            },
            {
                url: '/table-basic-rptbuilder',
                config: { templateUrl: 'templates/states/table-basic-rptbuilder.html', settings: {} }
            },
            {
                url: '/table-basic-schedule',
                config: { templateUrl: 'templates/states/table-basic-schedule.php', settings: {} }
            },
            {
                url: '/table-basic-program',
                config: { templateUrl: 'templates/states/table-basic-program.php', settings: {} }
            },
            {
                url: '/table-basic-htmltemplate',
                config: { templateUrl: 'templates/states/table-basic-htmltemplate.php', settings: {} }
            },
            {
                url: '/table-basic-testtype',
                config: { templateUrl: 'templates/states/table-basic-testtype.php', settings: {} }
            },
            {
                url: '/stripe-onboard',
                config: { templateUrl: 'templates/states/stripe_onboard.php', settings: {} }
            },
            {
                url: '/table-basic-classpgm',
                config: { templateUrl: 'templates/states/table-basic-classpgm.php', settings: {} }
            },
            {
                url: '/table-basic-classrank',
                config: { templateUrl: 'templates/states/table-basic-classrank.php', settings: {} }
            },
            {
                url: '/table-basic-classtest',
                config: { templateUrl: 'templates/states/table-basic-classtest.php', settings: {} }
            },
            {
                url: '/table-basic-basic',
                config: { templateUrl: 'templates/states/table-basic-basic.php', settings: {} }
            },
            {
                url: '/table-basic-paymenttracking',
                config: { templateUrl: 'templates/states/table-basic-paymenttracking.php', settings: {} }
            },
            {
                url: '/form-layouts-paymenttracking/id/:id',
                config: { templateUrl: 'templates/states/table-basic-paymenttracking.php', settings: {} }
            },
            {
                url: '/table-basic-rank',
                config: { templateUrl: 'templates/states/table-basic-ranks.php', settings: {} }
            },
            {
                url: '/table-basic-class',
                config: { templateUrl: 'templates/states/table-basic-class.php', settings: {} }
            },
        ];
    }
    


    authrun.$inject = ['$rootScope', '$location', '$cookieStore', '$http', '$log', 'UserServices','StudentServices', '$window', '$cookies', 'Idle'];

    function authrun($rootScope, $location, $cookieStore, $http, $log, UserServices, StudentServices, $window, $cookies, Idle) {
        $log.debug('authrun entered');

        $(document).ready(function() {
            $log.debug('fixing for drag-drop');
            window.jQuery.event.props.push('dataTransfer'); //prevent conflict with drag-drop
            $log.debug(window.jQuery.event.props);

            if ('Notification' in window) {
                // request permission on page load for Notification
                $log.debug('onload permission check b4:', $window.Notification.permission);
                if ($window.Notification.permission !== 'denied') {
                    $window.Notification.requestPermission().then(function(result) {
                        if (result === 'denied') {
                            $log.debug('Permission wasn\'t granted. Allow a retry.');
                            return;
                        }
                        if (result === 'default') {
                            $log.debug('The permission request was dismissed.');
                            return;
                        }
                        // Do something with the granted permission.
                        //var notification = new $window.Notification('Notification title', {
                        //  icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
                        //  body: "Hey there! You've been notified!",
                        //});
                    });
                }
            }

        });

        //disable timeout if not logged in
        Idle.unwatch();

        // keep user logged in after page refresh
        var huh3 = $cookies.get('globals') || {};
        $log.debug('authrun globals orig', huh3);

        if (!_.isEmpty(huh3.currentUser)) {
            $http.defaults.headers.common['Authorization'] = huh3.currentUser.authdata;
            $log.debug('in currentUser');
        }

        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            $log.debug('check login on location change', $location.path());

            // keep user logged in after page refresh
            var huh = $cookies.get('globals') || {};
            var tim = $cookies.get('slim_session') || {};
            huh3 = _.isEmpty(huh) ? null : JSON.parse(huh);

            $log.debug('authrun globals on $locationChangeStart', huh, huh3);



            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/page-signin', '/page-signup', '/change-pwd', '/reset-pwd', '/forgot-pwd', '/page-lock-screen', '/stripe-onboard']) === -1;
            var thekey = UserServices.isapikey();
            $log.debug('check userservices isapikey', thekey);

            if (restrictedPage && !thekey) {
                $log.debug('restricted and not logged in');
                //    alert('restricted page');
                Idle.unwatch();
                $location.path('/page-signin');
            }
            if (huh3 !== null && thekey) {
                $http.defaults.headers.common['Authorization'] = huh3.currentUser.authdata;
                $log.debug('in currentUser');
                stripeConfig(StudentServices,$log,$rootScope);
                Idle.watch();
            }

        });
    }
    function stripeConfig(StudentServices, $log, $rootScope) {
        var path="../v1/stripepub";
        StudentServices.getStripepub(path).then(function(data) {
            $log.debug('getStripepub returned', data);
            $rootScope.stripe = Stripe(data.stripepub);

        }, function(error) {
            $log.debug('Caught an error getStripepub:', error);

        });

    }
    
})(window, window.angular, window.Stripe);
