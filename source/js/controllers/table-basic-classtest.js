(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('ClassTestTableBasicController', ClassTestTableBasicController);

    ClassTestTableBasicController.$inject = [
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

    function ClassTestTableBasicController(
        $log, $q, $scope, $interval, ClassServices, uiGridConstants,  Notification, moment, iddropdownFilter, Util ) {
        /* jshint validthis: true */

        var vm = this;
        var $ = angular.element; 
        vm.isCollapsed = true;
        
        vm.getClassTest = getClassTest;
        vm.removeClassTest = removeClassTest;
        vm.addClassTest = addClassTest;
        vm.updateClassTest = updateClassTest;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.Classtest={};
        vm.classes=[];
        vm.testTypes=[];
        vm.thisClassTest=[];
        vm.gridLength={};
        vm.initialLength=10;
        vm.rowheight=25;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;
        vm.dataLoading = true;
        setGridLength(vm.initialLength);

  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("table-basic-ClassTest started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("table-basic-ClassTest dismissed");
		$log.debugEnabled(false);
    });
        setgridOptions();
        activate();

       $.fn.Data.Portlet('table-basic-classtest.js');
    

        function activate() {

            getClassTest().then(function() {
                $log.debug('getClassTest activate done');
                $q.all([
                getTesttypes().then(function() {
                    $log.debug('gettestTypes activate done',vm.testTypes);
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
             }).
            finally(function () { 
                vm.dataLoading = false; 
            }
            );
                 
        }

        function setGridLength(size) {
            vm.gridLength=  {
                height: (size*vm.rowheight)+vm.headerheight+'px'
            };
        }
        function getGridLength() {
            return vm.gridLength;
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
                        vm.Classtest.classid = String(vm.classes[0].classid);
                        vm.Classtest.classVlu = String(vm.classes[0].class);
                    }
                    return vm.classes;
                }, function(error) {
                    $log.debug('Caught an error getClasses:', error); 
                    vm.classes = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
            });
                
        }

        function getTesttypes() {
            $log.debug('getTesttypes entered');
            var path='../v1/testtype';

            return ClassServices.getTesttypes(path).then(function(data){
                    $log.debug('getTesttypes returned data');
                    $log.debug(data);

                        vm.testTypes = data.TesttypeList; 
                    return data.TesttypeList;
                }, function(error) {
                    $log.debug('Caught an error getTesttypes:', error); 
                    vm.testTypes = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }

        function removeClassTest(input) {
            $log.debug('removeClassTest entered',input);
            vm.dataLoading = true;
            
            var path = "../v1/classtest";
            var thedata = {
                id: input.id
            };
            var data = {};
            data.ClassTestExistsList = {};

            return ClassServices.removeClassTest( thedata, path)
                .then(function(data){
                    $log.debug('removeClassTest returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                //        vm.ClassTestFKExists = data.ClassTestExistsList;
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getClassTest().then
                        (function(zdata) {
                         $log.debug('getClassTest returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getClassTest after remove:', error); 
                            vm.thisClassTest = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeClassTest failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                }).
            finally(function () { 
                vm.dataLoading = false; 
            }
            );
            
        }

        function addClassTest(rowEntity) {
            updateClassTest(rowEntity,'Add');
        }
        function updateClassTest(rowEntity,updatetype) {
            var updpath = "../v1/classtest";
            vm.dataLoading = true;

            var thedata = {
                id: rowEntity.id,
                classid: rowEntity.classid,
                testtypeid: rowEntity.testtypeid,
                sortorder: rowEntity.sortorder
            };
            
            $log.debug('about updateClassTest ',thedata, updpath, updatetype);
            return ClassServices.updateClassTest(updpath, thedata)
                .then(function(data){
                    $log.debug('updateClassTest returned data');
                    $log.debug(data);
                    vm.thisClassTest = data;
                    $log.debug(vm.thisClassTest);
                    $log.debug(vm.thisClassTest.message);
                    vm.message = vm.thisClassTest.message;
                    if ((typeof vm.thisClassTest === 'undefined' || vm.thisClassTest.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    getClassTest().then
                        (function(zdata) {
                         $log.debug('getClassTest returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getClassTest after add:', error); 
                            vm.thisClassTest = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                    });
                        

                    return vm.thisClassTest;
                }).catch(function(e) {
                    $log.debug('updateClassTest failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
            }).
            finally(function () { 
                vm.dataLoading = false; 
            }
            );
        }
        
        function getClassTest() {
            $log.debug('getClassTest entered');
            var path='../v1/classtest';

            return ClassServices.getClassTests(path).then(function(data){
                    $log.debug('getClassTests returned data');
                    $log.debug(data);

                        vm.gridOptions.data = data.ClasstestList; 
                    vm.Classtest.sortorder = parseInt(Util.maxObjArr(data.ClasstestList,'sortorder'),10) + 1;
                        
                    return data.ClasstestList;
                }, function(error) {
                    $log.debug('Caught an error getClassTests:', error); 
                    vm.ClasstestList = [];
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
                    filterHeaderTemplate: 'templates/states/filtercoltemplatevlu2id.html',
                    filter: { 
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.classes
                    }
                }, 
                {
                    field: 'testtypeid',
                    displayName: "Test Type",
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.testTypes,
                    filterHeaderTemplate: 'templates/states/filtercoltemplatevlu2id.html',
                    filter: { 
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.testTypes
                    }
                }, 
                {
                    field: 'sortorder',
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
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeClassTest(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
                            updateClassTest(rowEntity, 'Update');       
                        }
                    });

                    }
            };

                

        }


    }

})(window,window.angular);
