const { CSV: CSV } = window;
import angular from 'angular';


export class ImphistoryController {

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

        vm.gridexp1Options = {};
        vm.gridimp1Options = {};
        vm.step2populated = false;
        vm.isValidForErrors = false;

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

        vm.gridLength = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);

        vm.setGridexp1Options();
        vm.setGridimp1Options();
        vm.activate();
    }

    $onDestroy() {
        this.$log.debug("ImphistoryController dismissed");
        this.$log.debugEnabled(false);
    }

    getLimit() {
        var vm = this;
        vm.$log.debug('getLimit');
        return vm.limit;
    }
    setLimit(thelimit) {
        var vm = this;
        vm.$log.debug('setLimit', thelimit);
        vm.limit = thelimit;
    }
    setGridLength(size) {
        var vm = this;
        vm.gridLength = {
            height: (size * vm.rowheight) + vm.headerheight + 'px'
        };
    }

    getGridLength() {
        var vm = this;
        return vm.gridLength;
    }

    activate() {
        var vm = this;
        vm.portalDataService.Portlet('imphistory');

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("imphistory started");

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

    getStudenthistory() {
        var vm = this;
        vm.$log.debug('getStudenthistory entered');
        vm.gridexp1Options.data = [];
        var path = '../v1/samplestudenthistory';

        return vm.StudentServices.getSampleStudenthistory(path).then(function(data) {
            vm.gridexp1Options.data = data.StudentHistoryList;

            return vm.gridexp1Options.data;
        });
    }

    getColumns() {
        var vm = this;

        var Columnslist = [
            { name: "externalid", type: 'string' },
            { name: "contactmgmttype", type: 'string' },
            { name: "contactdate", type: 'date' },
        ];

        vm.setGColumns(Columnslist);
        vm.setGridexp1Options();
        vm.setGridimp1Options();
    }

    setGColumns(columns) {
        var vm = this;
        var theType = 'String';
        var gcol = [];
        var coldef = {};
        var theTypeStr = {};
        var theValidStr = {};
        vm.gcolumns = [];
        vm.impgcolumns = [];
        for (var i = 0, len = columns.length; i < len; i++) {
            // uigrid type string', 'boolean', 'number', 'date', 'object', 'numberStr' 

            theType = columns[i].type;

            theTypeStr = {};
            theValidStr = {};

            if (theType === 'date') {
                theTypeStr = {
                    type: theType,
                    cellFilter: 'textDate:"MM/dd/yyyy"',
                    editableCellTemplate: '<div><form name="inputForm"><div ui-grid-edit-datepicker ng-class="\'colt\' + col.uid"></div></form></div>'
                };
            }
            else {
                theTypeStr = {
                    type: theType,
                };
            }

            // all required
            theValidStr = {
                validators: { required: true },
                cellTemplate: 'ui-grid/cellTitleValidator',
            };

            if (columns[i].name.match(/date/i)) {
                theValidStr = {
                    validators: { required: false, date: 'MM/DD/YYYY' },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };

            }

            coldef = {
                field: columns[i].name,
                displayName: columns[i].name,
                enableCellEdit: true
            };
            theValidStr.validators ? coldef.validators = theValidStr.validators : '';
            theValidStr.cellTemplate ? coldef.cellTemplate = theValidStr.cellTemplate : '';
            theTypeStr.cellFilter ? coldef.cellFilter = theTypeStr.cellFilter : '';
            theTypeStr.editableCellTemplate ? coldef.editableCellTemplate = theTypeStr.editableCellTemplate : '';
            coldef.type = theTypeStr.type;

            vm.gcolumns.push(coldef);

        }

        vm.impgcolumns = angular.copy(vm.gcolumns);

        gcol = {
            field: 'id',
            displayName: 'Student Id',
            enableCellEdit: false,
            visible: true,
            validators: { required: true },
            cellTemplate: 'ui-grid/cellTitleValidator',

        };
        vm.impgcolumns.push(gcol);

        gcol = {
            field: 'externalid',
            displayName: 'Action',
            enableFiltering: false,
            enableSorting: false,
            enableHiding: false,
            enableCellEdit: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeImp1Row(row)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
        };

        vm.impgcolumns.push(gcol);


    }

    setGridexp1Options() {
        var vm = this;



        vm.gridexp1Options = {
            showGridFooter: false,
            enableGridMenu: false, //button is working
            exporterMenuCsv: true,
            exporterMenuExcel: false,
            exporterMenuPdf: false,
            exporterCsvFilename: 'studenthistory.csv',
            exporterCsvColumnSeparator: ',',
            exporterHeaderFilterUseName: true,
            exporterMenuVisibleData: false,

            columnDefs: vm.gcolumns,

            exporterFieldCallback: function(grid, row, col, value) {

                if (col.name === 'contactdate') {
                    if (vm.Util.isEmptyObject(value)) {
                        return vm.Util.simpledate("01/01/1900");
                    }
                    else {
                        return vm.Util.simpledate(value);
                    }
                }
                return value;
            },

            onRegisterApi: function(gridApi) {
                vm.$log.debug('vm gridexp1Options onRegisterApi');
                vm.gridexp1Api = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.debug('pagination changed');
                    vm.setGridLength(pageSize);
                    vm.gridexp1Options.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });


            }
        };

        vm.$log.debug('gridexp1Options', vm.gridexp1Options);
    }

    removeImp1Row(row) {
        var vm = this;
        vm.$log.debug('removeRow entered', row);

        var index = vm.gridimp1Options.data.indexOf(row.entity);
        vm.gridimp1Options.data.splice(index, 1);
    }

    setGridimp1Options() {
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

        vm.gridimp1Options = {
            showGridFooter: false,
            enableGridMenu: false, //btn is working
            appScopeProvider: vm,

            columnDefs: vm.impgcolumns,

            importerDataAddCallback: function(grid, newObjects) {
                vm.importdata = [];
                vm.$log.debug('importerDataAddCallback ', newObjects);
                vm.importdata = vm.importdata.concat(newObjects);
                vm.lookupExtas();
            },


            onRegisterApi: function(gridApi) {
                vm.$log.debug('vm gridimp1Api onRegisterApi');
                vm.gridimp1Api = gridApi;

                gridApi.rowEdit.on.saveRow(vm.$scope,
                    function(rowEntity) {
                        // create a fake promise - normally you'd use the promise returned by $http or $resource
                        var promise = vm.$q.defer();
                        vm.gridimp1Api.rowEdit.setSavePromise(rowEntity, promise.promise);
                        promise.resolve();

                    });

                gridApi.validate.on.validationFailed(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {

                        var msg = (
                            'For:' + rowEntity.FirstName + ' ' + rowEntity.LastName +
                            '\nColumn: ' + colDef.displayName + '\n' +
                            'Has an error.  The new Value: ' + newValue + '\n' +
                            ' vs the old Value: ' + oldValue + '\nvalidators: ' +
                            JSON.stringify(colDef.validators));
                        vm.Notification.error({ message: msg, delay: 5000 });

                    });

                gridApi.pagination.on.paginationChanged(vm.$scope,
                    function(newPage, pageSize) {
                        vm.$log.debug('pagination changed');
                        vm.setGridLength(pageSize);
                        vm.gridimp1Api.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                    });

                gridApi.selection.on.rowSelectionChanged(vm.$scope,
                    function(row) {
                        var msg = 'gridimp1Api row selected ' + row.entity;
                        vm.$log.debug(msg);

                        var selectedArr = vm.gridimp1Api.selection.getSelectedRows();
                        vm.$log.debug('selected', selectedArr);
                        vm.setImp1SelectedArray(selectedArr);

                    });

                gridApi.selection.on.rowSelectionChangedBatch(vm.$scope,
                    function(rows) {
                        vm.$log.debug(" gridimp1Api grid batch");
                        var selectedArr = vm.gridimp1Api.selection.getSelectedRows();
                        vm.$log.debug('batch selected', selectedArr);
                        vm.setImp1SelectedArray(selectedArr);

                    });
            }

        };

        vm.$log.debug('gridimp1Api', vm.gridimp1Api);
    }

    lookupExtas() {
        var vm = this;
        vm.$log.debug('lookupExtas entered');
        vm.gridimp1Options.data = [];
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
                    vm.Notification.error({ message: msg, delay: 5000 });
                }

            }
            vm.step2populated = vm.importdata.length > 0 ? true : false;
            vm.gridimp1Options.data = vm.importdata;

            return vm.gridexp1Options.data;
        });
    }

    isStep2Populated() {
        var vm = this;
        return vm.step2populated;
    }

    setImp1SelectedArray(inputArray) {
        var vm = this;
        vm.$log.debug("setImp1SelectedArray entered", inputArray);
        vm.picklistImp1 = [];

        //history pgm historyid pgmid ranktype ranklist rankid

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

    download() {
        var vm = this;
        vm.gridexp1Api.exporter.csvExport(vm.uiGridExporterConstants.ALL, vm.uiGridExporterConstants.ALL);
    }

    batchValidate() {
        var vm = this;
        var rowsRendred = vm.gridimp1Api.grid.renderContainers.body.renderedRows;
        rowsRendred.forEach(function(row) {
            row.grid.options.columnDefs.forEach(function(colDef) {
                vm.gridimp1Api.grid.validate.runValidators(
                    row.entity, colDef, row.entity[colDef.field], NaN, vm.gridimp1Api.grid).then(function() {
                    vm.countValidateErrors();
                });
            });
        });
    }

    countValidateErrors() {
        var vm = this;
        vm.errCnt = 0;
        vm.isValidForErrors = false;
        var rowsRendred = vm.gridimp1Api.grid.renderContainers.body.renderedRows;
        rowsRendred.forEach(function(row) {
            row.grid.options.columnDefs.forEach(function(colDef) {
                vm.errCnt += vm.gridimp1Api.grid.validate.isInvalid(row.entity, colDef) ? 1 : 0;
            });
        });
        vm.isValidForErrors = vm.errCnt > 0 ? false : true;
    }

    handleFileSelect(files) {
        var vm = this;
        var fileObject = files[0];

        if (fileObject == undefined || fileObject == null) {
            return;
        }
        else if (fileObject == '' && vm.$scope.uploadedFileType == 'other') {
            document.getElementById('filechoicehistory').setCustomValidity('Supported file formats are *.csv');
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
        document.getElementById("filechoicehistory").innerHTML = "";
    }

    createBulkStudentHistory() {
        var vm = this;
        var path = '../v1/bulkstudenthistory';
        vm.$log.debug('about createBulkStudentHistory ');
        var thedata = {
            selectedStudents: vm.gridimp1Options.data
        };

        return vm.StudentServices.createBulkStudentHistory(path, thedata)
            .then(function(data) {
                vm.$log.debug('createBulkStudentHistory returned data');
                vm.$log.debug(data);
                vm.thisstudent = data;
                vm.$log.debug(vm.thisstudent);
                vm.$log.debug(vm.thisstudent.message);
                vm.message = vm.thisstudent.message;

                if (vm.thisstudent.student_id > 0) {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                else {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                }
                return data;

            }).catch(function(e) {
                vm.$log.debug('createBulkStudentHistory failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

}
