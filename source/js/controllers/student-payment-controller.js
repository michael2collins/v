(function () {
    'use strict';

    angular
        .module('ng-admin')
.controller('StudentPaymentController', StudentPaymentController);
    StudentPaymentController.$inject = [ 
    '$scope', 
    '$rootScope',
    '$routeParams', 
    '$log',
    '$http',
    '$location',
    '$timeout',
	'ClassServices',
    'PaymentServices'
    ];
    function StudentPaymentController( $scope, $rootScope, $routeParams,  $log, $http, $location, $timeout, ClassServices, PaymentServices){
        /* jshint validthis: true */
        var vmpayment = this;
        
        vmpayment.getStudentPayment = getStudentPayment;
        vmpayment.updateStudentPayment = updateStudentPayment;      
       vmpayment.initclasslist = initclasslist;
   /*      vmpayment.setStudentPayment = setStudentPayment;

        vmpayment.categorys="";
        vmpayment.ages="";
        vmpayment.pgms="";
        vmpayment.catset=catset;
        vmpayment.ageset=ageset;
        vmpayment.pgmset=pgmset;
        vmpayment.concatset=concatset;
        vmpayment.clearSelect=clearSelect;
        vmpayment.clearCatSelect=clearCatSelect;
        vmpayment.clearAgeSelect=clearAgeSelect;
        vmpayment.clearPgmSelect=clearPgmSelect;
        vmpayment.classcategories="";    
        vmpayment.picID="";

        vmpayment.classpictureurl=[];
        vmpayment.classstatuses=[];
        vmpayment.xlistnew=[];
*/
        vmpayment.StudentPayment=[];
		
        vmpayment.path = '../v1/studentclass/' + $routeParams.id;
        $log.debug('studentid: ' + $routeParams.id);          


        vmpayment.setclasspath = '../v1/studentclass/id/' + $routeParams.id + '/myclass/' + $routeParams.myclass;
        $log.debug('studentid: ' + $routeParams.id);          
        $log.debug('StudentPayment: ' + $routeParams.myclass);         
        vmpayment.StudentPayment.contactID = $routeParams.id;
		
        	  vmpayment.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];
			  console.log('colors');
			  console.log(vmpayment.availableColors);
			  vmpayment.singleDemo = {};
			 
        initclasslist();

        function initclasslist() {
            $timeout(function() {
                    activate();

          }, 2000);
        }
  
  function activate() {
      console.log('payment activate');
      
        getStudentPayment();
  }
  /*
        function clearSelect() {
            vmpayment.categorys = "";
            vmpayment.pgms = "";
            vmpayment.ages = "";
            concatset();
         //   vmpayment.$emit('iso-method', {name:null, params:null});
//         var s=angular.element('#isotopeContainer').scope();
 //        console.log('my s');
  //       console.log(s);
            $scope.$emit('iso-option', {filter: '*'});         
            //$scope.$emit('iso-method', {name:'shuffle', params:null});
//  var filtersElem = document.querySelector('.filters-button-group');
//  console.log(filtersElem);
//  eventie.bind( filtersElem, 'click', function( event ) {
    // only work with buttons
//    if ( !matchesSelector( event.target, 'button' ) ) {
//      return;
//    }         
//           var filterValue = event.target.getAttribute('ok-sel');
//           console.log(filterValue);
//  });
  //  var items = s.vmpayment.xlistnew.StudentPaymentlist.filter(function( obj ) {
     //   console.log("obj classid");
     //   console.log(obj.classid);
  //      return +obj.classid != +0;
  //    });
  //    setTimeout(function(){ 
     //   console.log("items");
     //   console.log(items);
     //   console.log(s.vmpayment.xlistnew.StudentPaymentlist);
  //      s.$apply(s.vmpayment.xlistnew.StudentPaymentlist == items);         
//         s.refreshIso();
  //    });
//            $rootScope.$broadcast('iso-init', {name:null, params:null});
        }
        function clearCatSelect() {
            vmpayment.categorys = "";
            concatset();
        }
        function clearPgmSelect() {
            vmpayment.pgms = "";
            concatset();
        }
        function clearAgeSelect() {
            vmpayment.ages = "";
            concatset();
        }

        function ageset(addition) {
            console.log('addition');
            console.log(addition);
            vmpayment.ages = '.' + addition;
            concatset();
        }
        function catset(addition) {
            console.log('addition');
            console.log(addition);
            vmpayment.categorys = '.' + addition;
            concatset();
        }
        function pgmset(addition) {
            console.log('addition');
            console.log(addition);
            vmpayment.pgms = '.' + addition;
            concatset();
        }
        
        function concatset() {
            vmpayment.concat = vmpayment.ages + vmpayment.categorys + vmpayment.pgms;
            console.log('search concat');
            console.log(vmpayment.concat);
        }
  */
        function getStudentPayment() {
            return ClassServices.getStudentClass(vmpayment.path).then(function(data){
                    $log.debug('getStudentPayment returned data');
                    $log.debug(data.data);
                    vmpayment.StudentPayment = data.data;
                    return vmpayment.StudentPayment;
                });
        }
		/*
        function getStudentPaymentPicture() {
            return PaymentServices.getStudentPaymentPicture(vmpayment.classpicpath + '/' + vmpayment.picID).then(function(data){
                    $log.debug('getStudentPaymentPicture returned data');
                    $log.debug(data.data);
                    vmpayment.classpictureurl = data.data;
                    
                    return vmpayment.classpictureurl;
                });
        }

        function getStudentPaymentList() {
            return PaymentServices.getStudentPaymentList(vmpayment.classlistpath).then(function(data){
                    $log.debug('getStudentPaymentList returned data');
                    $log.debug(data.data);
                    vmpayment.xlistnew = data.data;
                    
                    return vmpayment.xlistnew;
                });
        }
        function getStudentPaymentStatuses() {
            return PaymentServices.getStudentPaymentStatuses(vmpayment.classstatuspath).then(function(data){
                    $log.debug('getStudentPaymentStatuses returned data');
                    $log.debug(data.data);
                    vmpayment.classstatuses = data.data;
                    
                    return vmpayment.classstatuses;
                });
        }        
		*/
        function updateStudentPayment() {
                    $log.debug('about updateStudentPayment ', vmpayment.StudentPayment);
            return ClassServices.updateStudentClass(vmpayment.path, vmpayment.StudentPayment).then(function(data){
                    $log.debug('updateStudentPayment returned data: goto', vmpayment.path);
                    $log.debug(data.data);
                    vmpayment.StudentPayment = data.data;
                    getStudentPayment();
                });
        } 
/*		
        function setStudentPayment(mystudent, myclassid, mypgmid) {
                    var setclasspath = '../v1/StudentPayment/id/' + $routeParams.id + '/myclass/' + myclassid + '/mypgm/' + mypgmid;
                    $log.debug('studentid: ' + $routeParams.id);          
                    $log.debug('StudentPayment: ' + myclassid);          
                    $log.debug('studentpgm: ' + mypgmid);          
            
                    $log.debug('about setStudentPayment ', mystudent);
                    $log.debug('for class ', myclassid);
            return PaymentServices.setStudentPayment(setclasspath, mystudent, myclassid, mypgmid).then(function(data){
                    $log.debug('setStudentPayment returned data: ');
                    $log.debug(data.data);
                    vmpayment.StudentPayment = data.data;
                    getStudentPayment();
                });
        }    
*/    }

    
})();    