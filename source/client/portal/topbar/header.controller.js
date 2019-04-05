const { jQuery: $ } = window;
import angular from 'angular';

export class HeaderController {

    constructor(
        $scope,
        userServices,
        calendarServices,
        studentServices,
        classServices,
        Notification,
        $uibModal,
        $q,
        $log,
        $interval,
        $timeout,
        Idle,
        Title,
        $location,
        $cookies,
        $window,
        portalDataService,
        _,
        $rootScope
    ) {
        'ngInject';

        this.$scope = $scope;
        this.UserServices = userServices;
        this.CalendarServices = calendarServices;
        this.StudentServices = studentServices;
        this.ClassServices = classServices;
        this.portalDataService = portalDataService;
        this.Notification = Notification;
        this.$uibModal = $uibModal;
        this.$q = $q;
        this.$log = $log;
        this.$interval = $interval;
        this.$timeout = $timeout;
        this.Idle = Idle;
        this.Title = Title;
        this.$location = $location;
        this.$cookies = $cookies;
        this.$window = $window;
        this._ = _;
        this.$rootScope = $rootScope;
    }


    $onInit() {
        this.$log.log("header controller entered");
        
        this.isok = {};
        this.userdta = { 'initial': 'init' };
        this.myuser = null;
        this.message = null;
        this.data = null;
        this.thisTasknamelist = [];
        this.alertcount = 0;
        this.newstudents = [];
        this.teststudents = [];
        this.overduestudents = [];
        this.noshowstudents = [];
        this.emailcount = 0;
        this.userOptions = {};
        this.okNotify = false;
        this.mydelay = 0;
        this.showTimeoutv = false;
        this.timeout = 32;

        this.origtitle = 'V Dojo';

        this.Title.store(this.origtitle);
        this.Title.idleMessage(this.origtitle);
        this.portalDataService.Portlet('header-controller.js');
        this.menuclass='dropdown-menu';
        this.$rootScope.mobile=false;
        this.init();

    }


    $onDestroy() {
        this.$log.log("main dismissed");
        //this.$log.logEnabled(false);
    }

    init() {
        var self = this;
        self.loadTopbar();
        if (self.$log.getInstance(self.UserServices.isDebugEnabled()) !== undefined) {
            self.$log = self.$log.getInstance('HeaderController', self.UserServices.isDebugEnabled());
        }

        self.islogin();

        self.$scope.$on('IdleStart', function() {
            self.$log.log('IdleStart');
            self.Title.original();
            self.$scope.$apply();
        });
        self.$scope.$on('IdleEnd', function() {
            self.$log.log('IdleEnd');
            self.Title.restore();
            self.showTimeoutv = false;
            self.$scope.$apply();
        });
        self.$scope.$on('IdleWarn', function(e, countdown) {
            var self = e.currentScope.$ctrl;
            self.$log.log('IdleWarn', countdown);
            self.$scope.remaining = { totalSeconds: countdown };
            self.$scope.remaining.minutes = Math.floor(countdown / 60);
            self.$scope.remaining.seconds = self.padLeft(countdown - self.$scope.remaining.minutes * 60, 2);
            self.$scope.minutes = self.$scope.remaining.minutes;
            self.$scope.seconds = self.$scope.remaining.seconds;
            self.Title.setAsIdle(countdown);
            self.Title.idleMessage('Timeout in {{minutes}}:{{seconds}} ');
            self.Title.timedOutMessage("Whoops you've pretimedout");
            self.showTimeoutv = true;
            self.$scope.$apply();
        });
        self.$scope.$on('IdleTimeout', function() {
            //        this.$log.log('IdleTimeout');
            self.Title.setAsTimedOut();
            //give login 60 seconds
            self.Idle.setIdle(30);
            self.Idle.setTimeout(30);
            //self.showTimeoutv = false;
            self.UserServices.ClearCredentials();
            self.$scope.$apply();
            var picurl = self.$scope.$ctrl.userdta.pictureurl;
            self.$location.path('/page-lock-screen?pictureurl=' + picurl);
        });
        self.$scope.$on('Keepalive', function() {
            self.$log.log('Keepalive');
        });



        self.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            if (event == undefined) {
                return;
            }
            var vm = event.currentScope.$ctrl;
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            if (current.originalPath !== '/page-signin') {

                vm.$log.log('routechange in main for success');
                vm.data = vm.portalDataService.get(current.originalPath);
                vm.isokf();
                var mydelay = vm.CalendarServices.getIntervalValue();
                vm.$interval(vm.intervalChecker(vm), mydelay * 1000);
            }
            else {
                event.preventDefault();
                if (angular.isDefined(vm.intervalChecker)) {
                    vm.$interval.cancel(vm.intervalChecker(vm));
                    //vm.intervalChecker = undefined;
                }
            }
        });

        self.intervalChecker(self);

    }

    intervalChecker(input) {
        var vm = input
        vm.$log.log('main controller intervalChecker entered');
        vm.islogin();
    }

    padLeft(nr, n, str) {
        return new Array(n - String(nr).length + 1).join(str || '0') + nr;
    }

    showTimeout() {
        return this.showTimeoutv;
    }


    //todo: move this to a common class    
    getUserOptions() {
        var self = this;

        self.$log.log('getUserOptions entered');
        var path = "../v1/useroptions";
        return self.UserServices.getUserOptions(path).then(function(data) {
                self.$log.log("main controller service getUserOptions returned:", data);
                if ((typeof data.options === 'undefined' || data.options.error === true) &&
                    typeof data !== 'undefined') {
                    var themsg = '';
                    if (typeof(data.extra) !== 'undefined') {
                        themsg = {
                            message: data.message + ': ' +
                                (typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
                            delay: 5000
                        };
                    }
                    else {
                        themsg = {
                            message: data.message + ': ' +
                                (typeof(data.error) === "string" ? data.error : ""),
                            delay: 5000
                        };
                    }
                    self.Notification.error(themsg);
                    return (self.$q.reject(data));
                }
                else {
                    try {
                        self.userOptions = JSON.parse(data.options);
                        self.okNotify = (self.userOptions.notify ? self.userOptions.notify : false);
                        self.debugOn = (self.userOptions.debug ? self.userOptions.debug : "Off");
                        //self.$log.logEnabled(self.debugOn);

                        self.mydelay = (self.userOptions.delay ? self.userOptions.delay : 30);
                        self.idle = (self.userOptions.idle ? self.userOptions.idle : 5);
                        self.timeout = (self.userOptions.timeout ? self.userOptions.timeout : 5);

                        self.UserServices.setUserDetailOptions(data.options);
                        //            self.$log = self.$log.getInstance('HeaderController',self.UserServices.isDebugEnabled());

                        self.Title.setAsIdle(self.idle);
                        self.Idle.setIdle(self.idle);
                        self.Idle.setTimeout(self.timeout);

                        self.Idle.watch();

                        self.CalendarServices.setIntervalValue(self.mydelay);
                        self.CalendarServices.setOkNotify(self.okNotify);
                        //self.Notification.success({message: self.message, delay: 5000});
                    }
                    catch (e) {
                        self.$log.log(e instanceof SyntaxError); // true
                        self.$log.log(e.message); // "missing ; before statement"
                        self.$log.log(e.name); // "SyntaxError"
                        self.$log.log(e.fileName); // "Scratchpad/1"
                        self.$log.log(e.lineNumber); // 1
                        self.$log.log(e.columnNumber); // 4
                        self.$log.log(e.stack); // "@Scratchpad/1:2:3\n"
                        self.Notification.error(e.message);
                        return (self.$q.reject(data));
                    }

                }

                return self.userOptions;
            },

            function(error) {
                self.$log.log('Caught an error getUserOptions, going to notify:', error);
                self.userOptions = [];
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {});

    }

    openSettings() {
        var thisModal = this;

        thisModal.animationsEnabled = true;

        thisModal.modalInstance = undefined;
        thisModal.retvlu = '';
        var modalScope = thisModal.$scope.$new();

        thisModal.modalInstance = thisModal.$uibModal.open({
            animation: thisModal.animationsEnabled,
            //            templateUrl: '../user/usersettings.html',
            //            controller: 'ModalUserSettingsInstanceController as $ctrl',
            component: 'usersettingsComponent',
            size: 'md',
            windowClass: 'my-modal-popup',
            scope: modalScope,
            resolve: {
                classname: function() {
                    thisModal.$log.log('return from open');
                    return thisModal.retvlu;
                }

            }
        });
        modalScope.modalInstance = thisModal.modalInstance;

        thisModal.modalInstance.result.then(function(retvlu) {
            thisModal.$log.log('search modalInstance result :', retvlu);
            thisModal.retvlu = retvlu;
        }, function() {
            thisModal.$log.info('Modal dismissed at: ' + new Date());
            thisModal.getUserOptions();
            //debug might have changed, so reload route
            thisModal.$window.location.reload();
        });

    }

    newEmail() {
        var emailModal = this;
        //emailModal.data.emailtype = "new";

        emailModal.animationsEnabled = true;

        emailModal.modalInstance = undefined;
        emailModal.retvlu = '';
        var modalScope = emailModal.$scope.$new();

        emailModal.modalInstance = emailModal.$uibModal.open({
            animation: emailModal.animationsEnabled,
            //            template: '../../email/email.html',
            //            controller: 'ModalEmailInstanceController as vm',
            component: 'emailComponent',
            size: 'md',
            // scope: emailModal.$scope,
            windowClass: 'my-modal-popup',
            resolve: {
                myinitial: function() { return {} },
                /*     contactform: function() {
                         return emailModal.$scope.form.read;
                     }
                 */
            }
        });
        modalScope.modalInstance = emailModal.modalInstance;

        emailModal.modalInstance.result.then(function(retvlu) {
            emailModal.$log.log('search modalInstance result :', retvlu);
            emailModal.retvlu = retvlu;
        }, function() {
            emailModal.$log.info('Modal dismissed at: ' + new Date());
        });

    }

    openEmail() {
        var emailModal = this;

        emailModal.animationsEnabled = true;

        emailModal.modalInstance = undefined;
        emailModal.retvlu = '';
        var modalScope = emailModal.$scope.$new();

        emailModal.modalInstance = emailModal.$uibModal.open({
            animation: emailModal.animationsEnabled,
            //            template: '../../email/emaillist.html',
            //            controller: 'ModalEmailListInstanceController as vm',
            component: 'emaillistComponent',
            size: 'lg',
            windowClass: 'my-modal-popup',
            resolve: {
                classname: function() {
                    emailModal.$log.log('return from open');
                    return emailModal.retvlu;
                }

            }
        });
        modalScope.modalInstance = emailModal.modalInstance;

        emailModal.modalInstance.result.then(function(retvlu) {
            emailModal.$log.log('search modalInstance result :', retvlu);
            emailModal.retvlu = retvlu;
        }, function() {
            emailModal.$log.info('Modal dismissed at: ' + new Date());
            emailModal.getEmailCount();
        });

    }

    islogin() {
        var self = this;

        self.$log.log('islogin main controller');
        self.isok = self.UserServices.isapikey();
        //        self.userdta = {};

        if (self.isok) {
            self.$log.log('setting apikey for services in main controller');
            var thekey = self.UserServices.getapikey();
            //self.CalendarServices.setapikey(thekey);
            //self.StudentServices.setapikey(thekey);
            self.UserServices.setapikey(thekey);
            self.showTimeoutv = false;

            self.$q.all([
                    self.gettheTasknamelist().then(function() {
                        self.$log.log('gettheTasknamelist returned');
                    }),
                    self.getEmailCount().then(function() {
                        self.$log.log('getEmailCount returned');
                    }),
                    self.getNotifications().then(function() {
                        self.$log.log('getNotifications returned');
                    }),
                    self.getUserDetails().then(function() {
                        self.$log.log('q return   getUserDetails returned');
                    }),
                    self.getUserOptions().then(function() {
                        self.$log.log('q return   getUserOptions returned');
                    })

                ])
                .then(function() {
                    self.$log.log('getAll stats done returned');
                    self.setAlertCount();
                });

        }

    }

    setAlertCount() {
        this.alertcount = this.teststudents.length +
            this.newstudents.length +
            this.overduestudents.length +
            this.noshowstudents.noshow.length +
            this.thisTasknamelist.length;

    }

    clearNewStudents() {
        this.$log.log("clearNewStudents entered");
        for (var i = 0; i < this.newstudents.length; i++) {
            this.removeNotification(this.newstudents[i].id);
        }
    }

    clearTestStudents() {
        this.$log.log("clearTestStudents entered");
        for (var i = 0; i < this.teststudents.length; i++) {
            this.removeNotification(this.teststudents[i].id);
        }
    }

    clearOverdueStudents() {
        this.$log.log("clearOverdueStudents entered");
        for (var i = 0; i < this.overduestudents.length; i++) {
            this.removeNotification(this.overduestudents[i].id);
        }
    }

    clearNoshowStudents() {
        this.$log.log("clearNoshowStudents entered");
    }

    gettheTasknamelist() {
        var self = this;

        self.$log.log('gettheTasknamelist entered');
        var refreshpath = "../v1/tasknamelist";

        return self.CalendarServices.gettasknamelist(refreshpath).then(function(data) {
                self.$log.log('gettasknamelists returned data');
                self.$log.log(data);
                self.thisTasknamelist = data.tasknamelist;
                return self.thisTasknamelist;
            },
            function(error) {
                self.$log.log('Caught an error gettheTasknamelist, going to notify:', error);
                self.thisTasknamelist = [];
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.loading = false;
            self.loadAttempted = true;
        });

    }

    getUserDetails() {
        var self = this;

        self.$log.log('header controller getUserDetails entered');
        return self.UserServices.getUserDetails().then(function(data) {
                self.$log.log("header controller service getuserdetails returned:", data);
                //    self.islogin();
                self.userdta = data;
                self.myuser = data.userid;

                return self.userdta;
            },

            function(error) {
                self.$log.log('Caught an error getUserDetails, going to notify:', error);
                self.userdta = [];
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {});

    }

    getNotifications() {
        var self = this;

        self.$log.log('getNotifications entered');
        var path = "../v1/notification";
        return self.StudentServices.getNotifications(path).then(function(data) {
                self.$log.log("service getNotifications returned:", data);
                if (typeof(data.NotificationList) !== 'undefined' && data.error === false) {
                    self.$log.log('NotificationList', data.NotificationList);
                    self.newstudents = [];
                    self.teststudents = [];
                    self.overduestudents = [];
                    for (var i = 0; i < data.NotificationList.length; i++) {
                        var newstu = {},
                            overstu = {},
                            teststu = {};
                        if (data.NotificationList[i].type === "newstudent") {
                            newstu = {
                                id: data.NotificationList[i].id,
                                type: data.NotificationList[i].type,
                                notifkey: data.NotificationList[i].notifkey,
                                value: data.NotificationList[i].value,
                                firstname: data.NotificationList[i].firstname,
                                lastname: data.NotificationList[i].lastname,
                                contactid: data.NotificationList[i].contactid
                            };
                            self.newstudents.push(newstu);
                        }
                        if (data.NotificationList[i].type === "overdue") {
                            overstu = {
                                id: data.NotificationList[i].id,
                                type: data.NotificationList[i].type,
                                notifkey: data.NotificationList[i].notifkey,
                                value: data.NotificationList[i].value,
                                firstname: data.NotificationList[i].firstname,
                                lastname: data.NotificationList[i].lastname,
                                contactid: data.NotificationList[i].contactid,
                                payerEmail: data.NotificationList[i].payerEmail
                            };
                            self.overduestudents.push(overstu);
                        }
                        if (data.NotificationList[i].type === "readytotest") {
                            teststu = {
                                id: data.NotificationList[i].id,
                                type: data.NotificationList[i].type,
                                notifkey: data.NotificationList[i].notifkey,
                                value: data.NotificationList[i].value,
                                firstname: data.NotificationList[i].firstname,
                                lastname: data.NotificationList[i].lastname,
                                contactid: data.NotificationList[i].contactid
                            };
                            self.teststudents.push(teststu);
                        }
                    }
                }
                else {
                    if (typeof(data) !== 'undefined') {
                        self.Notification.error({ message: typeof(data.message) !== 'undefined' ? data.message : 'error NotificationList', delay: 5000 });
                    } //else ok to have no ranklist
                }
/*                self.overduestudents = {
                    "overdue": [
                        { "id": 1, "firstname": "first1", "lastname": "last1" },
                        { "id": 2, "firstname": "first2", "lastname": "last2" }
                    ]
                };
*/         
                self.noshowstudents = {
                    "noshow": [
                        { "id": 1, "firstname": "first1", "lastname": "last1" },
                        { "id": 2, "firstname": "first2", "lastname": "last2" }
                    ]
                };
                self.setAlertCount();

                return;
            },

            function(error) {
                self.$log.log('Caught an error getNotifications, going to notify:', error);
                self.Notifications = [];
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {});

    }

    getEmailCount() {
        var self = this;

        self.$log.log('getEmailCount entered');
        var path = '../v1/emailcount';

        return self.StudentServices.getEmailcount(path).then(function(data) {
            self.$log.log('getEmailCount returned data');
            self.$log.log(data);
            if ((typeof self.emailcount === 'undefined' || self.emailcount.error === true) &&
                typeof data !== 'undefined') {
                self.Notification.error({ message: self.message, delay: 5000 });
                return (self.$q.reject(data));
            }
            else {
                //    Notification.success({message: self.message, delay: 5000});
                self.emailcount = (data.emailcount[0].count > 0 ? data.emailcount[0].count : '');
            }


        }, function(error) {
            self.$log.log('Caught an error getEmailLists:', error);
            self.emailcount = '';
            self.message = error;
            self.Notification.error({ message: error, delay: 5000 });
            return (self.$q.reject(error));

        });
    }

    removeNotification(id) {
        var self = this;

        self.$log.log('removeNotification entered');
        var thedata = {
            id: id
        };
        return self.StudentServices.removeNotification(thedata).then(function(data) {
                self.$log.log("service removeNotification returned:", data);
                self.getNotifications();

                return;
            },

            function(error) {
                self.$log.log('Caught an error removeNotification, going to notify:', error);
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {});

    }

    isokf() {
        //        this.$log.log('isokf');
        this.isok = this.UserServices.isapikey();
        return this.isok;
    }

    loadPageHeader() {
        this.$log.log("loadPageHeader entered");
    }

    loadTopbar() {
        var vm=this;
        vm.$log.log("loadTopbar");
        $("[data-toggle='offcanvas']").on('click', function() {
            $('#sidebar-wrapper').toggleClass('active');
            return false;
        });
        // Setting toggle in mobile view 
        $('#setting-toggle').click(function() {
            vm.$log.log('mobile toggle');
            
            $('.topbar-main').toggle();
        });

        $(window).resize(vm._.debounce(function(){
            vm.$rootScope.mobile = vm.$window.innerWidth < 786 ? true : false;
            vm.$rootScope.mobile ? 
                vm.menuclass='dropdown-menu-right' :
                vm.menuclass='dropdown-menu';
            vm.$scope.$apply();

        },500));
        
//        $(document).ready(function() {
            $('.dropdown-submenu a.test').on("click", function(e) {
                $(this).next('ul').toggle();
                e.stopPropagation();
                e.preventDefault();
                $(this).parent().siblings().removeClass('open');
                $(this).parent().toggleClass('open');
            });
            

            
//        });
//        $(document).ready(function() {

/*            $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
            $('ul.dropdown-menu').on('click', function(event) {
                // Avoid following the href location when clicking
                event.preventDefault();
                // Avoid having the menu to close when clicking
                event.stopPropagation();
                // Re-add .open to parent sub-menu item
                $(this).parent().siblings().removeClass('open');
                $(this).parent().toggleClass('open');
            });

        });
*/
    }
}
