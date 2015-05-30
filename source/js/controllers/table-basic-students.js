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
        $.fn.Data.Portlet();
        //   $scope.students = []; 

        //    var path = 'testdata/students_vsmall.json';
        var path = '../v1/students';
        $log.debug('Hello Debug!');


        //   setTimeout(function(){
        // Init
        //      var spinner = $( ".spinner" ).spinner();

        $scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        $scope.gridOptions = {
            enableFiltering: true,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            columnDefs: [
                // default
                {
                    field: 'name',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'ID2',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'LastName',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'FirstName',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Email',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Email2',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Parent',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Phone',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'AltPhone',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Address',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'City',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'State',
                    headerCellClass: $scope.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'ZIP',
                    headerCellClass: $scope.highlightFilteredHeader,
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
                    cellTemplate: '<div class="ui-grid-cell-contents"><span><a role="button" class="btn btn-blue mrs" href="#/form-layouts-editstudent?id={{COL_FIELD}}" >Edit</button></span></div>'
                }
            ]

        };

        StudentServices.getAllStudents(path, function(data) {
            $scope.gridOptions.data = data.students;

        });

        //    },50);

    }
})();