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
    '$http',
    '$location',
    '$timeout',
    'ClassServices'
    ];
    function StudentClassController( $scope, $rootScope, $routeParams,  $log, $http, $location, $timeout, ClassServices){
        /* jshint validthis: true */
        var vmclass = this;
        
        vmclass.getStudentClass = getStudentClass;
        vmclass.updateStudentClass = updateStudentClass;      
        vmclass.initclasslist = initclasslist;
        vmclass.setStudentClass = setStudentClass;

        vmclass.catadd=catadd;
        vmclass.clearCatSelect=clearCatSelect;
        vmclass.clearAgeSelect=clearAgeSelect;
        vmclass.clearPgmSelect=clearPgmSelect;
        vmclass.classcategories="";    
        vmclass.categorys=[];
        vmclass.picID="";
        vmclass.studentclass=[];
        vmclass.classpictureurl=[];
        vmclass.classstatuses=[];
        vmclass.ages=[];
        vmclass.pgms=[];
        vmclass.xlistnew=[];

        vmclass.path = '../v1/studentclass/' + $routeParams.id;
        $log.debug('studentid: ' + $routeParams.id);          
        vmclass.classpicpath = '../v1/studentclasspicture' ;

        vmclass.classlistpath = '../v1/studentclasslist';
        vmclass.classstatuspath = '../v1/studentclassstatuses';

        vmclass.setclasspath = '../v1/studentclass/id/' + $routeParams.id + '/myclass/' + $routeParams.myclass;
        $log.debug('studentid: ' + $routeParams.id);          
        $log.debug('studentclass: ' + $routeParams.myclass);         
        vmclass.studentclass.contactID = $routeParams.id;
        
          //initclasslist();

        function initclasslist() {
            //if you hit the class tab quickly, the delay below will properly set the pix.  need to figure out the relationship of clicking the tab to calling an init.
            $timeout(function() {
            console.log('isotope init');
                    activate();
            $scope.$broadcast('iso-init', {name:null, params:null});

          }, 2000);
        }
  
  function activate() {
      console.log('class activate');
      
      getStudentClassList();
      getStudentClassStatuses();
      
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
//        vmclass.xListcat = ClassServices.getcat('wellness');
//        console.log(vmclass.xListcat);
//        vmclass.allCategorys = [{"name": "karate"},{"name": "children"}];

        getStudentClass();
  }
  
        function clearCatSelect() {
            vmclass.categorys = [];
            vmclass.concat=[];
            if (vmclass.ages.length > 0 && typeof(vmclass.ages) != "undefined") {
                vmclass.concat=vmclass.concat + vmclass.ages[0];
            }
            if (vmclass.pgms.length > 0 && typeof(vmclass.pgms) != "undefined") {
                vmclass.concat=vmclass.concat + vmclass.pgms[0];
            }
        }
        function clearPgmSelect() {
            vmclass.pgms = [];
            vmclass.concat=[];
            if (vmclass.categorys.length > 0 && typeof(vmclass.categorys) != "undefined") {
                vmclass.concat=vmclass.categorys[0];
            }
            if (vmclass.ages.length > 0 && typeof(vmclass.ages) != "undefined") {
                vmclass.concat=vmclass.concat + vmclass.ages[0];
            }      
        }
        function clearAgeSelect() {
            vmclass.ages = [];
            vmclass.concat=[];
            if (vmclass.categorys.length > 0 && typeof(vmclass.categorys) != "undefined") {
                vmclass.concat=vmclass.categorys[0];
            }
            if (vmclass.pgms.length > 0 && typeof(vmclass.pgms) != "undefined") {
                vmclass.concat=vmclass.concat + vmclass.pgms[0];
            }        
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
  
        function getStudentClass() {
            return ClassServices.getStudentClass(vmclass.path).then(function(data){
                    $log.debug('getStudentClass returned data');
                    $log.debug(data.data);
                    vmclass.studentclass = data.data;
                    vmclass.picID = vmclass.studentclass.classseq;
                    getStudentClassPicture();
                    console.log("getting concat using student class");
                    console.log("studentclass is:" + vmclass.studentclass.class);
                    var class2;
                    var class2age="";
                    var class2cls="";
                    var class2pgm="";
                    class2=ClassServices.getclass2(vmclass.studentclass.class);
                    class2cls=class2[0].classcat[0];
                    class2age=class2[0].agecat[0];
                    class2pgm=class2[0].programcat[0];
//                    vmclass.concat= '.' + class2cls + '.' + class2age + '.' + class2pgm;
                    vmclass.catadd(class2cls, 'cat');
                    vmclass.catadd(class2age, 'age');
                    vmclass.catadd(class2pgm, 'pgm');
                    //$scope.$emit('iso-method', {name:null, params:null});
                    $scope.$broadcast('iso-init', {name:null, params:null});
                    
                    console.log("student concat result is:" + vmclass.concat);

                    return vmclass.studentclass;
                });
        }
        function getStudentClassPicture() {
            return ClassServices.getStudentClassPicture(vmclass.classpicpath + '/' + vmclass.picID).then(function(data){
                    $log.debug('getStudentClassPicture returned data');
                    $log.debug(data.data);
                    vmclass.classpictureurl = data.data;
                    
                    return vmclass.classpictureurl;
                });
        }

        function getStudentClassList() {
            return ClassServices.getStudentClassList(vmclass.classlistpath).then(function(data){
                    $log.debug('getStudentClassList returned data');
                    $log.debug(data.data);
                    vmclass.xlistnew = data.data;
                    
                    return vmclass.xlistnew;
                });
        }
        function getStudentClassStatuses() {
            return ClassServices.getStudentClassStatuses(vmclass.classstatuspath).then(function(data){
                    $log.debug('getStudentClassStatuses returned data');
                    $log.debug(data.data);
                    vmclass.classstatuses = data.data;
                    
                    return vmclass.classstatuses;
                });
        }        
        function updateStudentClass() {
                    $log.debug('about updateStudentClass ', vmclass.studentclass);
            return ClassServices.updateStudentClass(vmclass.path, vmclass.studentclass).then(function(data){
                    $log.debug('updateStudentClass returned data: goto', vmclass.path);
                    $log.debug(data.data);
                    vmclass.studentclass = data.data;
                    getStudentClass();
                });
        }  
        function setStudentClass(mystudent, myclassid, mypgmid) {
                    var setclasspath = '../v1/studentclass/id/' + $routeParams.id + '/myclass/' + myclassid + '/mypgm/' + mypgmid;
                    $log.debug('studentid: ' + $routeParams.id);          
                    $log.debug('studentclass: ' + myclassid);          
                    $log.debug('studentpgm: ' + mypgmid);          
            
                    $log.debug('about setStudentClass ', mystudent);
                    $log.debug('for class ', myclassid);
            return ClassServices.setStudentClass(setclasspath, mystudent, myclassid, mypgmid).then(function(data){
                    $log.debug('setStudentClass returned data: ');
                    $log.debug(data.data);
                    vmclass.studentclass = data.data;
                    getStudentClass();
                });
        }    
    }

    
})();    