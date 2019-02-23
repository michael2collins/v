const { CSV: CSV } = window;
import angular from 'angular';


export class ImpstudentController {

    constructor(
        $scope, $log, StudentServices, Util, uiGridConstants, Notification, $q, portalDataService,
        $window, uiGridValidateService, uiGridExporterConstants, $interval, $sce, cfpLoadingBar, UserServices
    ) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;
        this.StudentServices = StudentServices;
        this.portalDataService = portalDataService;
        this.Util = Util;
        this.uiGridConstants = uiGridConstants;
        this.Notification = Notification;
        this.$q = $q;
        this.$window = $window;
        this.uiGridValidateService = uiGridValidateService;
        this.uiGridExporterConstants = uiGridExporterConstants;
        this.$interval = $interval;
        this.$sce = $sce;
        this.cfpLoadingBar = cfpLoadingBar;
        this.UserServices = UserServices;
    }

    $onInit() {

        var vm = this;
        vm.cfpLoadingBar.start();
        CSV.DETECT_TYPES = false;
        vm.loadeddefault = "missing";
        vm.haserrordefault = "";

        vm.gridOptions = {};
        vm.gridexp1Options = {};
        vm.gridimp1Options = {};
        vm.step3populated = false;
        vm.isValidForErrors = false;
        vm.loadedfilter = "all";
        vm.errfilter = "all";

        vm.picklistImp1 = [];
        vm.pickImp1 = {};
        vm.errCnt = 0;
        vm.gridApi = {};
        vm.gridexp1Api = {};
        vm.gridimp1Api = {};
        vm.gcolumns = {};
        vm.impgcolumns = {};
        vm.StudentCols = [];
        vm.isStep1NewCollapsed = true;
        vm.isStep3NewCollapsed = true;
        vm.isStep1Collapsed = true;
        vm.isStep2Collapsed = true;
        vm.isStep3Collapsed = true;
        vm.StudentColMap = {};
        vm.thisStudentColMap = [];
        vm.importdata = [];
        vm.okcol = false;
        vm.filechoice = null;
        vm.bdateformat = "MM/DD/YYYY";
        vm.bdateformattxt = 'textDate:"MM/dd/yyyy"';

        vm.gridLength = {};
        vm.thisstudent = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.gridLength = vm.Util.setGridLength(vm.initialLength, vm.rowheight, vm.headerheight);

        vm.setprelimimp1Options();
        vm.setGridOptions();
        vm.activate();
    }

    $onDestroy() {
        this.$log.log("ImpstudentController dismissed");
        //this.$log.logEnabled(false);
    }

    isokCol() {
        var vm = this;
        return vm.okcol;
    }

    activate() {
        var vm = this;
        vm.portalDataService.Portlet('impstudent');
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('ImpstudentController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("impstudent started");

        });

        vm.$q.all([
                vm.getStudentCols().then(function() {
                    vm.$log.log('getStudentCols', vm.StudentCols);
                }),
                vm.getStudentColMap().then(function() {
                    vm.$log.log('getStudentColMap done');
                })
            ])
            .then(function() {
                vm.$log.log(' activate returned');
                vm.cfpLoadingBar.complete();
            });

    }

    getStudentCols() {
        var vm = this;
        var path = '../v1/studentcols';

        return vm.StudentServices.getStudentCols(path)
            .then(function(data) {
                vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'getStudentCols', true);
                vm.StudentCols = data.studentcollist;
                vm.setGridexp1Options();

                return vm.StudentCols;
            }, function(error) {
                vm.Util.exceptionError(error, "getStudentCols", vm.Notification);
                return (vm.$q.reject(error));
            });
    }

    changeColMapName(input) {
        var vm = this;
        vm.$log.log('changeColMapName', input);
        vm.okcol = true;
    }

    step1() {
        var vm = this;
        vm.cfpLoadingBar.start();
        if (vm.isStep1Collapsed) {
            if (!vm.gcolumns.length > 0) {
                vm.activate();
            }
        }
        vm.cfpLoadingBar.complete();
        
        return vm.isStep1Collapsed = !vm.isStep1Collapsed;
    }

    step2() {
        var vm = this;
        vm.cfpLoadingBar.start();
        if (vm.isStep2Collapsed) {
            if (!vm.gcolumns.length > 0) {
                vm.getStudentColMap().then(function(data) {
                    vm.getSampleStudents();
                });
                    
            } else {
                    vm.getSampleStudents();
            }
            
        }
        vm.cfpLoadingBar.complete();
        return vm.isStep2Collapsed = !vm.isStep2Collapsed;
    }

    step3() {
        var vm = this;
        vm.cfpLoadingBar.start();
        if (vm.isStep3Collapsed) {
            if (!vm.gcolumns.length > 0) {
                vm.getStudentColMap();
            }
        }
        vm.cfpLoadingBar.complete();
        return vm.isStep3Collapsed = !vm.isStep3Collapsed;
    }

    clear() {
        var vm = this;
        vm.gridOptions.data = [];
        vm.gridexp1Options.data = [];
        vm.gridimp1Options.data = [];
        vm.importdata = [];
        vm.errCnt = 0;
        vm.isValidForErrors = true;
        vm.removeRawStudents();

    }
    getSampleStudents() {
        var vm = this;
        vm.$log.log('get samplestudents entered');
        vm.gridexp1Options.data = [];
        var path = '../v1/samplestudents';

        return vm.StudentServices.getSampleStudents(path)
            .then(function(data) {
                vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'getSampleStudents', true);
                vm.gridexp1Options.data = data.students;

                return vm.gridexp1Options.data;
            }, function(error) {
                vm.Util.exceptionError(error, "getSampleStudents", vm.Notification);
                return (vm.$q.reject(error));
            });
    }

    getStudentColMap() {
        var vm = this;
        var path = '../v1/studentcolmap';

        return vm.StudentServices.getStudentColMap(path)
            .then(function(data) {
                vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'getStudentColMap', true);
                //        vm.setGridOptions();

                vm.gridOptions.data = data.studentcolmaplist;
                vm.setGColumns(data.studentcolmaplist);
                vm.setGridimp1Options();
                vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
                
                return vm.gridOptions.data;
            }, function(error) {
                vm.Util.exceptionError(error, "getStudentColMap", vm.Notification);
                return (vm.$q.reject(error));
            });
    }
    addAll() {
        var vm = this;
        var rowEntity = {
            id: null,
            field: null,
            type: null,
            all: true,
            required: null
        };

        vm.updateStudentColMap(rowEntity, 'Add', 'all');

    }

    removeAll() {
        var vm = this;
        var input = {
            id: null,
        };
        vm.removeCol(input, "all");
    }

    addStudentColMap(rowEntity) {
        var vm = this;
        vm.updateStudentColMap(rowEntity, 'Add', 'one');

    }

    updateStudentColMap(rowEntity, updatetype, numtype) {
        var vm = this;
        var updpath = "../v1/studentcolmap";

        var thedata = {
            id: rowEntity.id,
            name: rowEntity.field,
            type: rowEntity.type,
            all: numtype,
            required: rowEntity.required
        };

        vm.$log.log('about updateStudentColMap ', thedata, updpath, updatetype);
        return vm.StudentServices.updateStudentColMap(updpath, thedata)
            .then(function(data) {
                    vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'updateStudentColMap', true);
                    vm.thisStudentColMap = data;

                    if (updatetype === 'Add') {
                        vm.getStudentColMap().then(function(zdata) {
                                vm.$log.log('getStudentColMap returned', zdata);
                            },
                            function(error) {
                                vm.Util.exceptionError(error, "getStudentColMap", vm.Notification);
                                return (vm.$q.reject(error));
                            });

                    }
                    vm.okcol = false;
                    vm.StudentColMap = {};
                    vm.isStep2Collapsed = true;

                    return vm.thisStudentColMap;
                },
                function(error) {
                    vm.Util.exceptionError(error, "updateStudentColMap", vm.Notification);
                    return (vm.$q.reject(error));
                });
    }

    removeCol(input, all) {
        var vm = this;
        vm.$log.log('removeCol entered', input);
        var path = '../v1/studentcolmap';
        var thedata = {
            id: input.id,
            all: all
        };

        return vm.StudentServices.removeCol(thedata, path)
            .then(function(data) {
                vm.Util.checkRemoveSuccess(data, vm.Notification, vm.$q, 'removeCol', true);

                vm.getStudentColMap().then(function(zdata) {
                        vm.$log.log('getStudentColMap returned', zdata);
                    },
                    function(error) {
                        vm.Util.exceptionError(error, "getStudentColMap", vm.Notification);
                        return (vm.$q.reject(error));
                    });
                vm.okcol = false;
                vm.StudentColMap = {};
                vm.isStep2Collapsed = true;

                return data;
            }, function(error) {
                vm.Util.exceptionError(error, "removeCol", vm.Notification);
                return (vm.$q.reject(error));
            });

    }

    setAllGcol(columns) {
        var vm = this;
        var coldef = {};
        var teststr = '';
        var testrequired = '';
        var theType = 'String';
        var theTypeStr = {};
        var theValidStr = {};
        vm.gcolumns = [];
        for (var i = 0, len = columns.length; i < len; i++) {

            columns[i].haserror = vm.haserrordefault;
            columns[i].loaded = vm.loadeddefault;
            teststr = columns[i].type;
            teststr.match(/(char|text)/gi) ? theType = "string" :
                teststr.match(/(int|var)/gi) ? theType = "number" :
                teststr.match(/(date|time)/gi) ? theType = "date" :
                theType = "string";

            theTypeStr = vm.Util.setTypeStr(theType, vm.bdateformattxt);

            theValidStr = vm.Util.setValidStrByType(columns[i].name, vm.bdateformat, columns[i].required === "false" ? false : true);

            coldef = vm.Util.setColDef(columns[i].name, theValidStr, theTypeStr);

            vm.gcolumns.push(coldef);

        }
    }

    setGColumns(columns) {
        var vm = this;
        var gcol = [];
        vm.gcolumns = [];
        vm.impgcolumns = [];
        vm.setAllGcol(columns);
        vm.impgcolumns = angular.copy(vm.gcolumns);

        gcol = vm.Util.setHasErrCol();
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setLoadedCol();
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setExtIdCol('grid.appScope.removeRawHistory(row)');
        vm.impgcolumns.unshift(gcol);

    }
    setGridOptions() {
        var vm = this;
        var ct = '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeCol(row.entity,' +
            "one" +
            ')" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>';

        vm.gridOptions = {
            showGridFooter: true,
            enableGridMenu: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.initialLength,
            rowHeight: vm.rowheight,
            enableCellEditOnFocus: true,
            appScopeProvider: vm,
            enableColumnResizing: true,

            columnDefs: [

                {
                    field: 'name',
                    enableCellEdit: false,
                    editDropdownOptionsArray: vm.StudentCols
                },
                {
                    field: 'type',
                    enableCellEdit: false
                },
                {
                    field: 'required',
                    enableCellEdit: false
                },
                {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: ct
                }

            ],

            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;
                vm.Util.setPagination(vm.gridApi, vm);

            }
        };


        vm.$log.log('gridOptions', vm.gridOptions);
    }
    setGridimp1Options() {
        var vm = this;

        vm.Util.setEmailValidator(vm.uiGridValidateService);
        vm.Util.setDateValidator(vm.uiGridValidateService);
        vm.Util.setPhoneValidator(vm.uiGridValidateService);
        vm.Util.setImpGridDefaults(vm.impgcolumns, vm.gridimp1Options, vm.uiGridConstants, vm.limits, vm.initialLength, vm.rowheight);

        vm.$log.log('gridimp1Options', vm.gridimp1Options);
    }

    setGridexp1Options() {
        var vm = this;

        vm.gridexp1Options = {

            exporterFieldCallback: function(grid, row, col, value) {
                vm.Util.setExporterFieldCallback(grid, row, col, value);

                return value;
            },

            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridexp1Options onRegisterApi');
                vm.gridexp1Api = gridApi;

                vm.Util.setPagination(vm.gridexp1Api, vm);

            }
        };
        vm.Util.setGridexp1OptionsDefaults(vm.gridexp1Options, 'students.csv', vm.limits, vm.initialLength, vm.rowheight, vm.gcolumns);

        vm.$log.log('gridexp1Options', vm.gridexp1Options);
    }
    setAfterCellEdit(gridApi, func, vm, scope) {
        gridApi.edit.on.afterCellEdit(scope,
            function(rowEntity, colDef, newValue, oldValue) {
                if (newValue != oldValue) {
                    if (func == "rawcontacts") {
                        vm.updateRawStudent(rowEntity);
                    }
                }
            });
    }

    setprelimimp1Options() {
        var vm = this;
        vm.gridimp1Options = {
            appScopeProvider: vm,

            importerDataAddCallback: function(grid, newObjects) {
                vm.Util.importerDataSetCallback(grid, newObjects, vm.importdata, vm.step3populated, vm.gridimp1Options);
                vm.createRawStudents();
            },

            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridimp1Api onRegisterApi');
                vm.gridimp1Api = gridApi;

                vm.setAfterCellEdit(vm.gridimp1Api, "rawcontacts", vm, vm.$scope);

                vm.Util.validationFailed(vm.gridimp1Api, ['externalid', 'FirstName', 'LastName'], 
                vm.errCnt, vm.isValidForErrors, vm.$scope, vm);

                vm.Util.setPagination(vm.gridimp1Api, vm);

            }

        };

        vm.$log.log('gridimp1Api', vm.gridimp1Api);

    }
    isStep3Populated() {
        var vm = this;
        return vm.step3populated;
    }

    batchValidate() {
        var vm = this;

        vm.errCnt = 0;
        vm.isValidForErrors = true; //if validation error created, this will become false
        vm.Util.validate(vm.gridimp1Api);

    }

    createBulkStudents() {
        var vm = this;
        var path = '../v1/bulkstudent';
        vm.$log.log('about createBulkStudents ');

        return vm.StudentServices.createBulkStudents(path)
            .then(function(data) {
                vm.Util.checkCreateDataSuccess(data, data.student_id, vm.Notification, vm.$q, 'createBulkStudents', true);
                vm.thisstudent = data;
                vm.getRawStudentStatus();
                return data;

            }, function(error) {
                vm.Util.exceptionError(error, "createBulkStudents", vm.Notification);
                return (vm.$q.reject(error));
            });

    }
    createRawStudents() {
        var vm = this;
        var path = '../v1/rawstudent';
        vm.$log.log('about createRawStudents ');
        var thedata = {
            selectedStudents: vm.gridimp1Options.data
        };

        return vm.StudentServices.createRawStudents(path, thedata)
            .then(function(data) {
                vm.thisstudent = data;
                vm.Util.checkCreateDataSuccess(data, data.student_id, vm.Notification, vm.$q, 'createRawStudents', true);
                if (vm.thisstudent.student_id > 0) {
                    vm.getRawStudentStatus();
                }
                return data;

            }, function(error) {
                vm.Util.exceptionError(error, "createRawStudents", vm.Notification);
                return (vm.$q.reject(error));
            });
    }

    updateRawStudent(input) {
        var vm = this;
        var path = encodeURI('../v1/rawstudent/' + input.externalid);

        input.Birthday = vm.Util.oradate(input.Birthday);

        vm.$log.log('about updateRawStudent ', input);

        return vm.StudentServices.updateRawStudent(path, input).then(function(data) {
            vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'updateRawStudent', true);

        }, function(error) {
            vm.Util.exceptionError(error, "updateRawStudent", vm.Notification);
            return (vm.$q.reject(error));
        });
    }

    getRawStudentStatus() {

        var vm = this;
        var path = "../v1/rawstudents";
        vm.gridimp1Options.data = [];

        return vm.StudentServices.getRawStudentStatus(path).then(function(data) {
            vm.Util.checkDataSuccessv2(data, data.rawstudentlist, vm.Notification, vm.$q, 'getRawStudentStatus', true);

            for (var i = 0, len = data.rawstudentlist.length; i < len; i++) {
                data.rawstudentlist[i].loaded = data.rawstudentlist[i].contactid > 0 ? "loaded" : "missing";
            }
            vm.gridimp1Options.data = data.rawstudentlist;
            vm.step3populated = vm.gridimp1Options.data.length > 0 ? true : false;
        }, function(error) {
            vm.Util.exceptionError(error, "getRawStudentStatus", vm.Notification);
            vm.gridimp1Options.data = [];
            return (vm.$q.reject(error));

        });
    }

    removeRawStudent(row) {
        var vm = this;
        vm.$log.log('removeRawStudent entered', row.entity.externalid);
        var path = '../v1/rawstudent';
        var thedata = {
            id: row.entity.externalid
        };

        return vm.StudentServices.removeRawStudent(thedata, path)
            .then(function(data) {
                vm.Util.checkRemoveSuccess(data, vm.Notification, vm.$q, 'removeRawStudent', true);
                vm.getRawStudentStatus();
                return data;
            }, function(error) {
                vm.Util.exceptionError(error, "removeRawStudent", vm.Notification);
                return (vm.$q.reject(error));
            });

    }

    removeRawStudents() {
        var vm = this;
        vm.$log.log('removeRawStudents entered');
        var path = '../v1/rawstudents';

        return vm.StudentServices.removeRawStudents(path)
            .then(function(data) {
                vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'removeRawStudents', true);

                return data;
            }, function(error) {
                vm.Util.exceptionError(error, "removeRawStudents", vm.Notification);
                return (vm.$q.reject(error));
            });
    }

}
