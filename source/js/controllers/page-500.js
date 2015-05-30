(function () {
    'use strict';

    angular
        .module('ng-admin')
.controller('Page500Controller', function ($scope, $routeParams){
    $("body>.default-page").hide();
    $("body>.extra-page").html($(".page-content").html()).show();
    $('body').attr('id', 'error-page');
});
})();    