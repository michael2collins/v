import angular from 'angular';
//import html2canvas from 'html2canvas';
//import jsPDF from 'jsPDF';

export class FormLayoutsControllerEditStudent {

    constructor(
        StudentServices, $scope, $rootScope, $routeParams,
        $log, $location, Notification, ClassServices, _, $q, PhotoServices, $uibModal,
        portalDataService, $window, UserServices, PhotoUtil

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
        this.UserServices = UserServices;
        this.PhotoUtil = PhotoUtil;
    }

    $onInit() {
        this.$ = angular.element;
        var vm = this;
        vm.isCollapsed = true;

        vm.RankTypeList = [];
        vm.ranklist = [];
        vm.Rankslist = [];
        vm.rankpick;
        vm.ranktypepick;
        vm.lastPromoted;
        //        vm.disabled = false;
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
        vm.thereadonly = true;

        vm.sListPath = '../v1/studentlists';
        vm.status = {
            opened: false
        };
        vm.pstatus = {
            opened: false
        };
        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
        vm.bdateformat = vm.formats[4];

        vm.rankpickselected = '';
        vm.rankpickparent = {};
        vm.readonlySelector = 'select,input,textarea,.disenable';

        vm.init();
        vm.setLists();
        vm.getAllZips();
        vm.getStudentLists();
        //        vm.getRankList();
        vm.activate();
        vm.img1 = {};
        vm.img2 = {};
        vm.part1 = {};
        vm.part2 = {};

        vm.studentloaded = false;
        vm.studentdata = {};
        vm.classloaded = false;
        vm.classdata = {};
        vm.attendanceloaded = false;
        vm.historyloaded = false;
        vm.paymentloaded = false;
        vm.paymentdata = {};
        vm.payersetloaded = false;
        vm.payersetdata = {};
        vm.alldata = {};
    }

    $onDestroy() {
        this.$log.log("editstudent dismissed");
        //this.$log.logEnabled(false);
    }

    init() {
        var vm = this;

        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined) {
            vm.$log = vm.$log.getInstance('FormLayoutsControllerEditStudent', vm.UserServices.isDebugEnabled());
        }

        vm.menu_h = vm.$('#sidebar').height();

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("editstudent started");
            vm.initreadonly();
        });
        vm.$scope.$on('studentloaded', function(event, args) {
            vm.studentloaded = true;
            vm.studentdata = angular.copy(args);
            vm.initreadonly();

        });
        vm.$scope.$on('payersetloaded', function(event, args) {
            vm.payersetloaded = true;
            vm.payersetdata = args;
            vm.initreadonly();
        });
        vm.$scope.$on('paymentloaded', function(event, args) {
            vm.paymentloaded = true;
            vm.paymentdata = args;
            vm.initreadonly();
        });
        vm.$scope.$on('historyloaded', function() {
            vm.historyloaded = true;
            vm.initreadonly();
        });
        vm.$scope.$on('attendanceloaded', function() {
            vm.attendanceloaded = true;
            vm.initreadonly();
        });
        vm.$scope.$on('classloaded', function(event, args) {
            vm.classloaded = true;
            vm.classdata = args;
            vm.initreadonly();
        });


        vm.$scope.$on('$destroy', function iVeBeenDismissed() {
            vm.$log.log("editstudent dismissed");
            //   vm.$log.logEnabled(false);
        });


        //        vm.portalDataService.Portlet('form-layouts-editstudent.js');

    }
    initreadonly() {
        var vm = this;
        if (vm.historyloaded && vm.studentloaded && vm.paymentloaded && vm.attendanceloaded && vm.classloaded && vm.payersetloaded) {
            vm.setDisplay();

            vm.alldata = {};
            vm.alldata.studentdata = vm.studentdata.studentdata;
            vm.alldata.classdata = vm.classdata;
            vm.alldata.paymentdata = vm.paymentdata;
            vm.alldata.payersetdata = vm.payersetdata;
            vm.alldata.studentranks = vm.studentranks;
            vm.alldata.StudentList = vm.StudentList;
        }
    }

    setreadonly() {
        var vm = this;
        vm.thereadonly = !vm.thereadonly;
        vm.setDisplay();
        vm.$rootScope.$emit('disenableChange', { disenable: vm.thereadonly });
    }
    print() {
        var vm = this;
        vm.openmodal();
    }
    setDisplay() {
        var vm = this;
        vm.$(vm.readonlySelector).prop('disabled', vm.thereadonly);
        if (vm.thereadonly == true) {
            vm.$("#form-layouts-editstudent").find(".disenable").addClass("ignore");
        }
        else {
            vm.$("#form-layouts-editstudent").find(".ignore").removeClass("ignore");
        }

    }
    openmodal() {
        var vmprintstudentmodal = this;

        vmprintstudentmodal.modalInstance = vmprintstudentmodal.$uibModal.open({
            animation: vmprintstudentmodal.animationsEnabled,
            component: 'printstudentComponent',
            size: 'mySize',
            resolve: {
                alldata: vmprintstudentmodal.alldata,
                disenable: vmprintstudentmodal.thereadonly
            }
        });

        vmprintstudentmodal.modalInstance.opened.then(
            function(success) {
                vmprintstudentmodal.$log.log('modalInstance ui opened:', success);
            },
            function(error) {
                vmprintstudentmodal.$log.log('modalInstance ui failed to open, reason : ', error);
            }
        );
        vmprintstudentmodal.modalInstance.rendered.then(
            function(success) {
                vmprintstudentmodal.$log.log('vmprintstudentmodal ui rendered:', success);
                vmprintstudentmodal.$(vmprintstudentmodal.readonlySelector).prop('disabled', vmprintstudentmodal.thereadonly);
                vmprintstudentmodal.$("#print-layouts-editstudent").find(".disenable").addClass("ignore");
            },
            function(error) {
                vmprintstudentmodal.$log.log('vmprintstudentmodal ui failed to render, reason : ', error);
            }
        );

        vmprintstudentmodal.modalInstance.result.then(function(thisstudent) {
            //    vmprintstudentmodal.$log.log('search modalInstance result thisstudent:', thisstudent);
            //    vmprintstudentmodal.thisstudent = thisstudent;
        }, function() {
            //todo: shoudl we get the student
            vmprintstudentmodal.$log.info('Modal dismissed at: ' + new Date());
        });

    }
    printcancel() {
        this.$scope.$parent.$uibModalInstance.dismiss('cancel');
    }

    printold() {
        var vm = this;
        /*        vm.part1 = document.querySelector("#form-layouts-editstudent > div > div > div > div.tab-pane.ng-scope > div > div > div");
                vm.part2 = document.querySelector("#form-layouts-editstudent > div > div > div > div.tab-pane.ng-scope > studentclass-component > div > div > div")
                html2canvas(vm.part1, {
                    //                windowWidth: part1.scrollWidth,
                    //               windowHeight: part1.scrollHeight,
                    onrendered: function(canvas) {
                        vm.img1 = canvas.toDataURL("image/png");

                    }
                });
                html2canvas(vm.part2, {
                    onrendered: function(canvas2) {
                        vm.img2 = canvas2.toDataURL("image/png");
                        var doc = new jsPDF({
                            orientation: 'landscape',
                            //   unit: 'in',
                            //  format: [11, 8.5]
                        });
                        doc.addImage(vm.img1, 'JPEG', 20, 20);
                        doc.addPage();
                        doc.addImage(vm.img2, 'JPEG', 20, 20);
                        doc.save('student.pdf');

                    }
                });
        */
        var approot = window.location;
        //toggle readonly
        var printContents = new vm.$("#form-layouts-editstudent").clone();
        var headContents = new vm.$("head").clone();
        var myWindow = window.open("", "popup", "width=800,height=600,scrollbars=yes,resizable=yes," +
            "toolbar=no,directories=no,location=no,menubar=no,status=no,left=250px,top=80px");

        //         $(printContents).find("#PrintNews").remove();
        //        $(printContents).find("#bottom").remove();
        myWindow.document.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
        myWindow.document.write("<html>");
        myWindow.document.write("<head>");
        myWindow.document.write(vm.$(headContents).html());

        //         myWindow.document.write("<link href='" + approot + "/Themes/print.css' rel='stylesheet' type='text/css' />");
        //         myWindow.document.write("<link href='" + approot + "/Themes/secretaryPortal.css' rel='stylesheet' type='text/css' />");
        myWindow.document.write("</head>");
        myWindow.document.write("<body style='font: 11pt/1.2 Arial !important;'>");
        //         myWindow.document.write("<div class='story'>");
        printContents.find("script").remove();
        myWindow.document.write(vm.$(printContents).html());
        //        myWindow.document.write("</div>");
        myWindow.document.write("</body>");
        myWindow.document.write("</html>");
        myWindow.focus();
        //       myWindow.print();
        //        myWindow.close();

    }
    openPhoto() {
        this.students.type = "student";
        this.PhotoUtil.openPhotoModal(this, this.students);
    }
    dateopen($event) {
        this.status.opened = true;
    }
    pdateopen($event) {
        this.pstatus.opened = true;
    }

    rankremove(ranktype) {
        this.$log.log('rankremove entered', ranktype);
        this.removeStudentRank(ranktype);
    }

    activate() {
        var vm = this;
        vm.$log.log('about activate editstudent ');

        return vm.getStudent().then(function() {
            vm.$log.log('activated EditStudent view');
            //    StudentServices.setActiveTab(1,'EditStudent controller');
            var thetab = vm.StudentServices.getActiveTab();
            vm.$log.log('activate the active tab', thetab);
            //    vm.active[thetab] = true;
            vm.active = thetab;
            if (typeof(vm.students.ID) !== 'undefined') {
                vm.getStudentRanks(vm.students.ID);
                vm.getStudentRankTypes(vm.students.ID);
            }
            vm.$scope.$emit('studentloaded', { studentdata: vm.students });

        }, function(error) {
            vm.$log.log('activate editstudent', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }
    /*
        getRankPartial(theinput) {
            var vm = this;
            return vm.StudentServices.getRankPartial(theinput, vm.ranktypepick).then(function(data) {
                vm.$log.log('controller getRankPartial returned data', theinput, vm.ranktypepick);
                vm.$log.log(data);
                vm.ranklist = data;
                vm.$log.log('controller getRankPartial service data', vm.ranklist);
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
        //        vm.lastPromoted = vm.rankpickparent.lastPromoted;
        vm.$log.log('updateRankPick', rankpickparent, prop, value, vm.rankpick, vm.ranktypepick, vm.lastPromoted);
        //        vm.getRankList();
        //        vm.setRank('All');
        //        vm.$log.log('setRank', vm.Rank);

    }

    /*
        getRank(theinput) {
            var vm = this;

            return vm.StudentServices.getRank(vm.ranktypepick).then(function(data) {
                vm.$log.log('controller getRank returned data', theinput, vm.ranktypepick);
                vm.$log.log(data);
                vm.ranklist = data;
                vm.$log.log('controller getRank service data', vm.ranklist);
                return vm.ranklist;
            });

        }
    */
    getBirthday(bday) {
        var vm = this;
        vm.$log.log('bday');
        vm.$log.log(bday);
        return new Date(bday);
    }

    getStudent() {
        var vm = this;
        return vm.StudentServices.getStudent(vm.path).then(function(data) {
            vm.$log.log('getStudent returned data');
            vm.$log.log(data);

            vm.students = data;

            vm.$log.log(vm.students.message);
            vm.message = vm.students.message;
            if ((typeof vm.students === 'undefined' || vm.students.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                vm.Notification.success({ message: vm.message, delay: 5000 });
                vm.PhotoServices.setTheStudent(data);
                vm.$log.log('studen pic url', vm.students.pictureurl);
                if (vm._.isEmpty(vm.students.pictureurl)) {
                    vm.$log.log('empty picture');
                    vm.students.pictureurldecache = 'missingstudentpicture.png';
                }
                else {
                    vm.students.pictureurldecache = vm.students.pictureurl + '?decache=' + Math.random();
                }
                vm.$log.log('get Birthday:', vm.students.Birthday);
                if (vm._.isEmpty(vm.students.Birthday)) {
                    vm.students.Birthday = vm.getBirthday(new Date());
                }
                else {
                    vm.students.Birthday = vm.getBirthday(vm.students.Birthday);
                }

                vm.$log.log('studen pic url decache', vm.students.pictureurldecache);
            }

            return vm.students;
        }, function(error) {
            vm.$log.log('getStudent', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getStudentRanks(studentid) {
        var vm = this;
        if (typeof studentid === 'undefined') {
            return {};
        }
        vm.$log.log('getStudentRanks entered', studentid);
        var thepath = encodeURI("../v1/studentrank?ContactID=" + studentid);

        return vm.StudentServices.getStudentRanks(thepath).then(function(data) {
            vm.$log.log('getStudentRanks returned data');
            vm.$log.log(data, data.studentranklist);
            if (typeof(data.studentranklist) !== 'undefined' && data.error === false) {
                vm.$log.log('studentranklist', data.studentranklist);
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
            vm.$log.log('getStudentRanks', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getStudentRankTypes(studentid) {
        var vm = this;
        if (typeof studentid === 'undefined') {
            return {};
        }
        vm.$log.log('getStudentRankTypes entered', studentid);
        var thepath = encodeURI("../v1/ranktypeexcluded?ContactID=" + studentid);

        return vm.StudentServices.getStudentRankTypes(thepath).then(function(data) {
            vm.$log.log('getStudentRankTypes returned data');
            vm.$log.log(data, data.ranktypelist);
            if (typeof(data.ranktypelist) !== 'undefined' && data.error === false) {
                vm.$log.log('studentranktypelist', data.ranktypelist);
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
            vm.$log.log('getStudentRankTypes', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    addStudentRank() {
        var vm = this;
        vm.$log.log('addStudentRank entered', vm.rankpick, vm.ranktypepick);
        var thedata = {
            ContactID: vm.students.ID,
            currentrank: vm.rankpick,
            ranktype: vm.ranktypepick,
            lastPromoted: vm.lastPromoted
        };
        return vm.StudentServices.addStudentRank(thedata)
            .then(function(data) {
                vm.$log.log('addStudentRank returned data');
                vm.$log.log(data);
                vm.getStudentRanks(vm.students.ID);
                return data;
            }).catch(function(e) {
                vm.$log.log('addStudentRank failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    removeStudentRank(ranktype) {
        var vm = this;
        vm.$log.log('removeStudentRank entered', vm.students.ID, ranktype);
        var thedata = {
            ContactID: vm.students.ID,
            ranktype: ranktype
        };
        return vm.StudentServices.removeStudentRank(thedata)
            .then(function(data) {
                vm.$log.log('removeStudentRank returned data');
                vm.$log.log(data);
                vm.getStudentRanks(vm.students.ID);
                vm.getStudentRankTypes(vm.students.ID);
                return data;
            }).catch(function(e) {
                vm.$log.log('removeStudentRank failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    updateStudentRank(item) {
        var vm = this;
        vm.$log.log('about updateStudentRank ', item);

        var thepath = "../v1/studentrank";
        var thedata = {
            ContactID: item.ContactID,
            ranktype: item.ranktype,
            currentrank: item.currentrank,
            lastModifiedDate: item.lastPromoted
        };

        return vm.StudentServices.updateStudentRank(thepath, thedata).then(function(data) {
            vm.$log.log('updateStudentRank returned data:');
            vm.$log.log(data);
            vm.getStudentRanks(item.ContactID);
        }, function(error) {
            vm.$log.log('updateStudent', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    updateStudent(form) {
        var vm = this;
        vm.$log.log('about updateStudent ', vm.students, form);
        vm.$log.log('with Birthday', vm.students.Birthday);
        if (form.$invalid) {
            return;
        }

        return vm.StudentServices.updateStudent(vm.path, vm.students).then(function(data) {
            vm.$log.log('updateStudent returned data: goto', vm.path);
            vm.$log.log(data);
            vm.students = data;
            vm.getStudent();
        }, function(error) {
            vm.$log.log('updateStudent', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    removeStudent() {
        var vm = this;
        vm.$log.log('removeStudent entered', vm.students.ID);
        var path = '../v1/student';
        var thedata = {
            id: vm.students.ID
        };
        var data = {};
        data.StudentExistsList = {};

        return vm.StudentServices.removeStudent(thedata, path)
            .then(function(data) {
                vm.$log.log('removeStudent returned data');
                vm.$log.log(data);
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
                    vm.$log.log(url);
                    vm.$window.location.href = url;

                }

                return data;
            }).catch(function(e) {
                vm.$log.log('removeStudent failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    getAllZips() {
        var vm = this;

        return vm.StudentServices.getAllZips(vm.zippath).then(function(data) {
            vm.$log.log('getAllZips returned data');
            vm.$log.log(data);
            vm.zipList = data;

            return vm.zipList;
        }, function(error) {
            vm.$log.log('getAllZips', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });

    }

    getStudentLists() {
        var vm = this;

        return vm.StudentServices.getStudentLists(vm.sListPath).then(function(data) {
            vm.$log.log('controller getStudentLists returned data');
            vm.$log.log(data);
            vm.StudentList = data;

            return vm.StudentList;
        }, function(error) {
            vm.$log.log('getStudentLists ', error);
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

                vm.$log.log('getRankList returned data');
                vm.$log.log(data);
                vm.RanksList = data;

                return vm.RanksList;
            }, function(error) {
                vm.$log.log('getRankList ', error);
                vm.Notification.error({ message: error, delay: 5000 });
                return (error);
            });
        }
    */
    setHeight() {
        var vm = this;

        vm.$('#form-layouts-editstudent ul.nav-pills li a').live('click', function() {
            vm.$log.log('set height');
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
        vm.$log.log('set activetab as:', activeTab, thecaller);
        vm.StudentServices.setActiveTab(activeTab, thecaller);

    }

    getActiveTab() {
        var vm = this;
        var atab = vm.StudentServices.getActiveTab();
        vm.$log.log('get activetab is:', atab);
        return atab;
    }


}
