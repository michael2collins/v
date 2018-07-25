(function(window,angular) {
    'use strict';

    angular.module('ng-admin.admin', [
            'ui.grid',
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
            'ui.tinymce'
        
    ]);
})(window,window.angular);