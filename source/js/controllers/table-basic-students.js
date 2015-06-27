(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('StudentsTableBasicController', StudentsTableBasicController);

    StudentsTableBasicController.$inject = [
        'StudentServices',
        '$scope',
        '$routeParams',
        '$log',
        'uiGridConstants'
    ];

    function StudentsTableBasicController(StudentServices, $scope, $routeParams, $log, uiGridConstants) {
        /* jshint validthis: true */
        var vm = this;

        //vm.path = 'testdata/students_vsmall.json';
        vm.path = '../v1/students';
        vm.getAllStudents = getAllStudents;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        //vm.gridOptions = {};

        $.fn.Data.Portlet();
        setGridOptions();
        activate();
        
        function activate() {
        return getAllStudents().then(function() {
            $log.debug('activated StudentsTableBasic view');
            });
        }
        
        //   setTimeout(function(){
        // Init
        //      var spinner = $( ".spinner" ).spinner();
        //    },50);

        function getAllStudents() {
            return StudentServices.getAllStudents(vm.path).then(function(data){
               //     $log.debug('getAllStudents returned data');
                    vm.gridOptions.data = data.data.students;
               //     $log.debug($scope.gridOptions.data);
                    return vm.gridOptions.data;
                });
        }


        function setGridOptions() {
            vm.gridOptions = {
            enableFiltering: true,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            columnDefs: [
                // default
                {
                    field: 'name',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'ID2',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'LastName',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'FirstName',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Email',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Email2',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Parent',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Phone',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'AltPhone',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Address',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'City',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'State',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'ZIP',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    name: 'modallink',
                    displayName: 'Modal',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    cellTemplate: '<button type="button" class="btn btn-blue mrs"  data-toggle="modal" data-target="#modal-config-student-fields" >Modal</button>'
                }, {
                    name: 'ID',
                    displayName: 'Edit',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span><a role="button" class="btn btn-blue mrs" href="./#/form-layouts-editstudent?id={{COL_FIELD}}" >Edit</button></span></div>'
                }
            ]};

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