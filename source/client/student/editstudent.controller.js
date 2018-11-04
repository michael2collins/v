import angular from 'angular';

export class FormLayoutsControllerEditStudent {

    constructor(
        StudentServices, $scope, $rootScope, $routeParams,
        $log, $location, Notification, ClassServices, _, $q, PhotoServices, $uibModal,
        portalDataService

    ) {
        'ngInject';

        this.StudentServices = StudentServices;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.$log = $log;
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
        var vmstudent = this;
        vmstudent.isCollapsed = true;

        vmstudent.RankTypeList = [];
        vmstudent.ranklist = [];
        vmstudent.Rankslist = [];
        vmstudent.rankpick;
        vmstudent.ranktypepick;
        vmstudent.disabled;
        vmstudent.studentrank = {};
        vmstudent.students = [];
        vmstudent.genders = [];
        vmstudent.zipList = [];
        vmstudent.concat = '';
        vmstudent.ContactTypeList = [];
        vmstudent.CurrentRankList = [];
        vmstudent.CurrentReikiRankList = [];
        vmstudent.StudentSchoolList = [];
        vmstudent.studentranks = [];
        vmstudent.GuiSizeList = [];
        vmstudent.ShirtSizeList = [];
        vmstudent.BeltSizeList = [];
        vmstudent.instructorTitleList = [];
        vmstudent.studentclass = {};
        vmstudent.students.pictureurldecache = undefined;
 
        vmstudent.active = [];
        vmstudent.path = '../v1/students/' + vmstudent.$routeParams.id;
        vmstudent.zippath = '../v1/zips';

        vmstudent.sListPath = '../v1/studentlists';
        vmstudent.rankListPath = '../v1/ranklist';
        vmstudent.status = {
            opened: false
        };
        vmstudent.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
        vmstudent.bdateformat = vmstudent.formats[4];

        vmstudent.init();
        vmstudent.setLists();
        vmstudent.getAllZips();
        vmstudent.getStudentLists();
        vmstudent.getRankList();
        vmstudent.activate();

    }


    $onDestroy() {
        this.$log.debug("editstudent dismissed");
        this.$log.debugEnabled(false);
    }

    init() {
        var self = this;

        this.menu_h = this.$('#sidebar').height();

        this.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            self.$log.debugEnabled(true);
            self.$log.debug("editstudent started");

        });
        this.$scope.$on('$destroy', function iVeBeenDismissed() {
            self.$log.debug("editstudent dismissed");
            self.$log.debugEnabled(false);
        });


        this.portalDataService.Portlet('form-layouts-editstudent.js');

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
        var self = this;
        self.$log.debug('about activate editstudent ');

        return self.getStudent().then(function() {
            self.$log.debug('activated EditStudent view');
            //    StudentServices.setActiveTab(1,'EditStudent controller');
            var thetab = self.StudentServices.getActiveTab();
            self.$log.debug('activate the active tab', thetab);
            //    vmstudent.active[thetab] = true;
            self.active = thetab;
            if (typeof(self.students.ID) !== 'undefined') {
                self.getStudentRanks(self.students.ID);
                self.getStudentRankTypes(self.students.ID);
            }
        }, function(error) {
            self.$log.debug('activate editstudent', error);
            self.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getRankPartial(theinput) {
        var self = this;
        return self.StudentServices.getRankPartial(theinput, self.ranktypepick).then(function(data) {
            self.$log.debug('controller getRankPartial returned data', theinput, self.ranktypepick);
            self.$log.debug(data);
            self.ranklist = data;
            self.$log.debug('controller getRankPartial service data', self.ranklist);
            return self.ranklist;
        });

    }

    getRank(theinput) {
        var self = this;

        return self.StudentServices.getRank(self.ranktypepick).then(function(data) {
            self.$log.debug('controller getRank returned data', theinput, self.ranktypepick);
            self.$log.debug(data);
            self.ranklist = data;
            self.$log.debug('controller getRank service data', self.ranklist);
            return self.ranklist;
        });

    }

    getBirthday(bday) {
        this.$log.debug('bday');
        this.$log.debug(bday);
        return new Date(bday);
    }

    getStudent() {
        var self = this;
        return self.StudentServices.getStudent(self.path).then(function(data) {
            self.$log.debug('getStudent returned data');
            self.$log.debug(data);

            self.students = data;

            self.$log.debug(self.students.message);
            self.message = self.students.message;
            if ((typeof self.students === 'undefined' || self.students.error === true) &&
                typeof data !== 'undefined') {
                self.Notification.error({ message: self.message, delay: 5000 });
                return (self.$q.reject(data));
            }
            else {
                self.Notification.success({ message: self.message, delay: 5000 });
                self.PhotoServices.setTheStudent(data);
                self.$log.debug('studen pic url', self.students.pictureurl);
                if (self._.isEmpty(self.students.pictureurl)) {
                    self.$log.debug('empty picture');
                    self.students.pictureurldecache = 'missingstudentpicture.png';
                }
                else {
                    self.students.pictureurldecache = self.students.pictureurl + '?decache=' + Math.random();
                }
                self.$log.debug('get Birthday:', self.students.Birthday);
                if (self._.isEmpty(self.students.Birthday)) {
                    self.students.Birthday = self.getBirthday(new Date());
                }
                else {
                    self.students.Birthday = self.getBirthday(self.students.Birthday);
                }

                self.$log.debug('studen pic url decache', self.students.pictureurldecache);
            }

            return self.students;
        }, function(error) {
            self.$log.debug('getStudent', error);
            self.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getStudentRanks(studentid) {
        var self = this;
        if (typeof studentid === 'undefined') {
            return {};
        }
        self.$log.debug('getStudentRanks entered', studentid);
        var thepath = encodeURI("../v1/studentrank?ContactID=" + studentid);

        return self.StudentServices.getStudentRanks(thepath).then(function(data) {
            self.$log.debug('getStudentRanks returned data');
            self.$log.debug(data, data.studentranklist);
            if (typeof(data.studentranklist) !== 'undefined' && data.error === false) {
                self.$log.debug('studentranklist', data.studentranklist);
                self.studentranks = data.studentranklist;
            }
            else {
                self.studentranks = {};
                if (typeof(data.studentranklist) !== 'undefined') {
                    self.Notification.error({ message: typeof(data.message) !== 'undefined' ? data.message : 'error getstudentranks', delay: 5000 });
                } //else ok to have no ranklist
            }
            return self.studentranks;
        }, function(error) {
            self.$log.debug('getStudentRanks', error);
            self.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getStudentRankTypes(studentid) {
        var self = this;
        if (typeof studentid === 'undefined') {
            return {};
        }
        self.$log.debug('getStudentRankTypes entered', studentid);
        var thepath = encodeURI("../v1/ranktypeexcluded?ContactID=" + studentid);

        return self.StudentServices.getStudentRankTypes(thepath).then(function(data) {
            self.$log.debug('getStudentRankTypes returned data');
            self.$log.debug(data, data.ranktypelist);
            if (typeof(data.ranktypelist) !== 'undefined' && data.error === false) {
                self.$log.debug('studentranktypelist', data.ranktypelist);
                self.RankTypeList = data.ranktypelist;
            }
            else {
                self.RankTypeList = {};
                if (typeof(data.ranktypelist) !== 'undefined') {
                    self.Notification.error({ message: typeof(data.message) !== 'undefined' ? data.message : 'error ranktypelist', delay: 5000 });
                } //else ok to have no ranklist
            }
            return self.RankTypeList;
        }, function(error) {
            self.$log.debug('getStudentRankTypes', error);
            self.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    addStudentRank() {
        var self = this;
        self.$log.debug('addStudentRank entered', self.rankpick, self.ranktypepick);
        var thedata = {
            ContactID: self.students.ID,
            currentrank: self.rankpick,
            ranktype: self.ranktypepick
        };
        return self.StudentServices.addStudentRank(thedata)
            .then(function(data) {
                self.$log.debug('addStudentRank returned data');
                self.$log.debug(data);
                self.getStudentRanks(self.students.ID);
                return data;
            }).catch(function(e) {
                self.$log.debug('addStudentRank failure:');
                self.$log.debug("error", e);
                self.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    removeStudentRank(ranktype) {
        var self = this;
        self.$log.debug('removeStudentRank entered', self.students.ID, ranktype);
        var thedata = {
            ContactID: self.students.ID,
            ranktype: ranktype
        };
        return self.StudentServices.removeStudentRank(thedata)
            .then(function(data) {
                    self.$log.debug('removeStudentRank returned data');
                    self.$log.debug(data);
                    self.getStudentRanks(self.students.ID);
                    self.getStudentRankTypes(self.students.ID);
                return data;
            }).catch(function(e) {
        self.$log.debug('removeStudentRank failure:');
        self.$log.debug("error", e);
        self.Notification.error({ message: e, delay: 5000 });
        throw e;
    });

}

updateStudentRank(item) {
    var self = this;
    self.$log.debug('about updateStudentRank ', item);

    var thepath = "../v1/studentrank";
    var thedata = {
        ContactID: item.ContactID,
        ranktype: item.ranktype,
        currentrank: item.currentrank
    };

    return self.StudentServices.updateStudentRank(thepath, thedata).then(function(data) {
        self.$log.debug('updateStudentRank returned data:');
        self.$log.debug(data);
        self.getStudentRanks(item.ContactID);
    }, function(error) {
        self.$log.debug('updateStudent', error);
        self.Notification.error({ message: error, delay: 5000 });
        return (error);
    });
}

updateStudent() {
    var self = this;
    self.$log.debug('about updateStudent ', self.students);
    self.$log.debug('with Birthday', self.students.Birthday);

    return self.StudentServices.updateStudent(self.path, self.students).then(function(data) {
        self.$log.debug('updateStudent returned data: goto', self.path);
        self.$log.debug(data);
        self.students = data;
        self.getStudent();
    }, function(error) {
        self.$log.debug('updateStudent', error);
        self.Notification.error({ message: error, delay: 5000 });
        return (error);
    });
}

getAllZips() {
    var self = this;

    return self.StudentServices.getAllZips(self.zippath).then(function(data) {
        self.$log.debug('getAllZips returned data');
        self.$log.debug(data);
        self.zipList = data;

        return self.zipList;
    }, function(error) {
        self.$log.debug('getAllZips', error);
        self.Notification.error({ message: error, delay: 5000 });
        return (error);
    });

}

getStudentLists() {
    var self = this;

    return self.StudentServices.getStudentLists(self.sListPath).then(function(data) {
        self.$log.debug('controller getStudentLists returned data');
        self.$log.debug(data);
        self.StudentList = data;

        return self.StudentList;
    }, function(error) {
        self.$log.debug('getStudentLists ', error);
        self.Notification.error({ message: error, delay: 5000 });
        return (error);
    });
}

getRankList() {
    var self = this;

    return self.StudentServices.getRankList(self.rankListPath).then(function(data) {
        self.$log.debug('getRankList returned data');
        self.$log.debug(data);
        self.RanksList = data;

        return self.RanksList;
    }, function(error) {
        self.$log.debug('getRankList ', error);
        self.Notification.error({ message: error, delay: 5000 });
        return (error);
    });
}

setHeight() {
    var self = this;

    self.$('#form-layouts-editstudent ul.nav-pills li a').live('click', function() {
        self.$log.debug('set height');
        var tab_id = self.$(this).attr('href');
        var tab_h = self.$(tab_id).height();
        if (tab_h < self.menu_h) {
            self.$(tab_id).css('height', '960px');
        }
    });
}

setLists() {
    this.genders = ['Female', 'Male', 'Unknown'];
}

setActiveTab(activeTab, thecaller) {
    var self=this;
    self.$log.debug('set activetab as:', activeTab, thecaller);
    self.StudentServices.setActiveTab(activeTab, thecaller);

}

getActiveTab() {
    var atab = self.StudentServices.getActiveTab();
    self.$log.debug('get activetab is:', atab);
    return atab;
}


}
