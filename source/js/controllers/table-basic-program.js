(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin.all')
        .controller('ProgramTableBasicController', ProgramTableBasicController);

    ProgramTableBasicController.$inject = [
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

    function ProgramTableBasicController(
        $log, $q, $scope, $interval, ClassServices, uiGridConstants,  Notification, moment, iddropdownFilter, Util) {
        /* jshint validthis: true */

        var vm = this;
        var $ = angular.element;
        vm.isCollapsed = true;
        
        vm.getProgram = getProgram;
        vm.removeProgram = removeProgram;
        vm.addProgram = addProgram;
        vm.updateProgram = updateProgram;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.program={};
        vm.classTypes=[];
//        vm.classTypes = [{"id":"ChildrenKarate","value":"ChildrenKarate","order":1},{"id":"AdultKarate","value":"AdultKarate","order":2},{"id":"Wellness","value":"Wellness","order":3},{"id":"Other","value":"Other","order":4},{"id":"Kickboxing","value":"Kickboxing","order":5},{"id":"Zoomba","value":"Zoomba","order":6},{"id":"AfterSchool","value":"AfterSchool","order":7}];
        vm.thisProgram=[];
        vm.gridLength={};
        vm.initialLength=10;
        vm.rowheight=25;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;
        setGridLength(vm.initialLength);

  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("table-basic-program started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("table-basic-program dismissed");
		$log.debugEnabled(false);
    });

        setgridOptions();
        activate();

       $.fn.Data.Portlet('table-basic-program.js');
    

        function activate() {

            getProgram().then(function() {
                $log.debug('getProgram activate done');
                getClassTypes().then(function() {
                    $log.debug('getClassTypes activate done',vm.classTypes);
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

        function removeProgram(input) {
            $log.debug('removeProgram entered',input);
            var path = "../v1/program";
            var thedata = {
                id: input.id
            };
            var data = {};
            data.ProgramExistsList = {};

            //check nclasspays, nclasspgm, studentregistration, testcandidates
            return ClassServices.removeProgram( thedata, path)
                .then(function(data){
                    $log.debug('removeProgram returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        vm.programFKExists = data.ProgramExistsList;
                        return($q.reject(data));
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getProgram().then
                        (function(zdata) {
                         $log.debug('getProgram returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getProgram after remove:', error); 
                            vm.thisProgram = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeProgram failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function addProgram(rowEntity) {
            updateProgram(rowEntity,'Add');
        }
        function updateProgram(rowEntity,updatetype) {
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
            
            $log.debug('about updateProgram ',thedata, updpath, updatetype);
            return ClassServices.updateProgram(updpath, thedata)
                .then(function(data){
                    $log.debug('updateProgram returned data');
                    $log.debug(data);
                    vm.thisProgram = data;
                    $log.debug(vm.thisProgram);
                    $log.debug(vm.thisProgram.message);
                    vm.message = vm.thisProgram.message;
                    if ((typeof vm.thisProgram === 'undefined' || vm.thisProgram.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        return($q.reject(data));
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    if (updatetype === 'Add') {
                        getProgram().then
                            (function(zdata) {
                             $log.debug('getProgram returned', zdata);
                         },
                            function (error) {
                                $log.debug('Caught an error getProgram after remove:', error); 
                                vm.thisProgram = [];
                                vm.message = error;
                                Notification.error({message: error, delay: 5000});
                                return ($q.reject(error));
                            });
                        
                    }
                    
                    return vm.thisProgram;
                }).catch(function(e) {
                    $log.debug('updateProgram failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        
        function getProgram() {
            $log.debug('getProgram entered');
            var path='../v1/program';

            return ClassServices.getPrograms(path).then(function(data){
                    $log.debug('getPrograms returned data');
                    $log.debug(data);

                        vm.gridOptions.data = data.Programlist; 
                    vm.program.sortKey = parseInt(Util.maxObjArr(data.Programlist,'sortKey'),10) + 1;
                    
                }, function(error) {
                    $log.debug('Caught an error getPrograms:', error); 
                    vm.Programlist = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        function getClassTypes() {
            $log.debug('getClassTypes entered');
            var path='../v1/classtypes';

            return ClassServices.getClassTypes(path).then(function(data){
                    $log.debug('getClassTypes returned data');
                    $log.debug(data);
                    
                    vm.classTypes = data.ClassTypelist; 
                    vm.program.classType=vm.classTypes[0].value;
                    return vm.classTypes;
                }, function(error) {
                    $log.debug('Caught an error getClassTypes:', error); 
                    vm.classTypes = [];
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
                    field: 'class',
                    displayName: 'Program',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: 'classType',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classTypes,
//                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdownid></div></div>', 
                    filterHeaderTemplate: 'templates/states/filtercoltemplate.html',
                    filter: { 
//                          term: 1,
                        options: vm.classTypes        
                    }
                }, 
                {
                    field: 'WeeklyPrice',
                    displayName: 'WeeklyPrice',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'MonthlyPrice',
                    displayName: 'MonthlyPrice',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: '_6MonthPrice',
                    displayName: '6Month Factor',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: '_12MonthPrice',
                    displayName: '12Month Factor',
                    headerCellClass: Util.highlightFilteredHeader,
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
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'sortKey',
                    displayName: 'Sort Order',
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
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeProgram(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
//                        paginationOptions.pageSize = pageSize;
                        setGridLength(pageSize);
                        vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        
                      });

                        gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
 /*                       $log.debug('rowEntity');
                        $log.debug(rowEntity);
                        //Alert to show what info about the edit is available
                        $log.debug('Column: ' + colDef.name  + 
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue    );
 */                       if (newValue != oldValue) {
                            updateProgram(rowEntity, 'Update');       
                        }
                    });

                    }
            };

                

        }

    }

})(window,window.angular);
