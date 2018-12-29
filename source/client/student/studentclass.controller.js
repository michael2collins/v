export class StudentClassController {
    constructor(
        $scope, $rootScope, $routeParams,
        $log, $http, $location, $timeout, ClassServices, Notification, $q, $controller
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
    }

    $onInit() {
        var vmclass = this;
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

        vmclass.activate();
    }

    $onDestroy() {
        this.$log.debug("ModalNewStudentInstanceController dismissed");
        this.$log.debugEnabled(false);
    }

    getClassSearchResult() {
        this.$log.debug('search finish, get result');
        this.vmclass.studentclass = this.ClassServices.getClassSearchResult();
    }

    activate() {
        var vmclass = this;
        vmclass.$log.debug('class activate');
        vmclass.$q.all([

                vmclass.getStudentClassList().then(function() {
                    vmclass.$log.debug('getStudentClassList ready');
                    vmclass.getStudentClassStatuses();
                    vmclass.$log.debug("listnew in activate", vmclass.xlistnew);

                }).catch(function(e) {
                    vmclass.$log.debug("getStudentClassList error in activate", e);
                }),
                vmclass.getStudentClazzList().then(function() {
                    vmclass.$log.debug('getStudentClazzList ready');

                }).catch(function(e) {
                    vmclass.$log.debug("getStudentClassList error in activate", e);
                }),
                vmclass.ClassServices.distinctCat().then(function(data) {
                    vmclass.$log.debug('distinctCat get:', data);
                    vmclass.classcategories = data.classcatlist;
                    vmclass.$log.debug("distinctCat in activate", vmclass.classcategories);
                }).catch(function(e) {
                    vmclass.$log.debug("distinctCat error in activate", e);
                }),

                vmclass.ClassServices.distinctAge().then(function(data) {
                    vmclass.$log.debug('distinctAge get:', data);
                    vmclass.agecategories = data.agecatlist;
                    vmclass.$log.debug("distinctAge in activate", vmclass.agecategories);
                }).catch(function(e) {
                    vmclass.$log.debug("distinctAge error", e);
                }),

                vmclass.ClassServices.distinctPgm().then(function(data) {
                    vmclass.$log.debug('distinctPgm get:', data);
                    vmclass.pgmcategories = data.pgmcatlist;
                    vmclass.$log.debug("distinctPgm in activate", vmclass.pgmcategories);
                }).catch(function(e) {
                    vmclass.$log.debug("distinctPgm error", e);
                }),


            ])
            .then(function() {
                vmclass.$log.debug('studentclass activation done returned');
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
            vmclass.$log.debug('getClassPgm returned data', data);
            vmclass.studentclass = data;
            vmclass.classpictureurl = data.pictureurl;
            return vmclass.studentclass;
        }, function(error) {
            vmclass.$log.debug('getStudentClass ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });

    }
    getStudentClass() {
        var vmclass = this;
        return vmclass.ClassServices.getStudentClass(vmclass.path).then(function(data) {
            vmclass.$log.debug('getStudentClass returned data', data);
            vmclass.studentclass = data;
            vmclass.classpictureurl = data.pictureurl;

            return vmclass.studentclass;
        }, function(error) {
            vmclass.$log.debug('getStudentClass ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });

    }

    getStudentClazzList() {
        var vmclass = this;
        vmclass.$log.debug('getStudentClazzList entered:' + vmclass.$routeParams.id);
        var path = '../v1/studentclasslist/' + vmclass.$routeParams.id;
        return vmclass.ClassServices.getStudentClassList(path).then(function(data) {
            vmclass.studentclazzlist = data.studentclasslist;
            for (var iter = 0, len = vmclass.studentclazzlist.length; iter < len; iter++) {
                vmclass.studentclazzlist[iter].payerList = {
                    payerName: vmclass.studentclazzlist[iter].payerName,
                    payerid: vmclass.studentclazzlist[iter].payerid,
                    primaryContact: vmclass.studentclazzlist[iter].primaryContact
                };
            }
            vmclass.$log.debug('studentclazzlist returned data', vmclass.studentclazzlist);
            return vmclass.studentclazzlist;
        }, function(error) {
            vmclass.$log.debug('getStudentClass ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });

    }
    getPayersPartial(theinput) {
        var vmclass = this;
        vmclass.$log.debug('getPayers entered');

        return vmclass.ClassServices.getPayersPartial(theinput).then(function(data) {
            vmclass.$log.debug('controller getPayersPartial returned data', theinput);
            vmclass.$log.debug(data.payerlist);
            vmclass.payers = data.payerlist;
            return vmclass.payers;
        });

    }


    getStudentClassPicture() {
        var vmclass = this;
        return vmclass.ClassServices.getStudentClassPicture(
            vmclass.classpicpath + '/' +
            vmclass.picID).then(function(data) {
            vmclass.$log.debug('getStudentClassPicture returned data');
            vmclass.$log.debug(data);
            vmclass.classpictureurl = data;

            return vmclass.classpictureurl;
        });
    }
    getStudentClassPictureList() {
        var vmclass = this;
        var path = "../v1/studentclasspicturelist/" + vmclass.$routeParams.id;
        return vmclass.ClassServices.getStudentClassPictureList(path).then(function(data) {
            vmclass.$log.debug('getStudentClassPictureList returned data');
            vmclass.$log.debug(data);
            vmclass.classpictureurllist = data.picturelist;

            return vmclass.classpictureurllist;
        });
    }

    getStudentClassList() {
        var vmclass = this;
        return vmclass.ClassServices.getStudentClassList(vmclass.classlistpath).then(function(data) {
            vmclass.$log.debug('getStudentClassList returned data');
            vmclass.$log.debug(data);
            vmclass.xlistnew = data;
            vmclass.ClassServices.setxlist(vmclass.xlistnew);
            return vmclass.xlistnew;
        }, function(error) {
            vmclass.$log.debug('getStudentClassList ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getStudentClassStatuses() {
        var vmclass = this;
        return vmclass.ClassServices.getStudentClassStatuses(
            vmclass.classstatuspath).then(function(data) {
            vmclass.$log.debug('getStudentClassStatuses returned data');
            vmclass.$log.debug(data);
            vmclass.classstatuses = data;

            return vmclass.classstatuses;
        });
    }

    changeStudentStatus(clazzitem) {
        var vmclass = this;
        vmclass.$log.debug('about changeStudentStatus ', clazzitem);
        vmclass.changestatus = "status";
        vmclass.updateStudentClass(clazzitem);
    }
    changetestfee(clazzitem) {
        var vmclass = this;
        vmclass.$log.debug('about changetestfee ', clazzitem);
        vmclass.changestatus = "testfee";
        vmclass.updateStudentClass(clazzitem);
    }
    changeprimaryContact(clazzitem) {
        var vmclass = this;
        vmclass.$log.debug('about changeprimaryContact ', clazzitem);
        vmclass.changestatus = "primaryContact";
        vmclass.updateStudentClass(clazzitem);
    }
    changeStudentPayer(clazzitem) {
        var vmclass = this;
        vmclass.$log.debug('about changeStudentPayer ', clazzitem);
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

        vmclass.$log.debug('about updateStudentClass ', clazzitem);
        return vmclass.ClassServices.updateStudentClass(
            path, clazzitem).then(function(data) {
            vmclass.$log.debug('updateStudentClass returned data');
            vmclass.$log.debug(data);
            vmclass.$log.debug(data.message);
            if ((typeof data === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vmclass.Notification.error({ message: data.message, delay: 5000 });
                return (vmclass.$q.reject(data));
            }
            else {
                vmclass.Notification.success({ message: data.message, delay: 5000 });
            }

            vmclass.getStudentClazzList();
        }, function(error) {
            vmclass.$log.debug('updateStudentClass ', error);
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
            studentclassstatus: vmclass.studentclass.studentclassstatus
        };
        vmclass.$log.debug('about addStudentRegistration ', path, thedata, vmclass.studentclass);
        return vmclass.ClassServices.addStudentRegistration(path, thedata).then(function(data) {
            vmclass.$log.debug('addStudentRegistration returned data: ');
            vmclass.$log.debug(data);

            if ((typeof data.message === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vmclass.Notification.error({ message: data.message, delay: 5000 });
                return (vmclass.$q.reject(data));
            }
            else {
                vmclass.Notification.success({ message: data.message, delay: 5000 });
            }

            //if we added a payer for the registration, then refresh the list on the payment page
            vmclass.getStudentClazzList();

        }, function(error) {
            vmclass.$log.debug('addStudentRegistration ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    removeStudentRegistration(classid, pgmid) {
        var vmclass = this;
        vmclass.$log.debug('removeStudentRegistration entered');
        var path = "../v1/studentregistration";
        var thedata = {
            studentid: vmclass.$routeParams.id,
            classseq: classid,
            pgmseq: pgmid
        };
        return vmclass.ClassServices.removeStudentRegistration(path, thedata)
            .then(function(data) {
                vmclass.$log.debug('removeStudentRegistration returned data');
                vmclass.$log.debug(data);
                vmclass.getStudentClazzList();
                return data;
            }).catch(function(e) {
                vmclass.$log.debug('removeStudentRegistration failure:');
                vmclass.$log.debug("error", e);
                vmclass.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

//studenreg handles now
/*
    setStudentClass(mystudent, myclassid, mypgmid) {
        var vmclass = this;
        var setclasspath = '../v1/studentclass/id/' +
            mystudent +
            '/myclass/' +
            myclassid +
            '/mypgm/' +
            mypgmid;
        vmclass.$log.debug('studentid: ' + mystudent);
        vmclass.$log.debug('studentclass: ' + myclassid);
        vmclass.$log.debug('studentpgm: ' + mypgmid);

        vmclass.$log.debug('about setStudentClass ', mystudent);
        vmclass.$log.debug('for class ', myclassid);
        return vmclass.ClassServices.setStudentClass(
            setclasspath, mystudent, myclassid, mypgmid).then(function(data) {
            vmclass.$log.debug('setStudentClass returned data: ');
            vmclass.$log.debug(data);
        });
    }
    */
}