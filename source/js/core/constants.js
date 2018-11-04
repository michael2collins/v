//const angular = window.angular;
//const _ = window._;
//const tinymce = window.tinymce;
//const toastr = window.toastr;
import angular from 'angular';
import toastr from 'toastr';
  
export default    angular
        .module('ngadmin.core')
        // allow DI for use in controllers, unit tests for lodash
        .constant('_', window._)
        .constant('toastr', toastr)
        .value('uiTinymceConfig', {});

    