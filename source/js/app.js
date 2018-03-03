(function(window, angular, $, _, tinymce) {
    'use strict';
    angular
        .module('ng-admin', [
            'ui.grid',
            'ui.utils',
            'ui.mask',
            'ngRoute',
            'ui.bootstrap',
            'ui-notification',
            'lvl.directives.dragdrop',
            'toggle-switch',
            //   'ngTouch', 
            'ngMessages',
            'ngCookies',
            'ui.grid.pagination',
            'ui.grid.cellNav',
            'ui.grid.edit',
            'ui.grid.autoResize',
            'ui.grid.selection',
            'ui.grid.resizeColumns',
            'ui.grid.pinning',
            'ui.grid.moveColumns',
            'ui.grid.exporter',
            'ui.grid.importer',
            'ui.grid.grouping',
            'ui.grid.saveState',
            'ui.select',
            'iso.directives',
            'ngSanitize',
            'angularFileUpload',
            'akoenig.deckgrid',
            'color.picker',
            'angularMoment',
            'textAngular',
            'appFilereader',
            'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle',
            'angular-loading-bar',
            'ngAnimate',
            'ui.tinymce'
        ])

        // allow DI for use in controllers, unit tests for lodash
        .constant('_', window._)

        .value('uiTinymceConfig', {})
        .directive('uiTinymce', ['uiTinymceConfig', function(uiTinymceConfig) {
            uiTinymceConfig = uiTinymceConfig || {};
            var generatedIds = 0;
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ngModel) {
                    var expression, options, tinyInstance;
                    // generate an ID if not present
                    if (!attrs.id) {
                        attrs.$set('id', 'uiTinymce' + generatedIds++);
                    }
                    options = {
                        // Update model when calling setContent (such as from the source editor popup)
                        setup: function(ed) {
                            ed.on('init', function(args) {
                                ngModel.$render();
                            });
                            // Update model on button click
                            ed.on('ExecCommand', function(e) {
                                ed.save();
                                ngModel.$setViewValue(elm.val());
                                if (!scope.$$phase) {
                                    scope.$apply();
                                }
                            });
                            // Update model on keypress
                            ed.on('KeyUp', function(e) {
                                console.log(ed.isDirty());
                                ed.save();
                                ngModel.$setViewValue(elm.val());
                                if (!scope.$$phase) {
                                    scope.$apply();
                                }
                            });
                        },
                        mode: 'exact',
                        elements: attrs.id
                    };
                    if (attrs.uiTinymce) {
                        expression = scope.$eval(attrs.uiTinymce);
                    }
                    else {
                        expression = {};
                    }
                    angular.extend(options, uiTinymceConfig, expression);
                    setTimeout(function() {
                        tinymce.init(options);
                    });


                    ngModel.$render = function() {
                        if (!tinyInstance) {
                            tinyInstance = tinymce.get(attrs.id);
                        }
                        if (tinyInstance) {
                            tinyInstance.setContent(ngModel.$viewValue || '');
                        }
                    };
                }
            };
        }])

        .config(function(NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 10000,
                startTop: 20,
                startRight: 10,
                verticalSpacing: 20,
                horizontalSpacing: 20,
                positionX: 'left',
                positionY: 'bottom'
            });
        })

        .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
            cfpLoadingBarProvider.includeSpinner = false;
            cfpLoadingBarProvider.includeBar = true;
            cfpLoadingBarProvider.latencyThreshold = 100;
        }])

        .run(function($rootScope) {
            $rootScope._ = window._;
        })

        .config(['$provide', function($provide) {
            // decorates the $log instance to disable logging
            $provide.decorator('$log', ['$delegate',
                function($delegate) {
                    var $log, enabled = true;

                    $log = {
                        debugEnabled: function(flag) {
                            enabled = !!flag;
                        }
                    };

                    // methods implemented by Angular's $log service
                    ['log', 'warn', 'info', 'error', 'debug'].forEach(function(methodName) {
                        $log[methodName] = function() {
                            if (!enabled) return;

                            var logger = $delegate;
                            logger[methodName].apply(logger, arguments);
                        };
                    });

                    return $log;
                }
            ]);
        }])
        .run(['$log', function($log) {
            $log.debugEnabled(false);
        }])

        .config(routeConfig)

        .run(function($rootScope, $location, $route, $routeParams, $log) {
            $log.debug('locationpath', $location.path());
            $log.debug('$routeParams', $routeParams);

            $rootScope.$on('$routeChangeSuccess', function() {
                $log.debug('$routeChangeSuccess');
                $log.debug('routecurrent', $route.current);
            });
        })

        // Initialize the application
        .run(['$location', function AppRun($location) {}])

        .run(authrun);

    routeConfig.$inject = ['$routeProvider', '$locationProvider'];

    authrun.$inject = ['$rootScope', '$location', '$cookieStore', '$http', '$log', 'UserServices', '$window', '$cookies'];

    function authrun($rootScope, $location, $cookieStore, $http, $log, UserServices, $window, $cookies) {
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


        var loggedIn = false;
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
            huh3 = _.isEmpty(huh) ? null : JSON.parse(huh);

            $log.debug('authrun globals on $locationChangeStart', huh, huh3);

            if (huh3 !== null) {
                $http.defaults.headers.common['Authorization'] = huh3.currentUser.authdata;
                $log.debug('in currentUser');
                loggedIn = true;
            }


            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/page-signin', '/page-signup', '/change-pwd', '/reset-pwd', '/forgot-pwd', '/page-lock-screen']) === -1;
            var thekey = UserServices.isapikey();
            $log.debug('check logn next', restrictedPage, loggedIn);
            $log.debug('check userservices isapikey', thekey);

            if (restrictedPage && !loggedIn && !thekey) {
                $log.debug('restricted and not logged in');
                //    alert('restricted page');
                $location.path('/page-signin');
            }
        });
    }


    function routeConfig($routeProvider, $locationProvider) {

        $routeProvider
            .when('/main', {
                templateUrl: 'templates/states/main.html'
            })
            .when('/page-signin', {
                templateUrl: 'templates/states/page-signin.html'
            })
            .when('/page-signup', {
                templateUrl: 'templates/states/page-signup.html'
            })
            .when('/change-pwd', {
                templateUrl: 'templates/states/change-pwd.html'
            })
            .when('/reset-pwd', {
                templateUrl: 'templates/states/reset-pwd.html'
            })
            .when('/forgot-pwd', {
                templateUrl: 'templates/states/forgot-pwd.html'
            })
            .when('/page-lock-screen', {
                templateUrl: 'templates/states/page-lock-screen.html',
                controller: 'PageLockScreenController'
            })
            .when('/layout-left-sidebar', {
                templateUrl: 'templates/states/layout-left-sidebar.html'
                //            controller: 'NoneController'
            })
            .when('/table-basic-students', {
                templateUrl: 'templates/states/table-basic-students.html'
            })
            .when('/form-layouts-newstudent', {
                templateUrl: 'templates/states/form-layouts-newstudent.html'
            })
            .when('/form-layouts-editstudent/id/:id', {
                templateUrl: 'templates/states/form-layouts-editstudent.html'
            })
            .when('/form-layouts-editstudent/id/:id/myclass/:myclass', {
                templateUrl: 'templates/states/form-layouts-editstudent.html'
            })
            .when('/table-basic-attendance', {
                templateUrl: 'templates/states/table-basic-attendance.html'
            })
            .when('/table-basic-eventcreation', {
                templateUrl: 'templates/states/table-basic-eventcreation.html'
            })
            .when('/table-basic-testcandidates', {
                templateUrl: 'templates/states/table-basic-testcandidates.html'
            })
            .when('/table-basic-rptbuilder', {
                templateUrl: 'templates/states/table-basic-rptbuilder.html'
            })
            .when('/table-basic-schedule', {
                templateUrl: 'templates/states/table-basic-schedule.php'
            })
            .when('/table-basic-program', {
                templateUrl: 'templates/states/table-basic-program.php'
            })
            .when('/table-basic-htmltemplate', {
                templateUrl: 'templates/states/table-basic-htmltemplate.php'
            })
            .when('/table-basic-testtype', {
                templateUrl: 'templates/states/table-basic-testtype.php'
            })
            .when('/table-basic-classpgm', {
                templateUrl: 'templates/states/table-basic-classpgm.php'
            })
            .when('/table-basic-classrank', {
                templateUrl: 'templates/states/table-basic-classrank.php'
            })
            .when('/table-basic-classtest', {
                templateUrl: 'templates/states/table-basic-classtest.php'
            })
            .when('/table-basic-basic', {
                templateUrl: 'templates/states/table-basic-basic.php'
            })
            .when('/table-basic-paymenttracking', {
                templateUrl: 'templates/states/table-basic-paymenttracking.php'
            })
            .when('/table-basic-rank', {
                templateUrl: 'templates/states/table-basic-ranks.php'
            })
            .when('/table-basic-class', {
                templateUrl: 'templates/states/table-basic-class.php'
            })
            .otherwise({
                redirectTo: '/page-signin'
                //           redirectTo: '/'
            });
        $locationProvider.html5Mode(false);
        //    $locationProvider.hashPrefix('!');
    }
})(window, window.angular, window.$, window._, window.tinymce);
