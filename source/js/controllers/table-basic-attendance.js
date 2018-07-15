(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin.all')
        .controller('AttendanceTableBasicController', AttendanceTableBasicController);

    AttendanceTableBasicController.$inject = [
    '$routeParams',
    '$log',
    'AttendanceServices',
    '$location',
    '$window',
    '$q',
    '$scope',
    '$route',
    'Notification',
    'moment',
    'Util'
    ];

    function AttendanceTableBasicController($routeParams, $log, AttendanceServices, 
        $location, $window, $q, $scope, $route, Notification, moment, Util) {
        /* jshint validthis: true */

        var vm=this;
        var $ = angular.element;

       $.fn.Data.Portlet('table-basic-attendance.js');
    

        
        vm.refreshtheAttendanceClick = refreshtheAttendanceClick;
        vm.getAttendanceHistory = getAttendanceHistory;
        vm.setStudentReadyNextRank = setStudentReadyNextRank;
        vm.setLimit = setLimit;
        vm.setClass = setClass;
        vm.setDOW = setDOW;
        vm.setGridsize = setGridsize;
        vm.requery = requery;
        vm.selectItem = selectItem;
        vm.hasSelected = hasSelected;
        vm.getMonday = getMonday;
        vm.getFormattedDate = getFormattedDate;
        vm.getAttendingCount = getAttendingCount;
        vm.checkAttendance = checkAttendance;
        vm.checkAttendanceStats = checkAttendanceStats;
        vm.getActiveTab = getActiveTab;
        vm.setActiveTab = setActiveTab;
        vm.hasStats = hasStats;
        vm.reload = reload;
        vm.setday = setday;
        vm.DOWlist = [];
        vm.limit = 0;
        vm.limits = [10,20,50,100,200,500];
        vm.dowChoice ='';
        vm.theclass ='';
        vm.theclassid ='';
        vm.gridsize;
        vm.data = [];
        vm.classes = [];
        vm.radioModel;
        vm.attendancesum={};
        vm.showStats='';

        var weekday = new Array(7);
        weekday[0]=  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var tdays = new Array(7);
        tdays[0]=  "day1";
        tdays[1] = "day2";
        tdays[2] = "day3";
        tdays[3] = "day4";
        tdays[4] = "day5";
        tdays[5] = "day6";
        tdays[6] = "day7";

        vm.todayDOW ;
        vm.nowChoice = 0;
        vm.loading = true;
        vm.selectedItem = null;
        vm.checkResults = [];
        vm.photos = [];
        vm.attending = [];
        vm.MondayOfWeek;
        vm.TuesdayOfWeek;
        vm.WednesdayOfWeek;
        vm.ThursdayOfWeek;
        vm.FridayOfWeek;
        vm.SaturdayOfWeek;
        vm.SundayOfWeek;
        vm.radioModel;
        vm.checkModel = [];
        vm.daysSince = '';
        vm.daysAttended = '';


  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("table-basic-attendance started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("table-basic-attendance dismissed");
		$log.debugEnabled(false);
    });

        //setGridsize('col-md-12');
        setMonday();
        activate();

        function settoday(aDay){
            vm.todayDOW = aDay;
            $log.debug('settoday',aDay, vm.todayDOW);
        }
        function refreshtheAttendanceClick() {
                refreshtheAttendance().then(function(){
                }).catch(function(err) {
                   $log.debug(err); 
                });
        }
        function setday(aDay) {
            vm.photos=[];
            settoday(weekday[aDay]);
            getSchedule(vm.todayDOW).then(function() {
                setNowChoice();        
                $log.debug('nowChoice',vm.nowChoice,'classes',vm.classes);
                if (vm.classes.length > 0) {
                    setClass(vm.classes[vm.nowChoice].Description);
                }
                else {
                    setClass('All');
                }
                refreshtheAttendance().then(function(){
                    
                }).catch(angular.noop);
                $log.debug('setClass', vm.theclass);
             },function(error) {
                 vm.photos=[];
                 vm.nowChoice=0;
                 setClass("");
                 return ($q.reject(error));
             });
        }
        function setLimit(thelimit) {
            $log.debug('setLimit',thelimit);
            vm.limit = thelimit;
        }
        function setGridsize(size) {
            $log.debug('setGridsize',size);
            vm.gridsize = size;
            $scope.$emit('iso-method', {name:'arrange', params:null});
        }
        function reload() {
            $route.reload();
        }
        
        function setDOW(theChoice) {
            vm.dowChoice = theChoice;
            $log.debug('setDOW', vm.dowChoice);
        }
        function getDayNum(aDOW) {
            $log.debug('getDayNum', aDOW);
            for (var i=0, len=weekday.length; i < len; i++) {
                if ( weekday[i] == aDOW ) {
                    $log.debug('getDayNum returning', i);
                    return i;
                }
            }
        }
        function setClass(aClass) {
            $log.debug('setClass',aClass);
            vm.theclass = aClass;
        }

        function requery() {
            $log.debug('requery entered');
            vm.attending=[];
            refreshtheAttendanceClick();
            
        }

        function setMonday() {
            vm.MondayOfWeek = getMonday(new Date());
            var d2 = new Date(vm.MondayOfWeek);
/*            var day = d2.getDay();
            vm.SundayOfWeek    = getFormattedDate(d2.setDate(vm.MondayOfWeek.getDate() - day ));
            vm.TuesdayOfWeek   = getFormattedDate(d2.setDate(vm.MondayOfWeek.getDate() + day));
            vm.WednesdayOfWeek = getFormattedDate(d2.setDate(vm.MondayOfWeek.getDate() + day + day));
            vm.ThursdayOfWeek  = getFormattedDate(d2.setDate(vm.MondayOfWeek.getDate() + day + day + day));
            vm.FridayOfWeek    = getFormattedDate(d2.setDate(vm.MondayOfWeek.getDate() + day + day + day + day));
            vm.SaturdayOfWeek  = getFormattedDate(d2.setDate(vm.MondayOfWeek.getDate() + day + day + day + day + day));
        */
            vm.SundayOfWeek    = moment(d2).add(-1, 'days').format('YYYY-MM-DD');
            vm.TuesdayOfWeek   = moment(d2).add(1, 'days').format('YYYY-MM-DD');
            vm.WednesdayOfWeek = moment(d2).add(2, 'days').format('YYYY-MM-DD');
            vm.ThursdayOfWeek  = moment(d2).add(3, 'days').format('YYYY-MM-DD');
            vm.FridayOfWeek    = moment(d2).add(4, 'days').format('YYYY-MM-DD');
            vm.SaturdayOfWeek  = moment(d2).add(5, 'days').format('YYYY-MM-DD');
        
        }
        
        function getMonday(d) {
            $log.debug('getMonday',d);
            if (d === null) {
                d = new Date();
            } else {
                d = new Date(d);
            }
          var day = d.getDay(),
              diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
          return new Date(d.setDate(diff));
        }
        
        function getFormattedDate(date) {
            var d3 = new Date(date);
          var year = d3.getFullYear();
          var month = (1 + d3.getMonth()).toString();
          month = month.length > 1 ? month : '0' + month;
          var day = d3.getDate().toString();
          day = day.length > 1 ? day : '0' + day;
          return year + '-' + month + '-' + day;
        }
        
        function selectItem(item, indextoggle, card, callrefresh){
            $log.debug('selectItem', item, indextoggle, callrefresh);
            var found=false;
            var carddata={};
            var a = moment();
            var b;
            
            checkAttendance(item).then(function() {
                $log.debug('checkAttendance returns');

                b = moment((typeof(vm.attendancesum[0]) === 'undefined' ||
                    vm.attendancesum[0].lastPromoted === null) ? '01-01-1900' : vm.attendancesum[0].lastPromoted);

                card.daysSince = a.diff(b, 'days');
                card.daysAttended = ((typeof(vm.attendancesum[0]) === 'undefined' ||
                    vm.attendancesum[0].daysAttended === null) ? 0 : vm.attendancesum[0].daysAttended);
                

                for (var i=0, len=vm.attending.length; i < len; i++) {
                    $log.debug('is there?', item, vm.attending[i].attended);
                    if (vm.attending[i].attended == item && indextoggle === true) {
                        //already there, don't add
                        //does this actually happen?
                        carddata = vm.attending[i];
                        found=true;
                        break;
                    }
                    if (vm.attending[i].attended == item && indextoggle === false) {
                        //already there, remove
                        carddata = vm.attending[i];
                        carddata.attend = indextoggle;
                        vm.attending.splice(i,1);
                        found=true;
                        break;
                    }
                }
    
                //add
                if (found === false && indextoggle === true) {
                    carddata = {
                        attended: item,
                        attend: indextoggle,
                        class: vm.theclass,
                        theday: vm.todayDOW,
                        tday: vm.tday,
                        DOW: getFormattedDate(vm.MondayOfWeek),
                        student_id: item,
                        daynum: card.theday,
                        rank: card.rank,
                        classid: card.classid,
                        daysAttended: card.daysAttended,
                        daysSince: card.daysSince
                    };
                    vm.attending.push(carddata);
                }
    
                    $log.debug('selectedItem', vm.attending);
                    if (carddata != {} && callrefresh) {
                        updateAttendance(carddata).then(function() {
                            $log.debug('updateAttendance returns');
                         },function(error) {
                            $log.debug('updateAttendance',error);
                            return ($q.reject(error));
                         });
                    }            
                    
                 });
            
        }

        function hasSelected(item){
            for (var i=0, len=vm.attending.length; i < len; i++) {
                if (vm.attending[i].attended == item) {
                    return true;
                }
            }
            return false;
        }
        function hasStats(item){
            for (var i=0, len=vm.photos.length; i < len; i++) {
                if (vm.photos[i].studentID == item && vm.showStats == item) {
                    return true;
                }
            }
            return false;
        }

        function getAttendingCount(){
            return vm.attending.length;
        }
        
        function activate() {
            var d = new Date();
            var d2 = weekday[d.getDay()];
            $log.debug('weekday',d2);

            settoday(d2);
            vm.radioModel = vm.todayDOW;
            vm.checkModel = {
                Sunday:    weekday[0] == vm.todayDOW ? true : false ,
                Monday:    weekday[1] == vm.todayDOW ? true : false,
                Tuesday:   weekday[2] == vm.todayDOW ? true : false,
                Wednesday: weekday[3] == vm.todayDOW ? true : false,
                Thursday:  weekday[4] == vm.todayDOW ? true : false,
                Friday:    weekday[5] == vm.todayDOW ? true : false,
                Saturday:  weekday[6] == vm.todayDOW ? true : false
            };
            vm.tday = tdays[d.getDay()];

            
            $scope.$watchCollection('vm.checkModel', function () {
                vm.checkResults = [];
                angular.forEach(vm.checkModel, function (value, key) {
                    $log.debug('checkmodal', vm.checkResults);
                  if (value) {
                    vm.checkResults.push(key);
                  }
                });
             });
            $log.debug('b4 getDOW and schedule', vm.todayDOW);
            
            $q.all([
                    getDOW().then(function() {
                       setDOW(vm.getFormattedDate(vm.MondayOfWeek));
                       setLimit(100);
                   }),
                    getSchedule(vm.todayDOW).then(function() {
                        setNowChoice();        
                        $log.debug('nowChoice',vm.nowChoice,'classes',vm.classes);
                        if (vm.classes.length > 0) {
                            setClass(vm.classes[vm.nowChoice].Description);
                        }
                        else {
                            setClass('All');
                        }
                        $log.debug('setClass', vm.theclass);
                     },function(error) {
                         vm.photos=[];
                         vm.nowChoice=0;
                         setClass("");
                         return ($q.reject(error));
                     })
                ])
                .then(function() {
                     return refreshtheAttendance().then(function(zdata) {
                         $log.debug('refreshtheAttendance returned', zdata);
                     },function(error) {
                         return ($q.reject(error));
                     }).catch(angular.noop);
            });
        }
        
        function updateAttendance(card) {
            var updpath = "../v1/updateattendance";
            $log.debug('about updateAttendance ', card, updpath);
            return AttendanceServices.updateAttendance(updpath, card)
                .then(function(data){
                    $log.debug('updateAttendance returned data');
                    $log.debug(data);
                    vm.thisattendance = data;
                    $log.debug(vm.thisattendance);
                    $log.debug(vm.thisattendance.message);
                    vm.message = vm.thisattendance.message;
                    if ((typeof vm.thisattendance === 'undefined' || vm.thisattendance.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        return ($q.reject(data));
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
        
                    refreshtheAttendance().then
                        (function(zdata) {
                         $log.debug('refreshtheAttendance returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error refreshtheAttendance after update:', error); 
                            vm.data = [];
                            vm.photos = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        }).catch(angular.noop);

                    return vm.thisattendance;
                }).catch(function(e) {
                    $log.debug('updateAttendance failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }

        function refreshtheAttendance() {
            $log.debug('refreshtheAttendance entered with radioModel', vm.radioModel);
            var pclass = vm.theclass.length > 0 ? vm.theclass : 'NULL';
            $log.debug('pclass:', pclass);
            var thisdaynum = getDayNum(vm.radioModel);
            
            var refreshpath = encodeURI('../v1/studentregistration?thedow=' + 
                vm.dowChoice + '&thelimit=' + 
                vm.limit + '&theclass=' + 
                pclass + '&daynum=' + thisdaynum);

            $log.debug('refreshtheAttendance path:', refreshpath);
            
             return AttendanceServices.refreshAttendances(refreshpath).then(function(data){
                    $log.debug('refreshAttendances returned data');
                    $log.debug(data);
                    vm.data = data; 
                    $log.debug(vm.data.message);
                    vm.message = vm.data.message;
                    if ((typeof vm.data === 'undefined' || vm.data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.warning({message: vm.message, delay: 5000});
                        vm.data = [];
                        vm.photos = [];
                        return ($q.reject(data));
                    } else {
                //        Notification.success({message: vm.message, delay: 5000});
                    }

                    
                    vm.photos = [];
                    vm.attending = [];
                    for (var i = 0, len=vm.data.attendancelist.length; i < len; i++) {
                        vm.photos.push({id: 'photo-' + i, 
                            src: './images/students/' + vm.data.attendancelist[i].pictureurl,
                            name: vm.data.attendancelist[i].firstname 
                                + ' ' + vm.data.attendancelist[i].lastname,
                            firstname: vm.data.attendancelist[i].firstname,
                            lastname: vm.data.attendancelist[i].lastname,
                            studentID: vm.data.attendancelist[i].ContactId,
                            rank: vm.data.attendancelist[i].rank,
                            class: vm.data.attendancelist[i].class,
                            classid: vm.data.attendancelist[i].classid,
                            theday: vm.data.attendancelist[i].DOWnum,
                            MondayDOW: vm.data.attendancelist[i].MondayOfWeek,
                            attended: vm.data.attendancelist[i].attended,
                            showIndex: vm.data.attendancelist[i].attended == 1 ? true : false,
                            readyness: vm.data.attendancelist[i].readyness
                        });
                        if (vm.data.attendancelist[i].attended == 1 ) {
                            selectItem(vm.data.attendancelist[i].ContactId, true, vm.photos[i], false);
                        }
                    }
                    $log.debug('photos',vm.photos);
                    return vm.data;
                },
                function (error) {
                    $log.debug('Caught an error refreshtheAttendance, going to notify:', error); 
                    vm.data = [];
                    vm.photos = [];
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

        function getAttendanceHistory() {
            $log.debug('getAttendanceHistory entered');
            var pclass = vm.theclass.length > 0 ? vm.theclass : 'NULL';
            $log.debug('pclass:', pclass);
            
            var refreshpath = encodeURI('../v1/attendancehistory?thedow=' + vm.dowChoice + '&thelimit=' + vm.limit + '&theclass=' + pclass);

            $log.debug('getAttendanceHistory path:', refreshpath);
            
             return AttendanceServices.getAttendanceHistory(refreshpath).then(function(data){
                    $log.debug('getAttendanceHistory returned data');
                    $log.debug(data);
                    vm.data = data; 
                    return vm.data;
                },
                function (error) {
                    $log.debug('Caught an error attendancehistory:', error); 
                    vm.data = [];
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

        function getDOW() {
            return AttendanceServices.getDOW().then(function(data){
                    $log.debug('getDOW returned data');
                    $log.debug(data);
                    vm.DOWlist = data.DOWlist;
                    return vm.DOWlist;
                });
        }

        function fillClassList() {
            vm.classes=[];
            for (var i=0; i < vm.Schedulelist.length; i++) {
/*               $log.debug('DayOfWeek',vm.Schedulelist[i].DayOfWeek);
               $log.debug('TimeRange',vm.Schedulelist[i].TimeRange);
               $log.debug('timestart',vm.Schedulelist[i].TimeStart);
               $log.debug('timeend',vm.Schedulelist[i].TimeEnd);
              */ 
               vm.classes.push(vm.Schedulelist[i] );
            }
            
        }
        
        function setNowChoice() {
            vm.nowChoice=0;
    //        vm.classes=[];
            var d = new Date();
            var y = d.getFullYear();
            var h = d.getHours();
            var mm = d.getMinutes();
            
            for (var i=0; i < vm.classes.length; i++) {
               var start = vm.classes[i].TimeStart.split(":");
               var starth = start[0];
               var dstplus = isDST(d) ? 1 : 0;
               var startmm = start[1];
               var end = vm.classes[i].TimeEnd.split(":");
               $log.debug('end',end);
               var endh = end[0];
               var endmm = end[1];
               var d1=new Date(parseInt(d.getFullYear(),10),
                    (parseInt(d.getMonth(),10)),
                     parseInt(d.getDate(),10),
                     parseInt(starth,10),
                     parseInt(startmm,10),
                     parseInt(d.getSeconds(),10));
                var d2=new Date(parseInt(d.getFullYear(),10),
                    (parseInt(d.getMonth(),10)),
                     parseInt(d.getDate(),10),
                     parseInt(endh,10),
                     parseInt(endmm,10),
                     parseInt(d.getSeconds(),10));
                $log.debug('startdate',d1);
                $log.debug('enddate',d2);
                var startdate=d1.valueOf();
                var enddate=d2.valueOf();                       
               //making start inclusive and end not
//               if (d.valueOf()<enddate && d.valueOf()>=startdate) {
                if (moment().isBefore(moment(d2),'minute') && moment().isSameOrAfter(moment(d1),'minute')) {
                   vm.nowChoice = i; //note there may be nmultiples and this will pick the last
                   $log.debug('nowChoice',vm.nowChoice);
               }
            //   vm.classes.push(vm.Schedulelist[i] );
            }
            
        }
        function isDST(t) { //t is the date object to check, returns true if daylight saving time is in effect.
            var jan = new Date(t.getFullYear(),0,1);
            var jul = new Date(t.getFullYear(),6,1);
            return Math.min(jan.getTimezoneOffset(),jul.getTimezoneOffset()) == t.getTimezoneOffset();  
        }        
        function getSchedule(aDOW) {
            $log.debug('getSchedule',aDOW);
            var path='../v1/schedule/' + aDOW;

            return AttendanceServices.getSchedule(path).then(function(data){
                    $log.debug('getSchedule returned data');
                    $log.debug(data);
                    vm.Schedulelist = data.Schedulelist;
                    fillClassList();
                }, function(error) {
                    $log.debug('Caught an error getSchedule:', error); 
                    vm.Schedulelist = [];
                    fillClassList();
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }

        function setActiveTab( activeTab ){
            $log.debug('set activetab as:', activeTab);
            AttendanceServices.setActiveTab(activeTab);
        }

        function getActiveTab(){
            return AttendanceServices.getActiveTab();
        }

        function setStudentReadyNextRank(thestudent,readyness) {
            $log.debug('about setStudentReadyNextRank ', thestudent, readyness);
            var path='../v1/readynextrank/' + thestudent;
            var theclassid = Util.getByValue(vm.classes, vm.theclass, 'Description', 'classid');
            
            return AttendanceServices.setStudentReadyNextRank(path, readyness, theclassid).then(function (data) {
                $log.debug("setStudentReadyNextRank returned data", data);
                $log.debug(data);
                }, function(error) {
                    $log.debug('Caught an error setStudentReadyNextRank:', error); 
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }
                );
        }
        
        function checkAttendanceStats(thestudent) {
            vm.showStats = thestudent;
            var a= moment();
            var b;
            checkAttendance(thestudent).then(function() {
                b = moment((typeof(vm.attendancesum[0]) === 'undefined' ||
                    vm.attendancesum[0].lastPromoted === null) ? '01-01-1900' : vm.attendancesum[0].lastPromoted);
                vm.daysSince = a.diff(b, 'days');
                vm.daysAttended = vm.attendancesum[0].daysAttended;
            });
        }
        function checkAttendance(thestudent) {
            $log.debug('about checkAttendance ', thestudent);
            var pclass = vm.theclass.length > 0 ? vm.theclass : 'NULL';
            $log.debug('pclass:', pclass);

            var path = encodeURI('../v1/Attendancesum?contactid=' + thestudent + '&theclass=' + pclass );

            $log.debug('checkAttendance path:', path);
            
            return AttendanceServices.getAttendanceSum(path).then(function (data) {
                    $log.debug("getAttendanceSum returned data", data);
                    $log.debug(data);
                    vm.attendancesum = data.attendancesum;
                    $log.debug(vm.data.message);
                    vm.message = vm.data.message;
                    if ((typeof vm.attendancesum === 'undefined' || vm.attendancesum.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.warning({message: vm.message, delay: 5000});
                        return($q.reject(data));
                    } else {
                //        Notification.success({message: vm.message, delay: 5000});
                    }
                
                }, function(error) {
                    $log.debug('Caught an error getAttendanceSum:', error); 
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }
                );
        }
        
    }

})(window,window.angular);
