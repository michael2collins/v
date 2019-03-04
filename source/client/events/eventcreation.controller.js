
export class EventTableBasicController {
    constructor(
        $routeParams, $log, EventServices, $location, $window, $q,
        $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants, $timeout, portalDataService,
        Util, UserServices
    ) {
        'ngInject';
        this.$routeParams = $routeParams;
        this.$log = $log;
        this.EventServices = EventServices;
        this.$location = $location;
        this.$window = $window;
        this.$q = $q;
        this.$scope = $scope;
        this.$route = $route;
        this.Notification = Notification;
        this.uiGridConstants = uiGridConstants;
        this.uiGridGroupingConstants = uiGridGroupingConstants;
        this.$timeout = $timeout;
        this.portalDataService = portalDataService;
        this.Util = Util;
        this.UserServices = UserServices;

    }
    $onDestroy() {
        this.$log.log("eventcreation dismissed");
        //this.$log.logEnabled(false);
    }

    $onInit() {
        console.log("initializing EventCreation...");

        var vm = this;

        vm.gridApi = {};
        vm.limit = 0;
        vm.limits = [10, 20, 50, 100, 200, 500, 5000];
        vm.data = [];
        vm.state = {};
        vm.thiscoldef = '';
        vm.colkey = 'event';
        vm.colsubkey = '';
        vm.colsubkeys = [];
        vm.coldeflist = [];
        vm.eventtmp;
        vm.gcolumns = [];
        vm.loading = true;
        vm.loadAttempted = false;
        vm.gridOptions = {};
        vm.gridHistOptions = {};
        vm.selectedStudents = [];
        vm.selected = false;
        vm.eventSelected = '';
        vm.eventlist = []; 
        vm.Event = '';
        vm.EventType = '';
        vm.EventDate = '';
        vm.EventEnd = '';
        vm.EventStart = '';
        vm.Location = '';
        vm.ContactID = '';
        vm.active=[];


        vm.status = {
            opened: false
        };

        vm.listA = [
            "contactID", "number", "TRUE",
            "LastName", "string", "TRUE",
            "FirstName", "string", "TRUE",
            "Email", "string", "FALSE",
            "Email2", "string", "FALSE",
            "Parent", "string", "FALSE",
            "Phone", "string", "FALSE",
            "AltPhone", "string", "FALSE",
            "Address", "string", "FALSE",
            "City", "string", "FALSE",
            "State", "string", "FALSE",
            "ZIP", "string", "FALSE",
            "Notes", "string", "FALSE",
            "BeltSize", "string", "FALSE",
            "InstructorPaymentFree", "number", "FALSE",
            "ContactType", "string", "TRUE",
            "include", "boolean", "FALSE",
            "quickbooklink", "string", "FALSE",
            "instructorTitle", "string", "FALSE",
            "bdayinclude", "boolean", "FALSE",
            "sex", "string", "FALSE",
            "medicalConcerns", "string", "FALSE",
            "GuiSize", "string", "FALSE",
            "ShirtSize", "string", "FALSE",
            "phoneExt", "string", "FALSE",
            "altPhoneExt", "string", "FALSE",
            "StudentSchool", "string", "FALSE",
            "EmergencyContact", "string", "FALSE",
            "nextScheduledTest", "string", "FALSE",
            "contactpictureurl", "string", "FALSE",
            "nclassid", "number", "FALSE",
            "nclass", "string", "FALSE",
            "nclasssort", "number", "FALSE",
            "nextClass", "string", "FALSE",
            "rankForNextClass", "string", "FALSE",
            "ageForNextClass", "number", "FALSE",
            "pgrmcat", "string", "TRUE",
            "classcat", "string", "TRUE",
            "agecat", "string", "TRUE",
            "classpictureurl", "string", "FALSE",
            "PaymentClassName", "string", "FALSE",
            "NumberOfMembers", "string", "FALSE",
            "paymenttype", "string", "FALSE",
            "PaymentNotes", "string", "FALSE",
            "PaymentPlan", "string", "FALSE",
            "PaymentAmount", "number", "FALSE",
            "PriceSetby", "string", "FALSE",
            "Pricesetdate", "date", "FALSE",
            "rankid", "number", "FALSE",
            "ranksortkey", "number", "FALSE",
            "rankGroup", "string", "FALSE",
            "rankalphasortkey", "string", "FALSE",
            "age", "number", "TRUE",
            "birthday", "date", "FALSE",
            "lastpaymentdate", "date", "FALSE",
            "nextpaymentdate", "date", "FALSE"
        ];


        vm.$scope.$watch('vm.EventStart', function(value) {
            vm.$log.log('vm.EventStart', value);
            var defValue = "1/1/1900";
            if (!value || value == "NULL") {
                vm.EventStart = new Date(defValue) //.toISOString();
            }
            else {
                vm.EventStart = new Date(value) //.toISOString();

            }
            return vm.EventStart;
        }, true);

        vm.$scope.$watch('vm.EventEnd', function(value) {
            vm.$log.log('vm.EventEnd', value);
            var defValue = "1/1/1900";
            if (!value || value == "NULL") {
                vm.EventEnd = new Date(defValue) //.toISOString();
            }
            else {
                vm.EventEnd = new Date(value) //.toISOString();
            }
            return vm.EventEnd;
        }, true);

        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('EventTableBasicController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("table-basic-eventcreation started");

        });

//        vm.portalDataService.Portlet('eventcreation.controller.js');
        vm.activate();

    }

    dateopen($event) {
        var vm = this;
        vm.status.opened = true;
    }

    setLimit(thelimit) {
        var vm = this;
        vm.$log.log('setLimit', thelimit);
        vm.limit = thelimit;
    }

    requery() {
        var vm = this;
        vm.$log.log('requery entered');
        vm.attending = [];
        vm.refreshtheEvent();
    }


    setActiveTab(activeTab, thecaller) {
        var self = this;
        self.$log.log('set activetab as:', activeTab, thecaller);
        self.EventServices.setActiveTab(activeTab, thecaller);

    }

    getActiveTab() {
        var self = this;
        var atab = self.EventServices.getActiveTab();
        self.$log.log('get activetab is:', atab);
        self.active = atab;
        return atab;
    }

    activate() {
        var vm = this;
        vm.getActiveTab();
        vm.setInitColDefs();
        vm.getColDefList();
        vm.setGridHistOptions();

    }


    createEvent(event) {
        var vm = this;
        if (vm.selected === false) {
            var error = "no rows selected for event";
            vm.Notification.error({ message: error, delay: 5000 });
            return;
        }

        var path = "../v1/eventregistration";

        var thedata = {
            Event: event,
            EventDate: vm.Util.geteFormattedDate(vm.EventDate),
            EventType: vm.EventType,
            EventStart: vm.Util.geteFormattedTime(vm.EventStart),
            EventEnd: vm.Util.geteFormattedTime(vm.EventEnd),
            Location: vm.Location,
            selectedStudents: vm.selectedStudents
        };
        vm.$log.log('about createEvent ', path, thedata);
        return vm.EventServices.createEvent(path, thedata)
            .then(function(data) {
                vm.$log.log('createEvent returned data');
                vm.$log.log(data);
                vm.thisEvent = data;
                vm.$log.log(vm.thisEvent);
                vm.$log.log(vm.thisEvent.message);
                vm.message = vm.thisEvent.message;
                vm.Notification.success({ message: vm.message, delay: 5000 });
                vm.refreshtheEvent().then(function(zdata) {
                        vm.$log.log('refreshtheEvent returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error refreshtheEvent after update:', error);
                        vm.data = [];
                        vm.photos = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });

                return vm.thisEvent;
            }).catch(function(e) {
                vm.$log.log('createEvent failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    refreshtheEvent() {
        var vm = this;
        vm.$log.log('refreshtheEvent entered ');

        var refreshpath = encodeURI('../v1/eventsource?thelimit=' + vm.limit);

        vm.$log.log('refreshtheEvent path:', refreshpath);

        return vm.EventServices.getEventSource(refreshpath).then(function(data) {
                vm.$log.log('refreshEvents returned data');
                vm.$log.log(data);
                vm.gridOptions.data = data.EventsourceList;
                return vm.gridOptions.data;
            },
            function(error) {
                vm.$log.log('Caught an error refreshtheEvent, going to notify:', error);
                vm.data = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    getEventSource() {
        var vm = this;
        vm.$log.log('getEventSource entered');
        var refreshpath = encodeURI('../v1/eventsource');

        vm.$log.log('getEventSource path:', refreshpath);

        return vm.EventServices.getEventSource(refreshpath).then(function(data) {
                vm.$log.log('getEventSource returned data');
                vm.$log.log(data);
                vm.data = data;
                return vm.data;
            },
            function(error) {
                vm.$log.log('Caught an error eventsource:', error);
                vm.data = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    getEventDetails(theevent) {
        var vm = this;
        vm.$log.log('getEventDetails entered:', theevent.event);
        var path = encodeURI('../v1/eventdetails?event=' + theevent.event);

        vm.$log.log('getEventDetails path:', path);

        return vm.EventServices.getEventDetails(path).then(function(data) {
                vm.$log.log('getEventDetails returned data');
                vm.$log.log(data);
                vm.gridHistOptions.data = data.eventdetails;
                vm.$log.log("details", data.eventdetails[0]);

                vm.Event = data.eventdetails[0].Event;
                vm.EventType = data.eventdetails[0].EventType;
                vm.Location = data.eventdetails[0].Location;
                vm.ContactID = data.eventdetails[0].ContactID;

                vm.EventEnd = new Date(vm.Util.eventconvertToMoment(
                    data.eventdetails[0].EventEnd, data.eventdetails[0].EventDate));
                vm.EventStart = new Date(vm.Util.eventconvertToMoment(
                    data.eventdetails[0].EventStart, data.eventdetails[0].EventDate));
                vm.EventDate = vm.Util.eventdateconvert(data.eventdetails[0].EventDate);


                //check for empty set and do message
                var messagetxt = "EventDetails obtained";
                vm.Notification.success({ message: messagetxt, delay: 5000 });
                return;
            },
            function(error) {
                vm.$log.log('Caught an error getEventDetails:', error);
                vm.data = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    getEventNames(eventpartial) {
        var vm = this;
        vm.$log.log('getEventNames entered');
        var path = encodeURI('../v1/eventnames?eventpartial=' + eventpartial);

        vm.$log.log('getEventNames path:', path);

        return vm.EventServices.getEventNames(path).then(function(data) {
                vm.$log.log('getEventNames returned data');
                vm.$log.log(data);
                vm.eventlist = data.eventlist;
                //check for empty set and do message
                //messagetxt = "EventDetails obtained";
                //vm.Notification.success({message: messagetxt, delay: 5000});
                return;
            },
            function(error) {
                vm.$log.log('Caught an error getEventDetails:', error);
                vm.data = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }


    setColDef(indata) {
        var vm = this;
        var path = "../v1/coldef";
        vm.$log.log('about setColDefs ', indata, path);
        return vm.EventServices.setColDefs(path, indata)
            .then(function(data) {
                vm.$log.log('setColDefs returned data');
                vm.$log.log(data);
                vm.thiscoldef = data;
                vm.$log.log(vm.thiscoldef);
                vm.$log.log(vm.thiscoldef.message);
                vm.message = vm.thiscoldef.message;
                vm.getColDefList();


            }).catch(function(e) {
                vm.$log.log('setColDefs failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    changeColDef(colsubkey) {
        var vm = this;
        vm.$log.log('changeColDef entered');
        if (vm.isNewColDef(colsubkey)) {
            vm.saveState();
        }
        vm.getColDefs(vm.colsubkey).then(function(data) {
            //vm.gcolumns is filled
            vm.$log.log(" controller changeColDef returned with:", data, vm.colsubkey);
            vm.$log.log(" controller changeColDef vmstate is:", vm.state);

            if (vm.state != {}) {
                vm.restoreState(vm.state);
            }

        }, function(error) {
            vm.$log.log('cols not stored:', error);
        });


    }

    getColDefs(colsubkey) {
        var vm = this;
        vm.$log.log('getColDefs entered');
        var refreshpath = encodeURI('../v1/coldefs?colkey=' +
            vm.colkey + "&colsubkey=" + colsubkey);
        var holdgcol = vm.gcolumns;

        vm.$log.log('getColDefs path:', refreshpath);

        if (colsubkey === null) {
            vm.error = "Nothing selected";
            return (vm.$q.reject(vm.error));
        }

        return vm.EventServices.getColDefs(refreshpath).then(function(data) {
                vm.$log.log('EventServices in controller getColDefs returned data');
                vm.$log.log(data);
                //   vm.gcolumns = data.gcolumns[0][0]; 
                //   $log.log('EventServices in controller set gcolumns',vm.gcolumns);
                vm.state = JSON.parse(data.gcolumns[0][0]);
                vm.$log.log('EventServices in controller set vm.state', vm.state);
                return vm.state;
            },
            function(error) {
                vm.$log.log('Caught an error getColDefs:', error);
                vm.gcolumns = holdgcol;
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    getColDefList() {
        var vm = this;
        vm.$log.log('getColDefList entered');
        var refreshpath = encodeURI('../v1/coldeflist?colkey=' +
            vm.colkey);

        vm.$log.log('getColDefList path:', refreshpath);

        return vm.EventServices.getColDefList(refreshpath).then(function(data) {
                vm.$log.log('getColDefList returned data');
                vm.$log.log(data);
                vm.colsubkeys = data.colsubkeys;
                return vm.data;
            },
            function(error) {
                vm.$log.log('Caught an error getColDefList:', error);
                vm.colsubkeys = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    setInitColDefs() {
        var vm = this;
        vm.gcolumns = [];
        vm.colsubkey = "Default";

        //if they are saved, then get those, otherwise default 
        vm.getColDefs(vm.colsubkey).then(function(data) {
            //vm.gcolumns is filled
            vm.$log.log(" controller getColDefs returned with:", data, vm.colsubkey);
            vm.$log.log(" controller getColDefs vmstate is:", vm.state);

            //         setGridOptions();


        }, function(error) {
            vm.$log.log('cols not stored:', error);


        });

        var coldef = {};
        vm.$log.log('setGridOptions col count', vm.listA.length);

        var defnumfilter = [{
                condition: vm.uiGridConstants.filter.GREATER_THAN,
                placeholder: '> than'
            },
            {
                condition: vm.uiGridConstants.filter.LESS_THAN,
                placeholder: '< than'
            }
        ];
        var filt = [];
        for (var i = 0, len = vm.listA.length; i < len; i += 3) {
            //$log.log('vis', vm.listA[i+2]);
            var val = (vm.listA[i + 2].toLowerCase() === "true");
            //$log.log('vis', val);
            var agg = (
                vm.listA[i + 1] === "number" ? vm.uiGridConstants.aggregationTypes.avg :
                vm.listA[i + 1] === "string" ? vm.uiGridConstants.aggregationTypes.count :
                vm.listA[i + 1] === "date" ? vm.uiGridConstants.aggregationTypes.min :
                vm.listA[i + 1] === "boolean" ? vm.uiGridConstants.aggregationTypes.count :
                vm.uiGridConstants.aggregationTypes.count
            );
            //$log.log('agg', agg);
            if (vm.listA[i + 1] === "number") {
                filt = [{
                        condition: vm.uiGridConstants.filter.GREATER_THAN,
                        placeholder: '> than'
                    },
                    {
                        condition: vm.uiGridConstants.filter.LESS_THAN,
                        placeholder: '< than'
                    }
                ];
            }
            else if (vm.listA[i + 1] === "string") {
                /*  constants.js
                      GREATER_THAN: 32,
                      GREATER_THAN_OR_EQUAL: 64,
                      LESS_THAN: 128,
                      LESS_THAN_OR_EQUAL: 256,
                      NOT_EQUAL: 512,
                      SELECT: 'select',
                      INPUT: 'input'
                      */
                filt = [{
                        condition: vm.uiGridConstants.filter.STARTS_WITH,
                        placeholder: 'Starts with'
                    },
                    {
                        condition: vm.uiGridConstants.filter.ENDS_WITH,
                        placeholder: 'Ends with'
                    },
                    {
                        condition: vm.uiGridConstants.filter.CONTAINS,
                        placeholder: 'Contains'
                    },
                    {
                        condition: vm.uiGridConstants.filter.EXACT,
                        placeholder: 'Exactly'
                    }
                ];

            }
            else if (vm.listA[i + 1] === "date") {
                /*  not working, need to create custom filter  
                    filt =   [
                        {
                          condition: vm.uiGridConstants.filter.GREATER_THAN,
                          placeholder: '> than'
                        },
                        {
                          condition: vm.uiGridConstants.filter.LESS_THAN,
                          placeholder: '< than'
                        }
                      ];
                    */
                filt = "";
            }
            else {
                filt = "";
            }

            //  $log.log('filt', filt);

            coldef = {
                field: vm.listA[i],
                type: vm.listA[i + 1],
                visible: val,
                enableFiltering: true,
                aggregationType: agg,
                filters: filt,
                headerCellClass: vm.Util.highlightFilteredHeader,
                enableCellEdit: false
            };

            vm.gcolumns.push(coldef);

        }
        vm.$log.log('gcolumns in coldefs', vm.gcolumns);

        vm.setGridOptions();

        vm.refreshtheEvent().then(function(zdata) {
            vm.$log.log('refreshtheEvent returned', zdata);
            if (vm.state != {}) {
                vm.restoreState(vm.state);
            }
        });


    }

    isNewColDef(theevent) {
        var vm = this;
        vm.$log.log('isNewColDef', theevent);
        var isnew = true;
        for (var i = 0, len = vm.colsubkeys.length; i < len; i++) {
            //  $log.log('isNewColDef colsubkey:', vm.colsubkeys[i]);
            if (vm.colsubkeys[i] == theevent) {
                vm.$log.log('isfound');
                isnew = false;
                break;
            }
        }
        return isnew;
    }

    saveState() {
        var vm = this;
        vm.state = vm.gridApi.saveState.save();
        vm.$log.log('state', vm.state);
        var thedata = {
            colkey: vm.colkey,
            colsubkey: vm.colsubkey,
            colcontent: vm.state
        };

        vm.setColDef(thedata);
    }

    restoreState(thestate) {
        var vm = this;
        
        if (!vm.Util.isEmptyObject(vm.gridApi)) {
            vm.gridApi.saveState.restore(vm.$scope, thestate);
            vm.$log.log('state', thestate);

        }
    }

    setGridOptions() {
        var vm = this;

        vm.gridOptions = {
            enableFiltering: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: 10,
            columnDefs: vm.gcolumns,
            //rowHeight: 15,
            showGridFooter: true,
            enableColumnResizing: true,
            enableGridMenu: true,
            showColumnFooter: true,
            exporterCsvFilename: 'events.csv',
            exporterPdfDefaultStyle: { fontSize: 9 },
            exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
            exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
            exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
            exporterPdfFooter: function(currentPage, pageCount) {
                return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
            },
            exporterPdfCustomFormatter: function(docDefinition) {
                docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,

            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged(vm.$scope, function(row) {
                    var msg = 'row selected ' + row.entity.ContactID;
                    vm.$log.log(msg);

                    var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                    vm.$log.log('selected', selectedStudentarr);
                    vm.setSelectedArray(selectedStudentarr);

                });
                gridApi.selection.on.rowSelectionChangedBatch(vm.$scope, function(rows) {
                    vm.$log.log("batch");
                    //note this will send the list of changed rows
                    /*    var selectedContacts=[];
                        for (var index=0, len=rows.length; index < len; index++) {
                        vm.$log.log("selected?",rows[index].isSelected);
                            if (rows[index].isSelected === true) {
                                selectedContacts.push(rows[index].entity);
                            }
                        }
                    vm.$log.log("batch", selectedContacts);
                        setSelectedArray(selectedContacts);
                        */
                    var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                    vm.$log.log('batch selected', selectedStudentarr);
                    vm.setSelectedArray(selectedStudentarr);

                });


            }
        };

        vm.$log.log('setGridOptions gcolumns', vm.gcolumns);
        vm.$log.log('setGridOptions gridOptions', vm.gridOptions);

    }

    setGridHistOptions() {
        var vm = this;

        vm.gridHistOptions = {
            enableFiltering: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: 10,
            columnDefs: [
                // default

                {
                    field: 'LastName',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'FirstName',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'ContactID',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'Attended',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'Ordered',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'Paid',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'ShirtSize',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'Notes',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'Include',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'Email',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Email2',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Parent',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'StudentSchool',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Event',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'EventType',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'EventEnd',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'EventStart',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'Location',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }
            ],

            //rowHeight: 15,
            showGridFooter: true,
            enableColumnResizing: true,
            enableGridMenu: true,
            showColumnFooter: true,
            exporterCsvFilename: 'eventhist.csv',
            exporterPdfDefaultStyle: { fontSize: 9 },
            exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
            exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
            exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
            exporterPdfFooter: function(currentPage, pageCount) {
                return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
            },
            exporterPdfCustomFormatter: function(docDefinition) {
                docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,

            onRegisterApi: function(gridHistApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridHistApi = gridHistApi;

                gridHistApi.selection.on.rowSelectionChanged(vm.$scope, function(row) {
                    var msg = 'gridhist row selected ' + row.entity;
                    vm.$log.log(msg);

                    //        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                    //   vm.$log.log('selected', selectedStudentarr);
                    //       setSelectedArray(selectedStudentarr);

                });
                gridHistApi.selection.on.rowSelectionChangedBatch(vm.$scope, function(rows) {
                    vm.$log.log("gridhist batch");
                    //note this will send the list of changed rows
                    /*    var selectedContacts=[];
                        for (var index=0, len=rows.length; index < len; index++) {
                        vm.$log.log("selected?",rows[index].isSelected);
                            if (rows[index].isSelected === true) {
                                selectedContacts.push(rows[index].entity);
                            }
                        }
                    vm.$log.log("batch", selectedContacts);
                        setSelectedArray(selectedContacts);
                        */
                    //        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                    //    vm.$log.log('batch selected', selectedStudentarr);
                    //        setSelectedArray(selectedStudentarr);

                });
                gridHistApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        vm.$log.log('rowEntity');
                        vm.$log.log(rowEntity);
                        //Alert to show what info about the edit is available
                        vm.$log.log('Column: ' + colDef.name +
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue);
                        if (newValue != oldValue) {
                            vm.updateEvent(colDef, newValue, rowEntity);
                        }
                    });

            }
        };

        vm.$log.log('setGridHistOptions gridOptions', vm.gridHistOptions);

    }

    updateEvent(colDef, newValue, rowEntity) {
        var vm = this;
        var path = "../v1/eventregistration";
        var indata = {
            changedColumn: colDef,
            newValue: newValue,
            ContactID: rowEntity.ContactID,
            Event: vm.Event,
            EventDate: vm.EventDate,
            Paid: rowEntity.Paid,
            ShirtSize: rowEntity.ShirtSize,
            Notes: rowEntity.Notes,
            Include: rowEntity.Include,
            Attended: rowEntity.Attended,
            ordered: rowEntity.Ordered
        };

        vm.$log.log('about updateEvent ', indata, path);

        return vm.EventServices.updateEvent(path, indata)
            .then(function(data) {
                vm.$log.log('updateEvent returned data');
                vm.$log.log(data);
                vm.thiscoldef = data;
                vm.$log.log(vm.thiscoldef);
                vm.$log.log(vm.thiscoldef.message);
                vm.message = vm.thiscoldef.message;

            }).catch(function(e) {
                vm.$log.log('updateEvent failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    setSelectedArray(inputArray) {
        var vm = this;
        vm.$log.log("setSelectedArray entered", inputArray);
        vm.selectedStudents = [];

        if (inputArray.length > 0) {
            vm.selected = true;
            for (var i = 0, len = inputArray.length; i < len; i++) {
                var info = {
                    ContactID: inputArray[i].contactID,
                    Paid: "",
                    ShirtSize: "",
                    Notes: "",
                    Include: "",
                    Attended: "",
                    Ordered: ""
                };
                vm.selectedStudents.push(info);
            }
        }
        else {
            vm.selected = false;
            return;
        }

        vm.$log.log("setarray", vm.selectedStudents);

    }


}
