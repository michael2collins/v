(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('AttendanceTableBasicController', AttendanceTableBasicController);

    AttendanceTableBasicController.$inject = [
    '$routeParams',
    '$log',
    'AttendanceServices',
    '$location',
    '$window',
    '$q'
    ];

    function AttendanceTableBasicController($routeParams, $log, AttendanceServices, $location, $window, $q) {
        /* jshint validthis: true */

        var vm=this;
        
        vm.refreshtheAttendance = refreshtheAttendance;
        vm.setLimit = setLimit;
        vm.setClass = setClass;
        vm.setDOW = setDOW;
        vm.requery = requery;
        vm.DOWlist = [];
        vm.limit = 0;
        vm.limits = [10,20,50,100,200,500];
        vm.dowChoice ='';
        vm.theclass ='';
        vm.data = [];
        vm.classes = [];

        var d = new Date();
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

        vm.todayDOW = weekday[d.getDay()];
        vm.tday = tdays[d.getDay()];
        vm.nowChoice = 0;
        vm.loading = true;
        

        activate();

        function setLimit(thelimit) {
            $log.debug('setLimit',thelimit);
            vm.limit = thelimit;
        }
        function setDOW(theChoice) {
            vm.dowChoice = theChoice;
            $log.debug('setDOW', vm.dowChoice);
        }
        function setClass(aClass) {
            $log.debug('setClass',aClass);
            vm.theclass = aClass;
        }

        function requery() {
            $log.debug('requery entered');
            refreshtheAttendance();
        }
        
        function activate() {
            $q.all([
                    getDOW().then(function() {
                       setDOW(vm.DOWlist[0].MondayOfWeek);
                       setLimit(100);
                   }),
                    getSchedule().then(function() {
                        $log.debug('nowChoice',vm.nowChoice,'classes',vm.classes);
                        
                       setClass(vm.classes[vm.nowChoice].Description);
                        $log.debug('setClass', vm.theclass);
                     })
                ])
                .then(function() {
                     return refreshtheAttendance().then(function(zdata) {
                         $log.debug('refreshtheAttendance returned', zdata);
                     });
            });
        }
        

        function refreshtheAttendance() {
            $log.debug('refreshtheAttendance entered');
            var pclass = vm.theclass.length > 0 ? vm.theclass : 'NULL';
            $log.debug('pclass:', pclass);
            
            var refreshpath = encodeURI('../v1/attendance?thedow=' + vm.dowChoice + '&thelimit=' + vm.limit + '&theclass=' + pclass);
            //var refreshpath = encodeURI('../v1/attendance?thedow=' + vm.dowChoice + '&thelimit=' + vm.limit );

            $log.debug('refreshtheAttendance path:', refreshpath);
            
             return AttendanceServices.refreshAttendances(refreshpath).then(function(data){
                    $log.debug('refreshAttendances returned data');
                    $log.debug(data);
                    vm.data = data; 
                    return vm.data;
                },
                function (error) {
                    console.log('Caught an error:', error); 
                          $log.debug('set no data route');
                    //        $location.url('/v/#/table-basic-attendance');
               //            var url = '#/table-basic-attendance';
                //           $window.location.href = url;
                    vm.data = [];
                    return error;
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

        function getSchedule() {
            var path='../v1/schedule/' + vm.todayDOW;
            var d = new Date();
            var y = d.getFullYear();
            var h = d.getHours();
            var mm = d.getMinutes();

            return AttendanceServices.getSchedule(path).then(function(data){
                    vm.classes=[];
                    $log.debug('getSchedule returned data');
                    $log.debug(data);
                    vm.Schedulelist = data.Schedulelist;
                    for (var i=0; i < vm.Schedulelist.length; i++) {
                       console.log('DayOfWeek',vm.Schedulelist[i].DayOfWeek);
                       console.log('TimeRange',vm.Schedulelist[i].TimeRange);
                       console.log('timestart',vm.Schedulelist[i].TimeStart);
                       console.log('timeend',vm.Schedulelist[i].TimeEnd);
                       var start = vm.Schedulelist[i].TimeStart.split(":");
                       var starth = start[0];
                       var startmm = start[1];
                       var end = vm.Schedulelist[i].TimeEnd.split(":");
                       console.log('end',end);
                       var endh = end[0];
                       var endmm = end[1];
var d1=new Date(parseInt(d.getFullYear(),10),(parseInt(d.getMonth(),10)),parseInt(d.getDate(),10),parseInt(starth,10),parseInt(startmm,10),parseInt(d.getSeconds(),10));
var d2=new Date(parseInt(d.getFullYear(),10),(parseInt(d.getMonth(),10)),parseInt(d.getDate(),10),parseInt(endh,10),parseInt(endmm,10),parseInt(d.getSeconds(),10));
console.log('startdate',d1);
console.log('enddate',d2);
var startdate=d1.valueOf();
var enddate=d2.valueOf();                       
                       //making start inclusive and end not
                       if (d<enddate && d>=startdate) {
                           vm.nowChoice = i; //note there may be nmultiples and this will pick the last
                           $log.debug('nowChoice',vm.nowChoice);
                       }
                       vm.classes.push(vm.Schedulelist[i] );
                    }
                    
                    return vm.classes;
                });
        }




    }

})();
