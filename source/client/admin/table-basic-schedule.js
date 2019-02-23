import angular from 'angular';

export class ScheduleTableBasicController {
    constructor(
        $log, $q, $scope, $interval, AttendanceServices, UserServices, CalendarServices, uiGridConstants, Notification, moment, iddropdownFilter, Util, portalDataService

    ) {
        'ngInject';
        this.$log = $log;
        this.$q = $q;
        this.$scope = $scope;
        this.$interval = $interval;
        this.AttendanceServices = AttendanceServices;
        this.CalendarServices = CalendarServices;
        this.uiGridConstants = uiGridConstants;
        this.Notification = Notification;
        this.moment = moment;
        this.Util = Util;
        this.iddropdownFilter = iddropdownFilter;
        this.portalDataService = portalDataService;
        this.UserServices = UserServices;
    }
    $onInit() {

        //       var $ = angular.element;

        var vm = this;
        vm.isCollapsed = true;

        vm.agerangelist = {};
        vm.gridOptions = {};
        vm.gridApi = {};
        vm.limits = [1, 3, 5, 10, 20, 50, 100, 200];
        vm.weekschedule = [
            { value: 'Sunday', label: 'Sunday' },
            { value: 'Monday', label: 'Monday' },
            { value: 'Tuesday', label: 'Tuesday' },
            { value: 'Wednesday', label: 'Wednesday' },
            { value: 'Thursday', label: 'Thursday' },
            { value: 'Friday', label: 'Friday' },
            { value: 'Saturday', label: 'Saturday' }
        ];
        vm.yesno = [
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' }
        ];
        vm.classlist = [];
        vm.classhashlist = [];
        vm.schedule = {};
        vm.thisschedule = [];
        vm.gridLength = {};
        vm.initialLength = 3;
        //        vm.rowheight=88;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);
        //having it here sets the options, but the dropdown doesn't map
        vm.setgridOptions();
        vm.activate();
    }

    $onDestroy() {
        this.$log.log("table-basic-schedule dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;
        vm.portalDataService.Portlet('table-basic-schedule');
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('ScheduleTableBasicController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("table-basic-schedule started");

        });


        vm.$scope.$watch('vm.schedule.startT', function(value) {
            if (!value) return;
            vm.changetime();
        }, true);
        vm.$scope.$watch('vm.schedule.endT', function(value) {
            if (!value) return;
            vm.changetime();
        }, true);

        vm.getSchedule().then(function() {
            vm.$log.log('getSchedule activate done');
            vm.getClasses().then(function() {
                vm.$log.log('getClasses activate done');
                vm.setgridOptions();
                vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
                vm.schedule.TakeAttendance = 'Yes';
                vm.schedule.dow = 'Monday';
                vm.schedule.startT = vm.moment().format('HH:mm');
                vm.schedule.endT = vm.moment().add(1, 'hours').format('HH:mm');
                vm.schedule.classid = String(vm.classhashlist[0].id);

                vm.changeclass();
            }, function(error) {
                return (vm.$q.reject(error));
            });

        }, function(error) {
            return (vm.$q.reject(error));
        });
        vm.getAgeRangeList().then(function() {
            vm.$log.log("returned from getAgeRangeList");
        });


    }

    changeclass() {
        var vm = this;

        vm.schedule.description = vm.Util.getByValue(vm.classhashlist, vm.schedule.classid, 'id', 'value');

    }

    setGridLength(size) {
        var vm = this;
        vm.gridLength = {
            height: (size * vm.rowheight) + vm.headerheight + 'px'
        };
    }
    getGridLength() {
        var vm = this;
        return vm.gridLength;
    }



    getAgeRangeList() {
        var vm = this;
        var path = "../v1/ageranges";
        return vm.CalendarServices.getAgeRangeList(path).then(function(data) {
            vm.$log.log('getAgeRangeList returned data');
            vm.$log.log(data.agerangelist);
            if ((typeof vm.agerangelist === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: data.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                vm.agerangelist = data.agerangelist;
                for (var iter = 0, len = vm.agerangelist.length; iter < len; iter++) {
                    vm.agerangelist[iter].value = String(vm.agerangelist[iter].agerange);
                    vm.agerangelist[iter].id = String(vm.agerangelist[iter].agerange);
                }

            }


            return vm.agerangelist;
        });
    }

    changetime() {
        var vm = this;
        vm.schedule.timerange = vm.schedule.startT +
            ' to ' + vm.schedule.endT;
    }
    removeSchedule(input) {
        var vm = this;
        vm.$log.log('removeSchedule entered', input);
        var path = "../v1/schedule";
        var thedata = {
            ID: input.ID
        };
        return vm.AttendanceServices.removeSchedule(thedata, path)
            .then(function(data) {
                vm.$log.log('removeSchedule returned data');
                vm.$log.log(data);
                vm.getSchedule().then(function(zdata) {
                        vm.$log.log('getSchedule returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getSchedule after remove:', error);
                        vm.thisschedule = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.log('removeSchedule failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }
    addSchedule(rowEntity) {
        var vm = this;
        vm.updSchedule(rowEntity, 'Add');
    }

    updSchedule(input, type) {
        var vm = this;
        vm.$log.log('updSchedule entered', input);
        var output = {
            ID: input.ID,
            DayOfWeek: input.dow,
            TimeRange: input.timerange,
            AgeRange: input.agerange,
            Description: input.description,
            TakeAttendance: (input.TakeAttendance ? "Yes" : "No"),
            TimeStart: input.startT,
            TimeEnd: input.endT,
            sortorder: input.sortorder,
            classid: input.classid
        };
        vm.updateSchedule(output, type);
    }
    updateSchedule(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/schedule";
        var thedata = {
            ID: rowEntity.ID,
            DayOfWeek: rowEntity.DayOfWeek,
            TimeRange: rowEntity.TimeRange,
            AgeRange: rowEntity.AgeRange,
            Description: rowEntity.Description,
            TakeAttendance: rowEntity.TakeAttendance,
            TimeStart: rowEntity.TimeStart,
            TimeEnd: rowEntity.TimeEnd,
            sortorder: rowEntity.sortorder,
            classid: rowEntity.classid
        };

        vm.$log.log('about updateSchedule ', rowEntity, updpath, updatetype);
        return vm.AttendanceServices.updateSchedule(updpath, thedata)
            .then(function(data) {
                vm.$log.log('updateSchedule returned data');
                vm.$log.log(data);
                vm.thisschedule = data;
                vm.$log.log(vm.thisschedule);
                vm.$log.log(vm.thisschedule.message);
                vm.message = vm.thisschedule.message;
                if ((typeof vm.thisschedule === 'undefined' || vm.thisschedule.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                //       if (updatetype === 'Add') {
                vm.getSchedule().then(function(zdata) {
                        vm.$log.log('getSchedule returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getSchedule after update:', error);
                        vm.thisschedule = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                //       }
                return vm.thisschedule;
            }).catch(function(e) {
                vm.$log.log('updateSchedule failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getSchedule() {
        var vm = this;
        vm.$log.log('getSchedule entered');
        var path = '../v1/schedule';
        var myDatea = new Date();
        var myDateb = new Date();

        return vm.AttendanceServices.getSchedules(path).then(function(data) {
            vm.$log.log('getSchedules returned data');
            vm.$log.log(data);

            for (var iter = 0, len = data.Schedulelist.length; iter < len; iter++) {
                myDatea = new Date();
                myDatea.setHours(parseInt(data.Schedulelist[iter].TimeStart.split(":")[0], 10));
                myDatea.setMinutes(parseInt(data.Schedulelist[iter].TimeStart.split(":")[1], 10));
                data.Schedulelist[iter].startT = vm.moment(myDatea).format('hh:mm').toString();
                myDateb = new Date();
                myDateb.setHours(parseInt(data.Schedulelist[iter].TimeEnd.split(":")[0], 10));
                myDateb.setMinutes(parseInt(data.Schedulelist[iter].TimeEnd.split(":")[1], 10));
                data.Schedulelist[iter].endT = vm.moment(myDateb).format('hh:mm').toString();
            }
            vm.schedule.sortorder = parseInt(vm.Util.maxObjArr(data.Schedulelist, 'sortorder'), 10) + 1;

            vm.gridOptions.data = data.Schedulelist;
        }, function(error) {
            vm.$log.log('Caught an error getSchedules:', error);
            vm.Schedulelist = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }
    getClasses() {
        var vm = this;
        vm.$log.log('getClasses entered');
        var path = '../v1/classes';

        return vm.AttendanceServices.getClasses(path).then(function(data) {
            vm.$log.log('getClasses returned data');
            vm.$log.log(data);

            vm.classlist = data.ClassList;
            //classes which aren't in the db
            //vm.classlist.push( {class: "No Scheduled Classes", classid: 0} );
            vm.classhashlist.push({ value: "No Scheduled Classes", id: 0 });
            for (var iter = 0, len = data.ClassList.length; iter < len; iter++) {
                vm.classhashlist.push({
                    value: data.ClassList[iter].class,
                    id: data.ClassList[iter].classid
                });
            }
            return vm.classlist;
        }, function(error) {
            vm.$log.log('Caught an error getClasses:', error);
            vm.classlist = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }


    setgridOptions() {
        var vm = this;
        var ctpl_start = '<div uib-timepicker hour-step="1" minute-step="5" show-meridian="false" ng-model="row.entity.startT"></div>';
        var ctpl_end = '<div uib-timepicker hour-step="1" minute-step="5" show-meridian="false" ng-model="row.entity.endT"></div>';

        vm.gridOptions = {
            enableFiltering: true,
            enableCellEditOnFocus: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.initialLength,
            appScopeProvider: vm,
            rowHeight: vm.rowheight,
            showGridFooter: false,
            enableColumnResizing: true,
            columnDefs: [
                // default

                {
                    field: 'DayOfWeek',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    //                    cellClass: 'ui-grid-3rowcenter',
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'label',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.weekschedule,
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.weekschedule
                    }
                },
                {
                    field: 'TimeRange',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    //                    cellClass: 'ui-grid-3rowcenter',
                    enableCellEdit: true,
                    enableFiltering: true
                },
                {
                    field: 'AgeRange',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    //                    cellClass: 'ui-grid-3rowcenter',
                    enableFiltering: true,
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownOptionsArray: vm.agerangelist

                },
                //                { field: 'classid'
                //                },
                {
                    field: 'classid',
                    displayName: 'Class',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    //                    cellClass: 'ui-grid-3rowcenter',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classhashlist,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplate.html',
                    filter: {
                        options: vm.classhashlist
                    }
                },
                {
                    field: 'Description',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    //                   cellClass: 'ui-grid-3rowcenter',
                    enableFiltering: true
                },
                {
                    field: 'TimeStart',
                    displayName: 'StartTime',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    type: 'string',
                    //                    type: 'date',
                    cellFilter: 'date:\'HH:mm\''

                    //                    cellTemplate: ctpl_start
                },
                {
                    field: 'TimeEnd',
                    displayName: 'EndTime',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    //                    type: 'date',
                    cellFilter: 'date:\'HH:mm\''
                    //                    cellTemplate: ctpl_end
                },
                {
                    field: 'TakeAttendance',
                    displayName: 'TakeAttendance',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    //                   cellClass: 'ui-grid-3rowcenter',
                    enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'label',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.yesno,

                    //                    cellTemplate: togtpl
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.yesno
                    }

                },
                {
                    field: 'sortorder',
                    enableCellEdit: true,
                    //                    cellClass: 'ui-grid-3rowcenter',
                    enableFiltering: true
                },
                {
                    field: 'ID',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    //                   cellClass: 'ui-grid-3rowcenter',
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeSchedule(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
                }
                /*                    { name: 'EventTypeSparring', displayName: 'Sparring',
                                      type: 'boolean',enableFiltering: false,
                                      cellTemplate: '<input type="checkbox" ng-disabled="col.grid.appScope.showregister(row.entity)" ng-model="row.entity.EventTypeSparring">'},
                */

            ],
            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.log('pagination changed');
                    //                        paginationOptions.pageSize = pageSize;
                    vm.setGridLength(pageSize);
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });
                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            vm.updateSchedule(rowEntity, 'Update');
                        }
                    });

            }
        };



    }

}
