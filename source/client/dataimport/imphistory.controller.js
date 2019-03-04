const { CSV: CSV } = window;
import angular from 'angular';


export class ImphistoryController {

    constructor(
        $scope, $log, StudentServices, Util, uiGridConstants, Notification, $q, portalDataService,
        $window, uiGridValidateService, uiGridExporterConstants, UserServices
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
        this.UserServices = UserServices;
    }

    $onInit() {

        var vm = this;
        CSV.DETECT_TYPES = false;
        vm.loadeddefault = "missing";
        vm.haserrordefault = "";
        vm.thishistory = {};

        vm.gridexp1Options = {};
        vm.gridimp1Options = {};
        vm.step2populated = false;
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
        vm.isStep2NewCollapsed = true;
        vm.isStep1Collapsed = true;
        vm.isStep2Collapsed = true;
        vm.Columns = {};
        vm.thisColumns = [];
        vm.importdata = [];
        vm.filechoice = null;
        vm.bdateformat = "MM/DD/YYYY";
        vm.bdateformattxt = 'textDate:"MM/dd/yyyy"';

        vm.gridLength = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.gridLength = vm.Util.setGridLength(vm.initialLength, vm.rowheight, vm.headerheight);

        vm.setprelimimp1Options();
        vm.activate();
    }

    $onDestroy() {
        this.$log.log("ImphistoryController dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;
//        vm.portalDataService.Portlet('imphistory');
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('ImphistoryController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("imphistory started");

        });

        vm.getColumns();
    }

    step1() {
        var vm = this;
        if (vm.isStep1Collapsed) {
            vm.getStudenthistory();
        }
        return vm.isStep1Collapsed = !vm.isStep1Collapsed;
    }

    step2() {
        var vm = this;
        if (vm.isStep2Collapsed) {
            vm.getColumns();
        }
        return vm.isStep2Collapsed = !vm.isStep2Collapsed;
    }

    clear() {
        var vm=this;

        vm.gridexp1Options.data = [];
        vm.gridimp1Options.data = [];
        vm.importdata = [];
        vm.errCnt = 0;
        vm.isValidForErrors = true;
        vm.removeRawHistorys();
        
    }


    getStudenthistory() {
        var vm = this;
        vm.$log.log('getStudenthistory entered');
        vm.gridexp1Options.data = [];
        var path = '../v1/samplestudenthistory';

        return vm.StudentServices.getSampleStudenthistory(path)
            .then(function(data) {
                vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'getStudenthistory', true);
            vm.gridexp1Options.data = data.StudentHistoryList;
                vm.gridexp1Api.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

            return vm.gridexp1Options.data;
            }, function(error) {
                vm.Util.exceptionError(error, "getStudenthistory", vm.Notification);
                return (vm.$q.reject(error));
            });
    }

    getColumns() {
        var vm = this;

        var Columnslist = [
            { name: "externalid", type: 'string', required: true  },
            { name: "contactmgmttype", type: 'string' , required: true },
            { name: "contactDate", type: 'date', required: true  },
        ];

        vm.setGColumns(Columnslist);
        vm.setGridexp1Options();
        vm.setGridimp1Options();
    }

    setAllGcol(columns) {
        var vm = this;
        var coldef = {};
        var theTypeStr = {};
        var theValidStr = {};
        vm.gcolumns = [];
        for (var i = 0, len = columns.length; i < len; i++) {

            columns[i].haserror = vm.haserrordefault;
            columns[i].loaded = vm.loadeddefault;

            theTypeStr = vm.Util.setTypeStr(columns[i].type, vm.bdateformattxt);

            theValidStr = vm.Util.setValidStrByType(columns[i].name, vm.bdateformat,columns[i].required);

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

        var required = true;
        gcol = vm.Util.setGCol('id', 'Student Id', required);
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setHasErrCol();
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setLoadedCol();
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setExtIdCol('grid.appScope.removeRawHistory(row)');
        vm.impgcolumns.unshift(gcol);

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
        vm.Util.setGridexp1OptionsDefaults(vm.gridexp1Options, 'studenthistory.csv', vm.limits, vm.initialLength, vm.rowheight, vm.gcolumns);


        vm.$log.log('gridexp1Options', vm.gridexp1Options);
    }

    setGridimp1Options() {
        var vm = this;

        vm.Util.setEmailValidator(vm.uiGridValidateService);
        vm.Util.setDateValidator(vm.uiGridValidateService);
        vm.Util.setImpGridDefaults(vm.impgcolumns, vm.gridimp1Options, vm.uiGridConstants, vm.limits, vm.initialLength, vm.rowheight);
        vm.$log.log('gridimp1Api', vm.gridimp1Api);
    }
    setAfterCellEdit(gridApi, func, vm, scope) {
        gridApi.edit.on.afterCellEdit(scope,
            function(rowEntity, colDef, newValue, oldValue) {
                if (newValue != oldValue) {
                    if (func == "rawHistory") {
                        vm.updateRawHistory(rowEntity);
                    }
                }
            });
    }
    setprelimimp1Options() {
        var vm = this;
        vm.gridimp1Options = {
            appScopeProvider: vm,

            importerDataAddCallback: function(grid, newObjects) {
                vm.Util.importerDataSetCallback(grid, newObjects, vm.importdata, vm.step2populated, vm.gridimp1Options);
                vm.createRawHistorys();
            },

            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridimp1Api onRegisterApi');
                vm.gridimp1Api = gridApi;

                vm.setAfterCellEdit(vm.gridimp1Api, "rawHistory", vm, vm.$scope);

                vm.Util.validationFailed(vm.gridimp1Api, [ 'externalid'], 
                    vm.errCnt, vm.isValidForErrors, vm.$scope, vm);

                vm.Util.setPagination(vm.gridimp1Api, vm);

            }

        };

        vm.$log.log('gridimp1Api', vm.gridimp1Api);

    }

    lookupExtas() {
        var vm = this;
        vm.$log.log('lookupExtas entered');
        vm.importdata = vm.gridimp1Options.data;
        var path = '../v1/lookuphistextras';
        var theData = {
            selectedStudents: vm.importdata
        };

        return vm.StudentServices.lookupExtas(path, theData).then(function(data) {
            for (var j = 0, len = vm.importdata.length; j < len; j++) {
                var notfound = true;
                for (var i = 0, len = data.lookups.length; i < len; i++) {
                    if (vm.importdata[j].externalid === data.lookups[i].externalid) {
                        vm.importdata[j].id = data.lookups[i].id;
                        vm.importdata[j].contacterror = data.lookups[i].contacterror;
                        notfound = false;
                        continue;
                    }
                }
                if (notfound) {
                    vm.importdata[j].id = null;
                    vm.importdata[j].contacterror = "missing student";
                }
                if (vm.importdata[j].contacterror !== null ) {
                    var msg = 'An error was found: ' +
                        vm.importdata[j].contacterror ;
               //     vm.Notification.error({ message: msg, delay: 5000 });
                    vm.$log.log('lookupExtas error', msg);
                }

            }

            return data;
        });
    }

    isStep2Populated() {
        var vm = this;
        return vm.step2populated;
    }

    batchValidate() {
        var vm = this;

        vm.errCnt = 0;
        vm.isValidForErrors = true; //if validation error created, this will become false

        vm.lookupExtas().then(function() {
            vm.gridimp1Options.data = vm.importdata;
            vm.Util.validate(vm.gridimp1Api);
        });

    }

    createBulkStudentHistory() {
        var vm = this;
        var path = '../v1/bulkstudenthistory';
        vm.$log.log('about createBulkStudentHistory ');
        var thedata = {
            selectedStudents: vm.gridimp1Options.data
        };

        return vm.StudentServices.createBulkStudentHistory(path, thedata)
            .then(function(data) {
                vm.Util.checkCreateDataSuccess(data, data.history_id, vm.Notification, vm.$q, 'createBulkStudentHistory', true);
                vm.thishistory = data;
                vm.getRawHistoryStatus();
                return data;

            }, function(error) {
                vm.Util.exceptionError(error, "createBulkStudentHistory", vm.Notification);
                return (vm.$q.reject(error));
            });
                
    }

    createRawHistorys() {
        var vm = this;
        var path = '../v1/rawhistory';
        vm.$log.log('about createRawHistorys ');
        var thedata = {
            selectedhistorys: vm.gridimp1Options.data
        };

        return vm.StudentServices.createRawHistorys(path, thedata)
            .then(function(data) {
                vm.thishistory = data;
                vm.Util.checkCreateDataSuccess(data, data.history_id, vm.Notification, vm.$q, 'createRawHistorys', true);

                if (data.history_id > 0) {
                    vm.getRawHistoryStatus();
                }
                return data;

            }, function(error) {
                vm.Util.exceptionError(error, "createRawHistorys", vm.Notification);
                return (vm.$q.reject(error));
            });

    }
    updateRawHistory(input) {
        var vm = this;
        var path = encodeURI('../v1/rawhistory/ext/' + input.externalid + '/type/' + input.contactmgmttype + '/date/' + input.contactDate);

        input.contactDate = vm.Util.oradate(input.contactDate);

        vm.$log.log('about updateRawHistory ', input);

        return vm.StudentServices.updateRawHistory(path, input).then(function(data) {
            vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'updateRawHistory', true);

        }, function(error) {
            vm.Util.exceptionError(error, "updateRawHistory", vm.Notification);
            return (vm.$q.reject(error));
        });
    }

    getRawHistoryStatus() {

        var vm = this;
        var path = "../v1/rawhistorys";
        vm.gridimp1Options.data = [];

        return vm.StudentServices.getRawHistoryStatus(path).then(function(data) {
            vm.Util.checkDataSuccessv2(data, data.rawhistorylist, vm.Notification, vm.$q, 'getRawHistoryStatus', true);

            for (var i = 0, len = data.rawhistorylist.length; i < len; i++) {
                data.rawhistorylist[i].loaded = data.rawhistorylist[i].id > 0 ? "loaded" : "missing";
            }
            vm.gridimp1Options.data = data.rawhistorylist;
            vm.step2populated = vm.gridimp1Options.data.length > 0 ? true : false;

        }, function(error) {
            vm.Util.exceptionError(error, "getRawHistoryStatus", vm.Notification);
            vm.gridimp1Options.data = [];
            return (vm.$q.reject(error));

        });

    }
    removeRawHistory(row) {
        var vm = this;
        vm.$log.log('removeRawHistory entered', row.entity.externalid, row.entity.contactDate, row.entity.contactmgmttype);
        var path = '../v1/rawhistory';
        var thedata = {
            externalid: row.entity.externalid,
            contactDate: row.entity.contactDate,
            contactmgmttype: row.entity.contactmgmttype
        };

        return vm.StudentServices.removeRawHistory(thedata, path)
            .then(function(data) {
                vm.Util.checkRemoveSuccess(data, vm.Notification, vm.$q, 'removeRawHistory', true);
                vm.getRawHistoryStatus();
                return data;
            }, function(error) {
                vm.Util.exceptionError(error, "removeRawHistory", vm.Notification);
                return (vm.$q.reject(error));
            });

    }

    removeRawHistorys() {
        var vm = this;
        vm.$log.log('removeRawHistorys entered');
        var path = '../v1/rawhistorys';

        return vm.StudentServices.removeRawHistorys(path)
            .then(function(data) {
                vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'removeRawHistorys', true);

                return data;
            }, function(error) {
                vm.Util.exceptionError(error, "removeRawHistorys", vm.Notification);
                return (vm.$q.reject(error));
            });

    }

}
