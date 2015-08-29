(function () {
    'use strict';

    angular
        .module('ng-admin')
.controller('StudentClassController', StudentClassController);
    StudentClassController.$inject = [ 
    '$scope', 
    '$rootScope',
    '$routeParams', 
    '$log',
    '$location',
	'$timeout',
    'ClassServices'
    ];
    function StudentClassController( $scope, $rootScope, $routeParams,  $log, $location, $timeout, ClassServices){
        /* jshint validthis: true */
        var vmclass = this;
		vmclass.catadd=catadd;
		vmclass.clearSelect=clearSelect;
		vmclass.classcategories="";	
		vmclass.categorys=[];
		vmclass.ages=[];
		vmclass.pgms=[];
  
  		initclasslist();

		function initclasslist() {
			//if you hit the class tab quickly, the delay below will properly set the pix.  need to figure out the relationship of clicking the tab to calling an init.
			$timeout(function() {
			console.log('isotope init');
					activate();
			$scope.$broadcast('iso-init', {name:null, params:null})

		  }, 2000);
		}
  
  function activate() {
	  console.log('class activate');
//        $rootScope.classcategories= ClassServices.distinctCat();
        vmclass.classcategories= ClassServices.distinctCat();
		console.log("after distinct cat");
		console.log(vmclass.classcategories);

		
//        $rootScope.agecategories= ClassServices.distinctAge();
        vmclass.agecategories= ClassServices.distinctAge();
		console.log("after distinct age");
		console.log(vmclass.agecategories);
//        $rootScope.pgmcategories= ClassServices.distinctPgm();
        vmclass.pgmcategories= ClassServices.distinctPgm();
		console.log("after distinct pgm");
		console.log(vmclass.pgmcategories);
        
//        $rootScope.xList = ClassServices.getAll();
        vmclass.xList = ClassServices.getAll();
        console.log("xList is");
        console.log(vmclass.xList);
//        $rootScope.xListcat = ClassServices.getcat('wellness');
        vmclass.xListcat = ClassServices.getcat('wellness');
		console.log(vmclass.xListcat);
        vmclass.allCategorys = [{"name": "karate"},{"name": "children"}];

  }
  
  function clearSelect() {
    vmclass.categorys = [];
    vmclass.ages = [];
    vmclass.pgms = [];
    vmclass.concat=[];
  }
 function catadd(addition,type) {
      console.log('addition');
      console.log(addition);
      console.log('type');
      console.log(type);
      if (type === "cat") {
        vmclass.categorys=[];
        vmclass.categorys.push('.' + addition);
        console.log(vmclass.categorys);
      }
      if (type === "age") {
          vmclass.ages=[];
        vmclass.ages.push('.' + addition);
      }
      if (type === "pgm") {
          vmclass.pgms=[];
        vmclass.pgms.push( '.' + addition);
      }

    if (vmclass.categorys.length > 0 && typeof(vmclass.categorys) != "undefined") {
          vmclass.concat=vmclass.categorys[0];
    }
    if (vmclass.ages.length > 0 && typeof(vmclass.ages) != "undefined") {
          vmclass.concat=vmclass.concat + vmclass.ages[0];
    }
    if (vmclass.pgms.length > 0 && typeof(vmclass.pgms) != "undefined") {
          vmclass.concat=vmclass.concat + vmclass.pgms[0];
    }
      console.log('search concat');
      console.log(vmclass.concat);
  }
	}

    
})();    