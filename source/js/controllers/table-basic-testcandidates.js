(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('TestCandidateTableBasicController', TestCandidateTableBasicController)
        .directive('zoom', function($window) {

	function link(scope, element, attrs) {

		//SETUP
		var frame, image, zoomlvl, fWidth, fHeight, rect, rootDoc, offsetL, offsetT, xPosition, yPosition, pan;
		//Template has loaded, grab elements.
        scope.$watch('$viewContentLoaded', function()
        {
           frame = angular.element(document.querySelector("#"+scope.frame))[0];
           image = angular.element(document.querySelector("#"+scope.img))[0];
           
           zoomlvl = (scope.zoomlvl === undefined) ? "2.5" : scope.zoomlvl;
        });



		//MOUSE TRACKER OVER IMG
		scope.trackMouse = function($event) {
					
			fWidth = frame.clientWidth;
			fHeight = frame.clientHeight;
			
			rect = frame.getBoundingClientRect();
			rootDoc = frame.ownerDocument.documentElement;
			
			//calculate the offset of the frame from the top and left of the document
			offsetT = rect.top + $window.pageYOffset - rootDoc.clientTop;
			offsetL = rect.left + $window.pageXOffset - rootDoc.clientLeft;

			//calculate current cursor position inside the frame, as a percentage
			xPosition = (($event.pageX - offsetL) / fWidth) * 100;
			yPosition = (($event.pageY - offsetT) / fHeight) * 100;

			pan = xPosition + "% " + yPosition + "% 0";
			image.style.transformOrigin = pan;

		};
        
		//MOUSE OVER | ZOOM-IN
		element.on('mouseover', function(event) {
			image.style.transform = 'scale('+zoomlvl+')';
		});

		//MOUSE OUT | ZOOM-OUT
		element.on('mouseout', function(event) {
			image.style.transform = 'scale(1)';
		});


	}

	return {
		restrict: 'EA',
		scope: {
			src: '@src',
			frame: '@frame',
			img: '@img',
			zoomlvl: '@zoomlvl'
		},
		template: [
			'<div id="{{ frame }}" class="zoomPanFrame" >',
			'<img id="{{ img }}" class="zoomPanImage" ng-src= "{{ src }}" ng-mousemove="trackMouse($event)"></img>',
			'</div>'
		].join(''),
		link: link
	};
});
    TestCandidateTableBasicController.$inject = [
    '$routeParams',
    '$log',
    'TestingServices',
    'CalendarServices',
    '$location',
    '$window',
    '$q',
    '$scope',
    '$route',
    'Notification',
    'uiGridConstants',
    'uiGridGroupingConstants',
    '$timeout',
    'moment',
    'UserServices'
    ];

    function TestCandidateTableBasicController($routeParams, $log, TestingServices,CalendarServices, $location, $window, $q,
        $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants, $timeout, moment, UserServices) {
        /* jshint validthis: true */

        var vm=this;
        
//        vm.refreshthetestcandidate = refreshthetestcandidate;
        vm.gettestcandidateList = gettestcandidateList;
        vm.gettestcandidateDetails = gettestcandidateDetails;
        vm.updatetestcandidate = updatetestcandidate;
        vm.gettestcandidateNames = gettestcandidateNames;
        vm.getInstructorList = getInstructorList;
        vm.getTestDates = getTestDates;
        vm.updateTest = updateTest;
        vm.addToTest = addToTest;
        vm.removeFromTest = removeFromTest;        
//        vm.getColDefList = getColDefList;
//        vm.setColDef = setColDef;
//        vm.dateopen = dateopen;
//        vm.getColDefs = getColDefs;
//        vm.changeColDef = changeColDef;
//        vm.saveState = saveState;
//        vm.restoreState = restoreState;
        vm.setLimit = setLimit;
        vm.createtestcandidate = createtestcandidate;
//        vm.getActiveTab = getActiveTab;
//        vm.setActiveTab = setActiveTab;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.createCertificate = createCertificate;
        vm.limit = 0;
        vm.limits = [10,20,50,100,200,500,5000];
        vm.data = [];
        vm.state = {};
        vm.thiscoldef = '';
        vm.colkey = 'testcandidate';
        vm.colsubkey = '';
        vm.colsubkeys = [];
        vm.coldeflist = [];
        vm.testcandidatetmp;
        vm.gcolumns =[];
        vm.loading = true; 
        vm.loadAttempted = false;
        vm.gridOptions={};
        vm.resgridOptions={};
        vm.selectedStudents=[];
        vm.TestCandidateSelected = '';
        vm.testcandidatenames=[];
        vm.instructorlist=[];
        vm.testcandidate = '';
        vm.ContactID = '';
        vm.selected;
        vm.testname;
        vm.testtype;
        vm.userdta;

        activate();

        function setLimit(thelimit) {
            $log.debug('setLimit',thelimit);
            vm.limit = thelimit;
        }

        function addToTest(testingid) {
            $log.debug('addToTest entered',testingid);
            createtestcandidate(testingid);   
        }

        function removeFromTest(testingid) {
            $log.debug('removeFromTest entered');
            removetestcandidate(testingid);            
        }
        
        function activate() {
            getInstructorList();
            getTestDates();
            setGridOptions();
            setResGridOptions();
            getUserDetails();
        }

    function getUserDetails(){
        $log.debug('getUserDetails entered');
           return UserServices.getUserDetails().then(function(data) {
                $log.debug("getuserdetails returned:", data);
                vm.userdta = data;
                return vm.userdta;
                },

            function (error) {
                $log.debug('Caught an error getUserDetails, going to notify:', error); 
                vm.userdta = [];
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
        
    function updateTest(){
        $log.debug('updateTest entered');
        var path = "../v1/testing";
        var indata = {
            ID: vm.testdatelist.testingid,
            Tester1: vm.testdatelist.tester1,
            Tester2: vm.testdatelist.tester2,
            Tester3: vm.testdatelist.tester3,
            Tester4: vm.testdatelist.tester4
        };
        
        $log.debug('about updateTesting ', indata, path);
        
        return TestingServices.updateTesting(path, indata)
            .then(function(data){
                $log.debug('updateTesting returned data');
                $log.debug(data);
                vm.message = data.message;
              
            }).catch(function(e) {
                $log.debug('updateTesting failure:');
                $log.debug("error", e);
                vm.message = e;
                Notification.error({message: e, delay: 5000});
                throw e;
            });
    }
    
    function getInstructorList() {
        $log.debug('getInstructorList entered');
        var refreshpath = "../v1/instructorlist";
        var witnessdefault = {
            firstname: 'Witness',
            lastname: '',
            instructortitle: '',
            name: 'Witness'
        };
         return CalendarServices.getinstructorlist(refreshpath).then(function(data){
                $log.debug('getinstructorlist returned data');
                $log.debug(data);
                vm.instructorlist = data.instructorlist; 
                if (typeof data.instructorlist !== 'undefined' ) {  
                    for (var i=0;i<data.instructorlist.length;i++) {
                        vm.instructorlist[i].name = data.instructorlist[i].firstname + ' ' + data.instructorlist[i].lastname;
                    }
                }
                vm.instructorlist.unshift(witnessdefault);
                return vm.instructorlist;
            },
            function (error) {
                $log.debug('Caught an error getinstructorlist, going to notify:', error); 
                vm.instructorlist = [];
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
    function convertTime(thetime) {
        if (typeof(thetime) !== 'undefined') {
            var m = moment(thetime,"MM/DD/YYYY hh:mm A z");
            $log.debug('convertTime: passed in: ',thetime,
                'isvalid?' ,m.isValid(),
                'where invalid', m.invalidAt());
            return moment(thetime,"MM/DD/YYYY hh:mm A z").tz('America/New_York').format('MM/DD/YYYY hh:mm A z');
        }
    }
    function getTestDates(testname) {
        if (typeof testname === 'undefined') {
            return {};
        }
        $log.debug('getTestDates entered', testname);
        var refreshpath = encodeURI("../v1/testdates?testname=" + testname.name);
        var error;
        vm.testname = testname.name;
        vm.testtype = testname.eventtype;

         return TestingServices.getTestDates(refreshpath).then(function(data){
                $log.debug('getTestDates returned data');
                $log.debug(data);
                if (data.testdatelist.length > 1) {
                    error = "too many testdates found:" + data.testdatelist.length;
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    vm.testdatelist = [];
                    return ($q.reject(error));
                }
                if (data.testdatelist.length === 1) {
                    vm.testdatelist = data.testdatelist[0]; 
                    vm.testdatelist.starttime = convertTime(data.testdatelist[0].startdate);
                    vm.testdatelist.endtime = convertTime(data.testdatelist[0].enddate);
                    vm.gettestcandidateDetails(vm.testdatelist.testtype);
                    vm.gettestcandidateList(testname.name,testname.eventtype);
                    
                } else {
                    error = "No testdates found in calendar for:" + testname.name;
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    vm.testdatelist = [];
                    return ($q.reject(error));

                }
                return vm.testdatelist;
            },
            function (error) {
                $log.debug('Caught an error getTestDates, going to notify:', error); 
                vm.testdatelist = [];
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

    function removetestcandidate(testingid) {
        if (vm.selected === false) {
            var error = "no rows selected for testcandidate";
            Notification.error({message: error, delay: 5000});
            return;                
        }
        
        var path = "../v1/testcandidateregistration";

        var thedata = {
            testingid: testingid,
            selectedStudents: vm.selectedStudents
        };
        $log.debug('about removetestcandidate ', path, thedata,vm.testname);
        return TestingServices.removetestcandidate(path, thedata)
            .then(function(data){
                $log.debug('removetestcandidate returned data');
                $log.debug(data);
                vm.thistestcandidate = data;
                $log.debug(vm.thistestcandidate);
                $log.debug(vm.thistestcandidate.message);
                vm.message = vm.thistestcandidate.message;
                Notification.success({message: vm.message, delay: 5000});
                gettestcandidateList(vm.testname, vm.testtype).then
                    (function(zdata) {
                     $log.debug('gettestcandidateList returned', zdata);
                 },
                    function (error) {
                        $log.debug('Caught an error gettestcandidateList after update:', error); 
                        vm.data = [];
                        vm.message = error;
                        Notification.error({message: error, delay: 5000});
                        return ($q.reject(error));
                    });

                return vm.thistestcandidate;
            }).catch(function(e) {
                $log.debug('removetestcandidate failure:');
                $log.debug("error", e);
                vm.message = e;
                Notification.error({message: e, delay: 5000});
                throw e;
            });
        }

  
    function createtestcandidate(testingid) {
        if (vm.selected === false) {
            var error = "no rows selected for testcandidate";
            Notification.error({message: error, delay: 5000});
            return;                
        }
        
        var path = "../v1/testcandidateregistration";

        var thedata = {
            testingid: testingid,
            selectedStudents: vm.selectedStudents
        };
        $log.debug('about createtestcandidate ', path, thedata,vm.testname);
        return TestingServices.createtestcandidate(path, thedata)
            .then(function(data){
                $log.debug('createtestcandidate returned data');
                $log.debug(data);
                if (typeof(data) !== 'undefined') {
                    vm.thistestcandidate = data;
                    $log.debug(vm.thistestcandidate);
                    $log.debug(vm.thistestcandidate.message);
                    vm.message = vm.thistestcandidate.message;
                    Notification.success({message: vm.message, delay: 5000});
                } else {
                    Notification.success({message: "Not created", delay: 5000});
                }
                gettestcandidateList(vm.testname,vm.testtype).then
                    (function(zdata) {
                     $log.debug('gettestcandidateList returned', zdata);
                 },
                    function (error) {
                        $log.debug('Caught an error gettestcandidateList after update:', error); 
                        vm.data = [];
                        vm.message = error;
                        Notification.error({message: error, delay: 5000});
                        return ($q.reject(error));
                    });
                return vm.thistestcandidate;
            }).catch(function(e) {
                $log.debug('createtestcandidate failure:');
                $log.debug("error", e);
                vm.message = e;
                Notification.error({message: e, delay: 5000});
                throw e;
            });
        }
/*
        function refreshthetestcandidate(testingid) {
            $log.debug('refreshthetestcandidate entered ',testingid);

            var refreshpath = encodeURI('../v1/testcandidatelist?thelimit=' + vm.limit );

            $log.debug('refreshthetestcandidate path:', refreshpath);
            
             return TestingServices.gettestcandidateList(refreshpath).then(function(data){
                    $log.debug('refreshtestcandidates returned data');
                    $log.debug(data);
                    vm.resgridOptions.data = data.testcandidateList; 
                    return vm.resgridOptions.data;
                },
                function (error) {
                    $log.debug('Caught an error refreshthetestcandidate, going to notify:', error); 
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
*/
        function gettestcandidateList(thetestname,thetesttype) {
            $log.debug('gettestcandidateList entered',thetestname,thetesttype);
            var refreshpath = encodeURI('../v1/testcandidatelist?testname=' + thetestname + '&testtype=' + thetesttype );
//view testcandidatelist
            $log.debug('gettestcandidateList path:', refreshpath);
            
             return TestingServices.gettestcandidateList(refreshpath).then(function(data){
                    $log.debug('gettestcandidateList returned data');
                    $log.debug(data);
                    vm.resgridOptions.data = data.testcandidateList; 
                    return vm.data;
                },
                function (error) {
                    $log.debug('Caught an error gettestcandidateList:', error); 
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

        function gettestcandidateDetails(thetesttype) {
            //called by gettestdates
            $log.debug('gettestcandidateDetails entered:',thetesttype);
            var path = encodeURI('../v1/testcandidatedetails?testtype=' + thetesttype );
            var messagetxt;
//view testcandidatesource
            $log.debug('gettestcandidateDetails path:', path);
            
             return TestingServices.gettestcandidateDetails(path).then(function(data){
                    $log.debug('gettestcandidateDetails returned data');
                    $log.debug(data);
                    if (typeof(data.testcandidatedetails) !== 'undefined' && data.testcandidatedetails.length > 0) {
                        vm.gridOptions.data = data.testcandidatedetails; 
                        $log.debug("details",data.testcandidatedetails[0]);
                        
                        vm.ContactID = data.testcandidatedetails[0].contactID;
                        
                        //check for empty set and do message
                        messagetxt = "testcandidateDetails obtained";
                        Notification.success({message: messagetxt, delay: 5000});
                        
                    } else {
                        messagetxt = "No test candidates found";
                        Notification.warning({message: messagetxt, delay: 5000});
                    }
                    return;
                },
                function (error) {
                    $log.debug('Caught an error gettestcandidateDetails:', error); 
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

        function gettestcandidateNames(testcandidatepartial) {
            $log.debug('gettestcandidateNames entered');
            var path = encodeURI('../v1/testcandidatenames?testcandidatepartial=' + testcandidatepartial);

            $log.debug('gettestcandidateNames path:', path);
            
             return TestingServices.gettestcandidateNames(path).then(function(data){
                    $log.debug('gettestcandidateNames returned data');
                    $log.debug(data);
                    vm.testcandidatenames = data.testcandidatenames; 
                    //check for empty set and do message
                    //messagetxt = "testcandidateDetails obtained";
                    //Notification.success({message: messagetxt, delay: 5000});
                    return;
                },
                function (error) {
                    $log.debug('Caught an error gettestcandidateDetails:', error); 
                    vm.data.testcandidatelist = [];
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

/*
        function setColDef(indata) {
            var path = "../v1/coldef";
            $log.debug('about setColDefs ', indata, path);
            return TestingServices.setColDefs(path, indata)
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

             return TestingServices.getColDefs(refreshpath).then(function(data){
                    $log.debug('TestingServices in controller getColDefs returned data');
                    $log.debug(data);
                 //   vm.gcolumns = data.gcolumns[0][0]; 
                 //   $log.debug('TestingServices in controller set gcolumns',vm.gcolumns);
                    vm.state = JSON.parse(data.gcolumns[0][0]);
                    $log.debug('TestingServices in controller set vm.state',vm.state);
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
            
             return TestingServices.getColDefList(refreshpath).then(function(data){
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
                         filt = "";
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

            refreshthetestcandidate().then(function(zdata) {
                 $log.debug('refreshthetestcandidate returned', zdata);
             if (vm.state != {}) {
                 restoreState(vm.state);
             }
             });
             

        }
 
        function isNewColDef(thetestcandidate){
            $log.debug('isNewColDef', thetestcandidate);
            var isnew = true;
            for (var i=0, len=vm.colsubkeys.length; i < len; i++) {
              //  $log.debug('isNewColDef colsubkey:', vm.colsubkeys[i]);
                if (vm.colsubkeys[i] == thetestcandidate) {
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
                exporterCsvFilename: 'testcandidates.csv',
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

                        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                        $log.debug('batch selected', selectedStudentarr);
                        setSelectedArray(selectedStudentarr);

                    });


                    }
            };

            $log.debug('setGridOptions gcolumns', vm.gcolumns);
            $log.debug('setGridOptions gridOptions', vm.gridOptions);

        }
*/
        function setGridOptions() {
            vm.gridOptions = {
                enableFiltering: true,
                paginationPageSizes: vm.limits,
                paginationPageSize: 10,
                rowHeight: 100,
            columnDefs: [
                // default
                {
                    field: 'LastName',
                    name: 'Last',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'FirstName',
                    name: 'First',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    //<zoom src="./imageURL.jpg" frame="example1" img="image1" zoomlvl="1.5"></zoom>
//                    field: 'contactpictureurl',
 //                   cellTemplate:"<img width=\"50px\" ng-src=\"./images/students/{{grid.getCellValue(row, col)}}\" lazy-src>",
  //                  name: 'Picture',
//                    headerCellClass: highlightFilteredHeader,
 //                   enableCellEdit: false
  //              }, {
                    field: 'contactpictureurl',
                    minWidth: 100,
                    name: 'Picture',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    cellTemplate: '<zoom ng-src="{{grid.getCellValue(row, col)}}" frame="example{{rowRenderIndex}}" img="image{{rowRenderIndex}}"  zoomlvl="2.5" lazy-src></zoom>'
                }, {
                    field: 'contactID',
                    name: 'ID',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'age',
                    name: 'Age',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true,
                    visible: false
                }, {
                    field: 'BeltSize',
                    name: 'Belt size',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true,
                    visible: false
                }, {
                    field: 'ranklist',
                    name: 'Rank',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'nextrank',
                    name: 'Next Rank',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'LastPromoted',
                    name: 'Last Promoted',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true,
                    visible: false
                }, {
                    field: 'ContactType',
                    name: 'Contact',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true,
                    filter: {term: "Student"},                    
                    visible: true
                }, {
                    field: 'rankForNextClass',
                    name: 'rankForNextClass',
                    headerCellClass: highlightFilteredHeader,
                    visible: false,
                    enableCellEdit: false
                }, {
                    field: 'ageForNextClass',
                    name: 'ageForNextClass',
                    headerCellClass: highlightFilteredHeader,
                    visible: false,
                    enableCellEdit: false
                }, {
                    field: 'ReadyForNextRank',
                    name: 'Ready',
                    headerCellClass: highlightFilteredHeader,
                    filter: {term: "1"},                    
                    enableCellEdit: false
                }, {
                    field: 'agecat',
                    name: 'Age Group',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'classcat',
                    name: 'Category',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'nclass',
                    name: 'Class',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'pgrmcat',
                    name: 'Program',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'testname',
                    name: 'Test',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }],

                //rowHeight: 15,
                showGridFooter: true,
                enableColumnResizing: true,
                enableGridMenu: true,
                showColumnFooter: true,
                exporterCsvFilename: 'testcandidate.csv',
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
                        var msg = 'grid row selected ' + row.entity;
                        $log.debug(msg);

                        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                        $log.debug('selected', selectedStudentarr);
                        setSelectedArray(selectedStudentarr);
                        
                    });
                    gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                        $log.debug("grid batch");  
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
                    gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
                        $log.debug('rowEntity');
                        $log.debug(rowEntity);
                        //Alert to show what info about the edit is available
                        $log.debug('Column: ' + colDef.name  + 
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue    );
                        if (newValue != oldValue) {
                            updatetestcandidate(colDef,newValue,rowEntity);       
                        }
                    });

                    }
            };

            $log.debug('setGridOptions gridOptions', vm.gridOptions);

        }

        function setResGridOptions() {
            vm.resgridOptions = {
                enableFiltering: true,
                paginationPageSizes: vm.limits,
                paginationPageSize: 10,
                rowHeight: 100,
            columnDefs: [
                // default
                {
                    field: 'LastName',
                    name: 'Last',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'FirstName',
                    name: 'First',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    //<zoom src="./imageURL.jpg" frame="example1" img="image1" zoomlvl="1.5"></zoom>
//                    field: 'contactpictureurl',
 //                   cellTemplate:"<img width=\"50px\" ng-src=\"./images/students/{{grid.getCellValue(row, col)}}\" lazy-src>",
  //                  name: 'Picture',
//                    headerCellClass: highlightFilteredHeader,
 //                   enableCellEdit: false
  //              }, {
                    field: 'contactpictureurl',
                    minWidth: 100,
                    name: 'Picture',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    cellTemplate: '<zoom ng-src="{{grid.getCellValue(row, col)}}" frame="example{{rowRenderIndex}}" img="image{{rowRenderIndex}}"  zoomlvl="2.5" lazy-src></zoom>'
                }, {
                    field: 'contactID',
                    name: 'ID',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
/*                }, {
                    field: 'age',
                    name: 'Age',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true,
                    visible: false
 */               }, {
                    field: 'BeltSize',
                    name: 'Belt size',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true,
                    visible: false
                }, {
                    field: 'CurrentRank',
                    name: 'Rank',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'RankAchievedInTest',
                    name: 'Next Rank',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'LastPromoted',
                    name: 'Last Promoted',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true,
                    visible: false
                }, {
                    field: 'ContactType',
                    name: 'Contact',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true,
                    filter: {term: "Student"},                    
                    visible: true
                }, {
                    field: 'ReadyForNextRank',
                    name: 'Ready',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
  /*              }, {
                    field: 'agecat',
                    name: 'Age Group',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'classcat',
                    name: 'Category',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'nclass',
                    name: 'Class',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'pgrmcat',
                    name: 'Program',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
    */            }, {
                    field: 'testingid',
                    name: 'testingid',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }, {
                    field: 'testname',
                    name: 'Test',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
                }],

                //rowHeight: 15,
                showGridFooter: true,
                enableColumnResizing: true,
                enableGridMenu: true,
                showColumnFooter: true,
                exporterCsvFilename: 'testcandidate.csv',
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
                    $log.debug('resgridapi onRegisterApi');
                     vm.resgridApi = gridApi;

                    gridApi.selection.on.rowSelectionChanged($scope,function(row){
                        var msg = 'grid row selected ' + row.entity;
                        $log.debug(msg);

                        var selectedStudentarr = vm.resgridApi.selection.getSelectedRows();
                        $log.debug('selected', selectedStudentarr);
                        setSelectedArray(selectedStudentarr);
                        
                    });
                    gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                        $log.debug("grid batch");  
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
                        var selectedStudentarr = vm.resgridApi.selection.getSelectedRows();
                        $log.debug('batch selected', selectedStudentarr);
                        setSelectedArray(selectedStudentarr);

                    });
                    gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
                        $log.debug('rowEntity');
                        $log.debug(rowEntity);
                        //Alert to show what info about the edit is available
                        $log.debug('Column: ' + colDef.name  + 
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue    );
                        if (newValue != oldValue) {
                            updatetestcandidate(colDef,newValue,rowEntity);       
                        }
                    });

                    }
            };

            $log.debug('setResGridOptions ', vm.resgridOptions);

        }

        function updatetestcandidate(colDef, newValue,rowEntity) {
            var path = "../v1/testcandidateregistration";
            var indata = {
                changedColumn: colDef,
                newValue: newValue,
                ContactID: rowEntity.ContactID,
                testcandidate: vm.testcandidate,
            };
            
            $log.debug('about updatetestcandidate ', indata, path);
            
            return TestingServices.updatetestcandidate(path, indata)
                .then(function(data){
                    $log.debug('updatetestcandidate returned data');
                    $log.debug(data);
                    vm.thiscoldef = data;
                    $log.debug(vm.thiscoldef);
                    $log.debug(vm.thiscoldef.message);
                    vm.message = vm.thiscoldef.message;
                  
                }).catch(function(e) {
                    $log.debug('updatetestcandidate failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });

        }
        
        function setSelectedArray(inputArray) {
            $log.debug("setSelectedArray entered", inputArray);
            vm.selectedStudents = [];
            
            if (inputArray.length > 0){
                vm.selected = true;
                for(var i=0,len=inputArray.length;i < len;i++){
                    var info = {
                        ContactID: inputArray[i].contactID,
                        nextRank: inputArray[i].RankAchievedInTest,
                        studentname: inputArray[i].FirstName + ' ' + inputArray[i].LastName
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

        function getBase64Image(img) {
                // Create an empty canvas element
                var canvas = document.createElement("canvas");
        
                // Copy the image contents to the canvas
                var ctx = canvas.getContext("2d");
                var image = new Image();
                image.src = img;
                canvas.width = image.width;
                canvas.height = image.height;
        
                ctx.drawImage(image, 0, 0);
        
                // Get the data-URL formatted image
                // Firefox supports PNG and JPEG. You could check img.src to
                // guess the original format, but be aware the using "image/jpg"
                // will re-encode the image.
                var dataURL = canvas.toDataURL("image/png");
        
                return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            }
        
        function getContent(students,certdata) {
          $log.debug('getContent entered',students,certdata);
          var contentdtl=[];
          var pagebreak;
          for (var i=0; i<students.length; i++) {       
            if (i < students.length -1  ) {
                pagebreak = {pageBreak: 'before', text: ''}; 
            } else {
                pagebreak = {};
            }
            contentdtl.push(
             [
              {text: '',        style: ['topfiller']},
              {text: 'This is to certify that\n',        style: ['smalllines','spread']},
              {text: students[i].studentname + '\n', style: ['mediumlines','botfiller']},
              {text: 'Has successfully demonstrated the required level of ability and\nknowledge in the art of Shaolin Kempo Karate and Jiu-Jitsu and\n' + certdata.program + '\n', style: ['smalllines','spread']},
              {text: students[i].nextRank + '\n', style: ['biglines','bigtop'] },
              {text: 'Dated this ' + certdata.certDate + ' at ' + certdata.school + '\n', style: ['smalllines','spread']},
          		{
              columns: [
                  { width: 70, text: ''},
                  { stack: [
                     {text: '', marginTop: 57},
                     {text:  certdata.instructor1 + '\n', marginLeft: 40 - certdata.instructor1.length*1.5/2, style: 'signature'},
                     {text:  certdata.title1 , marginLeft: 40 - certdata.title1.length*1.5/2, style: 'signature'},
                     {text: '', marginTop: 38},
                     {text:  certdata.instructor2 + '\n', marginLeft: 40 - certdata.instructor2.length*1.5/2  , style: 'signature'},
                     {text:  certdata.title2, marginLeft: 40 - certdata.title2.length*1.5/2 , style: 'signature'},
                     ]
                  },
                  { width: 190, text: ''},
                  { stack: [
                    {text: '', marginTop: 57},
                     {text:  certdata.instructor3 + '\n', marginLeft: 50 - certdata.instructor3.length*1.5/2 + certdata.instructor1.length*1.5/2, style: 'signature'},
                     {text:  certdata.title3 , marginLeft: 50 - certdata.title3.length*1.5/2 + certdata.title1.length*1.5/2, style: 'signature'},
                    {text: '', marginTop: 38},
                     {text:  certdata.instructor4 + '\n', marginLeft: 50 - certdata.instructor4.length*1.5/2 + certdata.instructor2.length*1.5/2, style: 'signature'},
                     {text:  certdata.title4 , marginLeft: 50 - certdata.title4.length*1.5/2 + certdata.title2.length*1.5/2, style: 'signature'},
                     ]
                  }
                  ]
          		}, 
          		  pagebreak 
            ]);
          }
          return contentdtl;
        }
        function createCertificate() {
        
        var rptwidth = 792;
        var rptheight = 600;
        var sigwidth = 150;

        var testImageDataUrl ='data:image/png;base64,'+ getBase64Image("images/logos/StudioDiplomaTemplate.png");
        //var testImageDataUrl ='data:image/png;base64,'+ this.getBase64Image("images/reports/dragon.jpg");
        //var logoImageDataUrl ='data:image/png;base64,'+ this.getBase64Image("images/logos/vlogo.gif");
        var program = "and is therefore awarded the rank of";

$log.debug('testers',vm.testdatelist);
$log.debug('titles',vm.instructorlist);
$log.debug('title1',_.findWhere(vm.instructorlist, {name: vm.testdatelist.tester1}));
$log.debug('school', vm.userdta);
        var students = vm.selectedStudents;
        var certdata={
          certDate: vm.testdatelist.testdate,
          school: vm.userdta.school,
          program: program,
          instructor1: vm.testdatelist.tester1,
          instructor2: vm.testdatelist.tester2,
          instructor3: vm.testdatelist.tester3,
          instructor4: vm.testdatelist.tester4,
          title1: _.findWhere(vm.instructorlist, {name: vm.testdatelist.tester1}).instructortitle,
          title2: _.findWhere(vm.instructorlist, {name: vm.testdatelist.tester2}).instructortitle,
          title3: _.findWhere(vm.instructorlist, {name: vm.testdatelist.tester3}).instructortitle,
          title4: _.findWhere(vm.instructorlist, {name: vm.testdatelist.tester4}).instructortitle
        };
        
        var thecontent = getContent(students,certdata);
        $log.debug('thecontent', thecontent);
        
        var docDefinition = {
          pageOrientation: 'landscape',
          // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
          pageMargins: [ 40, 60, 40, 0 ],
          pageSize: 'LETTER',
          background: [
           {
         			image: testImageDataUrl,
               width: rptwidth,
               height: rptheight
           }],
           content: thecontent ,
        		styles: {
        		  bigtop: {
        		    margin: [0,0,0,0]
        		  },
        		  topfiller: {
        		    margin: [0,40]
        		  },
        		  botfiller: {
        		    margin: [0,5]
        		  },
        		  spread: {
        		    margin: [0,5]
        		  },
        		  signature: {
        		    width: sigwidth,
        		    fontSize: 12
        		  },
        		  smalllines: {
        		    fontSize: 18,
        		    alignment: 'center',
        		    width: rptwidth,
        		    lineHeight: 1.5
        		  },
        		  extrasmalllines: {
        		    fontSize: 10,
        		    alignment: 'center',
        		    width: rptwidth
        		  },
        		  mediumlines: {
        		    fontSize: 35,
        		    bold: true,
        		    alignment: 'center',
        		    width: rptwidth
        		  },
        		  biglines: {
        		    fontSize: 23,
        		    bold: true,
        		    alignment: 'center',
        		    width: rptwidth
        		  },
        		header: {
        			fontSize: 18,
        			bold: true,
        			margin: [0, 0, 0, 10]
        		},
        		subheader: {
        			fontSize: 16,
        			bold: true,
        			margin: [0, 10, 0, 5]
        		},
        		tableExample: {
        //			margin: [0, 5, 0, 15]
            alignment: 'center'
        		},
        		tableHeader: {
        			bold: true,
        			fontSize: 13,
        			color: 'black'
        		}
        	},
        	defaultStyle: {
        		// alignment: 'justify'
        	}
        };
        
        
        var now = new Date();
        //var pdfDoc = printer.createPdfKitDocument(docDefinition);
        //pdfDoc.pipe(fs.createWriteStream('pdfs/images.pdf'));
        //pdfDoc.end();
        
        // pdfMake.createPdf(docDefinition).download('Report.pdf');
         pdfMake.createPdf(docDefinition).open();
        }

    }

})();
