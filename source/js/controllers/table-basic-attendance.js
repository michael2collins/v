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
        
        setGridOptions();
        vm.getAttendance = getAttendance;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.gcolumns = [];
        vm.gridOptions = {};

        vm.path = '../v1/attendance/';

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

        activate();

        
        function activate() {
        return getAttendance().then(function() {
            $log.debug('activated  view');
            });
        }
        
        function getAttendance() {
            return AttendanceServices.getAllAttendances(vm.path).then(function(data){
                    $log.debug('getAllAttendances returned data');
                    $log.debug(data.data);
                    vm.gridOptions.data = data.data.StudentHistoryList;
               //     $log.debug($scope.gridOptions.data);
                    return vm.gridOptions.data;
                });
        }

        function setGridOptions() {
            vm.gcolumns = [];
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
