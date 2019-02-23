import angular from 'angular';

export class ClassTestTableBasicController {
    constructor(
        $log, $q, $scope, $interval, ClassServices, UserServices, uiGridConstants, Notification, moment, iddropdownFilter, Util, portalDataService

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
        this.UserServices = UserServices;
    }
    $onInit() {


        var vm = this;
        //       var $ = angular.element;
        vm.isCollapsed = true;

        vm.gridOptions = {};
        vm.gridApi = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.Classtest = {};
        vm.classes = [];
        vm.testTypes = [];
        vm.thisClassTest = [];
        vm.gridLength = {};
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.dataLoading = true;
        vm.setGridLength(vm.initialLength);

        vm.setgridOptions();
        vm.activate();

    }
    $onDestroy() {
        this.$log.log("table-basic-classtest dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;
        vm.portalDataService.Portlet('table-basic-classtest');
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('ClassTestTableBasicController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("table-basic-classtest started");

        });

        vm.getClassTest().then(function() {
            vm.$log.log('getClassTest activate done');
            vm.$q.all([
                    vm.getTesttypes().then(function() {
                        vm.$log.log('gettestTypes activate done', vm.testTypes);
                    }, function(error) {
                        return (vm.$q.reject(error));
                    }),
                    vm.getClasses().then(function() {
                        vm.$log.log('getClasses activate done', vm.classes);
                    }, function(error) {
                        return (vm.$q.reject(error));
                    })
                ])
                .then(function() {
                    vm.$log.log(' activate done');
                    vm.setgridOptions();
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
                });

        }, function(error) {
            return (vm.$q.reject(error));
        }).
        finally(function() {
            vm.dataLoading = false;
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
    getClasses() {
        var vm = this;
        vm.$log.log('getClasses entered');
        var path = '../v1/classes';
        return vm.ClassServices.getClasses(path).then(function(data) {
            vm.$log.log('getClasses returned data');
            vm.$log.log(data);

            vm.classes = data.ClassList;
            vm.$log.log(data.message);
            vm.message = data.message;
            if ((typeof vm.classes === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data))();
            }
            else {
                for (var iter = 0, len = vm.classes.length; iter < len; iter++) {
                    vm.classes[iter].id = vm.classes[iter].classid;
                    vm.classes[iter].value = vm.classes[iter].class;
                }
                vm.Classtest.classid = String(vm.classes[0].classid);
                vm.Classtest.classVlu = String(vm.classes[0].class);
            }
            return vm.classes;
        }, function(error) {
            vm.$log.log('Caught an error getClasses:', error);
            vm.classes = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });

    }

    getTesttypes() {
        var vm = this;
        vm.$log.log('getTesttypes entered');
        var path = '../v1/testtype';

        return vm.ClassServices.getTesttypes(path).then(function(data) {
            vm.$log.log('getTesttypes returned data');
            vm.$log.log(data);

            vm.testTypes = data.TesttypeList;
            return data.TesttypeList;
        }, function(error) {
            vm.$log.log('Caught an error getTesttypes:', error);
            vm.testTypes = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }

    removeClassTest(input) {
        var vm = this;
        vm.$log.log('removeClassTest entered', input);
        vm.dataLoading = true;

        var path = "../v1/classtest";
        var thedata = {
            id: input.id
        };
        var data = {};
        data.ClassTestExistsList = {};

        return vm.ClassServices.removeClassTest(thedata, path)
            .then(function(data) {
                vm.$log.log('removeClassTest returned data');
                vm.$log.log(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    //        vm.ClassTestFKExists = data.ClassTestExistsList;
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getClassTest().then(function(zdata) {
                        vm.$log.log('getClassTest returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getClassTest after remove:', error);
                        vm.thisClassTest = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.log('removeClassTest failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            }).
        finally(function() {
            vm.dataLoading = false;
        });

    }

    addClassTest(rowEntity) {
        var vm = this;
        vm.updateClassTest(rowEntity, 'Add');
    }
    updateClassTest(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/classtest";
        vm.dataLoading = true;

        var thedata = {
            id: rowEntity.id,
            classid: rowEntity.classid,
            testtypeid: rowEntity.testtypeid,
            sortorder: rowEntity.sortorder
        };

        vm.$log.log('about updateClassTest ', thedata, updpath, updatetype);
        return vm.ClassServices.updateClassTest(updpath, thedata)
            .then(function(data) {
                vm.$log.log('updateClassTest returned data');
                vm.$log.log(data);
                vm.thisClassTest = data;
                vm.$log.log(vm.thisClassTest);
                vm.$log.log(vm.thisClassTest.message);
                vm.message = vm.thisClassTest.message;
                if ((typeof vm.thisClassTest === 'undefined' || vm.thisClassTest.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                vm.getClassTest().then(function(zdata) {
                        vm.$log.log('getClassTest returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getClassTest after add:', error);
                        vm.thisClassTest = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });


                return vm.thisClassTest;
            }).catch(function(e) {
                vm.$log.log('updateClassTest failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            }).
        finally(function() {
            vm.dataLoading = false;
        });
    }

    getClassTest() {
        var vm = this;
        vm.$log.log('getClassTest entered');
        var path = '../v1/classtest';

        return vm.ClassServices.getClassTests(path).then(function(data) {
            vm.$log.log('getClassTests returned data');
            vm.$log.log(data);

            vm.gridOptions.data = data.ClasstestList;
            vm.Classtest.sortorder = parseInt(vm.Util.maxObjArr(data.ClasstestList, 'sortorder'), 10) + 1;

            return data.ClasstestList;
        }, function(error) {
            vm.$log.log('Caught an error getClassTests:', error);
            vm.ClasstestList = [];
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
                    field: 'classid',
                    displayName: 'Class',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classes,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu2id.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.classes
                    }
                },
                {
                    field: 'testtypeid',
                    displayName: "Test Type",
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.testTypes,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu2id.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.testTypes
                    }
                },
                {
                    field: 'sortorder',
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
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeClassTest(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
                    vm.setGridLength(pageSize);
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });

                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            vm.updateClassTest(rowEntity, 'Update');
                        }
                    });

            }
        };



    }


}
