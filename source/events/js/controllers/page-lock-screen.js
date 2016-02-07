(function () {
    'use strict';

    angular
        .module('ng-admin')
.controller('PageLockScreenController', function ($scope, $routeParams){
    $("body>.default-page").hide();
    $("body>.extra-page").html($(".page-content").html()).show();
    $('body').attr('id', 'lock-screen');
});
})();    