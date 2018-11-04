import tinymce from 'tinymce';
import toastr from 'toastr';
import angular from 'angular';
import  authrun  from '../controllers/authrun';
//import { stripeConfig } from '../controllers/stripeconfig';
//import  RouteRun  from '../controllers/config.route';
import config from './config';
import {uiTinymce} from './core.directive';

    'use strict';

export  const CoreModule = angular.module('ngadmin.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ngRoute', 'ngSanitize',
        'ngIdle', 'ngCookies', 'ngMessages',

        /*
         * Our reusable cross app code modules
         */
//            'blocks.exception', 'blocks.logger', 'blocks.router',
        /* 
            3rd party 
        */
            'ui.utils',
            'ui.mask',
            'ui.bootstrap',
            'ui-notification',
            'lvl.directives.dragdrop',
            'toggle-switch',
            'ui.select',
            'iso.directives',
            'angularFileUpload',
            'akoenig.deckgrid',
            'color.picker',
            'angularMoment',
            'textAngular',
    'appFilereader',
    'angularSpectrumColorpicker', 
    'ui.bootstrap.dropdownToggle',
            'angular-loading-bar',
            'ngmodel.format'
        ])
        .constant('_', window._)
        .constant('toastr', toastr)
        .constant('tinymce', tinymce)
        .constant('appErrorPrefix', '[Vdojo Error] ') //Configure the exceptionHandler decorator
        .constant('appTitle', 'Vdojo')
        .constant('version', '1.0.0')
        
        .directive('uiTinymce', uiTinymce)
        .value('uiTinymceConfig', {})
//        .config(stripeConfig)
        .config(config)
        .run(authrun)
//        .run(RouteRun)
        .name;
