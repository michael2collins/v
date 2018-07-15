(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin.all')

    .controller('FormLayoutsControllerEditStudent', FormLayoutsControllerEditStudent);
    FormLayoutsControllerEditStudent.$inject = ['StudentServices',
    '$scope',
    '$rootScope',
    '$routeParams',
    '$log',
    '$location',
    'Notification',
    'ClassServices',
    '_',
    '$q',
    'PhotoServices',
    '$uibModal'
    ];

    function FormLayoutsControllerEditStudent(StudentServices, $scope, $rootScope, $routeParams, 
        $log, $location,Notification,ClassServices,_,$q,PhotoServices,$uibModal) {
        /* jshint validthis: true */
        var vmstudent = this;
        var $ = angular.element;
        vmstudent.isCollapsed = true;

        vmstudent.getStudent = getStudent;
        vmstudent.getAllZips = getAllZips;
        vmstudent.getStudentLists = getStudentLists;
        vmstudent.getRankList = getRankList;
        vmstudent.updateStudent = updateStudent;
        vmstudent.updateStudentRank = updateStudentRank;
        vmstudent.addStudentRank = addStudentRank;
        vmstudent.removeStudentRank = removeStudentRank;
//        vmstudent.setStudentPIC = setStudentPIC;
        vmstudent.rankremove = rankremove;
        vmstudent.getRankPartial = getRankPartial;
        vmstudent.getStudentRankTypes = getStudentRankTypes;
        vmstudent.RankTypeList =[];
        vmstudent.getRank = getRank;
        vmstudent.ranklist=[];
        vmstudent.Rankslist=[];
        vmstudent.rankpick;
        vmstudent.ranktypepick;
        vmstudent.disabled;
        vmstudent.studentrank ={};
        vmstudent.students = [];
        vmstudent.genders = [];
        vmstudent.zipList = [];
        vmstudent.concat = '';
        vmstudent.ContactTypeList = [];
        vmstudent.CurrentRankList = [];
        vmstudent.CurrentReikiRankList = [];
        vmstudent.StudentSchoolList = [];
        vmstudent.studentranks =[];
        vmstudent.GuiSizeList = [];
        vmstudent.ShirtSizeList = [];
        vmstudent.BeltSizeList = [];
        vmstudent.instructorTitleList = [];
        vmstudent.studentclass = {};
        vmstudent.getBirthday = getBirthday;
        vmstudent.dateopen = dateopen;
        vmstudent.students.pictureurldecache = undefined;
        vmstudent.setActiveTab = setActiveTab;
        vmstudent.getActiveTab = getActiveTab;
        vmstudent.openPhoto = openPhoto;
        
        vmstudent.active = [];
  //      vmstudent.media;
    //    vmstudent.callback = callback;
        vmstudent.menu_h = $('#sidebar').height();
        vmstudent.setHeight = setHeight;
        vmstudent.path = '../v1/students/' + $routeParams.id;
        //      vmstudent.path = '../v1/students/5340';
        vmstudent.zippath = '../v1/zips';

        vmstudent.sListPath = '../v1/studentlists';
        vmstudent.rankListPath = '../v1/ranklist';

  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("editstudent started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("editstudent dismissed");
		$log.debugEnabled(false);
    });


        $log.debug('Routeparam is:');
        $log.debug($routeParams.id);

        vmstudent.status = {
            opened: false
        };

        setLists();
        getAllZips();
        getStudentLists();
        getRankList();
        activate();

       $.fn.Data.Portlet('form-layouts-editstudent.js');
    
        function openPhoto() {
            openPhotoModal(vmstudent,vmstudent.students);


        }
        function openPhotoModal(vm, dataToPass) {
            var photoModal = vm;
            photoModal.dataToPass = dataToPass;
            photoModal.animationsEnabled = true;

            photoModal.modalInstance = undefined;
            photoModal.retvlu = '';

            photoModal.modalInstance = $uibModal.open({
                animation: photoModal.animationsEnabled,
                templateUrl: 'templates/photos/photo.html',
                controller: 'ModalCameraController',
                controllerAs: 'vmpicmodal',
                size: 'md',
                windowClass: 'my-modal-popup',
                resolve: {
                  dataToPass: function() { 
                      $log.debug('resolve datatopass',photoModal.dataToPass);
                      return photoModal.dataToPass; 
                  }

                }
            });
            
            photoModal.modalInstance.opened.then(
                function(success) {
                    $log.debug('photoModal ui opened:', success);

                },
                function(error) {
                    $log.debug('photoModal ui failed to open, reason : ', error);
                }
            );
            photoModal.modalInstance.rendered.then(
                function(success) {
                    $log.debug('photomodal ui rendered:', success);
                },
                function(error) {
                    $log.debug('photoModal ui failed to render, reason : ', error);
                }
            );

            photoModal.modalInstance.result.then(
                function(retvlu) {
                    $log.debug('search modalInstance result :', retvlu);
                    activate();
    
            }, function(error) {
                $log.debug('photomodal ui failed to result, reason : ', error);
                $log.info('Modal dismissed at: ' + new Date());
                    activate();
            });

        }
        

        function dateopen($event) {
            vmstudent.status.opened = true;
        }
        
          vmstudent.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
          vmstudent.bdateformat = vmstudent.formats[4];
         
        function rankremove(ranktype) {
            $log.debug('rankremove entered', ranktype);
            removeStudentRank(ranktype);
        }

        function activate() {
            $log.debug('about activate editstudent ');
            
            return getStudent().then(function () {
                $log.debug('activated EditStudent view');
            //    StudentServices.setActiveTab(1,'EditStudent controller');
                var thetab = StudentServices.getActiveTab();
                $log.debug('activate the active tab', thetab);
            //    vmstudent.active[thetab] = true;
                vmstudent.active = thetab;
                if (typeof(vmstudent.students.ID) !== 'undefined') {
                    getStudentRanks(vmstudent.students.ID);
                    getStudentRankTypes(vmstudent.students.ID);
                }
            },function(error) {
                    $log.debug('activate editstudent',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function getRankPartial(theinput) {
            
            return StudentServices.getRankPartial(theinput,vmstudent.ranktypepick).then(function(data){
                    $log.debug('controller getRankPartial returned data',theinput,vmstudent.ranktypepick);
                    $log.debug(data);
                    vmstudent.ranklist = data;
                    $log.debug('controller getRankPartial service data',vmstudent.ranklist);
                    return vmstudent.ranklist;
                });
            
        }

        function getRank(theinput) {
            
            return StudentServices.getRank(vmstudent.ranktypepick).then(function(data){
                    $log.debug('controller getRank returned data',theinput,vmstudent.ranktypepick);
                    $log.debug(data);
                    vmstudent.ranklist = data;
                    $log.debug('controller getRank service data',vmstudent.ranklist);
                    return vmstudent.ranklist;
                });
            
        }

        function getBirthday(bday) {
            $log.debug('bday');
            $log.debug(bday);
            return new Date(bday);
        }

//        function callback(media) {
//            $log.debug('callback entered');
//            //$log.debug(media);
//        }
        function getStudent() {
            return StudentServices.getStudent(vmstudent.path).then(function (data) {
                $log.debug('getStudent returned data');
                $log.debug(data);

                vmstudent.students = data;

                $log.debug(vmstudent.students.message);
                vmstudent.message = vmstudent.students.message;
                if ((typeof vmstudent.students === 'undefined' || vmstudent.students.error === true)  
                        && typeof data !== 'undefined') {  
                    Notification.error({message: vmstudent.message, delay: 5000});
                    return($q.reject(data));
                } else {
                    Notification.success({message: vmstudent.message, delay: 5000});
                    PhotoServices.setTheStudent(data);
                    $log.debug('studen pic url', vmstudent.students.pictureurl);
                    if (_.isEmpty(vmstudent.students.pictureurl)) {
                        $log.debug('empty picture');
                        vmstudent.students.pictureurldecache = 'missingstudentpicture.png';
                    } else {
                        vmstudent.students.pictureurldecache = vmstudent.students.pictureurl +  '?decache=' + Math.random();
                    }
                    $log.debug('get Birthday:', vmstudent.students.Birthday);
                    if (_.isEmpty(vmstudent.students.Birthday)) {
                        vmstudent.students.Birthday = getBirthday(new Date());
                    } else {
                        vmstudent.students.Birthday = getBirthday(vmstudent.students.Birthday);
                    }
    
                    $log.debug('studen pic url decache', vmstudent.students.pictureurldecache);
                }
                
                return vmstudent.students;
            },function(error) {
                    $log.debug('getStudent',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function getStudentRanks(studentid) {
            if (typeof studentid === 'undefined') {
                return {};
            }
            $log.debug('getStudentRanks entered', studentid);
            var thepath = encodeURI("../v1/studentrank?ContactID=" + studentid);

            return StudentServices.getStudentRanks(thepath).then(function (data) {
                $log.debug('getStudentRanks returned data');
                $log.debug(data, data.studentranklist);
                if (typeof(data.studentranklist) !== 'undefined' && data.error === false) {
                    $log.debug('studentranklist', data.studentranklist);
                    vmstudent.studentranks = data.studentranklist;
                } else {
                    vmstudent.studentranks={};
                    if (typeof(data.studentranklist) !== 'undefined') {
                        Notification.error({message: typeof(data.message) !== 'undefined' ? data.message : 'error getstudentranks', delay: 5000});
                    } //else ok to have no ranklist
                }
                return vmstudent.studentranks;
            },function(error) {
                    $log.debug('getStudentRanks',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }
        function getStudentRankTypes(studentid) {
            if (typeof studentid === 'undefined') {
                return {};
            }
            $log.debug('getStudentRankTypes entered', studentid);
            var thepath = encodeURI("../v1/ranktypeexcluded?ContactID=" + studentid);

            return StudentServices.getStudentRankTypes(thepath).then(function (data) {
                $log.debug('getStudentRankTypes returned data');
                $log.debug(data, data.ranktypelist);
                if (typeof(data.ranktypelist) !== 'undefined' && data.error === false) {
                    $log.debug('studentranktypelist', data.ranktypelist);
                    vmstudent.RankTypeList = data.ranktypelist;
                } else {
                    vmstudent.RankTypeList={};
                    if (typeof(data.ranktypelist) !== 'undefined') {
                        Notification.error({message: typeof(data.message) !== 'undefined' ? data.message : 'error ranktypelist', delay: 5000});
                    } //else ok to have no ranklist
                }
                return vmstudent.RankTypeList;
            },function(error) {
                    $log.debug('getStudentRankTypes',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function addStudentRank() {
            $log.debug('addStudentRank entered',vmstudent.rankpick,vmstudent.ranktypepick);
            var thedata = {
                ContactID: vmstudent.students.ID,
                currentrank: vmstudent.rankpick,
                ranktype: vmstudent.ranktypepick
            };
            return StudentServices.addStudentRank( thedata)
                .then(function(data){
                    $log.debug('addStudentRank returned data');
                    $log.debug(data);
                    getStudentRanks(vmstudent.students.ID);
                    return data;
                }).catch(function(e) {
                    $log.debug('addStudentRank failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function removeStudentRank(ranktype) {
            $log.debug('removeStudentRank entered',vmstudent.students.ID,ranktype);
            var thedata = {
                ContactID: vmstudent.students.ID,
                ranktype: ranktype
            };
            return StudentServices.removeStudentRank( thedata)
                .then(function(data){
                    $log.debug('removeStudentRank returned data');
                    $log.debug(data);
                    getStudentRanks(vmstudent.students.ID);
                    getStudentRankTypes(vmstudent.students.ID);
                    return data;
                }).catch(function(e) {
                    $log.debug('removeStudentRank failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }
        
        function updateStudentRank(item) {
            $log.debug('about updateStudentRank ', item);
            
            var thepath = "../v1/studentrank";
            var thedata = {
                ContactID: item.ContactID,
                ranktype: item.ranktype,
                currentrank: item.currentrank
            };

            return StudentServices.updateStudentRank(thepath, thedata).then(function (data) {
                $log.debug('updateStudentRank returned data:');
                $log.debug(data);
                getStudentRanks(item.ContactID);
            },function(error) {
                    $log.debug('updateStudent',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function updateStudent() {
            $log.debug('about updateStudent ', vmstudent.students);
            $log.debug('with Birthday', vmstudent.students.Birthday);
            
            return StudentServices.updateStudent(vmstudent.path, vmstudent.students).then(function (data) {
                $log.debug('updateStudent returned data: goto', vmstudent.path);
                $log.debug(data);
                vmstudent.students = data;
                //          $log.debug('set route', $routeParams);
                //            $location.url('#/form-layouts-editstudent?id=' + $routeParams.id );
                //          return vmstudent.students;
                getStudent();
            },function(error) {
                    $log.debug('updateStudent',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

/*
        function setStudentPIC(pic) {
            $log.debug('about setStudentPIC ', encodeURI(pic));
            vmstudent.students.pictureurl = encodeURI(pic);
            $log.debug('about setStudentPIC ', vmstudent.students);
//            return StudentServices.updateStudent(vmstudent.path, vmstudent.students).then(function (data) {
 //               $log.debug('setStudentPIC returned data: goto', vmstudent.path);
  //              $log.debug(data);
//                vmstudent.students = data;
//                //          $log.debug('set route', $routeParams);
//                //            $location.url('#/form-layouts-editstudent?id=' + $routeParams.id );
//                //          return vmstudent.students;
//                //getStudent();
//            });
              updateStudent();
        }
*/
        function getAllZips() {
            return StudentServices.getAllZips(vmstudent.zippath).then(function (data) {
                $log.debug('getAllZips returned data');
                $log.debug(data);
                vmstudent.zipList = data;

                return vmstudent.zipList;
            },function(error) {
                    $log.debug('getAllZips',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });        
            
        }

        function getStudentLists() {
            return StudentServices.getStudentLists(vmstudent.sListPath).then(function (data) {
                $log.debug('controller getStudentLists returned data');
                $log.debug(data);
                vmstudent.StudentList = data;

                return vmstudent.StudentList;
            },function(error) {
                    $log.debug('getStudentLists ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function getRankList() {
            return StudentServices.getRankList(vmstudent.rankListPath).then(function (data) {
                $log.debug('getRankList returned data');
                $log.debug(data);
                vmstudent.RanksList = data;

                return vmstudent.RanksList;
            },function(error) {
                    $log.debug('getRankList ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function setHeight() {
            $('#form-layouts-editstudent ul.nav-pills li a').live('click', function () {
                $log.debug('set height');
                var tab_id = $(this).attr('href');
                var tab_h = $(tab_id).height();
                if (tab_h < vmstudent.menu_h) {
                    $(tab_id).css('height', '960px');
                }
            });
        }

        function setLists() {
            vmstudent.genders = ['Female', 'Male', 'Unknown'];
        }

        function setActiveTab( activeTab, thecaller ){
            $log.debug('set activetab as:', activeTab, thecaller);
            StudentServices.setActiveTab(activeTab, thecaller);

        }

        function getActiveTab(){
            var atab =  StudentServices.getActiveTab();
            $log.debug('get activetab is:', atab);
            return atab;
        }


    }

})(window,window.angular);
