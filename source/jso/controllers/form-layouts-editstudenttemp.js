(function () {
    'use strict';

    angular
        .module('ng-admin')
.directive('mixitup2',function($timeout){
    var linker = function(scope,element,attrs) {

            scope.$on("cat_done", function(){ 
                $timeout(function(){
                console.log('reload');
                console.log("!================ ");
                element.mixItUp({
                	callbacks: {
                		onMixFail: function(state){	console.log('No elements found matching ',state); },
                		onMixStart: function(state, futureState){ console.log('Animation starting',state); }
                	}
                });
                //do the things
                });
            });

            
        console.log('starting');
        
        
    };
    
    return {
        restrict:'A',
        link: linker
    };
})

.directive("onRepeatDone", function(){
  return {
	        restriction: 'A',
	        link: function($scope, element, attributes ) {
	            //console.log("[onRepeatDone] element",element);
	            $scope.$emit(attributes["onRepeatDone"] || "repeat_done", element);
	        }
	    }
})

  .factory('ListService', function() {
    return {
        xList: [
          {name:'a', number:'1', date:'1360413309421', class:'purple'}
         ,{name:'b', number:'5', date:'1360213309421', class:'orange'}
         ,{name:'c', number:'10', date:'1360113309421', class:'blue'}
         ,{name:'d', number:'2', date:'1360113309421', class:'green'}
        ]

    };
  })
                     
.controller('FormLayoutsControllerEditStudent', FormLayoutsControllerEditStudent);

    FormLayoutsControllerEditStudent.$inject = ['StudentServices', 
    '$scope', 
    '$rootScope',
    '$routeParams', 
    '$log',
    '$location',
    'ListService'
    ];
        
    function FormLayoutsControllerEditStudent( StudentServices, $scope, $rootScope, $routeParams,  $log, $location, ListService){
        /* jshint validthis: true */
        var vm = this;

        vm.getStudent = getStudent;
        vm.getAllZips = getAllZips;
        vm.getStudentLists = getStudentLists;
        vm.getRankList = getRankList;
        vm.updateStudent = updateStudent;        
        vm.students =[];
        vm.genders =[];
        vm.zipList=[];
        vm.ContactTypeList=[];
        vm.CurrentRankList=[];
        vm.CurrentReikiRankList=[];
        vm.StudentSchoolList=[];
        vm.GuiSizeList=[];
        vm.ShirtSizeList=[];
        vm.BeltSizeList=[];
        vm.instructorTitleList=[];
        $rootScope.classcategories=['adult','children','special','blackbelt'];
        
         $rootScope.xList = ListService.xList;

    $rootScope.drawings = [{
        name: 'Water',
        category: 'adult',
        value: '2'
    }, {
        name: 'Fire',
        category: 'adult',
        value: '1'
    }, {
        name: 'Air',
        category: 'children',
        value: '4'
    }, {
        name: 'Coton',
        category: 'blackbelt',
        value: '3'
    }, {
        name: 'Whool',
        category: 'special',
        value: '5'
    }];        
        
        vm.menu_h = $('#sidebar').height();
        vm.setHeight = setHeight;
        vm.enableMediaFilter = enableMediaFilter;
        vm.path = '../v1/students/' + $routeParams.id;
//      vm.path = '../v1/students/5340';
        vm.zippath = '../v1/zips';
        vm.sListPath = '../v1/studentlists';
        vm.rankListPath = '../v1/ranklist';
        
        $log.debug('Hello Debug!');
        $log.debug($routeParams.id);          

//        $.fn.Data.Portlet();
//        setHeight();
        setLists();
        getAllZips();
        getStudentLists();
        getRankList();
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
 
    
        function enableMediaFilter() {
            $log.debug('enable media filter');
            $('.mix-grid').mixItUp();
        }

  
        function activate() {
        return getStudent().then(function() {
            $log.debug('activated EditStudent view');
       //     enableMediaFilter();
       $log.debug('classcategories:' + $rootScope.classcategories);
           $rootScope.$broadcast("cat_done");
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
          //          $log.debug('set route', $routeParams);
          //            $location.url('#/form-layouts-editstudent?id=' + $routeParams.id );
          //          return vm.students;
                    getStudent();
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

        function getStudentLists() {
            return StudentServices.getStudentLists(vm.sListPath).then(function(data){
                    $log.debug('getStudentLists returned data');
                    $log.debug(data.data);
                    vm.StudentList= data.data;
                    
                    return vm.StudentList;
                });
        }

        function getRankList() {
            return StudentServices.getRankList(vm.rankListPath).then(function(data){
                    $log.debug('getRankList returned data');
                    $log.debug(data.data);
                    vm.RankList= data.data;
                    
                    return vm.RankList;
                });
        }
                 
        function setHeight() {
            $('#form-layouts-editstudent ul.nav-pills li a').live('click', function() {
                $log.debug('set height');
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