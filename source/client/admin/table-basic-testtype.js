(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin.admin')
        .controller('TesttypeTableBasicController', TesttypeTableBasicController);

    TesttypeTableBasicController.$inject = [
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

    function TesttypeTableBasicController(
        $log, $q, $scope, $interval, ClassServices, uiGridConstants,  Notification, moment, iddropdownFilter, Util ) {
        /* jshint validthis: true */

        var vm = this;
        var $ = angular.element; 
        vm.isCollapsed = true;
        
        vm.getTesttype = getTesttype;
        vm.removeTesttype = removeTesttype;
        vm.addTesttype = addTesttype;
        vm.updateTesttype = updateTesttype;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.Testtype={};
        vm.rankTypes=[];
        vm.thisTesttype=[];
        vm.gridLength={};
        vm.initialLength=10;
        vm.rowheight=25;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;
        setGridLength(vm.initialLength);

  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("table-basic-testtype started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("table-basic-testtype dismissed");
		$log.debugEnabled(false);
    });
        setgridOptions();
        activate();

       $.fn.Data.Portlet('table-basic-testtype.js');
    

        function activate() {

            getTesttype().then(function() {
                $log.debug('getTesttype activate done');
                getrankTypes().then(function() {
                    $log.debug('getrankTypes activate done',vm.rankTypes);
                    setgridOptions();
                    vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);

                 },function(error) {
                     return ($q.reject(error));
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

        function removeTesttype(input) {
            $log.debug('removeTesttype entered',input);
            var path = "../v1/testtype";
            var thedata = {
                id: input.id
            };
            var data = {};
            data.TesttypeExistsList = {};

            return ClassServices.removeTesttype( thedata, path)
                .then(function(data){
                    $log.debug('removeTesttype returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                //        vm.TesttypeFKExists = data.TesttypeExistsList;
                        return($q.reject(data));
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getTesttype().then
                        (function(zdata) {
                         $log.debug('getTesttype returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getTesttype after remove:', error); 
                            vm.thisTesttype = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeTesttype failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function addTesttype(rowEntity) {
            updateTesttype(rowEntity,'Add');
        }
        function updateTesttype(rowEntity,updatetype) {
            var updpath = "../v1/testtype";

            var thedata = {
                id: rowEntity.id,
                testtype: rowEntity.testtype,
                ranktype: rowEntity.ranktype,
//                ranktype: Util.getByValue(vm.rankTypes, rowEntity.ranktype, 'id', 'value'),
                testdescription: rowEntity.testdescription
            };
            
            $log.debug('about updateTesttype ',thedata, updpath, updatetype);
            return ClassServices.updateTesttype(updpath, thedata)
                .then(function(data){
                    $log.debug('updateTesttype returned data');
                    $log.debug(data);
                    vm.thisTesttype = data;
                    $log.debug(vm.thisTesttype);
                    $log.debug(vm.thisTesttype.message);
                    vm.message = vm.thisTesttype.message;
                    if ((typeof vm.thisTesttype === 'undefined' || vm.thisTesttype.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        return($q.reject(data));
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    if (updatetype === 'Add') {
                        getTesttype().then
                            (function(zdata) {
                             $log.debug('getTesttype returned', zdata);
                         },
                            function (error) {
                                $log.debug('Caught an error getTesttype after add:', error); 
                                vm.thisTesttype = [];
                                vm.message = error;
                                Notification.error({message: error, delay: 5000});
                                return ($q.reject(error));
                            });
                        
                    }
                    
                    return vm.thisTesttype;
                }).catch(function(e) {
                    $log.debug('updateTesttype failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        
        function getTesttype() {
            $log.debug('getTesttype entered');
            var path='../v1/testtype';

            return ClassServices.getTesttypes(path).then(function(data){
                    $log.debug('getTesttypes returned data');
                    $log.debug(data);

                        vm.gridOptions.data = data.TesttypeList; 
                    return data.TesttypeList;
                }, function(error) {
                    $log.debug('Caught an error getTesttypes:', error); 
                    vm.TesttypeList = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }

        function getrankTypes() {
            $log.debug('getrankTypes entered');
            var path='../v1/ranktypes';
            return ClassServices.getRankTypes(path).then(function(data){
                    $log.debug('getrankTypes returned data');
                    $log.debug(data);
                    
                    vm.rankTypes = data.RankTypelist; 
                    $log.debug(data.message);
                    vm.message = data.message;
                    if ((typeof vm.rankTypes === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        return($q.reject(data));
                    } else {
                    }
                    return vm.rankTypes;
                }, function(error) {
                    $log.debug('Caught an error getrankTypes:', error); 
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

                {
                    field: 'testtype',
                    displayName: 'Test Type',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: 'testdescription',
                    displayName: 'Test Description',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'ranktype',
                    headerCellClass: Util.highlightFilteredHeader,
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
                            updateTesttype(rowEntity, 'Update');       
                        }
                    });

                    }
            };

                

        }


    }

})(window,window.angular);
