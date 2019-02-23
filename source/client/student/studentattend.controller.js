export class StudentAttendController {
    constructor(
        $routeParams, $log, $scope, StudentServices, Util, $q, uiGridConstants, Notification, UserServices
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
        this.UserServices = UserServices;
    }

    $onInit() {
        var vm = this;

        vm.path = '../v1/studentattend/' + vm.$routeParams.id;
        vm.$log.log('studentid for studentAttend: ' + vm.$routeParams.id);
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
        this.$log.log("StudentAttendController dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('StudentAttendController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("studentAttend started");

        });

        vm.getStudentAttend().then(function() {
            vm.$log.log('activated StudentAttend view');
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

    getStudentAttend() {
        var vm = this;
        return vm.StudentServices.getStudentAttend(vm.path).then(function(data) {
            vm.$log.log('getStudentAttend returned data');
            vm.$log.log(data);
            if (typeof(data.StudentAttendList) !== 'undefined' && data.error === false) {
                vm.$log.log('StudentAttendList', data.StudentAttendList);
                vm.gridOptions.data = data.StudentAttendList;
            }
            else {
                vm.gridOptions.data = {};
                if (typeof(data.vm.gridOptions.data) !== 'undefined') {
                    vm.Notification.error({ message: 'No data found', delay: 5000 });
                }
            }
            return vm.gridOptions.data;

        }, function(error) {
            vm.$log.log('StudentAttendList', error);
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
                // ID, contactID, classID, classname, mondayOfWeek, rank, DOWnum, attended
                
                {
                    field: 'classname',
                    displayName: 'Class',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'mondayOfWeek',
                    displayName: 'Date',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'rank',
                    displayName: 'Rank',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'DOWnum',
                    displayName: 'Day',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'attended',
                    displayName: 'Attended?',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }
            ],

            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.log('pagination changed');
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
