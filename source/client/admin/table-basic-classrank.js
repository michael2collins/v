import angular from 'angular';

export class ClassRankTableBasicController {
    constructor(

        $log, $q, $scope, $interval, ClassServices, uiGridConstants, Notification, moment, iddropdownFilter, Util, portalDataService

    ) {
        'ngInject';
        console.log('entering ClassRankTableBasicController controller');
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

        vm.ClassRank = [];
        vm.ClassRanklist = [];
        vm.rankTypes = [];
        vm.gridOptions = {};
        vm.gridApi = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.Ranks = [];
        vm.thisranks = [];
        vm.thisClassRank = [];
        vm.gridLength = {};
        vm.initialLength = 5;
        vm.rowheight = 85;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);

        vm.setgridOptions();
        vm.activate();

    }

    activate() {
        var vm = this;
        vm.getClassRank().then(function() {
            vm.$log.debug('getClassRank activate done');
            vm.$q.all([
                    vm.getrankTypes().then(function() {
                        vm.$log.debug('getrankTypes activate done', vm.rankTypes);
                        //  changeRanktype();
                    }, function(error) {
                        return (vm.$q.reject(error));
                    }),
                    vm.getRanks().then(function() {
                        vm.$log.debug('getrankTypes activate done', vm.rankTypes);
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

    changeRanktype() {
        var vm = this;
        vm.$log.debug('changeRanktype return', vm.ClassRank.rankType);
        vm.ClassRank.rankTypeVlu = vm.Util.getByValue(vm.rankTypes, vm.ClassRank.rankType, 'id', 'value');
        vm.getRanks().then(function() {
//            vm.gridApi.grid.columns[1].filters[0].term = String(vm.ClassRank.rankTypeVlu);
            vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
        }, function(error) {
            return (vm.$q.reject(error));
        });


    }
    getrankTypes() {
        var vm = this;
        vm.$log.debug('getrankTypes entered');
        var path = '../v1/ranktypes';
        return vm.ClassServices.getRankTypes(path).then(function(data) {
            vm.$log.debug('getrankTypes returned data');
            vm.$log.debug(data);

            vm.rankTypes = data.RankTypelist;
            vm.$log.debug(data.message);
            vm.message = data.message;
            if ((typeof vm.rankTypes === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                //                        vm.ClassRank.rankType = String(vm.rankTypes[0].id);
                //                        vm.ClassRank.rankTypeVlu = String(vm.rankTypes[0].value);
            }
            return vm.rankTypes;
        }, function(error) {
            vm.$log.debug('Caught an error getrankTypes:', error);
            vm.rankTypes = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }

    removeClassRank(input) {
        var vm = this;
        vm.$log.debug('removeClassRank entered', input);
        var path = "../v1/ClassRank";
        var thedata = {
            id: input.id
        };
        var data = {};
        data.ClassRankExistsList = {};

        //check ???
        return vm.ClassServices.removeClassRank(thedata, path)
            .then(function(data) {
                vm.$log.debug('removeClassRank returned data');
                vm.$log.debug(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    //                        vm.ClassRankFKExists = data.ClassRankExistsList;
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getClassRank().then(function(zdata) {
                        vm.$log.debug('getClassRank returned', zdata);
                    },
                    function(error) {
                        vm.$log.debug('Caught an error getClassRank after remove:', error);
                        vm.thisClassRank = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.debug('removeClassRank failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addClassRank(rowEntity) {
        var vm = this;
        vm.updateClassRank(rowEntity, 'Add');
    }
    updateClassRank(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/ClassRank";

        var thedata = {
            id: rowEntity.id,
            classid: rowEntity.classid,
            rankid: rowEntity.rankid
        };

        vm.$log.debug('about updateClassRank ', thedata, updpath, updatetype);
        return vm.ClassServices.updateClassRank(updpath, thedata)
            .then(function(data) {
                vm.$log.debug('updateClassRank returned data');
                vm.$log.debug(data);
                vm.thisClassRank = data;
                vm.$log.debug(vm.thisClassRank);
                vm.$log.debug(vm.thisClassRank.message);
                vm.message = vm.thisClassRank.message;
                if ((typeof vm.thisClassRank === 'undefined' || vm.thisClassRank.error === true) &&
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
                vm.getClassRank().then(function(zdata) {
                        vm.$log.debug('getClassRank returned', zdata);
                    },
                    function(error) {
                        vm.$log.debug('Caught an error getClassRank after remove:', error);
                        vm.thisClassRank = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });

                //                   }

                return vm.thisClassRank;
            }).catch(function(e) {
                vm.$log.debug('updateClassRank failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getClassRank() {
        var vm = this;
        vm.$log.debug('getClassRank entered');
        var path = '../v1/ClassRank';

        return vm.ClassServices.getClassRanks(path).then(function(data) {
            vm.$log.debug('getClassRanks returned data');
            vm.$log.debug(data);
            vm.gridOptions.data = data.ClassRankList;
//todo, to make ranktype filter work, we need the rantype relationship
        }, function(error) {
            vm.$log.debug('Caught an error getClassRankes:', error);
            vm.ClassRanklist = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }
    getRanks() {
        var vm = this;
        vm.$log.debug('getranks entered', vm.ClassRank.rankTypeVlu);
        var path = encodeURI('../v1/ranks?ranktype=' + vm.ClassRank.rankTypeVlu);
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
                    vm.Ranks[iter].value = String(vm.Ranks[iter].id);
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
                vm.ClassRank.classid = String(vm.classes[0].classid);
                vm.ClassRank.classVlu = String(vm.classes[0].class);
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
                    headerCellClass: vm.Util.highlightFilteredHeader,
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
                    field: 'rankid',
                    displayName: 'Rank',
                    enableCellEdit: true,
                    enableFiltering: false,
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'label',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownOptionsArray: vm.Ranks

                    //                    editDropdownOptionsFunction: function(rowEntity, colDef) {
                    //                        var path;

                    //                        path = encodeURI('../v1/ranks?ranktype=' + vm.ClassRank.rankTypeVlu);
                    //                        return getRanksquery(path).then(function(data) {
                    //                            vm.thisranks = data;
                    //                           return data;
                    //                      });
                    //                    }

                }, {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeClassRank(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
                            vm.updateClassRank(rowEntity, 'Update');
                        }
                    });

            }
        };
    }

}
