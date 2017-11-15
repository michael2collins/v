(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('ClassRankTableBasicController', ClassRankTableBasicController);

    ClassRankTableBasicController.$inject = [
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

    function ClassRankTableBasicController(
        $log, $q, $scope, $interval, ClassServices, Util, 
        uiGridConstants,  Notification, moment, iddropdownFilter) {
        /* jshint validthis: true */

        var vm = this;
        var $ = angular.element;
        vm.isCollapsed = true;
        
        vm.getClassRank = getClassRank;
        vm.removeClassRank = removeClassRank;
        vm.addClassRank = addClassRank;
        vm.updateClassRank = updateClassRank;
        vm.changeRanktype = changeRanktype;
        vm.ClassRank = [];
        vm.ClassRanklist=[];
        vm.rankTypes=[];
        vm.geturl = geturl;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.Ranks=[];
        vm.thisranks=[];
        vm.thisClassRank=[];
        vm.gridLength={};
        vm.initialLength=5;
        vm.rowheight=85;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;
        setGridLength(vm.initialLength);


        setgridOptions();
        activate();

       $.fn.Data.Portlet('table-basic-classrank.js');
    
        $('.portlet-scroll').slimScroll({
            "height": "250",
            "alwaysVisible": true
        });

        function activate() {

            getClassRank().then(function() {
                $log.debug('getClassRank activate done');
                $q.all([
                getrankTypes().then(function() {
                    $log.debug('getrankTypes activate done',vm.rankTypes);
                  //  changeRanktype();
                 },function(error) {
                     return ($q.reject(error));
                 }),
                getRanks().then(function() {
                    $log.debug('getrankTypes activate done',vm.rankTypes);
                 },function(error) {
                     return ($q.reject(error));
                 }),
                 getClasses().then(function() {
                    $log.debug('getClasses activate done',vm.classes);
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

        function changeRanktype() {
            $log.debug('changeRanktype return',vm.ClassRank.rankType);
            vm.ClassRank.rankTypeVlu = Util.getByValue(vm.rankTypes, vm.ClassRank.rankType, 'id', 'value');
            getRanks().then(function() {
//                vm.gridApi.grid.columns[1].filters[0].term = String(vm.ClassRank.rankTypeVlu);
                vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
             },function(error) {
                 return ($q.reject(error));
             });
            

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
                        $q.reject(data);
                    } else {
//                        vm.ClassRank.rankType = String(vm.rankTypes[0].id);
//                        vm.ClassRank.rankTypeVlu = String(vm.rankTypes[0].value);
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

        function removeClassRank(input) {
            $log.debug('removeClassRank entered',input);
            var path = "../v1/ClassRank";
            var thedata = {
                id: input.id
            };
            var data = {};
            data.ClassRankExistsList = {};

            //check ???
            return ClassServices.removeClassRank( thedata, path)
                .then(function(data){
                    $log.debug('removeClassRank returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
//                        vm.ClassRankFKExists = data.ClassRankExistsList;
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getClassRank().then
                        (function(zdata) {
                         $log.debug('getClassRank returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getClassRank after remove:', error); 
                            vm.thisClassRank = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeClassRank failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function addClassRank(rowEntity) {
            updateClassRank(rowEntity,'Add');
        }
        function updateClassRank(rowEntity,updatetype) {
            var updpath = "../v1/ClassRank";

            var thedata = {
                id: rowEntity.id,
                classid: rowEntity.classid,
                rankid: rowEntity.rankid
            };
            
            $log.debug('about updateClassRank ',thedata, updpath, updatetype);
            return ClassServices.updateClassRank(updpath, thedata)
                .then(function(data){
                    $log.debug('updateClassRank returned data');
                    $log.debug(data);
                    vm.thisClassRank = data;
                    $log.debug(vm.thisClassRank);
                    $log.debug(vm.thisClassRank.message);
                    vm.message = vm.thisClassRank.message  ;
                    if ((typeof vm.thisClassRank === 'undefined' || vm.thisClassRank.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message + 
                            typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : "", delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
//                    if (updatetype === 'Add') {
                        getClassRank().then
                            (function(zdata) {
                             $log.debug('getClassRank returned', zdata);
                         },
                            function (error) {
                                $log.debug('Caught an error getClassRank after remove:', error); 
                                vm.thisClassRank = [];
                                vm.message = error;
                                Notification.error({message: error, delay: 5000});
                                return ($q.reject(error));
                            });
                        
 //                   }
                    
                    return vm.thisClassRank;
                }).catch(function(e) {
                    $log.debug('updateClassRank failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        
        function getClassRank() {
            $log.debug('getClassRank entered');
            var path='../v1/ClassRank';

            return ClassServices.getClassRanks(path).then(function(data){
                    $log.debug('getClassRanks returned data');
                    $log.debug(data);
                    vm.gridOptions.data = data.ClassRankList; 

                }, function(error) {
                    $log.debug('Caught an error getClassRankes:', error); 
                    vm.ClassRanklist = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        function getRanks() {
            $log.debug('getranks entered',vm.ClassRank.rankTypeVlu);
            var path = encodeURI('../v1/ranks?ranktype=' + vm.ClassRank.rankTypeVlu);
            return ClassServices.getRanks(path).then(function(data) {
                
                    $log.debug('getRanks returned data');
                    $log.debug(data);
                    
                    vm.Ranks = data.Ranklist; 
                    $log.debug(data.message);
                    vm.message = vm.Ranks.message;
                    if ((typeof vm.Ranks === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        for (var iter=0,len=vm.Ranks.length;iter<len;iter++) {
                            vm.Ranks[iter].value = String(vm.Ranks[iter].id);
                        }
                        
                    }

                    return vm.Ranks;

                },function(error) {
                    $log.debug('Caught an error getranks:', error); 
                    vm.Ranks = [];
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
                        $q.reject(data);
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

        function getClasses() {
            $log.debug('getClasses entered');
            var path='../v1/classes';
            return ClassServices.getClasses(path).then(function(data){
                    $log.debug('getClasses returned data');
                    $log.debug(data);
                    
                    vm.classes = data.ClassList; 
                    $log.debug(data.message);
                    vm.message = data.message;
                    if ((typeof vm.classes === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        for (var iter=0,len=vm.classes.length;iter<len;iter++) {
                            vm.classes[iter].id = vm.classes[iter].classid;
                            vm.classes[iter].value = vm.classes[iter].class;
                        }
                        vm.ClassRank.classid = String(vm.classes[0].classid);
                        vm.ClassRank.classVlu = String(vm.classes[0].class);
                    }
                    return vm.classes;
                }, function(error) {
                    $log.debug('Caught an error getClasses:', error); 
                    vm.classes = [];
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
                    field: 'classid',
                    displayName: 'Class',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classes,
                    filterHeaderTemplate: 'templates/states/filtercoltemplate.html',
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
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeClassRank(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="fa fa-trash-o"></i>&nbsp; Remove</a></span></div>'
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
                                    updateClassRank(rowEntity, 'Update');       
                                }
                    });

                    }
            };
        }

    }

})(window,window.angular);
