(function () {
    'use strict';

    angular
        .module('ng-admin')
.controller('PageSigninController', function ($scope, $routeParams){
    $("body>.default-page").hide();
    $("body>.extra-page").html($(".page-content").html()).show();
    $('body').attr('id', 'signin-page');
});
})();    