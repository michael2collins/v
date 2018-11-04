import modelFormatConfig from '../../vendors/ngmodel-format/ngmodel.format';
//import routehelperConfig from '../blocks/router/routehelper';
//import exceptionHandlerProvider from '../blocks/exception/exception-handler.provider';
'use strict';


//https://toddmotto.com/angular-1-6-is-here
//f you’re upgrading to 1.6 and can’t change your entire codebase at once, you can drop in this configuration to enable the bindings back so they work outside $onInit:
//    core.config(function($compileProvider) {
//      $compileProvider.preAssignBindingsEnabled(true);
//    });

function AppConfig($locationProvider, NotificationProvider, IdleProvider, KeepaliveProvider, TitleProvider,
    cfpLoadingBarProvider, $provide, toastr, $compileProvider,
    $logProvider, $routeProvider) {
    'ngInject';

    var minus = function(event) {
        var which = event.which;
        return (which == 45 || which == 189);
    };
    
    //href links on menu get marked unsafe, this is a workaround todo to fix
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
    
    $locationProvider.hashPrefix('');

    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'left',
        positionY: 'bottom'
    });
    // KeepaliveProvider.interval(1);
    //KeepaliveProvider.http("../v1/keepalive");
    IdleProvider.idle(20 * 60);
    IdleProvider.keepalive(false);
    IdleProvider.timeout(5 * 60);
    IdleProvider.windowInterrupt('focus');
    TitleProvider.enabled(true);

    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.latencyThreshold = 100;

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


    /*    core.run(function($rootScope) {
            $rootScope._ = window._;
        });
      */
//    $log.debugEnabled(false);

    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

/*    var config = {
        appErrorPrefix: '[Vdojo Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Vdojo',
        version: '1.0.0'
    };
*/
    // turn debugging off/on (no info or warn)
    if ($logProvider.debugEnabled) {
        $logProvider.debugEnabled(true);
    }

        $locationProvider.html5Mode(false);

}

export default AppConfig;