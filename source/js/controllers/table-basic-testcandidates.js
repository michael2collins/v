
(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('TestCandidateTableBasicController', TestCandidateTableBasicController)
            .config(function($provide) {
                // this demonstrates how to register a new tool and add it to the default toolbar
//                $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating

                $provide.decorator('taOptions', ['taRegisterTool', 'taToolFunctions', '$uibModal', '$log', '$delegate' ,
                                                 function(taRegisterTool, taToolFunctions, $uibModal, $log,  taOptions ){
            
                    function createTable(tableParams) {
                        if(angular.isNumber(tableParams.row) && angular.isNumber(tableParams.col)
                                && tableParams.row > 0 && tableParams.col > 0){
                            var table = "<table class='table  " 
                                + (tableParams.style ? "table-" + tableParams.style : '')  
                                + "'>";
            
                            var colWidth = 100/tableParams.col;
                            for (var idxRow = 0; idxRow < tableParams.row; idxRow++) {
                                var row = "<tr>";
                                for (var idxCol = 0; idxCol < tableParams.col; idxCol++) {
                                    row += "<td" 
                                        + (idxRow == 0 ? ' style="width: ' + colWidth + '%;"' : '')
                                        +">Sample Cell</td>";
                                }
                                table += row + "</tr>";
                            }
                            return table + "</table>";
                        }
                    }
                    taOptions.toolbar = [
                    				['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                    				['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
                    				['justifyLeft','justifyCenter','justifyRight', 'justifyFull'],
                    				['html', 'insertImage', 'insertLink', 'charcount']
                    			];
                    taRegisterTool('insertTable', {
                        iconclass: 'fa fa-table',
                        tooltiptext: 'Insert table',
                        action: function(deferred){
                            var textAngular=this;
                            var savedSelection = rangy.saveSelection();
                            
                            $uibModal.open({
                                templateUrl: 'templates/states/textblocktable.html',
                                windowClass: 'modal-window-sm',
                                backdrop: 'static',
                                keyboard: false,
                                controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                                    $scope.newtable ={};
                                    $scope.tablestyles = [
                                                          { name: 'Bordered', value: 'bordered' },
                                                          { name: 'Striped', value: 'striped' },
                                                          { name: 'HeaderlineOnly', value: 'HeaderlineOnly' },
                                                          { name: 'LightHorizontalLines', value: 'LightHorizontalLines' },
                                                          { name: 'Striped', value: 'striped' },
                                                          { name: 'Borderd Striped', value: 'striped table-bordered' }];
                                    $scope.tblInsert = function () {
                                        $uibModalInstance.close($scope.newtable);
                                    };
            
                                    $scope.tblCancel = function () {
                                        $uibModalInstance.dismiss("cancel");
                                    };
                                }],
                                size: 'sm'
                            
                            //define result modal , when user complete result information 
                            }).result.then(function(result){
                                    rangy.restoreSelection(savedSelection)
                                    textAngular.$editor().wrapSelection('insertHTML', createTable(result));
                                    deferred.resolve();
                                },
                            function () {
                                rangy.restoreSelection(savedSelection)
                                deferred.resolve();
                                }
                            );                            
                            return false;
                        }/*,
                          onElementSelect: {
                            element: 'table',
                            action: taToolFunctions.tableOnSelectAction
                          }
                          */
                    });
                    taOptions.toolbar[1].push('insertTable');

                    taRegisterTool('test', {
                        buttontext: 'Test',
                        action: function() {
                            alert('Test Pressed');
                        }
                    });
                    taOptions.toolbar[1].push('test');
                    
                    taRegisterTool('colourRed', {
                        iconclass: "fa fa-square red",
                        action: function() {
                            this.$editor().wrapSelection('forecolor', 'red');
                        }
                    });
                    // add the button to the default toolbar definition
                    taOptions.toolbar[1].push('colourRed');

                    var displaystuff2 = ' <div class="c-drop-down" dropdown="true" auto-close="outsideClick"> ' +
                        '<a class="c-drop-down__title" dropdown-toggle="true"> text </a> ' +
                        '<ul class="c-drop-down__menu c-drop-down__menu--left dropdown-menu"> ' +
                        '<!--  <li ng-repeat="o in options"> ' +
                        '    <button type="button" ng-class="displayActiveToolClass(active)" ng-click="action($event, o.value)"> {{ o.name }} </button> ' +
                        '  </li> -->' +
                        '  <li > ' +
                        "    <button type='button' ng-class='displayActiveToolClass(active)' ng-click='action($event, \"H1\")'> h1</button> " +
                        '  </li> ' +
                        '</ul>' +
                        '</div> ';
            


                    taRegisterTool('dropdownTest', {
                        display: "<div class='btn-group' uib-dropdown> <button id='single-button' type='button' class='btn btn-primary' uib-dropdown-toggle auto-close='outsideClick'>Select Option <span class='caret'></span>       </button>       <ul class='dropdown-menu' uib-dropdown-menu role='menu' aria-labelledby='single-button'>           <li role='menuitem' ng-repeat='o in options'>             <button type='button' ng-class='displayActiveToolClass(active)' ng-click='action($event, o.value)'> {{ o.name }} </button></li></ul></div>",
                        action: function(deferred, value) {

                            $log.debug('dropdowntest deferred:',deferred);
                            $log.debug('dropdowntest value:', value);

                   //       if (!!event.stopPropagation) {
                //              $log.debug('stop');
                 //           event.stopPropagation();
                  //          $('body').trigger('click');
                //          }
                          if( value === 'H1' || value === 'H2' || value === 'H3' || value === 'blockquote' ) {
                              //  deferred.resolve();
                            return this.$editor().wrapSelection('formatBlock', "<" + value + ">");
                          }
                          else if( value === 'ul' ) {
                            //    deferred.resolve();
                            return this.$editor().wrapSelection('insertUnorderedList', null);
                          }
                          else if ( value === 'ol' ) {
                              //  deferred.resolve();
                            return this.$editor().wrapSelection('insertOrderedList', null);
                          }
                          return false;
                        },
                        options: [
                              { name: 'h1',  value: 'H1' },
                              { name: 'h2', css: 'H2', value: 'H2' },
                              { name: 'h3', css: 'H3', value: 'H3' },
                              { name: 'quote', css: 'blockquote', value: 'blockquote' },
                              { name: 'ul', css: 'list-ul', value: 'ul' },
                              { name: 'ol', css: 'list-ol', value: 'ol' }
                            ]
                        });
                    // add the button to the default toolbar definition
                    taOptions.toolbar[1].push('dropdownTest');
                    
/*                    taRegisterTool('fontSize', {
            			display: "<span class='bar-btn-dropdown dropdown'>" +
            					"<button class='btn btn-default dropdown-toggle' type='button' ng-disabled='showHtml()'><i class='fa fa-font'></i><i class='fa fa-caret-down'></i></button>" +
            					"<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='checked-dropdown' style='font-size: {{o.css}}' type='button' ng-click='action(o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
            					"</span>",
            			buttontext: 'FontSize',
                        iconclass: "fa fa-font",
            			action: function(sizedeferred) {
            			    return false;
            	//		    var x = this;
            	//			if (size !== '') {
            	//				return this.$editor().wrapSelection('fontSize', size);
            	//			}
            			},
            			activeState: function(something){
            			    console.log('something',something);
            			  return this.$editor().queryCommandState('fontSize');  
            			},
            			options: [
            				{name: 'Extra Small', css: 'xx-small', value: '1'},
            				{name: 'Small', css: 'x-small', value: '2'},
            				{name: 'Medium', css: 'small', value: '3'},
            				{name: 'Large', css: 'medium', value: '4'},
            				{name: 'Extra Large', css: 'large', value: '5'},
            				{name: 'Huge', css: 'x-large', value: '6'}
            			],
            			setActive: function(font) {
            				// Convert to string if not already
            				if (typeof font !== 'string') { font = String(font) }
            
            				angular.forEach(this.options, function(option) {
            					option['active'] = font === option.value ? true : false;
            				});
            			},
            			getActive: function() {
            				var font = document.queryCommandValue('fontSize');
            				if (font === '') {
            					return 3;
            				} else {
            					return font;
            				}
            			}
            		});
                    taOptions.toolbar[1].push('fontSize');
            		taRegisterTool('fontColor', {
            			display: "<span class='bar-btn-dropdown'><button type='button' colorpicker colorpicker-text-editor='true' colorpicker-parent='true' class='btn btn-default' ng-disabled='isDisabled()'> <i class='fa fa-magic'></i><i class='fa fa-caret-down'></i></button></span>",
            			action: function(color) {
            				if (color !== '') {
            				    var x = this;
            //					return this.$editor().wrapSelection('foreColor', color);
            					 this.$editor().wrapSelection('foreColor', color);
            				}
            			}
            		});
                    taOptions.toolbar[1].push('fontColor');
            		taRegisterTool('backgroundColor', {
            			display: "<span class='bar-btn-dropdown'><button type='button' colorpicker colorpicker-text-editor='true' colorpicker-parent='true' class='btn btn-default' ng-disabled='showHtml()'> <i class='fa fa-magic'></i><i class='fa fa-caret-down'></i></button></span>",
            			action: function(color) {
            				if (color !== '') {
            					return this.$editor().wrapSelection('backColor', color);
            				}
            			}
            		});                    
                    taOptions.toolbar[1].push('backgroundColor');
*/                    
                    return taOptions;
                }]);
            })        
          
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
    'UserServices',
    'textAngularManager'
    ];

    function TestCandidateTableBasicController($routeParams, $log, TestingServices,CalendarServices, $location, $window, $q,
        $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants, $timeout, moment, UserServices, textAngularManager) {
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
        vm.doPDF = doPDF;
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
        vm.htmlcontentdisabled = false;
        vm.htmlcontentcanEdit = true;
        vm.htmlcontentsubmit = htmlcontentsubmit;
        vm.htmlcontentreset = htmlcontentreset;
        vm.htmlcontentclear = htmlcontentclear;
        vm.htmlcontenttestPaste = htmlcontenttestPaste;
        vm.htmlcontentname;
        vm.htmlcontentwebsite;
        vm.encodeImageFileAsURL = encodeImageFileAsURL;
        vm.images;

        activate();

        function setLimit(thelimit) {
            $log.debug('setLimit',thelimit);
            vm.limit = thelimit;
        }

//            <p><img class="ta-insert-video" ta-insert-video="https://www.youtube.com/embed/2maA1-mvicY" src="https://img.youtube.com/vi/2maA1-mvicY/hqdefault.jpg" allowfullscreen="true" width="300" frameborder="0" height="250"/></p> 

        vm.htmlcontentdata = {
            orightml: ' \
            <h2>Try me!</h2> \
            <p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p>'
+ textAngularManager.getVersion().substring(1) +
            '<p><b>Features:</b></p> \
            <ol> \
            <li>Automatic Seamless Two-Way-Binding</li> \
            <li>Super Easy <b>Theming</b> Options</li> \
            <li style="color: green;">Simple Editor Instance Creation</li> \
            <li>Safely Parses Html for Custom Toolbar Icons</li> \
            <li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol> \
            ' 
        };
        vm.htmlcontentdata.htmlcontent = vm.htmlcontentdata.orightml;
                //$scope.$watch('data.htmlcontent', function(val){console.log('htmlcontent changed to:', val);});

        function htmlcontentsubmit() {
            $log.debug('Submit triggered');
        }
        function htmlcontentclear() {
            $log.debug('clear');
            vm.htmlcontentdata = {
                orightml: '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>'
            };
        }
        function htmlcontentreset() {
            $log.debug('reset');
            
            vm.htmlcontentdata.htmlcontent = vm.htmlcontentdata.orightml;
        }
        function htmlcontenttestPaste($html) {
            $log.debug('Hit Paste', arguments);
            return '<p>Jackpot</p>';
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
 //                   filter: {term: "Student"},                    
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
//                    filter: {term: "Student"},                    
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
                        studentname: inputArray[i].FirstName + ' ' + inputArray[i].LastName,
                        rankType: inputArray[i].ranktype
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
        function getCertificateText( certdata, students) {
            //get from db
//Studio
//Reiki
            var textout = [];
            if (students.rankType == "YMCA") {
                textout = [
                    {text: 'YMCA Program',        style: ['ymcaheader']},
                    {text: 'This is to certify that\n',        style: ['smalllines','spread']},
                    {text: students.studentname + '\n', style: ['mediumlines','ymcabotfiller']},
                    {text: 'Has successfully completed an eight week Martial Arts Program in the\nart of Shaolin Kempo Karate and Jiu-Jitsu.\n\n', style: ['smalllines','spread']},
                    {text: 'Dated this ' + certdata.certDate + ' at the MetroWest YMCA\n', style: ['smalllines','spread']}
                    ];
            }
            if (students.rankType == "AdultKarate" || students.rankType == "ChildrenKarate" || students.rankType == "BlackBelt" ) {
                textout = [
                    {text: '',        style: ['topfiller']},
                    {text: 'This is to certify that\n',        style: ['smalllines','spread']},
                    {text: students.studentname + '\n', style: ['mediumlines','botfiller']},
                    {text: 'Has successfully demonstrated the required level of ability and\nknowledge in the art of Shaolin Kempo Karate and Jiu-Jitsu and\n' + certdata.program + '\n', style: ['smalllines','spread']},
                    {text: students.nextRank + '\n', style: ['biglines','bigtop'] },
                    {text: 'Dated this ' + certdata.certDate + ' at ' + certdata.school + '\n', style: ['smalllines','spread']}
                ];
            }
            return textout;
        }
        function getCertificateSignatures( certdata, students) {
            var textout =[];
            textout = [
                  { width: 70, text: ''},
                  { stack: [
                     {text: '', marginTop: 57},
                     {text:  certdata.instructor1 + '\n', marginLeft: 40 - certdata.instructor1.length*1.5/2, style: 'signature'},
                     {text:  certdata.title1.length > 0 ? certdata.title1 : " " , marginLeft: 40 - certdata.title1.length*1.5/2, style: 'signature'},
                     {text: '', marginTop: 38},
                     {text:  certdata.instructor2 + '\n', marginLeft: 40 - certdata.instructor2.length*1.5/2  , style: 'signature'},
                     {text:  certdata.title2.length > 0 ? certdata.title2 : " ", marginLeft: 40 - certdata.title2.length*1.5/2 , style: 'signature'},
                     ]
                  },
                  { width: 190, text: ''},
                  { stack: [
                    {text: '', marginTop: 57},
                     {text:  certdata.instructor3 + '\n', marginLeft: 50 - certdata.instructor3.length*1.5/2 + certdata.instructor1.length*1.5/2, style: 'signature'},
                     {text:  certdata.title3.length > 0 ? certdata.title3 : " " , marginLeft: 50 - certdata.title3.length*1.5/2 + certdata.title1.length*1.5/2, style: 'signature'},
                    {text: '', marginTop: 38},
                     {text:  certdata.instructor4 + '\n', marginLeft: 50 - certdata.instructor4.length*1.5/2 + certdata.instructor2.length*1.5/2, style: 'signature'},
                     {text:  certdata.title4.length > 0 ? certdata.title4 : " " , marginLeft: 50 - certdata.title4.length*1.5/2 + certdata.title2.length*1.5/2, style: 'signature'},
                     ]
                  }
                  ];

            return textout;
        }
        function getContent(students,certdata) {
            $log.debug('getContent entered',students,certdata);
            var contentdtl=[];
            var pagebreak;
            var certtext=[];
            var columns=[];

            for (var i=0; i<students.length; i++) {       
                certtext = getCertificateText(certdata, students[i]);
                columns = getCertificateSignatures(certdata, students[i]);
                if (i < students.length -1  ) {
                    pagebreak = {pageBreak: 'before', text: ''}; 
                } else {
                    pagebreak = {};
                }
            contentdtl.push(
             [
                certtext,
              	{
              	    columns
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
        $log.debug('thecontent', thecontent, 'json', JSON.stringify(thecontent));
        

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
        		  ymcabotfiller: {
        		    margin: [0,12]
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
        		  ymcaheader: {
        		    fontSize: 25,
        		    bold: true,
        		    margin: [270,45,0,20],
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
        
        var myJsonString = JSON.stringify(docDefinition);
            $log.debug('doc json',myJsonString);
        
        var now = new Date();
        //var pdfDoc = printer.createPdfKitDocument(docDefinition);
        //pdfDoc.pipe(fs.createWriteStream('pdfs/images.pdf'));
        //pdfDoc.end();
        
        // pdfMake.createPdf(docDefinition).download('Report.pdf');
         pdfMake.createPdf(docDefinition).open();
        }

        function doPDF() {
         //debug   var tb = textAngularManager.getToolbarScopes();
            pdfForElement('convertthis').open();
        }

        function pdfForElement(id) {
            var students = vm.selectedStudents;
            var sl;
            var elementStyles = {
                "b": ["font-weight:bold"],
                "strong": ["font-weight:bold"],
                "u": ["text-decoration:underline"],
                "em": ["font-style:italic"],
                "i": ["font-style:italic"],
                "h1": ["font-size:36", "font-weight:bold"],
                "h2": ["font-size:30", "font-weight:bold"],
                "h3": ["font-size:24", "font-weight:bold"],
                "h4": ["font-size:18"],
                "h5": ["font-size:14"],
                "h6": ["font-size:12"],
                "a": ["color:blue", "text-decoration:underline"],
                "strike": ["text-decoration:line-through"],
                "del": ["color:red", "text-decoration:line-through"],
                "ins": ["color:green", "text-decoration:underline"]
            };
            var classStyles = {
                            "delete": ["color:red", "text-decoration:line-through"],
                            "insert": ["color:green", "text-decoration:underline"]
                        };
            var regBoarder = '	{ ' +
    			'	hLineWidth: function (i, node) { ' +
    			'		return (i === 0 || i === node.table.body.length) ? 2 : 1; ' +
    			'	}, ' +
    			'	vLineWidth: function (i, node) { ' +
    			'		return (i === 0 || i === node.table.widths.length) ? 2 : 1; ' +
    			'	}, ' +
    			'	hLineColor: function (i, node) { ' +
    			'		return (i === 0 || i === node.table.body.length) ? "black" : "gray"; ' +
    			'	}, ' +
    			'	vLineColor: function (i, node) { ' +
    			'		return (i === 0 || i === node.table.widths.length) ? "black" : "gray"; ' +
    			'	} }';
            var zebra = {  fillColor: function (i, node) { return (i % 2 === 0) ?  "#CCCCCC" : null; } } ;
            var borderclassStyles = {
                            "table-noborders": ["noBorders"],
                            "table-bordered": [regBoarder],
                            "table-striped": [zebra],
                            "table-headerlineonly": ["headerLineOnly"],
                            "table-lighthorizontallines": ["lightHorizontalLines"]
                        };
              function ParseContainer(cnt, e, p, styles) {
                var elements = [];
                var children = e.childNodes;
                if (children.length !== 0) {
                  for (var i = 0; i < children.length; i++) {
                      p = ParseElement(elements, children[i], p, styles);
                  }
                }
                if (elements.length !== 0) {
                  for (var i = 0; i < elements.length; i++) {
                      cnt.push(elements[i]);
                  }
                }
                return p;
              }
              function parseColor(color) {
                    var hexRegex = new RegExp('^#([0-9a-f]{3}|[0-9a-f]{6})$');
                    // e.g. #fff or #ff0048
                    var rgbRegex = new RegExp('^rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)$');
                    // e.g. rgb(0,255,34) or rgb(22, 0, 0)
                    var nameRegex = new RegExp('^[a-z]+$');
                    // matches just text like 'red', 'black', 'green'

                    if (hexRegex.test(color)) {
                        return color;
                    } else if (rgbRegex.test(color)) {
                        var decimalColors = rgbRegex.exec(color).slice(1);
                        for (var i = 0; i < 3; i++) {
                            var decimalValue = parseInt(decimalColors[i]);
                            if (decimalValue > 255) {
                                decimalValue = 255;
                            }
                            var hexString = '0' + decimalValue.toString(16);
                            hexString = hexString.slice(-2);
                            decimalColors[i] = hexString;
                        }
                        return '#' + decimalColors.join('');
                    } else if (nameRegex.test(color)) {
                        return color;
                    } else {
                        console.error('Could not parse color "' + color + '"');
                        return color;
                        }
              }
              function ComputeStyle(o, styles) {
                  $log.debug('computestyle in', styles, o);
//                  if (o.stack !== undefined) {
                    for (var i = 0; i < styles.length; i++) {
                      var st = styles[i].trim().toLowerCase().split(":");
                      if (st.length === 2) {
                          st[1] = st[1].trim();
                          $log.debug("has a style", st[1],st[2], o);
                        switch (st[0]) {
                          case "padding-left": 
                            {
                                o.margin = [parseInt(st[1]), 0, 0, 0];
                                break;
                            }
                          case "font-size":
                            {
                              o.fontSize = parseInt(st[1]);
                              break;
                            }
                          case "style":
                            {
                              o.style = st[1];
                              break;
                            }
                          case "text-align":
                            {
                              switch (st[1]) {
                                case "right":
                                  o.alignment = 'right';
                                  break;
                                case "center":
                                  o.alignment = 'center';
                                  break;
                                case "justify":
                                  o.alignment = 'justify';
                                  break;
                              }
                              break;
                            }
                          case "font-weight":
                            {
                              switch (st[1]) {
                                case "bold":
                                  o.bold = true;
                                  break;
                              }
                              break;
                            }
                          case "text-decoration":
                            {
                              switch (st[1]) {
                                case "underline":
                                  o.decoration = "underline";
                                  break;
                                case "line-through":
                                    o.decoration = "lineThrough";
                                    break;
                              }
                              break;
                            }
                          case "font-style":
                            {
                              switch (st[1]) {
                                case "italic":
                                  o.italics = true;
                                  break;
                              }
                              break;
                            }
                        case "color":
                            o.color = parseColor(st[1]);
                            break;
                        case "background-color":
                            o.background = parseColor(st[1]);
                            break;                            
                        }
                      }
                    }
//                  }
                  $log.debug('computestyle done', o);
                
              }
            
              function ParseElement(cnt, e, p, styles) {
                var classes = [];
                if (!styles) styles = [];
                if (e.getAttribute) {
                    var nodeStyle = e.getAttribute("style");
                    if (nodeStyle) {
                        nodeStyle.split(";").forEach(function(nodeStyle) {
                            var tmp = nodeStyle.replace(/\s/g, '');
                            styles.push(tmp);
                        });
                    }
                    var nodeColor = e.getAttribute("color");
                    if (nodeColor) {
                        styles.push("color: " + nodeColor);
                    }    
                    var nodeClass = e.getAttribute("class");
                    if (nodeClass) {
                        classes = nodeClass.toLowerCase().split(" ");
                        classes.forEach(function(nodeClass) {
                            if (typeof(classStyles[nodeClass]) != 'undefined') {
                                classStyles[nodeClass].forEach(function(style) {
                                    styles.push(style);
                                });
                            }
/*                            if (nodeClass == 'insert') {
                                diff_mode = DIFF_MODE_INSERT;
                            }
                            if (nodeClass == 'delete') {
                                diff_mode = DIFF_MODE_DELETE;
                            }
                    */        
                        });
                    }
                }
            
                $log.debug("parseelement",e, e.nodename);
                switch (e.nodeName.toLowerCase()) {
                  case "#text":
                    {
                       sl =  e.textContent.replace(/\n/g, "");
                          $log.debug('in text',sl, 'len', sl.length);
                        if (sl.length > 0) {
                          var t = {
                            text: e.textContent.replace(/\n/g, "")
                          };
                          if (styles) ComputeStyle(t, styles);
                          if (Array.isArray(p.text)) {
                              p.text.push(t);
                          } else {
                              $log.debug("skipping text", p);
                          }
                          $log.debug('in text',e.textContent, p);
                        }
                      break;
                    }
        
                                case "a":
                                case "b":
                                case "u":
                                case "em":
                                case "i":
                                case "ins":
                                case "del":
                                case "strike":
                  case "strong":
                    {
                      //styles.push("font-weight:bold");
                    //  ParseContainer(cnt, e, p, styles.concat(["font-weight:bold"]));
                        p = ParseContainer(cnt, e, p, styles.concat(elementStyles[e.nodeName.toLowerCase()]));
                      break;
                    }
                     case "h1":
                                case "h2":
                                case "h3":
                                case "h4":
                                case "h5":
                  case "h6":
                    {
/*                        $log.debug('h1',cnt, e, p);
                  //    p = CreateParagraph();
                //       st = {
                 //       stack: []
                  //    };
                //      st.stack.push(p);
                //      ComputeStyle(st, styles);
                  //    ParseContainer(st.stack, e, p, styles.concat(["font-size:24"]));
                    //  cnt.push(st);
                      var st = {
                        text: e.textContent.replace(/\n/g, "")
                      };
                      ComputeStyle(st, styles.concat(["font-size:24","style:topfiller"]));
//                      ComputeStyle(st, styles.concat(["style:topfiller"]));
//                      p.text.push(st);
                      cnt.push(st);
*/
                    p = CreateParagraph();
                    p.marginBottom = 4;
                    p.marginTop = 10;
                    p = ParseContainer(cnt, e, p, styles.concat(elementStyles[e.nodeName.toLowerCase()]));
                        cnt.push(p);          
                      break;
                    }
                  case "span":
                    {
                      p = ParseContainer(cnt, e, p, styles);
                      break;
                    }
                  case "br":
                    {
                      p = CreateParagraph();
                      cnt.push(p);
                      break;
                    }
                  case "table":
                    {
                      var t = create("table", {
                                        headerRows: 1,
                                        style: 'tableExample',
                                        widths: [],
                                        body: []
                                    });
                      var border = e.getAttribute("border");
                      var isBorder = false;
                      var borderclass = "";
                      var borderclasses =[];
                      var mlayouts=[];
                      if (border) {
                        if (parseInt(border) == 1) isBorder = true;
                      } else {
                          borderclass = e.getAttribute("class");
                          if (borderclass.length > 0) {
                                borderclasses = borderclass.toLowerCase().split(" ");
//                                borderclasses.forEach(function(borderclass) {
                                    for(var i=0,len=borderclasses.length;i < len;i++){
                                        if (typeof(borderclassStyles[borderclasses[i]]) !== 'undefined') {
                                            
                                            borderclassStyles[borderclasses[i]].forEach(function(layout) {
                                                mlayouts.push(layout);
                                            });
                                        }
                                    }
                                if (mlayouts.length > 0) {
                                    t.layout =  mlayouts[0] ;
                                } else {t.layout = 'noBorders';}
                            } else {              
                                t.layout = 'noBorders';
                            }
                      }
                      
                      p = ParseContainer(t.table.body, e, p, styles);
            
                      var widths = e.getAttribute("widths");
                      if (!widths) {
                        if (t.table.body.length !== 0) {
                          if (t.table.body[0].length !== 0)
                            for (var k = 0; k < t.table.body[0].length; k++) 
                                t.table.widths.push("*");
                        }
                      } else {
                        var w = widths.split(",");
                        for (var k = 0; k < w.length; k++) 
                            t.table.widths.push(w[k]);
                      }
                      cnt.push(t);
                      break;
                    }
                  case "tbody":
                    {
                      p = ParseContainer(cnt, e, p, styles);
                      //p = CreateParagraph();
                      break;
                    }
                  case "tr":
                    {
                      var row = [];
                      p = ParseContainer(row, e, p, styles);
                      cnt.push(row);
                      break;
                    }
                  case "td":
                    {
                        p = create("text");
                        var st = create("stack");
                        st.stack.push(p);
                        var rspan = e.getAttribute("rowspan");
                        if (rspan)
                            st.rowSpan = parseInt(rspan,10);
                        var cspan = e.getAttribute("colspan");
                        if (cspan)
                            st.colSpan = parseInt(cspan,10);
                        p = ParseContainer(row, e, p, styles);
                        cnt.push(st);
                        break;
                    }
                    case "div":
                  case "li":
                    {
                      $log.debug("li found");
                      
                      p = CreateParagraph();
                      p.lineHeight = 1.25;
                      var st = {
                        stack: []
                      };
                      st.stack.push(p);
                      ComputeStyle(st.stack, styles);
                      st.stack.styles = styles;
                      p = ParseContainer(st.stack, e, p, styles);
            
                      cnt.push(st);
                      break;
                    }
                    
                  case "ol":
                  case "ul":
                      {
                        $log.debug(e.nodeName,cnt, e, p);
                          var list = create(e.nodeName.toLowerCase());
                          ComputeStyle(list, styles);
                          p = ParseContainer(list[e.nodeName.toLowerCase()], e, p, styles);
                          list.margin = [20, 0, 0, 0];
                          cnt.push(list);
                          break;
                      }                          
                  case "font":
                      {
                          $log.debug("font found");
                          p = CreateParagraph();
                          var st = {
                            stack: []
                          };
                          st.stack.push(p);
                          ComputeStyle(st, styles);
                          p = ParseContainer(st.stack, e, p, styles);
                          cnt.push(st);
    
                      break;
                      }
                  case "p": 
                    {
                      $log.debug("p found");
                      p = create("text");
                      p.lineHeight = 1.25;
//                      p.margin = [20, 0, 0, 0];                      
//                      if (classes.indexOf("merge-before") === -1) {
//                         p.margin[1] = 8;
//                      }                      
                      var stackP = create("stack");
                      stackP.stack.push(p);
                      ComputeStyle(stackP, styles);
                      p = ParseContainer(stackP.stack, e, p, []);

                      cnt.push(stackP);
                      break;
                    }
                  case "img":
                    {
                        var regex = /([\w-]*)\s*:\s*([^;]*)/g;
                        var match; //helper variable for the refegex
                        var imageSize={};
                        var maxResolution = {
                            width: 435,
                            height: 830
                        };

                        if (e.getAttribute("style")) {
                            while ((match = regex.exec(e.getAttribute("style"))) !== null) {
                                imageSize[match[1]] = parseInt(match[2].trim());
                            }
                        } else {
                            imageSize = {
                                height: images[element.getAttribute("src")].height,
                                width: images[element.getAttribute("src")].width
                            };
                        }

                        if (imageSize.width > maxResolution.width) {
                            var scaleByWidth = maxResolution.width/imageSize.width;
                            imageSize.width *= scaleByWidth;
                            imageSize.height *= scaleByWidth;
                        }
                        if (imageSize.height > maxResolution.height) {
                            var scaleByHeight = maxResolution.height/imageSize.height;
                            imageSize.width *= scaleByHeight;
                            imageSize.height *= scaleByHeight;
                        }
                        cnt.push({
                            image: images[e.getAttribute("src")].data,
                            width: imageSize.width,
                            height: imageSize.height
                        });
                        break;
                    }
                  default:
                    {
                      $log.debug("Parsing for node " + e.nodeName + " not found");
                        var defaultText = create("text", e.textContent.replace(/\n/g, ""));
                        ComputeStyle(defaultText, styles);
                        if (!p) {
                            p = {};
                            p.text = [];
                        }
                        p.text.push(defaultText);
                        break;                      
                    }
                }
                return p;
              }
            
              function ParseHtml(cnt, htmlText) {
                var html = $(htmlText.replace(/\t/g, "").replace(/\n/g, ""));
                var p = CreateParagraph();
                for (var i = 0; i < html.length; i++){
                    ParseElement(cnt, html.get(i), p);
                }
                $log.debug('parsehmtl', p, cnt);
                return cnt;
              }
            
              function CreateParagraph() {
                var p = {
                  text: []
                };
                return p;
              }

               /**
                 * Creates containerelements for pdfMake
                 * e.g create("text":"MyText") result in { text: "MyText" }
                 * or complex objects create("stack", [{text:"MyText"}, {text:"MyText2"}])
                 *for units / paragraphs of text
                 *
                 * @function
                 * @param {string} name      - name of the attribute holding content
                 * @param {object} content   - the actual content (maybe empty)
                 */
                function create(name, content) {
                    var o = {};
                    content = content || [];
                    o[name] = content;
                    return o;
                };
                
            var content=[];
            //  ParseHtml(content, document.getElementById(id).outerHTML);
//            var mycontent = ParseHtml(content, document.getElementById(id).innerHTML);
            var mycontent = ParseHtml(content,vm.htmlcontentdata.htmlcontent);
            $log.debug('after parsehmtl',mycontent,students, typeof(students), students.length);
            var contentdtl = [];
            var tmp;
            var obj;
            var pagebreak;
            if (typeof(students) !== 'undefined' && students.length > 0 ) {
                for (var i=0; i<students.length; i++) {       
                    $log.debug('process student:',students[i]);
                    if (i < students.length -1  ) {
                        pagebreak = {pageBreak: 'before', text: ''}; 
                    } else {
                        pagebreak = {};
                    }
                    $log.debug("types", mycontent.length, typeof(pagebreak));
                    tmp=JSON.stringify(mycontent[0]);
                    for (var j=1; j<mycontent.length; j++ ) {
                        $log.debug("mycon j", JSON.stringify(mycontent[j]) );
                        tmp = tmp + ',' + JSON.stringify(mycontent[j]);
                    }
                    obj = JSON.parse('[' + tmp + ']');
                    contentdtl.push([
                        obj,
                    {text:  students[i].studentname, style: ['mediumlines','botfiller']},
                    pagebreak
                        ]);

                }

            } else {
                contentdtl = [mycontent];
            }
                var rptwidth = 792;
                var rptheight = 600;
                var testImageDataUrl ='data:image/png;base64,'+ getBase64Image("images/logos/StudioDiplomaTemplate.png");
          
                  var docDefinition = {
/*                  pageOrientation: 'landscape',
                  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                  pageMargins: [ 40, 60, 40, 0 ],
                  pageSize: 'LETTER',
 */ /*                background: [
                   {
               			image: testImageDataUrl,
                       width: rptwidth,
                       height: rptheight
                   }],
    */               content: contentdtl,
                styles: {
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
            			margin: [0, 5, 0, 15]
            		},
            		tableHeader: {
            			bold: true,
            			fontSize: 13,
            			color: 'black'
            		}
            	}
    /*    		styles: {
        		  bigtop: {
        		    margin: [0,0,0,0]
        		  },
        		  topfiller: {
        		    margin: [0,40]
        		  },
        		  botfiller: {
        		    margin: [0,5]
        		  },
        		  ymcabotfiller: {
        		    margin: [0,12]
        		  },
        		  spread: {
        		    margin: [0,5]
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
        		  ymcaheader: {
        		    fontSize: 25,
        		    bold: true,
        		    margin: [270,45,0,20],
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
    */
                };
            var myJsonString = JSON.stringify(docDefinition);
            $log.debug('doc json',myJsonString);
                
            return     pdfMake.createPdf(docDefinition);
        
        }

        function encodeImageFileAsURL(fileid,fileoutid) {
      
          var filesSelected = document.getElementById(fileid).files;
          if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];
      
            var fileReader = new FileReader();
      
            fileReader.onload = function(fileLoadedEvent) {
              var srcData = fileLoadedEvent.target.result; // <--- data: base64
      
              var newImage = document.createElement('img');
              newImage.src = srcData;
      
              document.getElementById(fileoutid).innerHTML = newImage.outerHTML;
              alert("Converted Base64 version is " + document.getElementById(fileoutid).innerHTML);
             // $log.debug("Converted Base64 version is " + document.getElementById(fileoutid).innerHTML);
            };
            fileReader.readAsDataURL(fileToLoad);
          }
        }


    }

})();
