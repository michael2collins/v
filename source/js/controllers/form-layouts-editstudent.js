(function () {
    'use strict';

    angular
        .module('ng-admin')
.controller('FormLayoutsControllerEditStudent', FormLayoutsControllerEditStudent);

    FormLayoutsControllerEditStudent.$inject = ['StudentServices', 
    '$scope', 
    '$routeParams', 
    '$log'
    ];
        
    function FormLayoutsControllerEditStudent( StudentServices, $scope, $routeParams, $log){
        /* jshint validthis: true */
        var vm = this;

        vm.getStudent = getStudent;
        vm.students =[];
        vm.menu_h = $('#sidebar').height();
        vm.setHeight = setHeight;
        vm.path = '../v1/students/' + $routeParams.id;
//      vm.path = '../v1/students/5340';

        $log.debug('Hello Debug!');
        $log.debug($routeParams.id);          

        $.fn.Data.Portlet();
        setHeight();
        activate();
        
        function activate() {
        return getStudent().then(function() {
            $log.debug('activated EditStudent view');
            });
        }

        
        function getStudent() {
            return StudentServices.getStudent(vm.path).then(function(data){
                    $log.debug('getStudent returned data');
                    $log.debug(data.data);
                    vm.students = data.data;
                    return vm.students;
                });
        }

                 
        function setHeight() {
            $('#form-layouts-editstudent ul.nav-pills li a').live('click', function() {
                var tab_id = $(this).attr('href');
                var tab_h = $(tab_id).height();
                if(tab_h < vm.menu_h){
                    $(tab_id).css('height', '960px');
                }
            });
        }
    }
})();    