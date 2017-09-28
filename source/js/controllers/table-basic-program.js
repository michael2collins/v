(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('ProgramTableBasicController', ProgramTableBasicController)
        .filter('griddropdown', function() {
          return function (input, context) {
            
            try {
            
                var map = context.col.colDef.editDropdownOptionsArray;
                var idField = context.col.colDef.editDropdownIdLabel;
                var valueField = context.col.colDef.editDropdownValueLabel;
                var initial = context.row.entity[context.col.field];
                if (typeof map !== "undefined") {
                  for (var i = 0; i < map.length; i++) {
                    if (map[i][idField] == input) {
                      return map[i][valueField];
                    }
                  }
                } else if (initial) {
                  return initial;
                }
                return input;
              
          } catch (e) {
//            context.grid.appScope.log("Error: " + e);
            console.log("error: " + e);
          }
        };
        });
        
    ProgramTableBasicController.$inject = [
    '$log',
    '$q',
    '$scope',
    '$interval',
    'ClassServices',
        'uiGridConstants',
    'Notification',
    'moment'
    ];

    function ProgramTableBasicController(
        $log, $q, $scope, $interval, ClassServices, uiGridConstants,  Notification, moment) {
        /* jshint validthis: true */

        var vm=this;
        
        vm.getProgram = getProgram;
        vm.removeProgram = removeProgram;
        vm.updateProgram = updateProgram;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.program={};
        vm.classTypes = [{"id":"ChildrenKarate","value":"ChildrenKarate","order":1},{"id":"AdultKarate","value":"AdultKarate","order":2},{"id":"Wellness","value":"Wellness","order":3},{"id":"Other","value":"Other","order":4},{"id":"Kickboxing","value":"Kickboxing","order":5},{"id":"Zoomba","value":"Zoomba","order":6},{"id":"AfterSchool","value":"AfterSchool","order":7}];
        vm.thisProgram=[];
        activate();

        function activate() {
            setgridOptions();
            getProgram().then(function() {
                $log.debug('getProgram activate done');
             },function(error) {
                 return ($q.reject(error));
             });
             
        }

        function removeProgram(input) {
            $log.debug('removeProgram entered',input);
            var path = "../v1/program";
            var thedata = {
                id: input.id
            };
            return ClassServices.removeProgram( thedata, path)
                .then(function(data){
                    $log.debug('removeProgram returned data');
                    $log.debug(data);
                    getProgram();
                    return data;
                }).catch(function(e) {
                    $log.debug('removeProgram failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function updateProgram(rowEntity) {
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
            
            $log.debug('about updateProgram ',thedata, updpath);
            return ClassServices.updateProgram(updpath, thedata)
                .then(function(data){
                    $log.debug('updateProgram returned data');
                    $log.debug(data);
                    vm.thisProgram = data;
                    $log.debug(vm.thisProgram);
                    $log.debug(vm.thisProgram.message);
                    vm.message = vm.thisProgram.message;
                    getProgram().then
                        (function(zdata) {
                         $log.debug('getProgram returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getProgram after update:', error); 
                            vm.thisProgram = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });

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

        function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }
        
        function setgridOptions() {
            getClassTypes().then(function() {
            $log.debug('setgridOptions Options:', vm.gridOptions);
                $log.debug('getClassTypes activate done',vm.classTypes);
                vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);

             },function(error) {
                 return ($q.reject(error));
             });
             
            vm.gridOptions = {
                enableFiltering: true,
                enableCellEditOnFocus: true,
                paginationPageSizes: vm.limits,
                paginationPageSize: 10,
                appScopeProvider: vm,
            columnDefs: [

                {
                    field: 'classType',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'griddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classTypes
//                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdownid></div></div>', 
//                    filter: { 
 //                         term: 1,
  //                      options: vm.classTypes        
//                    },

                }, 
                {
                    field: 'class',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: '_12MonthPrice',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: '_6MonthPrice',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'MonthlyPrice',
                    displayName: 'MonthlyPrice',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'WeeklyPrice',
                    displayName: 'WeeklyPrice',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'SpecialPrice',
                    displayName: 'SpecialPrice',
                    headerCellClass: vm.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'sortKey',
                    displayName: 'Sort Order',
                    headerCellClass: vm.highlightFilteredHeader,
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
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeProgram(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="fa fa-trash-o"></i>&nbsp; Remove</a></span></div>'
                }

                ],

                //rowHeight: 15,
                showGridFooter: false,
                enableColumnResizing: true,

                onRegisterApi: function(gridApi) {
                    $log.debug('vm gridapi onRegisterApi');
                     vm.gridApi = gridApi;

                        gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
                        $log.debug('rowEntity');
                        $log.debug(rowEntity);
                        //Alert to show what info about the edit is available
                        $log.debug('Column: ' + colDef.name  + 
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue    );
                        if (newValue != oldValue) {
                            updateProgram(rowEntity);       
                        }
                    });

                    }
            };

                

        }

    }

})();
