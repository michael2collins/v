import angular from 'angular';

export class RankTableBasicController {
    constructor(
       $log, $q, $scope, $interval, ClassServices, uiGridConstants, Notification, moment, iddropdownFilter, Util, portalDataService

    ) {
        'ngInject';
        console.log('entering RankTableBasicController controller');
        this.$log =$log;
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
        vm.Rank = {};
        vm.rankGroups = [];
        vm.rankTypes = [];
        vm.thisRank = [];
        vm.gridLength = {};
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);


        vm.setgridOptions();
        vm.activate();

    }
    $onDestroy() {
        this.$log.debug("table-basic-rank dismissed");
        this.$log.debugEnabled(false);
    }

    activate() {
        var vm = this;

        vm.getRank().then(function() {
           vm.$log.debug('getClass activate done');
         vm.$q.all([
                    vm.getRankGroups().then(function() {
                       vm.$log.debug('getRankGroups activate done', vm.ranks);
                    }, function(error) {
                        return  (vm.$q.reject(error));
                    }),
                    vm.getRankTypes().then(function() {
                       vm.$log.debug('getrankTypes activate done', vm.rankTypes);
                    }, function(error) {
                        return  (vm.$q.reject(error));
                    })
                ])
                .then(function() {
                   vm.$log.debug(' activate done');
                    vm.setgridOptions();
                    vm.gridApi.core.notifyDataChange (vm.uiGridConstants.dataChange.ALL);
                });

        }, function(error) {
            return  (vm.$q.reject(error));
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

    removeRank(input) {
        var vm = this;
       vm.$log.debug('removeRank entered', input);
        var path = "../v1/rrank";
        var thedata = {
            rankid: input.rankid
        };
        var data = {};
        data.RankExistsList = {};

        //check nclasspays, nclasspgm, studentregistration, testcandidates
        return vm.ClassServices.removeRank(thedata, path)
            .then(function(data) {
               vm.$log.debug('removeRank returned data');
               vm.$log.debug(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    vm.RankFKExists = data.RankExistsList;
                    return  (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getRank().then(function(zdata) {
                       vm.$log.debug('getRank returned', zdata);
                    },
                    function(error) {
                       vm.$log.debug('Caught an error getRank after remove:', error);
                        vm.thisRank = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return  (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
               vm.$log.debug('removeRank failure:');
               vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addRank(rowEntity) {
        var vm = this;
        vm.updateRank(rowEntity, 'Add');
    }
    updateRank(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/rrank";
        //ranktype, rankid, ranklist, sortkey, rankGroup, alphasortkey, AttendPromoteTarget, DurationPromoteTarget, school, nextsortkey

        var thedata = {
            rankid: rowEntity.rankid,
            ranklist: rowEntity.ranklist,
            ranktype: rowEntity.ranktype,
            rankGroup: rowEntity.rankGroup,
            sortkey: rowEntity.sortkey,
            alphasortkey: rowEntity.alphasortkey,
            AttendPromoteTarget: rowEntity.AttendPromoteTarget,
            DurationPromoteTarget: rowEntity.DurationPromoteTarget,
            nextsortkey: rowEntity.nextsortkey
        };

       vm.$log.debug('about updateRank ', thedata, updpath, updatetype);
        return vm.ClassServices.updateRank(updpath, thedata)
            .then(function(data) {
               vm.$log.debug('updateRank returned data');
               vm.$log.debug(data);
                vm.thisRank = data;
               vm.$log.debug(vm.thisRank);
               vm.$log.debug(vm.thisRank.message);
                vm.message = vm.thisRank.message;
                if ((typeof vm.thisRank === 'undefined' || vm.thisRank.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return  (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                if (updatetype === 'Add') {
                    vm.getRank().then(function(zdata) {
                           vm.$log.debug('getRank returned', zdata);
                        },
                        function(error) {
                           vm.$log.debug('Caught an error getRank after remove:', error);
                            vm.thisRank = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return  (vm.$q.reject(error));
                        });

                }

                return vm.thisRank;
            }).catch(function(e) {
               vm.$log.debug('updateRank failure:');
               vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getRank() {
        var vm = this;
       vm.$log.debug('getRank entered');
        var path = '../v1/rrank';

        return vm.ClassServices.getAllRanks(path).then(function(data) {
           vm.$log.debug('getAllRanks returned data');
           vm.$log.debug(data);

            vm.gridOptions.data = data.Ranklist;
            vm.Rank.sortkey = parseInt (vm.Util.maxObjArr(data.Ranklist, 'sortKey'), 10) + 1;

        }, function(error) {
           vm.$log.debug('Caught an error getRanks:', error);
            vm.Rank = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return  (vm.$q.reject(error));

        });
    }
    getRankGroups() {
        var vm = this;
       vm.$log.debug('getRankGroups entered');
        var path = '../v1/rankgroups';

        return vm.ClassServices.getRankGroups(path).then(function(data) {
           vm.$log.debug('getRankGroups returned data');
           vm.$log.debug(data);

            vm.rankGroups = data.RankGrouplist;
            vm.Rank.rankgroup = vm.rankGroups[0].value;
            return vm.rankGroups;
        }, function(error) {
           vm.$log.debug('Caught an error getRankGroups:', error);
            vm.rankGroups = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return  (vm.$q.reject(error));

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
            vm.Rank.ranktype = String(vm.rankTypes[0].value);
            return vm.rankTypes;
        }, function(error) {
           vm.$log.debug('Caught an error getRankTypes:', error);
            vm.rankTypes = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return  (vm.$q.reject(error));

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
                //ranktype, rankid, ranklist, sortkey, rankGroup, alphasortkey, AttendPromoteTarget, DurationPromoteTarget, school, nextsortkey 

                {
                    field: 'ranklist',
                    displayName: 'Rank',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                },
                {
                    field: 'ranktype',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'value',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.rankTypes,
                    //                    filterHeaderTemplate: 'templates/includes/filtercoltemplate.html',
                    filter: {
                        options: vm.rankTypes
                    }
                },
                {
                    field: 'rankGroup',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.rankGroups,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplate.html',
                    filter: {
                        options: vm.rankGroups
                    }
                },
                {
                    field: 'sortkey',
                    displayName: 'sortkey',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'nextsortkey',
                    displayName: 'nextsortkey',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'alphasortkey',
                    displayName: 'alphasortkey Factor',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'AttendPromoteTarget',
                    displayName: 'AttendPromoteTarget',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'DurationPromoteTarget',
                    displayName: 'Duration Promote Target',
                    enableCellEdit: true
                },
                {
                    field: 'rankid',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeRank(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
                    vm.gridApi.core.notifyDataChange (vm.uiGridConstants.dataChange.ALL);

                });

                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            vm.updateRank(rowEntity, 'Update');
                        }
                    });

            }
        };
    }
}
