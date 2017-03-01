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
    'moment'
    ];

    function TestCandidateTableBasicController($routeParams, $log, TestingServices,CalendarServices, $location, $window, $q,
        $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants, $timeout, moment) {
        /* jshint validthis: true */

        var vm=this;
        
        vm.refreshthetestcandidate = refreshthetestcandidate;
        vm.gettestcandidateSource = gettestcandidateSource;
        vm.gettestcandidateDetails = gettestcandidateDetails;
        vm.updatetestcandidate = updatetestcandidate;
        vm.gettestcandidateNames = gettestcandidateNames;
        vm.getInstructorList = getInstructorList;
        vm.getTestDates = getTestDates;
        vm.updateTest = updateTest;
        
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
        vm.selectedStudents=[];
        vm.TestCandidateSelected = '';
        vm.testcandidatelist=[];
        vm.instructorlist=[];
        vm.testcandidate = '';
        vm.ContactID = '';


//       vm.status = {
 //           opened: false
 //       };

        activate();

//        function dateopen($testcandidate) {
//            vm.status.opened = true;
//        }

        function setLimit(thelimit) {
            $log.debug('setLimit',thelimit);
            vm.limit = thelimit;
        }


/*        function setActiveTab( activeTab ){
            $log.debug('set activetab as:', activeTab);
            TestingServices.setActiveTab(activeTab);
        }

        function getActiveTab(){
            return TestingServices.getActiveTab();
        }

*/
        function activate() {
 //           setInitColDefs();
 //           $log.debug('activate setInitColDefs returned');
//            getColDefList();
            getInstructorList();
            getTestDates();
            setGridOptions();

        }
        
/*        function getFormattedDate(date) {
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
  */      
    function updateTest(){
        $log.debug('updateTest entered');
    
    }
    function getInstructorList() {
        $log.debug('getInstructorList entered');
        var refreshpath = "../v1/instructorlist";
        var witnessdefault = {
            firstname: 'Witness',
            lastname: '',
            instructortitle: '',
            name: 'Witness'
        }
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

         return TestingServices.getTestDates(refreshpath).then(function(data){
                $log.debug('getTestDates returned data');
                $log.debug(data);
                if (data.testdatelist.length > 1) {
                    var error = "too many testdates found:" + data.testdatelist.length;
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
                    
                } else {
                    vm.testdatelist = {};
                    
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
  
        function createtestcandidate(testcandidate) {
            if (vm.selected === false) {
                var error = "no rows selected for testcandidate";
                Notification.error({message: error, delay: 5000});
                return;                
            }
            
            var path = "../v1/testcandidateregistration";

            var thedata = {
                testcandidate: testcandidate,
                selectedStudents: vm.selectedStudents
            };
            $log.debug('about createtestcandidate ', path, thedata);
            return TestingServices.createtestcandidate(path, thedata)
                .then(function(data){
                    $log.debug('createtestcandidate returned data');
                    $log.debug(data);
                    vm.thistestcandidate = data;
                    $log.debug(vm.thistestcandidate);
                    $log.debug(vm.thistestcandidate.message);
                    vm.message = vm.thistestcandidate.message;
                    Notification.success({message: vm.message, delay: 5000});
                    refreshthetestcandidate().then
                        (function(zdata) {
                         $log.debug('refreshthetestcandidate returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error refreshthetestcandidate after update:', error); 
                            vm.data = [];
                            vm.photos = [];
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

        function refreshthetestcandidate() {
            $log.debug('refreshthetestcandidate entered ');

            var refreshpath = encodeURI('../v1/testcandidatesource?thelimit=' + vm.limit );

            $log.debug('refreshthetestcandidate path:', refreshpath);
            
             return TestingServices.gettestcandidateSource(refreshpath).then(function(data){
                    $log.debug('refreshtestcandidates returned data');
                    $log.debug(data);
                    vm.gridOptions.data = data.testcandidatesourceList; 
                    return vm.gridOptions.data;
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

        function gettestcandidateSource() {
            $log.debug('gettestcandidateSource entered');
            var refreshpath = encodeURI('../v1/testcandidatesource');

            $log.debug('gettestcandidateSource path:', refreshpath);
            
             return TestingServices.gettestcandidateSource(refreshpath).then(function(data){
                    $log.debug('gettestcandidateSource returned data');
                    $log.debug(data);
                    vm.data = data; 
                    return vm.data;
                },
                function (error) {
                    $log.debug('Caught an error testcandidatesource:', error); 
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

        function gettestcandidateDetails(thetestcandidate) {
            $log.debug('gettestcandidateDetails entered:',thetestcandidate, thetestcandidate);
            var path = encodeURI('../v1/testcandidatedetails?testtype=' + thetestcandidate );

            $log.debug('gettestcandidateDetails path:', path);
            
             return TestingServices.gettestcandidateDetails(path).then(function(data){
                    $log.debug('gettestcandidateDetails returned data');
                    $log.debug(data);
                    vm.gridOptions.data = data.testcandidatedetails; 
                    $log.debug("details",data.testcandidatedetails[0]);
                    
                    vm.testcandidate = data.testcandidatedetails[0].testcandidate;
                    vm.ContactID = data.testcandidatedetails[0].ContactID;
                    
                    //check for empty set and do message
                    var messagetxt = "testcandidateDetails obtained";
                    Notification.success({message: messagetxt, delay: 5000});
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
                    vm.testcandidatelist = data.testcandidatelist; 
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
                    field: 'ContactID',
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
                    field: 'CurrentRank',
                    name: 'Rank',
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
                    field: 'CurrentReikiRank',
                    name: 'Reiki Rank',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true,
                    visible: false
                }, {
                    field: 'CurrentIARank',
                    name: 'IA Rank',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                    visible: false
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

                //        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                 //       $log.debug('selected', selectedStudentarr);
                 //       setSelectedArray(selectedStudentarr);
                        
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
                //        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                //        $log.debug('batch selected', selectedStudentarr);
                //        setSelectedArray(selectedStudentarr);

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
                        ContactID: inputArray[i].ContactID
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
