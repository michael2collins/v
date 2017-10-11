(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('ClassTableBasicController', ClassTableBasicController);

    ClassTableBasicController.$inject = [
    '$log',
    '$q',
    '$scope',
    '$interval',
    'ClassServices',
    'Util',
        'uiGridConstants',
    'Notification',
    'moment',
    'iddropdownFilter'
    ];

    function ClassTableBasicController(
        $log, $q, $scope, $interval, ClassServices, Util, 
        uiGridConstants,  Notification, moment, iddropdownFilter) {
        /* jshint validthis: true */

        var vm = this;
        var $ = angular.element;
        
        vm.getClass = getClass;
        vm.removeClass = removeClass;
        vm.addClass = addClass;
        vm.updateClass = updateClass;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.Class={};
        vm.rankTypes=[];
        vm.thisClass=[];
        vm.gridLength={};
        vm.initialLength=10;
        vm.rowheight=25;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;
        setGridLength(vm.initialLength);


        setgridOptions();
        activate();

       $.fn.Data.Portlet('table-basic-class.js');
    
        $('.portlet-scroll').slimScroll({
            "height": "250",
            "alwaysVisible": true
        });

        function activate() {

            getClass().then(function() {
                $log.debug('getClass activate done');
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


        function removeClass(input) {
            $log.debug('removeClass entered',input);
            var path = "../v1/class";
            var thedata = {
                id: input.id
            };
            var data = {};
            data.ClassExistsList = {};

            //check ???
            return ClassServices.removeClass( thedata, path)
                .then(function(data){
                    $log.debug('removeClass returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        vm.ClassFKExists = data.ClassExistsList;
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getClass().then
                        (function(zdata) {
                         $log.debug('getClass returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getClass after remove:', error); 
                            vm.thisClass = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeClass failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function addClass(rowEntity) {
            updateClass(rowEntity,'Add');
        }
        function updateClass(rowEntity,updatetype) {
            var updpath = "../v1/class";

            var thedata = {
                id: rowEntity.id,
                class: rowEntity.class,
                registrationType: rowEntity.registrationType,
                nextClass: rowEntity.nextClass,
                rankForNextClass: rowEntity.rankForNextClass,
                ageForNextClass: rowEntity.ageForNextClass,
                sort: rowEntity.sort,
                pictureurl: rowEntity.pictureurl                
            };
            
            $log.debug('about updateClass ',thedata, updpath, updatetype);
            return ClassServices.updateClass(updpath, thedata)
                .then(function(data){
                    $log.debug('updateClass returned data');
                    $log.debug(data);
                    vm.thisClass = data;
                    $log.debug(vm.thisClass);
                    $log.debug(vm.thisClass.message);
                    vm.message = vm.thisClass.message;
                    if ((typeof vm.thisClass === 'undefined' || vm.thisClass.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    if (updatetype === 'Add') {
                        getClass().then
                            (function(zdata) {
                             $log.debug('getClass returned', zdata);
                         },
                            function (error) {
                                $log.debug('Caught an error getClass after remove:', error); 
                                vm.thisClass = [];
                                vm.message = error;
                                Notification.error({message: error, delay: 5000});
                                return ($q.reject(error));
                            });
                        
                    }
                    
                    return vm.thisClass;
                }).catch(function(e) {
                    $log.debug('updateClass failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        
        function getClass() {
            $log.debug('getClass entered');
            var path='../v1/class';

            return ClassServices.getClasses(path).then(function(data){
                    $log.debug('getClasses returned data');
                    $log.debug(data);

                        vm.gridOptions.data = data.Classlist; 
                    vm.Class.sort = parseInt(Util.maxObjArr(data.Classlist,'sort'),10) + 1;
                    
                }, function(error) {
                    $log.debug('Caught an error getClasses:', error); 
                    vm.Classlist = [];
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
                    vm.Class.registrationType=vm.rankTypes[0].ranktype;
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
                showGridFooter: false,
                enableColumnResizing: true,
            columnDefs: [

                {
                    field: 'class',
                    displayName: 'Class',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, 
                {
                    field: 'registrationType',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'ranktype',
                    editDropdownValueLabel: 'ranktype',
                    editDropdownOptionsArray: vm.rankTypes
                }, 
                {
                    field: 'nextClass',
                    displayName: 'Next Class',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'ageForNextClass',
                    displayName: 'Age for Next Class',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'rankForNextClass',
                    displayName: 'Rank for Next Class',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'ranktype',
                    editDropdownValueLabel: 'ranktype',
                    editDropdownOptionsArray: vm.rankTypes
                }, 
                {
                    field: 'sort',
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
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeClass(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="fa fa-trash-o"></i>&nbsp; Remove</a></span></div>'
                }

                ],


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
                            updateClass(rowEntity, 'Update');       
                        }
                    });

                    }
            };
        }

    }

})(window,window.angular);
