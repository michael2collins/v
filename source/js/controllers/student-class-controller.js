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
        vmclass.activate = activate;
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
        vmclass.classcategories = [];
        vmclass.pgmcategories = [];
        vmclass.agecategories = [];
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

        activate();


        function activate() {
            $log.debug('class activate');
            
          getStudentClassList().then(function(){
              $log.debug('getStudentClassList ready');
            getStudentClassStatuses();
            $log.debug("listnew in activate", vmclass.xlistnew);

//            vmclass.xList = ClassServices.getAll();

            ClassServices.distinctCat().then(function(data) {
                $log.debug('distinctCat get:', data);
                vmclass.classcategories = data.classcatlist;
                $log.debug("distinctCat in activate", vmclass.classcategories);
            }).catch(function(e){
                $log.debug("distinctCat error in activate", e);
          });

            ClassServices.distinctAge().then(function(data) {
                $log.debug('distinctAge get:', data);
                vmclass.agecategories = data.agecatlist;
                $log.debug("distinctAge in activate", vmclass.agecategories);
            }).catch(function(e){
              $log.debug("distinctAge error", e);
          });

            ClassServices.distinctPgm().then(function(data) {
                $log.debug('distinctPgm get:', data);
                vmclass.pgmcategories = data.pgmcatlist;
            $log.debug("distinctPgm in activate", vmclass.pgmcategories);
            }).catch(function(e){
              $log.debug("distinctPgm error", e);
          });

            getStudentClass().then(function() {
            }).catch(function(e){
              $log.debug("getStudentClass error", e);
          });


          }).catch(function(e){
                $log.debug("getStudentClassList error in activate", e);
          });

          
        }

        function clearSelect() {
            vmclass.categorys = '';
            vmclass.pgms = '';
            vmclass.ages = '';
            concatset();
            $scope.$emit('iso-option', {
                filter: '*'
            });
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
            $log.debug('addition', addition);
            $log.debug('agecategories',vmclass.agecategories);
            vmclass.ages = '.' + addition;
            concatset();
        }

        function catset(addition) {
            $log.debug('addition');
            $log.debug(addition);
            vmclass.categorys = '.' + addition;
            concatset();
        }

        function pgmset(addition) {
            $log.debug('addition');
            $log.debug(addition);
            vmclass.pgms = '.' + addition;
            concatset();
        }

        function concatset() {
            vmclass.concat = vmclass.ages + vmclass.categorys + vmclass.pgms;
            $log.debug('search concat');
            $log.debug(vmclass.concat);
        }

        function getStudentClass() {
            return ClassServices.getStudentClass(vmclass.path).then(function (data) {
                $log.debug('getStudentClass returned data', data.data);
                vmclass.studentclass = data.data;
                if (vmclass.studentclass.class !== null) { 
                    vmclass.picID = vmclass.studentclass.classseq;
                    getStudentClassPicture();

                    $log.debug('studentclass is:' + vmclass.studentclass.class);
                    var class2 = '';

                    class2 = ClassServices.getclass2(vmclass.studentclass.class);
                    $log.debug('studentclass class2 is:' , class2);
                    vmclass.catset(class2[0].classcat[0]);
                    vmclass.ageset(class2[0].agecat[0]);
                    vmclass.pgmset(class2[0].pgmcat[0]);
                    concatset();

                    $log.debug(vmclass.concat);
                    $scope.$emit('iso-option', {
                        filter: vmclass.concat
                    });
    
                    $log.debug('student concat result is:' + vmclass.concat);
                } else {
                     vmclass.studentclass.contactID = $routeParams.id; 
                    $log.debug('studentclass class is null, other data is:', vmclass.studentclass);
                }
                return vmclass.studentclass;
            },function(error) {
                    $log.debug('getStudentClass ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
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
                ClassServices.setxlist(vmclass.xlistnew);
                return vmclass.xlistnew;
            },function(error) {
                    $log.debug('getStudentClassList ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
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
            },function(error) {
                    $log.debug('updateStudentClass ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function setStudentClass(mystudent, myclassid, mypgmid) {
            var setclasspath = '../v1/studentclass/id/' +
                mystudent +
                '/myclass/' +
                myclassid +
                '/mypgm/' +
                mypgmid;
            $log.debug('studentid: ' + mystudent);
            $log.debug('studentclass: ' + myclassid);
            $log.debug('studentpgm: ' + mypgmid);

            $log.debug('about setStudentClass ', mystudent);
            $log.debug('for class ', myclassid);
            return ClassServices.setStudentClass(
                setclasspath, mystudent, myclassid, mypgmid).then(function (data) {
                $log.debug('setStudentClass returned data: ');
                $log.debug(data.data);
            });
        }
    }

})();
