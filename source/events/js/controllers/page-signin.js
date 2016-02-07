(function () {

    'use strict';

    angular
        .module('ng-admin')
        .controller('PageSigninController', PageSigninController);
        
        PageSigninController.$inject = [
            '$scope', 
            '$log',
            '$routeParams'
            ];
        function PageSigninController($scope, $log, $routeParams){
        /* jshint validthis: true */

            var vm=this;
            $log.debug('enter login');
            
            
            $("body>.default-page").hide();
            $("body>.extra-page").html($(".page-content").html()).show();
            $('body').attr('id', 'signin-page');
        }

})();    