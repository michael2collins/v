import angular from 'angular';

export class StudentClassController {
    constructor(
        $scope, $rootScope, $routeParams,
        $log, $http, $location, $timeout, ClassServices, Notification, $q, $controller, UserServices, StudentUtil, _,$element,$filter,$attrs
    ) {
        'ngInject';
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.$log = $log;
        this.$http = $http;
        this.$timeout = $timeout;
        this.ClassServices = ClassServices;
        this.$location = $location;
        this.Notification = Notification;
        this.$q = $q;
        this.$controller = $controller;
        this.UserServices = UserServices;
        this.StudentUtil = StudentUtil;
        this._ = _;
        this.$filter = $filter;
        this.$element = $element;
        this.$attrs = $attrs;
    }

    $onInit() {
        var vmclass = this;
        vmclass.$ = angular.element;

        vmclass.isCollapsed = true;

        vmclass.categorys = '';
        vmclass.ages = '';
        vmclass.pgms = '';
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
        vmclass.payers = [];
        vmclass.xlistnew = [];
        vmclass.changestatus = false;

        vmclass.path = '../v1/studentclass/' + vmclass.$routeParams.id;
        vmclass.classpicpath = '../v1/studentclasspicture';

        vmclass.classlistpath = '../v1/studentclasslist';
        vmclass.classstatuspath = '../v1/studentclassstatuses';

        vmclass.studentclass.contactID = vmclass.$routeParams.id;


        vmclass.Columnslist = [
            { name: "class", htxt: "Class" },
            { name: "pgmclass", htxt: "Program" },
            { name: "studentclassstatus", htxt: "Status" },
            { name: "payerList", htxt: "Payer" },
            { name: "isTestfeewaived", htxt: "Waive Test Fee?" },
            { name: "primaryContact", htxt: "Primary Acct?" },
            { name: "pictureurl", htxt: "Picture" },
            { name: "action", htxt: "Action" }
        ];
//if mobile true        
//disable header
//video control for nav clazzlist iter        
//loop columnlist
//vmclass.Columnslist[0].htxt  class=xs6
//vmclass.studentclazzlist[0][vmclass.Columnslist[0].name] class=xs6
//if mobile false
//enable header
//loop clazzlist
        vmclass.iter=0;
        
        vmclass.studentpickparent = {};
        vmclass.studentclassparent = vmclass;
        vmclass.eventResult={};
        
        vmclass.add = {nam: 'add'};
        vmclass.update = {nam: 'update'};
        
        vmclass.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
        vmclass.bdateformat = vmclass.formats[4];
        vmclass.status = {};
        vmclass.expiresOnHead = {
            opened: false
        };
        vmclass.disenable=true;
        vmclass.students={};

        vmclass.activate();
        
        vmclass.$scope.$on('students-results:ready', () => {
            // Take action after the view has been populated with the updated data
                    vmclass.students=JSON.parse(vmclass.$attrs.students);

        });
        vmclass.$rootScope.$on('disenableChange', function(event, next, current ) {
            vmclass.disenable=next.disenable;
        });

    }

    


    $onDestroy() {
        this.$log.log("ModalNewStudentInstanceController dismissed");
        //this.$log.logEnabled(false);
    }

    getClassSearchResult() {
        this.$log.log('search finish, get result');
        this.vmclass.studentclass = this.ClassServices.getClassSearchResult();
    }

    activate() {
        var vmclass = this;
        if (vmclass.$log.getInstance(vmclass.UserServices.isDebugEnabled()) !== undefined) {
            vmclass.$log = vmclass.$log.getInstance('StudentClassController', vmclass.UserServices.isDebugEnabled());
        }

        vmclass.$log.log('class activate');
        vmclass.$q.all([

                vmclass.getStudentClassList().then(function() {
                    vmclass.$log.log('getStudentClassList ready');
//                    vmclass.getStudentClassStatuses();
//                    vmclass.$log.log("listnew in activate", vmclass.xlistnew);
                    vmclass.$log.log("listnew in activate", vmclass.xlistnew);

                }).catch(function(e) {
                    vmclass.$log.log("getStudentClassList error in activate", e);
                }),
                vmclass.getStudentClassStatuses().then(function() {
                    vmclass.$log.log("getStudentClassStatuses in activate");

                }).catch(function(e) {
                    vmclass.$log.log("getStudentClassStatuses error in activate", e);
                }),
                vmclass.StudentUtil.getStudentClazzList(vmclass).then(function(data) {
                    vmclass.studentclazzlist = data;
                    vmclass.$log.log('getStudentClazzList ready');

                }).catch(function(e) {
                    vmclass.$log.log("getStudentClazzList error in activate", e);
                }),
                vmclass.ClassServices.distinctCat().then(function(data) {
                    vmclass.$log.log('distinctCat get:', data);
                    vmclass.classcategories = data.classcatlist;
                    vmclass.$log.log("distinctCat in activate", vmclass.classcategories);
                }).catch(function(e) {
                    vmclass.$log.log("distinctCat error in activate", e);
                }),

                vmclass.ClassServices.distinctAge().then(function(data) {
                    vmclass.$log.log('distinctAge get:', data);
                    vmclass.agecategories = data.agecatlist;
                    vmclass.$log.log("distinctAge in activate", vmclass.agecategories);
                }).catch(function(e) {
                    vmclass.$log.log("distinctAge error", e);
                }),

                vmclass.ClassServices.distinctPgm().then(function(data) {
                    vmclass.$log.log('distinctPgm get:', data);
                    vmclass.pgmcategories = data.pgmcatlist;
                    vmclass.$log.log("distinctPgm in activate", vmclass.pgmcategories);
                }).catch(function(e) {
                    vmclass.$log.log("distinctPgm error", e);
                }),


            ])
            .then(function() {
                vmclass.$log.log('studentclass activation done returned');
                vmclass.$scope.$emit('classloaded',{
                    studentclazzlist: vmclass.studentclazzlist,
                    classlist: vmclass.xlistnew,
                    studentclass: vmclass.studentclass,
                    classpictureurl: vmclass.classpictureurl
                });
            });


    }
    clearSelect() {
        var vmclass = this;
        vmclass.categorys = '';
        vmclass.pgms = '';
        vmclass.ages = '';
        vmclass.concatset();
        vmclass.$scope.$emit('iso-option', {
            filter: '*'
        });
    }

    reset(agecat,pgmcat,classcat) {
        var vmclass = this;
//    vmclass.$rootScope.$broadcast('iso-method', {name:'reloadItems', params:null});
//      vmclass.$scope.$emit('iso-method', { name: 'layout', params: null });
//      vmsetclassmodal.studentclassparent.$scope.$emit('iso-method', { name: 'arrange', params: null });
        vmclass.$timeout(function() {
          angular.element('#' + agecat).click();
          angular.element('#' + pgmcat).click();
          angular.element('#' + classcat).click();
          vmclass.$rootScope.$broadcast('iso-init', {name:null, params:null});
        });
        
    }
    clearCatSelect() {
        var vmclass = this;
        vmclass.categorys = '';
        vmclass.concatset();
    }

    clearPgmSelect() {
        var vmclass = this;
        vmclass.pgms = '';
        vmclass.concatset();
    }

    clearAgeSelect() {
        var vmclass = this;
        vmclass.ages = '';
        vmclass.concatset();
    }

    ageset(addition) {
        var vmclass = this;
        vmclass.ages = '.' + addition;
        vmclass.concatset();
    }

    catset(addition) {
        var vmclass = this;
        vmclass.categorys = '.' + addition;
        vmclass.concatset();
    }

    pgmset(addition) {
        var vmclass = this;
        vmclass.pgms = '.' + addition;
        vmclass.concatset();
    }

    concatset() {
        var vmclass = this;
        vmclass.concat = vmclass.ages + vmclass.categorys + vmclass.pgms;
    }

    getClassPgm(myclassid, mypgmid) {
        var vmclass = this;
        var path = '../v1/studentclass/myclass/' +
            myclassid +
            '/mypgm/' +
            mypgmid;

        return vmclass.ClassServices.getClassPgm(path).then(function(data) {
            vmclass.$log.log('getClassPgm returned data', data);
            vmclass.studentclass = data;
            vmclass.classpictureurl = data.pictureurl;
            return vmclass.studentclass;
        }, function(error) {
            vmclass.$log.log('getStudentClass ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });

    }
    getStudentClass() {
        var vmclass = this;
        return vmclass.ClassServices.getStudentClass(vmclass.path).then(function(data) {
            vmclass.$log.log('getStudentClass returned data', data);
            vmclass.studentclass = data;
            vmclass.classpictureurl = data.pictureurl;

            return vmclass.studentclass;
        }, function(error) {
            vmclass.$log.log('getStudentClass ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });

    }

    dateopen($event, iter) {
        var vmpayment = this;
        vmpayment.$log.log("dateopen:", vmpayment.status);
        vmpayment.status[iter].opened = true;
    }
    dateheadopen($event) {
        var vmpayment = this;
        vmpayment.$log.log("dateheadopen:", vmpayment.expiresOnHead);
        vmpayment.expiresOnHead.opened = true;
    }

    getPayersPartial(theinput) {
        var vmclass = this;
//        vmclass.payers = vmclass.StudentUtil.getPayersPartial(theinput);
        var vmclass = this;
        vmclass.$log.log('getPayers entered');

        return vmclass.ClassServices.getPayersPartial(theinput).then(function(data) {
            vmclass.$log.log('controller getPayersPartial returned data', theinput);
            vmclass.$log.log(data.payerlist);
            vmclass.payers = data.payerlist;
            return vmclass.payers;
        });

    }

//    editStudentFromPick(studentpickparent, prop, value) {
   editStudentFromPick(event) {
        var vm = this;
  //      vm.studentpickparent[prop] = value;
//         vm.eventResult = vm.studentpickparent.studentpick;
      vm.studentpickparent = event.studentpickparent;
      vm.eventResult = vm.studentpickparent.studentpick;

    }

    getStudentClassPicture() {
        var vmclass = this;
        return vmclass.ClassServices.getStudentClassPicture(
            vmclass.classpicpath + '/' +
            vmclass.picID).then(function(data) {
            vmclass.$log.log('getStudentClassPicture returned data');
            vmclass.$log.log(data);
            vmclass.classpictureurl = data;

            return vmclass.classpictureurl;
        });
    }
    getStudentClassPictureList() {
        var vmclass = this;
        var path = "../v1/studentclasspicturelist/" + vmclass.$routeParams.id;
        return vmclass.ClassServices.getStudentClassPictureList(path).then(function(data) {
            vmclass.$log.log('getStudentClassPictureList returned data');
            vmclass.$log.log(data);
            vmclass.classpictureurllist = data.picturelist;

            return vmclass.classpictureurllist;
        });
    }

    getStudentClassList() {
        var vmclass = this;
        return vmclass.ClassServices.getStudentClassList(vmclass.classlistpath).then(function(data) {
            vmclass.$log.log('getStudentClassList returned data');
            vmclass.$log.log(data);
            vmclass.xlistnew = data;
            vmclass.ClassServices.setxlist(vmclass.xlistnew);
            return vmclass.xlistnew;
        }, function(error) {
            vmclass.$log.log('getStudentClassList ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getStudentClassStatuses() {
        var vmclass = this;
        return vmclass.ClassServices.getStudentClassStatuses(
            vmclass.classstatuspath).then(function(data) {
            vmclass.$log.log('getStudentClassStatuses returned data');
            vmclass.$log.log(data);
            vmclass.classstatuses = data;

            return vmclass.classstatuses;
        });
    }

    changeStudentStatus(clazzitem) {
        var vmclass = this;
        vmclass.$log.log('about changeStudentStatus ', clazzitem);
        vmclass.changestatus = "status";
        vmclass.updateStudentClass(clazzitem);
    }
    changetestfee(clazzitem) {
        var vmclass = this;
        vmclass.$log.log('about changetestfee ', clazzitem);
        vmclass.changestatus = "testfee";
        vmclass.updateStudentClass(clazzitem);
    }
    changeExpireson(clazzitem) {
        var vmclass = this;
        vmclass.$log.log('about changeExpireson ', clazzitem);
        vmclass.changestatus = "expireson";
        vmclass.updateStudentClass(clazzitem);
    }

    changeprimaryContact(clazzitem) {
        var vmclass = this;
        vmclass.$log.log('about changeprimaryContact ', clazzitem);
        vmclass.changestatus = "primaryContact";
        vmclass.updateStudentClass(clazzitem);
    }
    changeStudentPayer(clazzitem) {
        var vmclass = this;
        vmclass.$log.log('about changeStudentPayer ', clazzitem);
        vmclass.changestatus = "payer";
        vmclass.updateStudentClass(clazzitem);
    }

    updateStudentClass(clazzitem) {
        var vmclass = this;
        var path = '../v1/studentclass/' + vmclass.$routeParams.id;
        clazzitem.contactID = vmclass.$routeParams.id;
        clazzitem.changestatus = vmclass.changestatus;
        clazzitem.payerid = clazzitem.payerList.payerid;
        clazzitem.payerName = clazzitem.payerList.payerName;
        clazzitem.primaryContact = clazzitem.primaryContact;
        clazzitem.expiresOn = clazzitem.expiresOn;

        vmclass.$log.log('about updateStudentClass ', clazzitem);
        return vmclass.ClassServices.updateStudentClass(
            path, clazzitem).then(function(data) {
            vmclass.$log.log('updateStudentClass returned data');
            vmclass.$log.log(data);
            vmclass.$log.log(data.message);
            if ((typeof data === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vmclass.Notification.error({ message: data.message, delay: 5000 });
                return (vmclass.$q.reject(data));
            }
            else {
                vmclass.Notification.success({ message: data.message, delay: 5000 });
            }

            vmclass.StudentUtil.getStudentClazzList(vmclass);
            vmclass.isCollapsed = true;
        }, function(error) {
            vmclass.$log.log('updateStudentClass ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }


    addStudentRegistration() {
        var vmclass = this;
        var path = "../v1/studentregistration";
        var thedata = {
            studentid: vmclass.$routeParams.id,
            classseq: vmclass.studentclass.classseq,
            pgmseq: vmclass.studentclass.pgmseq,
            payerName: vmclass.studentclass.payerName.payerName,
            payerid: vmclass.studentclass.payerName.payerid,
            studentclassstatus: vmclass.studentclass.studentclassstatus,
            expiresOn: vmclass.studentclass.expiresOn
        };
        vmclass.$log.log('about addStudentRegistration ', path, thedata, vmclass.studentclass);
        return vmclass.ClassServices.addStudentRegistration(path, thedata).then(function(data) {
            vmclass.$log.log('addStudentRegistration returned data: ');
            vmclass.$log.log(data);

            if ((typeof data.message === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vmclass.Notification.error({ message: data.message, delay: 5000 });
                return (vmclass.$q.reject(data));
            }
            else {
                vmclass.Notification.success({ message: data.message, delay: 5000 });
            }

            //if we added a payer for the registration, then refresh the list on the payment page
            vmclass.StudentUtil.getStudentClazzList(vmclass);

        }, function(error) {
            vmclass.$log.log('addStudentRegistration ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    removeStudentRegistration(classid, pgmid) {
        var vmclass = this;
        vmclass.$log.log('removeStudentRegistration entered');
        var path = "../v1/studentregistration";
        var thedata = {
            studentid: vmclass.$routeParams.id,
            classseq: classid,
            pgmseq: pgmid
        };
        return vmclass.ClassServices.removeStudentRegistration(path, thedata)
            .then(function(data) {
                vmclass.$log.log('removeStudentRegistration returned data');
                vmclass.$log.log(data);
                vmclass.StudentUtil.getStudentClazzList(vmclass);
                return data;
            }).catch(function(e) {
                vmclass.$log.log('removeStudentRegistration failure:');
                vmclass.$log.log("error", e);
                vmclass.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    updateStudentRegistration(studentclassparent, prop, value, oldclassseq, oldpgmseq) {
        var vmclass = this;
        var clazzitem = {};
        if (value.classseq == null) {
            //notify error
            vmclass.Notification.warning({ message: "No update", delay: 5000 });
            return;
        }
        var path = '../v1/studentclass/' + vmclass.$routeParams.id;
        clazzitem.contactID = vmclass.$routeParams.id;
        clazzitem.newclassseq =  vmclass.studentclass.classseq;
        clazzitem.newpgmseq =  vmclass.studentclass.pgmseq;
        clazzitem.classseq =  oldclassseq;
        clazzitem.pgmseq =  oldpgmseq;
        clazzitem.changestatus = "classpgm";
        clazzitem.class = vmclass.studentclass.class;
        clazzitem.pgmclass = vmclass.studentclass.pgmclass;

        vmclass.$log.log('about updateStudentClassPgm ', clazzitem);
        return vmclass.ClassServices.updateStudentClass(
            path, clazzitem).then(function(data) {
            vmclass.$log.log('updateStudentClass returned data');
            vmclass.$log.log(data);
            vmclass.$log.log(data.message);
            if ((typeof data === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vmclass.Notification.error({ message: data.message, delay: 5000 });
                return (vmclass.$q.reject(data));
            }
            else {
                vmclass.Notification.success({ message: data.message, delay: 5000 });
            }

            vmclass.StudentUtil.getStudentClazzList(vmclass);
        }, function(error) {
            vmclass.$log.log('updateStudentClass ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    
    }

}
