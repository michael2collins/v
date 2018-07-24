(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin.admin')
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
        vm.isCollapsed = true;
        
        vm.getClass = getClass;
        vm.removeClass = removeClass;
        vm.addClass = addClass;
        vm.updateClass = updateClass;
        vm.getRanks = getRanks;
        vm.changeRanktype = changeRanktype;
        vm.changeRanklisttype = changeRanklisttype;
        vm.geturl = geturl;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.imgsrc="./images/classes/";
        vm.Class={};
        vm.rankTypes=[];
        vm.ranks=[];
        vm.ranks2=[];
        vm.thisranks=[];
        vm.thisClass=[];
        vm.gridLength={};
        vm.initialLength=5;
        vm.rowheight=85;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;
        setGridLength(vm.initialLength);

  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("table-basic-class started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("table-basic-class dismissed");
		$log.debugEnabled(false);
    });


        setgridOptions();
        activate();

       $.fn.Data.Portlet('table-basic-class.js');
    

        function activate() {

            getClass().then(function() {
                $log.debug('getClass activate done');
                $q.all([
  /*              getRanks('All').then(function() {
                    $log.debug('getranks activate done',vm.ranks);
                 },function(error) {
                     return ($q.reject(error));
                 }),
    */            getrankTypes().then(function() {
                    $log.debug('getrankTypes activate done',vm.rankTypes);
                    changeRanktype();
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
                        return($q.reject(data));
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

           var vlu={};
//            vlu.rankForNextClass = Util.getByValue(vm.thisranks, rowEntity.rankForNextClass, 'value', 'label');
//            vlu.ranklistForNextClass = Util.getByValue(vm.rankTypes, rowEntity.ranklistForNextClass, 'id', 'value');

            var thedata = {
                id: rowEntity.id,
                class: rowEntity.class,
                registrationType: rowEntity.registrationType,
                nextClass: rowEntity.nextClass,
                ranklistForNextClass: rowEntity.ranklistForNextClass,
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
                    vm.message = vm.thisClass.message  ;
                    if ((typeof vm.thisClass === 'undefined' || vm.thisClass.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message + ': ' + (
                            typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""), delay: 5000});
                        return($q.reject(data));
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
//                    if (updatetype === 'Add') {
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
                        
 //                   }
                    
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
        
        function changeRanktype() {
            vm.Class.registrationTypeVlu = Util.getByValue(vm.rankTypes, vm.Class.registrationType, 'id', 'value');
//            getRanks();
            getRanks().then(function() {
                $log.debug('getranks activate done',vm.ranks);
                vm.gridApi.grid.columns[1].filters[0].term = String(vm.Class.registrationTypeVlu);
    //            vm.gridApi.grid.columns[1].filters[0].term = parseInt(vm.Class.registrationType,10);
                vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
             },function(error) {
                 return ($q.reject(error));
             });
            

        }
        function changeRanklisttype() {
//            vm.Class.registrationTypeVlu = Util.getByValue(vm.rankTypes, vm.Class.registrationType, 'id', 'value');
//            getRanks();
//            vm.gridApi.grid.columns[1].filters[0].term = String(vm.Class.registrationTypeVlu);
//            vm.gridApi.grid.columns[1].filters[0].term = parseInt(vm.Class.registrationType,10);
//            vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);

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
                        vm.Class.registrationType = String(vm.rankTypes[0].id);
                        vm.Class.registrationTypeVlu = String(vm.rankTypes[0].value);
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
        function getRanks(mode) {
            $log.debug('getranks entered',vm.Class.registrationTypeVlu);
            var path;
            if (mode === "All") {
                vm.Class.registrationTypeVlu = 'AdultKarate';
            }    
                path = encodeURI('../v1/ranks?ranktype=' + vm.Class.registrationTypeVlu);
            return getRanksquery(path).then(function(data) {
                    vm.ranks = data;
                    vm.Class.rankForNextClass = String(vm.ranks[0].value);
                    vm.Class.ranklistForNextClass = 
                        typeof vm.Class.registrationType !== undefined ? vm.Class.registrationType : '';
                },function(error) {
                    $log.debug('Caught an error getranks:', error); 
                    vm.ranks = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }
            );

        }
        function getRanksquery(path) {
            $log.debug('getranksquery entered',path);

            return ClassServices.getRanks(path).then(function(data){
                    $log.debug('getranks returned data');
                    $log.debug(data);
                    
                    var ranks = data.Ranklist; 
                    $log.debug(data.message);
                    vm.message = ranks.message;
                    if ((typeof ranks === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        return($q.reject(data));
                    }
                    return ranks;
                }, function(error) {
                    $log.debug('Caught an error getranks:', error); 
                    //ranks = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        
        function getRankss(mode) {
            $log.debug('getranks entered',vm.Class.registrationTypeVlu);
            var path;
            if (mode === "All") {
                path = encodeURI('../v1/ranks?ranktype=AdultKarate' );
            } else {
                path = encodeURI('../v1/ranks?ranktype=' + vm.Class.registrationTypeVlu);
            }    

            return ClassServices.getRanks(path).then(function(data){
                    $log.debug('getranks returned data');
                    $log.debug(data);
                    
                    vm.ranks = data.Ranklist; 
                    $log.debug(data.message);
                    vm.message = vm.ranks.message;
                    if ((typeof vm.ranks === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        return($q.reject(data));
                    } else {
                        vm.Class.rankForNextClass = String(data.Ranklist[0].value);
                    }
                    return vm.ranks;
                }, function(error) {
                    $log.debug('Caught an error getranks:', error); 
                    vm.ranks = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }

        function geturl(input) {
            return vm.imgsrc + input;
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
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.rankTypes,
//                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>', 
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                    filter: { 
//                        term: 'AdultKarate',
//                        term: vm.Class.registrationTypeVlu,
//                        options: vm.rankTypes        
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.rankTypes
                    }
                }, 
                {
                    field: 'ranklistForNextClass',
                    displayName: 'Type of Next Class',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: false,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'value',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.rankTypes,
              //      filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                //    filter: { 
                //        type: uiGridConstants.filter.SELECT,
                //        selectOptions: vm.rankTypes
                //    }
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
                    enableCellEdit: true,
                    enableFiltering: false,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    editDropdownIdLabel: 'label',
                    editDropdownValueLabel: 'label',
                    editDropdownOptionsFunction: function(rowEntity, colDef) {
                        var path;

                        path = encodeURI('../v1/ranks?ranktype=' + rowEntity.ranklistForNextClass);
                        return getRanksquery(path).then(function(data) {
                            vm.thisranks = data;
                            return data;
                        });
                    }
                }, 
                {
                    field: 'sort',
                    displayName: 'Sort Order',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, 
                {
                    field: 'pictureurl',
                    minWidth: 200,
                    displayName: 'Picture',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    cellTemplate: '<zoom ng-src="{{grid.appScope.geturl(grid.getCellValue(row, col))}}" frame="example{{rowRenderIndex}}" img="image{{rowRenderIndex}}"  zoomlvl="2.5" lazy-src></zoom>'
                }, {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeClass(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
                                    if (colDef.name === "ranklistForNextClass") {
                                        //clear the rankForNextClass when the type is changed
                                        rowEntity.rankForNextClass = "NULL";
                                    }
                                    updateClass(rowEntity, 'Update');       
                                }
                    });

                    }
            };
        }

    }

})(window,window.angular);
