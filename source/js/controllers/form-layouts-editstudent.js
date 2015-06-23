(function () {
    'use strict';

    angular
        .module('ng-admin')
.controller('FormLayoutsControllerEditStudent', FormLayoutsControllerEditStudent);

    FormLayoutsControllerEditStudent.$inject = ['StudentServices', 
    '$scope', 
    '$routeParams', 
    '$log',
    '$location'
    ];
        
    function FormLayoutsControllerEditStudent( StudentServices, $scope, $routeParams,  $log, $location){
        /* jshint validthis: true */
        var vm = this;

        vm.getStudent = getStudent;
        vm.getAllZips = getAllZips;
        vm.updateStudent = updateStudent;        
        vm.students =[];
        vm.genders =[];
        vm.zipList=[];
        vm.stateList=[];
        vm.rankList=[];
        vm.studentTypeList=[];
        vm.contactedTypeList=[];
        vm.schoolList=[];
        vm.reikiLevelList=[];
        vm.instructorLevelList=[];
        
        vm.menu_h = $('#sidebar').height();
        vm.setHeight = setHeight;
        vm.path = '../v1/students/' + $routeParams.id;
//      vm.path = '../v1/students/5340';
        vm.zippath = '../v1/zips';
        
        $log.debug('Hello Debug!');
        $log.debug($routeParams.id);          

        $.fn.Data.Portlet();
        setHeight();
        setLists();
        getAllZips();
        activate();

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
 //   formatYear: 'yy',
 //   startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
  $scope.format = $scope.formats[4];
  
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

        function updateStudent() {
                    $log.debug('about updateStudent ', vm.students);
            return StudentServices.updateStudent(vm.path, vm.students).then(function(data){
                    $log.debug('updateStudent returned data: goto', vm.path);
                    $log.debug(data.data);
                    vm.students = data.data;
                    $log.debug('route', $routeParams);
                      $location.url('/form-layouts-editstudent?id=' + $routeParams.id );
                    return vm.students;
                });
        }
        
        
        function getAllZips() {
            return StudentServices.getAllZips(vm.zippath).then(function(data){
                    $log.debug('getAllZips returned data');
                    $log.debug(data.data);
                    vm.zipList = data.data;
                    
                    return vm.zipList;
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
        function setLists() {
            vm.genders=['Female','Male','Unknown'];
        }
    }
})();    