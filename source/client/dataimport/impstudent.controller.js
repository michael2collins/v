const { CSV: CSV } = window;
import angular from 'angular';


export class ImpstudentController {

    constructor(
        $scope, $log, StudentServices, Util, uiGridConstants, Notification, $q, portalDataService,
        $window, uiGridValidateService, uiGridExporterConstants, $interval, $sce
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
    }

    $onInit() {

        var vm = this;
        CSV.DETECT_TYPES = false;

        vm.gridOptions = {};
        vm.gridexp1Options = {};
        vm.gridimp1Options = {};
        vm.step3populated = false;
        vm.isValidForErrors = false;

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

        vm.gridLength = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);

        vm.setGridOptions();
        vm.setGridexp1Options();
        vm.setGridimp1Options();
        vm.activate();
    }

    $onDestroy() {
        this.$log.debug("ImpstudentController dismissed");
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
    isokCol() {
        var vm = this;
        return vm.okcol;
    }
    activate() {
        var vm = this;
        vm.portalDataService.Portlet('impstudent');

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("impstudent started");

        });

        vm.$q.all([
                vm.getStudentCols().then(function() {
                    vm.$log.debug('getStudentCols', vm.StudentCols);
                }),
                vm.getStudentColMap().then(function() {
                    vm.$log.debug('getStudentColMap done');
                }),

            ])
            .then(function() {
                vm.$log.debug(' activate returned');
            });

    }

    getStudentCols() {
        var vm = this;
        var path = '../v1/studentcols';

        return vm.StudentServices.getStudentCols(path).then(function(data) {
            vm.$log.debug('getStudentCols returned data');
            vm.$log.debug(data);
            vm.StudentCols = data.studentcollist;

            return vm.StudentCols;
        });
    }

    changeColMapName(input) {
        var vm = this;
        vm.$log.debug('changeColMapName', input);
        vm.okcol = true;
    }

    step2() {
        var vm = this;
        if (vm.isStep2Collapsed) {
            vm.getStudents();
        }
        return vm.isStep2Collapsed = !vm.isStep2Collapsed;
    }

    step3() {
        var vm = this;
        if (vm.isStep3Collapsed) {
            //            vm.getStudents();
            if (!vm.gridOptions.data.length > 0) {
                vm.getStudentColMap();
            }
        }
        return vm.isStep3Collapsed = !vm.isStep3Collapsed;
    }

    getStudents() {
        var vm = this;
        vm.$log.debug('get samplestudents entered');
        vm.gridexp1Options.data = [];
        var path = '../v1/samplestudents';

        return vm.StudentServices.getSampleStudents(path).then(function(data) {
            vm.gridexp1Options.data = data.students;

            return vm.gridexp1Options.data;
        });
    }

    getStudentColMap() {
        var vm = this;
        var path = '../v1/studentcolmap';

        return vm.StudentServices.getStudentColMap(path).then(function(data) {
            vm.$log.debug('getStudentColMap returned data');
            vm.$log.debug(data);
            vm.setGridOptions();
            vm.gridOptions.data = data.studentcolmaplist;
            vm.setGColumns();
            vm.setGridexp1Options();
            vm.setGridimp1Options();
            return vm.gridOptions.data;
        });
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

    addAll() {
        var vm = this;
        var rowEntity = {
            id: null,
            field: null,
            type: null,
            all: true
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
            all: numtype
        };

        vm.$log.debug('about updateStudentColMap ', thedata, updpath, updatetype);
        return vm.StudentServices.updateStudentColMap(updpath, thedata)
            .then(function(data) {
                vm.$log.debug('updateStudentColMap returned data');
                vm.$log.debug(data);
                vm.thisStudentColMap = data;
                vm.$log.debug(vm.thisStudentColMap);
                vm.$log.debug(vm.thisStudentColMap.message);
                vm.message = vm.thisStudentColMap.message;
                if ((typeof vm.thisStudentColMap === 'undefined' || vm.thisStudentColMap.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                if (updatetype === 'Add') {
                    vm.getStudentColMap().then(function(zdata) {
                            vm.$log.debug('getStudentColMap returned', zdata);
                        },
                        function(error) {
                            vm.$log.debug('Caught an error getStudentColMap after get:', error);
                            vm.thisStudentColMap = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });

                }
                vm.okcol = false;
                vm.StudentColMap = {};
                vm.isStep2Collapsed = true;

                return vm.thisStudentColMap;
            }).catch(function(e) {
                vm.$log.debug('updateStudentColMap failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    removeCol(input, all) {
        var vm = this;
        vm.$log.debug('removeCol entered', input);
        var path = '../v1/studentcolmap';
        var thedata = {
            id: input.id,
            all: all
        };

        return vm.StudentServices.removeCol(thedata, path)
            .then(function(data) {
                vm.$log.debug('removeCol returned data');
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

                vm.getStudentColMap().then(function(zdata) {
                        vm.$log.debug('getStudentColMap returned', zdata);
                    },
                    function(error) {
                        vm.$log.debug('Caught an error getStudentColMap after remove:', error);
                        vm.gridOptions.data = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                vm.okcol = false;
                vm.StudentColMap = {};
                vm.isStep2Collapsed = true;

                return data;
            }).catch(function(e) {
                vm.$log.debug('removeCol failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    setGColumns() {
        var vm = this;
        var theType = 'String';
        var teststr = '';
        vm.gcolumns = [];
        vm.impgcolumns = [];
        for (var i = 0, len = vm.gridOptions.data.length; i < len; i++) {
            // uigrid type string', 'boolean', 'number', 'date', 'object', 'numberStr' 

            //oracle types
            //varchar longtext text char mediumtext
            //datetime date timestamp time
            //int bigint decimal double tinyint smallint float
            //longblob bit set enum blob

            teststr = vm.gridOptions.data[i].type;
            teststr.match(/(char|text)/gi) ? theType = "string" :
                teststr.match(/(int|var)/gi) ? theType = "number" :
                teststr.match(/(date|time)/gi) ? theType = "date" :
                theType = "string";

            var theTypeStr = {};
            var theValidStr = {};

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

            var thisrequired = false;
            if (vm.gridOptions.data[i].name.match(/^ID$/i)) {
                //don't put ID col in output
                continue;
            }
            if (vm.gridOptions.data[i].name.match(/externalid/i)) {
                thisrequired = true;
                theValidStr = {
                    validators: { required: thisrequired },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };
            }
            if (vm.gridOptions.data[i].name.match(/lastname/i)) {
                thisrequired = true;
                theValidStr = {
                    validators: { required: thisrequired },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };
            }
            if (vm.gridOptions.data[i].name.match(/firstname/i)) {
                thisrequired = true;
                theValidStr = {
                    validators: { required: thisrequired },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };

            }
            if (vm.gridOptions.data[i].name.match(/email/i)) {
                theValidStr = {
                    validators: { email: '' },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };

            }
            if (vm.gridOptions.data[i].name.match(/phone/i)) {
                theValidStr = {
                    validators: { required: true, phone: '' },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };

            }
            if (vm.gridOptions.data[i].name.match(/birthday/i)) {
                theValidStr = {
                    validators: { required: true, date: 'MM/DD/YYYY' },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };

            }

            var coldef = {
                field: vm.gridOptions.data[i].name,
                displayName: vm.gridOptions.data[i].name,
                enableCellEdit: true
            };
            //validators: {required: thisrequired, startWith: 'M'}, 
            theValidStr.validators ? coldef.validators = theValidStr.validators : '';
            theValidStr.cellTemplate ? coldef.cellTemplate = theValidStr.cellTemplate : '';
            theTypeStr.cellFilter ? coldef.cellFilter = theTypeStr.cellFilter : '';
            theTypeStr.editableCellTemplate ? coldef.editableCellTemplate = theTypeStr.editableCellTemplate : '';
            coldef.type = theTypeStr.type;

            vm.gcolumns.push(coldef);

        }

        vm.impgcolumns = angular.copy(vm.gcolumns);
        var gcol = {
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

    setGridOptions() {
        var vm = this;

        var ct = '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeCol(row.entity,' +
            "one" +
            ')" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>';

        vm.gridOptions = {
            showGridFooter: true,
            enableFiltering: true,
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
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    enableFiltering: true,
                    //                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    //                    cellFilter: 'iddropdown:this',
                    //                    editDropdownIdLabel: 'id',
                    //                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.StudentCols,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                    filter: {
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.StudentCols
                    }

                },
                {
                    field: 'type',
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
                vm.$log.debug('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.debug('pagination changed');
                    vm.setGridLength(pageSize);
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });

                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            // vm.updateStudentColMap(rowEntity, 'Update');
                        }
                    });

            }
        };

        vm.$log.debug('gridOptions', vm.gridOptions);
    }

    setGridexp1Options() {
        var vm = this;



        vm.gridexp1Options = {
            showGridFooter: false,
            enableGridMenu: false, //button is working
            exporterMenuCsv: true,
            exporterMenuExcel: false,
            exporterMenuPdf: false,
            exporterCsvFilename: 'students.csv',
            exporterCsvColumnSeparator: ',',
            exporterHeaderFilterUseName: true,
            exporterMenuVisibleData: false,

            columnDefs: vm.gcolumns,

            exporterFieldCallback: function(grid, row, col, value) {

                if (col.name === 'Birthday') {
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

        vm.uiGridValidateService.setValidator('phone',
            function(argument) {
                //todo, note below is different then example but matching current uigrid code order
                return function(oldValue, newValue, rowEntity, colDef) {
                    if (!newValue) {
                        return true; // We should not test for existence here
                    }
                    else {
                        return vm.Util.validatePhone(newValue);
                    }
                };
            },
            function(argument) {
                return 'Needs proper 10 digit phone format dash,space,dot,braces or no separator are acceptable';
            }
        );

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
                vm.step3populated = vm.importdata.length > 0 ? true : false;
                vm.gridimp1Options.data = vm.importdata;
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
                        //                            vm.$sce.trustAsHtml(JSON.stringify(colDef.validators)) );
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

    isStep3Populated() {
        var vm = this;
        return vm.step3populated;
    }

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
            document.getElementById('filechoice').setCustomValidity('Supported file formats are *.csv');
        }
        else {
            //submit valid file here
            vm.gridimp1Api.importer.importFile(fileObject);
            vm.isStep3NewCollapsed = true;
        }
    }

    clearInput(event) {
        var input = angular.element(event.target);
        input.val("");
        document.getElementById("filechoice").innerHTML = "";
    }

    createBulkStudents() {
        var vm = this;
        var path = '../v1/bulkstudent';
        vm.$log.debug('about createBulkStudents ');
        var thedata = {
            selectedStudents: vm.gridimp1Options.data
        };

        return vm.StudentServices.createBulkStudent(path, thedata)
            .then(function(data) {
                vm.$log.debug('createStudent returned data');
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
                vm.$log.debug('createStudent failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

}
