(function() {
    'use strict';

    angular
        .module('ngadmin')
        .filter('mapEventType', mapEventType)
        .controller('EventController', EventController);

    EventController.$inject = [
    '$routeParams',
    '$log',
    'EventServices',
    'TournamentServices',
    '$location',
    '$window',
    '$q',
    '$scope',
    '$route',
    'Notification',
    'uiGridConstants',
    'uiGridGroupingConstants',
    '$timeout',
    '_'
    ];

    function mapEventType() {
          var EventTypeHash = {
            'Two Events': 'Two Events',
            'Three Events': 'Three Events'
          };        
         return function(input) {
            if (!input){
              return '';
            } else {
              return EventTypeHash[input];
            }
          };
    }
    
    function EventController($routeParams, $log, EventServices, TournamentServices, $location, $window, $q, $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants, $timeout, _) {
        /* jshint validthis: true */

        var vm=this;
        
        vm.refreshtheEvent = refreshtheEvent;
        vm.getEventDetails = getEventDetails;
        vm.updateEvent = updateEvent;
        vm.isSelected = isSelected;
        vm.isRegistered = isRegistered;
        vm.getEventNames = getEventNames;
        vm.setEventInfo = setEventInfo;
        vm.register = register;
        vm.notify = notify;
        vm.dateopen = dateopen;
        vm.setLimit = setLimit;
        vm.createEvent = createEvent;
        vm.getActiveTab = getActiveTab;
        vm.setActiveTab = setActiveTab;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.showMe = showMe;
        vm.registerMe = registerMe;
        vm.showregister = showregister;
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
        vm.discount = "notfound";
        vm.gcolumns =[];
        vm.loading = true; 
        vm.loadAttempted = false;
        vm.gridOptions={};
        vm.gridHistOptions={};
        vm.gridTournamentOptions={};
        vm.selectedStudents=[];
        vm.registeredStudents=[];
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
        vm.thisEvent = {};
        vm.eventdefaultKata = false;
        vm.eventdefaultSparring = false;
        vm.eventdefaultWeapons = false;
        vm.eventfieldKata = 'EventTypeKata';
        vm.eventfieldSparring = 'EventTypeSparring';
        vm.eventfieldWeapons = 'EventTypeWeapons';
        vm.eventfieldname = 'EventType';
        vm.eventarray = [
          { id: 'Two Events - Sparring/Kata', EventType: 'Two Events - Sparring/Kata' },
          { id: 'Two Events - Sparring/Weapons', EventType: 'Two Events - Sparring/Weapons' },
          { id: 'Two Events - Kata/Weapons', EventType: 'Two Events - Kata/Weapons' },
          { id: 'Three Events - Kata/Sparring/Weapons', EventType: 'Three Events - Kata/Sparring/Weapons' }
        ];

function getmyFormattedDate(date) {
    $log.log("getmyformatted date",date);
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return month + '/' + day + '/' + year;
}

var earlydateFrom = "01/28/2017";
var earlydateTo = "02/19/2017";
var stddateFrom = "02/19/2017";
var stddateTo = "03/10/2017";
var latedateFrom = "03/10/2017";
var latedateTo = "03/19/2017";
var dateCheck = getmyFormattedDate(new Date());
// to test
//dateCheck = "03/16/2017";

var earlyd1 = earlydateFrom.split("/");
var earlyd2 = earlydateTo.split("/");
var stdd1 = stddateFrom.split("/");
var stdd2 = stddateTo.split("/");
var lated1 = latedateFrom.split("/");
var lated2 = latedateTo.split("/");


var c = dateCheck.split("/");
//year, month, day
var earlyfrom = new Date(earlyd1[2], parseInt(earlyd1[0],10)-1, earlyd1[1]);  // -1 because months are from 0 to 11
var earlyto   = new Date(earlyd2[2], parseInt(earlyd2[0],10)-1, earlyd2[1]);
var stdfrom = new Date(stdd1[2], parseInt(stdd1[0],10)-1, stdd1[1]);  // -1 because months are from 0 to 11
var stdto   = new Date(stdd2[2], parseInt(stdd2[0],10)-1, stdd2[1]);
var latefrom = new Date(lated1[2], parseInt(lated1[0],10)-1, lated1[1]);  // -1 because months are from 0 to 11
var lateto   = new Date(lated2[2], parseInt(lated2[0],10)-1, lated2[1]);


var check = new Date(c[2], parseInt(c[0])-1, c[1]);

 //       vm.discount="test";

    if (check >= earlyfrom && check <= earlyto) {
        $log.log("inside the early range",check, earlyfrom, earlyto);
        vm.discount="earlybird";

    } else if(check > stdfrom && check <= stdto) {
        $log.log("inside the std range",check, stdfrom, stdto);
        vm.discount="regular";        
    } else if(check > latefrom && check <= lateto) {
        $log.log("inside the late range",check, latefrom, lateto);
        vm.discount="late";
    } else {
        $log.log("not inside  range",check, earlyfrom, lateto);
        vm.discount="notfound";        
    }
    

        vm.twoeventpay50="FK26Y8JHFF69W";
        vm.twoeventpay60="EGHLJJYUAW6JA";
        vm.twoeventpay70="PK7AC8ZRE835Q";
        vm.twoeventpay80="6TJMHCE4AZZ76";


        vm.twoeventpay55="VFCXLKYZHE2UE";
        vm.twoeventpay65="YUM4T83Q96FKJ";
        vm.twoeventpay75="GXLJ6EXS9SSCU";

        vm.threeeventpay60="7PFKFJ7K8LHBU";
        vm.threeeventpay90="7XWV5FXKAMFEN";

        vm.threeeventpay65="UP8TNHE79WGXS";
        vm.threeeventpay75="NXTPDHU5WMXBA";
        vm.threeeventpay85="5G8DNQXFVHA78";
        vm.threeeventpay95="9GS9758EJKV7A";


        vm.onedollar="H8LTYBEGHD6GJ";
        
        vm.getvalue = getvalue;
        
        
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
"BeltSize",	"string",	"FALSE",
"InstructorPaymentFree",	"number",	"FALSE",
"ContactType",	"string",	"TRUE",
"include",	"boolean",	"FALSE",
"quickbooklink",	"string",	"FALSE",
"instructorTitle",	"string",	"FALSE",
"bdayinclude",	"boolean",	"FALSE",
"sex",	"string",	"FALSE",
"medicalConcerns",	"string",	"FALSE",
"GuiSize",	"string",	"FALSE",
"ShirtSize",	"string",	"FALSE",
"phoneExt",	"string",	"FALSE",
"altPhoneExt",	"string",	"FALSE",
"StudentSchool",	"string",	"FALSE",
"EmergencyContact",	"string",	"FALSE",
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
      
        activate();

        function isSelected() {
            return vm.selectedStudents.length > 0 && vm.eventSelected !== null;
        }

        function isRegistered() {
            return vm.registeredStudents.length > 0;
        }
        
        function dateopen($event) {
            vm.status.opened = true;
        }

        function setLimit(thelimit) {
            $log.log('setLimit',thelimit);
            vm.limit = thelimit;
        }
        
        function notify(msg,type) {
            if (type == "success") {
                Notification.success({message: msg, delay: 5000});
            } else {
                Notification.error({message: msg, delay: 5000});
            }
        }
        
//        function requery() {
//            $log.log('requery entered');
//            vm.attending=[];
//            refreshtheEvent();
//        }


        function setActiveTab( activeTab, thecaller ){
            $log.log('set activetab as:', activeTab, thecaller);
            EventServices.setActiveTab(activeTab, thecaller);
        }

        function getActiveTab(){
            var atab =  EventServices.getActiveTab();
            $log.log('get activetab is:', atab);
            return atab;
        }

/*        function activateorig() {
            setInitColDefs();
            $log.log('activate setInitColDefs returned');
            getColDefList();
            setGridHistOptions();

        }
  */      
        function activate() {
            $log.log('activate entered');
            setGridTournamentOptions();
            setGridPaymentOptions();
            getEventNames('').then(function() {
                getAllStudents().then(function() {
                    $log.log('activate get all students');
                    getEventDetails().then(function(){
                        $log.log('activate eventdetails fetched');
                    });
                });
                
            });
            
        }

        function getvalue(numevents) {
            if (vm.discount == "earlybird" && numevents == 2) {
                return vm.twoeventpay60;                
            } else if (vm.discount == "regular" && numevents == 2) {
                return vm.twoeventpay70;
            } else if (vm.discount == "late" && numevents == 2) {
                return vm.twoeventpay80;
            } else if (vm.discount == "test" && numevents == 2) {
                return vm.onedollar;
            } 
            if (vm.discount == "earlybird" && numevents == 3) {
                return vm.threeeventpay75;
            } else if (vm.discount == "regular" && numevents == 3) {
                return vm.threeeventpay85;
            } else if (vm.discount == "late" && numevents == 3) {
                return vm.threeeventpay95;
            } else if (vm.discount == "test" && numevents == 3) {
                return vm.onedollar;
            } 
            return "error";
        }

        function getAllStudents() {
            $log.log('TournamentServices getAllStudents entered');
//            var path = '../v1/eventsource';
            var path = encodeURI('../v1/eventsource?eventname=' + vm.eventSelected );
            
            $log.log('getAllStudents path:', path);

            return TournamentServices.getAllStudents(path).then(function(data){
                   $log.log('getAllStudents returned data', data);
                   if (data.EventsourceList.length > 0 ) {
                    addExtraData(data.EventsourceList); 
                   }
                //   addExtraData(data.EventsourceList, vm.eventfieldSparring);
                //   addExtraData(data.EventsourceList, vm.eventfieldWeapons);
                    vm.gridTournamentOptions.data = data.EventsourceList;

                    return vm.gridTournamentOptions.data;
                },
                function (error) {
                    $log.log('Caught an error getAllStudents, going to notify:', error); 
                    vm.gridTournamentOptions.data = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return (error);
                });
                
        }

        function addExtraData(data){
           $log.log('addExtraData entered', data);
            for (var i=0, len=data.length;i < len;i++ ) {
                $log.log('eventtype in addExtraData',data[i].EventType);
                $log.log('kata',data[i].EventTypeKata);
                $log.log('Weapons',data[i].EventTypeWeapons);
                $log.log('Sparring',data[i].EventTypeSparring);
                
//                if (data[i].EventType === "NULL" && data[i][fieldname] == vm.eventfieldKata ) {
                if ( data[i].EventType === "NULL" ) {
                    $log.log('def Kata');
                    data[i].EventTypeKata = vm.eventdefaultKata ;
                    data[i].EventTypeSparring = vm.eventdefaultSparring ;
                    data[i].EventTypeWeapons = vm.eventdefaultWeapons ;
                } else {
                    $log.log('not def');
                     if (data[i].EventType.indexOf('Kata:1') > -1){
                         data[i].EventTypeKata = true;
                     }
                     if (data[i].EventType.indexOf('Kata:NULL') > -1){
                         data[i].EventTypeKata = false;
                     }  
                     if (data[i].EventType.indexOf('Sparring:1') > -1){
                         data[i].EventTypeSparring = true;
                     }
                     if (data[i].EventType.indexOf('Sparring:NULL') > -1){
                         data[i].EventTypeSparring = false;
                     }  

                     if (data[i].EventType.indexOf('Weapons:1') > -1){
                         data[i].EventTypeWeapons = true;
                     }
                     if (data[i].EventType.indexOf('Weapons:NULL') > -1){
                         data[i].EventTypeWeapons = false;
                         
                     }
                }
            }
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
            $log.log('setEventInfo', vm.EventInfo);
        }
        
        function registerall() {
            var thedata = {
                Event: vm.eventSelected.event,
                EventDate: vm.eventSelected.EventDate,
                EventStart: vm.eventSelected.EventStart,
                EventEnd: vm.eventSelected.EventEnd,
                Location: vm.eventSelected.Location,
                selectedStudents: vm.selectedStudents
            };
            $log.log('register entered', thedata);
            createEvent(thedata).then(function(){
                getEventDetails();
            }
            );
        }
        function register() {
            var thedata = {
                Event: vm.EventInfo.event,
                EventDate: vm.EventInfo.EventDate,
                EventStart: vm.EventInfo.EventStart,
                EventEnd: vm.EventInfo.EventEnd,
                Location: vm.EventInfo.Location,
                selectedStudents: vm.selectedStudents
            };
            $log.log('register entered', thedata);
            createEvent(thedata).then(function(){
                getAllStudents().then(function() {
                    $log.log('activate get all students');
                    getEventDetails().then(function(){
                        $log.log('register eventdetails fetched');
                    });
                });
            });
        }
        
        function createEvent(thedata) {
            if (vm.selected === false) {
                var error = "no rows selected for event";
                Notification.error({message: error, delay: 5000});
                return;                
            }
            
            var path = "../v1/eventregistration";

            $log.log('about createEvent ', path, thedata);
            return EventServices.createEvent(path, thedata)
                .then(function(data){
                    $log.log('createEvent returned data');
                    $log.log(data);
                    vm.thisEvent = data;
                    $log.log(vm.thisEvent);
                    $log.log(vm.thisEvent.message);
                    vm.message = vm.thisEvent.message;
                   // Notification.success({message: vm.message, delay: 5000});

                    return vm.thisEvent;
                }).catch(function(e) {
                    $log.log('createEvent failure:');
                    $log.log("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }

        function refreshtheEvent() {
            $log.log('refreshtheEvent entered ');

            var refreshpath = encodeURI('../v1/eventsource?eventname=' + vm.eventSelected + 'thelimit=' + vm.limit );

            $log.log('refreshtheEvent path:', refreshpath);
            
             return EventServices.getEventSource(refreshpath).then(function(data){
                    $log.log('refreshEvents returned data');
                    $log.log(data);
                    vm.gridOptions.data = data.EventsourceList; 
                    return vm.gridOptions.data;
                },
                function (error) {
                    $log.log('Caught an error refreshtheEvent, going to notify:', error); 
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

 

        function onlyUniqueContactID(value, index, self) { 
            $log.log('onlyUnique',value.ContactID, index, self, self.indexOf(value));
            var test=self.ContactID;
            $log.log(test);
            return test.indexOf(value.ContactID) == index;
        }

        function getEventDetails() {
            $log.log('getEventDetails entered:');
            var path = encodeURI('../v1/eventdetails?eventname=' + vm.eventSelected);

            
            $log.log('getEventDetails path:', path);
            
             return EventServices.getEventDetails(path).then(function(data){
                    $log.log('getEventDetails returned data');
                    $log.log(data);
                    vm.gridPaymentOptions.data = data.eventdetails; 
                    var registeredStudentsarr = [];
                    var registeredStudentsInfo = {};
                    for (var i=0,len=data.eventdetails.length; i < len;i++){
                        $log.log('push to registeredStudentsarr',data.eventdetails[i].ContactID);
                        registeredStudentsInfo = {
                            LastName: data.eventdetails[i].LastName,
                            FirstName: data.eventdetails[i].FirstName,
                            ContactID: data.eventdetails[i].ContactID
                        };
                        registeredStudentsarr.push(registeredStudentsInfo);
                    }
                //    vm.registeredStudents = registeredStudentsarr.filter(onlyUniqueContactID);
                    vm.registeredStudents = _.uniq(registeredStudentsarr, false, function(p){return p.ContactID});
                    $log.log("details",data.eventdetails[0]);
                    
                    //check for empty set and do message
                    var messagetxt = "EventDetails obtained";
                 //   Notification.success({message: messagetxt, delay: 5000});
                    return;
                },
                function (error) {
                    $log.log('Caught an error getEventDetails:', error); 
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
            $log.log('getEventNames entered');
            var path = encodeURI('../v1/eventnames?eventpartial=' + eventpartial);

            $log.log('getEventNames path:', path);
            
             return EventServices.getEventNames(path).then(function(data){
                    $log.log('getEventNames returned data');
                    $log.log(data);
                    vm.eventlist = data.eventlist; 
                    $log.log('default eventlist', vm.eventlist[0].event);
                    
                    vm.eventSelected = vm.eventlist[0].event;
                    
                    vm.setEventInfo(vm.eventlist[0]);
                    
                    //check for empty set and do message
                    //messagetxt = "EventDetails obtained";
                    //Notification.success({message: messagetxt, delay: 5000});
                    return;
                },
                function (error) {
                    $log.log('Caught an error getEventDetails:', error); 
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
                ordered: rowEntity.Ordered,
                invoice: rowEntity.invoice
            };
            
            $log.log('about updateEvent ', indata, path);
            
            return EventServices.updateEvent(path, indata)
                .then(function(data){
                    $log.log('updateEvent returned data');
                    $log.log(data);
                    vm.thiscoldef = data;
                    $log.log(vm.thiscoldef);
                    $log.log(vm.thiscoldef.message);
                    vm.message = vm.thiscoldef.message;
                  
                }).catch(function(e) {
                    $log.log('updateEvent failure:');
                    $log.log("error", e);
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
                        EventType: 
                            {
                            'Kata': inputArray[i].EventTypeKata, 
                            'Sparring': inputArray[i].EventTypeSparring, 
                            'Weapons': inputArray[i].EventTypeWeapons 
                            }  ,
                        Paid: "0",
                        ShirtSize: "",
                        Notes: "",
                        Include: "1",
                        Attended: "",
                        Ordered: "",
                        invoice: ""
                    };
                    vm.selectedStudents.push(info);
                }
            } else {
                vm.selected = false;
                return;
            }

            $log.log("setarray", vm.selectedStudents);
            
        }


        function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }
        function showMe(rowEntity){
             $log.log("showMe", rowEntity);
            //               alert(vm.EventTypeWeapons);
        
             // vm.gridApi.selection.toggleRowSelection(vm.gridTournamentOptions.data[0]);
            var selectedStudentarr = [];
            selectedStudentarr.push(rowEntity);
            setSelectedArray(selectedStudentarr);
        }
        
        function registerMe(rowEntity){
             $log.log("registerMe", rowEntity);

            var eventcnt = 0;
            rowEntity.EventTypeWeapons ? eventcnt += 1: eventcnt += 0;
            rowEntity.EventTypeKata ? eventcnt += 1: eventcnt += 0;
            rowEntity.EventTypeSparring ? eventcnt += 1: eventcnt += 0;
            $log.log("registerMe count", eventcnt);
//knife
//          if (eventcnt <= 1){
//medway
            if (Number(eventcnt) < Number(2)){
                var msg="You only signed up for " + eventcnt + " events. Please add one more";                               notify(msg,"error");
            } else {

                var selectedStudentarr = [];
                selectedStudentarr.push(rowEntity);
                setSelectedArray(selectedStudentarr);
                register();
            }
        }
        function showregister(rowEntity) {
    //         $log.log("showregister", rowEntity);
            return rowEntity.Include == 1;
        }        
        function showpaid(rowEntity) {
    //         $log.log("showregister", rowEntity);
            return rowEntity.Paid == 1;
        }        
        
        function setGridTournamentOptions() {

            var ctpl ='<div ng-hide="col.grid.appScope.showregister(row.entity)"> <button class="btn btn-green primary"  ng-click="col.grid.appScope.registerMe(row.entity)">Register</button></div><div ng-show="col.grid.appScope.showregister(row.entity)">Registered - goto Payment</div>' ;


            vm.gridTournamentOptions = {
                enableFiltering: true,
                paginationPageSizes: vm.limits,
                paginationPageSize: 10,
            columnDefs: [
                // default

                {
                    field: 'LastName',
                    enableCellEdit: false,
                    enableFiltering: false
                }, {
                    field: 'FirstName',
                    enableCellEdit: false,
                    enableFiltering: false
                }, 
                
                    { name: 'EventTypeSparring', displayName: 'Sparring',
                      type: 'boolean',enableFiltering: false,
                      cellTemplate: '<input type="checkbox" ng-disabled="col.grid.appScope.showregister(row.entity)" ng-model="row.entity.EventTypeSparring">'},
                    { name: 'EventTypeKata', displayName: 'Kata', 
                      type: 'boolean',enableFiltering: false,
                    cellTemplate: '<input type="checkbox" ng-disabled="col.grid.appScope.showregister(row.entity)"  ng-model="row.entity.EventTypeKata">'},
                    { name: 'EventTypeWeapons', displayName: 'Weapons', 
                      type: 'boolean',enableFiltering: false,
                    cellTemplate: '<input type="checkbox" ng-disabled="col.grid.appScope.showregister(row.entity)"  ng-model="row.entity.EventTypeWeapons">'},
//                    { name: 'Include'  
//                      enableFiltering: true,
 //                     filter: {term: 'NULL'
//                      filter: {term: '1',
 //                         condtion: uiGridConstants.filter.NOT_EQUAL,
  //                        placeHolder: 'not eq'
//                      },
//                      visible: true
//                    },

                 { name: 'Action',
                 enableFiltering: false,
             cellTemplate:ctpl 
                     
                 }
                ],

                //rowHeight: 15,
                showGridFooter: false,
                enableColumnResizing: true,
                appScopeProvider: vm,

                onRegisterApi: function(gridApi) {
                    $log.log('vm gridapi onRegisterApi');
                     vm.gridTournamentApi = gridApi;

     /*               gridApi.selection.on.rowSelectionChanged($scope,function(row){
                        var msg = 'grid row selected ' + row.entity;
                        $log.log(msg);

                        var selectedStudentarr = vm.gridTournamentApi.selection.getSelectedRows();
                        $log.log('selected', selectedStudentarr);
                        setSelectedArray(selectedStudentarr);
                        
                    });
     */
    /*                    gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                            $log.log("grid batch");  
                            var selectedStudentarr = vm.gridTournamentApi.selection.getSelectedRows();
                            $log.log('batch selected', selectedStudentarr);
                            setSelectedArray(selectedStudentarr);

                    });
     */               gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
                        $log.log('rowEntity');
                        $log.log(rowEntity);
                        //Alert to show what info about the edit is available
                        $log.log('Column: ' + colDef.name  + 
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue    );
                        if (newValue != oldValue) {
                            //updateEvent(colDef,newValue,rowEntity);       
                        }
                    });

                    }
            };

            $log.log('setGridTournamentOptions Options:', vm.gridTournamentOptions);

        }



        function setGridPaymentOptions() {

//  var EventTypeTemplate = '<div>{{COL_FIELD == "Two Events" ? vm.twoeventpay50 : vm.threeeventpay60}}</div';
//  var EventTypeTemplate = '<div class="ui-grid-cell-contents">{{COL_FIELD == "Two Events" ? "y" : "x"}}</div';

            var ctpl ='<div ng-hide="col.grid.appScope.showregister(row.entity)"> <button class="btn btn-green primary"  ng-click="col.grid.appScope.registerMe(row.entity)">Register</button></div><div ng-show="col.grid.appScope.showpaid(row.entity)">Paid - Issues? 508-653-2137 </div>' ;

            vm.gridPaymentOptions = {
                enableFiltering: true,
                paginationPageSizes: vm.limits,
                paginationPageSize: 10,
            columnDefs: [
                // default

                {
                    field: 'LastName',
                    enableCellEdit: false,
                    enableFiltering: false
                }, {
                    field: 'FirstName',
                    enableCellEdit: false,
                    enableFiltering: false
                }, {
                    displayName: 'Event Types',
                    name: 'EventType',
                    enableCellEdit: false,
                    enableFiltering: false,
                }, {
                    name: 'EventType',
                    field: 'EventType',
                    displayName: 'Add to Cart',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false
                    }
                ],

                //rowHeight: 15,
                showGridFooter: false,
                enableColumnResizing: true,

                onRegisterApi: function(gridApi) {
                    $log.log('vm gridapi onRegisterApi');
                     vm.gridPaymentApi = gridApi;

                    }
            };

            $log.log('setGridPaymentOptions Options:', vm.gridPaymentOptions);

        }

    

    }

})();
