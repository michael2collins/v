(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('BasicTableBasicController', BasicTableBasicController);

    BasicTableBasicController.$inject = [
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

    function BasicTableBasicController(
        $log, $q, $scope, $interval, ClassServices, uiGridConstants,  Notification, moment, iddropdownFilter, Util) {
        /* jshint validthis: true */

        var vm = this;
        var $ = angular.element;
        
        vm.getBasic = getBasic;
        vm.removeBasic = removeBasic;
        vm.addBasic = addBasic;
        vm.updateBasic = updateBasic;
        vm.isCollapsed = true;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.Basic={};
//        [{"id":"ChildrenKarate","value":"ChildrenKarate","order":1},{"id":"AdultKarate","value":"AdultKarate","order":2},{"id":"Wellness","value":"Wellness","order":3},{"id":"Other","value":"Other","order":4},{"id":"Kickboxing","value":"Kickboxing","order":5},{"id":"Zoomba","value":"Zoomba","order":6},{"id":"AfterSchool","value":"AfterSchool","order":7}];
        vm.listTypes = [
{"id":"beltsize","value":"beltsize","order":1},
{"id":"ClassStatus","value":"ClassStatus","order":2},
{"id":"Classtype","value":"Classtype","order":3},
{"id":"ContactType","value":"ContactType","order":4},
{"id":"gisize","value":"gisize","order":5},
{"id":"Instructor Title","value":"Instructor Title","order":6},
{"id":"PaymentPlan","value":"PaymentPlan","order":7},
{"id":"PaymentType","value":"PaymentType","order":8},
{"id":"ranktypelist","value":"ranktypelist","order":9},
{"id":"pgmcat","value":"pgmcat","order":10},
{"id":"classcat","value":"classcat","order":11},
{"id":"agecat","value":"agecat","order":12},
{"id":"shirtsize","value":"shirtsize","order":13}
];
        vm.thisBasic=[];
        
        vm.gridLength={};
        vm.initialLength=10;
        vm.rowheight=25;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;
        setGridLength(vm.initialLength);

  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("table-basic-basic started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("table-basic-basic dismissed");
		$log.debugEnabled(false);
    });

        setgridOptions();
        activate();

       $.fn.Data.Portlet('table-basic-basic.js');
    

        function activate() {

            getBasic().then(function() {
                $log.debug('getBasic activate done');
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

        function removeBasic(input) {
            $log.debug('removeBasic entered',input);
            var path = "../v1/basic";
            var thedata = {
                id: input.id
            };
            var data = {};
            data.BasicExistsList = {};

            //check nclasspays, nclasspgm, studentregistration, testcandidates
            return ClassServices.removeBasic( thedata, path)
                .then(function(data){
                    $log.debug('removeBasic returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        vm.BasicFKExists = data.BasicExistsList;
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getBasic().then
                        (function(zdata) {
                         $log.debug('getBasic returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getBasic after remove:', error); 
                            vm.thisBasic = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeBasic failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function addBasic(rowEntity) {
            updateBasic(rowEntity,'Add');
        }
        function updateBasic(rowEntity,updatetype) {
            var updpath = "../v1/basic";
            // listtype, listkey, listvalue, listorder 

            var thedata = {
                id: rowEntity.id,
                listtype: rowEntity.listtype,
                listkey: rowEntity.listkey,
                listvalue: rowEntity.listvalue,
                listorder: rowEntity.listorder
            };
            
            $log.debug('about updateBasic ',thedata, updpath, updatetype);
            return ClassServices.updateBasic(updpath, thedata)
                .then(function(data){
                    $log.debug('updateBasic returned data');
                    $log.debug(data);
                    vm.thisBasic = data;
                    $log.debug(vm.thisBasic);
                    $log.debug(vm.thisBasic.message);
                    vm.message = vm.thisBasic.message;
                    if ((typeof vm.thisBasic === 'undefined' || vm.thisBasic.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    if (updatetype === 'Add') {
                        getBasic().then
                            (function(zdata) {
                             $log.debug('getBasic returned', zdata);
                         },
                            function (error) {
                                $log.debug('Caught an error getBasic after remove:', error); 
                                vm.thisBasic = [];
                                vm.message = error;
                                Notification.error({message: error, delay: 5000});
                                return ($q.reject(error));
                            });
                        
                    }
                    
                    return vm.thisBasic;
                }).catch(function(e) {
                    $log.debug('updateBasic failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        
        function getBasic() {
            $log.debug('getBasic entered');
            var path='../v1/basic';

            return ClassServices.getBasics(path).then(function(data){
                    $log.debug('getBasics returned data');
                    $log.debug(data);

                        vm.gridOptions.data = data.Basiclist; 

                }, function(error) {
                    $log.debug('Caught an error getBasics:', error); 
                    vm.Basiclist = [];
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
                    field: 'listtype',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.listTypes,
                    filterHeaderTemplate: 'templates/states/filtercoltemplate.html',
                    filter: { 
                        options: vm.listTypes        
                    } 
                }, 
                {
                    field: 'listkey',
                    displayName: 'listkey',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: 'listvalue',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'listorder',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeBasic(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
                            updateBasic(rowEntity, 'Update');       
                        }
                    });

                    }
            };

        }

    }

})(window,window.angular);
