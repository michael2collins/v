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
    'Notification'
    ];

    function EventTableBasicController($routeParams, $log, EventServices, $location, $window, $q, $scope, $route, Notification) {
        /* jshint validthis: true */

        var vm=this;
        
        vm.refreshtheEvent = refreshtheEvent;
        vm.getEventSource = getEventSource;
        vm.getColDefList = getColDefList;
        vm.setLimit = setLimit;
        vm.getActiveTab = getActiveTab;
        vm.setActiveTab = setActiveTab;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.limit = 0;
        vm.limits = [10,20,50,100,200,500];
        vm.data = [];

        vm.listA = [
"FirstName",
"Email",
"Email2",
"Parent",
"Phone",
"AltPhone",
"Address",
"City",
"State",
"ZIP",
"Notes",
"Newrank",
"BeltSize",
"CurrentRank",
"InstructorPaymentFree",
"ContactType",
"include",
"InstructorFlag",
"quickbooklink",
"instructorTitle",
"testTime",
"bdayinclude",
"sex",
"medicalConcerns",
"GuiSize",
"ShirtSize",
"phoneExt",
"altPhoneExt",
"CurrentReikiRank",
"StudentSchool",
"EmergencyContact",
"CurrentIARank",
"ReadyForNextRank",
"nextScheduledTest",
"contactpictureurl",
"nclassid",
"nclass",
"nclasssort",
"nextClass",
"rankForNextClass",
"ageForNextClass",
"pgrmcat",
"classcat",
"agecat",
"classpictureurl",
"PaymentClassName",
"NumberOfMembers",
"paymenttype",
"PaymentNotes",
"PaymentPlan",
"PaymentAmount",
"PriceSetby",
"Pricesetdate",
"rankid",
"ranksortkey",
"rankGroup",
"rankalphasortkey",
"age",
"birthday",
"lastpromoted",
"testdate",
"lastpaymentdate",
"nextpaymentdate"            
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

                for (var i=0, len = vm.listA.length; i < len; i++) {
    
                    coldef = {
                              field: vm.listA[i], 
                    enableFiltering: true, 
                    headerCellClass: vm.highlightFilteredHeader, 
                     enableCellEdit: false };
                    
                    vm.gcolumns.push(coldef);
                    
                }
                $log.debug('gcolumns in coldefs', vm.gcolumns);
             });
            
        }
        
        function setGridOptions() {

            vm.gridOptions = {
                enableFiltering: true,
                paginationPageSizes: [25, 50, 75],
                paginationPageSize: 25,
                columnDefs: vm.gcolumns,
                rowHeight: 15,
                showGridFooter: true,
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
