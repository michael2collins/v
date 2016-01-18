(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('EventTableBasicController', EventTableBasicController);

    EventTableBasicController.$inject = [
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
    'uiGridGroupingConstants'
    ];

    function EventTableBasicController($routeParams, $log, EventServices, $location, $window, $q, $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants) {
        /* jshint validthis: true */

        var vm=this;
        
        vm.refreshtheEvent = refreshtheEvent;
        vm.getEventSource = getEventSource;
        vm.getColDefList = getColDefList;
        vm.saveState = saveState;
        vm.restoreState = restoreState;
        vm.setLimit = setLimit;
        vm.getActiveTab = getActiveTab;
        vm.setActiveTab = setActiveTab;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.limit = 0;
        vm.limits = [10,20,50,100,200,500,5000];
        vm.data = [];
        vm.state = {};


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

        setInitColDefs();
        setGridOptions();

        activate();

        function setLimit(thelimit) {
            $log.debug('setLimit',thelimit);
            vm.limit = thelimit;
        }

        function requery() {
            $log.debug('requery entered');
            vm.attending=[];
            refreshtheEvent();
        }

        function activate() {

             refreshtheEvent().then(function(zdata) {
                 $log.debug('refreshtheEvent returned', zdata);
             });
        }
        
        function updateEvent(card) {
            var updpath = "../v1/updateEvent";
            $log.debug('about updateEvent ', card, updpath);
            return EventServices.updateEvent(updpath, card)
                .then(function(data){
                    $log.debug('updateEvent returned data');
                    $log.debug(data);
                    vm.thisEvent = data;
                    $log.debug(vm.thisEvent);
                    $log.debug(vm.thisEvent.message);
                    vm.message = vm.thisEvent.message;
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
                    $log.debug('updateEvent failure:');
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
//            var pclass = vm.theclass.length > 0 ? vm.theclass : 'NULL';
//            $log.debug('pclass:', pclass);
            
//            var refreshpath = encodeURI('../v1/eventsource?thedow=' + vm.dowChoice + '&thelimit=' + vm.limit + '&theclass=' + pclass);
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

        function getColDefs(colsubkey) {
            $log.debug('getColDefs entered');
            var thisgrid = 'eventsource';
            var refreshpath = encodeURI('../v1/getcoldefs?colkey=' + 
                thisgrid + "&colsubkey=" + colsubkey);

            $log.debug('getColDefs path:', refreshpath);

            if (colsubkey === null ) {
                error = "Nothing selected";
                return ($q.reject(error));
            }

             return EventServices.getColDefs(refreshpath).then(function(data){
                    $log.debug('getColDefs returned data');
                    $log.debug(data);
                    vm.data = data; 
                    return vm.data;
                },
                function (error) {
                    $log.debug('Caught an error getColDefs:', error); 
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
        function getColDefList() {
            $log.debug('getColDefList entered');
            var thisgrid = 'eventsource';
            var refreshpath = encodeURI('../v1/getcoldefs?colkey=' + 
                thisgrid + "&colsubkey=" + colsubkey);

            $log.debug('getColDefList path:', refreshpath);
            
             return EventServices.getColDefList(refreshpath).then(function(data){
                    $log.debug('getColDefList returned data');
                    $log.debug(data);
                    vm.data = data; 
                    return vm.data;
                },
                function (error) {
                    $log.debug('Caught an error getColDefList:', error); 
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
        

        function setActiveTab( activeTab ){
            $log.debug('set activetab as:', activeTab);
            EventServices.setActiveTab(activeTab);
        }

        function getActiveTab(){
            return EventServices.getActiveTab();
        }


        function setInitColDefs() {
            vm.gcolumns = [];

            //if they are saved, then get those, otherwise default 
            getColDefs("Default").then(function(data) {
                //vm.gcolumns is filled
                vm.gcolumns = data;
                
             },function(error) {
                $log.debug('cols not stored:', error);
    
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
                    
                    $log.debug('filt', filt);

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
             });
            
        }
 
 /*
       onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
        $timeout(function() {
        	$scope.defaultState = $scope.gridApi.saveState.save();
        }, 50);
        $timeout(function() {
          $scope.restoreState();
        }, 100);
      },
    };
    $scope.state = {};
    $scope.saveState = function() {
      $scope.state = $scope.gridApi.saveState.save();
      console.log($scope.state);
      localStorage.setItem("reportTravelersState", JSON.stringify($scope.state));
    };
    $scope.restoreState = function() {
      $scope.gridApi.saveState.restore($scope, JSON.parse(localStorage.getItem("reportTravelersState")));
    };
    $scope.resetState = function() {
      $scope.gridApi.saveState.restore($scope, $scope.defaultState);
    };
 */
 
        function saveState() {
            vm.state = vm.gridApi.saveState.save();
            $log.debug('state', vm.state);
        }
 
        function restoreState() {
            vm.gridApi.saveState.restore( $scope, vm.state );
            $log.debug('state', vm.state);
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
                    }
            };

            $log.debug('gcolumns', vm.gcolumns);
            $log.debug('gridOptions', vm.gridOptions);
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
