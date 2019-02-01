const { CSV: CSV } = window;
import angular from 'angular';


export class ImpattendController {

    constructor(
        $scope, $log, StudentServices, Util, uiGridConstants, Notification, $q, portalDataService,
        $window, uiGridValidateService, uiGridExporterConstants
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
    }

    $onInit() {

        var vm = this;
        CSV.DETECT_TYPES = false;
        vm.loadeddefault = "missing";
        vm.emailrequired = false;
        vm.haserrordefault = "";
        vm.thisattendance = {};

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
        vm.Util.setGridLength(vm.initialLength, vm);

        vm.setprelimimp1Options();
        vm.activate();
    }

    $onDestroy() {
        this.$log.debug("ImpattendController dismissed");
        this.$log.debugEnabled(false);
    }

    activate() {
        var vm = this;
        vm.portalDataService.Portlet('impattendance');

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("impattendance started");

        });

        vm.getColumns();
    }

    step1() {
        var vm = this;
        if (vm.isStep1Collapsed) {
            vm.getStudentAttendance();
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
        vm.importdata =[];
        vm.errCnt = 0;
        vm.isValidForErrors = true;
        vm.removeRawAttendances();
        
    }

    getStudentAttendance() {
        var vm = this;
        vm.$log.debug('getStudentAttendance entered');
        vm.gridexp1Options.data = [];
        var path = '../v1/samplestudentattendance';

        return vm.StudentServices.getSampleStudentAttendance(path).then(function(data) {
                vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'getStudentAttendance', true);
            vm.gridexp1Options.data = data.StudentAttendanceList;

            return vm.gridexp1Options.data;
            }, function(error) {
                vm.Util.exceptionError(error, "getStudentAttendance", vm.Notification);
                return (vm.$q.reject(error));
            });
    }

    getColumns() {
        var vm = this;
//ID, contactID, classID, mondayOfWeek, rank, DOWnum, attended
        var Columnslist = [
            { name: "externalid", type: 'string', required: true   },
            { name: "Classname", type: 'string', required: true   },
            { name: "mondayOfWeek", type: 'date', required: true   },
            { name: "rank", type: 'string', required: true   },
            { name: "DOWnum", type: 'number', required: true   },
            { name: "attended", type: 'number', required: true   },
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

            theValidStr = vm.Util.setValidStrByType(columns[i].name, vm.emailrequired, vm.bdateformat);

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
        gcol = vm.Util.setGCol('classid', 'Class Id', required);
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setHasErrCol();
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setLoadedCol();
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setExtIdCol('grid.appScope.removeRawAttendance(row)');
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
                vm.$log.debug('vm gridexp1Options onRegisterApi');
                vm.gridexp1Api = gridApi;

                vm.Util.setPagination(vm.gridexp1Api, vm);

            }
        };
        vm.Util.setGridexp1OptionsDefaults(vm.gridexp1Options, 'studentattendance.csv', vm.limits, vm.initialLength, vm.rowheight, vm.gcolumns);


        vm.$log.debug('gridexp1Options', vm.gridexp1Options);
    }
    setGridimp1Options() {
        var vm = this;

        vm.Util.setEmailValidator(vm.uiGridValidateService);
        vm.Util.setDateValidator(vm.uiGridValidateService);
        vm.Util.setImpGridDefaults(vm.impgcolumns, vm.gridimp1Options, vm.uiGridConstants, vm.limits, vm.initialLength, vm.rowheight);
        vm.$log.debug('gridimp1Api', vm.gridimp1Api);
    }

    setAfterCellEdit(gridApi, func, vm, scope) {
        gridApi.edit.on.afterCellEdit(scope,
            function(rowEntity, colDef, newValue, oldValue) {
                if (newValue != oldValue) {
                    if (func == "rawAttendance") {
                        vm.updateRawAttendance(rowEntity);
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
                vm.createRawAttendances();
            },

            onRegisterApi: function(gridApi) {
                vm.$log.debug('vm gridimp1Api onRegisterApi');
                vm.gridimp1Api = gridApi;

                vm.setAfterCellEdit(vm.gridimp1Api, "rawAttendance", vm, vm.$scope);

                vm.Util.validationFailed(vm.gridimp1Api, [ 'externalid', 'Classname'], vm.errCnt, vm.isValidForErrors, vm.$scope);

                vm.Util.setPagination(vm.gridimp1Api, vm);

            }

        };

        vm.$log.debug('gridimp1Api', vm.gridimp1Api);

    }

    lookupExtas() {
        var vm = this;
        vm.$log.debug('lookupExtas entered');
        vm.importdata = vm.gridimp1Options.data;
        var path = '../v1/lookupattendextras';
        var theData = {
            selectedStudents: vm.importdata
        };

        return vm.StudentServices.lookupExtas(path, theData).then(function(data) {
            for (var j = 0, len = vm.importdata.length; j < len; j++) {
                var notfound = true;
                for (var i = 0, len = data.lookups.length; i < len; i++) {
                    if (vm.importdata[j].externalid === data.lookups[i].externalid) {
                        vm.importdata[j].id = data.lookups[i].id;
                        vm.importdata[j].classid = data.lookups[i].classid;
                        vm.importdata[j].classerrror = data.lookups[i].classerror;
                        vm.importdata[j].contacterror = data.lookups[i].contacterror;
                        notfound = false;
                        continue;
                    }
                }
                if (notfound) {
                    vm.importdata[j].id = null;
                    vm.importdata[j].classid = null;
                    vm.importdata[j].classerrror = "missing class";
                    vm.importdata[j].contacterror = "missing student";
                }
                if (vm.importdata[j].contacterror !== null ||
                    vm.importdata[j].classerrror !== null ) {
                    var msg = 'An error was found: ' +
                        vm.importdata[j].contacterror + ' ' +
                        vm.importdata[j].classerrror;
                    vm.Notification.error({ message: msg, delay: 5000 });
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

    createBulkStudentAttendance() {
        var vm = this;
        var path = '../v1/bulkstudentattendance';
        vm.$log.debug('about createBulkStudentAttendance ');
        var thedata = {
            selectedStudents: vm.gridimp1Options.data
        };

        return vm.StudentServices.createBulkStudentAttendance(path, thedata)
            .then(function(data) {
                vm.Util.checkCreateDataSuccess(data, data.attendance_id, vm.Notification, vm.$q, 'createBulkStudentAttendance', true);
                vm.thisattendance = data;
                vm.getRawAttendanceStatus();
                return data;

            }, function(error) {
                vm.Util.exceptionError(error, "createBulkStudentAttendance", vm.Notification);
                return (vm.$q.reject(error));
            });
    }

    createRawAttendances() {
        var vm = this;
        var path = '../v1/rawattendance';
        vm.$log.debug('about createRawAttendances ');
        var thedata = {
            selectedattendances: vm.gridimp1Options.data
        };

        return vm.StudentServices.createRawAttendances(path, thedata)
            .then(function(data) {
                vm.thisattendance = data;
                vm.Util.checkCreateDataSuccess(data, data.attendance_id, vm.Notification, vm.$q, 'createRawAttendances', true);

                if (data.attendance_id > 0) {
                    vm.getRawAttendanceStatus();
                }
                return data;

            }, function(error) {
                vm.Util.exceptionError(error, "createRawAttendances", vm.Notification);
                return (vm.$q.reject(error));
            });

    }
    updateRawAttendance(input) {
        var vm = this;
        var path = encodeURI('../v1/rawattendance/ext/' + input.externalid + '/type/' + input.contactmgmttype + '/date/' + input.contactDate);

        input.contactDate = vm.Util.oradate(input.contactDate);

        vm.$log.debug('about updateRawAttendance ', input);

        return vm.StudentServices.updateRawAttendance(path, input).then(function(data) {
            vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'updateRawAttendance', true);

        }, function(error) {
            vm.Util.exceptionError(error, "updateRawAttendance", vm.Notification);
            return (vm.$q.reject(error));
        });
    }

    getRawAttendanceStatus() {

        var vm = this;
        var path = "../v1/rawattendances";
        vm.gridimp1Options.data = [];

        return vm.StudentServices.getRawAttendanceStatus(path).then(function(data) {
            vm.Util.checkDataSuccessv2(data, data.rawattendancelist, vm.Notification, vm.$q, 'getRawAttendanceStatus', true);

            for (var i = 0, len = data.rawattendancelist.length; i < len; i++) {
                data.rawattendancelist[i].loaded = data.rawattendancelist[i].id > 0 ? "loaded" : "missing";
            }
            vm.gridimp1Options.data = data.rawattendancelist;
            vm.step2populated = vm.gridimp1Options.data.length > 0 ? true : false;

        }, function(error) {
            vm.Util.exceptionError(error, "getRawAttendanceStatus", vm.Notification);
            vm.gridimp1Options.data = [];
            return (vm.$q.reject(error));

        });

    }
    removeRawAttendance(row) {
        var vm = this;
        vm.$log.debug('removeRawAttendance entered', row.entity.externalid, row.entity.contactDate, row.entity.contactmgmttype);
        var path = '../v1/rawattendance';
        var thedata = {
            externalid: row.entity.externalid,
            contactDate: row.entity.contactDate,
            contactmgmttype: row.entity.contactmgmttype
        };

        return vm.StudentServices.removeRawAttendance(thedata, path)
            .then(function(data) {
                vm.Util.checkRemoveSuccess(data, vm.Notification, vm.$q, 'removeRawAttendance', true);
                vm.getRawAttendanceStatus();
                return data;
            }, function(error) {
                vm.Util.exceptionError(error, "removeRawAttendance", vm.Notification);
                return (vm.$q.reject(error));
            });

    }

    removeRawAttendances() {
        var vm = this;
        vm.$log.debug('removeRawAttendances entered');
        var path = '../v1/rawattendances';

        return vm.StudentServices.removeRawAttendances(path)
            .then(function(data) {
                vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'removeRawAttendances', true);

                return data;
            }, function(error) {
                vm.Util.exceptionError(error, "removeRawAttendances", vm.Notification);
                return (vm.$q.reject(error));
            });

    }

}
