(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('EventController', EventController);

    EventController.$inject = [
    '$routeParams',
    '$log',
    'EventServices',
    '$location',
    '$window',
    '$q',
    '$scope',
    '$route',
    'Notification',
    'uiGridConstants',
    'uiGridGroupingConstants',
    '$timeout'
    ];

    function EventController($routeParams, $log, EventServices, $location, $window, $q, $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants, $timeout) {
        /* jshint validthis: true */

        var vm=this;
        
        vm.refreshtheEvent = refreshtheEvent;
        vm.getEventSource = getEventSource;
        vm.getEventDetails = getEventDetails;
        vm.updateEvent = updateEvent;
        vm.getEventNames = getEventNames;
        vm.setEventInfo = setEventInfo;
        vm.getColDefList = getColDefList;
        vm.setColDef = setColDef;
        vm.dateopen = dateopen;
        vm.getColDefs = getColDefs;
        vm.changeColDef = changeColDef;
        vm.saveState = saveState;
        vm.restoreState = restoreState;
        vm.setLimit = setLimit;
        vm.createEvent = createEvent;
        vm.getActiveTab = getActiveTab;
        vm.setActiveTab = setActiveTab;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.limit = 0;
        vm.limits = [10,20,50,100,200,500,5000];
        vm.data = [];
        vm.state = {};
        vm.thiscoldef = '';
        vm.colkey = 'event';
        vm.colsubkey = '';
        vm.colsubkeys = [];
        vm.coldeflist = [];
        vm.eventtmp;
        vm.gcolumns =[];
        vm.loading = true; 
        vm.loadAttempted = false;
        vm.gridOptions={};
        vm.gridHistOptions={};
        vm.selectedStudents=[];
        vm.selected = false;
        vm.eventSelected = '';
        vm.eventlist=[];
        vm.Event = '';
        vm.EventType = '';
        vm.EventDate = '';
        vm.EventEnd = '';
        vm.EventStart = '';
        vm.Location = '';
        vm.ContactID = '';
        vm.EventInfo = {};


       vm.status = {
            opened: false
        };

        vm.listA = [
"contactID",	"number",	"TRUE",
"LastName",	"string",	"TRUE",
"FirstName",	"string",	"TRUE",
"Email",	"string",	"FALSE",
"Email2",	"string",	"FALSE",
"Parent",	"string",	"FALSE",
"Phone",	"string",	"FALSE",
"AltPhone",	"string",	"FALSE",
"Address",	"string",	"FALSE",
"City",	"string",	"FALSE",
"State",	"string",	"FALSE",
"ZIP",	"string",	"FALSE",
"Notes",	"string",	"FALSE",
"Newrank",	"string",	"FALSE",
"BeltSize",	"string",	"FALSE",
"CurrentRank",	"string",	"TRUE",
"InstructorPaymentFree",	"number",	"FALSE",
"ContactType",	"string",	"TRUE",
"include",	"boolean",	"FALSE",
"InstructorFlag",	"boolean",	"FALSE",
"quickbooklink",	"string",	"FALSE",
"instructorTitle",	"string",	"FALSE",
"testTime",	"string",	"FALSE",
"bdayinclude",	"boolean",	"FALSE",
"sex",	"string",	"FALSE",
"medicalConcerns",	"string",	"FALSE",
"GuiSize",	"string",	"FALSE",
"ShirtSize",	"string",	"FALSE",
"phoneExt",	"string",	"FALSE",
"altPhoneExt",	"string",	"FALSE",
"CurrentReikiRank",	"string",	"FALSE",
"StudentSchool",	"string",	"FALSE",
"EmergencyContact",	"string",	"FALSE",
"CurrentIARank",	"string",	"FALSE",
"ReadyForNextRank",	"number",	"FALSE",
"nextScheduledTest",	"string",	"FALSE",
"contactpictureurl",	"string",	"FALSE",
"nclassid",	"number",	"FALSE",
"nclass",	"string",	"FALSE",
"nclasssort",	"number",	"FALSE",
"nextClass",	"string",	"FALSE",
"rankForNextClass",	"string",	"FALSE",
"ageForNextClass",	"number",	"FALSE",
"pgrmcat",	"string",	"TRUE",
"classcat",	"string",	"TRUE",
"agecat",	"string",	"TRUE",
"classpictureurl",	"string",	"FALSE",
"PaymentClassName",	"string",	"FALSE",
"NumberOfMembers",	"string",	"FALSE",
"paymenttype",	"string",	"FALSE",
"PaymentNotes",	"string",	"FALSE",
"PaymentPlan",	"string",	"FALSE",
"PaymentAmount",	"number",	"FALSE",
"PriceSetby",	"string",	"FALSE",
"Pricesetdate",	"date",	"FALSE",
"rankid",	"number",	"FALSE",
"ranksortkey",	"number",	"FALSE",
"rankGroup",	"string",	"FALSE",
"rankalphasortkey",	"string",	"FALSE",
"age",	"number",	"TRUE",
"birthday",	"date",	"FALSE",
"lastpromoted",	"date",	"FALSE",
"testdate",	"date",	"FALSE",
"lastpaymentdate",	"date",	"FALSE",
"nextpaymentdate",	"date",	"FALSE"
];

        //vm.isChrome = /chrome/i.test(navigator.userAgent);

        $scope.$watch('vm.EventStart', function (value) {
            if (!value) return;
            vm.time = new Date(value.toISOString());
        }, true);

        $scope.$watch('vm.EventEnd', function (value) {
            if (!value) return;
            vm.time = new Date(value.toISOString());
        }, true);
      
      //  activate();

        function dateopen($event) {
            vm.status.opened = true;
        }

        function setLimit(thelimit) {
            $log.debug('setLimit',thelimit);
            vm.limit = thelimit;
        }

        function requery() {
            $log.debug('requery entered');
            vm.attending=[];
            refreshtheEvent();
        }

        function setActiveTab( activeTab ){
            $log.debug('set activetab as:', activeTab);
            EventServices.setActiveTab(activeTab);
        }

        function getActiveTab(){
            return EventServices.getActiveTab();
        }


        function activate() {
            setInitColDefs();
            $log.debug('activate setInitColDefs returned');
            getColDefList();
            setGridHistOptions();

        }
        
        function getFormattedDate(date) {
            var d3 = new Date(date);
          var year = d3.getFullYear();
          var month = (1 + d3.getMonth()).toString();
          month = month.length > 1 ? month : '0' + month;
          var day = d3.getDate().toString();
          day = day.length > 1 ? day : '0' + day;
          return year + '-' + month + '-' + day;
        }

        function getFormattedTime(date) {
            var d3 = new Date(date);
          var hour = addZero(d3.getHours());
          var min = addZero(d3.getMinutes());
          return hour + ':' + min ;
        }

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        function setEventInfo(info) {
            vm.EventInfo = info;
        }
        
        function createEvent(event) {
            if (vm.selected === false) {
                var error = "no rows selected for event";
                Notification.error({message: error, delay: 5000});
                return;                
            }
            
            var path = "../v1/eventregistration";

            var thedata = {
                Event: event,
                EventDate: getFormattedDate(vm.EventDate),
                EventType: vm.EventType,
                EventStart: getFormattedTime(vm.EventStart),
                EventEnd: getFormattedTime(vm.EventEnd),
                Location: vm.Location,
                selectedStudents: vm.selectedStudents
            };
            $log.debug('about createEvent ', path, thedata);
            return EventServices.createEvent(path, thedata)
                .then(function(data){
                    $log.debug('createEvent returned data');
                    $log.debug(data);
                    vm.thisEvent = data;
                    $log.debug(vm.thisEvent);
                    $log.debug(vm.thisEvent.message);
                    vm.message = vm.thisEvent.message;
                    Notification.success({message: vm.message, delay: 5000});
                    refreshtheEvent().then
                        (function(zdata) {
                         $log.debug('refreshtheEvent returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error refreshtheEvent after update:', error); 
                            vm.data = [];
                            vm.photos = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });

                    return vm.thisEvent;
                }).catch(function(e) {
                    $log.debug('createEvent failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }

        function refreshtheEvent() {
            $log.debug('refreshtheEvent entered ');

            var refreshpath = encodeURI('../v1/eventsource?thelimit=' + vm.limit );

            $log.debug('refreshtheEvent path:', refreshpath);
            
             return EventServices.getEventSource(refreshpath).then(function(data){
                    $log.debug('refreshEvents returned data');
                    $log.debug(data);
                    vm.gridOptions.data = data.EventsourceList; 
                    return vm.gridOptions.data;
                },
                function (error) {
                    $log.debug('Caught an error refreshtheEvent, going to notify:', error); 
                    vm.data = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vm.loading = false; 
                    vm.loadAttempted = true;
                }
                );

        }

        function getEventSource() {
            $log.debug('getEventSource entered');
            var refreshpath = encodeURI('../v1/eventsource');

            $log.debug('getEventSource path:', refreshpath);
            
             return EventServices.getEventSource(refreshpath).then(function(data){
                    $log.debug('getEventSource returned data');
                    $log.debug(data);
                    vm.data = data; 
                    return vm.data;
                },
                function (error) {
                    $log.debug('Caught an error eventsource:', error); 
                    vm.data = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vm.loading = false; 
                    vm.loadAttempted = true;
                }
                );

        }



        function getEventDetails(theevent) {
            $log.debug('getEventDetails entered:', theevent.event);
            var path = encodeURI('../v1/eventdetails?event=' + theevent.event);

            $log.debug('getEventDetails path:', path);
            
             return EventServices.getEventDetails(path).then(function(data){
                    $log.debug('getEventDetails returned data');
                    $log.debug(data);
                    vm.gridHistOptions.data = data.eventdetails; 
                    $log.debug("details",data.eventdetails[0]);
                    
                    vm.Event = data.eventdetails[0].Event;
                    vm.EventType = data.eventdetails[0].EventType;
                    vm.EventDate = data.eventdetails[0].EventDate;
                    vm.EventEnd = data.eventdetails[0].EventEnd;
                    vm.EventStart = data.eventdetails[0].EventStart;
                    vm.Location = data.eventdetails[0].Location;
                    vm.ContactID = data.eventdetails[0].ContactID;
                    
                    //check for empty set and do message
                    var messagetxt = "EventDetails obtained";
                    Notification.success({message: messagetxt, delay: 5000});
                    return;
                },
                function (error) {
                    $log.debug('Caught an error getEventDetails:', error); 
                    vm.data = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vm.loading = false; 
                    vm.loadAttempted = true;
                }
                );

        }

        function getEventNames(eventpartial) {
            $log.debug('getEventNames entered');
            var path = encodeURI('../v1/eventnames?eventpartial=' + eventpartial);

            $log.debug('getEventNames path:', path);
            
             return EventServices.getEventNames(path).then(function(data){
                    $log.debug('getEventNames returned data');
                    $log.debug(data);
                    vm.eventlist = data.eventlist; 
                    //check for empty set and do message
                    //messagetxt = "EventDetails obtained";
                    //Notification.success({message: messagetxt, delay: 5000});
                    return;
                },
                function (error) {
                    $log.debug('Caught an error getEventDetails:', error); 
                    vm.data = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vm.loading = false; 
                    vm.loadAttempted = true;
                }
                );

        }


        function setColDef(indata) {
            var path = "../v1/coldef";
            $log.debug('about setColDefs ', indata, path);
            return EventServices.setColDefs(path, indata)
                .then(function(data){
                    $log.debug('setColDefs returned data');
                    $log.debug(data);
                    vm.thiscoldef = data;
                    $log.debug(vm.thiscoldef);
                    $log.debug(vm.thiscoldef.message);
                    vm.message = vm.thiscoldef.message;
                    getColDefList();

                  
                }).catch(function(e) {
                    $log.debug('setColDefs failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }

        function changeColDef(colsubkey){
            $log.debug('changeColDef entered');
            if (isNewColDef(colsubkey)) {
                saveState();
            }
            getColDefs(vm.colsubkey).then(function(data) {
                //vm.gcolumns is filled
                $log.debug(" controller changeColDef returned with:",data, vm.colsubkey);
                $log.debug(" controller changeColDef vmstate is:", vm.state);

                 if (vm.state != {}) {
                     restoreState(vm.state);
                 }

             },function(error) {
                $log.debug('cols not stored:', error);
             });

             
        }
        
        function getColDefs(colsubkey) {
            $log.debug('getColDefs entered');
            var refreshpath = encodeURI('../v1/coldefs?colkey=' + 
                vm.colkey + "&colsubkey=" + colsubkey);
            var holdgcol = vm.gcolumns;
            
            $log.debug('getColDefs path:', refreshpath);

            if (colsubkey === null ) {
                error = "Nothing selected";
                return ($q.reject(error));
            }

             return EventServices.getColDefs(refreshpath).then(function(data){
                    $log.debug('EventServices in controller getColDefs returned data');
                    $log.debug(data);
                 //   vm.gcolumns = data.gcolumns[0][0]; 
                 //   $log.debug('EventServices in controller set gcolumns',vm.gcolumns);
                    vm.state = JSON.parse(data.gcolumns[0][0]);
                    $log.debug('EventServices in controller set vm.state',vm.state);
                    return vm.state;
                },
                function (error) {
                    $log.debug('Caught an error getColDefs:', error); 
                    vm.gcolumns = holdgcol;
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vm.loading = false; 
                    vm.loadAttempted = true;
                }
                );

        }
        
        function getColDefList() {
            $log.debug('getColDefList entered');
            var refreshpath = encodeURI('../v1/coldeflist?colkey=' + 
                vm.colkey );

            $log.debug('getColDefList path:', refreshpath);
            
             return EventServices.getColDefList(refreshpath).then(function(data){
                    $log.debug('getColDefList returned data');
                    $log.debug(data);
                    vm.colsubkeys = data.colsubkeys; 
                    return vm.data;
                },
                function (error) {
                    $log.debug('Caught an error getColDefList:', error); 
                    vm.colsubkeys = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                }).
                finally(function () { 
                    vm.loading = false; 
                    vm.loadAttempted = true;
                }
                );

        }
        



        function setInitColDefs() {
            vm.gcolumns = [];
            vm.colsubkey="Default";

            //if they are saved, then get those, otherwise default 
            getColDefs(vm.colsubkey).then(function(data) {
                //vm.gcolumns is filled
                $log.debug(" controller getColDefs returned with:",data, vm.colsubkey);
                $log.debug(" controller getColDefs vmstate is:", vm.state);

        //         setGridOptions();


             },function(error) {
                $log.debug('cols not stored:', error);
    

             });

                var coldef ={};
                $log.debug('setGridOptions col count', vm.listA.length);

                var defnumfilter = 
                    [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN,
                          placeholder: '> than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN,
                          placeholder: '< than'
                        }
                      ];
                var filt=[];
                for (var i=0, len = vm.listA.length; i < len; i += 3) {
                    //$log.debug('vis', vm.listA[i+2]);
                    var val = (vm.listA[i+2].toLowerCase() === "true");
                    //$log.debug('vis', val);
                    var agg = (
                        vm.listA[i+1] === "number" ? uiGridConstants.aggregationTypes.avg :
                        vm.listA[i+1] === "string" ? uiGridConstants.aggregationTypes.count :
                        vm.listA[i+1] === "date" ? uiGridConstants.aggregationTypes.min :
                        vm.listA[i+1] === "boolean" ? uiGridConstants.aggregationTypes.count :
                         uiGridConstants.aggregationTypes.count
                        );
                    //$log.debug('agg', agg);
                    if (vm.listA[i+1] === "number" ) {
                        filt =   [
                            {
                              condition: uiGridConstants.filter.GREATER_THAN,
                              placeholder: '> than'
                            },
                            {
                              condition: uiGridConstants.filter.LESS_THAN,
                              placeholder: '< than'
                            }
                          ];
                    } else if (vm.listA[i+1] === "string" ) {
/*  constants.js
      GREATER_THAN: 32,
      GREATER_THAN_OR_EQUAL: 64,
      LESS_THAN: 128,
      LESS_THAN_OR_EQUAL: 256,
      NOT_EQUAL: 512,
      SELECT: 'select',
      INPUT: 'input'
      */
                        filt =   [
                            {
                              condition: uiGridConstants.filter.STARTS_WITH,
                              placeholder: 'Starts with'
                            },
                            {
                              condition: uiGridConstants.filter.ENDS_WITH,
                              placeholder: 'Ends with'
                            },
                            {
                              condition: uiGridConstants.filter.CONTAINS,
                              placeholder: 'Contains'
                            },
                            {
                              condition: uiGridConstants.filter.EXACT,
                              placeholder: 'Exactly'
                            }
                          ];

                    } else if (vm.listA[i+1] === "date" ) {
                    /*  not working, need to create custom filter  
                        filt =   [
                            {
                              condition: uiGridConstants.filter.GREATER_THAN,
                              placeholder: '> than'
                            },
                            {
                              condition: uiGridConstants.filter.LESS_THAN,
                              placeholder: '< than'
                            }
                          ];
                        */ filt = "";
                    } else {
                        filt = "";
                    }
                    
                  //  $log.debug('filt', filt);

                    coldef = {
                              field: vm.listA[i], 
                               type: vm.listA[i+1],
                            visible: val,
                    enableFiltering: true, 
                    aggregationType: agg,
                            filters: filt,
                    headerCellClass: vm.highlightFilteredHeader, 
                     enableCellEdit: false };
                    
                    vm.gcolumns.push(coldef);
                    
                }
                $log.debug('gcolumns in coldefs', vm.gcolumns);

             setGridOptions();

            refreshtheEvent().then(function(zdata) {
                 $log.debug('refreshtheEvent returned', zdata);
             if (vm.state != {}) {
                 restoreState(vm.state);
             }
             });
             

        }
 
        function isNewColDef(theevent){
            $log.debug('isNewColDef', theevent);
            var isnew = true;
            for (var i=0, len=vm.colsubkeys.length; i < len; i++) {
              //  $log.debug('isNewColDef colsubkey:', vm.colsubkeys[i]);
                if (vm.colsubkeys[i] == theevent) {
                    $log.debug('isfound');
                    isnew = false;
                    break;
                }
            }
            return isnew;
        }
        
        function saveState() {
            vm.state = vm.gridApi.saveState.save();
            $log.debug('state', vm.state);
            var thedata={
                colkey: vm.colkey,
                colsubkey: vm.colsubkey,
                colcontent: vm.state
            };
            
            setColDef(thedata);
        }
 
        function restoreState(thestate) {
            vm.gridApi.saveState.restore( $scope, thestate );
            $log.debug('state', thestate);
        }
        
        function setGridOptions() {

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
                exporterPdfDefaultStyle: {fontSize: 9},
                exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
                exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
                exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
                exporterPdfFooter: function ( currentPage, pageCount ) {
                  return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function ( docDefinition ) {
                  docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                  docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                  return docDefinition;
                },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 500,
                
                onRegisterApi: function(gridApi) {
                    $log.debug('vm gridapi onRegisterApi');
                     vm.gridApi = gridApi;

                    gridApi.selection.on.rowSelectionChanged($scope,function(row){
                        var msg = 'row selected ' + row.entity.ContactID;
                        $log.debug(msg);

                        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                        $log.debug('selected', selectedStudentarr);
                        setSelectedArray(selectedStudentarr);
                        
                    });
                    gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                        $log.debug("batch");  
                        //note this will send the list of changed rows
                    /*    var selectedContacts=[];
                        for (var index=0, len=rows.length; index < len; index++) {
                            $log.debug("selected?",rows[index].isSelected);
                            if (rows[index].isSelected === true) {
                                selectedContacts.push(rows[index].entity);
                            }
                        }
                        $log.debug("batch", selectedContacts);
                        setSelectedArray(selectedContacts);
                        */
                        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                        $log.debug('batch selected', selectedStudentarr);
                        setSelectedArray(selectedStudentarr);

                    });


                    }
            };

            $log.debug('setGridOptions gcolumns', vm.gcolumns);
            $log.debug('setGridOptions gridOptions', vm.gridOptions);

        }

        function setGridHistOptions() {

            vm.gridHistOptions = {
                enableFiltering: true,
                paginationPageSizes: vm.limits,
                paginationPageSize: 10,
            columnDefs: [
                // default

                {
                    field: 'LastName',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'FirstName',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'ContactID',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'Attended',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'Ordered',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'Paid',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'ShirtSize',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'Notes',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'Include',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'Email',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Email2',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Parent',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'StudentSchool',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Event',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'EventType',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'EventEnd',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'EventStart',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'Location',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }],

                //rowHeight: 15,
                showGridFooter: true,
                enableColumnResizing: true,
                enableGridMenu: true,
                showColumnFooter: true,
                exporterCsvFilename: 'eventhist.csv',
                exporterPdfDefaultStyle: {fontSize: 9},
                exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
                exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
                exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
                exporterPdfFooter: function ( currentPage, pageCount ) {
                  return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function ( docDefinition ) {
                  docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                  docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                  return docDefinition;
                },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 500,
                
                onRegisterApi: function(gridHistApi) {
                    $log.debug('vm gridapi onRegisterApi');
                     vm.gridHistApi = gridHistApi;

                    gridHistApi.selection.on.rowSelectionChanged($scope,function(row){
                        var msg = 'gridhist row selected ' + row.entity;
                        $log.debug(msg);

                //        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                 //       $log.debug('selected', selectedStudentarr);
                 //       setSelectedArray(selectedStudentarr);
                        
                    });
                    gridHistApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                        $log.debug("gridhist batch");  
                        //note this will send the list of changed rows
                    /*    var selectedContacts=[];
                        for (var index=0, len=rows.length; index < len; index++) {
                            $log.debug("selected?",rows[index].isSelected);
                            if (rows[index].isSelected === true) {
                                selectedContacts.push(rows[index].entity);
                            }
                        }
                        $log.debug("batch", selectedContacts);
                        setSelectedArray(selectedContacts);
                        */
                //        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                //        $log.debug('batch selected', selectedStudentarr);
                //        setSelectedArray(selectedStudentarr);

                    });
                    gridHistApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
                        $log.debug('rowEntity');
                        $log.debug(rowEntity);
                        //Alert to show what info about the edit is available
                        $log.debug('Column: ' + colDef.name  + 
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue    );
                        if (newValue != oldValue) {
                            updateEvent(colDef,newValue,rowEntity);       
                        }
                    });

                    }
            };

            $log.debug('setGridHistOptions gridOptions', vm.gridHistOptions);

        }
        function updateEvent(colDef, newValue,rowEntity) {
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
            
            $log.debug('about updateEvent ', indata, path);
            
            return EventServices.updateEvent(path, indata)
                .then(function(data){
                    $log.debug('updateEvent returned data');
                    $log.debug(data);
                    vm.thiscoldef = data;
                    $log.debug(vm.thiscoldef);
                    $log.debug(vm.thiscoldef.message);
                    vm.message = vm.thiscoldef.message;
                  
                }).catch(function(e) {
                    $log.debug('updateEvent failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });

        }
        
        function setSelectedArray(inputArray) {
            vm.selectedStudents = [];
            
            if (inputArray.length > 0){
                vm.selected = true;
                for(var i=0,len=inputArray.length;i < len;i++){
                    var info = {
                        ContactID: inputArray[i].ContactID,
                        Paid: "",
                        ShirtSize: "",
                        Notes: "",
                        Include: "",
                        Attended: "",
                        Ordered: ""
                    };
                    vm.selectedStudents.push(info);
                }
            } else {
                vm.selected = false;
                return;
            }

            $log.debug("setarray", vm.selectedStudents);
            
        }


        function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }


    }

})();
