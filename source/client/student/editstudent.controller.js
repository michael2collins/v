import angular from 'angular';

export class FormLayoutsControllerEditStudent {

    constructor(
        StudentServices, $scope, $rootScope, $routeParams,
        $log, $location, Notification, ClassServices, _, $q, PhotoServices, $uibModal,
        portalDataService, $window

    ) {
        'ngInject';

        this.StudentServices = StudentServices;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.$log = $log;
        this.$window = $window;
        this.$location = $location;
        this.Notification = Notification;
        this.ClassServices = ClassServices;
        this._ = _;
        this.$q = $q;
        this.PhotoServices = PhotoServices;
        this.$uibModal = $uibModal;
        this.portalDataService = portalDataService;
    }

    $onInit() {
        console.log('entering FormLayoutsControllerEditStudent oninit');
        this.$ = angular.element;
        var vm = this;
        vm.isCollapsed = true;

        vm.RankTypeList = [];
        vm.ranklist = [];
        vm.Rankslist = [];
        vm.rankpick;
        vm.ranktypepick;
        vm.disabled;
        vm.studentrank = {};
        vm.students = [];
        vm.genders = [];
        vm.zipList = [];
        vm.concat = '';
        vm.ContactTypeList = [];
        vm.CurrentRankList = [];
        vm.CurrentReikiRankList = [];
        vm.StudentSchoolList = [];
        vm.studentranks = [];
        vm.GuiSizeList = [];
        vm.ShirtSizeList = [];
        vm.BeltSizeList = [];
        vm.instructorTitleList = [];
        vm.studentclass = {};
        vm.students.pictureurldecache = undefined;

        vm.active = [];
        vm.path = '../v1/students/' + vm.$routeParams.id;
        vm.zippath = '../v1/zips';

        vm.sListPath = '../v1/studentlists';
        vm.status = {
            opened: false
        };
        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
        vm.bdateformat = vm.formats[4];

        vm.rankpickselected = '';
        vm.rankpickparent = {};

        vm.init();
        vm.setLists();
        vm.getAllZips();
        vm.getStudentLists();
        //        vm.getRankList();
        vm.activate();

    }

    $onDestroy() {
        this.$log.debug("editstudent dismissed");
        this.$log.debugEnabled(false);
    }

    init() {
        var vm = this;

        vm.menu_h = vm.$('#sidebar').height();

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("editstudent started");

        });
        vm.$scope.$on('$destroy', function iVeBeenDismissed() {
            vm.$log.debug("editstudent dismissed");
            vm.$log.debugEnabled(false);
        });


        vm.portalDataService.Portlet('form-layouts-editstudent.js');

    }
    openPhoto() {
        this.openPhotoModal(this, this.students);


    }

    openPhotoModal(vm, dataToPass) {
        var photoModal = vm;
        photoModal.dataToPass = dataToPass;
        photoModal.animationsEnabled = true;

        photoModal.modalInstance = undefined;
        photoModal.retvlu = '';

        photoModal.modalInstance = this.$uibModal.open({
            animation: photoModal.animationsEnabled,
            //    templateUrl: 'templates/photos/photo.html',
            //    controller: 'ModalCameraController',
            component: 'photoComponent',
            //todo create photocomponent
            //controllerAs: 'vmpicmodal',
            size: 'md',
            windowClass: 'my-modal-popup',
            resolve: {
                dataToPass: function() {
                    photoModal.$log.debug('resolve datatopass', photoModal.dataToPass);
                    return photoModal.dataToPass;
                }

            }
        });

        photoModal.modalInstance.opened.then(
            function(success) {
                photoModal.$log.debug('photoModal ui opened:', success);

            },
            function(error) {
                photoModal.$log.debug('photoModal ui failed to open, reason : ', error);
            }
        );
        photoModal.modalInstance.rendered.then(
            function(success) {
                photoModal.$log.debug('photomodal ui rendered:', success);
            },
            function(error) {
                photoModal.$log.debug('photoModal ui failed to render, reason : ', error);
            }
        );

        photoModal.modalInstance.result.then(
            function(retvlu) {
                photoModal.$log.debug('search modalInstance result :', retvlu);
                photoModal.activate();

            },
            function(error) {
                photoModal.$log.debug('photomodal ui failed to result, reason : ', error);
                photoModal.$log.info('Modal dismissed at: ' + new Date());
                photoModal.activate();
            });

    }

    dateopen($event) {
        this.status.opened = true;
    }

    rankremove(ranktype) {
        this.$log.debug('rankremove entered', ranktype);
        this.removeStudentRank(ranktype);
    }

    activate() {
        var vm = this;
        vm.$log.debug('about activate editstudent ');

        return vm.getStudent().then(function() {
            vm.$log.debug('activated EditStudent view');
            //    StudentServices.setActiveTab(1,'EditStudent controller');
            var thetab = vm.StudentServices.getActiveTab();
            vm.$log.debug('activate the active tab', thetab);
            //    vm.active[thetab] = true;
            vm.active = thetab;
            if (typeof(vm.students.ID) !== 'undefined') {
                vm.getStudentRanks(vm.students.ID);
                vm.getStudentRankTypes(vm.students.ID);
            }
        }, function(error) {
            vm.$log.debug('activate editstudent', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }
    /*
        getRankPartial(theinput) {
            var vm = this;
            return vm.StudentServices.getRankPartial(theinput, vm.ranktypepick).then(function(data) {
                vm.$log.debug('controller getRankPartial returned data', theinput, vm.ranktypepick);
                vm.$log.debug(data);
                vm.ranklist = data;
                vm.$log.debug('controller getRankPartial service data', vm.ranklist);
                return vm.ranklist;
            });

        }
    */
    isOkRT() {
        var vm = this;
        return (Object.keys(vm.rankpickparent).length === 0 && vm.rankpickparent.constructor === Object) ? false : true;
    }

    updateRankPick(rankpickparent, prop, value) {
        var vm = this;
        //rankpickparent isn't working as expected.  Use value for whole parent
        //vm.rankpickparent[prop] = value;
        vm.rankpickparent = value;
        vm.ranktypepick = vm.rankpickparent.ranktype;
        vm.rankpick = vm.rankpickparent.rankpick;
        vm.$log.debug('updateRankPick', rankpickparent, prop, value, vm.rankpick, vm.ranktypepick);
        //        vm.getRankList();
        //        vm.setRank('All');
        //        vm.$log.debug('setRank', vm.Rank);

    }

    /*
        getRank(theinput) {
            var vm = this;

            return vm.StudentServices.getRank(vm.ranktypepick).then(function(data) {
                vm.$log.debug('controller getRank returned data', theinput, vm.ranktypepick);
                vm.$log.debug(data);
                vm.ranklist = data;
                vm.$log.debug('controller getRank service data', vm.ranklist);
                return vm.ranklist;
            });

        }
    */
    getBirthday(bday) {
        var vm = this;
        vm.$log.debug('bday');
        vm.$log.debug(bday);
        return new Date(bday);
    }

    getStudent() {
        var vm = this;
        return vm.StudentServices.getStudent(vm.path).then(function(data) {
            vm.$log.debug('getStudent returned data');
            vm.$log.debug(data);

            vm.students = data;

            vm.$log.debug(vm.students.message);
            vm.message = vm.students.message;
            if ((typeof vm.students === 'undefined' || vm.students.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                vm.Notification.success({ message: vm.message, delay: 5000 });
                vm.PhotoServices.setTheStudent(data);
                vm.$log.debug('studen pic url', vm.students.pictureurl);
                if (vm._.isEmpty(vm.students.pictureurl)) {
                    vm.$log.debug('empty picture');
                    vm.students.pictureurldecache = 'missingstudentpicture.png';
                }
                else {
                    vm.students.pictureurldecache = vm.students.pictureurl + '?decache=' + Math.random();
                }
                vm.$log.debug('get Birthday:', vm.students.Birthday);
                if (vm._.isEmpty(vm.students.Birthday)) {
                    vm.students.Birthday = vm.getBirthday(new Date());
                }
                else {
                    vm.students.Birthday = vm.getBirthday(vm.students.Birthday);
                }

                vm.$log.debug('studen pic url decache', vm.students.pictureurldecache);
            }

            return vm.students;
        }, function(error) {
            vm.$log.debug('getStudent', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getStudentRanks(studentid) {
        var vm = this;
        if (typeof studentid === 'undefined') {
            return {};
        }
        vm.$log.debug('getStudentRanks entered', studentid);
        var thepath = encodeURI("../v1/studentrank?ContactID=" + studentid);

        return vm.StudentServices.getStudentRanks(thepath).then(function(data) {
            vm.$log.debug('getStudentRanks returned data');
            vm.$log.debug(data, data.studentranklist);
            if (typeof(data.studentranklist) !== 'undefined' && data.error === false) {
                vm.$log.debug('studentranklist', data.studentranklist);
                vm.studentranks = data.studentranklist;
            }
            else {
                vm.studentranks = {};
                if (typeof(data.studentranklist) !== 'undefined') {
                    vm.Notification.error({ message: typeof(data.message) !== 'undefined' ? data.message : 'error getstudentranks', delay: 5000 });
                } //else ok to have no ranklist
            }
            return vm.studentranks;
        }, function(error) {
            vm.$log.debug('getStudentRanks', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getStudentRankTypes(studentid) {
        var vm = this;
        if (typeof studentid === 'undefined') {
            return {};
        }
        vm.$log.debug('getStudentRankTypes entered', studentid);
        var thepath = encodeURI("../v1/ranktypeexcluded?ContactID=" + studentid);

        return vm.StudentServices.getStudentRankTypes(thepath).then(function(data) {
            vm.$log.debug('getStudentRankTypes returned data');
            vm.$log.debug(data, data.ranktypelist);
            if (typeof(data.ranktypelist) !== 'undefined' && data.error === false) {
                vm.$log.debug('studentranktypelist', data.ranktypelist);
                vm.RankTypeList = data.ranktypelist;
            }
            else {
                vm.RankTypeList = {};
                if (typeof(data.ranktypelist) !== 'undefined') {
                    vm.Notification.error({ message: typeof(data.message) !== 'undefined' ? data.message : 'error ranktypelist', delay: 5000 });
                } //else ok to have no ranklist
            }
            return vm.RankTypeList;
        }, function(error) {
            vm.$log.debug('getStudentRankTypes', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    addStudentRank() {
        var vm = this;
        vm.$log.debug('addStudentRank entered', vm.rankpick, vm.ranktypepick);
        var thedata = {
            ContactID: vm.students.ID,
            currentrank: vm.rankpick,
            ranktype: vm.ranktypepick
        };
        return vm.StudentServices.addStudentRank(thedata)
            .then(function(data) {
                vm.$log.debug('addStudentRank returned data');
                vm.$log.debug(data);
                vm.getStudentRanks(vm.students.ID);
                return data;
            }).catch(function(e) {
                vm.$log.debug('addStudentRank failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    removeStudentRank(ranktype) {
        var vm = this;
        vm.$log.debug('removeStudentRank entered', vm.students.ID, ranktype);
        var thedata = {
            ContactID: vm.students.ID,
            ranktype: ranktype
        };
        return vm.StudentServices.removeStudentRank(thedata)
            .then(function(data) {
                vm.$log.debug('removeStudentRank returned data');
                vm.$log.debug(data);
                vm.getStudentRanks(vm.students.ID);
                vm.getStudentRankTypes(vm.students.ID);
                return data;
            }).catch(function(e) {
                vm.$log.debug('removeStudentRank failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    updateStudentRank(item) {
        var vm = this;
        vm.$log.debug('about updateStudentRank ', item);

        var thepath = "../v1/studentrank";
        var thedata = {
            ContactID: item.ContactID,
            ranktype: item.ranktype,
            currentrank: item.currentrank
        };

        return vm.StudentServices.updateStudentRank(thepath, thedata).then(function(data) {
            vm.$log.debug('updateStudentRank returned data:');
            vm.$log.debug(data);
            vm.getStudentRanks(item.ContactID);
        }, function(error) {
            vm.$log.debug('updateStudent', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    updateStudent() {
        var vm = this;
        vm.$log.debug('about updateStudent ', vm.students);
        vm.$log.debug('with Birthday', vm.students.Birthday);

        return vm.StudentServices.updateStudent(vm.path, vm.students).then(function(data) {
            vm.$log.debug('updateStudent returned data: goto', vm.path);
            vm.$log.debug(data);
            vm.students = data;
            vm.getStudent();
        }, function(error) {
            vm.$log.debug('updateStudent', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    removeStudent() {
        var vm = this;
        vm.$log.debug('removeStudent entered', vm.students.ID);
        var path = '../v1/student';
        var thedata = {
            id: vm.students.ID
        };
        var data = {};
        data.StudentExistsList = {};

        return vm.StudentServices.removeStudent(thedata, path)
            .then(function(data) {
                vm.$log.debug('removeStudent returned data');
                vm.$log.debug(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    vm.StudentFKExists = data.StudentExistsList;
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                    var url = '/#/table-basic-students';
                    vm.$log.debug(url);
                    vm.$window.location.href = url;

                }

                return data;
            }).catch(function(e) {
                vm.$log.debug('removeStudent failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    getAllZips() {
        var vm = this;

        return vm.StudentServices.getAllZips(vm.zippath).then(function(data) {
            vm.$log.debug('getAllZips returned data');
            vm.$log.debug(data);
            vm.zipList = data;

            return vm.zipList;
        }, function(error) {
            vm.$log.debug('getAllZips', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });

    }

    getStudentLists() {
        var vm = this;

        return vm.StudentServices.getStudentLists(vm.sListPath).then(function(data) {
            vm.$log.debug('controller getStudentLists returned data');
            vm.$log.debug(data);
            vm.StudentList = data;

            return vm.StudentList;
        }, function(error) {
            vm.$log.debug('getStudentLists ', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }
    /*
        getRankList() {
            var vm = this;
            var path = '../v1/ranklist';
            var data = {
                ranktype: vm.ranktypepick
            };

            return vm.StudentServices.getRankList(data, path).then(function(data) {

                vm.$log.debug('getRankList returned data');
                vm.$log.debug(data);
                vm.RanksList = data;

                return vm.RanksList;
            }, function(error) {
                vm.$log.debug('getRankList ', error);
                vm.Notification.error({ message: error, delay: 5000 });
                return (error);
            });
        }
    */
    setHeight() {
        var vm = this;

        vm.$('#form-layouts-editstudent ul.nav-pills li a').live('click', function() {
            vm.$log.debug('set height');
            var tab_id = vm.$(this).attr('href');
            var tab_h = vm.$(tab_id).height();
            if (tab_h < vm.menu_h) {
                vm.$(tab_id).css('height', '960px');
            }
        });
    }

    setLists() {
        this.genders = ['Female', 'Male', 'Unknown'];
    }

    setActiveTab(activeTab, thecaller) {
        var vm = this;
        vm.$log.debug('set activetab as:', activeTab, thecaller);
        vm.StudentServices.setActiveTab(activeTab, thecaller);

    }

    getActiveTab() {
        var atab = vm.StudentServices.getActiveTab();
        vm.$log.debug('get activetab is:', atab);
        return atab;
    }


}
