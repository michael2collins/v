(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('ClassPgmTableBasicController', ClassPgmTableBasicController)
                .filter('iddropdownlocal', function() {
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


    ClassPgmTableBasicController.$inject = [
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

    function ClassPgmTableBasicController(
        $log, $q, $scope, $interval, ClassServices, Util, 
        uiGridConstants,  Notification, moment, iddropdownFilter) {
        /* jshint validthis: true */

        var vm = this;
        var $ = angular.element;
        vm.isCollapsed = true;
        
        vm.getClassPgm = getClassPgm;
        vm.removeClassPgm = removeClassPgm;
        vm.addClassPgm = addClassPgm;
        vm.updateClassPgm = updateClassPgm;
        vm.ClassPgm = [];
        vm.ClassPgmlist=[];
        vm.agecats=[];
        vm.classcats=[];
        vm.pgmcats=[];
        vm.geturl = geturl;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.programs=[];
        vm.classes=[];
        vm.thisClassPgm=[];
        vm.gridLength={};
        vm.initialLength=5;
        vm.rowheight=85;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;
        setGridLength(vm.initialLength);


        setgridOptions();
        activate();

       $.fn.Data.Portlet('table-basic-classpgm.js');
    
        $('.portlet-scroll').slimScroll({
            "height": "250",
            "alwaysVisible": true
        });

        function activate() {

            getClassPgm().then(function() {
                $log.debug('getClassPgm activate done');
                $q.all([
                getPrograms().then(function() {
                    $log.debug('getPrograms activate done',vm.programs);
                 },function(error) {
                     return ($q.reject(error));
                 }),
                getClasscats().then(function() {
                    $log.debug('getClasscats activate done',vm.classcats);
                 },function(error) {
                     return ($q.reject(error));
                 }),
                getPgmcats().then(function() {
                    $log.debug('getPgmcats activate done',vm.pgmcats);
                 },function(error) {
                     return ($q.reject(error));
                 }),
                getAgecats().then(function() {
                    $log.debug('getAgecats activate done',vm.agecats);
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


        function removeClassPgm(input) {
            $log.debug('removeClassPgm entered',input);
            var path = "../v1/ClassPgm";
            var thedata = {
                id: input.id
            };
            var data = {};
            data.ClassPgmExistsList = {};

            //check ???
            return ClassServices.removeClassPgm( thedata, path)
                .then(function(data){
                    $log.debug('removeClassPgm returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        vm.ClassPgmFKExists = data.ClassPgmExistsList;
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getClassPgm().then
                        (function(zdata) {
                         $log.debug('getClassPgm returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getClassPgm after remove:', error); 
                            vm.thisClassPgm = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeClassPgm failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function addClassPgm(rowEntity) {
            updateClassPgm(rowEntity,'Add');
        }
        function updateClassPgm(rowEntity,updatetype) {
            var updpath = "../v1/ClassPgm";

            var thedata = {
                id: rowEntity.id,
                classid: rowEntity.classid,
                pgmid: rowEntity.pgmid,
                classcat: rowEntity.classcat,
                pgmcat: rowEntity.pgmcat,
                agecat: rowEntity.agecat
            };
            
            $log.debug('about updateClassPgm ',thedata, updpath, updatetype);
            return ClassServices.updateClassPgm(updpath, thedata)
                .then(function(data){
                    $log.debug('updateClassPgm returned data');
                    $log.debug(data);
                    vm.thisClassPgm = data;
                    $log.debug(vm.thisClassPgm);
                    $log.debug(vm.thisClassPgm.message);
                    vm.message = vm.thisClassPgm.message  ;
                    if ((typeof vm.thisClassPgm === 'undefined' || vm.thisClassPgm.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message + 
                            typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : "", delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
//                    if (updatetype === 'Add') {
                        getClassPgm().then
                            (function(zdata) {
                             $log.debug('getClassPgm returned', zdata);
                         },
                            function (error) {
                                $log.debug('Caught an error getClassPgm after remove:', error); 
                                vm.thisClassPgm = [];
                                vm.message = error;
                                Notification.error({message: error, delay: 5000});
                                return ($q.reject(error));
                            });
                        
 //                   }
                    
                    return vm.thisClassPgm;
                }).catch(function(e) {
                    $log.debug('updateClassPgm failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        
        function getClassPgm() {
            $log.debug('getClassPgm entered');
            var path='../v1/ClassPgm';

            return ClassServices.getClassPgms(path).then(function(data){
                    $log.debug('getClassPgmes returned data');
                    $log.debug(data);
                    vm.gridOptions.data = data.ClassPgmList; 

                }, function(error) {
                    $log.debug('Caught an error getClassPgmes:', error); 
                    vm.ClassPgmlist = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        
        function getPrograms() {
            $log.debug('getPrograms entered');
            var path='../v1/programs';
            return ClassServices.getPrograms(path).then(function(data){
                    $log.debug('getPrograms returned data');
                    $log.debug(data);
                    
                    vm.programs = data.Programlist; 
                    $log.debug(data.message);
                    vm.message = data.message;
                    if ((typeof vm.programs === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        vm.ClassPgm.pgmid = String(vm.programs[0].id);
                        vm.ClassPgm.pgmVlu = String(vm.programs[0].value);
                    }
                    return vm.programs;
                }, function(error) {
                    $log.debug('Caught an error getPrograms:', error); 
                    vm.programs = [];
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
                        vm.ClassPgm.classid = String(vm.classes[0].classid);
                        vm.ClassPgm.classVlu = String(vm.classes[0].class);
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
        function getPgmcats() {
            $log.debug('pgmcats entered');
            return ClassServices.distinctPgm().then(function(data){
                    $log.debug('getpgmcats returned data');
                    $log.debug(data);
                    
                    vm.pgmcats = data.pgmcatlist; 
                    $log.debug(data.message);
                    vm.message = data.message;
                    if ((typeof vm.pgmcats === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        for (var iter=0,len=vm.pgmcats.length;iter<len;iter++) {
                            vm.pgmcats[iter].id = iter;
                            vm.pgmcats[iter].value = vm.pgmcats[iter].pgmcat;
                        }
                        vm.ClassPgm.pgmcat = String(vm.pgmcats[0].id);
                        vm.ClassPgm.pgmcatVlu = String(vm.pgmcats[0].value);
                    }
                    return vm.pgmcats;
                }, function(error) {
                    $log.debug('Caught an error getpgmcats:', error); 
                    vm.pgmcats = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        function getClasscats() {
            $log.debug('classcats entered');
            return ClassServices.distinctCat().then(function(data){
                    $log.debug('getclasscats returned data');
                    $log.debug(data);
                    
                    vm.classcats = data.classcatlist; 
                    
                    $log.debug(data.message);
                    vm.message = data.message;
                    if ((typeof vm.classcats === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        for (var iter=0,len=vm.classcats.length;iter<len;iter++) {
                            vm.classcats[iter].id = iter;
                            vm.classcats[iter].value = vm.classcats[iter].classcat;
                        }
                        vm.ClassPgm.classcat = String(vm.classcats[0].id);
                        vm.ClassPgm.classcatVlu = String(vm.classcats[0].value);
                    }
                    return vm.classcats;
                }, function(error) {
                    $log.debug('Caught an error getclasscats:', error); 
                    vm.classcats = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        function getAgecats() {
            $log.debug('agecats entered');
            return ClassServices.distinctAge().then(function(data){
                    $log.debug('getagecats returned data');
                    $log.debug(data);
                    
                    vm.agecats = data.agecatlist; 
                    $log.debug(data.message);
                    vm.message = data.message;
                    if ((typeof vm.agecats === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        for (var iter=0,len=vm.agecats.length;iter<len;iter++) {
                            vm.agecats[iter].id = iter;
                            vm.agecats[iter].value = vm.agecats[iter].agecat;
                        }
                        
                        vm.ClassPgm.agecat = String(vm.agecats[0].id);
                        vm.ClassPgm.agecatVlu = String(vm.agecats[0].value);
                    }
                    return vm.agecats;
                }, function(error) {
                    $log.debug('Caught an error getagecats:', error); 
                    vm.agecats = [];
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
                    headerCellClassPgm: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classes,
                    filterHeaderTemplate: 'templates/states/filtercoltemplatevlu.html',
                    filter: { 
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.classes
                    }
                }, 
                {
                    field: 'pgmid',
                    displayName: 'Program',
                    headerCellClassPgm: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.programs,
                    filterHeaderTemplate: 'templates/states/filtercoltemplatevlu.html',
                    filter: { 
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.programs
                    }
                }, 
                {
                    field: 'pgmcat',
                    displayName: 'Program Category',
                    headerCellClassPgm: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.pgmcats,
                    filterHeaderTemplate: 'templates/states/filtercoltemplatevlu.html',
                    filter: { 
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.pgmcats
                    }
                }, 
                {
                    field: 'classcat',
                    displayName: 'Class Category',
                    headerCellClassPgm: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.classcats,
                    filterHeaderTemplate: 'templates/states/filtercoltemplatevlu.html',
                    filter: { 
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.classcats
                    }
                    
                }, 
                {
                    field: 'agecat',
                    displayName: 'Age Category',
                    headerCellClassPgm: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', 
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.agecats,
                    filterHeaderTemplate: 'templates/states/filtercoltemplatevlu.html',
                    filter: { 
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: vm.agecats
                    }
                    
                }, {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeClassPgm(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="fa fa-trash-o"></i>&nbsp; Remove</a></span></div>'
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
                                    if (colDef.name === "ranklistForNextClassPgm") {
                                        //clear the rankForNextClassPgm when the type is changed
                                        rowEntity.rankForNextClassPgm = "NULL";
                                    }
                                    updateClassPgm(rowEntity, 'Update');       
                                }
                    });

                    }
            };
        }

    }

})(window,window.angular);
