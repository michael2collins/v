(function(window, angular, $, _, tinymce) {
    'use strict';

    var core = angular.module('ng-admin.core');

    var minus = function(event) {
        var which = event.which;
        return (which == 45 || which == 189);
    };

    core.directive('uiTinymce', ['uiTinymceConfig', function(uiTinymceConfig) {
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
        }]);

    core.config(['$locationProvider', function($locationProvider) {
            //came with angularjs 1.6
          $locationProvider.hashPrefix('');
        }]);
        
    core.config(function(NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 10000,
                startTop: 20,
                startRight: 10,
                verticalSpacing: 20,
                horizontalSpacing: 20,
                positionX: 'left',
                positionY: 'bottom'
            });
        });
    core.config(function(IdleProvider, KeepaliveProvider, TitleProvider) {
           // KeepaliveProvider.interval(1);
            //KeepaliveProvider.http("../v1/keepalive");
            IdleProvider.idle(20*60);
            IdleProvider.keepalive(false);
            IdleProvider.timeout(5*60);
            IdleProvider.windowInterrupt('focus');
            TitleProvider.enabled(true);
        });
        
    core.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
            cfpLoadingBarProvider.includeSpinner = false;
            cfpLoadingBarProvider.includeBar = true;
            cfpLoadingBarProvider.latencyThreshold = 100;
        }]);

    core.config(["modelFormatConfig", function(modelFormatConfig) {
                modelFormatConfig["number"] = {
                    "formatter": function(args) {
                        var modelValue = args.$modelValue,
                            filter = args.$filter;
                        return filter("number")(modelValue);
                    },
                    "parser": function(args) {
                        var val = parseInt(args.$viewValue.replace(/[^0-9\-]/g, ''), 10);
                        return isNaN(val) ? undefined : val;
                    },
                    "isEmpty": function(value) {
                        return !value.$modelValue;
                    },
                    "keyDown": function(args) {
                        var event = args.$event;
                        if (!(global.keyHelper.smallKeyBoard(event) || global.keyHelper.numberKeyBoard(event) || global.keyHelper.functionKeyBoard(event) || minus(event))) {
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }
                };
        }]);
        
    core.config(['$provide', function($provide) {
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
        }]);
        
    core.run(function($rootScope) {
        $rootScope._ = window._;
    });
    
    core.run(['$log', function($log) {
        $log.debugEnabled(false);
    }]);
        
    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }
        
    var config = {
        appErrorPrefix: '[Vdojo Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Vdojo',
        version: '1.0.0'
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', '$routeProvider', 'routehelperConfigProvider', 'exceptionHandlerProvider'];
    function configure ($logProvider, $routeProvider, routehelperConfigProvider, exceptionHandlerProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // Configure the common route provider
        routehelperConfigProvider.config.$routeProvider = $routeProvider;
        routehelperConfigProvider.config.docTitle = 'Vdojo: ';

        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);
    }        
        


})(window, window.angular, window.$, window._, window.tinymce);
