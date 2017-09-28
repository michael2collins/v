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
        .filter('griddropdown', function() {
          return function (input, context) {
            
            try {
            
                var map = context.col.colDef.editDropdownOptionsArray;
                var idField = context.col.colDef.editDropdownIdLabel;
                var valueField = context.col.colDef.editDropdownValueLabel;
                var initial = context.row.entity[context.col.field];
                if (typeof map !== "undefined") {
                  for (var i = 0; i < map.length; i++) {
                    if (map[i][idField] == input) {
                      return map[i][valueField];
                    }
                  }
                } else if (initial) {
                  return initial;
                }
                return input;
              
          } catch (e) {
//            context.grid.appScope.log("Error: " + e);
            console.log("error: " + e);
          }
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
    'moment'
    ];

    function ScheduleTableBasicController(
        $log, $q, $scope, $interval, AttendanceServices, uiGridConstants,  Notification, moment) {
        /* jshint validthis: true */

        var vm=this;
        
        vm.getSchedule = getSchedule;
        vm.removeSchedule = removeSchedule;
        vm.updSchedule = updSchedule;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.weekschedule = [
            { value: 'Sunday', label: 'Sunday' },
            { value: 'Monday', label: 'Monday' },
            { value: 'Tuesday', label: 'Tuesday' },
            { value: 'Wednesday', label: 'Wednesday' },
            { value: 'Thursday', label: 'Thursday' },
            { value: 'Friday', label: 'Friday' },
            { value: 'Saturday', label: 'Saturday' }
        ];
        vm.schedule={};
        vm.classlist=[];
        vm.classhashlist=[];
        vm.thisschedule=[];
        activate();

        function activate() {
            setgridOptions();
            getSchedule().then(function() {
                $log.debug('getSchedule activate done');
             },function(error) {
                 return ($q.reject(error));
             });
             
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
                    getSchedule();
                    return data;
                }).catch(function(e) {
                    $log.debug('removeSchedule failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function updSchedule(input) {
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
            updateSchedule(output);            
        }
        function updateSchedule(rowEntity) {
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
            
            $log.debug('about updateSchedule ',rowEntity, updpath);
            return AttendanceServices.updateSchedule(updpath, thedata)
                .then(function(data){
                    $log.debug('updateSchedule returned data');
                    $log.debug(data);
                    vm.thisschedule = data;
                    $log.debug(vm.thisschedule);
                    $log.debug(vm.thisschedule.message);
                    vm.message = vm.thisschedule.message;
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
            vm.classhashlist=[];

            return AttendanceServices.getClasses(path).then(function(data){
                    $log.debug('getClasses returned data');
                    $log.debug(data);
                    
                    vm.classlist = data.ClassList; 
                    //classes which aren't in the db
                    vm.classlist.push( {class: "No Scheduled Classes", id: 0} );
                    for(var iter=0,len = data.ClassList.length;iter<len;iter++) {
                        vm.classhashlist.push ({ 
                            value: data.ClassList[iter].class,
                            id: data.ClassList[iter].classid
                        });
                    }         
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
            getClasses().then(function() {
            $log.debug('setgridOptions Options:', vm.gridOptions);
                $log.debug('getClasses activate done');
             },function(error) {
                 return ($q.reject(error));
             });
            vm.gridOptions = {
                enableFiltering: true,
                enableCellEditOnFocus: true,
                paginationPageSizes: vm.limits,
                paginationPageSize: 10,
                appScopeProvider: vm,
                rowHeight: 88,
            columnDefs: [
                // default

                {
                    field: 'DayOfWeek',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                      filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.weekschedule
                    }
                }, 
                {
                    field: 'TimeRange',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: 'AgeRange',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: 'Description',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
/*                {
                    field: 'class',
                    displayName: 'Class',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>', 
                    filter: { 
                          term: 1,
                        options: vm.classhashlist        
                    },
                }, 
  */              {
                    field: 'classid',
                    displayName: 'Classid',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'griddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classhashlist
//                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdownid></div></div>', 
//                    filter: { 
//                          term: 1,
//                        options: vm.classhashlist        
 //                   },
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
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: 'sortorder',
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: 'ID',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeSchedule(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="fa fa-trash-o"></i>&nbsp; Remove</a></span></div>'
                }
/*                    { name: 'EventTypeSparring', displayName: 'Sparring',
                      type: 'boolean',enableFiltering: false,
                      cellTemplate: '<input type="checkbox" ng-disabled="col.grid.appScope.showregister(row.entity)" ng-model="row.entity.EventTypeSparring">'},
*/                      

                ],

                //rowHeight: 15,
                showGridFooter: false,
                enableColumnResizing: true,
//                appScopeProvider: vm,

                onRegisterApi: function(gridApi) {
                    $log.debug('vm gridapi onRegisterApi');
                     vm.gridApi = gridApi;

     /*               gridApi.selection.on.rowSelectionChanged($scope,function(row){
                        var msg = 'grid row selected ' + row.entity;
                        $log.debug(msg);

                        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                        $log.debug('selected', selectedStudentarr);
                        setSelectedArray(selectedStudentarr);
                        
                    });
     */
    /*                    gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                            $log.debug("grid batch");  
                            var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                            $log.debug('batch selected', selectedStudentarr);
                            setSelectedArray(selectedStudentarr);

                    });
                    
     */               
/*             gridApi.core.on.filterChanged( $scope, function() {
                 $log.debug("filt change, $scope");
             // vm.gridOptions.data = data;
            });
*/
                        gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
                        $log.debug('rowEntity');
                        $log.debug(rowEntity);
                        //Alert to show what info about the edit is available
                        $log.debug('Column: ' + colDef.name  + 
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue    );
                        if (newValue != oldValue) {
                            updateSchedule(rowEntity);       
                        }
                    });

                    }
            };

                

        }

    }

})();
