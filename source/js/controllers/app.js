//var angular;
//var moment;
//var $;
var studentpick = {};

(function(window, angular, $) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('AppController', AppController)
        .controller('MainController', MainController);

    AppController.$inject = ['$scope',
        '$routeParams',
        'UserServices',
        'AttendanceServices',
        'CalendarServices',
        'TestingServices',
        'EventServices',
        'TemplateServices',
        'StudentServices',
        'PaymentServices',
        'ClassServices',
        'StatsServices',
        '$cookies',
        '$cookieStore',
        '$log',
        'Notification',
        '$q',
        '$window',
        '$interval',
        '$controller',
        '$rootScope',
        'moment',
        'CalUtil'
    ];
    MainController.$inject = ['$scope',
        'UserServices',
        'Notification',
        '$q',
        '$log'
    ];


    function MainController($scope,
        UserServices,
        Notification,
        $q,
        $log
        
        ) {
        var vm = this;
        vm.loadTopbar = loadTopbar;
        vm.loadSidebar = loadSidebar;
        vm.isokf = isokf;
        vm.userdta = {};
        vm.myuser;
        vm.message;

        $scope.$on('$destroy', function iVeBeenDismissed() {
            $log.debug("main dismissed");
            $log.debugEnabled(false);
        });

        $scope.$on('$routeChangeSuccess', function(event, current, previous) {
            $log.debugEnabled(true);
            $log.debug('routechange in main for success');
        });
        
        $.fn.Data.Portlet('app.js');

        getUserDetails();
        
        function getUserDetails() {
            $log.debug('getUserDetails entered');
            return UserServices.getUserDetails().then(function(data) {
                    $log.debug("service getuserdetails returned:", data);
                    vm.userdta = data;
                    vm.myuser = data.userid;
                    return vm.userdta;
                },

                function(error) {
                    $log.debug('Caught an error getUserDetails, going to notify:', error);
                    vm.userdta = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
            });

        }

        function isokf() {
            //        $log.debug('isokf');
            vm.isok = UserServices.isapikey();
            return vm.isok;
        }

        function loadTopbar() {
            $log.debug("loadTopbar");
            $("[data-toggle='offcanvas']").on('click', function() {
                $('#sidebar-wrapper').toggleClass('active');
                return false;
            });
            // Setting toggle in mobile view 
            $('#setting-toggle').click(function() {
                $log.debug('mobile toggle');
                $('.topbar-main').toggle();
            });
        }



        function loadSidebar() {
            $log.debug('loadSidebar');
            //BEGIN SIDEBAR FIXED
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                "height": $(window).height() - 50,
                'width': '250px',
                'wheelStep': 5
            });
            $(window).scroll(function() {
                if ($(this).scrollTop() > 50) {
                    if ($('body').hasClass('topbar-fixed')) {}
                    else {
                        $('.sidebar-fixed #sidebar-wrapper').css('top', '0px');
                    }
                }
                else {
                    if ($('body').hasClass('topbar-fixed')) {}
                    else {
                        $('.sidebar-fixed #sidebar-wrapper').css('top', '50px');
                    }
                }
            });
            //END SIDEBAR FIXED

            $('#menu-toggle').toggle(
                function() {
                    $log.debug('menu-toggle');
                    if ($('#wrapper').hasClass('right-sidebar')) {
                        $('body').addClass('right-side-collapsed');
                        $('.navbar-header').addClass('logo-collapsed');
                    }
                    else {
                        $(this).find('i').removeClass('icon-arrow-left').addClass('icon-arrow-right');
                        $('body').addClass('left-side-collapsed');
                        $('.navbar-header').addClass('logo-collapsed');
                        $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({ destroy: true });
                        $('#sidebar').css('height', 'auto');
                        $('#sidebar').css('width', '55px');
                        $('#sidebar').css('overflow', 'initial');
                        $('#sidebar .menu-scroll').css('overflow', 'initial');
                        $('body').removeClass('sidebar-fixed');
                    }
                },
                function() {
                    if ($('#wrapper').hasClass('right-sidebar')) {
                        $('body').removeClass('right-side-collapsed');
                        $('.navbar-header').removeClass('logo-collapsed');
                    }
                    else {
                        $(this).find('i').removeClass('icon-arrow-right').addClass('icon-arrow-left');
                        $('body').removeClass('left-side-collapsed');
                        $('.navbar-header').removeClass('logo-collapsed');
                        $('body').addClass('sidebar-fixed');
                        $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                            "height": $(window).height() - 50,
                            'width': '250px',
                            'wheelStep': 5
                        });
                        $('#sidebar .menu-scroll').css('overflow', 'hidden');
                    }
                }
            );

            if ($('#wrapper').hasClass('right-sidebar')) {
                $('ul#side-menu li').hover(function() {
                    if ($('body').hasClass('right-side-collapsed')) {
                        $(this).addClass('nav-hover');
                    }
                }, function() {
                    if ($('body').hasClass('right-side-collapsed')) {
                        $(this).removeClass('nav-hover');
                    }
                });
            }
            else {
                $('ul#side-menu li').hover(function() {
                    if ($('body').hasClass('left-side-collapsed')) {
                        $(this).addClass('nav-hover');
                    }
                }, function() {
                    if ($('body').hasClass('left-side-collapsed')) {
                        $(this).removeClass('nav-hover');
                    }
                });
            }


        }
            
        }

    function AppController($scope,
        $routeParams,
        UserServices,
        AttendanceServices,
        CalendarServices,
        TestingServices,
        EventServices,
        TemplateServices,
        StudentServices,
        PaymentServices,
        ClassServices,
        StatsServices,
        $cookies,
        $cookieStore,
        $log,
        Notification,
        $q,
        $window,
        $interval,
        $controller,
        $rootScope,
        moment,
        CalUtil
    ) {
        /* jshint validthis: true */
        var vm = this;
        vm.data = {};
        vm.userdta = {};
        vm.header = {
            layout_menu: '',
            layout_topbar: '',
            animation: '',
            header_topbar: 'static',
            boxed: ''
        };
        vm.getStudentStats = getStudentStats;
        vm.getEventList = getEventList;
        vm.updateTasknamelist = updateTasknamelist;
        vm.removeTasknamelist = removeTasknamelist;
        vm.gettheTasknamelist = gettheTasknamelist;
        vm.getInstructorList = getInstructorList();
        vm.getTestTypes = getTestTypes;
        vm.getStudentStatsMonths = getStudentStatsMonths;
        vm.islogin = islogin;
        vm.notifylist = [];
        vm.okNotify = true;

        vm.isok;
        vm.forUser = "ALL";
        vm.myuser;
        vm.forUsers = {
            "userlist": [
                { "user": "ALL" },
                { "user": "MINE" }
            ]
        };
        vm.thisTasknamelist = [];
        vm.instructorlist = [];
        vm.testtypelist = [];
        vm.message;
        vm.loading = false;
        vm.loadAttempted = false;
        vm.neweventid;
        vm.eventStartd;
        vm.eventStart;
        vm.eventStarttz;
        vm.eventEnd;
        vm.eventStart;
        vm.eventEnd;
        vm.eventEndtz;
        vm.reminderCheckbox;
        vm.eventid;
        vm.eventTitle;

        vm.studentstats;
        vm.studentstatsdetails;
        vm.listOfTimes = [];
        vm.myj = {};
        vm.reminderInterval;

        vm.thisUserlist = {};
        vm.userpick;

        vm.initTime = moment();
        vm.checktime;
        vm.checktimestr;
        vm.displayTime = displayTime;

        vm.okoptions = [true, false];
        //    vm.mycolor = Math.random() * 0xFFFFFF;
        vm.mycolor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        vm.settextcolor = settextcolor;


        vm.studentpick2 = {};
        vm.events = [];
        vm.colorlist = ['maroon', 'red', 'orange', 'yellow', 'olive', 'purple', 'fuchsia', 'lime', 'green', 'navy', 'blue', 'aqua', 'teal', 'silver', 'black'];
        vm.colorlisthex = ['#fff', '#000', '#000', '#000', '#fff', '#fff', '#000', '#000', '#fff', '#fff', '#fff', '#000', '#000', '#fff', '#fff'];

        vm.setStudentFromPick = setStudentFromPick;
        vm.setstudent = setstudent;
        vm.eventopen = eventopen;
        vm.getStudent = getStudent;
        
        vm.disable = undefined;

        vm.refreshStudents = refreshStudents;
        vm.refreshstudentlist = [];


        vm.reminderOptions = ['15 min', '1 hour', '1 day'];
        vm.popinit = popinit;
        vm.calsave = calsave;
        vm.eventDrag = eventDrag;
        vm.saveCalendarEvent = saveCalendarEvent;
        vm.removeCalendarEvent = removeCalendarEvent;

        var adialog;
        var eventDrag;

        $scope.data = {};
        $scope.header = {
            layout_menu: '',
            layout_topbar: '',
            animation: '',
            header_topbar: 'static',
            boxed: ''
        };

        $.fn.Data.Portlet('app.js');

        $scope.$on('$destroy', function iVeBeenDismissed() {
            $log.debug("app dismissed");
            $log.debugEnabled(false);
        });

        $scope.$on('$routeChangeSuccess', function(event, current, previous) {
            $log.debugEnabled(true);
            $log.debug('routechange in app for success');
            vm.header.animation = 'fadeInUp';
            setTimeout(function() {
                vm.header.animation = '';
            }, 100);

            vm.data = $.fn.Data.get(current.originalPath);
            $log.debug('data in $routeChangeSuccess', vm.data);

            if (-1 == $.inArray(current.originalPath, ['/page-lock-screen', '/page-signup', '/page-signin', '/reset-pwd', '/change-pwd', '/forget-pwd'])) {
                activate();

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

            if ('/layout-left-sidebar' === current.originalPath) {
                $log.debug("left sidebar entered");
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
                $log.debug("/ path entered");
                $('body').removeAttr('id'); // error 404, 500
            }
            else {
                $log.debug("else path entered");
                vm.header.boxed = '';
                vm.header.layout_topbar = '';
                vm.header.layout_menu = '';
                vm.header.header_topbar = '';
                $('#wrapper').removeClass('right-sidebar');
                $('body').removeClass('left-side-collapsed');
                $('body').removeClass('right-side-collapsed');
                $('body').removeClass('layout-boxed');
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

            $log.debug('exit routechangesucess');


        });
        $scope.$on('$routeChangeError', function(event, current, previous) {
            $log.debug('routechange in app for error');
            $log.debug('originalPath');
            $log.debug(current.originalPath);
        });



        function activate() {
            $log.debug('app.js activate entered');
            vm.textcolor = CalUtil.getColorByBgColor(vm.mycolor); // Set to complement of textColor.

            CalUtil.calActivate();
            
            $("#eventPickDiv").button().on("click", function() {
                var somevlu = $("#eventpick").val();
                $log.debug("click pick is", somevlu, vm.studentpick2, studentpick, $("#studentpick").val());
                vm.studentpick2 = studentpick;
                adialog.dialog("open");
            });

            adialog = CalUtil.aDialog(vm);
            eventDrag = CalUtil.EventDrag();
    
            getUserDetails().then(function() {
                $log.debug('activate getUserDetails returned', vm.userdta);
                islogin();

                todos();
                gettheTasknamelist();
                
//                $(document).ready(function() {
                    $("select[name='forUser']").unbind('change').bind('change', function() {
                        var u = $(this).val();
                        $log.debug("reset cal", vm.forUser, u);
                        vm.forUser = u;
                        //        $('#calendar').fullCalendar('removeEvents');
                        $('#calendar').fullCalendar('destroy');
                        getEventList(vm.forUser).then(function() {
                            $log.debug("refetch", vm.events);
                            //            $('#calendar').fullCalendar( 'refetchEventSources', vm.events );
                            initCalendar();
                        }).catch(function(e) {
                            $log.debug("resetCalendar error in activate", e);
                        });
        
                    });
                    getInstructorList().then(function() {
                         $log.debug("returned from getInstructorList"); 
                    });
                    getTestTypes().then(function() {
                         $log.debug("returned from getTesttypes"); 
                    });
        
//                });
    
                //works but is annoying
                getEventList('ALL').then(function() {
                    initCalendar();
                    intervalChecker();
                }).catch(function(e) {
                    $log.debug("getEventList error in activate", e);
                });
    
            });
            
        }


        function popinit() {
            $log.debug("popinit entered");
            vm.thisevent = CalendarServices.getCurrentEvent();

        }

        function eventopen(calEvent) {
            CalUtil.eventopen(calEvent,studentpick,vm,CalendarServices);
        }

        function displayTime() {
            return CalendarServices.displaytime();
        }

        function setstudent(mystudent) {
            $log.debug("set vm student", mystudent, studentpick);
            if (mystudent.ID === "NULL") {
                studentpick = { ID: "NULL", FirstName: "Not picked", LastName: "yet", FullName: "Not picked yet" };
            }
            else {
                studentpick = mystudent;
            }
        }

        function setStudentFromPick(item) {
            $log.debug("setstudentfrompick", item);
            $("#eventpick").val(item.FullName);
            studentpick = item;
            $("#studentpick").val(item);
        }

        function calsave(screen, title, startd, start, end, reminderCheckbox, reminderInterval, userpick, updateflag, theevent, contactid, eventid, eventclass, color, textcolor, eventtype) {
            $log.debug('save cal',
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
                textcolor, eventtype);
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
            $log.debug('check reminderCheck', reminderCheck, $('input#reminderCheckbox:checked'));

            var eventData;
            $log.debug('isTitle', title);
            if (updateflag && theevent !== null) {
                theevent.title = title;
                theevent.startd = moment(startd, 'MM/DD/YYYY').tz('America/New_York').format('MM/DD/YYYY');
                $log.debug('theevent startd set', theevent.startd);
                //add the time to the date
                var tststr = startd + ' ' + start.toString();
                $log.debug('theevent start and startd combine', start, tststr);
                var tstd = moment(tststr, 'MM/DD/YYYY hh:mm A z');
                theevent.start = tstd;
                $log.debug('theevent start set', tststr, tstd, theevent.start);
                tststr = startd + ' ' + end.toString();
                tstd = moment(tststr, 'MM/DD/YYYY hh:mm A z');
                theevent.end = tstd;
                $log.debug('theevent end set', tststr, tstd, theevent.end);

                theevent.reminderInterval = reminderInterval;
                theevent.userpick = userpick;
                theevent.reminderCheckbox = reminderCheck;
                theevent.className = eventclass;
                theevent.color = color;
                theevent.textcolor = textcolor;
                theevent.eventtype = eventtype;
                theevent.contactid = contactid;
                theevent.eventid = eventid;

                saveCalendarEvent(theevent);

                $('#calendar').fullCalendar('updateEvent', theevent);
            }

            if (updateflag !== true && title) {
                $log.debug("updateflag not true", startd, start, end, eventid, contactid);
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
                    contactid: contactid.val()
                };
                $log.debug('isTitle yes', eventData);
                $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            }



        }

        function saveCalendarEvent(theEvent) {
            var updpath = "../v1/saveCalendarEvent";
            $log.debug('about saveCalendarEvent ', theEvent, updpath);
            var rep = (typeof(theEvent.userpick) !== 'undefined' && theEvent.userpick !== "") ? theEvent.userpick.toString().replace("number:", "") : vm.myuser;

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
                classname: theEvent.className
            };


            $log.debug('about saveCalendarEvent data', thedata);
            return CalendarServices.saveCalendarEvent(updpath, thedata)
                .then(function(data) {
                    $log.debug('saveCalendarEvent returned data');
                    $log.debug(data);
                    vm.neweventid = data.new_eventid;
                    $log.debug('saveCalendarEvent newevent', vm.neweventid);
                    vm.events = data.events;
                    $log.debug(vm.events);
                    $log.debug(data.message);
                    vm.message = data.message;
                    getEventList(vm.forUser).then(function(zdata) {
                            $log.debug('saveCalendarEvent getEventList returned', zdata);
                        },
                        function(error) {
                            $log.debug('Caught an error saveCalendarEvent getEventList after update:', error);
                            vm.events = [];
                            vm.message = error;
                            Notification.error({ message: error, delay: 5000 });
                            return ($q.reject(error));
                        });

                    return vm.events;
                }).catch(function(e) {
                    $log.debug('saveCalendarEvent failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({ message: e, delay: 5000 });
                    throw e;
                });
        }

        function updateTasknamelist(taskname, taskstatus) {
            var updpath = "../v1/updatetasknamelist";
            var thedata = {
                taskname: taskname,
                taskstatus: taskstatus
            };
            $log.debug('about updateTasknamelist ', thedata, updpath);
            return CalendarServices.updateTasknamelist(updpath, thedata)
                .then(function(data) {
                    $log.debug('updateTasknamelist returned data');
                    $log.debug(data);
                    vm.thisTasknamelist = data;
                    $log.debug(vm.thisTasknamelist);
                    $log.debug(vm.thisTasknamelist.message);
                    vm.message = vm.thisTasknamelist.message;
                    gettheTasknamelist().then(function(zdata) {
                            $log.debug('gettheTasknamelist returned', zdata);
                        },
                        function(error) {
                            $log.debug('Caught an error gettheTasknamelist after update:', error);
                            vm.tasknamelist = [];
                            vm.message = error;
                            Notification.error({ message: error, delay: 5000 });
                            return ($q.reject(error));
                        });

                    return vm.thisTasknamelist;
                }).catch(function(e) {
                    $log.debug('updateTasknamelist failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({ message: e, delay: 5000 });
                    throw e;
                });
        }

        function removeTasknamelist(taskname) {
            var updpath = "../v1/removetasknamelist";
            var thedata = {
                taskname: taskname
            };
            $log.debug('about removeTasknamelist ', thedata, updpath);
            return CalendarServices.removeTasknamelist(updpath, thedata)
                .then(function(data) {
                    $log.debug('removeTasknamelist returned data');
                    $log.debug(data);
                    //                vm.thisTasknamelist = data;
                    $log.debug(data);
                    vm.message = data.message;
                    gettheTasknamelist().then(function(zdata) {
                            $log.debug('gettheTasknamelist returned', zdata);
                        },
                        function(error) {
                            $log.debug('Caught an error gettheTasknamelist after update:', error);
                            vm.tasknamelist = [];
                            vm.message = error;
                            Notification.error({ message: error, delay: 5000 });
                            return ($q.reject(error));
                        });

                    return vm.thisTasknamelist;
                }).catch(function(e) {
                    $log.debug('removeTasknamelist failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({ message: e, delay: 5000 });
                    throw e;
                });
        }

        function getStudent(path) {
            return StudentServices.getStudent(path).then(function(data) {
                $log.debug('getStudent returned data');
                $log.debug(data.data);
                return data.data;
            }, function(error) {
                $log.debug('getStudent', error);
                Notification.error({ message: error, delay: 5000 });
                return (error);
            });
        }


        function removeCalendarEvent(eventid) {
            var updpath = "../v1/removeCalendarEvent";
            var thedata = {
                eventid: eventid
            };
            $log.debug('about removeCalendarEvent ', thedata, updpath);
            return CalendarServices.removeCalendarEvent(updpath, thedata)
                .then(function(data) {
                    $log.debug('removeCalendarEvent returned data');
                    $log.debug(data);
                    //                vm.thisTasknamelist = data;
                    $log.debug(data);
                    vm.message = data.message;
                    getEventList(vm.forUser).then(function(zdata) {
                            $log.debug('removeCalendarEvent getEventList returned', zdata);
                        },
                        function(error) {
                            $log.debug('Caught an error removeCalendarEvent getEventList:', error);
                            vm.tasknamelist = [];
                            vm.message = error;
                            Notification.error({ message: error, delay: 5000 });
                            return ($q.reject(error));
                        });

                    return vm.events;
                }).catch(function(e) {
                    $log.debug('removeCalendarEvent  failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({ message: e, delay: 5000 });
                    throw e;
                });
        }

        function getUserDetails() {
            $log.debug('getUserDetails entered');
            return UserServices.getUserDetails().then(function(data) {
                    $log.debug("service getuserdetails returned:", data);
                    vm.userdta = data;
                    vm.myuser = data.userid;
                    return vm.userdta;
                },

                function(error) {
                    $log.debug('Caught an error getUserDetails, going to notify:', error);
                    vm.userdta = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function getUserList() {
            $log.debug('getUserList entered');
            var refreshpath = "../v1/getuserlist";

            return CalendarServices.getUsers(refreshpath).then(function(data) {
                    $log.debug('getUsers returned data');
                    $log.debug(data);
                    vm.thisUserlist = data.users;
                    return vm.thisUserlist;
                },
                function(error) {
                    $log.debug('Caught an error getUserList, going to notify:', error);
                    vm.thisUserlist = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function gettheTasknamelist() {
            $log.debug('gettheTasknamelist entered');
            var refreshpath = "../v1/tasknamelist";

            return CalendarServices.gettasknamelist(refreshpath).then(function(data) {
                    $log.debug('gettasknamelists returned data');
                    $log.debug(data);
                    vm.thisTasknamelist = data.tasknamelist;
                    return vm.thisTasknamelist;
                },
                function(error) {
                    $log.debug('Caught an error gettheTasknamelist, going to notify:', error);
                    vm.thisTasknamelist = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function getInstructorList() {
            $log.debug('getInstructorList entered');
            var refreshpath = "../v1/instructorlist";

            return CalendarServices.getinstructorlist(refreshpath).then(function(data) {
                    $log.debug('getinstructorlist returned data');
                    $log.debug(data);
                    vm.instructorlist = data.instructorlist;
                    if (typeof data.instructorlist !== 'undefined') {
                        for (var i = 0; i < data.instructorlist.length; i++) {
                            if (i > vm.colorlist.length) {
                                vm.instructorlist[i].backgroundcolor = vm.colorlist[vm.colorlist.length];
                                vm.instructorlist[i].textcolor = vm.colorlisthex[vm.colorlist.length];
                            }
                            else {
                                vm.instructorlist[i].backgroundcolor = vm.colorlist[i];
                                vm.instructorlist[i].textcolor = vm.colorlisthex[i];
                            }
                        }
                    }
                    return vm.instructorlist;
                },
                function(error) {
                    $log.debug('Caught an error getinstructorlist, going to notify:', error);
                    vm.thisTasknamelist = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function getTestTypes() {
            $log.debug('getTestTypes entered');
            var refreshpath = "../v1/testtypes";

            return TestingServices.getTestTypes(refreshpath).then(function(data) {
                    $log.debug('getTestTypes returned data');
                    $log.debug(data);
                    vm.testtypelist = data.testtypelist;
                    if (typeof data.testtypelist !== 'undefined') {
                        for (var i = 0; i < data.testtypelist.length; i++) {
                            if (i > vm.colorlist.length) {
                                vm.testtypelist[i].backgroundcolor = vm.colorlist[vm.colorlist.length];
                                vm.testtypelist[i].textcolor = vm.colorlisthex[vm.colorlist.length];
                            }
                            else {
                                vm.testtypelist[i].backgroundcolor = vm.colorlist[i];
                                vm.testtypelist[i].textcolor = vm.colorlisthex[i];
                            }
                        }
                    }
                    return vm.testtypelist;
                },
                function(error) {
                    $log.debug('Caught an error getTestTypes, going to notify:', error);
                    vm.testtypelist = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function getEventList(qparm) {
            //                var qparm =  typeof(vm.forUser) !== 'undefined' ? vm.forUser : 'ALL' ;
            var refreshpath = "../v1/getEventList?username=" + qparm;
            $log.debug('getEventList entered', qparm, refreshpath);

            return CalendarServices.getCalendarEvents(refreshpath).then(function(data) {
                    $log.debug('getCalendarEvents returned data');
                    $log.debug(data, typeof(data.events));
                    if (typeof(data.events) !== "undefined") {
                        for (var i = 0; i < data.events.length; i++) {
                            $log.debug('reformat dates', data.events[i]);
                            var atimetoadd = {
                                "title": data.events[i].title,
                                "time": data.events[i].start,
                                "theevent": data.events[i],
                                "id": data.events[i].id
                            };
                            data.events[i].end = moment(CalUtil.convertToMoment(data.events[i].end));
                            data.events[i].start = moment(CalUtil.convertToMoment(data.events[i].start));
                            data.events[i].startd = moment(data.events[i].startd, 'YYYY-MM-DD');

                            //        addListOfTimes(atimetoadd);

                        }

                        vm.events = data.events;
                    }
                    else {
                        vm.events = {};
                    }
                    //temp for testing
                    // Array.prototype.push.apply(vm.events, getEventListold());
                    $log.debug(vm.events);
                    CalendarServices.setNotifyList(vm.events);

                    $('#calendar').fullCalendar('renderEvents', vm.events, true);

                    return vm.events;
                },
                function(error) {
                    $log.debug('Caught an error getEventList, going to notify:', error);
                    vm.events = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });
        }

        function intervalChecker() {
            $log.debug('intervalChecker entered, using', vm.initTime);

            $interval(function() {

                //        timeCleaner();          
                vm.notifylist = CalendarServices.getNotifyList(vm.okNotify);
            }, CalendarServices.getIntervalValue());
        }

        function islogin() {

            $log.debug('islogin');
            vm.isok = UserServices.isapikey();

            if (vm.isok) {
                $log.debug('setting apikey for services');
                var thekey = UserServices.getapikey();
                CalendarServices.setapikey(thekey);
                TestingServices.setapikey(thekey);
                EventServices.setapikey(thekey);
                TemplateServices.setapikey(thekey);
                StudentServices.setapikey(thekey);
                PaymentServices.setapikey(thekey);
                ClassServices.setapikey(thekey);
                UserServices.setapikey(thekey);
                StatsServices.setapikey(thekey);
                vm.filterstat = filterstat;

                var getdatestr = 'startdate';

                $q.all([
                        getUserList().then(function() {
                            $log.debug('getUserList returned');
                        }),
                        getStudentStatsMonths(getdatestr).then(function() {
                            $log.debug('getStudentStatsMonths returned');
                        }),
                        getStudentStats(getdatestr).then(function() {
                            $log.debug('getStudentStats returned');
                        })
                    ])
                    .then(function() {
                        $log.debug('getAll stats done returned');
                    });


            }

        }

        function filterstat(val) {
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
        function initCalendar(){
            CalUtil.initCalendar(vm,studentpick);
        }

        function settextcolor() {
            vm.textcolor = CalUtil.getColorByBgColor(vm.mycolor);
            //      vm.textcolor = 0xFFFFFF ^ vm.mycolor;
            $log.debug('settextcolor', vm.mycolor, vm.textcolor);
        }



        function getYType(index) {
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

        function getYStatus(index) {
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

        function categoryGetStatus(category) {
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

        function todos() {
            setTimeout(function() {
                //BEGIN TODOS LIST
                $("#todos-list-sort").sortable();
                $("#todos-list-sort").disableSelection();


                $('#todos-list-add').click(function() {
                    updateTasknamelist($("#todos-list-input").val(), '0');
                    $("[data-hover='tooltip']").tooltip();
                    return false;
                });

            });
        }

        function genGraph() {
            //      $log.debug('genGraph entered');
            setTimeout(function() {
                var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');

                try {

                    //BEGIN LINE CHART SPLINE
                    //var d2_1 = [["Jan", 181],["Feb", 184],["Mar", 189],["Apr", 180],["May", 190],["Jun", 183],["Jul", 185],["Aug", 188],["Sep", 202]];

                    var d2_1 = datToGraph(vm.studentstats, 'month', 'summaryvalue', 'ContactType', getYType(0));
                    //        $log.debug('d2_1', d2_1);
                    var d2_2 = datToGraph(vm.studentstats, 'month', 'summaryvalue', 'ContactType', getYType(1));
                    //        $log.debug('d2_2', d2_2);
                    var d2_3 = datToGraph(vm.studentstats, 'month', 'summaryvalue', 'ContactType', getYType(3));
                    //        $log.debug('d2_3', d2_3);
                    var d2_4 = datToGraph(vm.studentstats, 'month', 'summaryvalue', 'ContactType', getYType(4));
                    //        $log.debug('d2_4', d2_4);

                    //        var d2_2 = [["Jan", -32],["Feb", -22],["Mar", -13],["Apr", -24],["May", -16],["Jun", -27],["Jul", -15],["Aug", -31],["Sep", -14]];
                    //       var d2_3 = [["Jan", -16],["Feb", -34],["Mar", -12],["Apr", -35],["May", -15],["Jun", 0],["Jul", 0],["Aug", -15],["Sep", -16]];

                    // Add a SumArray method to all arrays by expanding the Array prototype(do this once in a general place)
                    Array.prototype.SumArray = function(arr) {
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

                    };


                    function gety(x, seriesIndex) {
                        $log.debug('gety:', x, seriesIndex);
                        var retvl = [];
                        if (getYType(seriesIndex) !== 'Net') {
                            var d2_1a = contentForGraph(vm.studentstats,
                                'month',
                                'summaryvalue',
                                'ContactType',
                                getYType(seriesIndex),
                                getYStatus(seriesIndex)
                            );
                            $log.debug('gety d2_1a', d2_1a, x);
                            for (var iter = 0, len = d2_1a.length; iter < len; iter++) {
                                for (var diter = 0, dlen = d2_1a[iter].length; diter < dlen; diter++) {
                                    if (d2_1a[iter][diter].month === x) {
                                        $log.debug('d2_1a content', d2_1a[iter][diter].details);
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
                        $log.debug('gety x', JSON.stringify(retvl));
                        return (JSON.stringify(retvl));
                    }

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
                                var xy = JSON.parse(gety(xval, flotItem.seriesIndex));
                                $log.debug('xy', xy, xval, yval, getYType(flotItem.seriesIndex));
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
                                $log.debug('xx', xx);
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
                    $.plot('#traffice-sources-chart', [{
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
                    $.plot("#new-customer-chart", [{
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
                    $.plot("#internet-speed-chart", [{
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
                    $.plot("#area-chart-spline-db", [{
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
                    //END AREA CHART SPLINE

                    //BEGIN CALENDAR
                    $("#my-calendar").zabuto_calendar({
                        language: "en"
                    });

                }
                catch (e) {
                    $log.debug(e.message, "from", e.stack);
                    // You can send data to your server
                    // sendError(data);
                    //throw e;
                }


                //END CALENDAR
            }, 500);

        }

        function datToGraph(data, x, y, type, category) {
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

        function contentForGraph(data, x, y, type, category, status) {
            $log.debug('contentForGraph:', data, x, y, type, category, status);
            var res = [];

            for (var iter = 0, len = data.length; iter < len; iter++) {
                var d = [];
                d[0] = data[iter][x];
                d[1] = data[iter].details;
                var dta;
                var dtaarr = [];
                for (var diter = 0, dlen = d[1].length; diter < dlen; diter++) {
                    $log.debug('diter', d[1][diter]);
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
                    $log.debug('contentIf found:', dtaarr, data[iter].type, data[iter].category);
                    res.push(dtaarr);
                }
                if (status === 'NotActive' &&
                    data[iter].type === type &&
                    data[iter].classstatus === category
                ) {
                    $log.debug('contentIf found:', dtaarr, data[iter].type, data[iter].category);
                    res.push(dtaarr);
                }
            }
            $log.debug('contentForGraph res:', res);
            return res;
        }

        function getStudentStats(datestr) {
            $log.debug('getStudentStats entered');
            var myTime = '1970/01/01';
            var oraFormat = "YYYY-MM-DD HH:mm:ss";


            var thedata = {
                thecategory: 'ContactType',
                timeint: 11,
                thedate: datestr,
                thedateearly: moment(myTime, "YYYY/MM/DD").format(oraFormat),
                thedatelate: moment(new Date()).format(oraFormat)
            };
            return StatsServices.getStudentStats(thedata).then(

                function(response) {
                    $log.debug('stats success:');
                    $log.debug(response);
                    response.data.studentstats.timeint = response.data.thedata.timeint;
                    vm.studentstats = response.data.studentstats;
                    vm.studentstatsdetails = response.data.detailslist;
                    mergedata();
                    genGraph();
                    return response;
                },
                function(response) {
                    if (!angular.isObject(response.data) ||
                        !response.data.message
                    ) {
                        response.data.message = "getStudentStats An unknown error occurred";
                    }
                    $log.debug(' getStudentStats error', response.data.message);
                    Notification.error({ message: response.data.message, delay: 5000 });
                    return ($q.reject(response));
                }
            );
        }

        function getStudentStatsMonths(datetype) {
            $log.debug('getStudentStatsMonths entered');

            var myTime = '1970/01/01';
            var oraFormat = "YYYY-MM-DD HH:mm:ss";
            var thedata = {
                thedate: datetype,
                thedateearly: moment(myTime, "YYYY/MM/DD").format(oraFormat),
                thedatelate: moment(new Date()).format(oraFormat),

            };

            return StatsServices.getStudentStatsMonths(thedata).then(
                function(data) {
                    $log.debug('getStudentStatsMonths returned data', data);
                },
                function(error) {
                    $log.debug(' getStudentStatsMonths error', error);
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }
            );

        }

        function mergedata() {
            for (var iter = 0, len = vm.studentstats.length; iter < len; iter++) {
                vm.studentstats[iter].details = [];
                for (var diter = 0, lend = vm.studentstatsdetails.length; diter < lend; diter++) {
                    if (vm.studentstats[iter].month === vm.studentstatsdetails[diter].month &&
                        vm.studentstats[iter].type === vm.studentstatsdetails[diter].type &&
                        (vm.studentstats[iter].category === 'Inactive' ||
                            vm.studentstats[iter].category === 'Injured' ?
                            vm.studentstats[iter].classstatus === vm.studentstatsdetails[diter].category :
                            vm.studentstats[iter].datetype === vm.studentstatsdetails[diter].datetype &&
                            vm.studentstats[iter].category === vm.studentstatsdetails[diter].category
                        )
                    ) {
                        //todo: check if contacttype needs to be added to details to match in above too
                        var dta = {
                            'iter': diter,
                            'details': vm.studentstatsdetails[diter]
                        };
                        vm.studentstats[iter].details.push(dta);
                    }

                }
            }

        }


        function refreshStudents(theinput) {
            return StudentServices.refreshStudents(theinput).then(function(data) {
                $log.debug('controller refreshStudents returned data');
                $log.debug(data);
                vm.refreshstudentlist = data;
                $log.debug('controller refreshstudentlist service data', vm.refreshstudentlist);
                return vm.refreshstudentlist;
            });

        }


    }


})(window, window.angular, window.$);
