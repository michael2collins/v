const { crypto: crypto } = window;
const { Uint8Array: Uint8Array } = window;
const { moment: moment } = window;
import angular from 'angular';

export class Util {
    constructor($log) {
        'ngInject';
        this.$log = $log;
    }

    convertTime(thetime) {
        var vm = this;
        if (typeof(thetime) !== 'undefined') {
            var m = moment(thetime, "MM/DD/YYYY hh:mm A z");
            vm.$log.debug('convertTime: passed in: ', thetime,
                'isvalid?', m.isValid(),
                'where invalid', m.invalidAt());
            return moment(thetime, "MM/DD/YYYY hh:mm A z").tz('America/New_York').format('MM/DD/YYYY hh:mm A z');
        }
    }

    geteFormattedDate(date) {
        var d3 = new Date(date);
        var year = d3.getFullYear();
        var month = (1 + d3.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = d3.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return year + '-' + month + '-' + day;
    }

    geteFormattedTime(date) {
        var vm = this;
        var d3 = new Date(date);
        var hour = vm.addZero(d3.getHours());
        var min = vm.addZero(d3.getMinutes());
        return hour + ':' + min;
    }


    addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    eventconvertToMoment(thetime, thedate) {
        var startd = moment(thedate).tz('America/New_York').format('MM/DD/YYYY');

        //add the time to the date
        var tststr = startd + ' ' + thetime.toString();
        return moment(tststr, 'MM/DD/YYYY hh:mm A z');

    }

    isEmptyObject(obj) {
        if (obj == null) return true;
        if (obj == "null") return true;
        if (obj == "") return true;
        return (Object.getOwnPropertyNames(obj).length === 0);
    }

    eventdateconvert(thedate) {

        //                var startd = moment(thedate).tz('America/New_York').format('MM/DD/YYYY');

        //                vm.EventDate = moment(startd, 'MM/DD/YYYY');
        return moment(thedate).tz('America/New_York').format('MM/DD/YYYY');


    }
    convertToMoment(thetime) {
        //it has DST on the end
        if (typeof(thetime) !== 'undefined') {
            var m = moment(thetime, "MM/DD/YYYY hh:mm A z");
            return moment(thetime, "MM/DD/YYYY hh:mm A z").tz('America/New_York').format('MM/DD/YYYY hh:mm A z');
        }
    }
    convertToMomentDST(thetime) {
        if (typeof(thetime) === 'undefined') {
            return;
        }
        return moment(thetime).tz('America/New_York').format('z');
    }

    validateDate(indate, informat) {

        var aDate = moment(indate, informat, true);
        /*
        -1 no overflow
        0 year
        1 month
        2 day
        3 hour
        4 minute
        5 seconds
        6 milliseconds
        */
        var invalidmsg = "";
        var retVlu = aDate.isValid();
        var invalidAt = aDate.invalidAt();
        switch (invalidAt) {
            case -1:
                {
                    invalidmsg = "no overflow";
                    break;
                }
            case 0:
                {
                    invalidmsg = "invalid year";
                    break;
                }
            case 1:
                {
                    invalidmsg = "invalid month";
                    break;
                }
            case 2:
                {
                    invalidmsg = "invalid day";
                    break;
                }
            case 3:
                {
                    invalidmsg = "invalid hour";
                    break;
                }
            case 4:
                {
                    invalidmsg = "invalid minute";
                    break;
                }
            case 5:
                {
                    invalidmsg = "invalid seconds";
                    break;
                }
            case 6:
                {
                    invalidmsg = "invalid millisecs";
                    break;
                }
        }

        if (!retVlu) {
            this.$log.debug('validateDate indicates error for: ', indate, ' format: ', informat, 'invalidAt', invalidmsg);
        }

        return retVlu;

    }

    validateEmail(email) {
        var pattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/;
        var regExp = new RegExp(pattern, "i");
        return regExp.test(email);
    }
    validatePhone(phone) {
        var pattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        var regExp = new RegExp(pattern, "i");
        return regExp.test(phone);
    }

    simpledate(input) {
        var vm = this;
        if (input === null) {
            return;
        }
        else {
            return vm.eventdateconvert(vm.datecheckconvert(input.toString()));
        }
    }

    oradate(input) {
        var oraFormat = "YYYY-MM-DD HH:mm:ss";
        var vm = this;
        if (input === null) {
            return;
        }
        else {
            return moment(vm.datecheckconvert(input.toString())).format(oraFormat);
        }

    }
    highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
        if (col.filters[0].term) {
            return 'header-filtered';
        }
        else {
            return '';
        }
    }

    //https://gist.github.com/jed/982883
    uuidv4() {
        /*jslint bitwise: true */
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    datecheckconvert(indate) {
        var testdatetimestamp = Date.parse(indate);

        if (isNaN(testdatetimestamp) == false) {
            return new Date(indate);
        }
        else {
            return new Date();
        }

    }
    maxObjArr(arr, attr) {
        this.$log.debug('maxObjArr entered', arr, attr);
        var res = Math.max.apply(Math, arr.map(function(o) { return o[attr]; }));
        return res;
    }
    getByValue(arr, value, attr, resvlu) {
        this.$log.debug('getByValue entered', arr, value, attr, resvlu);

        var result = arr.filter(function(o) { return o[attr] == value; });

        return result ? result[0][resvlu] : null; // or undefined

    }

    handleFileSelect(files, vm) {
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

    setTypeStr(theType, format) {
        var theTypeStr = {};
        if (theType === 'date') {
            this.setDateCol(format, theType);
        }
        else {
            theTypeStr = {
                type: theType,
            };
        }

        return theTypeStr;

    }
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
    setValidStrByType(colname, mailrequired, dateformat) {
        var theValidStr = {};
        theValidStr = this.setValidStr(true);

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
        if (colname.match(/contactDate/i)) {
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
        var gcol = this.setGCol('haserror', 'Err?', false);
        gcol.headerCellClass = this.highlightFilteredHeader;
        return gcol;
    }
    setLoadedCol() {
        var ctpl = '<div class="ui-grid-cell-contents"><span> \
        <div class="input-icon right form-group" \
        ng-style="{color: row.entity.loaded === \'loaded\' ? \'green\' : \'red\' }" > \
        <i data-hover="tooltip" data-original-title="Correct" \
        ng-class="row.entity.loaded === \'loaded\' ? \'glyphicon-ok\' : \'glyphicon-remove\' " \
        class="glyphicon tooltips"></i> \
        </div>{{row.entity.loaded}}</span></div> \
        ';
        var gcol = this.setGCol('loaded', 'Loaded?', false);
        gcol.headerCellClass = this.highlightFilteredHeader;
        gcol.cellTemplate = ctpl;
        return gcol;
    }
    setExtIdCol(removefunc) {
        var c2tpl = ' <div class="ui-grid-cell-contents"><span>  \
        <a ng-click="' + removefunc + '" \
        role="button" class="btn btn-red" \
        style="padding:  0px 14px;"  > \
        <i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div> \
        ';
        var gcol = this.setGCol('externalid', 'Action', false);
        gcol.cellTemplate = c2tpl;
        gcol.enableFiltering = false;
        gcol.enableSorting = false;
        gcol.enableHiding = false;
        return gcol;
    }

    setEmailValidator(uiGridValidateService) {
        var self = this;
        uiGridValidateService.setValidator('email',
            function(argument) {
                //todo, note below is different then example but matching current uigrid code order
                return function(oldValue, newValue, rowEntity, colDef) {
                    if (!newValue) {
                        return true; // We should not test for existence here
                    }
                    else {
                        return self.validateEmail(newValue);
                    }
                };
            },
            function(argument) {
                return 'Needs proper email address format';
            }
        );

    }
    setDateValidator(uiGridValidateService) {
        var self = this;
        uiGridValidateService.setValidator('date',
            function(argument) {
                //todo, note below is different then example but matching current uigrid code order
                return function(oldValue, newValue, rowEntity, colDef) {
                    if (!newValue) {
                        return true; // We should not test for existence here
                    }
                    else {
                        return self.validateDate(newValue, argument);
                    }
                };
            },
            function(argument) {
                return 'Needs proper date format ' + argument;
            }
        );
    }
    setImpGridDefaults(cols, gridimp1Options, uiGridConstants, limits, initialLength, rowheight) {
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
    importerDataSetCallback(grid, newObjects, importdata, step2populated, gridimp1Options) {
        importdata = [];
        this.$log.debug('importerDataAddCallback ', newObjects);
        importdata = importdata.concat(newObjects);
        step2populated = importdata.length > 0 ? true : false;
        gridimp1Options.data = importdata;
        importdata = [];

    }
    changeloadfilter(value, gridimp1Api) {
        if (value == "all") {
            gridimp1Api.grid.getColumn('loaded').filters[0].term = '';
        }
        else {
            gridimp1Api.grid.getColumn('loaded').filters[0].term = String(value);
        }
        gridimp1Api.grid.refresh();
    }
    changeerrfilter(value, gridimp1Api, uiGridConstants) {
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
    setGridLength(size, vm) {
        vm.gridLength = {
            height: (size * vm.rowheight) + vm.headerheight + 'px'
        };
    }
    setPagination(gridApi, vm) {
        gridApi.pagination.on.paginationChanged(vm.$scope,
            function(newPage, pageSize) {
                vm.$log.debug('pagination changed');
                vm.Util.setGridLength(pageSize, vm);
                vm.gridimp1Api.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

            });

    }
    download(gridexp1Api, uiGridExporterConstants) {
        gridexp1Api.exporter.csvExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL);
    }

    validate(gridimp1Api) {
        var therows = gridimp1Api.grid.rows;
        therows.forEach(function(row) {
            row.grid.options.columnDefs.forEach(function(colDef) {
                gridimp1Api.grid.validate.runValidators(
                    row.entity, colDef, row.entity[colDef.field], NaN, gridimp1Api.grid).then(function() {});
            });
        });

    }
    validationFailed(gridApi, errmsgfields, errCnt, isValidForErrors, scope) {
        var self = this;
        var errmsg = "";
        gridApi.validate.on.validationFailed(scope,
            function(rowEntity, colDef, newValue, oldValue) {
                for (var i = 0, len = errmsgfields.length; i < len; i++) {
                    errmsg += ' ' + rowEntity[errmsgfields[i]];
                }

                var msg = (
                    'For:' + errmsg +
                    '\nColumn: ' + colDef.displayName + '\n' +
                    'Has an error.  The new Value: ' + newValue + '\n' +
                    ' vs the old Value: ' + oldValue + '\nvalidators: ' +
                    JSON.stringify(colDef.validators));
                self.$log.debug("validation error", msg);
                rowEntity.haserror = "error";
                errCnt += 1;
                isValidForErrors = false;

            });
    }
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
    setExporterFieldCallback(grid, row, col, value) {
        if (col.name === 'lastPromoted') {
            if (this.isEmptyObject(value)) {
                return this.simpledate("01/01/1900");
            }
            else {
                return this.simpledate(value);
            }
        }
        if (col.name === 'contactDate') {
            if (this.isEmptyObject(value)) {
                return this.simpledate("01/01/1900");
            }
            else {
                return this.simpledate(value);
            }
        }
        if (col.name === 'mondayOfWeek') {
            if (this.isEmptyObject(value)) {
                return this.simpledate("01/01/2000");
            }
            else {
                return this.simpledate(value);
            }
        }

    }
    exceptionError(e, func, notification) {
        this.$log.debug(func + ' failure:');
        this.$log.debug("error", e);
        notification.error({ message: e, delay: 5000 });
    }
    checkDataSuccess(data, list, notification, $q, func, notifysuccess) {
        this.$log.debug(func + ' returned data');
        this.$log.debug(data);
        if ((typeof data === 'undefined' || typeof list === 'undefined' || data.error === true) &&
            typeof data !== 'undefined') {
            notification.error({ message: data.message, delay: 5000 });
            return ($q.reject(data));
        }
        else {
            if (notifysuccess) {
                notification.success({ message: data.message, delay: 5000 });
            }
        }
    }
    checkRemoveSuccess(data, notification, $q, func, notifysuccess) {
        this.$log.debug(func + ' returned data');
        this.$log.debug(data);
        if ((typeof data === 'undefined' ||  data.error === true) &&
            typeof data !== 'undefined') {
            notification.error({ message: data.message, delay: 5000 });
            return ($q.reject(data));
        }
        else {
            if (notifysuccess) {
                notification.success({ message: data.message, delay: 5000 });
            }
        }
    }
    checkCreateDataSuccess(data, newid, notification, $q, func, notifysuccess) {
        this.$log.debug(func + ' returned data');
        this.$log.debug(data);
        if ((typeof data === 'undefined'  || data.error === true) &&
            typeof data !== 'undefined') {
            notification.error({ message: data.message, delay: 5000 });
            return ($q.reject(data));
        }
        else {
            if (newid > 0) {
                if (notifysuccess) {
                    notification.success({ message: data.message, delay: 5000 });
                }
            } else {
                notification.error({ message: data.message, delay: 5000 });
            }
        }
    }
    checkDataSuccessv2(data, list, notification, $q, func, notifysuccess) {
        this.$log.debug(func + ' returned data');
        this.$log.debug(data);
        if ((typeof list === 'undefined' || data.error === true) &&
            typeof data !== 'undefined') {
            notification.error({
                message: data.message + ': ' + (
                    (typeof(data.extra.sqlerror) === "string" && typeof(data.extra.sqlerrordtl) === "string") ?
                    data.extra.sqlerror + data.extra.sqlerrordtl : ""),
                delay: 5000
            });
            return ($q.reject(data));
        }
        else {
            if (notifysuccess) {
                notification.success({ message: data.message, delay: 5000 });
            }
        }
    }


}
