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
        vm.setGridLength(vm.initialLength);

        //        vm.setGridOptions();
        //        vm.setGridexp1Options();
        vm.setprelimimp1Options();
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
                //                vm.getRawStudentStatus().then(function() {
                //                    vm.$log.debug('getRawStudentStatus done');
                //                })

            ])
            .then(function() {
                vm.$log.debug(' activate returned');
            });

    }

    changeloadfilter(value) {
        var vm = this;
        if (value == "all") {
            vm.gridimp1Api.grid.getColumn('loaded').filters[0].term = '';
        }
        else {
            vm.gridimp1Api.grid.getColumn('loaded').filters[0].term = String(value);
        }
        vm.gridimp1Api.grid.refresh();
    }
    changeerrfilter(value) {
        var vm = this;
        //        vm.batchValidate();
        if (value == "all") {
            vm.gridimp1Api.grid.getColumn('haserror').filters[0] = {
                term: ''
            };
        }
        else
        if (value == "valid") {
            vm.gridimp1Api.grid.getColumn('haserror').filters[0] = {
                condition: vm.uiGridConstants.filter.NOT_EQUAL,
                term: 'error'
            };
        }
        else
        if (value == "error") {
            vm.gridimp1Api.grid.getColumn('haserror').filters[0] = {
                term: 'error'
            };

        }
        else {
            vm.gridimp1Api.grid.getColumn('haserror').filters[0] = {
                condition: vm.uiGridConstants.filter.EXACT,
                term: ''
            };
        }
        vm.gridimp1Api.grid.refresh();

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

            vm.gridOptions.data[i].haserror = "";
            vm.gridOptions.data[i].loaded = "missing";
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
                    cellFilter: vm.bdateformattxt,
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
            if (vm.gridOptions.data[i].name.match(/^phone$/i)) {
                theValidStr = {
                    validators: { required: true, phone: '' },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };

            }
            if (vm.gridOptions.data[i].name.match(/^AltPhone/i)) {
                theValidStr = {
                    validators: { required: false, phone: '' },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };

            }
            if (vm.gridOptions.data[i].name.match(/birthday/i)) {
                theValidStr = {
                    validators: { required: false, date: vm.bdateformat },
                    cellTemplate: 'ui-grid/cellTitleValidator',
                };

            }

            var coldef = {
                field: vm.gridOptions.data[i].name,
                displayName: vm.gridOptions.data[i].name,
                headerCellClass: vm.Util.highlightFilteredHeader,
                enableCellEdit: true,
                enableHiding: false,
                maxWidth: 200,
                minWidth: 70,
                width: "*"
                //                cellClass: 'ui-grid-cell-contents-auto'
            };
            //validators: {required: thisrequired, startWith: 'M'}, 
            theValidStr.validators ? coldef.validators = theValidStr.validators : '';
            theValidStr.cellTemplate ? coldef.cellTemplate = theValidStr.cellTemplate : '';
            theTypeStr.cellFilter ? coldef.cellFilter = theTypeStr.cellFilter : '';
            theTypeStr.editableCellTemplate ? coldef.editableCellTemplate = theTypeStr.editableCellTemplate : '';
            coldef.type = theTypeStr.type;

            vm.gcolumns.push(coldef);

        }


        var ctpl = '<div class="ui-grid-cell-contents"><span> \
        <div class="input-icon right form-group" \
        ng-style="{color: row.entity.loaded === \'loaded\' ? \'green\' : \'red\' }" > \
        <i data-hover="tooltip" data-original-title="Correct" \
        ng-class="row.entity.loaded === \'loaded\' ? \'glyphicon-ok\' : \'glyphicon-remove\' " \
        class="glyphicon tooltips"></i> \
        </div>{{row.entity.loaded}}</span></div> \
        ';
        vm.impgcolumns = angular.copy(vm.gcolumns);

        var gcol = {
            field: 'haserror',
            displayName: 'Err?',
            headerCellClass: vm.Util.highlightFilteredHeader,
            enableCellEdit: false,
            enableFiltering: true,
            maxWidth: 100,
            minWidth: 50,
            width: "*"
        };

        vm.impgcolumns.unshift(gcol);

        gcol = {
            field: 'loaded',
            displayName: 'Loaded?',
            enableCellEdit: false,
            headerCellClass: vm.Util.highlightFilteredHeader,
            maxWidth: 100,
            minWidth: 50,
            width: "*",
            cellTemplate: ctpl
        };

        vm.impgcolumns.unshift(gcol);

        var c2tpl = ' <div class="ui-grid-cell-contents"><span>  \
        <a ng-click="grid.appScope.removeRawStudent(row)" \
        role="button" class="btn btn-red" \
        style="padding:  0px 14px;"  > \
        <i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div> \
        ';
        gcol = {
            field: 'externalid',
            displayName: 'Action',
            enableFiltering: false,
            enableSorting: false,
            enableHiding: false,
            enableCellEdit: false,
            maxWidth: 100,
            minWidth: 50,
            width: "*",
            cellTemplate: c2tpl
        };

        vm.impgcolumns.unshift(gcol);
    }

    setGridOptions() {
        var vm = this;

        var ct = '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeCol(row.entity,' +
            "one" +
            ')" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>';

        //todo until we can load this from templatecache, trying this to speed up page load
        var flt = ' \
<div ui-grid-filter> \
<div class="ui-grid-filter-container ng-scope" ng-style="col.extraStyle"  \
    ng-repeat="colFilter in col.filters" \
    ng-class="{\'ui-grid-filter-cancel-button-hidden\' : colFilter.disableCancelFilterButton === true }"> \
<div ng-if="colFilter.type === \'select\'" class="ng-scope"> \
    <select class="ui-grid-filter-select ui-grid-filter-input-0"  \
        ng-show="colFilter.selectOptions.length > 0" ng-attr-placeholder="{{colFilter.placeholder || aria.defaultFilterLabel}}" aria-label="" \
        ng-model="colFilter.term"  \
        ng-options="option.value as option.value for option in colFilter.selectOptions" \
        placeholder="Filter for column"> \
    </select>  \
    <div role="button" class="ui-grid-filter-button-select" ng-click="removeFilter(colFilter, $index)"  \
            ng-if="!colFilter.disableCancelFilterButton"  \
            ng-disabled="colFilter.term === undefined || colFilter.term === null || colFilter.term === \'\'"  \
            ng-show="colFilter.term !== undefined && colFilter.term != null"> \
        <i class="ui-grid-icon-cancel" ui-grid-one-bind-aria-label="aria.removeFilter" aria-label="Remove Filter">&nbsp;</i> \
    </div> \
</div> \
</div> \
</div> \
        ';

        vm.gridOptions = {
            showGridFooter: true,
            //?            enableFiltering: true,
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
                    //?                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    //?                    enableFiltering: true,
                    //                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    //                    cellFilter: 'iddropdown:this',
                    //                    editDropdownIdLabel: 'id',
                    //                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.StudentCols
                    //todo, can the html below be fetched from the js cache https://github.com/angular-ui/ui-grid/issues/422
                    //                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                    /*?                    filterHeaderTemplate: flt,
                                        filter: {
                                            type: vm.uiGridConstants.filter.SELECT,
                                            selectOptions: vm.StudentCols
                                        }
                    */
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
                /*
                                gridApi.edit.on.afterCellEdit(vm.$scope,
                                    function(rowEntity, colDef, newValue, oldValue) {
                                        if (newValue != oldValue) {
                                            // vm.updateStudentColMap(rowEntity, 'Update');
                                        }
                                    });
                */
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
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.initialLength,
            rowHeight: vm.rowheight,

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

    setprelimimp1Options() {
        var vm = this;
        vm.gridimp1Options = {
            appScopeProvider: vm,

            importerDataAddCallback: function(grid, newObjects) {
                vm.importdata = [];
                vm.$log.debug('importerDataAddCallback ', newObjects);
                vm.importdata = vm.importdata.concat(newObjects);
                vm.step3populated = vm.importdata.length > 0 ? true : false;
                vm.gridimp1Options.data = vm.importdata;
                vm.importdata = [];
                vm.createRawStudents();
            },

            onRegisterApi: function(gridApi) {
                vm.$log.debug('vm gridimp1Api onRegisterApi');
                vm.gridimp1Api = gridApi;

                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            vm.updateRawStudent(rowEntity);
                        }
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
                        //      vm.Notification.error({ message: msg, delay: 5000 });
                        vm.$log.debug("validation error", msg);
                        if (colDef.name === 'Birthday' && rowEntity.$$errorsBirthday.required) {
                            rowEntity.Birthday = vm.Util.simpledate("01/01/1900");
                        }
                        rowEntity.haserror = "error";
                        vm.errCnt += 1;
                        vm.isValidForErrors = false;

                    });

                gridApi.pagination.on.paginationChanged(vm.$scope,
                    function(newPage, pageSize) {
                        vm.$log.debug('pagination changed');
                        vm.setGridLength(pageSize);
                        vm.gridimp1Api.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                    });

            }

        };

        vm.$log.debug('setprelimimp1Options', vm.gridimp1Api);

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

        vm.gridimp1Options.showGridFooter = false;
        vm.gridimp1Options.enableGridMenu = false;
        vm.gridimp1Options.paginationPageSizes = vm.limits;
        vm.gridimp1Options.paginationPageSize = vm.initialLength;
        vm.gridimp1Options.rowHeight = vm.rowheight;
        vm.gridimp1Options.flatEntityAccess = true;
        vm.gridimp1Options.fastWatch = true;
        vm.gridimp1Options.enableSorting = false;
        vm.gridimp1Options.enableFiltering = true;
        vm.gridimp1Options.enableHorizontalScrollbar = vm.uiGridConstants.scrollbars.WHEN_NEEDED; 
        vm.gridimp1Options.enableVerticalScrollbar = vm.uiGridConstants.scrollbars.WHEN_NEEDED;
        vm.gridimp1Options.columnDefs = vm.impgcolumns;

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
        vm.errCnt = 0;
        vm.isValidForErrors = true; //if validation error created, this will become false

        var therows = vm.gridimp1Api.grid.rows;
        therows.forEach(function(row) {
            row.grid.options.columnDefs.forEach(function(colDef) {
                vm.gridimp1Api.grid.validate.runValidators(
                    row.entity, colDef, row.entity[colDef.field], NaN, vm.gridimp1Api.grid).then(function() {});
            });
        });
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
            //            vm.setGridimp1Options();
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


        return vm.StudentServices.createBulkStudents(path)
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
                vm.getRawStudentStatus();
                return data;

            }).catch(function(e) {
                vm.$log.debug('createStudent failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }
    createRawStudents() {
        var vm = this;
        var path = '../v1/rawstudent';
        vm.$log.debug('about createRawStudents ');
        var thedata = {
            selectedStudents: vm.gridimp1Options.data
        };


        return vm.StudentServices.createRawStudents(path, thedata)
            .then(function(data) {
                vm.$log.debug('createRawStudents returned data');
                vm.$log.debug(data);
                vm.thisstudent = data;
                vm.$log.debug(vm.thisstudent);
                vm.$log.debug(vm.thisstudent.message);
                vm.message = vm.thisstudent.message;

                if (vm.thisstudent.student_id > 0) {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                    vm.getRawStudentStatus();
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

    updateRawStudent(input) {
        var vm = this;
        var path = '../v1/rawstudent/' + input.externalid;

        input.lastPromoted = vm.Util.oradate(input.lastPromoted);

        vm.$log.debug('about updateRawStudent ', input);

        return vm.StudentServices.updateRawStudent(path, input).then(function(data) {
            vm.$log.debug('updateRawStudent returned data');
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
            vm.$log.debug('updateRawStudent', error);
            vm.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getRawStudentStatus() {

        var vm = this;
        var path = "../v1/rawstudents";
        vm.gridimp1Options.data = [];

        return vm.StudentServices.getRawStudentStatus(path).then(function(data) {
            vm.$log.debug('controller getRawStudentStatus returned data');
            vm.$log.debug(data);
            vm.$log.debug(data.message);
            vm.message = data.message;
            if ((typeof data.rawstudentlist === 'undefined' || data.error === true) &&
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
                for (var i = 0, len = data.rawstudentlist.length; i < len; i++) {
                    data.rawstudentlist[i].loaded = data.rawstudentlist[i].contactid > 0 ? "loaded" : "missing";
                }
                vm.gridimp1Options.data = data.rawstudentlist;
                vm.step3populated = vm.gridimp1Options.data.length > 0 ? true : false;
                vm.Notification.success({ message: vm.message, delay: 5000 });
            }
        }, function(error) {
            vm.$log.debug('Caught an error getRawStudentStatus:', error);
            vm.gridimp1Options.data = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });

    }

    removeRawStudent(row) {
        var vm = this;
        vm.$log.debug('removeRawStudent entered', row.entity.externalid);
        var path = '../v1/rawstudent';
        var thedata = {
            id: row.entity.externalid
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

    removeRawStudents() {
        var vm = this;
        vm.$log.debug('removeRawStudents entered');
        var path = '../v1/rawstudents';

        return vm.StudentServices.removeRawStudents(path)
            .then(function(data) {
                vm.$log.debug('removeRawStudents returned data');
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
                vm.$log.debug('removeRawStudents failure:');
                vm.$log.debug("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

}
