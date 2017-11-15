//var angular;
//var moment;
//var $;
var studentpick = {};

(function () {
    'use strict';
 
    angular
        .module('ng-admin')
    .controller('AppController', AppController)
//    .controller('EventPopController', EventPopController);

    .directive('itemsDrag', function()
    {
       var uid = (function(){var id=0;return function(){if(arguments[0]===0)id=0;return id++;}})();

       var eventDrag = function(el){
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim(el.text()), // use the element's text as the event title
                id: uid()
            };
    
            // store the Event Object in the DOM element so we can get to it later
            el.data('eventObject', eventObject);
    
            // make the event draggable using jQuery UI
            el.draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });
        };

        return {
            link: function(scope, element, attrs)
            {
                 element.draggable();
                 eventDrag(element);

                 scope.$on('$destroy', function()
                 {
                     element.off('**');
                 });
            }
        };
    });
    
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
    'moment'
    ];
 
    function AppController( $scope, 
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
         moment
    ){
        /* jshint validthis: true */
        var vm = this;
        var $ = angular.element;
    vm.data = {};
    vm.userdta={};
    vm.header = {
        layout_menu:'',
        layout_topbar:'',
        animation:'',
        header_topbar:'static',
        boxed:''
    };
    vm.loadTopbar = loadTopbar;
    vm.loadSidebar = loadSidebar;
    vm.getStudentStats = getStudentStats;
    vm.getEventList = getEventList;
    vm.updateTasknamelist = updateTasknamelist;
    vm.removeTasknamelist = removeTasknamelist;
    vm.gettheTasknamelist = gettheTasknamelist;
    vm.getInstructorList = getInstructorList();
    vm.getTestTypes = getTestTypes;
    vm.getStudentStatsMonths = getStudentStatsMonths;
    vm.islogin = islogin;
    vm.isokf = isokf;
    vm.notifylist =[];
    vm.okNotify=true;

    vm.isok;
    vm.forUser = "ALL";
    vm.myuser;
    vm.forUsers= { "userlist": [
        {"user": "ALL"},
        {"user": "MINE"}
                        ]
    };
    vm.thisTasknamelist=[];
    vm.instructorlist=[];
    vm.testtypelist=[];
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
    vm.listOfTimes=[];
    vm.myj = {};
    vm.reminderInterval;
    
    vm.thisUserlist={};
    vm.userpick;
    
    vm.initTime = moment();
    vm.checktime;
    vm.checktimestr;
    vm.displayTime = displayTime;
    
    vm.okoptions=[true,false];
//    vm.mycolor = Math.random() * 0xFFFFFF;
    vm.mycolor = '#'+Math.floor(Math.random()*16777215).toString(16);
    vm.settextcolor = settextcolor;

    vm.textcolor = getColorByBgColor(vm.mycolor); // Set to complement of textColor.

    vm.studentpick2 = {};
//    vm.getStudentpick = getStudentpick;
//    vm.disable = undefined;

//    vm.refreshStudents = refreshStudents;
//    vm.refreshstudentlist = [];
    vm.events = [];
    vm.colorlist    = ['maroon','red'   ,'orange','yellow','olive','purple','fuchsia','lime','green','navy',  'blue','aqua',  'teal', 'silver','black']; 
    vm.colorlisthex = [ '#fff' , '#000' , '#000'  ,'#000' , '#fff', '#fff'  , '#000' ,'#000', '#fff', '#fff', '#fff', '#000',  '#000',  '#fff', '#fff']; 

    var uid = (function(){var id=0;return function(){if(arguments[0]===0)id=0;return id++;}})();
    
//    vm.vmevent = $controller('EventPopController as vmevent', {$scope: $scope});

    $('#calEventDialog').dialog({
        resizable: false,
        autoOpen: false,
        title: 'Add Event',
        width: 400,
        buttons: {}
    });

   var adialog = $('#adialog').dialog({
        resizable: false,
        autoOpen: false,
        title: 'Select Student',
        width: 400,
        modal: true,
        buttons: {
    /*            "Select": function() {
                    $log.debug('save in edit. note need to update');
                    var contactid = $('#contactid')[0].innerHTML;
                    $(this).dialog("close");
                }, */
                "Close": function() {
                    $log.debug("picked is", vm.studentpick2);
          //          vm.studentpick = vm.studentpick2;
                    $(this).dialog("close");
                }
        }
    });
    
      $( "#eventPickDiv" ).button().on( "click", function() {
          var somevlu = $("#eventpick").val();
          $log.debug("click pick is",somevlu, vm.studentpick2, studentpick, $("#studentpick").val() );
          vm.studentpick2 = studentpick;
//          $('#ui-select-choices-0').val(somevlu).change();
    //      $("#mike")[0].innerText = somevlu;
      adialog.dialog( "open" );
    });

        vm.setStudentFromPick = setStudentFromPick; 
        vm.disable = undefined;

        vm.refreshStudents = refreshStudents;
        vm.refreshstudentlist = [];


        vm.reminderOptions=['15 min','1 hour','1 day'];
    //    vm.thisevent = {}; 
    //    $log.debug("EventPopController this event",vm.thisevent);
        vm.popinit = popinit;
        
    var title = $('#eventTitle');
    var startd = $('#eventStartd');
    var start = $('#eventStart');
    var end = $('#eventEnd');
    var eventid = $('#eventid');
    var reminderInterval = $('#reminderInterval');
    var userpick = $('#userpick');
    var reminderCheckbox = $('#reminderCheckbox');
    var contactid = $('#contactid');
    var eventclass;
    var color;
    var textcolor;
    var eventtype;

    function popinit() {
        $log.debug("popinit entered");
        vm.thisevent = CalendarServices.getCurrentEvent();
        
    }

/*
$( "#calEventDialog" ).on('shown', function(){
    popinit();
    alert("I want this to appear after the modal has opened!");
});
*/

    todos();
    gettheTasknamelist();
  //  sampleset();

//added dates in index.html
//moment.tz.add([
//    'America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0'
//]);

 
    
    $('#eventStart').timepicker({
        minuteStep: 15,
        template: 'dropdown',
        modalBackdrop: 'false',
        showSeconds: false,
        showMeridian: true,
        defaultTime: false
    });
    $('#eventEnd').timepicker({
        minuteStep: 15,
        template: 'dropdown',
        modalBackdrop: 'false',
        showSeconds: false,
        showMeridian: true,
        defaultTime: false
    });

    islogin(); 
    //works but is annoying
    getEventList('ALL').then(function() {
        initCalendar();
        intervalChecker();
    }).catch(function(e){
                $log.debug("getEventList error in activate", e);
          }
    );

$(document).ready(function() {
    $("select[name='forUser']").unbind('change').bind('change', function(){
        var u = $(this).val();
        $log.debug("reset cal", vm.forUser, u);
        vm.forUser = u;
//        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('destroy');
        getEventList(vm.forUser).then(function() {
            $log.debug("refetch", vm.events);
//            $('#calendar').fullCalendar( 'refetchEventSources', vm.events );
            initCalendar();
        }).catch(function(e){
                    $log.debug("resetCalendar error in activate", e);
              }
        );
        
    });
    getInstructorList().then(function() {
//        $log.debug("returned from getInstructorList");
//        $('#external-events span.external-event').each(function() {
//            eventDrag($(this));
//            $log.debug('external-events after drag',$(this));
        
//        });

    });
    getTestTypes().then(function() {
  //     $log.debug("returned from getTesttypes"); 
    });
    
});
    
    
    function displayTime() {
        return CalendarServices.displaytime();   
    }
    function setstudent(mystudent) {
        $log.debug("set vm student", mystudent, studentpick);
        if (mystudent.ID === "NULL") {
            studentpick =  {ID: "NULL", FirstName: "Not picked", LastName: "yet" , FullName: "Not picked yet"};
        } else {
            studentpick = mystudent;
        }
    }    
    function setStudentFromPick(item) {
        $log.debug("setstudentfrompick", item);
        $("#eventpick").val(item.FullName);
        studentpick = item;
        $("#studentpick").val(item);
    }
    


    function calsave(screen,title,startd,start,end,reminderCheckbox,reminderInterval,userpick,updateflag,theevent,contactid,eventid,eventclass,color,textcolor,eventtype){
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
            textcolor,eventtype);
            var reminderCheck;
            if (reminderCheckbox === undefined) {
                reminderCheck = 0;
            } else if (reminderCheckbox === 1) {
                reminderCheck = 1;
            } else if (reminderCheckbox === 0) {
                reminderCheck = 0;
            } else {
                reminderCheck = reminderCheckbox[0].checked ? 1 : 0;
            }
        $log.debug('check reminderCheck', reminderCheck, $('input#reminderCheckbox:checked'));
        
/*        if ($('input:radio[name=allday]:checked').val() == "1") {
            eventClass = "gbcs-partialday-event";
            color = "#9E6320";
            end.val(start.val());
        }
        else {
            eventClass = "gbcs-allday-event";
            color = "#875DA8";
        }
        */
		var eventData;
		$log.debug('isTitle', title);
		if (updateflag && theevent !== null) {
				theevent.title = title;
                theevent.startd = moment(startd, 'MM/DD/YYYY').tz('America/New_York').format('MM/DD/YYYY');
                $log.debug('theevent startd set', theevent.startd);
                //add the time to the date
                var tststr = startd + ' ' + start.toString();
                $log.debug('theevent start and startd combine', start, tststr);
                var tstd = moment(tststr, 'MM/DD/YYYY hh:mm A z' );
                theevent.start = tstd;
                $log.debug('theevent start set', tststr, tstd, theevent.start);
                tststr = startd + ' ' + end.toString();
                tstd = moment(tststr, 'MM/DD/YYYY hh:mm A z' );
                theevent.end = tstd;
                $log.debug('theevent end set', tststr, tstd, theevent.end);

                theevent.reminderInterval =  reminderInterval;
                theevent.userpick =  userpick;
                theevent.reminderCheckbox = reminderCheck;
				theevent.className = eventclass;
				theevent.color = color;
				theevent.textcolor = textcolor;
				theevent.eventtype = eventtype;
				theevent.contactid = contactid;
				theevent.eventid = eventid;

				saveCalendarEvent(theevent);

				//if reminderinterval is set, add/update it in the listoftimes
				//todo
				//            {"title": "sample1","time": sample1},
/*                if ( reminderCheck === 1 ) {
    				var atimetoadd = {
    				    "title": theevent.title, 
    				    "time": displaytime(theevent.start),
    				    "theevent": theevent,
    				    "id": theevent.id
    				};
                    $log.debug('add reminder time to event list',reminderCheck, theevent,atimetoadd);
    				//todo the change in title is causing extra events
    				addListOfTimes(atimetoadd);
    				
                } else {
                    $log.debug('not adding reminder time to event list',reminderCheck, theevent, theevent.id);
                    
                }
*/				
		    $('#calendar').fullCalendar('updateEvent', theevent);
		}
		
		if (updateflag !== true && title) {
		    $log.debug("updateflag not true", startd,start,end,eventid,contactid);
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


    
    function getStudentpick() {
        return $rootScope.studentpick;
    }
    function isokf() {
//        $log.debug('isokf');
        vm.isok = UserServices.isapikey();
        return vm.isok;
    }

    function saveCalendarEvent(theEvent) {
        var updpath = "../v1/saveCalendarEvent";
        $log.debug('about saveCalendarEvent ', theEvent, updpath);
        var rep = (typeof( theEvent.userpick) !== 'undefined' && theEvent.userpick !== "") ? theEvent.userpick.toString().replace("number:","") : vm.myuser;
        
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
            .then(function(data){
                $log.debug('saveCalendarEvent returned data');
                $log.debug(data);
                vm.neweventid = data.new_eventid;
                $log.debug('saveCalendarEvent newevent',vm.neweventid);
                vm.events = data.events;
                $log.debug(vm.events);
                $log.debug(data.message);
                vm.message = data.message;
                getEventList(vm.forUser).then
                    (function(zdata) {
                     $log.debug('saveCalendarEvent getEventList returned', zdata);
                 },
                    function (error) {
                        $log.debug('Caught an error saveCalendarEvent getEventList after update:', error); 
                        vm.events = [];
                        vm.message = error;
                        Notification.error({message: error, delay: 5000});
                        return ($q.reject(error));
                    });

                return vm.events;
            }).catch(function(e) {
                $log.debug('saveCalendarEvent failure:');
                $log.debug("error", e);
                vm.message = e;
                Notification.error({message: e, delay: 5000});
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
            .then(function(data){
                $log.debug('updateTasknamelist returned data');
                $log.debug(data);
                vm.thisTasknamelist = data;
                $log.debug(vm.thisTasknamelist);
                $log.debug(vm.thisTasknamelist.message);
                vm.message = vm.thisTasknamelist.message;
                gettheTasknamelist().then
                    (function(zdata) {
                     $log.debug('gettheTasknamelist returned', zdata);
                 },
                    function (error) {
                        $log.debug('Caught an error gettheTasknamelist after update:', error); 
                        vm.tasknamelist = [];
                        vm.message = error;
                        Notification.error({message: error, delay: 5000});
                        return ($q.reject(error));
                    });

                return vm.thisTasknamelist;
            }).catch(function(e) {
                $log.debug('updateTasknamelist failure:');
                $log.debug("error", e);
                vm.message = e;
                Notification.error({message: e, delay: 5000});
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
            .then(function(data){
                $log.debug('removeTasknamelist returned data');
                $log.debug(data);
//                vm.thisTasknamelist = data;
                $log.debug(data);
                vm.message = data.message;
                gettheTasknamelist().then
                    (function(zdata) {
                     $log.debug('gettheTasknamelist returned', zdata);
                 },
                    function (error) {
                        $log.debug('Caught an error gettheTasknamelist after update:', error); 
                        vm.tasknamelist = [];
                        vm.message = error;
                        Notification.error({message: error, delay: 5000});
                        return ($q.reject(error));
                    });

                return vm.thisTasknamelist;
            }).catch(function(e) {
                $log.debug('removeTasknamelist failure:');
                $log.debug("error", e);
                vm.message = e;
                Notification.error({message: e, delay: 5000});
                throw e;
            });
    }

    function getStudent(path) {
        return StudentServices.getStudent(path).then(function (data) {
            $log.debug('getStudent returned data');
            $log.debug(data.data);
            return data.data;
        },function(error) {
                $log.debug('getStudent',error);
                Notification.error({message: error, delay: 5000});
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
            .then(function(data){
                $log.debug('removeCalendarEvent returned data');
                $log.debug(data);
//                vm.thisTasknamelist = data;
                $log.debug(data);
                vm.message = data.message;
                getEventList(vm.forUser).then
                    (function(zdata) {
                     $log.debug('removeCalendarEvent getEventList returned', zdata);
                 },
                    function (error) {
                        $log.debug('Caught an error removeCalendarEvent getEventList:', error); 
                        vm.tasknamelist = [];
                        vm.message = error;
                        Notification.error({message: error, delay: 5000});
                        return ($q.reject(error));
                    });

                return vm.events;
            }).catch(function(e) {
                $log.debug('removeCalendarEvent  failure:');
                $log.debug("error", e);
                vm.message = e;
                Notification.error({message: e, delay: 5000});
                throw e;
            });
    }

    function getUserDetails(){
        $log.debug('getUserDetails entered');
           return UserServices.getUserDetails().then(function(data) {
                $log.debug("getuserdetails returned:", data);
                vm.userdta = data;
                vm.myuser = data.userid;
                return vm.userdta;
                },

            function (error) {
                $log.debug('Caught an error getUserDetails, going to notify:', error); 
                vm.userdta = [];
                vm.message = error;
                Notification.error({message: error, delay: 5000});
                return ($q.reject(error));
            }).
            finally(function () { 
                vm.loading = false; 
                vm.loadAttempted = true;
            }
            );
        
    }

    function getUserList(){
        $log.debug('getUserList entered');
        var refreshpath = "../v1/getuserlist";

         return CalendarServices.getUsers(refreshpath).then(function(data){
                $log.debug('getUsers returned data');
                $log.debug(data);
                vm.thisUserlist = data.users; 
                return vm.thisUserlist;
            },
            function (error) {
                $log.debug('Caught an error getUserList, going to notify:', error); 
                vm.thisUserlist = [];
                vm.message = error;
                Notification.error({message: error, delay: 5000});
                return ($q.reject(error));
            }).
            finally(function () { 
                vm.loading = false; 
                vm.loadAttempted = true;
            }
            );
        
    }

    function gettheTasknamelist() {
        $log.debug('gettheTasknamelist entered');
        var refreshpath = "../v1/tasknamelist";

         return CalendarServices.gettasknamelist(refreshpath).then(function(data){
                $log.debug('gettasknamelists returned data');
                $log.debug(data);
                vm.thisTasknamelist = data.tasknamelist; 
                return vm.thisTasknamelist;
            },
            function (error) {
                $log.debug('Caught an error gettheTasknamelist, going to notify:', error); 
                vm.thisTasknamelist = [];
                vm.message = error;
                Notification.error({message: error, delay: 5000});
                return ($q.reject(error));
            }).
            finally(function () { 
                vm.loading = false; 
                vm.loadAttempted = true;
            }
            );

    }

    function getInstructorList() {
        $log.debug('getInstructorList entered');
        var refreshpath = "../v1/instructorlist";

         return CalendarServices.getinstructorlist(refreshpath).then(function(data){
                $log.debug('getinstructorlist returned data');
                $log.debug(data);
                vm.instructorlist = data.instructorlist; 
                if (typeof data.instructorlist !== 'undefined' ) {  
                    for (var i=0;i<data.instructorlist.length;i++) {
                        if (i > vm.colorlist.length) {
                            vm.instructorlist[i].backgroundcolor = vm.colorlist[vm.colorlist.length];
                            vm.instructorlist[i].textcolor = vm.colorlisthex[vm.colorlist.length];                        
                        } else {
                            vm.instructorlist[i].backgroundcolor = vm.colorlist[i];
                            vm.instructorlist[i].textcolor = vm.colorlisthex[i];
                        }
                    }
                }
                return vm.instructorlist;
            },
            function (error) {
                $log.debug('Caught an error getinstructorlist, going to notify:', error); 
                vm.thisTasknamelist = [];
                vm.message = error;
                Notification.error({message: error, delay: 5000});
                return ($q.reject(error));
            }).
            finally(function () { 
                vm.loading = false; 
                vm.loadAttempted = true;
            }
            );

    }

    function getTestTypes() {
        $log.debug('getTestTypes entered');
        var refreshpath = "../v1/testtypes";

         return TestingServices.getTestTypes(refreshpath).then(function(data){
                $log.debug('getTestTypes returned data');
                $log.debug(data);
                vm.testtypelist = data.testtypelist; 
                if (typeof data.testtypelist !== 'undefined') {
                    for (var i=0;i<data.testtypelist.length;i++) {
                        if (i > vm.colorlist.length) {
                            vm.testtypelist[i].backgroundcolor = vm.colorlist[vm.colorlist.length];
                            vm.testtypelist[i].textcolor = vm.colorlisthex[vm.colorlist.length];                        
                        } else {
                            vm.testtypelist[i].backgroundcolor = vm.colorlist[i];
                            vm.testtypelist[i].textcolor = vm.colorlisthex[i];
                        }
                    }
                }
                return vm.testtypelist;
            },
            function (error) {
                $log.debug('Caught an error getTestTypes, going to notify:', error); 
                vm.testtypelist = [];
                vm.message = error;
                Notification.error({message: error, delay: 5000});
                return ($q.reject(error));
            }).
            finally(function () { 
                vm.loading = false; 
                vm.loadAttempted = true;
            }
            );

    }


/*    function refreshStudents(theinput) {
        return StudentServices.refreshStudents(theinput).then(function(data){
                $log.debug('controller refreshStudents returned data');
                $log.debug(data);
                vm.refreshstudentlist = data;
                $log.debug('controller refreshstudentlist service data',vm.refreshstudentlist);
                return vm.refreshstudentlist;
            });
        
    }
*/
    
        function convertToMoment(thetime) {
            var testtime;
            //it has DST on the end
          if (typeof(thetime) !== 'undefined') {
/*            if (thetime.slice(-1,thetime.length) === "T" ) {
                testtime = new Date(thetime.slice(1,thetime.length - 4));
            } else {
                testtime = thetime;
            }
            */
            var m = moment(thetime,"MM/DD/YYYY hh:mm A z");
            $log.debug('convertToMoment: passed in: ',thetime,
                'isvalid?' ,m.isValid(),
                'where invalid', m.invalidAt());
            return moment(thetime,"MM/DD/YYYY hh:mm A z").tz('America/New_York').format('MM/DD/YYYY hh:mm A z');
        //24 hr?    return moment(testtime).utc().format("YYYY-MM-DDThh:mm:ss.SSS[Z]");
          }
        }
        function convertToMomentDST(thetime) {
          if (typeof(thetime) === 'undefined') {
              return;
          }
//          if (moment.isMoment(thetime) === true) {
 //           return moment(thetime).tz('America/New_York').format('z');              
 //         } else {
      //      var testtime = thetime.slice(-3, thetime.length);
   //         $log.debug('convertToMomentDST',thetime,testtime);
    //        return testtime;
            return moment(thetime).tz('America/New_York').format('z');
   //         }
        }
        function getEventList(qparm) {
//                var qparm =  typeof(vm.forUser) !== 'undefined' ? vm.forUser : 'ALL' ;
        var refreshpath = "../v1/getEventList?username=" + qparm;
                $log.debug('getEventList entered', qparm,refreshpath);

         return CalendarServices.getCalendarEvents(refreshpath).then(function(data){
                $log.debug('getCalendarEvents returned data');
                $log.debug(data, typeof(data.events));
                if (typeof(data.events) !== "undefined" ) {
                    for (var i = 0; i < data.events.length; i++ ){
    //                    data.events[i].end = moment(convertToMoment( data.events[i].end));
     //                   data.events[i].endtz = convertToMomentDST(data.events[i].end);
//                        data.events[i].start = moment(convertToMoment( data.events[i].start));
     //                   data.events[i].start = moment(convertToMoment( data.events[i].start)).tz('America/New_York').format('MM/DD/YYYY hh:mm A z');
    //                    data.events[i].starttz = convertToMomentDST(data.events[i].start);
    //                     data.events[i].startd = moment(data.events[i].startd,'YYYY-MM-DD');
                        $log.debug('reformat dates',data.events[i]);
        				var atimetoadd = {
        				    "title": data.events[i].title, 
        				    "time": data.events[i].start,
        				    "theevent": data.events[i],
        				    "id": data.events[i].id
        				};
                        data.events[i].end = moment(convertToMoment( data.events[i].end));
                        data.events[i].start = moment(convertToMoment( data.events[i].start));
                        data.events[i].startd = moment(data.events[i].startd,'YYYY-MM-DD');

                //        addListOfTimes(atimetoadd);

                    }

                    vm.events = data.events; 
                } else {
                    vm.events = {};
                }
                //temp for testing
               // Array.prototype.push.apply(vm.events, getEventListold());
                $log.debug(vm.events);
                CalendarServices.setNotifyList(vm.events);
                
    		    $('#calendar').fullCalendar('renderEvents', vm.events, true);

                return vm.events;
            },
            function (error) {
                $log.debug('Caught an error getEventList, going to notify:', error); 
                vm.events = [];
                vm.message = error;
                Notification.error({message: error, delay: 5000});
                return ($q.reject(error));
            }).
            finally(function () { 
                vm.loading = false; 
                vm.loadAttempted = true;
            }
            );
    }

/*    function sampleset() {
          var sample1 = displaytime(moment(vm.initTime).add(15,'seconds'));
          var sample2 = displaytime(moment(vm.initTime).add(20,'seconds'));
          var sample3 = displaytime(moment(vm.initTime).add(20,'seconds'));
          var sample4 = displaytime(moment(vm.initTime).add(45,'seconds'));
          vm.listOfTimes = [
            {"title": "sample1","time": sample1},
            {"title": "sample2","time": sample2},
            {"title": "sample3","time": sample3},
            {"title": "sample4","time": sample4}
          ];
        
    }
    */
/*    function getEventListold() {
        var someevents = [
          {title: 'First Event',
           start: displaytime(moment(vm.initTime).add(45,'hours')),
            end:  displaytime(moment(vm.initTime).add(47,'hours'))
          },
          {title: '2nd Event',
           start: displaytime(moment(vm.initTime).add(55,'hours')),
            end:  displaytime(moment(vm.initTime).add(57,'hours'))
          }
        ];
        return someevents;
        
    }
    */
/*    function addListOfTimes(timevalues) {
        $log.debug("add to time list", vm.listOfTimes, timevalues);
        //remove old one before adjusting the list
        removeListOfTimes(timevalues);
        vm.listOfTimes.push(timevalues);
        $log.debug("after add to time list", vm.listOfTimes, timevalues);
    }
    */
    /*
    function removeListOfTimes(timevalues) {
        $log.debug("remove from time list", vm.listOfTimes, timevalues);
          for (var niter=0,nlen=vm.listOfTimes.length;niter<nlen;niter++) {
           if (typeof(vm.listOfTimes[niter]) !== 'undefined') {
                //i think there is a transitional period where it is in 
                // process of being cleared that the count is wrong
                if(
                    vm.listOfTimes[niter].id === timevalues.id
                    ) {
                        $log.debug('dropping deleted one',vm.listOfTimes[niter]);
                        //remove if they were passed by in the loop above
                          vm.listOfTimes.splice(niter,1);
                }
            }
           }

    }
*/
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
            loadSidebar();
            loadTopbar();
            vm.filterstat = filterstat;

            var getdatestr = 'startdate';

            $q.all([
                    getUserDetails().then(function(){
                       $log.debug('getUserDetails returned'); 
                    }),
                    getUserList().then(function(){
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
        pass =  (           val.category === 'Inactive' && 
            val.type === 'ContactType' &&
            val.datetype === 'inactivedate' &&
            val.summaryvalue < 0);
//        $log.debug('filterstat',val,pass);

        return (pass);
    }
    $scope.data = {};
    $scope.header = {
        layout_menu:'',
        layout_topbar:'',
        animation:'',
        header_topbar:'static',
        boxed:''
    };
    
   $.fn.Data.Portlet('app.js');

    $('.portlet-scroll').slimScroll({
        "height": "250",
        "alwaysVisible": true
    });
    
    $scope.$on('$routeChangeSuccess', function (event, current, previous){
        $log.debug('routechange in app for success');
        vm.header.animation = 'fadeInUp';
        setTimeout(function(){
            vm.header.animation = '';
        }, 100);

//        getUserDetails().then(function(){
//           $log.debug('getUserDetails returned'); 
//        });

//        vm.userdta = UserServices.getUserDetails();
//        $log.debug('$routeChangeSuccess', vm.userdta);

        vm.data = $.fn.Data.get(current.originalPath);
        $log.debug('data in $routeChangeSuccess',vm.data);

        if(-1 == $.inArray(current.originalPath, ['/page-lock-screen', '/page-signup', '/page-signin','/reset-pwd','/change-pwd','/forget-pwd'])){
            $("body>.default-page").show();
            $("body>.extra-page").hide();
        }
        else{
            window.scrollTo(0,0);
        }
        vm.header.boxed = '';
        vm.header.layout_topbar = '';
        vm.header.layout_menu = '';
        vm.header.header_topbar = '';

        if('/layout-left-sidebar' === current.originalPath){
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

        else if('/' === current.originalPath){
            $('body').removeAttr('id'); // error 404, 500
        }
		else{
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
    $scope.$on('$routeChangeError', function (event, current, previous){
        $log.debug('routechange in app for error');
        $log.debug('originalPath');
        $log.debug(current.originalPath);
    });
    
       var eventDrag = function(el){
           $log.debug("eventdrag entered", el);
        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim(el.text()), // use the element's text as the event title
            id: uid()
        };

        // store the Event Object in the DOM element so we can get to it later
        el.data('eventObject', eventObject);
        $log.debug('drag after EventObject',el);

        // make the event draggable using jQuery UI
        el.draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });
    };


    $('#external-events div.external-event').each(function() {
        
        eventDrag($(this));
        $log.debug('external-events after drag',$(this));
        
    });
    $('#todos-list-sort > li > label.external-event').each(function() {
        
        eventDrag($(this));
        $log.debug('todos external-events after drag',$(this));
        
    });

    function onCalendarDayClick(date, jsEvent, view) {
        // Check to see whether the mouse was hovering over our day corner overlay 
        // that is itself applied to the fullCalendar's selection overlay div.
        // If it is, then we know we clicked on the day number and not some other 
        // part of the cell.
    //    if ($('.my-cell-overlay-day-corner').is(':hover')) {
    //        alert('Click!');
    //    }
        $log.debug('onCalendarDayClick entered', date, jsEvent, view);
        if ($(jsEvent.target).is('td')) { 
            // Clicked on the day number in the month view 
            $('#calendar').fullCalendar('changeView', 'agendaDay'); 
            $('#calendar').fullCalendar('gotoDate', date); 
        } 
        
    }

    function eventopen(calEvent) {
        $log.debug('eventopen enter', studentpick, $("#calEventDialogpick")[0], $("#reminderCheckbox").val(calEvent.reminderCheckbox));
  //          if (vm.studentpick.ID !== null) {
  //              $log.debug("studentpick exists", vm.studentpick.ID, $("#focusser-0"));
                $("#eventpick").val(studentpick.FullName);
//            }

            CalendarServices.setCurrentEvent(calEvent);
            $("#eventStartd").val(moment(calEvent.start).tz('America/New_York').format('MM/DD/YYYY'));
            
            $("#eventStart").val(moment(new Date(calEvent.start.toString())).tz('America/New_York').format('hh:mm A z'));
            $("#eventStarttz").val(moment(new Date(calEvent.start.toString())).tz('America/New_York').format('z'));
            
            $("#eventEnd").val(moment(new Date(calEvent.end.toString())).tz('America/New_York').format('hh:mm A z'));
            $("#eventEndtz").val(moment(new Date(calEvent.end.toString())).tz('America/New_York').format('z'));

            $('#eventStart').timepicker('setTime',  new Date(calEvent.start.toString()) );
            $('#eventEnd').timepicker('setTime',  new Date(calEvent.end.toString()) );
            
            if (calEvent.reminderCheckbox === 1 || calEvent.reminderCheckbox === true) {
                $("#reminderCheckbox").val(calEvent.reminderCheckbox).prop('checked', true);
            } else {     
                $("#reminderCheckbox").val(calEvent.reminderCheckbox).prop('checked', false);
            }
            $("#reminderInterval").val(calEvent.reminderInterval);
//            $("#userpick").val("number:" + calEvent.userpick);
            $("#userpick").val(calEvent.userpick);
            
            $("#eventid").val(calEvent.eventid);
            
            $('#calEventDialog #eventTitle').val(calEvent.title);
            $('#calEventDialog #allday').val(
                    [calEvent.className == "gbcs-partialday-event" ? "1" : "2"]
                ).prop('checked', true);
            $("#calEventDialog").dialog("option", "buttons", [
                {
                text: "Update",
                click: function() {
                    $log.debug('save in edit. note need to update', $('#eventpick'),$('#contactpicklist'),studentpick,$('#studentpick'));
                    var title = $('#eventTitle').val();
                    var startd = $('#eventStartd').val();
                    var start = $('#eventStart').val();
                    var end = $('#eventEnd').val();
                    var contactid = studentpick.ID;
                    var eventid = $('#eventid').val();
                    var eventclass = calEvent.className;
                    var color = calEvent.backgroundColor;
                    var textcolor = calEvent.textColor;
                    var eventtype = calEvent.eventtype;

                    var reminderInterval = $('#reminderInterval').val();
                    var userpick = $('#userpick').val();
                    var reminderCheckbox = $('#reminderCheckbox');
                    var screen = $(this);
                    $log.debug('before calsave',screen,title,startd,start,end,reminderCheckbox,reminderInterval,userpick,true,calEvent,contactid,eventid,eventclass,color,textcolor,eventtype);
                    
                    calsave(screen,title,startd,start,end,reminderCheckbox,reminderInterval,userpick,true,calEvent,contactid,eventid,eventclass,color,textcolor,eventtype);
                    $('#calendar').fullCalendar('unselect');

                    $(this).dialog("close");
                }},
            {
                text: "Delete",
                click: function() {
                    $log.debug('delete event entered',calEvent);

                /*    if ( calEvent.reminderCheckbox === true ) {
                        $log.debug('remove reminder time from event list',calEvent.reminderCheckbox, calEvent);
        				var atimetoremove = {
        				    "title": calEvent.title, 
        				    "time": calEvent.start,
        				    "id": calEvent.id
        				}
        				removeListOfTimes(atimetoremove);
                    } else {
                        $log.debug('do not neeed to remove reminder time from event list',calEvent.reminderCheckbox, calEvent);
                        
                    }
                    */

                    removeCalendarEvent(calEvent.id);
                    $('#calendar').fullCalendar('removeEvents', calEvent._id);                    
                    $(this).dialog("close");
                }},
            {
                text: "Cancel",
                click: function() {
                    $(this).dialog("close");
                }}
            ]);
            $("#calEventDialog").dialog("option", "title", "Edit Event");
            $('#calEventDialog').dialog('open');
        
    }



    // initialize the calendar
    // -----------------------------------------------------------------
  function initCalendar() {
//  $(document).ready(function() {
      $log.debug("callendar ready");
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        eventLimit: 3, // for all non-agenda views
        views: {
            agenda: {
                eventLimit: 3 // adjust to 6 only for agendaWeek/agendaDay
            }
        },         
//        timezone: 'America/New_York',
        events: vm.events,
//        events: getEventList(),
        timezone: 'local',
        timeFormat: 'hh:mm A z', 
        selectable: true,
        selectHelper: true,
    //    viewRender : onCalendarViewRender,
        dayClick   : onCalendarDayClick,
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar !!!
        
        drop: function(date, jsEvent, ui, resourceId) { // this function is called when something is dropped
            $log.debug('drop entered',date, jsEvent, ui, resourceId);
     //       $log.debug('drop entered',jsEvent.target.style.backgroundColor,date._ambigTime);
 
            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            if (date._ambigTime === true) {
                copiedEventObject.start = moment(date).tz('America/New_York').add(11,'hours');
                copiedEventObject.startd = moment(date).tz('America/New_York').add(11,'hours').format('MM/DD/YYYY');
            } else {
                copiedEventObject.start = moment(date).tz('America/New_York');
                copiedEventObject.startd = moment(date).tz('America/New_York').format('MM/DD/YYYY');
            }

            copiedEventObject.end = moment(copiedEventObject.start).add(2,'hours');
            $log.debug("copied end",copiedEventObject.end);
            copiedEventObject.backgroundColor = jsEvent.target.style.backgroundColor;
            copiedEventObject.textColor = jsEvent.target.style.color;
            copiedEventObject.eventtype = jsEvent.target.id;
            var inner = jsEvent.target.innerText;
    //        $log.debug('drop parsing',inner);
            var innerJ,desc;
            try {
                innerJ = JSON.parse(inner);
                desc = innerJ.details.name;
            } catch(e) {
    //            $log.debug('json parse err',e);
                innerJ = inner;   
                desc = inner;
            }
//            $log.debug('drop entered',innerJ);
 //           $log.debug('drop entered',desc);
            
            copiedEventObject.title = desc;
            copiedEventObject.description = innerJ;

    //mlc todo, use a db inserted id 
           saveCalendarEvent(copiedEventObject).then(function(){
                $log.debug("test looking for new eventid",vm.neweventid);
                copiedEventObject.id = vm.neweventid;
                copiedEventObject.eventid = vm.neweventid;
           //    copiedEventObject.mike = "mikeisgreat";
                //copiedEventObject.id = uid();
                
    //            copiedEventObject.allDay = allDay;
       //         $log.debug('after set copiedEventObject',copiedEventObject);
    
                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
    
                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                }
                
            }); 

        },
        select: function(start, end) {
            $log.debug('select entered', start, end);
            $("#eventStartd").val(moment(start).tz('America/New_York').format('MM/DD/YYYY'));
            $("#eventStart").val(moment(start).tz('America/New_York').format('hh:mm A z'));
            $("#eventEnd").val(moment(start).tz('America/New_York').format('hh:mm A z'));
            $log.debug('start',$("#eventStart"),'end',$("#eventEnd"));
//            $('#calEventDialog').dialog('open');
			},        
        eventClick: function(calEvent, jsEvent, view) {
            $log.debug('eventClick entered', calEvent, jsEvent, view);
            
            //get stu name if contactid set
            if (calEvent.contactid !== "" &&  calEvent.contactid !== "NULL") {
                    var path = '../v1/students/' + calEvent.contactid;
                    getStudent(path).then(function(data){
                        $log.debug("eventclick get studentname returned",data);
                        var fullname = data.FirstName + " " +data.LastName;
                        setstudent( {ID: data.ID, FirstName: data.FirstName, LastName: data.LastName, FullName: fullname});
                        $log.debug("student exit in eventclick",studentpick);
                        eventopen(calEvent);

                    }) ;      
            } else {
                setstudent({});
                eventopen(calEvent);
            }
            
        },

      eventDrop: function(event, delta, revertFunc) {

            $log.debug('eventdrop',event, event.title + " was dropped on " + event.startd, delta);

            var title = event.title;
            var startd = moment(event.startd).add(delta, 'seconds').tz('America/New_York').format('MM/DD/YYYY');
            var start = moment(event.start).tz('America/New_York').format('hh:mm A z');
            var end = moment(event.end).tz('America/New_York').format('hh:mm A z');

            var reminderInterval = event.reminderInterval;
            var userpick = event.userpick;
            var reminderCheckbox = event.reminderCheckbox;
            var contactid = event.contactid;
            var eventid = event.eventid;
            var eventclass = event.className;
            var color = event.backgroundColor;
            var textcolor = event.textColor;
            var eventtype = event.eventtype;
            var screen = $(this);
    
            if (!confirm("Are you sure about this change?")) {
                revertFunc();
            } else {

                    $log.debug('save in eventdrop');
                    $log.debug('before eventdrop calsave',screen,title,startd,start,end,reminderCheckbox,reminderInterval,userpick,true,event,contactid,eventid,eventclass,color, textcolor,eventtype);
                    
                    calsave(screen,title,startd,start,end,reminderCheckbox,reminderInterval,userpick,true,event,contactid,eventid,eventclass,color,textcolor,eventtype);
                
            }
            
        }        
    });
  
    var addEvent = function (name) {
        var thecolor = vm.mycolor;
        var thetextcolor = vm.textcolor;
        
        name = name.length === 0 ? "Untitled Event" : name;
        var html = $('<div class="external-event label label-default" style="background-color: ' + 
            thecolor + '!important; color:' + thetextcolor + ' !important;">' + name + '</div>');
        $('#event-block').append(html);
        eventDrag(html);
        $log.debug('after addEvent drag',html);
        
    };

    $('#event-add').on('click', function () {
        var name = $('#event-name').val();
        addEvent(name);
        $log.debug('after addEvent click',name);
    });
 // });
  }
  
    function settextcolor() {
        vm.textcolor = getColorByBgColor(vm.mycolor);
  //      vm.textcolor = 0xFFFFFF ^ vm.mycolor;
        $log.debug('settextcolor',vm.mycolor,vm.textcolor);
    }

//
// * Get color (black/white) depending on bgColor so it would be clearly seen.
// * @param bgColor
// * @returns {string}
//
function getColorByBgColor(bgColor) {
    $log.debug('getColorByBgColor',bgColor);
    if (!bgColor) { return ''; }
    return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
}    
    
// hexToComplimentary : Converts hex value to HSL, shifts
// hue by 180 degrees and then converts hex, giving complimentary color
// as a hex value
 // @param  [String] hex : hex value  
 // @return [String] : complimentary color as hex value
 //
function hexToComplimentary(hex){

    // Convert hex to rgb
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

    // Get array of RGB values
    rgb = rgb.replace(/[^\d,]/g, '').split(',');

    var r = rgb[0], g = rgb[1], b = rgb[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if(max == min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if(max == r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= 180;
    if (h > 360) { h -= 360; }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if(s === 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255); 
    b = Math.round(b * 255);

    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16); 
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
}  
    
    function loadTopbar() {
        $log.debug("loadTopbar");
        $("[data-toggle='offcanvas']").on('click', function () {
            $('#sidebar-wrapper').toggleClass('active');
            return false;
        });
        // Setting toggle in mobile view 
        $('#setting-toggle').click(function(){
            $log.debug('mobile toggle');
          $('.topbar-main').toggle();
        });
    }

    // Back To Top 
    $(window).scroll(function(){
        if ($(this).scrollTop() < 200) {
            $('#totop') .fadeOut();
        } else {
            $('#totop') .fadeIn();
        }
    });
    $('#totop').on('click', function(){
        $('html, body').animate({scrollTop:0}, 'fast');
        return false;
    });

    
     function loadSidebar(){
         $log.debug('loadSidebar');
            //BEGIN SIDEBAR FIXED
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                "height": $(window).height() - 50,
                'width': '250px',
                'wheelStep': 5
            });
            $(window).scroll(function(){
                if ($(this).scrollTop() > 50) {
                    if($('body').hasClass('topbar-fixed')){
                    } else{
                        $('.sidebar-fixed #sidebar-wrapper').css('top','0px');
                    }
                } else{
                    if($('body').hasClass('topbar-fixed')){
                    } else{
                        $('.sidebar-fixed #sidebar-wrapper').css('top','50px');
                    }
                }
            });
            //END SIDEBAR FIXED

            $('#menu-toggle').toggle(
                function() {
                $log.debug('menu-toggle');                    
                    if($('#wrapper').hasClass('right-sidebar')) {
                        $('body').addClass('right-side-collapsed');
                        $('.navbar-header').addClass('logo-collapsed');
                    } else{
                        $(this).find('i').removeClass('icon-arrow-left').addClass('icon-arrow-right');
                        $('body').addClass('left-side-collapsed');
                        $('.navbar-header').addClass('logo-collapsed');
                        $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({destroy: true});
                        $('#sidebar').css('height', 'auto');
                        $('#sidebar').css('width', '55px');
                        $('#sidebar').css('overflow', 'initial');
                        $('#sidebar .menu-scroll').css('overflow', 'initial');
                        $('body').removeClass('sidebar-fixed');
                    }
                }, function() {
                    if($('#wrapper').hasClass('right-sidebar')) {
                        $('body').removeClass('right-side-collapsed');
                        $('.navbar-header').removeClass('logo-collapsed');
                    } else{
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

            if($('#wrapper').hasClass('right-sidebar')) {
                $('ul#side-menu li').hover(function () {
                    if ($('body').hasClass('right-side-collapsed')) {
                        $(this).addClass('nav-hover');
                    }
                }, function () {
                    if ($('body').hasClass('right-side-collapsed')) {
                        $(this).removeClass('nav-hover');
                    }
                });
            } else{
                $('ul#side-menu li').hover(function () {
                    if ($('body').hasClass('left-side-collapsed')) {
                        $(this).addClass('nav-hover');
                    }
                }, function () {
                    if ($('body').hasClass('left-side-collapsed')) {
                        $(this).removeClass('nav-hover');
                    }
                });
            }

 
        }

        function getYType(index) {
            switch(index) {
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
            switch(index) {
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
            switch(category) {
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
    setTimeout(function(){
        //BEGIN TODOS LIST
        $("#todos-list-sort").sortable();
        $("#todos-list-sort").disableSelection();


        $('#todos-list-add').click(function() {
/*            var index = $('#todos-list-sort > li').length;
            var ht_txt = '<li><input type="checkbox" id="task-item-' + index
                + '" /><label for="task-item-' 
                + index + '" >' 
                + $("#todos-list-input").val() 
                + '</label><a class="delete" href="javascript:;" data-hover="tooltip" data-original-title="remove"><span class="fa fa-trash-o"></span></a></li>';
            $log.debug('todo add, index is:', index, ' and txt:', ht_txt);
            $('ul#todos-list-sort').append(ht_txt);
  */          updateTasknamelist($("#todos-list-input").val() ,'0');
            $("[data-hover='tooltip']").tooltip();
            return false;
        });
//        $( document ).on( 'click', '#todos-list-sort li a.delete', function() {
//            $log.debug('todo list remove entered');
//mlc         $('#todos-list-gen li a.delete').live('click', function() {
//            $(this).parent().remove();
//            removeTasknamelist($("#todos-list-input").val());
//        });
        //END TODOS LIST

    });
    }

    function genGraph() {
  //      $log.debug('genGraph entered');
    setTimeout(function(){
        var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');

        try {

        //BEGIN LINE CHART SPLINE
        //var d2_1 = [["Jan", 181],["Feb", 184],["Mar", 189],["Apr", 180],["May", 190],["Jun", 183],["Jul", 185],["Aug", 188],["Sep", 202]];
        
        var d2_1 = datToGraph(vm.studentstats,'month','summaryvalue','ContactType',getYType(0));
//        $log.debug('d2_1', d2_1);
        var d2_2 = datToGraph(vm.studentstats,'month','summaryvalue','ContactType',getYType(1));
//        $log.debug('d2_2', d2_2);
        var d2_3 = datToGraph(vm.studentstats,'month','summaryvalue','ContactType',getYType(3));
//        $log.debug('d2_3', d2_3);
        var d2_4 = datToGraph(vm.studentstats,'month','summaryvalue','ContactType',getYType(4));
//        $log.debug('d2_4', d2_4);

//        var d2_2 = [["Jan", -32],["Feb", -22],["Mar", -13],["Apr", -24],["May", -16],["Jun", -27],["Jul", -15],["Aug", -31],["Sep", -14]];
 //       var d2_3 = [["Jan", -16],["Feb", -34],["Mar", -12],["Apr", -35],["May", -15],["Jun", 0],["Jul", 0],["Aug", -15],["Sep", -16]];

        // Add a SumArray method to all arrays by expanding the Array prototype(do this once in a general place)
        Array.prototype.SumArray = function (arr) {
        //    $log.debug('sum:',arr,this);
            var sum = [];
            var sumx,sumy;
            if (arr !== null && this.length === arr.length) {
                for (var i = 0; i < arr.length; i++) {
                    sumy = parseFloat(this[i][1]) + parseFloat(arr[i][1]);
                    sumx = this[i][0];
                    sum.push([sumx,sumy]);
                }
                return sum;
            } else {
      //          $log.debug('sum: nothing to add');
                return this;            
            }
        
        };


        function gety(x,seriesIndex) {
            $log.debug('gety:',x,seriesIndex);
            var retvl=[];
            if (getYType(seriesIndex) !== 'Net') {
                var d2_1a = contentForGraph(vm.studentstats,
                                            'month',
                                            'summaryvalue',
                                            'ContactType',
                                            getYType(seriesIndex),
                                            getYStatus(seriesIndex)
                                            );
                $log.debug('gety d2_1a',d2_1a,x);
                for (var iter=0,len=d2_1a.length;iter<len;iter++) {
                    for(var diter=0,dlen=d2_1a[iter].length;diter<dlen;diter++) {
                        if(d2_1a[iter][diter].month === x) {
                            $log.debug('d2_1a content',d2_1a[iter][diter].details);
                            var dta = { "item": {
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
            } else {
                retvl = 'no text';
            }
            $log.debug('gety x',JSON.stringify(retvl));
            return(JSON.stringify(retvl));   
        }
        
        var d2_sum = d2_1.SumArray(d2_2).SumArray(d2_3).SumArray(d2_4);
     //   $log.debug('sumarr',d2_sum); // [6,8,10,12]

        $.plot("#line-chart-spline", [{
            data: d2_1,
            label: "Student",
            color: "#2ecc71"
        },{
            data: d2_2,
            label: "BlackBelt",
            color: "#3498db"
        },{
            data: d2_sum,
            label: "Net",
            color: "#aaaadd"
        },{
            data: d2_3,
            label: "Break",
            color: "#e74c3c"
        },{
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
           content: function(label, xval, yval, flotItem){
            //  $log.debug('flot %j',flotItem);
              var xy = JSON.parse(gety(xval,flotItem.seriesIndex));
              $log.debug('xy',xy,xval,yval,getYType(flotItem.seriesIndex));
//               return 'new students:<br/> <json-formatter json="'+ gety(xval,flotItem.seriesIndex) + 
//               '" open="1"></json-formatter> <br/> for:' + yval;
                var xx='';
                 if (xy !== 'no text' ) {
                    for (var iter=0,len=xy.length;iter<len;iter++) {
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
                $log.debug('xx',xx);
//               return 'new students: ' + xx + ' for:' + yval;
                xx +=  'Count:' + yval ;
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
            }], {
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
        var d7 = [["Jan", 200],["Feb", 178],["Mar", 130],["Apr", 150],["May", 220],["Jun", 320]];
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
        var d8_1 = [["Jan", 80],["Feb", 76],["Mar", 110],["Apr", 90],["May", 123],["Jun", 150],["Jul", 170]];
        var d8_2 = [["Jan", 70],["Feb", 49],["Mar", 70],["Apr", 60],["May", 86],["Jun", 100],["Jul", 150]];
        $.plot("#internet-speed-chart", [{
            data: d8_1,
            label: "Adults",
            color: "#c0392b"
        },{
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
        var d9_1 = [["Jan", 67],["Feb", 91],["Mar", 36],["Apr", 150],["May", 28],["Jun", 123],["Jul", 38]];
        var d9_2 = [["Jan", 59],["Feb", 49],["Mar", 45],["Apr", 94],["May", 76],["Jun", 22],["Jul", 31]];
        $.plot("#area-chart-spline-db", [{
            data: d9_1,
            label: "Adults",
            color: "#ffce54"
        },{
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

        } catch(e) {
                $log.debug(e.message, "from", e.stack);
                // You can send data to your server
                // sendError(data);
                //throw e;
        }

        
        //END CALENDAR
    },500);

    }
        function datToGraph(data, x, y, type, category) {
      //      $log.debug('datToGraph:',data, x,y,type,category);
            var res=[];

            for(var iter=0,len = data.length;iter<len;iter++) {
                var d = [];
                d[0] = data[iter][x];
                d[1] = data[iter][y];
                
                if(data[iter].type === type &&
                    data[iter].category === category) {
              //          $log.debug('datIf found:',d,data[iter].type,data[iter].category);
                        res.push(d);
                    }
            }
     //       $log.debug('datToGraph res:', res);
            return res;
        }
        function contentForGraph(data, x, y, type, category, status) {
            $log.debug('contentForGraph:',data, x,y,type,category,status);
            var res=[];

            for(var iter=0,len = data.length;iter<len;iter++) {
                var d = [];
                d[0] = data[iter][x];
                d[1] = data[iter].details;
                var dta;
                var dtaarr=[];
                for (var diter=0,dlen=d[1].length;diter<dlen;diter++) {
                    $log.debug('diter',d[1][diter]);
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
                        $log.debug('contentIf found:',dtaarr,data[iter].type,data[iter].category);
                        res.push(dtaarr);
                }  
                if( status === 'NotActive' &&
                    data[iter].type === type && 
                    data[iter].classstatus === category
                    ) {
                        $log.debug('contentIf found:',dtaarr,data[iter].type,data[iter].category);
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
                
                function ( response ) {
                    $log.debug('stats success:');
                    $log.debug(response);
                        response.data.studentstats.timeint = response.data.thedata.timeint;
                        vm.studentstats = response.data.studentstats; 
                        vm.studentstatsdetails = response.data.detailslist;
                        mergedata();
                        genGraph();
                        return response;
                },
                function ( response ) {
                    if (
                       ! angular.isObject( response.data ) ||
                        ! response.data.message
                    ) {
                        response.data.message =  "getStudentStats An unknown error occurred";
                    }
                    $log.debug(' getStudentStats error',response.data.message);
                    Notification.error({message: response.data.message, delay: 5000});
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
                function (data) {
                    $log.debug( 'getStudentStatsMonths returned data', data);
                },
                function(error) {
                        $log.debug(' getStudentStatsMonths error',error);
                        Notification.error({message: error, delay: 5000});
                        return ($q.reject(error));
                }
            );
            
        }

        function mergedata() {
      //      $log.debug('mergedata entered'); 
            for (var iter=0,len=vm.studentstats.length;iter<len;iter++ ){
                vm.studentstats[iter].details = [];
                for (var diter=0,lend=vm.studentstatsdetails.length;diter<lend;diter++ ){
     /*                   $log.debug('check a match', 
                            vm.studentstats[iter].month, 
                            vm.studentstatsdetails[diter].month, 
                            vm.studentstats[iter].datetype,
                            vm.studentstatsdetails[diter].datetype,
                            vm.studentstats[iter].type,
                            vm.studentstatsdetails[diter].type,
                            vm.studentstats[iter].category,
                            vm.studentstats[iter].classstatus,
                            vm.studentstatsdetails[diter].category
                            );
       */         
                    if (vm.studentstats[iter].month === vm.studentstatsdetails[diter].month
                        && 
                        vm.studentstats[iter].type === vm.studentstatsdetails[diter].type
                        &&
                        (vm.studentstats[iter].category === 'Inactive' || 
                        vm.studentstats[iter].category === 'Injured' ? 
                        vm.studentstats[iter].classstatus === vm.studentstatsdetails[diter].category :
                        vm.studentstats[iter].datetype === vm.studentstatsdetails[diter].datetype
                        && 
                        vm.studentstats[iter].category === vm.studentstatsdetails[diter].category
                        )
                    ) {
                        //todo: check if contacttype needs to be added to details to match in above too
                        var dta = {
                            'iter': diter,
                            'details': vm.studentstatsdetails[diter]
                        };
                        vm.studentstats[iter].details.push(dta);
            /*            $log.debug('found a match', 
                            vm.studentstats[iter].month, 
                            vm.studentstats[iter].datetype,
                            vm.studentstats[iter].details
                            );
              */          
                    }
                    
                }
            }
            
//            $log.debug('merged stats',vm.studentstats);
            
        }

 // }

/*
    EventPopController.$inject = [
        'StudentServices',
        'CalendarServices',
        '$log',
        '$q',
        'Notification',
        '$controller',
        '$scope'
        ];
    function EventPopController(
        StudentServices,
        CalendarServices,
        $log,
        $q,
        Notification,
        $controller,
        $scope
        ) {
*/                /* jshint validthis: true */
 //       var vm = this;
        
//        vm.vmclass = $controller('AppController as vmclass', {$scope: $scope});


    
    function refreshStudents(theinput) {
        return StudentServices.refreshStudents(theinput).then(function(data){
                $log.debug('controller refreshStudents returned data');
                $log.debug(data);
                vm.refreshstudentlist = data;
                $log.debug('controller refreshstudentlist service data',vm.refreshstudentlist);
                return vm.refreshstudentlist;
            });
        
    }


    }
})();
