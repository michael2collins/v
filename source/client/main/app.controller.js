const { jQuery: $ } = window;
const { moment: moment } = window;
import angular from 'angular';

export class AppController {
    constructor(
        $scope,
        $routeParams,
        userServices,
        attendanceServices,
        calendarServices,
        testingServices,
        eventServices,
        templateServices,
        studentServices,
        paymentServices,
        classServices,
        statsServices,
        $cookies,
   //     $cookieStore,
        $log,
        Notification,
        $q,
        $window,
        $interval,
        $controller,
        $rootScope,
        moment,
        $timeout,
        calUtil,
        Util,
        Idle,
        portalDataService
    ) {
        /* jshint validthis: true */
        'ngInject';
        console.log('entering app controller');
        this.$log = $log;
        this.$scope = $scope;
        this.$routeParams = $routeParams;
        this.UserServices = userServices;
        this.AttendanceServices = attendanceServices;
        this.CalendarServices = calendarServices;
        this.TestingServices = testingServices;
        this.EventServices = eventServices;
        this.TemplateServices = templateServices;
        this.StudentServices = studentServices;
        this.PaymentServices = paymentServices;
        this.ClassServices = classServices;
        this.StatsServices = statsServices;
        this.$cookies = $cookies;
//        this.$cookieStore = $cookieStore;
        this.Notification = Notification;
        this.$q = $q;
        this.$window = $window;
        this.$interval = $interval;
        this.$controller = $controller;
        this.$rootScope = $rootScope;
        this.moment = moment;
        this.$timeout = $timeout;
        this.CalUtil = calUtil;
        this.Util = Util;
        this.Idle = Idle;
        this.portalDataService = portalDataService;
    }

    $onDestroy() {
        this.$log.debug("app dismissed");
        this.$log.debugEnabled(false);
    }

    $onInit() {
        console.log("initializing App...");
        var self=this;
        
        this.data = {};
        this.userdta = {};

        var studentpick = {};

        this.header = {
            layout_menu: '',
            layout_topbar: '',
            animation: '',
            header_topbar: 'static',
            boxed: ''
        };
        this.notifylist = [];

        this.isok;
        this.forUser = "ALL";
        this.myuser;
        this.forUsers = {
            "userlist": [
                { "user": "ALL" },
                { "user": "MINE" }
            ]
        };
        this.thisTasknamelist = [];
        this.instructorlist = [];
        this.testtypelist = [];
        this.message ={};
        this.loading = false;
        this.loadAttempted = false;
        this.neweventid;
        this.eventStartd;
        this.eventStart;
        this.eventStarttz;
        this.eventEnd;
        this.eventStart;
        this.eventEnd;
        this.eventEndtz;
        this.reminderCheckbox;
        this.eventid;
        this.eventTitle;

        this.studentstats;
        this.studentstatsdetails;
        this.listOfTimes = [];
        this.myj = {};
        this.reminderInterval;

        this.thisUserlist = {};
        this.userpick;
        this.classList = {};
        this.classpick;

        this.typepick;
        this.eventtypeOptions = ['event', 'ClassSchedule', 'movie']; //plus testtypes

        this.agerangelist = {};
        this.agerpick = '';

        this.initTime = moment();
        this.checktime;
        this.checktimestr;



        //    this.mycolor = Math.random() * 0xFFFFFF;
        this.mycolor = '#' + Math.floor(Math.random() * 16777215).toString(16);


        this.studentpick2 = {};
        this.events = [];
        this.colorlist = ['maroon', 'red', 'orange', 'yellow', 'olive', 'purple', 'fuchsia', 'lime', 'green', 'navy', 'blue', 'aqua', 'teal', 'silver', 'black'];
        this.colorlisthex = ['#fff', '#000', '#000', '#000', '#fff', '#fff', '#000', '#000', '#fff', '#fff', '#fff', '#000', '#000', '#fff', '#fff'];


        this.disable = undefined;

        this.refreshstudentlist = [];

        this.reminderOptions = ['15 min', '1 hour', '1 day'];

        this.status = {
            opened: false
        };
        this.conversiondate = '';
        this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
        this.bdateformat = this.formats[4];
        this.open = true;
        this.close = false;



        this.adialog;
        this.eventDrag;

        /*        $scope.data = {};
                $scope.header = {
                    layout_menu: '',
                    layout_topbar: '',
                    animation: '',
                    header_topbar: 'static',
                    boxed: ''
                };
        */
        this.portalDataService.Portlet('app.controller.js');


        this.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            var vm = event.currentScope.$ctrl;
            vm.$log.debugEnabled(true);
            vm.$log.debug('routechange in app for success');
            vm.islogin();

            vm.header.animation = 'fadeInUp';
            setTimeout(function() {
                vm.header.animation = '';
            }, 100);

            vm.data = vm.portalDataService.get(current.originalPath);
            vm.$log.debug('data in $routeChangeSuccess', vm.data);

            if (-1 == $.inArray(current.originalPath, ['/page-lock-screen', '/page-signup', '/page-signin', '/reset-pwd', '/change-pwd', '/forget-pwd'])) {
                vm.activate();

                $("body>.default-page").show();
                $("body>.extra-page").hide();
            }
            else {
                window.scrollTo(0, 0);
            }
            vm.header.boxed = '';
            vm.header.layout_topbar = '';
            vm.header.layout_menu = '';
            vm.header.header_topbar = '';
/*
            if ('/layout-left-sidebar' === current.originalPath) {
                vm.$log.debug("left sidebar entered");
                vm.header.boxed = '';
                vm.header.layout_topbar = '';
                vm.header.layout_menu = '';
                vm.header.header_topbar = '';
                $('#wrapper').removeClass('right-sidebar');
                $('body').removeClass('left-side-collapsed');
                $('body').removeClass('layout-boxed');
                $('body > .default-page').removeClass('container');
                $('#topbar .navbar-header').removeClass('logo-collapsed');
                $('body').addClass('sidebar-fixed');
                $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                    "height": $(window).height() - 50,
                    'width': '250px',
                    'wheelStep': 5
                });
                $('body').removeClass('right-side-collapsed');
                $('body').removeClass('container');
            }

            else if ('/' === current.originalPath) {
*/            
            if ('/' === current.originalPath) {
                vm.$log.debug("/ path entered");
                $('body').removeAttr('id'); // error 404, 500
            }
            else {
                vm.$log.debug("else path entered");
                vm.header.boxed = '';
                vm.header.layout_topbar = '';
                vm.header.layout_menu = '';
                vm.header.header_topbar = '';
//                $('#wrapper').removeClass('right-sidebar');
//                $('body').removeClass('left-side-collapsed');
//                $('body').removeClass('right-side-collapsed');
//                $('body').removeClass('layout-boxed');
                $('body #page-wrapper').removeClass('animated');
                $('body > .default-page').removeClass('container');
                $('#topbar .navbar-header').removeClass('logo-collapsed');
                $('body').addClass('sidebar-fixed');
                $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                    "height": $(window).height() - 50,
                    'width': '250px',
                    'wheelStep': 5
                });
            }

            var mydelay = vm.CalendarServices.getIntervalValue();
            vm.$interval(vm.intervalChecker(),mydelay * 1000);

            vm.$log.debug('exit app controller routechangesucess');


        });
        this.$scope.$on('$routeChangeError', function(event, current, previous) {
            var vm = event.currentScope.$ctrl;
            vm.$log.debug('routechange in app for error');
            vm.$log.debug('originalPath');
            vm.$log.debug(current.originalPath);
        });

        $(document).ready(function() {

            $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
                // Avoid following the href location when clicking
                event.preventDefault();
                // Avoid having the menu to close when clicking
                event.stopPropagation();
                // Re-add .open to parent sub-menu item
                $(this).parent().siblings().removeClass('open');
                $(this).parent().toggleClass('open');
            });

            $('#external-events div.external-event').each(function() {

                self.CalUtil.EventDrag($(this));
                self.$log.debug('external-events after drag', $(this));

            });
            $('#todos-list-sort > li > label.external-event').each(function() {

                self.CalUtil.EventDrag($(this));
                self.$log.debug('todos external-events after drag', $(this));

            });

            $('#calendar').fullCalendar('destroy');
            self.getEventList(self.forUser).then(function() {
                self.$log.debug("refetch", self.events);
                self.initCalendar();
            }).catch(function(e) {
                self.$log.debug("resetCalendar error in activate", e);
            });

        });
        this.islogin();
    }

    intervalChecker() {
        this.$log.debug('appc intervalChecker entered');
        var myoknotify = this.CalendarServices.getOkNotify();
        this.notifylist = this.CalendarServices.getNotifyList(myoknotify);

    }


    conversiondateopen($event) {
        this.status.opened = true;
    }

    openSchedule() {
        //$.fn.Data.slideDown();
        this.portalDataService.slideDown();
        this.open = false;
        this.close = true;
    }

    closeSchedule() {
    //    $.fn.Data.slideDown();
        this.portalDataService.slideDown();
        this.open = true;
        this.close = false;
    }

    activate() {
        var self=this;
        this.$log.debug('app-controller.js activate entered');
        this.textcolor = this.CalUtil.getColorByBgColor(this.mycolor); // Set to complement of textColor.

        this.CalUtil.calActivate();

        $("#eventPickDiv").button().on("click", function() {
            var somevlu = $("#eventpick").val();
            self.$log.debug("click pick is", somevlu, self.studentpick2, self.studentpick, $("#studentpick").val());
            self.studentpick2 = self.studentpick;
            self.adialog.dialog("open");
        });

        this.adialog = this.CalUtil.aDialog(this);
        this.eventDrag = this.CalUtil.EventDrag();

        self.getUserDetails().then(function() {
            self.$log.debug('activate getUserDetails returned', self.userdta);
//            self.islogin();

            self.todos();
            self.gettheTasknamelist();

            //                $(document).ready(function() {
            $("select[name='forUser']").unbind('change').bind('change', function() {
                var u = $(this).val();
                self.$log.debug("reset cal", self.forUser, u);
                self.forUser = u;
                //        $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('destroy');
                self.getEventList(self.forUser).then(function() {
                    self.$log.debug("refetch", self.events);
                    //            $('#calendar').fullCalendar( 'refetchEventSources', this.events );
                    self.initCalendar();
                }).catch(function(e) {
                    self.$log.debug("resetCalendar error in activate", e);
                });

            });
            self.getInstructorList().then(function() {
                self.$log.debug("returned from getInstructorList");
            });
            self.getAgeRangeList().then(function() {
                self.$log.debug("returned from getAgeRangeList");
            });
            self.getTestTypes().then(function() {
                self.$log.debug("returned from getTesttypes");
            });

            //                });

            //works but is annoying
            self.getEventList('ALL').then(function() {
                self.initCalendar();
                //do first one right away, then wait an interval
                self.okNotify = self.CalendarServices.getOkNotify();
                self.notifylist = self.CalendarServices.getNotifyList(self.okNotify);
                self.intervalChecker();
            }).catch(function(e) {
                self.$log.debug("getEventList error in activate", e);
            });

        });

    }

    getAgeRangeList() {
        var self=this;
        var path = "../v1/ageranges";
        return self.CalendarServices.getAgeRangeList(path).then(function(data) {
            self.$log.debug('getAgeRangeList returned data');
            self.$log.debug(data.agerangelist);
            self.agerangelist = data.agerangelist;

            return self.agerangelist;
        });
    }

    schedToCal() {
        var self=this;
        self.$log.debug('schedToCal entered');
        var thedata = {
            'calendarscheduleDate': this.ConversionDate
        };
        var path = "../v1/calendarschedule";
        return self.CalendarServices.schedToCal(path, thedata).then(function(data) {
                self.$log.debug("service schedToCal returned:", data);
                $('#calendar').fullCalendar('destroy');
                self.getEventList(this.forUser).then(function() {
                    self.$log.debug("refetch", this.events);
                    self.initCalendar();
                }).catch(function(e) {
                    self.$log.debug("resetCalendar error in activate", e);
                });

                return;
            },

            function(error) {
                self.$log.debug('Caught an error schedToCal, going to notify:', error);
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {});

    }

    clearCal() {
        var self=this;
        self.$log.debug('clearCal entered');
        var path = "../v1/calendarschedule";
        return self.CalendarServices.clearCal(path).then(function(data) {
                self.$log.debug("service clearCal returned:", data);
                $('#calendar').fullCalendar('destroy');
                self.getEventList(self.forUser).then(function() {
                    self.$log.debug("refetch", self.events);
                    self.initCalendar();
                }).catch(function(e) {
                    self.$log.debug("resetCalendar error in activate", e);
                });

                return;
            },

            function(error) {
                self.$log.debug('Caught an error clearCal, going to notify:', error);
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {});

    }

    transferCal() {
        var self=this;
        self.$log.debug('transferCal entered');
        var thedata = {
            'calendarscheduleDate': self.ConversionDate
        };
        var path = "../v1/schedulecalendar";
        return self.CalendarServices.transferCal(path, thedata).then(function(data) {
                self.$log.debug("service transferCal returned:", data);
                $('#calendar').fullCalendar('destroy');
                self.getEventList(self.forUser).then(function() {
                    self.$log.debug("refetch", self.events);
                    self.initCalendar();
                }).catch(function(e) {
                    self.$log.debug("transferCal error in activate", e);
                });

                return;
            },

            function(error) {
                self.$log.debug('Caught an error transferCal, going to notify:', error);
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {});

    }

    popinit() {
        this.$log.debug("popinit entered");
        this.thisevent = this.CalendarServices.getCurrentEvent();

    }

    eventopen(calEvent) {
        this.CalUtil.eventopen(calEvent, this.studentpick, this, this.CalendarServices);
    }

    displayTime() {
        return this.CalendarServices.displaytime();
    }

    setstudent(mystudent) {
        this.$log.debug("set vm student", mystudent, this.studentpick);
        if (mystudent.ID === "NULL") {
            this.studentpick = { ID: "NULL", FirstName: "Not picked", LastName: "yet", FullName: "Not picked yet" };
        }
        else {
            this.studentpick = mystudent;
        }
    }

    setStudentFromPick(item) {
        this.$log.debug("setstudentfrompick", item);
        $("#eventpick").val(item.FullName);
        this.studentpick = item;
        $("#studentpick").val(item);
    }



    calsave(screen, title, startd, start, end, reminderCheckbox, reminderInterval,
        userpick, updateflag, theevent, contactid, eventid, eventclass, color, textcolor, eventtype,
        eventpick, typepick, agerpick, classpick) {
        this.$log.debug('save cal',
            screen,
            title,
            startd,
            start,
            end,
            reminderCheckbox,
            reminderInterval,
            userpick,
            updateflag,
            theevent,
            contactid,
            eventid,
            eventclass,
            color,
            textcolor, eventtype,
            eventpick, typepick, agerpick, classpick);
        var reminderCheck;
        if (reminderCheckbox === undefined) {
            reminderCheck = 0;
        }
        else if (reminderCheckbox === 1) {
            reminderCheck = 1;
        }
        else if (reminderCheckbox === 0) {
            reminderCheck = 0;
        }
        else {
            reminderCheck = reminderCheckbox[0].checked ? 1 : 0;
        }
        this.$log.debug('check reminderCheck', reminderCheck, $('input#reminderCheckbox:checked'));

        var eventData;
        this.$log.debug('isTitle', title);
        if (updateflag && theevent !== null) {
            theevent.title = title;
            theevent.startd = moment(startd, 'MM/DD/YYYY').tz('America/New_York').format('MM/DD/YYYY');
            this.$log.debug('theevent startd set', theevent.startd);
            //add the time to the date
            var tststr = startd + ' ' + start.toString();
            this.$log.debug('theevent start and startd combine', start, tststr);
            var tstd = moment(tststr, 'MM/DD/YYYY hh:mm A z');
            theevent.start = tstd;
            this.$log.debug('theevent start set', tststr, tstd, theevent.start);
            tststr = startd + ' ' + end.toString();
            tstd = moment(tststr, 'MM/DD/YYYY hh:mm A z');
            theevent.end = tstd;
            this.$log.debug('theevent end set', tststr, tstd, theevent.end);

            theevent.reminderInterval = reminderInterval;
            theevent.userpick = userpick;
            theevent.reminderCheckbox = reminderCheck;
            theevent.className = eventclass;
            theevent.color = color;
            theevent.textcolor = textcolor;
            theevent.eventtype = eventtype;
            theevent.contactid = contactid;
            theevent.eventid = eventid;
            theevent.eventpick = eventpick;
            theevent.typepick = typepick;
            theevent.agerpick = agerpick;
            theevent.classpick = classpick;
            this.saveCalendarEvent(theevent);

            $('#calendar').fullCalendar('updateEvent', theevent);
        }

        if (updateflag !== true && title) {
            this.$log.debug("updateflag not true", startd, start, end, eventid, contactid);
            eventData = {
                title: title.val(),
                startd: startd,
                start: start,
                end: end,
                reminderInterval: reminderInterval.val(),
                //                userpick: "number:" + userpick.val(),
                userpick: userpick.val(),
                reminderCheckbox: reminderCheckbox.val(),
                className: eventclass.val(),
                color: color.val(),
                textcolor: textcolor.val(),
                eventtype: eventtype.val(),
                eventid: eventid.val(),
                contactid: contactid.val(),
                eventpick: eventpick.val(),
                typepick: typepick.val(),
                agerpick: agerpick.val(),
                classpick: classpick.val()
            };
            this.$log.debug('isTitle yes', eventData);
            $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
        }



    }

    saveCalendarEvent(theEvent) {
        var self=this;
        var updpath = "../v1/saveCalendarEvent";
        self.$log.debug('about saveCalendarEvent ', theEvent, updpath);
        var rep = (typeof(theEvent.userpick) !== 'undefined' && theEvent.userpick !== "") ? theEvent.userpick.toString().replace("number:", "") : this.myuser;

        var thedata = {
            title: theEvent.title,
            id: theEvent.id,
            startd: theEvent.startd,
            start: theEvent.start,
            end: theEvent.end,
            contactid: theEvent.contactid,
            reminder: theEvent.reminderCheckbox,
            reminderInterval: theEvent.reminderInterval,
            userpick: rep,
            color: theEvent.backgroundColor,
            textcolor: theEvent.textColor,
            eventtype: theEvent.eventtype,
            classname: theEvent.className,
            eventpick: theEvent.eventpick,
            typepick: theEvent.typepick,
            agerpick: theEvent.agerpick,
            classpick: theEvent.classpick

        };


        self.$log.debug('about saveCalendarEvent data', thedata);
        return self.CalendarServices.saveCalendarEvent(updpath, thedata)
            .then(function(data) {
                self.$log.debug('saveCalendarEvent returned data');
                self.$log.debug(data);
                self.neweventid = data.new_eventid;
                self.$log.debug('saveCalendarEvent newevent', self.neweventid);
                self.events = data.events;
                self.$log.debug(self.events);
                self.$log.debug(data.message);
                self.message = data.message;
                self.getEventList(self.forUser).then(function(zdata) {
                       self.$log.debug('saveCalendarEvent getEventList returned', zdata);
                    },
                    function(error) {
                        self.$log.debug('Caught an error saveCalendarEvent getEventList after update:', error);
                        self.events = [];
                        self.message = error;
                        self.Notification.error({ message: error, delay: 5000 });
                        return (self.$q.reject(error));
                    });

                return self.events;
            }).catch(function(e) {
                self.$log.debug('saveCalendarEvent failure:');
                self.$log.debug("error", e);
                self.message = e;
                self.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    updateTasknamelist(taskname, taskstatus) {
        var self=this;
        var updpath = "../v1/updatetasknamelist";
        var thedata = {
            taskname: taskname,
            taskstatus: taskstatus
        };
        self.$log.debug('about updateTasknamelist ', thedata, updpath);
        return self.CalendarServices.updateTasknamelist(updpath, thedata)
            .then(function(data) {
                self.$log.debug('updateTasknamelist returned data');
                self.$log.debug(data);
                self.thisTasknamelist = data;
                self.$log.debug(self.thisTasknamelist);
                self.$log.debug(self.thisTasknamelist.message);
                self.message = self.thisTasknamelist.message;
                self.gettheTasknamelist().then(function(zdata) {
                        self.$log.debug('gettheTasknamelist returned', zdata);
                    },
                    function(error) {
                        self.$log.debug('Caught an error gettheTasknamelist after update:', error);
                        self.tasknamelist = [];
                        self.message = error;
                        self.Notification.error({ message: error, delay: 5000 });
                        return (self.$q.reject(error));
                    });

                return self.thisTasknamelist;
            }).catch(function(e) {
                self.$log.debug('updateTasknamelist failure:');
                self.$log.debug("error", e);
                self.message = e;
                self.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    removeTasknamelist(taskname) {
        var self=this;
        var updpath = "../v1/removetasknamelist";
        var thedata = {
            taskname: taskname
        };
        self.$log.debug('about removeTasknamelist ', thedata, updpath);
        return self.CalendarServices.removeTasknamelist(updpath, thedata)
            .then(function(data) {
                self.$log.debug('removeTasknamelist returned data');
                self.$log.debug(data);
                //                this.thisTasknamelist = data;
                self.$log.debug(data);
                self.message = data.message;
                self.gettheTasknamelist().then(function(zdata) {
                        self.$log.debug('gettheTasknamelist returned', zdata);
                    },
                    function(error) {
                        self.$log.debug('Caught an error gettheTasknamelist after update:', error);
                        self.tasknamelist = [];
                        self.message = error;
                        self.Notification.error({ message: error, delay: 5000 });
                        return (self.$q.reject(error));
                    });

                return self.thisTasknamelist;
            }).catch(function(e) {
                self.$log.debug('removeTasknamelist failure:');
                self.$log.debug("error", e);
                self.message = e;
                self.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getStudent(path) {
        var self=this;
        return self.StudentServices.getStudent(path).then(function(data) {
            self.$log.debug('getStudent returned data');
            self.$log.debug(data);
            return data;
        }, function(error) {
            self.$log.debug('getStudent', error);
            self.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }


    removeCalendarEvent(eventid) {
        var self=this;
        var updpath = "../v1/removeCalendarEvent";
        var thedata = {
            eventid: eventid
        };
        self.$log.debug('about removeCalendarEvent ', thedata, updpath);
        return self.CalendarServices.removeCalendarEvent(updpath, thedata)
            .then(function(data) {
                self.$log.debug('removeCalendarEvent returned data');
                self.$log.debug(data);
                //                this.thisTasknamelist = data;
                self.$log.debug(data);
                self.message = data.message;
                self.getEventList(self.forUser).then(function(zdata) {
                        self.$log.debug('removeCalendarEvent getEventList returned', zdata);

                    },
                    function(error) {
                        self.$log.debug('Caught an error removeCalendarEvent getEventList:', error);
                        self.tasknamelist = [];
                        self.message = error;
                        self.Notification.error({ message: error, delay: 5000 });
                        return (self.$q.reject(error));
                    });

                return self.events;
            }).catch(function(e) {
                self.$log.debug('removeCalendarEvent  failure:');
                self.$log.debug("error", e);
                self.message = e;
                self.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getUserDetails() {
        var self=this;
        self.$log.debug('getUserDetails entered');
        return self.UserServices.getUserDetails().then(function(data) {
                self.$log.debug("service getuserdetails returned:", data);
                self.userdta = data;
                self.myuser = data.userid;
                return self.userdta;
            },

            function(error) {
                self.$log.debug('Caught an error getUserDetails, going to notify:', error);
                self.userdta = [];
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.loading = false;
            self.loadAttempted = true;
        });

    }

    getUserList() {
        var self=this;
        self.$log.debug('getUserList entered');
        var refreshpath = "../v1/getuserlist";

        return self.CalendarServices.getUsers(refreshpath).then(function(data) {
                self.$log.debug('getUsers returned data');
                self.$log.debug(data);
                self.thisUserlist = data.users;
                return self.thisUserlist;
            },
            function(error) {
                self.$log.debug('Caught an error getUserList, going to notify:', error);
                self.thisUserlist = [];
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.loading = false;
            self.loadAttempted = true;
        });

    }

    getClassList() {
        var self=this;
        self.$log.debug('getClassList entered');
        var path = '../v1/class';

        return self.ClassServices.getClasses(path).then(function(data) {
            self.$log.debug('getClasses returned data');
            self.$log.debug(data);

            self.classList = data.Classlist;

        }, function(error) {
            self.$log.debug('Caught an error getClassList:', error);
            self.classList = [];
            self.message = error;
            self.Notification.error({ message: error, delay: 5000 });
            return (self.$q.reject(error));

        });
    }

    gettheTasknamelist() {
        var self=this;
        self.$log.debug('gettheTasknamelist entered');
        var refreshpath = "../v1/tasknamelist";

        return self.CalendarServices.gettasknamelist(refreshpath).then(function(data) {
                self.$log.debug('gettasknamelists returned data');
                self.$log.debug(data);
                self.thisTasknamelist = data.tasknamelist;
                return self.thisTasknamelist;
            },
            function(error) {
                self.$log.debug('Caught an error gettheTasknamelist, going to notify:', error);
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

    getInstructorList() {
        var self=this;
        self.$log.debug('getInstructorList entered');
        var refreshpath = "../v1/instructorlist";

        return self.CalendarServices.getinstructorlist(refreshpath).then(function(data) {
                self.$log.debug('getinstructorlist returned data');
                self.$log.debug(data);
                self.instructorlist = data.instructorlist;
                if (typeof data.instructorlist !== 'undefined') {
                    for (var i = 0; i < data.instructorlist.length; i++) {
                        if (i > self.colorlist.length) {
                            self.instructorlist[i].backgroundcolor = self.colorlist[self.colorlist.length];
                            self.instructorlist[i].textcolor = self.colorlisthex[self.colorlist.length];
                        }
                        else {
                            self.instructorlist[i].backgroundcolor = self.colorlist[i];
                            self.instructorlist[i].textcolor = self.colorlisthex[i];
                        }
                    }
                }
                return self.instructorlist;
            },
            function(error) {
                self.$log.debug('Caught an error getinstructorlist, going to notify:', error);
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

    getTestTypes() {
        var self=this;
        self.$log.debug('getTestTypes entered');
        var refreshpath = "../v1/testtypes";

        return self.TestingServices.getTestTypes(refreshpath).then(function(data) {
                self.$log.debug('getTestTypes returned data');
                self.$log.debug(data);
                self.testtypelist = data.testtypelist;
                if (typeof data.testtypelist !== 'undefined') {
                    for (var i = 0; i < data.testtypelist.length; i++) {
                        if (i > self.colorlist.length) {
                            self.testtypelist[i].backgroundcolor = self.colorlist[self.colorlist.length];
                            self.testtypelist[i].textcolor = self.colorlisthex[self.colorlist.length];
                        }
                        else {
                            self.testtypelist[i].backgroundcolor = self.colorlist[i];
                            self.testtypelist[i].textcolor = self.colorlisthex[i];
                        }
                        self.eventtypeOptions.push(self.testtypelist[i].testdescription);
                    }
                }
                return self.testtypelist;
            },
            function(error) {
                self.$log.debug('Caught an error getTestTypes, going to notify:', error);
                self.testtypelist = [];
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.loading = false;
            self.loadAttempted = true;
        });

    }

    getEventList(qparm) {
        var self=this;
        //                var qparm =  typeof(this.forUser) !== 'undefined' ? this.forUser : 'ALL' ;
        var refreshpath = "../v1/getEventList?username=" + qparm;
        self.$log.debug('getEventList entered', qparm, refreshpath);

        return self.CalendarServices.getCalendarEvents(refreshpath).then(function(data) {
                self.$log.debug('getCalendarEvents returned data');
                self.$log.debug(data, typeof(data.events));
                if (typeof(data.events) !== "undefined") {
                    for (var i = 0; i < data.events.length; i++) {
                     //   self.$log.debug('reformat dates', data.events[i]);
                        /*      var atimetoadd = {
                                  "title": data.events[i].title,
                                  "time": data.events[i].start,
                                  "theevent": data.events[i],
                                  "id": data.events[i].id
                              };
                          */
                        data.events[i].end = new Date(self.Util.convertToMoment(data.events[i].end));
                        data.events[i].start = new Date(self.Util.convertToMoment(data.events[i].start));
                        data.events[i].startd = moment(data.events[i].startd, 'YYYY-MM-DD');

                        //        addListOfTimes(atimetoadd);

                    }

                    self.events = data.events;
                }
                else {
                    self.events = {};
                }
                //temp for testing
                // Array.prototype.push.apply(this.events, getEventListold());
                self.$log.debug(self.events);
                self.CalendarServices.setNotifyList(self.events);

                $('#calendar').fullCalendar('renderEvents', self.events, true);

                return self.events;
            },
            function(error) {
                self.$log.debug('Caught an error getEventList, going to notify:', error);
                self.events = [];
                self.message = error;
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.loading = false;
            self.loadAttempted = true;
        });
    }

    islogin() {
        var self=this;

        self.$log.debug('app controller islogin');
        self.isok = self.UserServices.isapikey();

        if (self.isok) {
            self.$log.debug('setting apikey for services');
            var thekey = self.UserServices.getapikey();
        //    self.CalendarServices.setapikey(thekey);
        //    self.TestingServices.setapikey(thekey);
        //    self.EventServices.setapikey(thekey);
        //    self.TemplateServices.setapikey(thekey);
        //    self.StudentServices.setapikey(thekey);
        //    self.PaymentServices.setapikey(thekey);
        //    self.ClassServices.setapikey(thekey);
            self.UserServices.setapikey(thekey);
        //    self.StatsServices.setapikey(thekey);
//            this.filterstat = self.filterstat;

            var getdatestr = 'startdate';

            self.$q.all([
                    self.getUserList().then(function() {
                        self.$log.debug('getUserList returned');
                    }),
                    self.getClassList().then(function() {
                        self.$log.debug('getClassList returned');
                    }),
                    self.getStudentStatsMonths(getdatestr).then(function() {
                        self.$log.debug('getStudentStatsMonths returned');
                    }),
                    self.getStudentStats(getdatestr).then(function() {
                        self.$log.debug('getStudentStats returned');
                    })
                ])
                .then(function() {
                    self.$log.debug('getAll stats done returned');
                    self.activate();
                });


        }

    }

    filterstat(val) {
        var pass = false;
        pass = (val.category === 'Inactive' &&
            val.type === 'ContactType' &&
            val.datetype === 'inactivedate' &&
            val.summaryvalue < 0);
        //        $log.debug('filterstat',val,pass);

        return (pass);
    }


    // initialize the calendar
    // -----------------------------------------------------------------
    initCalendar() {
        this.CalUtil.initCalendar(this, this.forUser);
    }

    settextcolor() {
        this.textcolor = this.CalUtil.getColorByBgColor(this.mycolor);
        //      this.textcolor = 0xFFFFFF ^ this.mycolor;
        this.$log.debug('settextcolor', this.mycolor, this.textcolor);
    }



    getYType(index) {
        switch (index) {
            case 0:
                return 'Student';
            case 1:
                return 'BlackBelt';
            case 2:
                return 'Net';
            case 3:
                return 'Break';
            case 4:
                return 'Injured';
            default:
                return '';
        }

    }

    getYStatus(index) {
        switch (index) {
            case 0:
                return 'Active';
            case 1:
                return 'Active';
            case 2:
                return 'Net';
            case 3:
                return 'NotActive';
            case 4:
                return 'NotActive';
            default:
                return '';
        }

    }

    categoryGetStatus(category) {
        switch (category) {
            case 'BlackBelt':
                return 'Active';
            case 'Student':
                return 'Active';
            default:
                //matching Injured, Break
                return 'Inactive';
        }

    }

    todos() {
        var self=this;
        setTimeout(function() {
            //BEGIN TODOS LIST
            $("#todos-list-sort").sortable();
            $("#todos-list-sort").disableSelection();


            $('#todos-list-add').click(function() {
                self.updateTasknamelist($("#todos-list-input").val(), '0');
                $("[data-hover='tooltip']").tooltip();
                return false;
            });

        });
    }

    gety(x, seriesIndex) {
        this.$log.debug('gety:', x, seriesIndex);
        var retvl = [];
        if (this.getYType(seriesIndex) !== 'Net') {
            var d2_1a = this.contentForGraph(this.studentstats,
                'month',
                'summaryvalue',
                'ContactType',
                this.getYType(seriesIndex),
                this.getYStatus(seriesIndex)
            );
            this.$log.debug('gety d2_1a', d2_1a, x);
            for (var iter = 0, len = d2_1a.length; iter < len; iter++) {
                for (var diter = 0, dlen = d2_1a[iter].length; diter < dlen; diter++) {
                    if (d2_1a[iter][diter].month === x) {
                        this.$log.debug('d2_1a content', d2_1a[iter][diter].details);
                        var dta = {
                            "item": {
                                "firstname": d2_1a[iter][diter].details.firstname,
                                "lastname": d2_1a[iter][diter].details.lastname,
                                "contactid": d2_1a[iter][diter].details.contactid,
                                "fulldate": d2_1a[iter][diter].details.fulldate
                            }
                        };
                        retvl.push(dta);
                    }
                }
            }
        }
        else {
            retvl = 'no text';
        }
        this.$log.debug('gety x', JSON.stringify(retvl));
        return (JSON.stringify(retvl));
    }

    genGraph() {
        var self=this;
        //      $log.debug('genGraph entered');
        setTimeout(function() {
            var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');

            try {

                //BEGIN LINE CHART SPLINE
                //var d2_1 = [["Jan", 181],["Feb", 184],["Mar", 189],["Apr", 180],["May", 190],["Jun", 183],["Jul", 185],["Aug", 188],["Sep", 202]];

                var d2_1 = self.datToGraph(self.studentstats, 'month', 'summaryvalue', 'ContactType', self.getYType(0));
                //        $log.debug('d2_1', d2_1);
                var d2_2 = self.datToGraph(self.studentstats, 'month', 'summaryvalue', 'ContactType', self.getYType(1));
                //        $log.debug('d2_2', d2_2);
                var d2_3 = self.datToGraph(self.studentstats, 'month', 'summaryvalue', 'ContactType', self.getYType(3));
                //        $log.debug('d2_3', d2_3);
                var d2_4 = self.datToGraph(self.studentstats, 'month', 'summaryvalue', 'ContactType', self.getYType(4));
                //        $log.debug('d2_4', d2_4);

                //        var d2_2 = [["Jan", -32],["Feb", -22],["Mar", -13],["Apr", -24],["May", -16],["Jun", -27],["Jul", -15],["Aug", -31],["Sep", -14]];
                //       var d2_3 = [["Jan", -16],["Feb", -34],["Mar", -12],["Apr", -35],["May", -15],["Jun", 0],["Jul", 0],["Aug", -15],["Sep", -16]];

                // Add a SumArray method to all arrays by expanding the Array prototype(do this once in a general place)
                Object.defineProperty(Array.prototype, "SumArray", {
                    configurable: true,
                    value: function(arr) {
                        //Array.prototype.SumArray = function(arr) {
                        //    $log.debug('sum:',arr,this);
                        var sum = [];
                        var sumx, sumy;
                        if (arr !== null && this.length === arr.length) {
                            for (var i = 0; i < arr.length; i++) {
                                sumy = parseFloat(this[i][1]) + parseFloat(arr[i][1]);
                                sumx = this[i][0];
                                sum.push([sumx, sumy]);
                            }
                            return sum;
                        }
                        else {
                            //          $log.debug('sum: nothing to add');
                            return this;
                        }

                    }
                });



                var d2_sum = d2_1.SumArray(d2_2).SumArray(d2_3).SumArray(d2_4);
                //   $log.debug('sumarr',d2_sum); // [6,8,10,12]

                $.plot("#line-chart-spline", [{
                    data: d2_1,
                    label: "Student",
                    color: "#2ecc71"
                }, {
                    data: d2_2,
                    label: "BlackBelt",
                    color: "#3498db"
                }, {
                    data: d2_sum,
                    label: "Net",
                    color: "#aaaadd"
                }, {
                    data: d2_3,
                    label: "Break",
                    color: "#e74c3c"
                }, {
                    data: d2_4,
                    label: "Injured",
                    color: "#ffce54"
                }], {
                    series: {
                        lines: {
                            show: !1
                        },
                        splines: {
                            show: !0,
                            tension: 0.4,
                            lineWidth: 2,
                            fill: 0
                        },
                        points: {
                            show: !0,
                            radius: 4
                        }
                    },
                    grid: {
                        borderColor: "#ffffff",
                        borderWidth: 1,
                        hoverable: !0
                    },
                    tooltip: !0,
                    tooltipOpts: {
                        content: function(label, xval, yval, flotItem) {
                            //  $log.debug('flot %j',flotItem);
                            var xy = JSON.parse(self.gety(xval, flotItem.seriesIndex));
                            self.$log.debug('xy', xy, xval, yval, self.getYType(flotItem.seriesIndex));
                            //               return 'new students:<br/> <json-formatter json="'+ gety(xval,flotItem.seriesIndex) + 
                            //               '" open="1"></json-formatter> <br/> for:' + yval;
                            var xx = '';
                            if (xy !== 'no text') {
                                for (var iter = 0, len = xy.length; iter < len; iter++) {
                                    //$log.debug('each', xy[iter].item.firstname);
                                    xx = xx + '<div class="row col-md-12"> name:' +
                                        xy[iter].item.firstname + ' ' +
                                        xy[iter].item.lastname + ' ' +
                                        '<br/> id: ' +
                                        xy[iter].item.contactid + ' on: ' +
                                        xy[iter].item.fulldate +
                                        '</div>';
                                }
                            }
                            self.$log.debug('xx', xx);
                            //               return 'new students: ' + xx + ' for:' + yval;
                            xx += 'Count:' + yval;
                            return xx;
                        },
                        shifts: {
                            x: -30,
                            y: -50
                        },
                        defaultTheme: false
                    },
                    xaxis: {
                        tickColor: "#fafafa",
                        mode: "categories"
                    },
                    yaxis: {
                        tickColor: "#fafafa"
                    },
                    shadowSize: 0,
                    legend: {
                        backgroundOpacity: 0.5,
                        noColumns: 5,
                        container: '#line-chart-spline-legend',
                        labelBoxBorderColor: "white",
                        position: "ne"
                    }
                });
                //END LINE CHART SPLINE

                //BEGIN CHART TRAFFIC SOURCES
                var d6_1 = [39];
                var d6_2 = [41];
                var d6_3 = [20];
                /*                    $.plot('#traffice-sources-chart', [{
                                            data: d6_1,
                                            label: "Ages 4-7",
                                            color: "#e74c3c"
                                        },
                                        {
                                            data: d6_2,
                                            label: "Ages 8-12",
                                            color: "#2ecc71"
                                        },
                                        {
                                            data: d6_3,
                                            label: "Ages 13-17",
                                            color: "#3498db"
                                        }
                                    ], {
                                        series: {
                                            pie: {
                                                show: true
                                            }
                                        },
                                        grid: {
                                            hoverable: true,
                                            clickable: true
                                        }
                                    });
                */
                //END CHART TRAFFIC SOURCES

                //BEGIN CHART NEW CUSTOMER
                var d7 = [
                    ["Jan", 200],
                    ["Feb", 178],
                    ["Mar", 130],
                    ["Apr", 150],
                    ["May", 220],
                    ["Jun", 320]
                ];
                /*                    $.plot("#new-customer-chart", [{
                                        data: d7,
                                        color: "#01b6ad"
                                    }], {
                                        series: {
                                            bars: {
                                                align: "center",
                                                lineWidth: 0,
                                                show: !0,
                                                barWidth: 0.6,
                                                fill: 0.9
                                            }
                                        },
                                        grid: {
                                            borderColor: "#fafafa",
                                            borderWidth: 1,
                                            hoverable: !0
                                        },
                                        tooltip: !0,
                                        tooltipOpts: {
                                            content: "%x : %y",
                                            defaultTheme: false
                                        },
                                        xaxis: {
                                            tickColor: "#fafafa",
                                            mode: "categories"
                                        },
                                        yaxis: {
                                            tickColor: "#fafafa"
                                        },
                                        shadowSize: 0
                                    });
                */
                //END CHART NEW CUSTOMER

                //BEGIN CHART DOWNLOAD UPLOAD
                var d8_1 = [
                    ["Jan", 80],
                    ["Feb", 76],
                    ["Mar", 110],
                    ["Apr", 90],
                    ["May", 123],
                    ["Jun", 150],
                    ["Jul", 170]
                ];
                var d8_2 = [
                    ["Jan", 70],
                    ["Feb", 49],
                    ["Mar", 70],
                    ["Apr", 60],
                    ["May", 86],
                    ["Jun", 100],
                    ["Jul", 150]
                ];
                /*                    $.plot("#internet-speed-chart", [{
                                        data: d8_1,
                                        label: "Adults",
                                        color: "#c0392b"
                                    }, {
                                        data: d8_2,
                                        label: "Children",
                                        color: "#2ecc71"
                                    }], {
                                        series: {
                                            lines: {
                                                show: !1
                                            },
                                            splines: {
                                                show: !0,
                                                tension: 0.4,
                                                lineWidth: 2,
                                                fill: 0.8
                                            },
                                            points: {
                                                show: !0,
                                                radius: 4
                                            }
                                        },
                                        grid: {
                                            borderColor: "#fafafa",
                                            borderWidth: 1,
                                            hoverable: !0
                                        },
                                        tooltip: !0,
                                        tooltipOpts: {
                                            content: "%x : %y",
                                            defaultTheme: false
                                        },
                                        xaxis: {
                                            tickColor: "#fafafa",
                                            mode: "categories"
                                        },
                                        yaxis: {
                                            tickColor: "#fafafa"
                                        },
                                        shadowSize: 0
                                    });
                */
                //END CHART DOWNLOAD UPLOAD



                //BEGIN AREA CHART SPLINE
                var d9_1 = [
                    ["Jan", 67],
                    ["Feb", 91],
                    ["Mar", 36],
                    ["Apr", 150],
                    ["May", 28],
                    ["Jun", 123],
                    ["Jul", 38]
                ];
                var d9_2 = [
                    ["Jan", 59],
                    ["Feb", 49],
                    ["Mar", 45],
                    ["Apr", 94],
                    ["May", 76],
                    ["Jun", 22],
                    ["Jul", 31]
                ];
                /*                    $.plot("#area-chart-spline-db", [{
                                        data: d9_1,
                                        label: "Adults",
                                        color: "#ffce54"
                                    }, {
                                        data: d9_2,
                                        label: "Children",
                                        color: "#B33F93"
                                    }], {
                                        series: {
                                            lines: {
                                                show: !1
                                            },
                                            splines: {
                                                show: !0,
                                                tension: 0.4,
                                                lineWidth: 2,
                                                fill: 0.8
                                            },
                                            points: {
                                                show: !0,
                                                radius: 4
                                            }
                                        },
                                        grid: {
                                            borderColor: "#fafafa",
                                            borderWidth: 1,
                                            hoverable: !0
                                        },
                                        tooltip: !0,
                                        tooltipOpts: {
                                            content: "%x : %y",
                                            defaultTheme: true
                                        },
                                        xaxis: {
                                            tickColor: "#fafafa",
                                            mode: "categories"
                                        },
                                        yaxis: {
                                            tickColor: "#fafafa"
                                        },
                                        shadowSize: 0
                                    });
                */
                //END AREA CHART SPLINE

                //BEGIN CALENDAR
                /*                    $("#my-calendar").zabuto_calendar({
                                        language: "en"
                                    });
                */
            }
            catch (e) {
                self.$log.debug(e.message, "from", e.stack);
                // You can send data to your server
                // sendError(data);
                //throw e;
            }


            //END CALENDAR
        }, 500);

    }

    datToGraph(data, x, y, type, category) {
        //      $log.debug('datToGraph:',data, x,y,type,category);
        var res = [];

        for (var iter = 0, len = data.length; iter < len; iter++) {
            var d = [];
            d[0] = data[iter][x];
            d[1] = data[iter][y];

            if (data[iter].type === type &&
                data[iter].category === category) {
                //          $log.debug('datIf found:',d,data[iter].type,data[iter].category);
                res.push(d);
            }
        }
        //       $log.debug('datToGraph res:', res);
        return res;
    }

    contentForGraph(data, x, y, type, category, status) {
        this.$log.debug('contentForGraph:', data, x, y, type, category, status);
        var res = [];

        for (var iter = 0, len = data.length; iter < len; iter++) {
            var d = [];
            d[0] = data[iter][x];
            d[1] = data[iter].details;
            var dta;
            var dtaarr = [];
            for (var diter = 0, dlen = d[1].length; diter < dlen; diter++) {
                this.$log.debug('diter', d[1][diter]);
                dta = {
                    'item': diter,
                    'month': d[0],
                    'details': {
                        'lastname': d[1][diter].details.lastname,
                        'firstname': d[1][diter].details.firstname,
                        'contactid': d[1][diter].details.contactid,
                        'fulldate': d[1][diter].details.fulldate
                    }
                };
                dtaarr.push(dta);
            }

            if (status === 'Active' &&
                data[iter].type === type &&
                data[iter].category === category
            ) {
                this.$log.debug('contentIf found:', dtaarr, data[iter].type, data[iter].category);
                res.push(dtaarr);
            }
            if (status === 'NotActive' &&
                data[iter].type === type &&
                data[iter].classstatus === category
            ) {
                this.$log.debug('contentIf found:', dtaarr, data[iter].type, data[iter].category);
                res.push(dtaarr);
            }
        }
        this.$log.debug('contentForGraph res:', res);
        return res;
    }

    getStudentStats(datestr) {
        var self=this;
        self.$log.debug('getStudentStats entered');
        var myTime = '1970/01/01';
        var oraFormat = "YYYY-MM-DD HH:mm:ss";


        var thedata = {
            thecategory: 'ContactType',
            timeint: 11,
            thedate: datestr,
            thedateearly: moment(myTime, "YYYY/MM/DD").format(oraFormat),
            thedatelate: moment(new Date()).format(oraFormat)
        };
        return self.StatsServices.getStudentStats(thedata).then(

            function(response) {
                self.$log.debug('stats success:');
                self.$log.debug(response);
                if ((typeof response.data === 'undefined' || response.data.error === true) &&
                    typeof response.data.message !== 'undefined') {
                    self.Notification.error({ message: response.data.message, delay: 5000 });
                    return (self.$q.reject(response.data));
                }

                response.data.studentstats.timeint = response.data.thedata.timeint;
                self.studentstats = response.data.studentstats;
                self.studentstatsdetails = response.data.detailslist;
                self.mergedata();
                self.genGraph();
                return response;
            },
            function(response) {
                if (!angular.isObject(response.data) ||
                    !response.data.message
                ) {
                    response = {
                        data: {
                            message: "getStudentStats An unknown error occurred"
                        }
                    };
                }
                self.$log.debug(' getStudentStats error', response.data.message);
                self.Notification.error({ message: response.data.message, delay: 5000 });
                return (self.$q.reject(response));
            }
        );
    }

    getStudentStatsMonths(datetype) {
        var self=this;
        self.$log.debug('getStudentStatsMonths entered');

        var myTime = '1970/01/01';
        var oraFormat = "YYYY-MM-DD HH:mm:ss";
        var thedata = {
            thedate: datetype,
            thedateearly: moment(myTime, "YYYY/MM/DD").format(oraFormat),
            thedatelate: moment(new Date()).format(oraFormat),

        };

        return self.StatsServices.getStudentStatsMonths(thedata).then(
            function(data) {
                self.$log.debug('getStudentStatsMonths returned data', data);
            },
            function(error) {
                self.$log.debug(' getStudentStatsMonths error', error);
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }
        );

    }

    mergedata() {
        for (var iter = 0, len = this.studentstats.length; iter < len; iter++) {
            this.studentstats[iter].details = [];
            for (var diter = 0, lend = this.studentstatsdetails.length; diter < lend; diter++) {
                if (this.studentstats[iter].month === this.studentstatsdetails[diter].month &&
                    this.studentstats[iter].type === this.studentstatsdetails[diter].type &&
                    (this.studentstats[iter].category === 'Inactive' ||
                        this.studentstats[iter].category === 'Injured' ?
                        this.studentstats[iter].classstatus === this.studentstatsdetails[diter].category :
                        this.studentstats[iter].datetype === this.studentstatsdetails[diter].datetype &&
                        this.studentstats[iter].category === this.studentstatsdetails[diter].category
                    )
                ) {
                    //todo: check if contacttype needs to be added to details to match in above too
                    var dta = {
                        'iter': diter,
                        'details': this.studentstatsdetails[diter]
                    };
                    this.studentstats[iter].details.push(dta);
                }

            }
        }

    }


    refreshStudents(theinput) {
        var self=this;
        return self.StudentServices.refreshStudents(theinput).then(
            function(data) {
            self.$log.debug('controller refreshStudents returned data');
            self.$log.debug(data);
            self.refreshstudentlist = data;
            self.$log.debug('controller refreshstudentlist service data', self.refreshstudentlist);
            return self.refreshstudentlist;
            },
            function(error) {
                self.$log.debug(' refreshStudents error', error);
                self.Notification.error({ message: error, delay: 5000 });
                return (self.$q.reject(error));
            }
        );

    }


}