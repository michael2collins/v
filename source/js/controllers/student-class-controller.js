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

    function StudentClassController($scope, $rootScope, $routeParams,
        $log, $http, $location, $timeout, ClassServices) {
        /* jshint validthis: true */
        var vmclass = this;

        vmclass.getStudentClass = getStudentClass;
        vmclass.updateStudentClass = updateStudentClass;
        vmclass.initclasslist = initclasslist;
        vmclass.setStudentClass = setStudentClass;

        vmclass.categorys = '';
        vmclass.ages = '';
        vmclass.pgms = '';
        vmclass.catset = catset;
        vmclass.ageset = ageset;
        vmclass.pgmset = pgmset;
        vmclass.concatset = concatset;
        vmclass.clearSelect = clearSelect;
        vmclass.clearCatSelect = clearCatSelect;
        vmclass.clearAgeSelect = clearAgeSelect;
        vmclass.clearPgmSelect = clearPgmSelect;
        vmclass.classcategories = '';
        vmclass.picID = '';
        vmclass.studentclass = [];
        vmclass.classpictureurl = [];
        vmclass.classstatuses = [];
        vmclass.xlistnew = [];

        vmclass.path = '../v1/studentclass/' + $routeParams.id;
        $log.debug('studentid: ' + $routeParams.id);
        vmclass.classpicpath = '../v1/studentclasspicture';

        vmclass.classlistpath = '../v1/studentclasslist';
        vmclass.classstatuspath = '../v1/studentclassstatuses';

        vmclass.setclasspath = '../v1/studentclass/id/' +
            $routeParams.id +
            '/myclass/' +
            $routeParams.myclass;

        $log.debug('studentid: ' + $routeParams.id);
        $log.debug('studentclass: ' + $routeParams.myclass);
        vmclass.studentclass.contactID = $routeParams.id;

        initclasslist();

        function initclasslist() {
            //if you hit the class tab quickly, the delay below will properly set the pix.
            //need to figure out the relationship of clicking the tab to calling an init.
            $timeout(function () {
                console.log('isotope init');
                activate();
                //          $scope.$broadcast('iso-init', {name:null, params:null});
                //       $rootScope.$broadcast('iso-init', {name:null, params:null});
                //            console.log(vmclass.concat);
                //           $scope.$emit('iso-option', {filter: vmclass.concat});

            }, 300);
        }

        function activate() {
            console.log('class activate');

            getStudentClassList();
            getStudentClassStatuses();

            vmclass.classcategories = ClassServices.distinctCat();
            vmclass.agecategories = ClassServices.distinctAge();
            vmclass.pgmcategories = ClassServices.distinctPgm();
            vmclass.xList = ClassServices.getAll();

            getStudentClass();
        }

        function clearSelect() {
            vmclass.categorys = '';
            vmclass.pgms = '';
            vmclass.ages = '';
            concatset();
            //   vmclass.$emit('iso-method', {name:null, params:null});
            //         var s=angular.element('#isotopeContainer').scope();
            //        console.log('my s');
            //       console.log(s);
            $scope.$emit('iso-option', {
                filter: '*'
            });
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
            //  var items = s.vmclass.xlistnew.studentclasslist.filter(function( obj ) {
            //   console.log("obj classid");
            //   console.log(obj.classid);
            //      return +obj.classid != +0;
            //    });
            //    setTimeout(function(){
            //   console.log("items");
            //   console.log(items);
            //   console.log(s.vmclass.xlistnew.studentclasslist);
            //      s.$apply(s.vmclass.xlistnew.studentclasslist == items);
            //         s.refreshIso();
            //    });
            //            $rootScope.$broadcast('iso-init', {name:null, params:null});
        }

        function clearCatSelect() {
            vmclass.categorys = '';
            concatset();
        }

        function clearPgmSelect() {
            vmclass.pgms = '';
            concatset();
        }

        function clearAgeSelect() {
            vmclass.ages = '';
            concatset();
        }

        function ageset(addition) {
            console.log('addition');
            console.log(addition);
            vmclass.ages = '.' + addition;
            concatset();
        }

        function catset(addition) {
            console.log('addition');
            console.log(addition);
            vmclass.categorys = '.' + addition;
            concatset();
        }

        function pgmset(addition) {
            console.log('addition');
            console.log(addition);
            vmclass.pgms = '.' + addition;
            concatset();
        }

        function concatset() {
            vmclass.concat = vmclass.ages + vmclass.categorys + vmclass.pgms;
            console.log('search concat');
            console.log(vmclass.concat);
        }

        function getStudentClass() {
            return ClassServices.getStudentClass(vmclass.path).then(function (data) {
                $log.debug('getStudentClass returned data');
                $log.debug(data.data);
                vmclass.studentclass = data.data;
                if (vmclass.studentclass.class !== null) { 
                    vmclass.picID = vmclass.studentclass.classseq;
                    getStudentClassPicture();
                    console.log('getting concat using student class');
                    console.log('studentclass is:' + vmclass.studentclass.class);
                    var class2, class2age = '',
                        class2cls = '',
                        class2pgm = '';
    
                    class2 = ClassServices.getclass2(vmclass.studentclass.class);
                    class2cls = class2[0].classcat[0];
                    class2age = class2[0].agecat[0];
                    class2pgm = class2[0].programcat[0];
                    // vmclass.concat= '.' + class2cls + '.' + class2age + '.' + class2pgm;
                    vmclass.catset(class2cls);
                    vmclass.ageset(class2age);
                    vmclass.pgmset(class2pgm);
                    concatset();
                    //  $scope.$emit('iso-method', {name:null, params:null});
                    console.log(vmclass.concat);
                    $scope.$emit('iso-option', {
                        filter: vmclass.concat
                    });
    
                    console.log('student concat result is:' + vmclass.concat);
                }
                return vmclass.studentclass;
            });
        }

        function getStudentClassPicture() {
            return ClassServices.getStudentClassPicture(
                vmclass.classpicpath + '/' +
                vmclass.picID).then(function (data) {
                $log.debug('getStudentClassPicture returned data');
                $log.debug(data.data);
                vmclass.classpictureurl = data.data;

                return vmclass.classpictureurl;
            });
        }

        function getStudentClassList() {
            return ClassServices.getStudentClassList(vmclass.classlistpath).then(function (data) {
                $log.debug('getStudentClassList returned data');
                $log.debug(data.data);
                vmclass.xlistnew = data.data;

                return vmclass.xlistnew;
            });
        }

        function getStudentClassStatuses() {
            return ClassServices.getStudentClassStatuses(
                vmclass.classstatuspath).then(function (data) {
                $log.debug('getStudentClassStatuses returned data');
                $log.debug(data.data);
                vmclass.classstatuses = data.data;

                return vmclass.classstatuses;
            });
        }

        function updateStudentClass() {
            $log.debug('about updateStudentClass ', vmclass.studentclass);
            return ClassServices.updateStudentClass(
                vmclass.path, vmclass.studentclass).then(function (data) {
                $log.debug('updateStudentClass returned data: goto', vmclass.path);
                $log.debug(data.data);
                vmclass.studentclass = data.data;
                getStudentClass();
            });
        }

        function setStudentClass(mystudent, myclassid, mypgmid) {
            var setclasspath = '../v1/studentclass/id/' +
                $routeParams.id +
                '/myclass/' +
                myclassid +
                '/mypgm/' +
                mypgmid;
            $log.debug('studentid: ' + $routeParams.id);
            $log.debug('studentclass: ' + myclassid);
            $log.debug('studentpgm: ' + mypgmid);

            $log.debug('about setStudentClass ', mystudent);
            $log.debug('for class ', myclassid);
            return ClassServices.setStudentClass(
                setclasspath, mystudent, myclassid, mypgmid).then(function (data) {
                $log.debug('setStudentClass returned data: ');
                $log.debug(data.data);
                vmclass.studentclass = data.data;
                getStudentClass();
            });
        }
    }

})();
