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
        'ClassServices',
        'Notification',
        '$q'
    ];

    function StudentClassController($scope, $rootScope, $routeParams,
        $log, $http, $location, $timeout, ClassServices, Notification, $q) {
        /* jshint validthis: true */
        var vmclass = this;

        vmclass.getStudentClass = getStudentClass;
        vmclass.updateStudentClass = updateStudentClass;
        vmclass.changeStudentStatus = changeStudentStatus;
        vmclass.getClassPgm = getClassPgm;
        vmclass.addStudentRegistration = addStudentRegistration;
        vmclass.removeStudentRegistration = removeStudentRegistration;
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
        vmclass.studentclass = {};
        vmclass.studentclass2 = {};
        vmclass.studentclazzlist = [];
        vmclass.classpictureurl = [];
        vmclass.classpictureurllist = [];
        vmclass.classstatuses = [];
        vmclass.xlistnew = [];
        vmclass.changestatus = false;
        vmclass.getClassSearchResult = getClassSearchResult;

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

        function getClassSearchResult(){
            $log.debug('search finish, get result');
            vmclass.studentclass = ClassServices.getClassSearchResult();
        }

        function activate() {
            $log.debug('class activate');
            $q.all([
            
          getStudentClassList().then(function(){
              $log.debug('getStudentClassList ready');
            getStudentClassStatuses();
            $log.debug("listnew in activate", vmclass.xlistnew);

          }).catch(function(e){
                $log.debug("getStudentClassList error in activate", e);
          }),
          getStudentClazzList().then(function(){
              $log.debug('getStudentClazzList ready');
    //        getStudentClassStatuses();
     //       $log.debug("listnew in activate", vmclass.xlistnew);

          }).catch(function(e){
                $log.debug("getStudentClassList error in activate", e);
          }),
            ClassServices.distinctCat().then(function(data) {
                $log.debug('distinctCat get:', data);
                vmclass.classcategories = data.classcatlist;
                $log.debug("distinctCat in activate", vmclass.classcategories);
            }).catch(function(e){
                $log.debug("distinctCat error in activate", e);
          }),

            ClassServices.distinctAge().then(function(data) {
                $log.debug('distinctAge get:', data);
                vmclass.agecategories = data.agecatlist;
                $log.debug("distinctAge in activate", vmclass.agecategories);
            }).catch(function(e){
              $log.debug("distinctAge error", e);
          }),

            ClassServices.distinctPgm().then(function(data) {
                $log.debug('distinctPgm get:', data);
                vmclass.pgmcategories = data.pgmcatlist;
            $log.debug("distinctPgm in activate", vmclass.pgmcategories);
            }).catch(function(e){
              $log.debug("distinctPgm error", e);
          }),

//            getStudentClass().then(function() {
//            }).catch(function(e){
//              $log.debug("getStudentClass error", e);
//          })

                ])
                .then(function() {
                    $log.debug('studentclass activation done returned');
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
 //           $log.debug('addition', addition);
  //          $log.debug('agecategories',vmclass.agecategories);
            vmclass.ages = '.' + addition;
            concatset();
        }

        function catset(addition) {
  //          $log.debug('addition');
//            $log.debug(addition);
            vmclass.categorys = '.' + addition;
            concatset();
        }

        function pgmset(addition) {
  //          $log.debug('addition');
//            $log.debug(addition);
            vmclass.pgms = '.' + addition;
            concatset();
        }

        function concatset() {
            vmclass.concat = vmclass.ages + vmclass.categorys + vmclass.pgms;
//            $log.debug('search concat');
 //           $log.debug(vmclass.concat);
        }

        function getClassPgm(myclassid, mypgmid) {
            var path = '../v1/studentclass/myclass/' +
                myclassid +
                '/mypgm/' +
                mypgmid;
            
            return ClassServices.getClassPgm(path).then(function (data) {
                $log.debug('getClassPgm returned data', data);
                vmclass.studentclass = data;
                vmclass.classpictureurl = data.pictureurl;
/*
                if (vmclass.studentclass !== 'undefined') { 
                    vmclass.picID = vmclass.studentclass.classseq;
                    getStudentClassPicture().then(function(retdata) {
                        $log.debug('studentclasspiclist is:' + vmclass.studentclass.class);
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
                        
                    });

                } else {
//                     vmclass.studentclass.contactID = $routeParams.id; 
 //                   $log.debug('studentclass class is null, other data is:', vmclass.studentclass);
                }
                */
                return vmclass.studentclass;
            },function(error) {
                    $log.debug('getStudentClass ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
            
        }
        function getStudentClass() {
            return ClassServices.getStudentClass(vmclass.path).then(function (data) {
                $log.debug('getStudentClass returned data', data);
                vmclass.studentclass = data.data;
                vmclass.classpictureurl = data.data.pictureurl;

  //              if (vmclass.studentclass.class !== null) { 
//                    vmclass.picID = vmclass.studentclass.classseq;
  /*                  getStudentClassPicture().then(function(retdata) {
                        $log.debug('studentclasspiclist is:' + vmclass.studentclass.class);
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
                        
                    });
*/
//                } else {
//                     vmclass.studentclass.contactID = $routeParams.id; 
 //                   $log.debug('studentclass class is null, other data is:', vmclass.studentclass);
 //               }
                return vmclass.studentclass;
            },function(error) {
                    $log.debug('getStudentClass ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });

        }

        function getStudentClazzList() {
            $log.debug('getStudentClazzList entered:' + $routeParams.id);
            var path = '../v1/studentclasslist/' + $routeParams.id;
            return ClassServices.getStudentClassList(path).then(function (data) {
                vmclass.studentclazzlist = data.data.studentclasslist;
                $log.debug('studentclazzlist returned data', vmclass.studentclazzlist);
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
        function getStudentClassPictureList() {
            var path="../v1/studentclasspicturelist/" + $routeParams.id;
            return ClassServices.getStudentClassPictureList(path).then(function (data) {
                $log.debug('getStudentClassPictureList returned data');
                $log.debug(data);
                vmclass.classpictureurllist = data.picturelist;

                return vmclass.classpictureurllist;
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

        function changeStudentStatus(clazzitem) {
            $log.debug('about changeStudentStatus ', vmclass.changestatus);
            vmclass.changestatus = true;
            updateStudentClass(clazzitem);
        }
        function updateStudentClass(clazzitem) {
             var path = '../v1/studentclass/' + $routeParams.id;
            clazzitem.contactID = $routeParams.id;
            clazzitem.changestatus = vmclass.changestatus;
            $log.debug('about updateStudentClass ', clazzitem);
            return ClassServices.updateStudentClass(
                path, clazzitem).then(function (data) {
                $log.debug('updateStudentClass returned data');
                $log.debug(data.data);
                vmclass.studentclass = data.data;
            },function(error) {
                    $log.debug('updateStudentClass ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function addStudentRegistration() {
            
            var path = "../v1/studentregistration";
            var thedata = {
                studentid: $routeParams.id,
                classseq: vmclass.studentclass.classseq,
                pgmseq: vmclass.studentclass.pgmseq,
                studentclassstatus: vmclass.studentclass.studentclassstatus
            };
            $log.debug('about addStudentRegistration ', path, thedata);
            return ClassServices.addStudentRegistration( path, thedata ).then(function (data) {
                $log.debug('addStudentRegistration returned data: ');
                $log.debug(data);
                getStudentClazzList();
                
            },function(error) {
                    $log.debug('addStudentRegistration ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function removeStudentRegistration(classid, pgmid) {
            $log.debug('removeStudentRegistration entered');
            var path = "../v1/studentregistration";
            var thedata = {
                studentid: $routeParams.id,
                classseq: classid,
                pgmseq: pgmid
            };
            return ClassServices.removeStudentRegistration(path, thedata)
                .then(function(data){
                    $log.debug('removeStudentRegistration returned data');
                    $log.debug(data);
                    getStudentClazzList();
                    return data;
                }).catch(function(e) {
                    $log.debug('removeStudentRegistration failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
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
