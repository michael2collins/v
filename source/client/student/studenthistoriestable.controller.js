//import angular from 'angular';

export class StudentHistoriesController {
    constructor(
        $scope, $log, StudentServices, Util, $routeParams, uiGridConstants,
        $window, Notification, $controller, $timeout, $q, UserServices
    ) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;
        this.StudentServices = StudentServices;
        this.Util = Util;
        this.$routeParams = $routeParams;
        this.uiGridConstants = uiGridConstants;
        this.$window = $window;
        this.Notification = Notification;
        this.$timeout = $timeout;
        this.$controller = $controller;
        this.$q = $q;
        this.UserServices = UserServices;
    }

    $onInit() {

        var vm = this;

        vm.gcolumns = [];
        vm.gridOptions = {};
        vm.gridApi;

        var studentXS = 30;
        var studentS = 60;
        var studentM = 150;
        var studentL = 250;

        vm.listA = [
            { id: 1, colname: 'FirstName', default: 'true', minsize: studentM },
            { id: 2, colname: 'ID', default: 'true', minsize: studentS },
            { id: 3, colname: 'LastName', default: 'true', minsize: studentM },
            { id: 4, colname: 'Email', default: 'true', minsize: studentL },
            { id: 5, colname: 'Email2', default: 'false', minsize: studentL },
            { id: 6, colname: 'Parent', default: 'false', minsize: studentM },
            { id: 7, colname: 'Phone', default: 'true', minsize: studentM },
            { id: 8, colname: 'AltPhone', default: 'false', minsize: studentS },
            { id: 9, colname: 'Address', default: 'false', minsize: studentL },
            { id: 10, colname: 'City', default: 'false', minsize: studentM },
            { id: 11, colname: 'State', default: 'false', minsize: studentXS },
            { id: 12, colname: 'ZIP', default: 'false', minsize: studentS },
            { id: 13, colname: 'Notes', default: 'false', minsize: studentM },
            { id: 14, colname: 'Birthday', default: 'false', minsize: studentXS },
            { id: 15, colname: 'ContactType', default: 'false', minsize: studentM },
            { id: 16, colname: 'sex', default: 'false', minsize: studentXS },
            { id: 17, colname: 'medicalConcerns', default: 'false', minsize: studentM },
            { id: 18, colname: 'contactmgmttype', default: 'true', minsize: studentM },
            { id: 19, colname: 'contactdate', default: 'true', minsize: studentM },
        ];

        vm.gridLength = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);
        vm.isCollapsed = true;
        vm.setColumns();
        vm.setGridOptions();
        vm.activate();
    }

    $onDestroy() {
        this.$log.log("StudentHistoriesController dismissed");
        //this.$log.logEnabled(false);
    }


    getLimit() {
        var vm = this;
        vm.$log.log('getLimit');
        return vm.limit;
    }
    setLimit(thelimit) {
        var vm = this;
        vm.$log.log('setLimit', thelimit);
        vm.limit = thelimit;
    }
    setColumns() {
        var vm=this;
        vm.gcolumns = [];

        vm.$log.log('setGridOptions col count', vm.listA.length);

        for (var i = 0, len = vm.listA.length; i < len; i++) {
            if (vm.listA[i].colname == 'ID') {
                continue; //skip as we will add it at the end 
            }
            vm.gcolumns.push({
                field: vm.listA[i].colname,
                enableFiltering: true,
                enableSorting: true,
                visible: vm.listA[i].default == 'true' ? true : false,
                width: "*",
                headerCellClass: vm.Util.highlightFilteredHeader,
                minWidth: vm.listA[i].minsize,
                enableCellEdit: false
            });

        }

        var ctpl = '<div class="ui-grid-cell-contents"><span>';
        ctpl += '<a role="button" class="btn btn-blue" style="padding:  0px 14px;" ';
        ctpl += ' href="/#/form-layouts-editstudent/id/{{COL_FIELD}}" ><i class="fa fa-edit"></i>&nbsp; Edit</a></span>';
        ctpl += '</div>';

        vm.gcolumns.push({
            name: 'ID',
            displayName: 'Edit',
            enableFiltering: false,
            enableSorting: false,
            enableHiding: false,
            enableCellEdit: false,
            cellTemplate: ctpl,
            width: 200
        });        
    }
    activate() {
        var vm = this;
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined) {
            vm.$log = vm.$log.getInstance('StudentHistoriesController', vm.UserServices.isDebugEnabled());
        }


        vm.getStudentHistories().then(function() {

        });
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


    getStudentHistories() {

        var vm = this;
        var path = "../v1/contacthistories";
        vm.gridOptions.data = [];

        return vm.StudentServices.getStudentHistories(path).then(function(data) {
            vm.Util.checkDataSuccessv2(data, data.contacthistorieslist, vm.Notification, vm.$q, 'getStudentHistories', true);

            vm.gridOptions.data = data.contacthistorieslist;

        }, function(error) {
            vm.Util.exceptionError(error, "getStudentHistories", vm.Notification);
            vm.gridOptions.data = [];
            return (vm.$q.reject(error));

        });

    }



    setGridOptions() {
        var vm = this;


        vm.gridOptions = {
            showGridFooter: true,
            enableFiltering: true,
            enableGridMenu: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.initialLength,
            rowHeight: vm.rowheight,
            enableCellEditOnFocus: true,
            columnDefs: vm.gcolumns,
            exporterCsvFilename: 'studenthistories.csv',
            exporterPdfDefaultStyle: { fontSize: 9 },
            exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
            exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
            exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
            exporterPdfFooter: function(currentPage, pageCount) {
                return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
            },
            exporterPdfCustomFormatter: function(docDefinition) {
                docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,            
            appScopeProvider: vm,
            enableColumnResizing: true,
            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.log('pagination changed');
                    vm.setGridLength(pageSize);
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });

            }
        };

        vm.$log.log('gcolumns', vm.gcolumns);
        vm.$log.log('gridOptions', vm.gridOptions);
    }

}
