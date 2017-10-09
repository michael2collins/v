(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('ScheduleTableBasicController', ScheduleTableBasicController)
        .directive('myCustomDropdown', function() {
          return {
            template: '<select class="form-control" ng-model="colFilter.term" ng-options="option.class as option.value for option in colFilter.options track by option.id"></select>'
          };
        })

        .directive('myCustomDropdownid', function() {
          return {
            template: '<select class="form-control" ng-model="colFilter.term" ng-options="option.id as option.value for option in colFilter.options track by option.id"></select>'
          };
        });
        
    ScheduleTableBasicController.$inject = [
    '$log',
    '$q',
    '$scope',
    '$interval',
    'AttendanceServices',
        'uiGridConstants',
    'Notification',
    'moment',
    'iddropdownFilter'
    ];

    function ScheduleTableBasicController(
        $log, $q, $scope, $interval, AttendanceServices, uiGridConstants,  Notification, moment, iddropdownFilter) {
        /* jshint validthis: true */

        var vm = this;
        
        vm.getSchedule = getSchedule;
        vm.removeSchedule = removeSchedule;
        vm.updSchedule = updSchedule;
        vm.changeclass = changeclass;
        vm.changetime = changetime;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [1,3,5,10,20,50,100,200];
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
        vm.classlist=[];
        vm.classhashlist=[];
        vm.schedule={};
        vm.thisschedule=[];
        vm.gridLength={};
        vm.initialLength=3;
        vm.rowheight=88;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;
        setGridLength(vm.initialLength);

        //having it here sets the options, but the dropdown doesn't map
        setgridOptions();
        activate();

        function activate() {
            getSchedule().then(function() {
                $log.debug('getSchedule activate done');
                getClasses().then(function() {
                    $log.debug('getClasses activate done');
                    setgridOptions();
                    vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    vm.schedule.TakeAttendance = 'Yes';
                    vm.schedule.dow = 'Monday';
                    vm.schedule.startT = moment();
                    vm.schedule.endT = moment().add(1, 'hours');
                    vm.schedule.classid = String(vm.classhashlist[0].id);
                    
                    changeclass();                    
                 },function(error) {
                     return ($q.reject(error));
                 });
                
             },function(error) {
                 return ($q.reject(error));
             });
             
        }

        function changeclass() {
            vm.schedule.description = getByValue(vm.classhashlist, vm.schedule.classid, 'id', 'value');
            
        }
        
        function setGridLength(size) {
            vm.gridLength=  {
                height: (size*vm.rowheight)+vm.headerheight+'px'
            };
        }
        function getGridLength() {
            return vm.gridLength;
        }
        function maxObjArr(arr,attr) {
            var res = Math.max.apply(Math,arr.map(function(o){return o[attr];}))
            return res;
        }
        
        function getByValue(arr, value, attr, resvlu) {
        
          var result  = arr.filter(function(o){return o[attr] == value;} );
        
          return result? result[0][resvlu] : null; // or undefined
        
        }
        
        $scope.$watch('vm.schedule.startT', function (value) {
            if (!value) return;
            changetime();
        }, true);
        $scope.$watch('vm.schedule.endT', function (value) {
            if (!value) return;
            changetime();
        }, true);


        function changetime() {
            vm.schedule.timerange = moment(vm.schedule.startT).format('h:mm A') 
                + ' to ' + moment(vm.schedule.endT).format('h:mm A');
        }
        function removeSchedule(input) {
            $log.debug('removeSchedule entered',input);
            var path = "../v1/schedule";
            var thedata = {
                ID: input.ID
            };
            return AttendanceServices.removeSchedule( thedata, path)
                .then(function(data){
                    $log.debug('removeSchedule returned data');
                    $log.debug(data);
                    getSchedule().then
                        (function(zdata) {
                         $log.debug('getSchedule returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getSchedule after remove:', error); 
                            vm.thisschedule = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeSchedule failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }
        function addSchedule(rowEntity) {
            updSchedule(rowEntity,'Add');
        }

        function updSchedule(input,type) {
            $log.debug('updSchedule entered',input);
            var output = {
                ID: input.ID,
                DayOfWeek: input.dow,
                TimeRange: input.timerange,
                AgeRange: input.agerange,
                Description: input.description,
                TakeAttendance: (input.TakeAttendance ? "Yes" : "No"),
                TimeStart: moment(input.startT).format('hh:mm'),
                TimeEnd: moment(input.endT).format('hh:mm'),
                sortorder: input.sortorder,
                classid: input.classid
            };
            updateSchedule(output,type);            
        }
        function updateSchedule(rowEntity,updatetype) {
            var updpath = "../v1/schedule";

            var thedata = {
                ID: rowEntity.ID,
                DayOfWeek: rowEntity.DayOfWeek,
                TimeRange: rowEntity.TimeRange,
                AgeRange: rowEntity.AgeRange,
                Description: rowEntity.Description,
                TakeAttendance: rowEntity.TakeAttendance,
                TimeStart: moment(rowEntity.startT).format('hh:mm'),
                TimeEnd: moment(rowEntity.endT).format('hh:mm'),
                sortorder: rowEntity.sortorder,
                classid: rowEntity.classid
            };
            
            $log.debug('about updateSchedule ',rowEntity, updpath,updatetype);
            return AttendanceServices.updateSchedule(updpath, thedata)
                .then(function(data){
                    $log.debug('updateSchedule returned data');
                    $log.debug(data);
                    vm.thisschedule = data;
                    $log.debug(vm.thisschedule);
                    $log.debug(vm.thisschedule.message);
                    vm.message = vm.thisschedule.message;
                    if ((typeof vm.thisschedule === 'undefined' || vm.thisschedule.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    if (updatetype === 'Add') {
                        getSchedule().then
                            (function(zdata) {
                             $log.debug('getSchedule returned', zdata);
                         },
                            function (error) {
                                $log.debug('Caught an error getSchedule after update:', error); 
                                vm.thisschedule = [];
                                vm.message = error;
                                Notification.error({message: error, delay: 5000});
                                return ($q.reject(error));
                            });
                    }
                    return vm.thisschedule;
                }).catch(function(e) {
                    $log.debug('updateSchedule failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        
        function getSchedule() {
            $log.debug('getSchedule entered');
            var path='../v1/schedule';
            var myDate = new Date();

            return AttendanceServices.getSchedules(path).then(function(data){
                    $log.debug('getSchedules returned data');
                    $log.debug(data);
                    
                    for(var iter=0,len = data.Schedulelist.length;iter<len;iter++) {
                        myDate = new Date();
                        myDate.setHours(parseInt(data.Schedulelist[iter].TimeStart.split(":")[0],10));
                        myDate.setMinutes(parseInt(data.Schedulelist[iter].TimeStart.split(":")[1],10));
                        data.Schedulelist[iter].startT = myDate;
                        myDate = new Date();
                        myDate.setHours(parseInt(data.Schedulelist[iter].TimeEnd.split(":")[0],10));
                        myDate.setMinutes(parseInt(data.Schedulelist[iter].TimeEnd.split(":")[1],10));
                        data.Schedulelist[iter].endT = myDate;
                    }
                    vm.schedule.sortorder = parseInt(maxObjArr(data.Schedulelist,'sortorder'),10) + 1;

                    vm.gridOptions.data = data.Schedulelist; 
                }, function(error) {
                    $log.debug('Caught an error getSchedules:', error); 
                    vm.Schedulelist = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        function getClasses() {
            $log.debug('getClasses entered');
            var path='../v1/classes';

            return AttendanceServices.getClasses(path).then(function(data){
                    $log.debug('getClasses returned data');
                    $log.debug(data);
                    
                    vm.classlist = data.ClassList; 
                    //classes which aren't in the db
                    //vm.classlist.push( {class: "No Scheduled Classes", classid: 0} );
                    vm.classhashlist.push( {value: "No Scheduled Classes", id: 0} );
                    for(var iter=0,len = data.ClassList.length;iter<len;iter++) {
                        vm.classhashlist.push ({ 
                            value: data.ClassList[iter].class,
                            id: data.ClassList[iter].classid
                        });
                    }  
                    return vm.classlist;
                }, function(error) {
                    $log.debug('Caught an error getClasses:', error); 
                    vm.classlist = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        
        function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }
        
        function setgridOptions() {
            var ctpl_start = '<div uib-timepicker hour-step="1" minute-step="5" show-meridian="false" ng-model="row.entity.startT"></div>';
            var ctpl_end = '<div uib-timepicker hour-step="1" minute-step="5" show-meridian="false" ng-model="row.entity.endT"></div>';
//            var togtpl = '<toggle on="Yes" off="No" ng-model="row.entity.TakeAttendance" size="btn-sm" onstyle="btn-success" offstyle="btn-danger""></toggle-switch>';

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
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    cellClass: 'ui-grid-3rowcenter',
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'label',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.weekschedule,
                      filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.weekschedule
                    }
                }, 
                {
                    field: 'TimeRange',
                    headerCellClass: vm.highlightFilteredHeader,
                    cellClass: 'ui-grid-3rowcenter',
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: 'AgeRange',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    cellClass: 'ui-grid-3rowcenter',
                    enableFiltering: true
                }, 
                {
                    field: 'classid',
                    displayName: 'Classid',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellClass: 'ui-grid-3rowcenter',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
//                    editDropdownIdLabel: 'classid',
//                    editDropdownValueLabel: 'class',
//                    editDropdownOptionsArray: vm.classlist
                    editDropdownOptionsArray: vm.classhashlist
//                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdownid></div></div>', 
//                    filter: { 
//                          term: 1,
//                        options: vm.classhashlist        
 //                   },
                }, 
                {
                    field: 'Description',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    cellClass: 'ui-grid-3rowcenter',
                    enableFiltering: true
                }, 
                {
                    field: 'startT',
                    displayName: 'StartTime',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    cellTemplate: ctpl_start
                }, 
                {
                    field: 'endT',
                    displayName: 'EndTime',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    cellTemplate: ctpl_end
                }, 
                {
                    field: 'TakeAttendance',
                    displayName: 'TakeAttendance',
                    headerCellClass: vm.highlightFilteredHeader,
                    cellClass: 'ui-grid-3rowcenter',
                    enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellClass: 'ui-grid-3rowcenter',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'label',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.yesno,
                    
//                    cellTemplate: togtpl
                      filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.yesno
                    }

                }, 
                {
                    field: 'sortorder',
                    enableCellEdit: true,
                    cellClass: 'ui-grid-3rowcenter',
                    enableFiltering: true
                }, 
                {
                    field: 'ID',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    cellClass: 'ui-grid-3rowcenter',
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeSchedule(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="fa fa-trash-o"></i>&nbsp; Remove</a></span></div>'
                }
/*                    { name: 'EventTypeSparring', displayName: 'Sparring',
                      type: 'boolean',enableFiltering: false,
                      cellTemplate: '<input type="checkbox" ng-disabled="col.grid.appScope.showregister(row.entity)" ng-model="row.entity.EventTypeSparring">'},
*/                      

                ],
                onRegisterApi: function(gridApi) {
                    $log.debug('vm gridapi onRegisterApi');
                     vm.gridApi = gridApi;

                      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $log.debug('pagination changed');
//                        paginationOptions.pageSize = pageSize;
                        setGridLength(pageSize);
                        vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        
                      });
                        gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
/*                        $log.debug('rowEntity');
                        $log.debug(rowEntity);
                        //Alert to show what info about the edit is available
                        $log.debug('Column: ' + colDef.name  + 
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue    );
*/                            
                        if (newValue != oldValue) {
                            updateSchedule(rowEntity, 'Update');       
                        }
                    });

                    }
            };

                

        }

    }

})();
