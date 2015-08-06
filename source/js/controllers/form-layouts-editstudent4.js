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
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
])
  .factory('ListService', function() {
    return {     
        xList: [
         {classcat:'cat-karate' , agecat: 'age-adult' , programcat: 'pgm-adult' , classurl: 'adult.jpg',class: 'Adult'},
         {classcat:'cat-special' , agecat: 'age-children' , programcat: 'pgm-other' , classurl: 'afterschool.jpg',class: 'After School'},
         {classcat:'cat-karate' , agecat: 'age-children' , programcat: 'pgm-basic pgm-dragon' , classurl: 'basicdragon.jpg',class: 'Basic Dragon'},
         {classcat:'cat-karate' , agecat: 'age-children' , programcat: 'pgm-bbt1' , classurl: 'bbt1purple.jpg',class: 'BBT1 - Purple - B/G'},
         {classcat:'cat-karate' , agecat: 'age-children' , programcat: 'pgm-basic pgm-leopard' , classurl: 'leopards.jpg',class: 'Basic Leopard'},
         {classcat:'cat-karate' , agecat: 'age-children' , programcat: 'pgm-leopard pgm-bbt1' , classurl: 'bbt1leopard.jpg',class: 'BBT1 Leopard'},
         {classcat:'cat-karate' , agecat: 'age-children' , programcat: 'pgm-bbt2' , classurl: 'bbt2.jpg',class: 'BBT2 - Green'},
         {classcat:'cat-karate' , agecat: 'age-children' , programcat: 'pgm-bbt3' , classurl: 'bbt3.jpg',class: 'BBT3 - Brown'},
         {classcat:'cat-special' , agecat: 'age-children age-adult' , programcat: 'pgm-other' , classurl: 'inactive.jpg',class: 'Inactive'},
         {classcat:'cat-special' , agecat: 'age-children age-adult' , programcat: 'pgm-other' , classurl: 'injured.jpg',class: 'Injured'},
         {classcat:'cat-karate' , agecat: 'age-adult' , programcat: 'pgm-black' , classurl: 'adultblackbelt.jpg',class: 'Blackbelt Adult'},
         {classcat:'cat-karate' , agecat: 'age-children' , programcat: 'pgm-black' , classurl: 'jrblackbelt.jpg',class: 'Blackbelt Jr'},
         {classcat:'cat-fitness' , agecat: 'age-children age-adult' , programcat: 'pgm-other' , classurl: 'kickbox.jpg',class: 'Kickboxing'},
         {classcat:'cat-karate' , agecat: 'age-children' , programcat: 'pgm-bbt' , classurl: 'multiclass.jpg',class: 'BBT - Multiclasses'},
         {classcat:'cat-karate' , agecat: 'age-adult' , programcat: 'pgm-privates' , classurl: 'private.jpg',class: 'Privates Adult'},
         {classcat:'cat-karate' , agecat: 'age-children' , programcat: 'pgm-privates' , classurl: 'privatechild.jpg',class: 'Privates Children'},
         {classcat:'cat-karate' , agecat: 'age-children age-adult' , programcat: 'pgm-other' , classurl: 'saturday.png',class: 'Saturday Only'},
         {classcat:'cat-special' , agecat: 'age-adult' , programcat: 'pgm-other' , classurl: 'selfdefence.jpg',class: 'Self Defense'},
         {classcat:'cat-special' , agecat: 'age-children' , programcat: 'pgm-other' , classurl: 'specialneeds.jpg',class: 'Special Needs'},
         {classcat:'cat-wellness' , agecat: 'age-adult' , programcat: 'pgm-other' , classurl: 'taichi.jpg',class: 'TaiChi'},
         {classcat:'cat-fitness' , agecat: 'age-children age-adult' , programcat: 'pgm-other' , classurl: 'zumba.jpg',class: 'Zoomba'}

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
        $rootScope.classcategories=['karate','fitness','wellness','special'];
        $rootScope.agecategories=['adult','children'];
        $rootScope.pgmcategories=['basic','leopard','dragon','bbt1','bbt2','bbt3','adult','black','privates','other'];
        
         $rootScope.xList = ListService.xList;

        
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