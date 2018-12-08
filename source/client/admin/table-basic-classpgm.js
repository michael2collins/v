import angular from 'angular';

export class ClassPgmTableBasicController {
    constructor(
        $log, $q, $scope, $interval, ClassServices, Util,
        uiGridConstants, Notification, moment, iddropdownFilter, portalDataService
    ) {
        'ngInject';
        console.log('entering ClassPgmTableBasicController controller');
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
        var $ = angular.element;
        vm.isCollapsed = true;

        vm.ClassPgm = [];
        vm.ClassPgmlist = [];
        vm.agecats = [];
        vm.classcats = [];
        vm.pgmcats = [];
        vm.gridOptions = {};
        vm.gridApi = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.programs = [];
        vm.classes = [];
        vm.thisClassPgm = [];
        vm.gridLength = {};
        vm.initialLength = 5;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);


        vm.setgridOptions();
        vm.activate();

    }
    $onDestroy() {
        this.$log.debug("table-basic-classpgm dismissed");
        this.$log.debugEnabled(false);
    }

    activate() {
        var vm = this;
        vm.portalDataService.Portlet('table-basic-class');

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("table-basic-class started");

        });
        vm.getClassPgm().then(function() {
            vm.$log.debug('getClassPgm activate done');
            vm.$q.all([
                    vm.getPrograms().then(function() {
                        vm.$log.debug('getPrograms activate done', vm.programs);
                    }, function(error) {
                        return (vm.$q.reject(error));
                    }),
                    vm.getClasscats().then(function() {
                        vm.$log.debug('getClasscats activate done', vm.classcats);
                    }, function(error) {
                        return (vm.$q.reject(error));
                    }),
                    vm.getPgmcats().then(function() {
                        vm.$log.debug('getPgmcats activate done', vm.pgmcats);
                    }, function(error) {
                        return (vm.$q.reject(error));
                    }),
                    vm.getAgecats().then(function() {
                        vm.$log.debug('getAgecats activate done', vm.agecats);
                    }, function(error) {
                        return (vm.$q.reject(error));
                    }),
                    vm.getClasses().then(function() {
                        vm.$log.debug('getClasses activate done', vm.classes);
                    }, function(error) {
                        return (vm.$q.reject(error));
                    })
                ])
                .then(function() {
                    vm.$log.debug(' activate done');
                    vm.setgridOptions();
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
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


    removeClassPgm(input) {
        var vm = this;
        vm.$log.debug('removeClassPgm entered', input);
        var path = "../v1/ClassPgm";
        var thedata = {
            id: input.id
        };
        var data = {};
        data.ClassPgmExistsList = {};

        //check ???
        return vm.ClassServices.removeClassPgm(thedata, path)
            .then(function(data) {
                vm.$log.debug('removeClassPgm returned data');
                vm.$log.debug(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    vm.ClassPgmFKExists = data.ClassPgmExistsList;
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getClassPgm().then(function(zdata) {
                        vm.$log.debug('getClassPgm returned', zdata);
                    },
                    function(error) {
                        vm.$log.debug('Caught an error getClassPgm after remove:', error);
                        vm.thisClassPgm = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.debug('removeClassPgm failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addClassPgm(rowEntity) {
        var vm = this;
        vm.updateClassPgm(rowEntity, 'Add');
    }
    updateClassPgm(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/ClassPgm";

        var thedata = {
            id: rowEntity.id,
            classid: rowEntity.classid,
            pgmid: rowEntity.pgmid,
            //                classcat: vm.Util.getByValue(vm.classcats, rowEntity.classcat, 'id', 'value'),
            //                pgmcat: vm.Util.getByValue(vm.pgmcats, rowEntity.pgmcat, 'id', 'value'),
            //                agecat: vm.Util.getByValue(vm.agecats, rowEntity.agecat, 'id', 'value'),
            classcat: rowEntity.classcat,
            pgmcat: rowEntity.pgmcat,
            agecat: rowEntity.agecat,
            nextClassid: rowEntity.nextClassid,
            nextPgmid: rowEntity.nextPgmid
        };

        vm.$log.debug('about updateClassPgm ', thedata, updpath, updatetype);
        return vm.ClassServices.updateClassPgm(updpath, thedata)
            .then(function(data) {
                vm.$log.debug('updateClassPgm returned data');
                vm.$log.debug(data);
                vm.thisClassPgm = data;
                vm.$log.debug(vm.thisClassPgm);
                vm.$log.debug(vm.thisClassPgm.message);
                vm.message = vm.thisClassPgm.message;
                if ((typeof vm.thisClassPgm === 'undefined' || vm.thisClassPgm.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({
                        message: vm.message + ': ' + (
                            typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
                        delay: 5000
                    });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                //                    if (updatetype === 'Add') {
                vm.getClassPgm().then(function(zdata) {
                        vm.$log.debug('getClassPgm returned', zdata);
                    },
                    function(error) {
                        vm.$log.debug('Caught an error getClassPgm after remove:', error);
                        vm.thisClassPgm = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });

                //                   }

                return vm.thisClassPgm;
            }).catch(function(e) {
                vm.$log.debug('updateClassPgm failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getClassPgm() {
        var vm = this;
        vm.$log.debug('getClassPgm entered');
        var path = '../v1/ClassPgm';

        return vm.ClassServices.getClassPgms(path).then(function(data) {
            vm.$log.debug('getClassPgmes returned data');
            vm.$log.debug(data);
            vm.gridOptions.data = data.ClassPgmList;

        }, function(error) {
            vm.$log.debug('Caught an error getClassPgmes:', error);
            vm.ClassPgmlist = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }

    getPrograms() {
        var vm = this;
        vm.$log.debug('getPrograms entered');
        var path = '../v1/programs';
        return vm.ClassServices.getPrograms(path).then(function(data) {
            vm.$log.debug('getPrograms returned data');
            vm.$log.debug(data);

            vm.programs = data.Programlist;
            vm.$log.debug(data.message);
            vm.message = data.message;
            if ((typeof vm.programs === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                vm.ClassPgm.pgmid = String(vm.programs[0].id);
                vm.ClassPgm.pgmVlu = String(vm.programs[0].value);
            }
            return vm.programs;
        }, function(error) {
            vm.$log.debug('Caught an error getPrograms:', error);
            vm.programs = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }
    getClasses() {
        var vm = this;
        vm.$log.debug('getClasses entered');
        var path = '../v1/classes';
        return vm.ClassServices.getClasses(path).then(function(data) {
            vm.$log.debug('getClasses returned data');
            vm.$log.debug(data);

            vm.classes = data.ClassList;
            vm.$log.debug(data.message);
            vm.message = data.message;
            if ((typeof vm.classes === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                for (var iter = 0, len = vm.classes.length; iter < len; iter++) {
                    vm.classes[iter].id = vm.classes[iter].classid;
                    vm.classes[iter].value = vm.classes[iter].class;
                }
                vm.ClassPgm.classid = String(vm.classes[0].classid);
                vm.ClassPgm.classVlu = String(vm.classes[0].class);
            }
            return vm.classes;
        }, function(error) {
            vm.$log.debug('Caught an error getClasses:', error);
            vm.classes = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }
    getPgmcats() {
        var vm = this;
        vm.$log.debug('pgmcats entered');
        return vm.ClassServices.distinctPgm().then(function(data) {
            vm.$log.debug('getpgmcats returned data');
            vm.$log.debug(data);

            vm.pgmcats = data.pgmcatlist;
            vm.$log.debug(data.message);
            vm.message = data.message;
            if ((typeof vm.pgmcats === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                for (var iter = 0, len = vm.pgmcats.length; iter < len; iter++) {
                    //                            vm.pgmcats[iter].id = iter;
                    vm.pgmcats[iter].id = vm.pgmcats[iter].pgmcat;
                    vm.pgmcats[iter].value = vm.pgmcats[iter].pgmcat;
                }
                vm.ClassPgm.pgmcat = String(vm.pgmcats[0].id);
                vm.ClassPgm.pgmcatVlu = String(vm.pgmcats[0].value);
            }
            return vm.pgmcats;
        }, function(error) {
            vm.$log.debug('Caught an error getpgmcats:', error);
            vm.pgmcats = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }
    getClasscats() {
        var vm = this;
        vm.$log.debug('classcats entered');
        return vm.ClassServices.distinctCat().then(function(data) {
            vm.$log.debug('getclasscats returned data');
            vm.$log.debug(data);

            vm.classcats = data.classcatlist;

            vm.$log.debug(data.message);
            vm.message = data.message;
            if ((typeof vm.classcats === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                for (var iter = 0, len = vm.classcats.length; iter < len; iter++) {
                    //                            vm.classcats[iter].id = iter;
                    vm.classcats[iter].id = vm.classcats[iter].classcat;
                    vm.classcats[iter].value = vm.classcats[iter].classcat;
                }
                vm.ClassPgm.classcat = String(vm.classcats[0].id);
                vm.ClassPgm.classcatVlu = String(vm.classcats[0].value);
            }
            return vm.classcats;
        }, function(error) {
            vm.$log.debug('Caught an error getclasscats:', error);
            vm.classcats = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }
    getAgecats() {
        var vm = this;
        vm.$log.debug('agecats entered');
        return vm.ClassServices.distinctAge().then(function(data) {
            vm.$log.debug('getagecats returned data');
            vm.$log.debug(data);

            vm.agecats = data.agecatlist;
            vm.$log.debug(data.message);
            vm.message = data.message;
            if ((typeof vm.agecats === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                for (var iter = 0, len = vm.agecats.length; iter < len; iter++) {
                    //                            vm.agecats[iter].id = iter;
                    vm.agecats[iter].value = vm.agecats[iter].agecat;
                    vm.agecats[iter].id = vm.agecats[iter].agecat;
                }

                vm.ClassPgm.agecat = String(vm.agecats[0].id);
                vm.ClassPgm.agecatVlu = String(vm.agecats[0].value);
            }
            return vm.agecats;
        }, function(error) {
            vm.$log.debug('Caught an error getagecats:', error);
            vm.agecats = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }

    geturl(input) {
        var vm = this;
        return vm.imgsrc + input;
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
            showGridFooter: false,
            enableColumnResizing: true,
            columnDefs: [

                {
                    field: 'classid',
                    displayName: 'Class',
                    headerCellClassPgm: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classes,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplate.html',
                    filter: {
                        options: vm.classes
                    }
                },
                {
                    field: 'pgmid',
                    displayName: 'Program',
                    headerCellClassPgm: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.programs,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.programs
                    }
                },
                {
                    field: 'nextClassid',
                    displayName: 'Next Class',
                    headerCellClassPgm: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classes,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplate.html',
                    filter: {
                        options: vm.classes
                    }
                },
                {
                    field: 'nextPgmid',
                    displayName: 'Next Program',
                    headerCellClassPgm: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.programs,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.programs
                    }
                },
                {
                    field: 'pgmcat',
                    displayName: 'Program Category',
                    headerCellClassPgm: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.pgmcats,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplate.html',
                    filter: {
                        options: vm.pgmcats
                    }
                },
                {
                    field: 'classcat',
                    displayName: 'Class Category',
                    headerCellClassPgm: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classcats,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplate.html',
                    filter: {
                        options: vm.classcats
                    }

                },
                {
                    field: 'agecat',
                    displayName: 'Age Category',
                    headerCellClassPgm: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.agecats,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplate.html',
                    filter: {
                        options: vm.agecats
                    }

                }, {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeClassPgm(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
                            if (colDef.name === "ranklistForNextClassPgm") {
                                //clear the rankForNextClassPgm when the type is changed
                                rowEntity.rankForNextClassPgm = "NULL";
                            }
                            vm.updateClassPgm(rowEntity, 'Update');
                        }
                    });

            }
        };
    }

}
