import angular from 'angular';

export class TesttypeTableBasicController {
    constructor(
        $log, $q, $scope, $interval, ClassServices, uiGridConstants, Notification, moment, iddropdownFilter, Util, portalDataService

    ) {
        'ngInject';
        console.log('entering TesttypeTableBasicController controller');
        this.$log = $log;
        this.$q = $q;
        this.$scope = $scope;
        this.$interval = $interval;
        this.ClassServices = ClassServices;
        this.uiGridConstants = uiGridConstants;
        this.Notification = Notification;
        this.moment = moment;
        this.Util = Util;
        this.iddropdownFilter = iddropdownFilter;
        this.portalDataService = portalDataService;
    }
    $onInit() {

        var vm = this;
        //        var $ = angular.element;
        vm.isCollapsed = true;

        vm.gridOptions = {};
        vm.gridApi = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.Testtype = {};
        vm.rankTypes = [];
        vm.thisTesttype = [];
        vm.gridLength = {};
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);

        vm.setgridOptions();
        vm.activate();

    }
    $onDestroy() {
        this.$log.debug("table-basic-testtype dismissed");
        this.$log.debugEnabled(false);
    }

    activate() {
        var vm = this;
        vm.portalDataService.Portlet('table-basic-testtype');

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("table-basic-testtype started");

        });
        vm.getTesttype().then(function() {
            vm.$log.debug('getTesttype activate done');
            vm.getrankTypes().then(function() {
                vm.$log.debug('getrankTypes activate done', vm.rankTypes);
                vm.setgridOptions();
                vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

            }, function(error) {
                return (vm.$q.reject(error));
            });
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

    removeTesttype(input) {
        var vm = this;
        vm.$log.debug('removeTesttype entered', input);
        var path = "../v1/testtype";
        var thedata = {
            id: input.id
        };
        var data = {};
        data.TesttypeExistsList = {};

        return vm.ClassServices.removeTesttype(thedata, path)
            .then(function(data) {
                vm.$log.debug('removeTesttype returned data');
                vm.$log.debug(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    //        vm.TesttypeFKExists = data.TesttypeExistsList;
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getTesttype().then(function(zdata) {
                        vm.$log.debug('getTesttype returned', zdata);
                    },
                    function(error) {
                        vm.$log.debug('Caught an error getTesttype after remove:', error);
                        vm.thisTesttype = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.debug('removeTesttype failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addTesttype(rowEntity) {
        var vm = this;
        vm.updateTesttype(rowEntity, 'Add');
    }
    updateTesttype(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/testtype";

        var thedata = {
            id: rowEntity.id,
            testtype: rowEntity.testtype,
            ranktype: rowEntity.ranktype,
            //                ranktype: vm.Util.getByValue(vm.rankTypes, rowEntity.ranktype, 'id', 'value'),
            testdescription: rowEntity.testdescription
        };

        vm.$log.debug('about updateTesttype ', thedata, updpath, updatetype);
        return vm.ClassServices.updateTesttype(updpath, thedata)
            .then(function(data) {
                vm.$log.debug('updateTesttype returned data');
                vm.$log.debug(data);
                vm.thisTesttype = data;
                vm.$log.debug(vm.thisTesttype);
                vm.$log.debug(vm.thisTesttype.message);
                vm.message = vm.thisTesttype.message;
                if ((typeof vm.thisTesttype === 'undefined' || vm.thisTesttype.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                if (updatetype === 'Add') {
                    vm.getTesttype().then(function(zdata) {
                            vm.$log.debug('getTesttype returned', zdata);
                        },
                        function(error) {
                            vm.$log.debug('Caught an error getTesttype after add:', error);
                            vm.thisTesttype = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });

                }

                return vm.thisTesttype;
            }).catch(function(e) {
                vm.$log.debug('updateTesttype failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getTesttype() {
        var vm = this;
        vm.$log.debug('getTesttype entered');
        var path = '../v1/testtype';

        return vm.ClassServices.getTesttypes(path).then(function(data) {
            vm.$log.debug('getTesttypes returned data');
            vm.$log.debug(data);

            vm.gridOptions.data = data.TesttypeList;
            return data.TesttypeList;
        }, function(error) {
            vm.$log.debug('Caught an error getTesttypes:', error);
            vm.TesttypeList = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }

    getrankTypes() {
        var vm = this;
        vm.$log.debug('getrankTypes entered');
        var path = '../v1/ranktypeids';
        return vm.ClassServices.getRankTypes(path).then(function(data) {
            vm.$log.debug('getrankTypes returned data');
            vm.$log.debug(data);

            vm.rankTypes = data.ranktypelist;
            vm.$log.debug(data.message);
            vm.message = data.message;
            if ((typeof vm.rankTypes === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {}
            return vm.rankTypes;
        }, function(error) {
            vm.$log.debug('Caught an error getrankTypes:', error);
            vm.rankTypes = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }
    setgridOptions() {
        var vm = this;

        vm.gridOptions = {
            enableFiltering: true,
            enableCellEditOnFocus: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.initialLength,
            rowHeight: vm.rowheight,
            appScopeProvider: vm,
            columnDefs: [

                {
                    field: 'testtype',
                    displayName: 'Test Type',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                },
                {
                    field: 'testdescription',
                    displayName: 'Test Description',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'ranktype',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.rankTypes,
                    filter: {
                        options: vm.rankTypes
                    }
                },
                {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeTesttype(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
                }

            ],

            //rowHeight: 15,
            showGridFooter: false,
            enableColumnResizing: true,

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
                            vm.updateTesttype(rowEntity, 'Update');
                        }
                    });

            }
        };



    }


}
