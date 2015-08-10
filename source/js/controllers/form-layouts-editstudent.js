(function () {
    'use strict';

    angular
        .module('ng-admin')
.controller('MainCtrl', function(STATES) {
  var main = this;
  
  main.clearSelect = function() {
    main.states = [];
  }
  
  main.allStates = STATES;
  main.states = [];
  main.states.push(STATES[0]);
  main.states.push(STATES[1]);
})
.controller('CatCtrl', function(CATEGORYS) {
  var cat = this;
  
  cat.clearSelect = function() {
    cat.categorys = [];
  }
  cat.add = function(addition) {
      cat.categorys.push(addition);
  }
  cat.allCategorys = CATEGORYS;
  cat.categorys = [];
  cat.categorys.push(CATEGORYS[0]);

})
.directive('chosen', function() {
  var linker = function(scope, element, attr) {
        // update the select when data is loaded
        scope.$watch(attr.chosen, function(oldVal, newVal) {
            element.trigger('chosen:updated');
        });

        // update the select when the model changes
        scope.$watch(attr.ngModel, function() {
            element.trigger('chosen:updated');
        });
        
        element.chosen();
    };

    return {
        restrict: 'A',
        link: linker
    };
})
.constant('CATEGORYS', 
[
    {
        "name": "XXX",
        "abbreviation": "AL"
    }
])
.constant('STATES', 
[
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },

    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
])
  .factory('ListService', function() {
      var factry = {};
      var xlist = {
        "xList": [
         {"classcat": 'cat-karate' , "agecat": 'age-adult' , "programcat": 'pgm-adult' , "classurl": 'adult.jpg',"class": 'Adult'},
         {"classcat": 'cat-special' , "agecat": 'age-children' , "programcat": 'pgm-other' , "classurl": 'afterschool.jpg',"class": 'After School'},
         {"classcat": 'cat-karate' , "agecat": 'age-children' , "programcat": 'pgm-basic pgm-dragon' , "classurl": 'basicdragon.jpg',"class": 'Basic Dragon'},
         {"classcat": 'cat-karate' , "agecat": 'age-children' , "programcat": 'pgm-bbt1' , "classurl": 'bbt1purple.jpg',"class": 'BBT1 - Purple - B/G'},
         {"classcat": 'cat-karate' , "agecat": 'age-children' , "programcat": 'pgm-basic pgm-leopard' , "classurl": 'leopards.jpg',"class": 'Basic Leopard'},
         {"classcat": 'cat-karate' , "agecat": 'age-children' , "programcat": 'pgm-leopard pgm-bbt1' , "classurl": 'bbt1leopard.jpg',"class": 'BBT1 Leopard'},
         {"classcat": 'cat-karate' , "agecat": 'age-children' , "programcat": 'pgm-bbt2' , "classurl": 'bbt2.jpg',"class": 'BBT2 - Green'},
         {"classcat": 'cat-karate' , "agecat": 'age-children' , "programcat": 'pgm-bbt3' , "classurl": 'bbt3.jpg',"class": 'BBT3 - Brown'},
         {"classcat": 'cat-special' , "agecat": 'age-children age-adult' , "programcat": 'pgm-other' , "classurl": 'inactive.jpg',"class": 'Inactive'},
         {"classcat": 'cat-special' , "agecat": 'age-children age-adult' , "programcat": 'pgm-other' , "classurl": 'injured.jpg',"class": 'Injured'},
         {"classcat": 'cat-karate' , "agecat": 'age-adult' , "programcat": 'pgm-black' , "classurl": 'adultblackbelt.jpg',"class": 'Blackbelt Adult'},
         {"classcat": 'cat-karate' , "agecat": 'age-children' , "programcat": 'pgm-black' , "classurl": 'jrblackbelt.jpg',"class": 'Blackbelt Jr'},
         {"classcat": 'cat-fitness' , "agecat": 'age-children age-adult' , "programcat": 'pgm-other' , "classurl": 'kickbox.jpg',"class": 'Kickboxing'},
         {"classcat": 'cat-karate' , "agecat": 'age-children' , "programcat": 'pgm-bbt' , "classurl": 'multiclass.jpg',"class": 'BBT - Multiclasses'},
         {"classcat": 'cat-karate' , "agecat": 'age-adult' , "programcat": 'pgm-privates' , "classurl": 'private.jpg',"class": 'Privates Adult'},
         {"classcat": 'cat-karate' , "agecat": 'age-children' , "programcat": 'pgm-privates' , "classurl": 'privatechild.jpg',"class": 'Privates Children'},
         {"classcat": 'cat-karate' , "agecat": 'age-children age-adult' , "programcat": 'pgm-other' , "classurl": 'saturday.png',"class": 'Saturday Only'},
         {"classcat": 'cat-special' , "agecat": 'age-adult' , "programcat": 'pgm-other' , "classurl": 'selfdefence.jpg',"class": 'Self Defense'},
         {"classcat": 'cat-special' , "agecat": 'age-children' , "programcat": 'pgm-other' , "classurl": 'specialneeds.jpg',"class": 'Special Needs'},
         {"classcat": 'cat-wellness' , "agecat": 'age-adult' , "programcat": 'pgm-other' , "classurl": 'taichi.jpg',"class": 'TaiChi'},
         {"classcat": 'cat-fitness' , "agecat": 'age-children age-adult' , "programcat": 'pgm-other' , "classurl": 'zumba.jpg',"class": 'Zoomba'}

      ]};
      
      factry.getAll = function() {
          return{
              xlist: xlist
          };
      }
      return factry;
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
        vm.catadd = catadd;
        vm.clearSelect = clearSelect;
        vm.students =[];
        vm.genders =[];
        vm.zipList=[];
        vm.concat="";
        vm.ContactTypeList=[];
        vm.CurrentRankList=[];
        vm.CurrentReikiRankList=[];
        vm.StudentSchoolList=[];
        vm.GuiSizeList=[];
        vm.ShirtSizeList=[];
        vm.BeltSizeList=[];
        vm.instructorTitleList=[];
        $rootScope.classcategories=['karate','fitness','wellness','special'];
        $rootScope.agecategories=['adult','children'];
        $rootScope.pgmcategories=['basic','leopard','dragon','bbt1','bbt2','bbt3','adult','black','privates','other'];
        
        $rootScope.xList = ListService.getAll();
        console.log("xList is");
        console.log($rootScope.xList);
  vm.allCategorys = [{"name": "karate"},{"name": "children"}];
  vm.categorys = [];
  vm.ages=[];
  vm.pgms=[];
  
  function clearSelect() {
    vm.categorys = [];
    vm.ages = [];
    vm.pgms = [];
    vm.concat=[];
  }
 function catadd(addition,type) {
      console.log('addition');
      console.log(addition);
      console.log('type');
      console.log(type);
      if (type === "cat") {
        vm.categorys=[];
        vm.categorys.push('.' + addition);
        console.log(vm.categorys);
      }
      if (type === "age") {
          vm.ages=[];
        vm.ages.push('.' + addition);
      }
      if (type === "pgm") {
          vm.pgms=[];
        vm.pgms.push( '.' + addition);
      }

    if (vm.categorys.length > 0 && typeof(vm.categorys) != "undefined") {
          vm.concat=vm.categorys[0];
    }
    if (vm.ages.length > 0 && typeof(vm.ages) != "undefined") {
          vm.concat=vm.concat + vm.ages[0];
    }
    if (vm.pgms.length > 0 && typeof(vm.pgms) != "undefined") {
          vm.concat=vm.concat + vm.pgms[0];
    }
      console.log('search concat');
      console.log(vm.concat);
  }

     
         
        
        vm.menu_h = $('#sidebar').height();
        vm.setHeight = setHeight;
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
 
    

  
        function activate() {
        return getStudent().then(function() {
            $log.debug('activated EditStudent view');
       //     enableMediaFilter();
       $log.debug('classcategories:' + $rootScope.classcategories);
       $log.debug('agecategories:' + $rootScope.agecategories);
       $log.debug('cpgmcategories:' + $rootScope.pgmcategories);
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