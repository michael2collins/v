import angular from 'angular';

export class ProgramTableBasicController {
    constructor(

        $log, $q, $scope, $interval, ClassServices, uiGridConstants, Notification, moment, iddropdownFilter, Util, portalDataService

    ) {
        'ngInject';
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
        vm.program = {};
        vm.classTypes = [];
        vm.thisProgram = [];
        vm.gridLength = {};
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);


        vm.setgridOptions();
        vm.activate();

    }
    $onDestroy() {
        this.$log.log("table-basic-program dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;

        vm.getProgram().then(function() {
            vm.$log.log('getProgram activate done');
            vm.getClassTypes().then(function() {
                vm.$log.log('getClassTypes activate done', vm.classTypes);
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

    removeProgram(input) {
        var vm = this;
        vm.$log.log('removeProgram entered', input);
        var path = "../v1/program";
        var thedata = {
            id: input.id
        };
        var data = {};
        data.ProgramExistsList = {};

        //check nclasspays, nclasspgm, studentregistration, testcandidates
        return vm.ClassServices.removeProgram(thedata, path)
            .then(function(data) {
                vm.$log.log('removeProgram returned data');
                vm.$log.log(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    vm.programFKExists = data.ProgramExistsList;
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getProgram().then(function(zdata) {
                        vm.$log.log('getProgram returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getProgram after remove:', error);
                        vm.thisProgram = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.log('removeProgram failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addProgram(rowEntity) {
        var vm = this;
        vm.updateProgram(rowEntity, 'Add');
    }
    updateProgram(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/program";

        var thedata = {
            id: rowEntity.id,
            class: rowEntity.class,
            classType: rowEntity.classType,
            _12MonthPrice: rowEntity._12MonthPrice,
            _6MonthPrice: rowEntity._6MonthPrice,
            _2ndPersonDiscount: rowEntity._2ndPersonDiscount,
            _3rdPersonDiscount: rowEntity._3rdPersonDiscount,
            _4thPersonDiscount: rowEntity._4thPersonDiscount,
            MonthlyPrice: rowEntity.MonthlyPrice,
            WeeklyPrice: rowEntity.WeeklyPrice,
            SpecialPrice: rowEntity.SpecialPrice,
            sortKey: rowEntity.sortKey,

        };

        vm.$log.log('about updateProgram ', thedata, updpath, updatetype);
        return vm.ClassServices.updateProgram(updpath, thedata)
            .then(function(data) {
                vm.$log.log('updateProgram returned data');
                vm.$log.log(data);
                vm.thisProgram = data;
                vm.$log.log(vm.thisProgram);
                vm.$log.log(vm.thisProgram.message);
                vm.message = vm.thisProgram.message;
                if ((typeof vm.thisProgram === 'undefined' || vm.thisProgram.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                if (updatetype === 'Add') {
                    vm.getProgram().then(function(zdata) {
                            vm.$log.log('getProgram returned', zdata);
                        },
                        function(error) {
                            vm.$log.log('Caught an error getProgram after remove:', error);
                            vm.thisProgram = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });

                }

                return vm.thisProgram;
            }).catch(function(e) {
                vm.$log.log('updateProgram failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getProgram() {
        var vm = this;
        vm.$log.log('getProgram entered');
        var path = '../v1/program';

        return vm.ClassServices.getPrograms(path).then(function(data) {
            vm.$log.log('getPrograms returned data');
            vm.$log.log(data);

            vm.gridOptions.data = data.Programlist;
            vm.program.sortKey = parseInt(vm.Util.maxObjArr(data.Programlist, 'sortKey'), 10) + 1;

        }, function(error) {
            vm.$log.log('Caught an error getPrograms:', error);
            vm.Programlist = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }
    getClassTypes() {
        var vm = this;
        vm.$log.log('getClassTypes entered');
        var path = '../v1/classtypes';

        return vm.ClassServices.getClassTypes(path).then(function(data) {
            vm.$log.log('getClassTypes returned data');
            vm.$log.log(data);

            vm.classTypes = data.ClassTypelist;
            vm.program.classType = vm.classTypes[0].value;
            return vm.classTypes;
        }, function(error) {
            vm.$log.log('Caught an error getClassTypes:', error);
            vm.classTypes = [];
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
                    field: 'class',
                    displayName: 'Program',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                },
                {
                    field: 'classType',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classTypes,
                    //                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdownid></div></div>', 
                    filterHeaderTemplate: 'templates/includes/filtercoltemplate.html',
                    filter: {
                        //                          term: 1,
                        options: vm.classTypes
                    }
                },
                {
                    field: 'WeeklyPrice',
                    displayName: 'WeeklyPrice',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'MonthlyPrice',
                    displayName: 'MonthlyPrice',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: '_6MonthPrice',
                    displayName: '6Month Factor',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: '_12MonthPrice',
                    displayName: '12Month Factor',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: '_2ndPersonDiscount',
                    displayName: '2nd person discount',
                    enableCellEdit: true
                },
                {
                    field: '_3rdPersonDiscount',
                    displayName: '3rd person discount',
                    enableCellEdit: true
                },
                {
                    field: '_4thPersonDiscount',
                    displayName: '4th person discount',
                    enableCellEdit: true
                },
                {
                    field: 'SpecialPrice',
                    displayName: 'SpecialPrice',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'sortKey',
                    displayName: 'Sort Order',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeProgram(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
                }

            ],

            //rowHeight: 15,
            showGridFooter: false,
            enableColumnResizing: true,

            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.log('pagination changed');
                    //                        paginationOptions.pageSize = pageSize;
                    vm.setGridLength(pageSize);
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });

                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            vm.updateProgram(rowEntity, 'Update');
                        }
                    });

            }
        };



    }

}
