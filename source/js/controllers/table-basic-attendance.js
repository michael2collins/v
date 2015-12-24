(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('AttendanceTableBasicController', AttendanceTableBasicController);

    AttendanceTableBasicController.$inject = [
    '$routeParams',
    '$log',
    'AttendanceServices'
    ];

    function AttendanceTableBasicController($routeParams, $log, AttendanceServices) {
        /* jshint validthis: true */

        var vm=this;
        
        vm.getAttendance = getAttendance;
        vm.setLimit = setLimit;
        vm.setClass = setClass;
        vm.setDOW = setDOW;
        vm.refresh = refresh;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.gcolumns = [];
        vm.gridOptions = {};
        vm.DOWlist = [];
        vm.limit = 100;
        vm.limits = [10,20,50,100,200,500];
        vm.dowChoice ='';
        vm.theclass ='';
        vm.classes = [];
        
        vm.path = '../v1/attendance';

        vm.columns = [
                    {id:1, colname:'ID', default:'true'},
                    {id:2, colname:'firstname', default:'true'},
                    {id:3, colname:'lastname', default:'true'},
                    {id:4, colname:'MondayOfWeek', default:'true'},
                    {id:5 , colname:'day1', default:'false'},
                    {id:6 , colname:'day2', default:'false'},
                    {id:7 , colname:'day3', default:'true'},
                    {id:8 , colname:'day4', default:'false'},
                    {id:9 , colname:'day5', default:'false'},
                    {id:10, colname:'day6', default:'false'},
                    {id:11 , colname:'day7', default:'false'},
                    {id:12, colname:'class', default:'false'},
                    {id:13, colname:'rank', default:'false'},
                    ];

        setGridOptions();
        activate();

        function setLimit(thelimit) {
            $log.debug('setLimit',thelimit);
            vm.limit = thelimit;
        }
        function setDOW(theChoice) {
            $log.debug('setDOW', theChoice);
            vm.dowChoice = theChoice;
        }
        function setClass(aClass) {
            $log.debug('setClass',aClass);
            vm.theclass = aClass;
        }

        function refresh() {
            return getAttendance().then(function() {
                $log.debug('refreshed  view');
            });
        }
        
        function activate() {
            return getDOW().then(function() {
                setDOW(vm.DOWlist[0].MondayOfWeek);
                return getAttendance().then(function() {
                    $log.debug('activated  view');
                });
            });
        }
        
        function getAttendance() {

            var thedata={
             "thedow": vm.dowChoice,
             "thelimit": vm.limit
            };
            
            return AttendanceServices.getAllAttendances(vm.path, {data: thedata}).then(function(data){
                    $log.debug('getAllAttendances returned data');
                    $log.debug(data);
                    vm.gridOptions.data = data.attendancelist;
               //     $log.debug($scope.gridOptions.data);
                    return vm.gridOptions.data;
                });
        }
        
        function getDOW() {
            return AttendanceServices.getDOW().then(function(data){
                    $log.debug('getDOW returned data');
                    $log.debug(data);
                    vm.DOWlist = data.DOWlist;
               //     $log.debug($scope.gridOptions.data);
                    return vm.DOWlist;
                });
        }

        function setGridOptions() {
            vm.gcolumns = [];
            $log.debug('vm.columns', vm.columns);
            $log.debug('setGridOptions col count', vm.columns.length);
            
            for (var i=0, len = vm.columns.length; i < len; i++) {
         //       $log.debug('colset',vm.columns[i].colname);
                if (vm.columns[i].colname == 'ID') {
                    continue; //skip as we will add it at the end 
                }
                var colstruct = {field: vm.columns[i].colname, 
                                    headerCellClass: highlightFilteredHeader,
                                    enableCellEdit: false };
                vm.gcolumns.push(colstruct);
            }
            var collast = {name: 'ID',
                    displayName: 'Edit',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span><a role="button" class="btn btn-blue" style="padding:  0px 14px;" href="./#/form-layouts-editattendance/id/{{COL_FIELD}}" >Edit</button></span></div>'
                };
            vm.gcolumns.push(collast);
            $log.debug('gcolumns', vm.gcolumns);

                    vm.gridOptions = {
                    enableFiltering: true,
                    paginationPageSizes: [25, 50, 75],
                    paginationPageSize: 25,
                    columnDefs: vm.gcolumns,
                    onRegisterApi: function(gridApi) {
                        $log.debug('onRegisterApi', gridApi);
                         vm.gridApi = gridApi;
                        }
                    };

     //       vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            $log.debug('gridOptions', vm.gridOptions);
        }


        function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }

    }

})();
