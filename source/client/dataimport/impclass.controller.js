const { CSV: CSV } = window;
import angular from 'angular';


export class ImpclassController {

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
        vm.emailrequired = false;
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
        vm.Util.setGridLength(vm.initialLength, vm);

        //        vm.setGridexp1Options();
        vm.setprelimimp1Options();
        vm.activate();
    }

    $onDestroy() {
        this.$log.debug("ImpclassController dismissed");
        this.$log.debugEnabled(false);
    }

    /*    getLimit() {
            var vm = this;
            vm.$log.debug('getLimit');
            return vm.limit;
        }
        setLimit(thelimit) {
            var vm = this;
            vm.$log.debug('setLimit', thelimit);
            vm.limit = thelimit;
        }
    */
    /*
        setGridLength(size,vm) {
            vm.gridLength = {
                height: (size * vm.rowheight) + vm.headerheight + 'px'
            };
        }
    */
    /*
        getGridLength() {
            var vm = this;
            return vm.gridLength;
        }
    */
    activate() {
        var vm = this;
        vm.portalDataService.Portlet('impclass');

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("impclass started");

        });

        vm.getColumns();
    }
    /*
        changeloadfilter(value,gridimp1Api) {
            if (value == "all") {
                gridimp1Api.grid.getColumn('loaded').filters[0].term = '';
            }
            else {
                gridimp1Api.grid.getColumn('loaded').filters[0].term = String(value);
            }
            gridimp1Api.grid.refresh();
        }
        changeerrfilter(value,gridimp1Api,uiGridConstants) {
            if (value == "all") {
                gridimp1Api.grid.getColumn('haserror').filters[0] = {
                    term: ''
                };
            }
            else
            if (value == "valid") {
                gridimp1Api.grid.getColumn('haserror').filters[0] = {
                    condition: uiGridConstants.filter.NOT_EQUAL,
                    term: 'error'
                };
            }
            else
            if (value == "error") {
                gridimp1Api.grid.getColumn('haserror').filters[0] = {
                    term: 'error'
                };

            }
            else {
                gridimp1Api.grid.getColumn('haserror').filters[0] = {
                    condition: uiGridConstants.filter.EXACT,
                    term: ''
                };
            }
            gridimp1Api.grid.refresh();

        }
    */
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
        vm.$log.debug('getStudentRegistrations entered');
        vm.gridexp1Options.data = [];
        var path = '../v1/samplestudentregistrations';

        return vm.StudentServices.getSampleStudentRegistrations(path).then(function(data) {
            vm.gridexp1Options.data = data.studentregistrations;

            return vm.gridexp1Options.data;
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
    /*
        setDateCol(format, theType) {

            var theTypeStr = {
                type: theType,
                cellFilter: format,
                editableCellTemplate: '<div><form name="inputForm"><div ui-grid-edit-datepicker ng-class="\'colt\' + col.uid"></div></form></div>'
            };

            return theTypeStr;
        }
        
        setValidStr(required) {
            return {
                validators: { required: required },
                cellTemplate: 'ui-grid/cellTitleValidator',
            };

        }
        
        setTypeStr(theType,format,vm) {
            var theTypeStr = {};
            if (theType === 'date') {
                vm.setDateCol(format, theType);
            }
            else {
                theTypeStr = {
                    type: theType,
                };
            }

            return theTypeStr;

        }
        setValidStrByType(colname,mailrequired,dateformat) {
            var vm = this;
            var theValidStr = {};
            theValidStr = vm.Util.setValidStr(true);

            if (colname.match(/email/i)) {
                theValidStr = {
                    validators: { email: '', required: mailrequired },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };
            }
            if (colname.match(/lastPromoted/i)) {
                theValidStr = {
                    validators: { required: false, date: dateformat },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };

            }
            return theValidStr;
        }
        
        setColDef(colname, theValidStr, theTypeStr) {
            var coldef = {
                field: colname,
                displayName: colname,
                enableCellEdit: true,
                enableHiding: false,
                maxWidth: 200,
                minWidth: 70,
                width: "*"
            };

            theValidStr.validators ? coldef.validators = theValidStr.validators : '';
            theValidStr.cellTemplate ? coldef.cellTemplate = theValidStr.cellTemplate : '';
            theTypeStr.cellFilter ? coldef.cellFilter = theTypeStr.cellFilter : '';
            theTypeStr.editableCellTemplate ? coldef.editableCellTemplate = theTypeStr.editableCellTemplate : '';
            coldef.type = theTypeStr.type;

            return coldef;

        }

        
        setGCol(field, displayName, required) {
            var gcol = {
                field: field,
                displayName: displayName,
                enableCellEdit: false,
                visible: true,
                maxWidth: 100,
                minWidth: 50,
                width: "*",
                validators: { required: required },
                cellTemplate: 'ui-grid/cellTitleValidator',

            };
            return gcol;
        }
        setHasErrCol() {
            var vm = this;
            var gcol = vm.setGCol('haserror', 'Err?', false);
            gcol.headerCellClass = vm.Util.highlightFilteredHeader;
            return gcol;
        }
        setLoadedCol() {
            var vm = this;
            var ctpl = '<div class="ui-grid-cell-contents"><span> \
            <div class="input-icon right form-group" \
            ng-style="{color: row.entity.loaded === \'loaded\' ? \'green\' : \'red\' }" > \
            <i data-hover="tooltip" data-original-title="Correct" \
            ng-class="row.entity.loaded === \'loaded\' ? \'glyphicon-ok\' : \'glyphicon-remove\' " \
            class="glyphicon tooltips"></i> \
            </div>{{row.entity.loaded}}</span></div> \
            ';
            var gcol = vm.Util.setGCol('loaded', 'Loaded?', false);
            gcol.headerCellClass = vm.Util.highlightFilteredHeader;
            gcol.cellTemplate = ctpl;
            return gcol;
        }
        setExtIdCol(removefunc) {
            var vm = this;
            var c2tpl = ' <div class="ui-grid-cell-contents"><span>  \
            <a ng-click="' + removefunc + '" \
            role="button" class="btn btn-red" \
            style="padding:  0px 14px;"  > \
            <i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div> \
            ';
            var gcol = vm.Util.setGCol('externalid', 'Action', false);
            gcol.cellTemplate = c2tpl;
            gcol.enableFiltering = false;
            gcol.enableSorting = false;
            gcol.enableHiding = false;
            return gcol;
        }
    */
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
    /*
        setGridexp1OptionsDefaults(gridexp1Options, filename, limits, initialLength, rowheight, gcolumns) {

            gridexp1Options.showGridFooter = false;
            gridexp1Options.enableGridMenu = false; //button is working
            gridexp1Options.exporterMenuCsv = true;
            gridexp1Options.exporterMenuExcel = false;
            gridexp1Options.exporterMenuPdf = false;
            gridexp1Options.exporterCsvFilename = filename;
            gridexp1Options.exporterCsvColumnSeparator = ',';
            gridexp1Options.exporterHeaderFilterUseName = true;
            gridexp1Options.exporterMenuVisibleData = false;
            gridexp1Options.paginationPageSizes = limits;
            gridexp1Options.paginationPageSize = initialLength;
            gridexp1Options.rowHeight = rowheight;

            gridexp1Options.columnDefs = gcolumns;

        }
    */
/*    
    setExporterFieldCallback(grid, row, col, value) {
        if (col.name === 'lastPromoted') {
            if (vm.Util.isEmptyObject(value)) {
                return vm.Util.simpledate("01/01/1900");
            }
            else {
                return vm.Util.simpledate(value);
            }
        }

    }
*/    
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

                /*                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                                    vm.$log.debug('pagination changed');
                                    vm.Util.setGridLength(pageSize,vm);
                                    vm.gridexp1Options.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                                });
                */
                vm.Util.setPagination(vm.gridexp1Api, vm);

            }
        };
        vm.Util.setGridexp1OptionsDefaults(vm.gridexp1Options, 'studentregistrations.csv', vm.limits, vm.initialLength, vm.rowheight, vm.gcolumns);


        vm.$log.debug('gridexp1Options', vm.gridexp1Options);
    }
    /*
        setEmailValidator(){
            var vm = this;
            
            vm.uiGridValidateService.setValidator('email',
                function(argument) {
                    //todo, note below is different then example but matching current uigrid code order
                    return function(oldValue, newValue, rowEntity, colDef) {
                        if (!newValue) {
                            return true; // We should not test for existence here
                        }
                        else {
                            return vm.Util.validateEmail(newValue);
                        }
                    };
                },
                function(argument) {
                    return 'Needs proper email address format';
                }
            );
            
        }
        setDateValidator() {
            var vm = this;
            vm.uiGridValidateService.setValidator('date',
                function(argument) {
                    //todo, note below is different then example but matching current uigrid code order
                    return function(oldValue, newValue, rowEntity, colDef) {
                        if (!newValue) {
                            return true; // We should not test for existence here
                        }
                        else {
                            return vm.Util.validateDate(newValue, argument);
                        }
                    };
                },
                function(argument) {
                    return 'Needs proper date format ' + argument;
                }
            );        
        }
        */
    /*    setImpGridDefaults(cols,gridimp1Options,uiGridConstants,limits,initialLength,rowheight) {
            gridimp1Options.showGridFooter = false;
            gridimp1Options.enableGridMenu = false;
            gridimp1Options.paginationPageSizes = limits;
            gridimp1Options.paginationPageSize = initialLength;
            gridimp1Options.rowHeight = rowheight;
            gridimp1Options.flatEntityAccess = true;
            gridimp1Options.fastWatch = true;
            gridimp1Options.enableSorting = false;
            gridimp1Options.enableFiltering = true;
            gridimp1Options.enableHorizontalScrollbar = uiGridConstants.scrollbars.WHEN_NEEDED;
            gridimp1Options.enableVerticalScrollbar = uiGridConstants.scrollbars.WHEN_NEEDED;

            gridimp1Options.columnDefs = cols;        
        }
        */
    setGridimp1Options() {
        var vm = this;

        vm.Util.setEmailValidator(vm.uiGridValidateService);
        vm.Util.setDateValidator(vm.uiGridValidateService);
        vm.Util.setImpGridDefaults(vm.impgcolumns, vm.gridimp1Options, vm.uiGridConstants, vm.limits, vm.initialLength, vm.rowheight);
        vm.$log.debug('gridimp1Api', vm.gridimp1Api);
    }
    /*    
        importerDataSetCallback(grid, newObjects,importdata,step2populated,gridimp1Options) {
            importdata = [];
            vm.$log.debug('importerDataAddCallback ', newObjects);
            importdata = importdata.concat(newObjects);
            step2populated = importdata.length > 0 ? true : false;
            gridimp1Options.data = importdata;
            importdata = [];

        }
    */
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
    /*    
        validationFailed(gridApi, errmsgfields,errCnt,isValidForErrors,scope) {
            var errmsg="";

            gridApi.validate.on.validationFailed(scope,
                function(rowEntity, colDef, newValue, oldValue) {
                    for (var i = 0, len = errmsgfields.length; i < len; i++) {
                        errmsg +=  ' ' + rowEntity[errmsgfields[i]];
                    }

                    var msg = (
                        'For:' + errmsg +
                        '\nColumn: ' + colDef.displayName + '\n' +
                        'Has an error.  The new Value: ' + newValue + '\n' +
                        ' vs the old Value: ' + oldValue + '\nvalidators: ' +
                        JSON.stringify(colDef.validators));
                    vm.$log.debug("validation error", msg);
                    rowEntity.haserror = "error";
                    errCnt += 1;
                    isValidForErrors = false;

                });
        }
    */
    /*
        setPagination(gridApi,vm) {
            gridApi.pagination.on.paginationChanged(vm.$scope,
                function(newPage, pageSize) {
                    vm.$log.debug('pagination changed');
                    vm.Util.setGridLength(pageSize,vm);
                    vm.gridimp1Api.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });
            
        }
    */
    setprelimimp1Options() {
        var vm = this;
        vm.gridimp1Options = {
            appScopeProvider: vm,

            importerDataAddCallback: function(grid, newObjects) {
                vm.Util.importerDataSetCallback(grid, newObjects, vm.importdata, vm.step2populated, vm.gridimp1Options);
                vm.createRawRegistrations();
            },

            onRegisterApi: function(gridApi) {
                vm.$log.debug('vm gridimp1Api onRegisterApi');
                vm.gridimp1Api = gridApi;

                vm.setAfterCellEdit(vm.gridimp1Api, "rawRegistration", vm, vm.$scope);

                vm.Util.validationFailed(vm.gridimp1Api, ['Pgmname', 'Classname', 'externalid'], vm.errCnt, vm.isValidForErrors, vm.$scope);

                vm.Util.setPagination(vm.gridimp1Api, vm);

            }

        };

        vm.$log.debug('gridimp1Api', vm.gridimp1Api);

    }

    lookupExtas() {
        var vm = this;
        vm.$log.debug('lookupExtas entered');
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
                    vm.$log.debug('lookupExtas error', msg);
                }

            }

            return data;
        });
    }

    isStep2Populated() {
        var vm = this;
        return vm.step2populated;
    }

    /*
        setImp1SelectedArray(inputArray) {
            var vm = this;
            vm.$log.debug("setImp1SelectedArray entered", inputArray);
            vm.picklistImp1 = [];

            //class pgm classid pgmid ranktype ranklist rankid

            if (inputArray.length > 0) {
                vm.pickImp1 = true;
                for (var i = 0, len = inputArray.length; i < len; i++) {
                    var info = {
                        externalid: inputArray[i].externalid,

                    };
                    vm.picklistImp1.push(info);
                }
            }
            else {
                vm.pickImp1 = false;
                return;
            }

            vm.$log.debug("setarray", vm.picklistImp1);

        }
    */
    /*
        download(gridexp1Api,uiGridExporterConstants) {
            gridexp1Api.exporter.csvExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL);
        }
    */
    batchValidate() {
        var vm = this;
        vm.errCnt = 0;
        vm.isValidForErrors = true; //if validation error created, this will become false

        vm.lookupExtas().then(function() {
            vm.gridimp1Options.data = vm.importdata;
            vm.Util.validate(vm.gridimp1Api);
            /*            var therows = vm.gridimp1Api.grid.rows;
                        therows.forEach(function(row) {
                            row.grid.options.columnDefs.forEach(function(colDef) {
                                vm.gridimp1Api.grid.validate.runValidators(
                                    row.entity, colDef, row.entity[colDef.field], NaN, vm.gridimp1Api.grid).then(function() {});
                            });
                        });
            */
        });

    }
    /*    
        validate(gridimp1Api) {
            var therows = gridimp1Api.grid.rows;
            therows.forEach(function(row) {
                row.grid.options.columnDefs.forEach(function(colDef) {
                    gridimp1Api.grid.validate.runValidators(
                        row.entity, colDef, row.entity[colDef.field], NaN, gridimp1Api.grid).then(function() {});
                });
            });

        }
    */
    /*
        handleFileSelect(files) {
            var vm = this;
            var fileObject = files[0];

            if (fileObject == undefined || fileObject == null) {
                return;
            }
            else if (fileObject == '' && vm.$scope.uploadedFileType == 'other') {
                document.getElementById('filechoiceclass').setCustomValidity('Supported file formats are *.csv');
            }
            else {
                //submit valid file here
                vm.gridimp1Api.importer.importFile(fileObject);
                vm.isStep2NewCollapsed = true;
            }
        }
        clearInput(event) {
            var input = angular.element(event.target);
            input.val("");
            document.getElementById("filechoiceclass").innerHTML = "";
        }
    */

    createBulkRegistrations() {
        var vm = this;
        var path = '../v1/bulkstudentregistration';
        vm.$log.debug('about createBulkRegistrations ');


        return vm.StudentServices.createBulkRegistrations(path)
            .then(function(data) {
                vm.$log.debug('createBulkRegistrations returned data');
                vm.$log.debug(data);
                vm.thisregistration = data;
                vm.$log.debug(vm.thisregistration);
                vm.$log.debug(vm.thisregistration.message);
                vm.message = vm.thisregistration.message;

                if (vm.thisregistration.student_id > 0) {
                    vm.Notification.success({ message: vm.message, delay: 5000 });

                }
                else {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                }
                vm.getRawRegistrationStatus();
                return data;

            }).catch(function(e) {
                vm.$log.debug('createBulkRegistrations failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    createRawRegistrations() {
        var vm = this;
        var path = '../v1/rawregistration';
        vm.$log.debug('about createRawRegistrations ');
        var thedata = {
            selectedregistrations: vm.gridimp1Options.data
        };


        return vm.StudentServices.createRawRegistrations(path, thedata)
            .then(function(data) {
                vm.$log.debug('createRawRegistrations returned data');
                vm.$log.debug(data);
                vm.thisregistration = data;
                vm.$log.debug(vm.thisregistration);
                vm.$log.debug(vm.thisregistration.message);
                vm.message = vm.thisregistration.message;

                if (vm.thisregistration.registration_id > 0) {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                    vm.getRawRegistrationStatus();
                }
                else {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                }
                return data;

            }).catch(function(e) {
                vm.$log.debug('createRegistration failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }
    updateRawRegistration(input) {
        var vm = this;
        var path = '../v1/rawregistration/ext/' + input.externalid + '/cls/' + input.Classname + '/pgm/' + input.Pgmname;

        input.Birthday = vm.Util.oradate(input.Birthday);

        vm.$log.debug('about updateRawRegistration ', input);

        return vm.StudentServices.updateRawRegistration(path, input).then(function(data) {
            vm.$log.debug('updateRawRegistration returned data');
            vm.$log.debug(data);
            vm.message = data.message;
            if ((typeof data === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                vm.Notification.success({ message: vm.message, delay: 5000 });

            }

            //        vm.students = data;
        }, function(error) {
            vm.$log.debug('updateRawRegistration', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getRawRegistrationStatus() {

        var vm = this;
        var path = "../v1/rawregistrations";
        vm.gridimp1Options.data = [];

        return vm.StudentServices.getRawRegistrationStatus(path).then(function(data) {
            vm.$log.debug('controller getRawRegistrationStatus returned data');
            vm.$log.debug(data);
            vm.$log.debug(data.message);
            vm.message = data.message;
            if ((typeof data.rawregistrationlist === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({
                    message: vm.message + ': ' + (
                        (typeof(data.extra.sqlerror) === "string" && typeof(data.extra.sqlerrordtl) === "string") ?
                        data.extra.sqlerror + data.extra.sqlerrordtl : ""),
                    delay: 5000
                });
                return (vm.$q.reject(data));
            }
            else {
                for (var i = 0, len = data.rawregistrationlist.length; i < len; i++) {
                    data.rawregistrationlist[i].loaded = data.rawregistrationlist[i].contactid > 0 ? "loaded" : "missing";
                }
                vm.gridimp1Options.data = data.rawregistrationlist;
                vm.step2populated = vm.gridimp1Options.data.length > 0 ? true : false;
                vm.Notification.success({ message: vm.message, delay: 5000 });
            }
        }, function(error) {
            vm.$log.debug('Caught an error getRawRegistrationStatus:', error);
            vm.gridimp1Options.data = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });

    }
    removeRawRegistration(row) {
        var vm = this;
        vm.$log.debug('removeRawRegistration entered', row.entity.externalid, row.entity.Pgmname, row.entity.Classname);
        var path = '../v1/rawregistration';
        var thedata = {
            externalid: row.entity.externalid,
            pgm: row.entity.Pgmname,
            cls: row.entity.Classname
        };

        return vm.StudentServices.removeRawStudent(thedata, path)
            .then(function(data) {
                vm.$log.debug('removeRawStudent returned data');
                vm.$log.debug(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });

                }

                return data;
            }).catch(function(e) {
                vm.$log.debug('removeRawStudent failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    removeRawRegistrations() {
        var vm = this;
        vm.$log.debug('removeRawRegistrations entered');
        var path = '../v1/rawregistrations';

        return vm.StudentServices.removeRawRegistrations(path)
            .then(function(data) {
                vm.$log.debug('removeRawRegistrations returned data');
                vm.$log.debug(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });

                }

                return data;
            }).catch(function(e) {
                vm.$log.debug('removeRawRegistrations failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }


}
