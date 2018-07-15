(function(window, angular) {
    'use strict';

    angular.module('ng-admin.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ngRoute', 'ngSanitize',
        'ngIdle', 'ngCookies', 'ngMessages',

        /*
         * Our reusable cross app code modules
         */
            'blocks.exception', 'blocks.logger', 'blocks.router',
        /* 
            3rd party 
        */
            'ui.grid',
            'ui.utils',
            'ui.mask',
            'ui.bootstrap',
            'ui-notification',
            'lvl.directives.dragdrop',
            'toggle-switch',
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
            'angularFileUpload',
            'akoenig.deckgrid',
            'color.picker',
            'angularMoment',
            'textAngular',
            'appFilereader',
            'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle',
            'angular-loading-bar',
            'ui.tinymce',
            'ngmodel.format'
        ]);
})(window,window.angular);