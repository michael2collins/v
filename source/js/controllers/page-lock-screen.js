(function () {
    'use strict';

    angular
        .module('ng-admin')
        .controller('PageLockScreenController', PageLockScreenController);
        
        PageLockScreenController.$inject = [
            '$scope', 
            '$log',
            '$routeParams',
            '$location',
            'UserServices',
            'AttendanceServices',
            'CalendarServices',
            'EventServices',
            'StudentServices',
            'PaymentServices',
            'ClassServices',
            '$q'
            ];
        function PageLockScreenController($scope, $log, $routeParams, 
                $location, UserServices, AttendanceServices, CalendarServices,
                EventServices,StudentServices,PaymentServices, ClassServices,
                $q){
        /* jshint validthis: true */

            var pagevm = this;
            pagevm.init = init;
            
            init();
            
            function init() {
                $log.debug('PageLockScreenController init entered');
                $("body>.default-page").hide();
                $("body>.extra-page").html($(".page-content").html()).show();
                $('body').attr('id', 'lock-screen');
            }    

            (function initController() {
                // reset login status
                UserServices.ClearCredentials();
            })();


        }

})();  