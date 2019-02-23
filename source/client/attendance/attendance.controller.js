import angular from 'angular';

export class AttendanceTableBasicController {
   constructor(
      $routeParams, $log, AttendanceServices,
      $location, $window, $q, $scope, $route, Notification, moment, Util, portalDataService,UserServices
   ) {
      'ngInject';
      this.$routeParams = $routeParams;
      this.$log = $log;
      this.AttendanceServices = AttendanceServices;
      this.$location = $location;
      this.$window = $window;
      this.$q = $q;
      this.$scope = $scope;
      this.$route = $route;
      this.Notification = Notification;
      this.moment = moment;
      this.Util = Util;
      this.portalDataService = portalDataService;
      this.UserServices = UserServices;
   }
   $onInit() {

      var vm = this;

      vm.DOWlist = [];
      vm.limit = 0;
      vm.limits = [10, 20, 50, 100, 200, 500];
      vm.dowChoice = '';
      vm.theclass = '';
      vm.theclassid = '';
      vm.gridsize;
      vm.data = [];
      vm.classes = [];
      vm.radioModel;
      vm.attendancesum = {};
      vm.showStats = '';
      vm.showGrid = true;

      vm.weekday = new Array(7);
      vm.weekday[0] = "Sunday";
      vm.weekday[1] = "Monday";
      vm.weekday[2] = "Tuesday";
      vm.weekday[3] = "Wednesday";
      vm.weekday[4] = "Thursday";
      vm.weekday[5] = "Friday";
      vm.weekday[6] = "Saturday";

      vm.tdays = new Array(7);
      vm.tdays[0] = "day1";
      vm.tdays[1] = "day2";
      vm.tdays[2] = "day3";
      vm.tdays[3] = "day4";
      vm.tdays[4] = "day5";
      vm.tdays[5] = "day6";
      vm.tdays[6] = "day7";

      vm.todayDOW = null;
      vm.nowChoice = 0;
      vm.loading = true;
      vm.selectedItem = null;
      vm.checkResults = [];
      vm.photos = [];
      vm.attending = [];
      vm.MondayOfWeek = null;
      vm.TuesdayOfWeek = null;
      vm.WednesdayOfWeek = null;
      vm.ThursdayOfWeek = null;
      vm.FridayOfWeek = null;
      vm.SaturdayOfWeek = null;
      vm.SundayOfWeek = null;
      vm.radioModel = null;
      vm.checkModel = [];
      vm.daysSince = '';
      vm.daysAttended = '';

      //setGridsize('col-md-12');
      vm.activate();
   }
   $onDestroy() {
      this.$log.log("attendance dismissed");
      //this.$log.logEnabled(false);
      this.showGrid = false;
      this.photos=[];
   };

   settoday(aDay) {
      var vm = this;
      vm.todayDOW = aDay;
      vm.$log.log('settoday', aDay, vm.todayDOW);
   }
   refreshtheAttendanceClick() {
      var vm = this;
      vm.refreshtheAttendance().then(function() {}).catch(function(err) {
         vm.$log.log(err);
      });
   }
   setday(aDay) {
      var vm = this;
      vm.photos = [];
      vm.settoday(vm.weekday[aDay]);
      vm.getSchedule(vm.todayDOW).then(function() {
         vm.setNowChoice();
         vm.$log.log('nowChoice', vm.nowChoice, 'classes', vm.classes);
         if (vm.classes.length > 0) {
            vm.setClass(vm.classes[vm.nowChoice].Description);
         }
         else {
            vm.setClass('All');
         }
         vm.refreshtheAttendance().then(function() {

         }).catch(angular.noop);
         vm.$log.log('setClass', vm.theclass);
      }, function(error) {
         vm.photos = [];
         vm.nowChoice = 0;
         vm.setClass("");
         return (vm.$q.reject(error));
      });
   }
   setLimit(thelimit) {
      var vm = this;
      vm.$log.log('setLimit', thelimit);
      vm.limit = thelimit;
   }
   setGridsize(size) {
      var vm = this;
      vm.$log.log('setGridsize', size);
      vm.gridsize = size;
      vm.$scope.$emit('iso-method', { name: 'arrange', params: null });
   }
   reload() {
      var vm = this;
      vm.$route.reload();
   }

   setDOW(theChoice) {
      var vm = this;
      vm.dowChoice = theChoice;
      vm.$log.log('setDOW', vm.dowChoice);
   }
   getDayNum(aDOW) {
      var vm = this;
      vm.$log.log('getDayNum', aDOW);
      for (var i = 0, len = vm.weekday.length; i < len; i++) {
         if (vm.weekday[i] == aDOW) {
            vm.$log.log('getDayNum returning', i);
            return i;
         }
      }
   }
   setClass(aClass) {
      var vm = this;
      vm.$log.log('setClass', aClass);
      vm.theclass = aClass;
   }

   requery() {
      var vm = this;
      vm.$log.log('requery entered');
      vm.attending = [];
      vm.refreshtheAttendanceClick();

   }

   setMonday() {
      var vm = this;
      vm.MondayOfWeek = vm.getMonday(new Date());
      var d2 = new Date(vm.MondayOfWeek);
      vm.SundayOfWeek = vm.moment(d2).add(-1, 'days').format('YYYY-MM-DD');
      vm.TuesdayOfWeek = vm.moment(d2).add(1, 'days').format('YYYY-MM-DD');
      vm.WednesdayOfWeek = vm.moment(d2).add(2, 'days').format('YYYY-MM-DD');
      vm.ThursdayOfWeek = vm.moment(d2).add(3, 'days').format('YYYY-MM-DD');
      vm.FridayOfWeek = vm.moment(d2).add(4, 'days').format('YYYY-MM-DD');
      vm.SaturdayOfWeek = vm.moment(d2).add(5, 'days').format('YYYY-MM-DD');

   }

   getMonday(d) {
      var vm = this;
      vm.$log.log('getMonday', d);
      if (d === null) {
         d = new Date();
      }
      else {
         d = new Date(d);
      }
      var day = d.getDay(),
         diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
   }


   selectItem(item, indextoggle, card, callrefresh) {
      var vm = this;
      vm.$log.log('selectItem', item, indextoggle, callrefresh);
      var found = false;
      var carddata = {};
      var a = vm.moment();
      var b;

      vm.checkAttendance(item).then(function() {
         vm.$log.log('checkAttendance returns');

         b = vm.moment((typeof(vm.attendancesum[0]) === 'undefined' ||
            vm.attendancesum[0].lastPromoted === null) ? '01-01-1900' : vm.attendancesum[0].lastPromoted);

         card.daysSince = a.diff(b, 'days');
         card.daysAttended = ((typeof(vm.attendancesum[0]) === 'undefined' ||
            vm.attendancesum[0].daysAttended === null) ? 0 : vm.attendancesum[0].daysAttended);


         for (var i = 0, len = vm.attending.length; i < len; i++) {
            vm.$log.log('is there?', item, vm.attending[i].attended);
            if (vm.attending[i].attended == item && indextoggle === true) {
               //already there, don't add
               //does this actually happen?
               carddata = vm.attending[i];
               found = true;
               break;
            }
            if (vm.attending[i].attended == item && indextoggle === false) {
               //already there, remove
               carddata = vm.attending[i];
               carddata.attend = indextoggle;
               vm.attending.splice(i, 1);
               found = true;
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
               DOW: vm.Util.geteFormattedDate(vm.MondayOfWeek),
               student_id: item,
               daynum: card.theday,
               rank: card.rank,
               classid: card.classid,
               daysAttended: card.daysAttended,
               daysSince: card.daysSince
            };
            vm.attending.push(carddata);
         }

         vm.$log.log('selectedItem', vm.attending);
         if (carddata != {} && callrefresh) {
            vm.updateAttendance(carddata).then(function() {
               vm.$log.log('updateAttendance returns');
            }, function(error) {
               vm.$log.log('updateAttendance', error);
               return (vm.$q.reject(error));
            });
         }

      });

   }

   hasSelected(item) {
      var vm = this;
      for (var i = 0, len = vm.attending.length; i < len; i++) {
         if (vm.attending[i].attended == item) {
            return true;
         }
      }
      return false;
   }
   hasStats(item) {
      var vm = this;
      for (var i = 0, len = vm.photos.length; i < len; i++) {
         if (vm.photos[i].studentID == item && vm.showStats == item) {
            return true;
         }
      }
      return false;
   }

   getAttendingCount() {
      var vm = this;
      return vm.attending.length;
   }
   activate() {
      var vm = this;

      this.portalDataService.Portlet('table-basic-attendance');
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('AttendanceTableBasicController',vm.UserServices.isDebugEnabled());
        }

      vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
         //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
         vm.$log.log("table-basic-attendance started");

      });
      vm.setMonday();

      var d = new Date();
      var d2 = vm.weekday[d.getDay()];
      vm.$log.log('weekday', d2);

      vm.settoday(d2);
      vm.radioModel = vm.todayDOW;
      vm.checkModel = {
         Sunday: vm.weekday[0] == vm.todayDOW ? true : false,
         Monday: vm.weekday[1] == vm.todayDOW ? true : false,
         Tuesday: vm.weekday[2] == vm.todayDOW ? true : false,
         Wednesday: vm.weekday[3] == vm.todayDOW ? true : false,
         Thursday: vm.weekday[4] == vm.todayDOW ? true : false,
         Friday: vm.weekday[5] == vm.todayDOW ? true : false,
         Saturday: vm.weekday[6] == vm.todayDOW ? true : false
      };
      vm.tday = vm.tdays[d.getDay()];


      vm.$scope.$watchCollection('vm.checkModel', function() {
         vm.checkResults = [];
         angular.forEach(vm.checkModel, function(value, key) {
            vm.$log.log('checkmodal', vm.checkResults);
            if (value) {
               vm.checkResults.push(key);
            }
         });
      });
      vm.$log.log('b4 getDOW and schedule', vm.todayDOW);

      vm.$q.all([
            vm.getDOW().then(function() {
               vm.setDOW(vm.Util.geteFormattedDate(vm.MondayOfWeek));
               vm.setLimit(100);
            }),
            vm.getSchedule(vm.todayDOW).then(function() {
               vm.setNowChoice();
               vm.$log.log('nowChoice', vm.nowChoice, 'classes', vm.classes);
               if (vm.classes.length > 0) {
                  vm.setClass(vm.classes[vm.nowChoice].Description);
               }
               else {
                  vm.setClass('All');
               }
               vm.$log.log('setClass', vm.theclass);
            }, function(error) {
               vm.photos = [];
               vm.nowChoice = 0;
               vm.setClass("");
               return (vm.$q.reject(error));
            })
         ])
         .then(function() {
            return vm.refreshtheAttendance().then(function(zdata) {
               vm.$log.log('refreshtheAttendance returned', zdata);
            }, function(error) {
               return (vm.$q.reject(error));
            }).catch(angular.noop);
         });
   }

   updateAttendance(card) {
      var vm = this;
      var updpath = "../v1/updateattendance";
      vm.$log.log('about updateAttendance ', card, updpath);
      return vm.AttendanceServices.updateAttendance(updpath, card)
         .then(function(data) {
            vm.$log.log('updateAttendance returned data');
            vm.$log.log(data);
            vm.thisattendance = data;
            vm.$log.log(vm.thisattendance);
            vm.$log.log(vm.thisattendance.message);
            vm.message = vm.thisattendance.message;
            if ((typeof vm.thisattendance === 'undefined' || vm.thisattendance.error === true) &&
               typeof data !== 'undefined') {
               vm.Notification.error({ message: vm.message, delay: 5000 });
               return (vm.$q.reject(data));
            }
            else {
               vm.Notification.success({ message: vm.message, delay: 5000 });
            }

            vm.refreshtheAttendance().then(function(zdata) {
                  vm.$log.log('refreshtheAttendance returned', zdata);
               },
               function(error) {
                  vm.$log.log('Caught an error refreshtheAttendance after update:', error);
                  vm.data = [];
                  vm.photos = [];
                  vm.message = error;
                  vm.Notification.error({ message: error, delay: 5000 });
                  return (vm.$q.reject(error));
               }).catch(angular.noop);

            return vm.thisattendance;
         }).catch(function(e) {
            vm.$log.log('updateAttendance failure:');
            vm.$log.log("error", e);
            vm.message = e;
            vm.Notification.error({ message: e, delay: 5000 });
            throw e;
         });
   }

   refreshtheAttendance() {
      var vm = this;
      vm.$log.log('refreshtheAttendance entered with radioModel', vm.radioModel);
      var pclass = vm.theclass.length > 0 ? vm.theclass : 'NULL';
      vm.$log.log('pclass:', pclass);
      var thisdaynum = vm.getDayNum(vm.radioModel);

      var refreshpath = encodeURI('../v1/studentregistration?thedow=' +
         vm.dowChoice + '&thelimit=' +
         vm.limit + '&theclass=' +
         pclass + '&daynum=' + thisdaynum);

      vm.$log.log('refreshtheAttendance path:', refreshpath);

      return vm.AttendanceServices.refreshAttendances(refreshpath).then(function(data) {
            vm.$log.log('refreshAttendances returned data');
            vm.$log.log(data);
            vm.data = data;
            vm.$log.log(vm.data.message);
            vm.message = vm.data.message;
            if ((typeof vm.data === 'undefined' || vm.data.error === true) &&
               typeof data !== 'undefined') {
               vm.Notification.warning({ message: vm.message, delay: 5000 });
               vm.data = [];
               vm.photos = [];
               return (vm.$q.reject(data));
            }
            else {
               //        Notification.success({message: vm.message, delay: 5000});
            }


            vm.photos = [];
            vm.attending = [];
            for (var i = 0, len = vm.data.attendancelist.length; i < len; i++) {
               vm.photos.push({
                  id: 'photo-' + i,
                  src: './images/students/' + vm.data.attendancelist[i].pictureurl,
                  name: vm.data.attendancelist[i].firstname +
                     ' ' + vm.data.attendancelist[i].lastname,
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
                  stats: false,
                  readyness: vm.data.attendancelist[i].readyness
               });
               if (vm.data.attendancelist[i].attended == 1) {
                  vm.selectItem(vm.data.attendancelist[i].ContactId, true, vm.photos[i], false);
               }
            }
            vm.$log.log('photos', vm.photos);
            vm.showGrid=true;
            return vm.data;
         },
         function(error) {
            vm.$log.log('Caught an error refreshtheAttendance, going to notify:', error);
            vm.data = [];
            vm.photos = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));
         }).
      finally(function() {
         vm.loading = false;
         vm.loadAttempted = true;
      });

   }

   getAttendanceHistory() {
      var vm = this;
      vm.$log.log('getAttendanceHistory entered');
      var pclass = vm.theclass.length > 0 ? vm.theclass : 'NULL';
      vm.$log.log('pclass:', pclass);

      var refreshpath = encodeURI('../v1/attendancehistory?thedow=' + vm.dowChoice + '&thelimit=' + vm.limit + '&theclass=' + pclass);

      vm.$log.log('getAttendanceHistory path:', refreshpath);

      return vm.AttendanceServices.getAttendanceHistory(refreshpath).then(function(data) {
            vm.$log.log('getAttendanceHistory returned data');
            vm.$log.log(data);
            vm.data = data;
            return vm.data;
         },
         function(error) {
            vm.$log.log('Caught an error attendancehistory:', error);
            vm.data = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));
         }).
      finally(function() {
         vm.loading = false;
         vm.loadAttempted = true;
      });

   }

   getDOW() {
      var vm = this;
      return vm.AttendanceServices.getDOW().then(function(data) {
         vm.$log.log('getDOW returned data');
         vm.$log.log(data);
         vm.DOWlist = data.DOWlist;
         return vm.DOWlist;
      });
   }

   fillClassList() {
      var vm = this;
      vm.classes = [];
      for (var i = 0; i < vm.Schedulelist.length; i++) {
         vm.classes.push(vm.Schedulelist[i]);
      }

   }

   setNowChoice() {
      var vm = this;
      vm.nowChoice = 0;
      //        vm.classes=[];
      var d = new Date();
      var y = d.getFullYear();
      var h = d.getHours();
      var mm = d.getMinutes();

      for (var i = 0; i < vm.classes.length; i++) {
         var start = vm.classes[i].TimeStart.split(":");
         var starth = start[0];
         var dstplus = vm.isDST(d) ? 1 : 0;
         var startmm = start[1];
         var end = vm.classes[i].TimeEnd.split(":");
         vm.$log.log('end', end);
         var endh = end[0];
         var endmm = end[1];
         var d1 = new Date(parseInt(d.getFullYear(), 10),
            (parseInt(d.getMonth(), 10)),
            parseInt(d.getDate(), 10),
            parseInt(starth, 10),
            parseInt(startmm, 10),
            parseInt(d.getSeconds(), 10));
         var d2 = new Date(parseInt(d.getFullYear(), 10),
            (parseInt(d.getMonth(), 10)),
            parseInt(d.getDate(), 10),
            parseInt(endh, 10),
            parseInt(endmm, 10),
            parseInt(d.getSeconds(), 10));
         vm.$log.log('startdate', d1);
         vm.$log.log('enddate', d2);
         //         var startdate = d1.valueOf();
         //         var enddate = d2.valueOf();
         if (vm.moment().isBefore(vm.moment(d2), 'minute') && vm.moment().isSameOrAfter(vm.moment(d1), 'minute')) {
            vm.nowChoice = i; //note there may be nmultiples and this will pick the last
            vm.$log.log('nowChoice', vm.nowChoice);
         }
      }

   }
   isDST(t) { //t is the date object to check, returns true if daylight saving time is in effect.
      var jan = new Date(t.getFullYear(), 0, 1);
      var jul = new Date(t.getFullYear(), 6, 1);
      return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) == t.getTimezoneOffset();
   }
   getSchedule(aDOW) {
      var vm = this;
      vm.$log.log('getSchedule', aDOW);
      var path = '../v1/schedule/' + aDOW;

      return vm.AttendanceServices.getSchedule(path).then(function(data) {
         vm.$log.log('getSchedule returned data');
         vm.$log.log(data);
         vm.Schedulelist = data.Schedulelist;
         vm.fillClassList();
      }, function(error) {
         vm.$log.log('Caught an error getSchedule:', error);
         vm.Schedulelist = [];
         vm.fillClassList();
         vm.message = error;
         vm.Notification.error({ message: error, delay: 5000 });
         return (vm.$q.reject(error));

      });
   }

   setActiveTab(activeTab) {
      var vm = this;
      vm.$log.log('set activetab as:', activeTab);
      vm.AttendanceServices.setActiveTab(activeTab);
   }

   getActiveTab() {
      var vm = this;
      return vm.AttendanceServices.getActiveTab();
   }

   setStudentReadyNextRank(thestudent, readyness) {
      var vm = this;
      vm.$log.log('about setStudentReadyNextRank ', thestudent, readyness);
      var path = '../v1/readynextrank/' + thestudent;
      var theclassid = vm.Util.getByValue(vm.classes, vm.theclass, 'Description', 'classid');

      return vm.AttendanceServices.setStudentReadyNextRank(path, readyness, theclassid).then(function(data) {
         vm.$log.log("setStudentReadyNextRank returned data", data);
         vm.$log.log(data);
      }, function(error) {
         vm.$log.log('Caught an error setStudentReadyNextRank:', error);
         vm.message = error;
         vm.Notification.error({ message: error, delay: 5000 });
         return (vm.$q.reject(error));
      });
   }

   checkAttendanceStats(thestudent) {
      var vm = this;
      vm.showStats = thestudent;
      var a = vm.moment();
      var b;
      vm.checkAttendance(thestudent).then(function() {
         b = vm.moment((typeof(vm.attendancesum[0]) === 'undefined' ||
            vm.attendancesum[0].lastPromoted === null) ? '01-01-1900' : vm.attendancesum[0].lastPromoted);
         vm.daysSince = a.diff(b, 'days');
         vm.daysAttended = vm.attendancesum[0].daysAttended;
      });
   }
   checkAttendance(thestudent) {
      var vm = this;
      vm.$log.log('about checkAttendance ', thestudent);
      var pclass = vm.theclass.length > 0 ? vm.theclass : 'NULL';
      vm.$log.log('pclass:', pclass);

      var path = encodeURI('../v1/Attendancesum?contactid=' + thestudent + '&theclass=' + pclass);

      vm.$log.log('checkAttendance path:', path);

      return vm.AttendanceServices.getAttendanceSum(path).then(function(data) {
         vm.$log.log("getAttendanceSum returned data", data);
         vm.$log.log(data);
         vm.attendancesum = data.attendancesum;
         vm.$log.log(vm.data.message);
         vm.message = vm.data.message;
         if ((typeof vm.attendancesum === 'undefined' || vm.attendancesum.error === true) &&
            typeof data !== 'undefined') {
            vm.Notification.warning({ message: vm.message, delay: 5000 });
            return (vm.$q.reject(data));
         }
         else {
            //        Notification.success({message: vm.message, delay: 5000});
         }

      }, function(error) {
         vm.$log.log('Caught an error getAttendanceSum:', error);
         vm.message = error;
         vm.Notification.error({ message: error, delay: 5000 });
         return (vm.$q.reject(error));
      });
   }

}
