import angular from 'angular';

export class QuickpickController {
    constructor(

        $log, $q, $scope, $interval, ClassServices, uiGridConstants,
        Notification, moment, iddropdownFilter, Util, portalDataService

    ) {
        'ngInject';
        console.log('entering QuickpickController controller');
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
        vm.gridOptions = {};
        vm.pickgridOptions = {};
        vm.gridApi;
        vm.pickgridApi;
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.Quickpick = {};
        vm.thisQuickpick = [];
        vm.Ranks = [];
        vm.rankTypes = [];
        vm.classes = [];
        vm.programs = [];
        vm.PaymentPlans = [];
        vm.picklistpick = [];
        vm.pickpick;
        vm.amt=null;
        vm.payOnDayOfMonth=null;

        vm.loading = true;
        vm.loadAttempted = false;

        vm.gridLength = {};
        vm.pickgridLength = {};
        vm.initialLength = 10;
        vm.pickinitiallength = 5;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.pickrowheight = 32;
        vm.pickheaderheight = 140;
        vm.setGridLength(vm.initialLength);
        vm.setpickGridLength(vm.pickinitialLength);


        vm.setgridOptions();
        vm.setpickgridOptions();
        vm.activate();

    }
    $onDestroy() {
        this.$log.debug("table-Quickpick dismissed");
        this.$log.debugEnabled(false);
    }


    activate() {
        var vm = this;
        vm.portalDataService.Portlet('table-Quickpick');

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("table-Quickpick started");

        });



        vm.$q.all([
                vm.getRanks().then(function() {
                    vm.$log.debug('getRank activate done', vm.Ranks);
                }, function(error) {
                    return (vm.$q.reject(error));
                }),
                vm.getRankTypes().then(function() {
                    vm.$log.debug('getrankTypes activate done', vm.rankTypes);
                }, function(error) {
                    return (vm.$q.reject(error));
                }),
                vm.getClasses().then(function() {
                    vm.$log.debug('getClasses activate done', vm.classes);
                }, function(error) {
                    return (vm.$q.reject(error));
                }),
                vm.getPaymentplans().then(function() {
                    vm.$log.debug('getPaymentplans activate done');
                }).catch(function(error) {
                    return (vm.$q.reject(error));
                }),
                vm.getPrograms().then(function() {
                    vm.$log.debug('getPrograms activate done', vm.programs);
                }, function(error) {
                    return (vm.$q.reject(error));
                })

            ])
            .then(function() {
                vm.setgridOptions();
                vm.setpickgridOptions();
                
                vm.getQuickpick().then(function() {
                    vm.$log.debug('getQuickpick activate done');
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
                }, function(error) {
                    return (vm.$q.reject(error));
                });
                vm.getPicklist().then(function() {
                    vm.$log.debug('getPicklist activate done', vm.pickgridOptions.data);
                    vm.pickgridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
                }, function(error) {
                    return (vm.$q.reject(error));
                });

            });


    }

    setGridLength(size) {
        var vm = this;
        vm.gridLength = {
            height: (size * vm.rowheight) + vm.headerheight + 'px'
        };
    }
    setpickGridLength(size) {
        var vm = this;
        vm.pickgridLength = {
            height: (size * vm.pickrowheight) + vm.pickheaderheight + 'px'
        };
    }
    getGridLength() {
        var vm = this;
        return vm.gridLength;
    }
    getpickGridLength() {
        var vm = this;
        return vm.pickgridLength;
    }

    formatter(modelValue, filter, defaultValue) {
        //  $log.debug("formatter arguments", arguments);
        if (modelValue) {
            return filter("currency")(modelValue);
        }
        return defaultValue;
    }

    /*
        changeRanktype() {
            var vm = this;
            vm.$log.debug('changeRanktype return', vm.ClassRank.rankType);
            vm.Quickpick.rankTypeVlu = vm.Util.getByValue(vm.rankTypes, vm.Quickpick.rankType, 'id', 'value');
            vm.getRanks().then(function() {
    //            vm.gridApi.grid.columns[1].filters[0].term = String(vm.ClassRank.rankTypeVlu);
                vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
            }, function(error) {
                return (vm.$q.reject(error));
            });


        }
    */
    removeQuickpick(input) {
        var vm = this;
        vm.$log.debug('removeQuickpick entered', input);
        var path = "../v1/quickpick";
        var thedata = {
            id: input.id
        };
        var data = {};
        data.QuickpickExistsList = {};

        //check nclasspays, nclasspgm, studentregistration, testcandidates
        return vm.ClassServices.removeQuickpick(path, thedata)
            .then(function(data) {
                vm.$log.debug('removeQuickpick returned data');
                vm.$log.debug(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getQuickpick().then(function(zdata) {
                        vm.$log.debug('getQuickpick returned', zdata);
                    },
                    function(error) {
                        vm.$log.debug('Caught an error getQuickpick after remove:', error);
                        vm.thisQuickpick = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.debug('removeQuickpick failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    getPicklist() {
        var vm = this;
        var path = '../v1/picklist';
        vm.$log.debug('getPicklist entered', path);
        return vm.ClassServices.getPicklist(path).then(function(data) {
                vm.$log.debug('getPicklist returned data');
                vm.$log.debug(data);
                //                vm.Picklist = data.picklist;
                if ((typeof data.picklist === 'undefined' || data.picklist.error === true) && typeof data !== 'undefined') {
                    vm.Picklist = [];
                    vm.Notification.error({ message: data, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.pickgridOptions.data = data.picklist;

                }
                return data.picklist;
            },
            function(error) {
                vm.$log.debug('Caught an error getPicklist, going to notify:', error);
                vm.pickgridOptions.data = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    getPaymentplans() {
        var vm = this;
        var path = '../v1/paymentplans';
        vm.$log.debug('getPaymentplans entered', path);
        return vm.ClassServices.getPaymentplans(path).then(function(data) {
                vm.$log.debug('getPaymentplans returned data');
                vm.$log.debug(data);
                vm.PaymentPlans = data.paymentplans;
                if ((typeof data.paymentplans === 'undefined' || data.paymentplans.error === true) && typeof data !== 'undefined') {
                    vm.PaymentPlans = [];
                    vm.Notification.error({ message: data, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    for (var iter = 0, len = vm.PaymentPlans.length; iter < len; iter++) {
                        vm.PaymentPlans[iter].id = vm.PaymentPlans[iter].paymentplan;
                        vm.PaymentPlans[iter].value = vm.PaymentPlans[iter].paymentplan;
                    }
                }
                return vm.PaymentPlans;
            },
            function(error) {
                vm.$log.debug('Caught an error PaymentPlans, going to notify:', error);
                vm.PaymentPlans = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
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
                //        vm.ClassPgm.pgmid = String(vm.programs[0].id);
                //       vm.ClassPgm.pgmVlu = String(vm.programs[0].value);
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

    getRanks() {
        var vm = this;
        vm.$log.debug('getranks entered', vm.Quickpick.rankTypeVlu);
        var path = encodeURI('../v1/ranks?ranktype=' + vm.Quickpick.rankTypeVlu);
        return vm.ClassServices.getRanks(path).then(function(data) {

            vm.$log.debug('getRanks returned data');
            vm.$log.debug(data);

            vm.Ranks = data.Ranklist;
            vm.$log.debug(data.message);
            vm.message = vm.Ranks.message;
            if ((typeof vm.Ranks === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                for (var iter = 0, len = vm.Ranks.length; iter < len; iter++) {
                    //                    vm.Ranks[iter].value = String(vm.Ranks[iter].id);
                    vm.Ranks[iter].value = String(vm.Ranks[iter].label);
                }

            }

            return vm.Ranks;

        }, function(error) {
            vm.$log.debug('Caught an error getranks:', error);
            vm.Ranks = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));
        });

    }
    getRankTypes() {
        var vm = this;
        vm.$log.debug('getRankTypes entered');
        var path = '../v1/ranktypeids';

        return vm.ClassServices.getRankTypes(path).then(function(data) {
            vm.$log.debug('getRankTypes returned data');
            vm.$log.debug(data);

            vm.rankTypes = data.ranktypelist;
            vm.$log.debug(data.message);
            vm.message = data.message;
            if ((typeof vm.rankTypes === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }

            return vm.rankTypes;
        }, function(error) {
            vm.$log.debug('Caught an error getRankTypes:', error);
            vm.rankTypes = [];
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
                //                vm.ClassRank.classid = String(vm.classes[0].classid);
                //                vm.ClassRank.classVlu = String(vm.classes[0].class);
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

    getRanksquery(path) {
        var vm = this;
        vm.$log.debug('getranksquery entered', path);

        return vm.ClassServices.getRanks(path).then(function(data) {
            vm.$log.debug('getranks returned data');
            vm.$log.debug(data);

            var ranks = data.Ranklist;
            vm.$log.debug(data.message);
            vm.message = ranks.message;
            if ((typeof ranks === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            return ranks;
        }, function(error) {
            vm.$log.debug('Caught an error getranks:', error);
            //ranks = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }

    addQuickpick(rowEntity) {
        var vm = this;
        vm.updateQuickpick(rowEntity, 'insert');
    }
    updateQuickpick(rowEntity, mode) {
        var vm = this;
        var updpath = "../v1/quickpick";

        var thedata = {
            id: (mode === 'insert' ? null : rowEntity.id ),
            description: rowEntity.description,
            ranktype: rowEntity.ranktype,
            rank: rowEntity.ranklist,
            rankid: rowEntity.rankid,
            classid: rowEntity.classid,
            class: rowEntity.class,
            pgmid: rowEntity.pgmid,
            pgm: rowEntity.pgm,
            paymentAmount: vm.amt,
            paymentPlan: rowEntity.paymentPlan,
            payOnDayOfMonth: vm.payOnDayOfMonth,
            mode: mode
        };

        vm.$log.debug('about updateQuickpick ', thedata, updpath, mode);
        return vm.ClassServices.updateQuickpick(updpath, thedata)
            .then(function(data) {
                vm.$log.debug('updateQuickpick returned data');
                vm.$log.debug(data);
                vm.thisQuickpick = data;
                vm.$log.debug(vm.thisQuickpick);
                vm.$log.debug(vm.thisQuickpick.message);
                vm.message = vm.thisQuickpick.message;
                if ((typeof vm.thisQuickpick === 'undefined' || vm.thisQuickpick.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                if (mode === 'insert') {
                    vm.getQuickpick().then(function(zdata) {
                            vm.$log.debug('getQuickpick returned', zdata);
                        },
                        function(error) {
                            vm.$log.debug('Caught an error getQuickpick after remove:', error);
                            vm.thisQuickpick = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });

                }

                return vm.thisQuickpick;
            }).catch(function(e) {
                vm.$log.debug('updateQuickpick failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getQuickpick() {
        var vm = this;
        vm.$log.debug('getQuickpick entered');
        var path = '../v1/quickpicks';

        return vm.ClassServices.getQuickpicks(path).then(function(data) {
            vm.$log.debug('getQuickpicks returned data');
            vm.$log.debug(data);
                vm.message = data.message;
                vm.gridOptions.data = [];
                if ((typeof data === 'undefined' || data.error === true) ) {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.gridOptions.data = data.quickpicks;
                    return vm.gridOptions.data;
                }
        }, function(error) {
            vm.$log.debug('Caught an error getQuickpicks:', error);
            vm.gridOptions.data = [];
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
                //ranktype rank class program paytype amt plan dayofm 
                {
                    field: 'description',
                    displayName: 'Description',
                    enableFiltering: true,
                    enableCellEdit: true
                },
                {
                    field: 'ranktype',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    enableFiltering: true,
                    editDropdownOptionsArray: vm.rankTypes,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.rankTypes
                    }
                },
                {
                    field: 'rankid',
                    displayName: 'Rank',
                    enableCellEdit: false,
                    enableFiltering: true,
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'label',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownOptionsArray: vm.Ranks,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu2id.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.Ranks
                    }

                },
                {
                    field: 'classid',
                    displayName: 'Class',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    enableFiltering: true,
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
                    field: 'pgmid',
                    displayName: 'Program',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    enableFiltering: true,
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.programs,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu2id.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.programs
                    }
                },
                {
                    field: 'paymentPlan',
                    displayName: 'Payment Plan',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'value',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.PaymentPlans,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.PaymentPlans
                    }
                },
                {
                    field: 'amt',
                    displayName: 'Amount',
                    enableCellEdit: true,
                    cellClass: 'currency',
                    cellFilter: 'currencyFilter:this'
                },
                {
                    field: 'payOnDayOfMonth',
                    displayName: 'payOn',
                    enableCellEdit: true,
                    type: 'number'
                },

                {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeQuickpick(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
                            vm.updateQuickpick(rowEntity, 'Update');
                        }
                    });

            }
        };

    }
    setSelectedArray(inputArray) {
        var vm = this;
        vm.$log.debug("setSelectedArray entered", inputArray);
        vm.picklistpick = [];

        //class pgm classid pgmid ranktype ranklist rankid

        if (inputArray.length > 0) {
            vm.pickpick = true;
            for (var i = 0, len = inputArray.length; i < len; i++) {
                var info = {
                    class: inputArray[i].class,
                    pgm: inputArray[i].pgm,
                    classid: inputArray[i].classid,
                    pgmid: inputArray[i].pgmid,
                    ranktype: inputArray[i].ranktype,
                    ranklist: inputArray[i].ranklist,
                    rankid: inputArray[i].rankid

                };
                vm.picklistpick.push(info);
            }
        }
        else {
            vm.pickpick = false;
            return;
        }

        vm.$log.debug("setarray", vm.picklistpick);

    }

    setpickgridOptions() {
        var vm = this;

        vm.pickgridOptions = {
            enableFiltering: true,
            enableCellEditOnFocus: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.pickinitialLength,
            rowHeight: vm.pickrowheight,
            multiSelect: false,
            appScopeProvider: vm,
            columnDefs: [
                //class pgm classid pgmid ranktype ranklist rankid

                {
                    field: 'ranktype',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    enableFiltering: true,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.rankTypes
                    }
                },
                {
                    field: 'rankid',
                    displayName: 'Rank',
                    enableCellEdit: false,
                    enableFiltering: true,
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'iddropdown:this',
                    editDropdownOptionsArray: vm.Ranks,
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu2id.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.Ranks
                    }

                },
                {
                    field: 'classid',
                    displayName: 'Class',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    enableFiltering: true,
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    cellFilter: 'iddropdown:this',
                    editDropdownOptionsArray: vm.classes,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu2id.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.classes
                    }
                },
                {
                    field: 'pgmid',
                    displayName: 'Program',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    enableFiltering: true,
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    cellFilter: 'iddropdown:this',
                    editDropdownOptionsArray: vm.programs,

                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu2id.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.programs
                    }
                }
            ],

            //rowHeight: 15,
            showGridFooter: false,
            enableColumnResizing: true,

            onRegisterApi: function(gridApi) {
                vm.$log.debug('vm pickgridapi onRegisterApi');
                vm.pickgridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.debug('pick pagination changed');
                    vm.setpickGridLength(pageSize);
                    vm.pickgridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });
                gridApi.selection.on.rowSelectionChanged(vm.$scope, function(row) {
                    var msg = 'pickgrid row selected ' + row.entity;
                    vm.$log.debug(msg);

                    var selectedArr = vm.pickgridApi.selection.getSelectedRows();
                    vm.$log.debug('selected', selectedArr);
                    vm.setSelectedArray(selectedArr);

                });
                gridApi.selection.on.rowSelectionChangedBatch(vm.$scope, function(rows) {
                    vm.$log.debug("grid batch");
                    var selectedArr = vm.pickgridApi.selection.getSelectedRows();
                    vm.$log.debug('batch selected', selectedArr);
                    vm.setSelectedArray(selectedArr);

                });


            }
        };

    }

}
