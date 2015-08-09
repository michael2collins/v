(function () {
    'use strict';

    angular
        .module('ng-admin')


  .factory('ListService', function() {
    return {     
        xList: [
         {classcat:'cat-adult' , classurl: 'adult.jpg',class: 'Adult'},
         {classcat:'cat-adult cat-blackbelt' , classurl:'adultblackbelt.jpg' , class:'Blackbelt Adult'},
         {classcat:'cat-children special' , classurl:'afterschool.jpg' , class:'After School'},
         {classcat:'cat-children' , classurl: 'basicdragon.jpg',class: 'Basic Dragon'},
         {classcat:'cat-children' , classurl: 'bbt1purple.jpg',class: 'BBT1 - Purple - B/G'},
         {classcat:'cat-children' , classurl: 'bbt1leopard.jpg',class: 'BBT1 Leopard'},
         {classcat:'cat-children' , classurl: 'bbt2.jpg',class: 'BBT2 - Green'},
         {classcat:'cat-children' , classurl: 'bbt3.jpg',class: 'BBT3 - Brown'},
         {classcat:'cat-special' , classurl: 'inactive.jpg',class: 'Inactive'},
         {classcat:'cat-special' , classurl: 'injured.jpg',class: 'Injured'},
         {classcat:'cat-blackbelt cat-children' , classurl: 'jrblackbelt.jpg',class: 'Blackbelt Jr'},
         {classcat:'cat-adult cateogry-special' , classurl: 'kickbox.jpg',class: 'Kickboxing'},
         {classcat:'cat-children' , classurl: 'leopards.jpg',class: 'Basic Leopard'},
         {classcat:'cat-children' , classurl: 'multiclass.jpg',class: 'BBT - Multiclasses'},
         {classcat:'cat-adult special' , classurl: 'private.jpg',class: 'Privates Adult'},
         {classcat:'cat-children special' , classurl: 'privatechild.jpg',class: 'Privates Children'},
         {classcat:'cat-special' , classurl: 'saturday.png',class: 'Saturday Only'},
         {classcat:'special cat-adult' , classurl: 'selfdefence.jpg',class: 'Self Defense'},
         {classcat:'cat-special' , classurl: 'specialneeds.jpg',class: 'Special Needs'},
         {classcat:'cat-adult special' , classurl: 'taichi.jpg',class: 'TaiChi'},
         {classcat:'cat-special' , classurl: 'zumba.jpg',class: 'Zoomba'}
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