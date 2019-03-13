const { CSV: CSV } = window;
import angular from 'angular';


export class ImpclassController {

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
        vm.thisregistration = {};

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
        this.$log.log("ImpclassController dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;
//        vm.portalDataService.Portlet('impclass');
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('ImpclassController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("impclass started");

        });

        vm.getColumns();
    }

    step1() {
        var vm = this;
        if (vm.isStep1Collapsed) {
            vm.getStudentRegistrations();
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
        var vm = this;
        vm.gridexp1Options.data = [];
        vm.gridimp1Options.data = [];
        vm.importdata = [];
        vm.errCnt = 0;
        vm.isValidForErrors = true;
        vm.removeRawRegistrations();

    }

    getStudentRegistrations() {
        var vm = this;
        vm.$log.log('getStudentRegistrations entered');
        vm.gridexp1Options.data = [];
        var path = '../v1/samplestudentregistrations';

        return vm.StudentServices.getSampleStudentRegistrations(path)
            .then(function(data) {
                vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'getStudentRegistrations', true);

                vm.gridexp1Options.data = data.studentregistrations;
                vm.gridexp1Api.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                return vm.gridexp1Options.data;
            }, function(error) {
                vm.Util.exceptionError(error, "getStudentRegistrations", vm.Notification);
                return (vm.$q.reject(error));
            });
    }

    getColumns() {
        var vm = this;

        var Columnslist = [
            { name: "externalid", type: 'string', required: true },
            //        {name: "classid", type: 'number'},
            { name: "Classname", type: 'string', required: true },
            //        {name: "pgmid",  type: 'number'},
            { name: "Pgmname", type: 'string', required: true },
            { name: "studentClassStatus", type: 'string', required: true },
            { name: "Ranktype", type: 'string', required: true },
            { name: "currentRank", type: 'string', required: true },
            { name: "lastPromoted", type: 'date', required: false },
            { name: "lastPaymentDate", type: 'date', required: false },
            { name: "payerName", type: 'string', required: true },
            { name: "payerEmail", type: 'string', required: false },
            { name: "paymenttype", type: 'string', required: true },
            { name: "paymentplan", type: 'string', required: true },
            { name: "paymentAmount", type: 'number', required: true },
            { name: "payOnDayofMonth", type: 'number', required: true },
        ];

        //externalid,classid,classname,pgmid,pgmname,studentClassStatus,ranktype,currentRank,
        //lastPromoted,payerName,payerEmail,paymenttype,paymentplan,paymentAmount,payOnDayofMonth

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
        gcol = vm.Util.setGCol('pgmid', 'Program Id', required);
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setGCol('classid', 'Class Id', required);
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setHasErrCol();
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setLoadedCol();
        vm.impgcolumns.unshift(gcol);
        gcol = vm.Util.setExtIdCol('grid.appScope.removeRawRegistration(row)');
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
        vm.Util.setGridexp1OptionsDefaults(vm.gridexp1Options, 'studentregistrations.csv', vm.limits, vm.initialLength, vm.rowheight, vm.gcolumns);


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
                    if (func == "rawRegistration") {
                        vm.updateRawRegistration(rowEntity);
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
                vm.createRawRegistrations();
            },

            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridimp1Api onRegisterApi');
                vm.gridimp1Api = gridApi;

                vm.setAfterCellEdit(vm.gridimp1Api, "rawRegistration", vm, vm.$scope);

                vm.Util.validationFailed(vm.gridimp1Api, ['Pgmname', 'Classname', 'externalid'], 
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
        var path = '../v1/lookupextras';
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
                        vm.importdata[j].pgmid = data.lookups[i].pgmid;
                        vm.importdata[j].contacterror = data.lookups[i].contacterror;
                        vm.importdata[j].classerrror = data.lookups[i].classerror;
                        vm.importdata[j].programerror = data.lookups[i].programerror;
                        notfound = false;
                        continue;
                    }
                }
                if (notfound) {
                    vm.importdata[j].id = null;
                    vm.importdata[j].classid = null;
                    vm.importdata[j].pgmid = null;
                    vm.importdata[j].contacterror = "missing student";
                    vm.importdata[j].classerrror = "missing class";
                    vm.importdata[j].programerror = "missing program";
                }
                if (vm.importdata[j].contacterror !== null ||
                    vm.importdata[j].classerrror !== null ||
                    vm.importdata[j].programerror !== null) {
                    var msg = 'An error was found: ' +
                        vm.importdata[j].contacterror + ' ' +
                        vm.importdata[j].classerrror + ' ' +
                        vm.importdata[j].programerror;
                    //    vm.Notification.error({ message: msg, delay: 5000 });
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
    createBulkRegistrations() {
        var vm = this;
        var path = '../v1/bulkstudentregistration';
        vm.$log.log('about createBulkRegistrations ');


        return vm.StudentServices.createBulkRegistrations(path)
            .then(function(data) {
                vm.Util.checkCreateDataSuccess(data, data.registration_id, vm.Notification, vm.$q, 'createBulkRegistrations', true);
                vm.thisregistration = data;
                vm.getRawRegistrationStatus();
                return data;

            }, function(error) {
                vm.Util.exceptionError(error, "createBulkRegistrations", vm.Notification);
                return (vm.$q.reject(error));
            });
    }

    createRawRegistrations() {
        var vm = this;
        var path = '../v1/rawregistration';
        vm.$log.log('about createRawRegistrations ');
        var thedata = {
            selectedregistrations: vm.gridimp1Options.data
        };

        return vm.StudentServices.createRawRegistrations(path, thedata)
            .then(function(data) {
                vm.thisregistration = data;
                vm.Util.checkCreateDataSuccess(data, data.registration_id, vm.Notification, vm.$q, 'createRawRegistrations', true);

                if (data.registration_id > 0) {
                    vm.getRawRegistrationStatus();
                }
                return data;

            }, function(error) {
                vm.Util.exceptionError(error, "createRawRegistrations", vm.Notification);
                return (vm.$q.reject(error));
            });

    }
    updateRawRegistration(input) {
        var vm = this;
        var path = encodeURI('../v1/rawregistration/ext/' + input.externalid + '/cls/' + input.Classname + '/pgm/' + input.Pgmname);

        input.lastPromoted = vm.Util.oradate(input.lastPromoted);

        vm.$log.log('about updateRawRegistration ', input);

        return vm.StudentServices.updateRawRegistration(path, input).then(function(data) {
            vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'updateRawRegistration', true);

        }, function(error) {
            vm.Util.exceptionError(error, "updateRawRegistration", vm.Notification);
            return (vm.$q.reject(error));
        });
    }

    getRawRegistrationStatus() {

        var vm = this;
        var path = "../v1/rawregistrations";
        vm.gridimp1Options.data = [];

        return vm.StudentServices.getRawRegistrationStatus(path).then(function(data) {
            vm.Util.checkDataSuccessv2(data, data.rawregistrationlist, vm.Notification, vm.$q, 'getRawRegistrationStatus', true);

            for (var i = 0, len = data.rawregistrationlist.length; i < len; i++) {
                data.rawregistrationlist[i].loaded = data.rawregistrationlist[i].contactid > 0 ? "loaded" : "missing";
            }
            vm.gridimp1Options.data = data.rawregistrationlist;
            vm.step2populated = vm.gridimp1Options.data.length > 0 ? true : false;

        }, function(error) {
            vm.Util.exceptionError(error, "getRawRegistrationStatus", vm.Notification);
            vm.gridimp1Options.data = [];
            return (vm.$q.reject(error));

        });

    }
    removeRawRegistration(row) {
        var vm = this;
        vm.$log.log('removeRawRegistration entered', row.entity.externalid, row.entity.Pgmname, row.entity.Classname);
        var path = '../v1/rawregistration';
        var thedata = {
            externalid: row.entity.externalid,
            pgm: row.entity.Pgmname,
            cls: row.entity.Classname
        };

        return vm.StudentServices.removeRawRegistration(thedata, path)
            .then(function(data) {
                vm.Util.checkRemoveSuccess(data, vm.Notification, vm.$q, 'removeRawRegistration', true);
                vm.getRawRegistrationStatus();
                return data;
            }, function(error) {
                vm.Util.exceptionError(error, "removeRawRegistration", vm.Notification);
                return (vm.$q.reject(error));
            });

    }

    removeRawRegistrations() {
        var vm = this;
        vm.$log.log('removeRawRegistrations entered');
        var path = '../v1/rawregistrations';

        return vm.StudentServices.removeRawRegistrations(path)
            .then(function(data) {
                vm.Util.checkDataSuccess(data, vm.Notification, vm.$q, 'removeRawRegistrations', true);

                return data;
            }, function(error) {
                vm.Util.exceptionError(error, "removeRawRegistrations", vm.Notification);
                return (vm.$q.reject(error));
            });

    }


}
