(function(window, angular, _, tinymce, toastr) {
    'use strict';

    angular
        .module('ng-admin.core')
        // allow DI for use in controllers, unit tests for lodash
        .constant('_', window._)
        .constant('toastr', toastr)
        .value('uiTinymceConfig', {});

    
})(window, window.angular, window._, window.tinymce, window.toastr);
