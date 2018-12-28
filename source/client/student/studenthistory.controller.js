export class StudentHistoryController {
    constructor(
        $routeParams, $log, $scope, StudentServices, Util, $q, uiGridConstants, Notification
    ) {
        'ngInject';
        this.$routeParams = $routeParams;
        this.$log = $log;
        this.$scope = $scope;
        this.StudentServices = StudentServices;
        this.Util = Util;
        this.$q = $q;
        this.uiGridConstants = uiGridConstants;
        this.Notification = Notification;
    }

    $onInit() {
        var vm = this;

        vm.path = '../v1/studenthistory/' + vm.$routeParams.id;
        vm.$log.debug('studentid for studenthistory: ' + vm.$routeParams.id);
        vm.gridApi = {};
        vm.gridLength = {};
        vm.initialLength = 5;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);

        vm.setGridOptions();
        vm.activate();
    }

    $onDestroy() {
        this.$log.debug("StudentHistoryController dismissed");
        this.$log.debugEnabled(false);
    }

    activate() {
        var vm = this;

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("studenthistory started");

        });

        vm.getStudentHistory().then(function() {
            vm.$log.debug('activated StudentHistory view');
            vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

        }, function(error) {
            return (vm.$q.reject(error));
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

    getStudentHistory() {
        var vm = this;
        return vm.StudentServices.getStudentHistory(vm.path).then(function(data) {
            vm.$log.debug('getStudentHistory returned data');
            vm.$log.debug(data);
            if (typeof(data.StudentHistoryList) !== 'undefined' && data.error === false) {
                vm.$log.debug('StudentHistoryList', data.StudentHistoryList);
                vm.gridOptions.data = data.StudentHistoryList;
            }
            else {
                vm.gridOptions.data = {};
                if (typeof(data.vm.gridOptions.data) !== 'undefined') {
                    vm.Notification.error({ message: 'No data found', delay: 5000 });
                }
            }
            return vm.gridOptions.data;

        }, function(error) {
            vm.$log.debug('StudentHistoryList', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });

    }

    setGridOptions() {
        var vm = this;
        vm.gridOptions = {
            enableFiltering: true,
            enableCellEditOnFocus: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.initialLength,
            rowHeight: vm.rowheight,
            appScopeProvider: vm,
            showGridFooter: false,
            enableColumnResizing: true,
            columnDefs: [
                // default
                {
                    field: 'contactmgmttype',
                    displayName: 'Type',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'contactdate',
                    displayName: 'Date',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }
            ],

            onRegisterApi: function(gridApi) {
                vm.$log.debug('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.debug('pagination changed');
                    vm.setGridLength(pageSize);
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });

                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            //            vm.updateClass(rowEntity, 'Update');
                        }
                    });

            }
        };

    }

}
