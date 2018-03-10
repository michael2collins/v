(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('RankTableBasicController', RankTableBasicController);

    RankTableBasicController.$inject = [
    '$log',
    '$q',
    '$scope',
    '$interval',
    'ClassServices',
        'uiGridConstants',
    'Notification',
    'moment',
    'iddropdownFilter',
    'Util'
    ];

    function RankTableBasicController(
        $log, $q, $scope, $interval, ClassServices, uiGridConstants,  Notification, moment, iddropdownFilter, Util) {
        /* jshint validthis: true */

        var vm = this;
        var $ = angular.element;
        vm.isCollapsed = true;
        
        vm.getRank = getRank;
        vm.removeRank = removeRank;
        vm.addRank = addRank;
        vm.updateRank = updateRank;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.Rank={};
        vm.rankGroups=[];
        vm.rankTypes=[];
        vm.thisRank=[];
        vm.gridLength={};
        vm.initialLength=10;
        vm.rowheight=25;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;
        setGridLength(vm.initialLength);

  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("table-basic-rank started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("table-basic-rank dismissed");
		$log.debugEnabled(false);
    });

        setgridOptions();
        activate();

       $.fn.Data.Portlet('table-basic-rank.js');
    

        function activate() {

            getRank().then(function() {
                $log.debug('getClass activate done');
                $q.all([
                getRankGroups().then(function() {
                    $log.debug('getRankGroups activate done',vm.ranks);
                 },function(error) {
                     return ($q.reject(error));
                 }),
                getRankTypes().then(function() {
                    $log.debug('getrankTypes activate done',vm.rankTypes);
                 },function(error) {
                     return ($q.reject(error));
                 })
                ])
                .then(function() {
                    $log.debug(' activate done');
                    setgridOptions();
                    vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
            });
                 
             },function(error) {
                 return ($q.reject(error));
             });
             
        }

        function setGridLength(size) {
            vm.gridLength=  {
                height: (size*vm.rowheight)+vm.headerheight+'px'
            };
        }
        function getGridLength() {
            return vm.gridLength;
        }

        function removeRank(input) {
            $log.debug('removeRank entered',input);
            var path = "../v1/rrank";
            var thedata = {
                rankid: input.rankid
            };
            var data = {};
            data.RankExistsList = {};

            //check nclasspays, nclasspgm, studentregistration, testcandidates
            return ClassServices.removeRank( thedata, path)
                .then(function(data){
                    $log.debug('removeRank returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        vm.RankFKExists = data.RankExistsList;
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getRank().then
                        (function(zdata) {
                         $log.debug('getRank returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getRank after remove:', error); 
                            vm.thisRank = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeRank failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function addRank(rowEntity) {
            updateRank(rowEntity,'Add');
        }
        function updateRank(rowEntity,updatetype) {
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
            
            $log.debug('about updateRank ',thedata, updpath, updatetype);
            return ClassServices.updateRank(updpath, thedata)
                .then(function(data){
                    $log.debug('updateRank returned data');
                    $log.debug(data);
                    vm.thisRank = data;
                    $log.debug(vm.thisRank);
                    $log.debug(vm.thisRank.message);
                    vm.message = vm.thisRank.message;
                    if ((typeof vm.thisRank === 'undefined' || vm.thisRank.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    if (updatetype === 'Add') {
                        getRank().then
                            (function(zdata) {
                             $log.debug('getRank returned', zdata);
                         },
                            function (error) {
                                $log.debug('Caught an error getRank after remove:', error); 
                                vm.thisRank = [];
                                vm.message = error;
                                Notification.error({message: error, delay: 5000});
                                return ($q.reject(error));
                            });
                        
                    }
                    
                    return vm.thisRank;
                }).catch(function(e) {
                    $log.debug('updateRank failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        
        function getRank() {
            $log.debug('getRank entered');
            var path='../v1/rrank';

            return ClassServices.getAllRanks(path).then(function(data){
                    $log.debug('getAllRanks returned data');
                    $log.debug(data);

                        vm.gridOptions.data = data.Ranklist; 
                    vm.Rank.sortkey = parseInt(Util.maxObjArr(data.Ranklist,'sortKey'),10) + 1;
                    
                }, function(error) {
                    $log.debug('Caught an error getRanks:', error); 
                    vm.Rank = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        function getRankGroups() {
            $log.debug('getRankGroups entered');
            var path='../v1/rankgroups';

            return ClassServices.getRankGroups(path).then(function(data){
                    $log.debug('getRankGroups returned data');
                    $log.debug(data);
                    
                    vm.rankGroups = data.RankGrouplist; 
                    vm.Rank.rankgroup=vm.rankGroups[0].value;
                    return vm.rankGroups;
                }, function(error) {
                    $log.debug('Caught an error getRankGroups:', error); 
                    vm.rankGroups = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        function getRankTypes() {
            $log.debug('getRankTypes entered');
            var path='../v1/ranktypes';

            return ClassServices.getRankTypes(path).then(function(data){
                    $log.debug('getRankTypes returned data');
                    $log.debug(data);
                    
                    vm.rankTypes = data.RankTypelist; 
                    vm.Rank.ranktype=String(vm.rankTypes[0].value);
                    return vm.rankTypes;
                }, function(error) {
                    $log.debug('Caught an error getRankTypes:', error); 
                    vm.rankTypes = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        function setgridOptions() {
             
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
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: 'ranktype',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'value',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.rankTypes,
//                    filterHeaderTemplate: 'templates/states/filtercoltemplate.html',
                    filter: { 
                        options: vm.rankTypes        
                    }
                }, 
                {
                    field: 'rankGroup',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.rankGroups,
                    filterHeaderTemplate: 'templates/states/filtercoltemplate.html',
                    filter: { 
                        options: vm.rankGroups        
                    }
                }, 
                {
                    field: 'sortkey',
                    displayName: 'sortkey',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'nextsortkey',
                    displayName: 'nextsortkey',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'alphasortkey',
                    displayName: 'alphasortkey Factor',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'AttendPromoteTarget',
                    displayName: 'AttendPromoteTarget',
                    headerCellClass: Util.highlightFilteredHeader,
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
                    $log.debug('vm gridapi onRegisterApi');
                     vm.gridApi = gridApi;

                      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $log.debug('pagination changed');
                        setGridLength(pageSize);
                        vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        
                      });

                        gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            updateRank(rowEntity, 'Update');       
                        }
                    });

                    }
            };
        }
    }

})(window,window.angular);
