
(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('TestCandidateTableBasicController', TestCandidateTableBasicController)
            .config(function($provide) {
                // this demonstrates how to register a new tool and add it to the default toolbar
//                $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating

                $provide.decorator('taOptions', ['taRegisterTool', 'taToolFunctions', '$uibModal', '$log', '$window',  '$delegate' ,
                                                 function(taRegisterTool, taToolFunctions, $uibModal, $log, $window, taOptions ){

                                    var varlist = [
                            { name: 'Student Name', value: 'studentname' },
                            { name: 'First Name', value: 'FirstName' },
                            { name: 'Last Name',  value: 'LastName' },
                            { name: 'Certificate Date',  value: 'certDate' },
                            { name: 'Next Rank',  value: 'nextRank' },
                            { name: 'Test Start Time',  value: 'teststarttime' },
                            { name: 'Test Fee',  value: 'testfee' },
                            { name: 'Belt Size',  value: 'beltsize' },
                            { name: 'Class Was',  value: 'classwas' },
                            { name: 'Program Was',  value: 'pgmwas' },
                            { name: 'daysAttended',  value: 'daysAttended' },
                            { name: 'daysSinceLastTest',  value: 'daysSinceLastTest' },
                            { name: 'lastPromoted',  value: 'lastPromoted' },
                            { name: 'email',  value: 'email' },
                            { name: 'address',  value: 'address' },
                            { name: 'state',  value: 'state' },
                            { name: 'city',  value: 'city' },
                            { name: 'zip',  value: 'zip' },
                            { name: 'parent',  value: 'parent' },
                            { name: 'phone',  value: 'phone' },
                            { name: 'birthday',  value: 'birthday' },
                            { name: 'age category',  value: 'agecat' },
                            { name: 'class category',  value: 'classcat' },
                            { name: 'class',  value: 'nclass' },
                            { name: 'Program category',  value: 'pgrmcat' },
                            { name: 'next class',  value: 'nextClass' },
                            { name: 'Instructor 1',  value: 'instructor1' },
                            { name: 'Instructor 2',  value: 'instructor2' },
                            { name: 'Instructor 3',  value: 'instructor3' },
                            { name: 'Instructor 4',  value: 'instructor4' },
                            { name: 'Instructor Title1',  value: 'title1' },
                            { name: 'Instructor Title2',  value: 'title2' },
                            { name: 'Instructor Title3',  value: 'title3' },
                            { name: 'Instructor Title4',  value: 'title4' }
                        ];

                    function createTable(tableParams) {
                        if(angular.isNumber(tableParams.row) && angular.isNumber(tableParams.col)
                                && tableParams.row > 0 && tableParams.col > 0){
/*
                                var table = "<table class='table  " 
                                + (tableParams.style ? "table-" + tableParams.style : '')  
                                + "'" +
                                " style='"
                                +"margin-bottom: " + tableParams.tblMarginB 
                                +"px; margin-top: " + tableParams.tblMarginT
                                +"px; margin-left: " + tableParams.tblMarginL
                                +"px; margin-right: " + tableParams.tblMarginR
                                +"px; '>";
*/
                                var table = "<div "
                                + " style='"
                                +"margin-bottom: " + tableParams.tblMarginB 
                                +"px; margin-top: " + tableParams.tblMarginT
                                +"px; margin-left: " + tableParams.tblMarginL
                                +"px; margin-right: " + tableParams.tblMarginR
                                +"px; '>"
                                + "<table class='table " 
                                + (tableParams.style ? "table-" + tableParams.style : '')  
                                + "'>" ;

                            var colWidth,col,row;
                            if (tableParams.style === "vars") {
                                colWidth = 100/varlist.length;
                                col = "<col width='" + colWidth + "%' >";
                                for (var idxCol = 0; idxCol < varlist.length; idxCol++) {
                                    table += col;
                                }
                            } else {
                                colWidth = 100/tableParams.col;
                                col = "<col width='" + colWidth + "%' >";
                                for (var idxCol = 0; idxCol < tableParams.col; idxCol++) {
                                    table += col;
                                }
                            }                            
                            for (var idxRow = 0; idxRow < tableParams.row; idxRow++) {
                                row = "<tr>";
                                if (tableParams.style === "SampleText") {
                                    for (var idxCol = 0; idxCol < tableParams.col; idxCol++) {
                                        row += "<td" 
    //                                        + (idxRow == 0 ? " style='width: " + "colWidth" + "%;'" : "")
                                            +">Sample Cell</td>";
                                    }
                                } else if (tableParams.style === "vars") {
                                    for (var v = 0; v < varlist.length; v++) {
                                        row += "<td" 
                                            +">{" + varlist[v].value + "}</td>";
                                    }
                                } else {
                                    for (var idxCol = 0; idxCol < tableParams.col; idxCol++) {
                                        row += "<td" 
                                            +"></td>";
                                    }
                                    
                                }
                                table += row + "</tr>";
                            }
                            return table + "</table>";
                        }
                    }
                    
                    function createImage(imageParams) {
                        $log.debug("createImage entered", imageParams);
                        var images=[];
                        for (var iter=0;iter < imageParams.bodyimages.length;iter++) {
                            images[iter]=' <img height="' + imageParams.height + '"  width="' + imageParams.width + '" src="' + imageParams.bodyimages[iter] + '"/>';
                        }
                        return images;
                    }

                    taOptions.toolbar = [
                    				['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                    				['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
                    				['justifyLeft','justifyCenter','justifyRight', 'justifyFull', 'indent', 'outdent'],
                    				['html', 'charcount']
                    			];
//                    				['html', 'insertImage', 'insertLink', 'charcount']

                    taOptions.disableSanitizer = true;
                    
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
                                    $scope.newtable.tblMarginL = 25;
                                    $scope.newtable.tblMarginR = 25;
                                    $scope.newtable.tblMarginT = 5;
                                    $scope.newtable.tblMarginB = 5;
                                    $scope.tablestyles = [
                                                          { name: 'Bordered', value: 'bordered' },
                                                          { name: 'Striped', value: 'striped' },
                                                          { name: 'HeaderlineOnly', value: 'HeaderlineOnly' },
                                                          { name: 'LightHorizontalLines', value: 'LightHorizontalLines' },
                                                          { name: 'Striped', value: 'striped' },
                                                          { name: 'Borderd Striped', value: 'striped table-bordered' }];
                                    $scope.samplestyles = [
                                                          { name: 'SampleText', value: 'sampletext' },
                                                          { name: 'Vars', value: 'vars' }];

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
                        }
                    });
                    taOptions.toolbar[1].push('insertTable');

                    taRegisterTool('VInsertImage', {
                        iconclass: 'fa fa-picture-o',
                        tooltiptext: 'Insert Image',
                        action: function(deferred){
                            var textAngular=this;
                            var savedSelection = rangy.saveSelection();
                            
                            $uibModal.open({
                                templateUrl: 'templates/states/textblockimage.html',
                                windowClass: 'modal-window-sm',
                                backdrop: 'static',
                                keyboard: false,
                                controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                                    $scope.vm ={};
                                    $scope.vm.height = 100;
                                    $scope.vm.width = 100;
                                    $scope.vm.imagelist =[];
                                    $scope.vm.bodyimages = [];
                                    $scope.imgLoadedCallback = function(event) {
                                      $log.debug("imgLoadedCallback entered",event);
                                      $scope.vm.imagelist.push( {
                                          data: event.target.currentSrc,
                                          naturalHeight: event.target.naturalHeight,
                                          naturalWidth: event.target.naturalWidth
                                      });
                                    };                                     
                                    $scope.tblInsert = function () {
                                        $uibModalInstance.close($scope.vm);
                                    };
            
                                    $scope.tblCancel = function () {
                                        $uibModalInstance.dismiss("cancel");
                                    };
                                }],
                                size: 'lg'
                            
                            //define result modal , when user complete result information 
                            }).result.then(function(result){
                                    rangy.restoreSelection(savedSelection)
                                    textAngular.$editor().wrapSelection('insertHTML', createImage(result));
                                    deferred.resolve();
                                },
                            function () {
                                rangy.restoreSelection(savedSelection)
                                deferred.resolve();
                                }
                            );                            
                            return false;
                        }
                    });
                    taOptions.toolbar[1].push('VInsertImage');

                    taRegisterTool('fontSize', {
                        display: "<span class='bar-btn-dropdown dropdown'>" +
                        "<button class='btn btn-dark btn-plugin dropdown-toggle' style='margin-top: 5px;' type='button' ng-disabled='showHtml()'><i class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button>" +
                        "<ul class='dropdown-menu plugin-dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-size: {{o.css}};' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
                        "</span>",
                        action: function (event, size) {
                            if (!!event.stopPropagation) {
                                event.stopPropagation();
                                $("body").trigger("click");
                            }
                            return this.$editor().wrapSelection('fontSize', parseInt(size));
                        },
                        options: [
                            { name: 'xx-small', css: 'xx-small', value: 1 },
                            { name: 'x-small', css: 'x-small', value: 2 },
                            { name: 'small', css: 'small', value: 3 },
                            { name: 'medium', css: 'medium', value: 4 },
                            { name: 'large', css: 'large', value: 5 },
                            { name: 'x-large', css: 'x-large', value: 6 },
                            { name: 'xx-large', css: 'xx-large', value: 7 }
        
                        ]
                    });
                    taOptions.toolbar[1].push('fontSize');
            
                     taRegisterTool('fontName', {
                            display: "<span class='bar-btn-dropdown dropdown'>" +
                            "<button class='btn btn-dark btn-plugin dropdown-toggle' style='margin-top: 5px;' type='button' ng-disabled='showHtml()'><i class='fa fa-font'></i><i class='fa fa-caret-down'></i></button>" +
                            "<ul class='dropdown-menu plugin-dropdown-menu'><li ng-repeat='o in options'><button class='checked-dropdown' style='font-family: {{o.css}};' type='button' ng-click='action($event, o.css)'><i ng-if='o.active' class='fa fa-check'></i>{{o.name}}</button></li></ul></span>",
                            action: function (event, font) {
                                if (!!event.stopPropagation) {
                                    event.stopPropagation();
                                    $("body").trigger("click");
                                }
                                return this.$editor().wrapSelection('fontName', font);
                            },
                            options: [
                                { name: 'Sans-Serif', css: 'Arial, Helvetica, sans-serif' },
                                { name: 'Serif', css: "'times new roman', serif" },
                                { name: 'Wide', css: "'arial black', sans-serif" },
                                { name: 'Garamond', css: 'garamond, serif' },
                                { name: 'Georgia', css: 'georgia, serif' },
                                { name: 'Tahoma', css: 'tahoma, sans-serif' },
                                { name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif" },
                                { name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
                                { name: 'Verdana', css: 'verdana, sans-serif' },
                                { name: 'Proxima Nova', css: 'proxima_nova_rgregular' }
                            ]
                        });
                    taOptions.toolbar[1].push('fontName');

                    taRegisterTool('vars', {
                        display: "<span class='bar-btn-dropdown dropdown'>" +
                        "<button class='btn btn-dark btn-plugin dropdown-toggle' style='margin-top: 5px;' type='button' ng-disabled='showHtml()'>Vars {} <i class='fa fa-caret-down'></i></button>" +
                        "<ul class='dropdown-menu plugin-dropdown-menu'><li ng-repeat='o in options'><button class='btn  checked-dropdown' type='button' ng-click='action($event, false, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
                        "</span>",
                        action: function (event, restoreSelection, size) {
                            if (!!event.stopPropagation) {
                                event.stopPropagation();
                                //Then click in the body to close the dropdown.
                                $("body").trigger("click");
                                this.$editor().wrapSelection('inserthtml', '{'+size+'}');
                            }
                            return false;
                        },
//                        options: [
//                            { name: 'Student Name', value: 'studentname' },
//                            { name: 'Instructor Title4',  value: 'title4' }
//                        ]
                        options: varlist
                    });
                    taOptions.toolbar[1].push('vars');

                    taRegisterTool('insertHRdashed', {
                        iconclass: 'ti-line-dashed',
                        tooltiptext: 'Insert Dashed Line',
                            action: function () {                
//                         this.$editor().wrapSelection('insertHtml', '<hr style="border: 1px dashed black;" />',true);             
                         this.$editor().wrapSelection('insertHtml', '<div><hr class="dashed" /></div>','true');             
                            }
                    });
                    taOptions.toolbar[1].push('insertHRdashed');
                    
                    taRegisterTool('insertHRsolid', {
                        iconclass: "ti-arrows-horizontal",
                        tooltiptext: 'Insert Solid Line',
                        action: function() {
                            this.$editor().wrapSelection('inserthorizontalrule', 'false', null);
                        }
                    });
                    taOptions.toolbar[1].push('insertHRsolid');
/*
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
  */                  
                    taRegisterTool('backgroundColor', {
                        display: "<div spectrum-colorpicker ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
                        action: function (color) {
                            var me = this;
                            if (!this.$editor().wrapSelection) {
                                setTimeout(function () {
                                    me.action(color);
                                }, 100);
                            } else {
                                return this.$editor().wrapSelection('backColor', color);
                            }
                        },
                        options: {
                            replacerClassName: 'fa fa-paint-brush', showButtons: false
                        },
                        color: "#fff"
                    });
                    taOptions.toolbar[1].push('backgroundColor');
                    
                    taRegisterTool('fontColor', {
                        display:"<spectrum-colorpicker trigger-id='{{trigger}}' ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></spectrum-colorpicker>",
                        action: function (color) {
                            var me = this;
                            if (!this.$editor().wrapSelection) {
                                setTimeout(function () {
                                    me.action(color);
                                }, 100);
                            } else {
                                return this.$editor().wrapSelection('foreColor', color);
                            }
                        },
                        options: {
                            replacerClassName: 'fa fa-font', showButtons: false
                        },
                        color: "#000"
                    });
                    taOptions.toolbar[1].push('fontColor');
                  
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
})
        .directive('sbLoad', ['$parse', function ($parse) {
            return {
              restrict: 'A',
              link: function (scope, elem, attrs) {
                var fn = $parse(attrs.sbLoad);
                elem.on('load', function (event) {
                  scope.$apply(function() {
                    fn(scope, { $event: event });
                  });
                });
              }
            };
        }])
        .controller('ModalTestRptInstanceController', ModalTestRptInstanceController);


  ModalTestRptInstanceController.$inject = [
      '$log',
      '$uibModalInstance',
      'TestingServices',
      '$window',
      'Notification',
      'uiGridConstants'
    ];





  function ModalTestRptInstanceController( $log, $uibModalInstance, TestingServices, $window, Notification, uiGridConstants) {
    /* jshint validthis: true */
    var vmnew = this;
    console.log('modal TestRpt entered');
    console.log(vmnew);

    vmnew.path = '../v1/TestRpt';
    vmnew.printAll = printAll;
    vmnew.printSelected = printSelected;
    vmnew.cancel = cancel;
    vmnew.message = '';
    vmnew.rptgridOptionsnew = TestingServices.getGrid();
    vmnew.rptgridApi = TestingServices.getGridApi();
    vmnew.testDate = TestingServices.getTestDate();
    vmnew.testTime = TestingServices.getTestTime();
    
    vmnew.rptgridOptionsnew.onRegisterApi = function( gridApi ) {
    vmnew.rptgridApi = gridApi;
    
  };

    function printAll() {
        console.log('hit print');
        $log.debug('ModalTestRptInstanceController ready to close');
        vmnew.rptgridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            //rows, col = selected, visible
        //    rptGridOptions.grid.api.exporter.pdfExport('selected', 'visible');          
          vmnew.rptgridApi.grid.api.exporter.pdfExport('all','visible');
//          $uibModalInstance.close();
    }
    function printSelected() {
        console.log('hit print sel');
        $log.debug('ModalTestRptInstanceController ready to close');
        vmnew.rptgridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
          vmnew.rptgridApi.grid.api.exporter.pdfExport('selected','visible');
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }
        
        
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
    'TemplateServices',
    'AttendanceServices',
    'textAngularManager',
    '$uibModal'
    ];

    function TestCandidateTableBasicController($routeParams, $log, TestingServices,CalendarServices, $location, $window, $q,
        $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants, $timeout, moment, UserServices, TemplateServices, AttendanceServices, textAngularManager, $uibModal) {
        /* jshint validthis: true */

        var vm=this;
        
        vm.gettestcandidateList = gettestcandidateList;
        vm.gettestcandidateDetails = gettestcandidateDetails;
        vm.updatetestcandidate = updatetestcandidate;
        vm.promotetestcandidate = promotetestcandidate;
        vm.gettestcandidateNames = gettestcandidateNames;
        vm.getInstructorList = getInstructorList;
        vm.getTestDates = getTestDates;
        vm.updateTest = updateTest;
        vm.addToTest = addToTest;
        vm.removeFromTest = removeFromTest;        
        vm.doPDF = doPDF;
        vm.setLimit = setLimit;
        vm.createtestcandidate = createtestcandidate;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.createCertificate = createCertificate;
        vm.createTestChecklist = createTestChecklist;
        vm.genPDF = genPDF;
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
        vm.resgridApi;
        vm.resgridOptions={};
        vm.selectedStudents=[];
        vm.TestCandidateSelected = '';
        vm.testcandidatenames=[];
        vm.instructorlist=[];
        vm.testcandidate = '';
        vm.ContactID = '';
        vm.selected = false;
        vm.testname;
        vm.testtype;
        vm.userdta;
        vm.htmlcontentdisabled = false;
        vm.htmlcontentcanEdit = true;
        vm.htmlcontentsubmit = htmlcontentsubmit;
        vm.htmlcontentreset = htmlcontentreset;
        vm.htmlcontentclear = htmlcontentclear;
        vm.getTemplateNames = getTemplateNames;
        vm.gettemplateDetails = gettemplateDetails;
        vm.updatetemplate = updatetemplate;
        vm.removetemplate = removetemplate;
        vm.createtemplate = createtemplate;
        vm.setHeaderLogo = setHeaderLogo;
        vm.setFooterLogo = setFooterLogo;
        vm.setBodyImage = setBodyImage;
        vm.setBackgroundImage = setBackgroundImage;
        vm.htmlcontenttestPaste = htmlcontenttestPaste;
        vm.testdateshow = testdateshow;
        vm.changeTab = changeTab;
        vm.templatedetails="";
        vm.templatename="";
        vm.templatelist=[];
        vm.htmlcontentname="";
        vm.htmlcontentwebsite="";
        vm.encodeImageFileAsURL = encodeImageFileAsURL;
        vm.refresHtml = refresHtml;
        vm.bodyimages=[];
        vm.headerimages=[];
        vm.footerimages=[];
        vm.backgroundimages=[];
        vm.htmlbackground=[];
        vm.pageSizes=['EXECUTIVE', 'FOLIO', 'LEGAL', 'LETTER', 'TABLOID'];
        vm.pageSize="LETTER";
        vm.pageOrientations=['landscape','portrait'];
        vm.pageOrientation="portrait";
        vm.pagebreaks=['none','student'];
        vm.pagebreak;
        vm.pageMarginL=10;
        vm.pageMarginT=10;
        vm.pageMarginR=10;
        vm.pageMarginB=10;
        vm.pageMargins=[vm.pageMarginL,vm.pageMarginT,vm.pageMarginR,vm.pageMarginB];
        vm.pagewidthpx=0;
        vm.pageheightpx=0;
        vm.dpi = 72;
        vm.maxHeaderHeight = 200;
        vm.maxFooterHeight = 200;
        vm.calcsizes = calcsizes;
        vm.mycontentheader;
        vm.mycontent;
        vm.mycontentfooter;


//            <p><img class="ta-insert-video" ta-insert-video="https://www.youtube.com/embed/2maA1-mvicY" src="https://img.youtube.com/vi/2maA1-mvicY/hqdefault.jpg" allowfullscreen="true" width="300" frameborder="0" height="250"/></p> 

        vm.htmlcontentheader = {
            orightml: ' \
            <h2>Header</h2> \
            ' 
            };
        vm.htmlcontentfooter = {
            orightml: ' \
            <h4>Footer</h4> \
            ' 
            };
        vm.htmlcontentdata = {
            orightml: ' \
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
        vm.htmlcontentdata.htmlcontentheader = vm.htmlcontentheader.orightml;
        vm.htmlcontentdata.htmlcontent = vm.htmlcontentdata.orightml;
        vm.htmlcontentdata.htmlcontentfooter = vm.htmlcontentfooter.orightml;

        activate();
        calcsizes();
        refresHtml();
        
                //$scope.$watch('data.htmlcontent', function(val){$log.debug('htmlcontent changed to:', val);});
                
        function createTestChecklist() {
            if (vm.selected === false) {
                var error = "no rows selected for test candidate";
                Notification.error({message: error, delay: 5000});
                return;                
            }
            
            var saveResgridOptions = angular.copy(vm.resgridOptions);
            var vmTestRptmodal = this;
            var testDate = vmTestRptmodal.TestCandidateSelected.name;
            var testTime = vmTestRptmodal.testdatelist.starttime;
            var rptGridOptions={};
//            rptGridOptions.data = vm.resgridOptions.data;
            rptGridOptions = saveResgridOptions;
            rptGridOptions.columnDefs = [
                {
                    field: 'FullName',
                    visible: true
                }, {
                    field: 'BeltSize',
                    visible: true
                }, {
                    field: 'RankAchievedInTest',
                    visible: true
                }, {
                    field: 'lastpromoted',
                    visible: true
                }, {
                    field: 'daysAttended',
                    visible: true
                }, {
                    field: 'daysSinceLastTest',
                    visible: true
                }, {
                    field: 'class',
                    visible: true
                }, {
                    field: 'pgm',
                    visible: true
                }
                ];
                
            rptGridOptions.exporterPdfDefaultStyle =  {fontSize: 7};
            rptGridOptions.exporterPdfTableStyle = {margin: [30, 30, 30, 30]};
            rptGridOptions.exporterPdfTableHeaderStyle = {fontSize: 10, bold: true, italics: true, color: 'red'};
            rptGridOptions.exporterPdfHeader = { text: "Student/Belt Test Checklist for testing on: " + testDate, style: 'headerStyle' };
            rptGridOptions.exporterPdfFooter = myexporterPdfFooter;
            function myexporterPdfFooter( currentPage, pageCount ) {
              return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
            }
            rptGridOptions.exporterPdfCustomFormatter = myexporterPdfCustomFormatter;
            function myexporterPdfCustomFormatter( docDefinition ) {
              docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
              docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
              return docDefinition;
            }
            rptGridOptions.exporterPdfOrientation = 'landscape';
            rptGridOptions.exporterPdfPageSize = 'LETTER';
//            rptGridOptions.exporterPdfMaxGridWidth =  1000;


            TestingServices.setGrid(rptGridOptions,vm.resgridApi,testDate,testTime);

            vmTestRptmodal.animationsEnabled = true;
            
            vmTestRptmodal.modalInstance = undefined;
            vmTestRptmodal.retvlu = '';

            vmTestRptmodal.modalInstance = $uibModal.open({
                animation: vmTestRptmodal.animationsEnabled,
                templateUrl: 'templates/states/testRpt.html',
                controller: 'ModalTestRptInstanceController as vmnew',
                size: 'lg',
                resolve: {
                  classname: function () {
                      $log.debug('return from open');
                    return vmTestRptmodal.retvlu;
                  }
                }
            });
            vmTestRptmodal.modalInstance.result.then(function (retvlu) {
                console.log('search modalInstance result :', retvlu);
                vmTestRptmodal.retvlu = retvlu;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

            //restore
  //          vm.resgridOptions = saveResgridOptions;
        }
                
        function calcsizes() {
            var shortside,longside;
            vm.pagewidthpx = 0;
            vm.pageheightpx = 0
            switch (vm.pageSize) {
              case "LETTER": 
                {
                    shortside = 8.5 * vm.dpi;                    
                    longside = 11 * vm.dpi;                    
                    break;
                }
              case "EXECUTIVE": 
                {
                    shortside = 7.25 * vm.dpi;                    
                    longside = 10.5 * vm.dpi;                    
                    break;
                }
              case "FOLIO": 
                {
                    shortside = 8 * vm.dpi;                    
                    longside = 13 * vm.dpi;                    
                    break;
                }
              case "LEGAL": 
                {
                    shortside = 8.5 * vm.dpi;                    
                    longside = 14 * vm.dpi;                    
                    break;
                }
              case "TABLOID": 
                {
                    shortside = 11 * vm.dpi;                    
                    longside = 17 * vm.dpi;                    
                    break;
                }
            }
            switch (vm.pageOrientation) {
                case "landscape":
                    {
                        vm.pagewidthpx = longside;
                        vm.pageheightpx = shortside;
                        break;
                    }
                case "portrait":
                    {
                        vm.pagewidthpx = shortside;
                        vm.pageheightpx = longside;
                        break;
                    }
            }
        }
        function setLimit(thelimit) {
            $log.debug('setLimit',thelimit);
            vm.limit = thelimit;
        }
                
        function refresHtml() {
            $log.debug('refresHtml called');
            vm.htmlcontentdata.htmlcontentall = '';
            vm.htmlcontentdata.htmlcontentall += (typeof(vm.htmlcontentdata.htmlcontentheader) !== "undefined" ) ? vm.htmlcontentdata.htmlcontentheader : '';
            vm.htmlcontentdata.htmlcontentall += (typeof(vm.htmlcontentdata.htmlcontent) !== "undefined" ) ? vm.htmlcontentdata.htmlcontent : '';
            vm.htmlcontentdata.htmlcontentall += (typeof(vm.htmlcontentdata.htmlcontentfooter ) !== "undefined" )  ? vm.htmlcontentdata.htmlcontentfooter : '';

        }
        function htmlcontentsubmit() {
            $log.debug('Submit triggered');
        }
        function htmlcontentclear() {
            $log.debug('clear');
            vm.htmlcontentdata = {
                orightml: ' <h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>'
            };
            vm.refresHtml();

        }
        function setHeaderLogo() {
            vm.htmlcontentheader = {
                orightml: ' <table class="noborders"><colgroup><col width="33.3%"><col width="33.3%"><col width="33.3%"></colgroup><tbody> <tr><td >Left</td><td>Center</td><td>Right</td></tr> <tr><td>Left</td><td> <img src="' 
                + vm.headerimages[0] + 
                '"/></td><td>Right</td></tr></tbody></table>' 
                };            
            vm.htmlcontentdata.htmlcontentheader = vm.htmlcontentheader.orightml;
            $log.debug("setheaderlogo entered",vm.htmlcontentheader.orightml);
            vm.refresHtml();
        }
        function setFooterLogo() {
            vm.htmlcontentfooter = {
                orightml: ' <table class="noborders"><colgroup><col width="33.3%"><col width="33.3%"><col width="33.3%"></colgroup><tbody> <tr><td >Left</td><td>Center</td><td>Right</td></tr> <tr><td>Left</td><td> <img src="' 
                + vm.footerimages[0] + 
                '"/></td><td>Right</td></tr></tbody></table>' 
                };            
            vm.htmlcontentdata.htmlcontentfooter = vm.htmlcontentfooter.orightml;
            $log.debug("setfooterlogo entered",vm.htmlcontentfooter.orightml);
            vm.refresHtml();
        }
        function setBodyImage() {
            vm.htmlcontentbody = {
                orightml: ' <img src="' + vm.bodyimages[0] + '"/>'
                };            
            //todo figure out how to loop and insert content to existing pointer location
            vm.htmlcontentdata.htmlcontentbody = vm.htmlcontentbody.orightml;
            $log.debug("setBodyImage entered",vm.htmlcontentbody.orightml);
            vm.refresHtml();
        }
        function setBackgroundImage() {
            var rptwidth = 792;
            var rptheight = 600;
             rptwidth = vm.pagewidthpx;
             rptheight = vm.pageheightpx;

            vm.htmlbackground = {      
                background: [{
               			image: vm.backgroundimages[0],
                       width: rptwidth,
                       height: rptheight
                   }],
            };
            $log.debug("setBackgroundImage entered",vm.htmlbackground);
            vm.refresHtml();
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
            getTemplateNames('').then(function() {
                $log.debug('activate eventdetails fetched');
            });

        }
    function changeTab(tabname) {
        if (tabname === 'tab-test') {
//            setGridOptions();
//            setResGridOptions();
            
        } else if (tabname === 'tab-testmanage') {
 //           setResGridOptions();
        } else if (tabname === 'tab-testmaterial') {
        } else {
            $log.debug('dont know tab', tabname);
        }
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
    function testdateshow() {
        var show=false;
        if (vm.testdatelist !== undefined ) {
            show = typeof(vm.testdatelist) === 'object' ? true : false;
        }
//        $log.debug('testdateshow', typeof(vm.testdatelist), vm.testdatelist, show);
        return show;
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

        function gettestcandidateList(thetestname,thetesttype) {
            $log.debug('gettestcandidateList entered',thetestname,thetesttype);
            var refreshpath = encodeURI('../v1/testcandidatelist?testname=' + thetestname + '&testtype=' + thetesttype );
            var mom;
            var now = moment();

            $log.debug('gettestcandidateList path:', refreshpath);
            
             return TestingServices.gettestcandidateList(refreshpath).then(function(data){
                    $log.debug('gettestcandidateList returned data');
                    $log.debug(data);
                    if (typeof(data) !== 'undefined' && data.testcandidateList.error !== false) {
                        for (var iter=0;iter < data.testcandidateList.length;iter++) {
                            mom = moment(data.testcandidateList[iter].lastpromoted);
                            data.testcandidateList[iter].daysSinceLastTest = now.diff(mom, 'days');
                        }
                        vm.resgridOptions.data = data.testcandidateList; 
                    }
                    return;
                },
                function (error) {
                    $log.debug('Caught an error gettestcandidateList:', error); 
                    vm.resgridOptions.data = [];
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

//                        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                        var selectedStudentarr = this.grid.api.selection.getSelectedRows();
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
//                        var selectedStudentarr = vm.gridApi.selection.getSelectedRows();
                        var selectedStudentarr = this.grid.api.selection.getSelectedRows();
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
                    field: 'FullName',
                    name: 'Full Name',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: true
                }, {
                    field: 'LastName',
                    name: 'Last',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'FirstName',
                    name: 'First',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
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
                    field: 'BeltSize',
                    name: 'Belt size',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'CurrentRank',
                    name: 'Rank',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: true
                }, {
                    field: 'RankAchievedInTest',
                    name: 'Next Rank',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: true,
                   
                    visible: true
                }, {
                    field: 'lastpromoted',
                    name: 'Last Promoted',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: true
                }, {
                    field: 'daysAttended',
                    name: 'Attendance',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: true
                }, {
                    field: 'daysSinceLastTest',
                    name: 'Last Test',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: true
                }, {
                    field: 'ContactType',
                    name: 'Contact',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
//                    filter: {term: "Student"},                    
                   
                    visible: true
                }, {
                    field: 'ReadyForNextRank',
                    name: 'Ready',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: true
                }, {
                    field: 'testingid',
                    name: 'testingid',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'address',
                    name: 'address',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'city',
                    name: 'city',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'state',
                    name: 'state',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'zip',
                    name: 'zip',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'phone',
                    name: 'phone',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'parent',
                    name: 'parent',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'email',
                    name: 'email',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: true
                }, {
                    field: 'classcat',
                    name: 'Class Category',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'pgmcat',
                    name: 'Pgm Category',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'agecat',
                    name: 'Age Category',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'class',
                    name: 'Class',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: true
                }, {
                    field: 'registrationtype',
                    name: 'Reg. Type',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'pgm',
                    name: 'Program',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false,
                   
                    visible: false
                }, {
                    field: 'classtype',
                    name: 'Class Type',
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
                enableHorizontalScrollbar: 2,
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

//                        var selectedStudentarr = vm.resgridApi.selection.getSelectedRows();
                        var selectedStudentarr = this.grid.api.selection.getSelectedRows();

                        $log.debug('selected', selectedStudentarr);
                        setresSelectedArray(selectedStudentarr);
                        
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
//                        var selectedStudentarr = vm.resgridApi.selection.getSelectedRows();
                        var selectedStudentarr = this.grid.api.selection.getSelectedRows();
                        $log.debug('batch selected', selectedStudentarr);
                        setresSelectedArray(selectedStudentarr);

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

        function promotetestcandidate() {
            var path = "../v1/testcandidatepromotion";
            var thedata = {
                testDate: vm.testdatelist.testdate,
                selectedStudents: vm.selectedStudents,
            };
            
            $log.debug('about promotetestcandidate ', thedata, path);
            
            return TestingServices.promotetestcandidate(path, thedata)
                .then(function(data){
                    $log.debug('promotetestcandidate returned data');
                    $log.debug(data);
                    $log.debug(data.message);
                    vm.message = data.message;
                    Notification.success({message: vm.message, delay: 5000});
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
                  
                }).catch(function(e) {
                    $log.debug('promotetestcandidate failure:');
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
                        studentname: inputArray[i].FirstName + ' ' + inputArray[i].LastName,
                        FirstName: inputArray[i].FirstName ,
                        LastName: inputArray[i].LastName,
                        rankType: inputArray[i].ranktype,
                        pgrmcat: inputArray[i].pgrmcat,
                        nextClass: inputArray[i].nextClass,
                        nclassid: inputArray[i].nclassid,
                        nclass: inputArray[i].nclass,
                        classcat: inputArray[i].classcat,
                        agecat: inputArray[i].agecat,
                        pgmWas: inputArray[i].pgmid,
                        classWas: inputArray[i].classid,
                        BeltSize: inputArray[i].BeltSize,
                        ContactType: inputArray[i].ContactType,
                        CurrentRank: inputArray[i].ranklist,
                        RankAchievedInTest: inputArray[i].nextrank,
                        ReadyForNextRank: inputArray[i].ReadyForNextRank,
                        address: inputArray[i].address,
                        age: inputArray[i].age,
                        birthday: inputArray[i].birthday,
                        city: inputArray[i].city,
                        contactpictureurl: inputArray[i].contactpictureurl,
                        daysAttended: inputArray[i].daysAttended,
                        daysSinceLastTest: inputArray[i].daysSinceLastTest,
                        email: inputArray[i].email,
                        lastpromoted: inputArray[i].lastpromoted,
                        parent: inputArray[i].parent,
                        phone: inputArray[i].phone,
                        state: inputArray[i].state,
                        zip: inputArray[i].zip
                    };
                    vm.selectedStudents.push(info);
                }
            } else {
                vm.selected = false;
                return;
            }

            $log.debug("setarray", vm.selectedStudents);
            
        }

        function setresSelectedArray(inputArray) {
            $log.debug("setresSelectedArray entered", inputArray);
            vm.selectedStudents = [];
            
            if (inputArray.length > 0){
                vm.selected = true;
                for(var i=0,len=inputArray.length;i < len;i++){
                    var info = {
                        ContactID: inputArray[i].contactID,
                        studentname: inputArray[i].FirstName + ' ' + inputArray[i].LastName,
                        FirstName: inputArray[i].FirstName ,
                        LastName: inputArray[i].LastName,
                        rankType: inputArray[i].ranktype,
                        pgrmcat: inputArray[i].pgrmcat,
                        nextClass: inputArray[i].nextClass,
                        nclassid: inputArray[i].nclassid,
                        nclass: inputArray[i].nclass,
                        classcat: inputArray[i].classcat,
                        agecat: inputArray[i].agecat,
                        pgmWas: inputArray[i].pgmWas,
                        classWas: inputArray[i].classWas,
                        BeltSize: inputArray[i].BeltSize,
                        ContactType: inputArray[i].ContactType,
                        CurrentRank: inputArray[i].CurrentRank,
                        RankAchievedInTest: inputArray[i].RankAchievedInTest,
                        ReadyForNextRank: inputArray[i].ReadyForNextRank,
                        address: inputArray[i].address,
                        age: inputArray[i].age,
                        birthday: inputArray[i].birthday,
                        city: inputArray[i].city,
                        contactpictureurl: inputArray[i].contactpictureurl,
                        daysAttended: inputArray[i].daysAttended,
                        daysSinceLastTest: inputArray[i].daysSinceLastTest,
                        email: inputArray[i].email,
                        lastpromoted: inputArray[i].lastpromoted,
                        parent: inputArray[i].parent,
                        phone: inputArray[i].phone,
                        state: inputArray[i].state,
                        zip: inputArray[i].zip
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
        		    width: 150,
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

        function getTemplateNames(templatepartial) {
            $log.debug('getTemplateNames entered');
            var path = encodeURI('../v1/templatenames?templatepartial=' + templatepartial);

            $log.debug('gettemplateNames path:', path);
            
             return TemplateServices.gettemplateNames(path).then(function(data){
                    $log.debug('gettemplateNames returned data');
                    $log.debug(data);
                    vm.templatelist = data.templatelist; 
                    return;
                },
                function (error) {
                    $log.debug('Caught an error getTemplateNames:', error); 
                    vm.templatelist = [];
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

        function gettemplateDetails(templateSelected) {
            //called by gettestdates
            $log.debug('gettemplateDetails entered:',templateSelected.templatename);
            var path = encodeURI('../v1/templatedetails?templatename=' + templateSelected.templatename );
            var messagetxt;
//view templatesource
            $log.debug('gettemplateDetails path:', path);
            
             return TemplateServices.gettemplateDetails(path).then(function(data){
                    $log.debug('gettemplateDetails returned data');
                    $log.debug(data);
                    if (typeof(data.templatedetails) !== 'undefined' && data.templatedetails.length > 0) {
                        vm.templatedetails = data.templatedetails[0]; 
                        $log.debug("details",data.templatedetails[0]);
                 
                        vm.htmlcontentdata.htmlcontentheader = vm.templatedetails.htmlheader === "NULL" ? '' : vm.templatedetails.htmlheader; 
                        vm.htmlcontentdata.htmlcontent          = vm.templatedetails.htmlbody === "NULL" ? '' : vm.templatedetails.htmlbody; 
                        vm.htmlcontentdata.htmlcontentfooter= vm.templatedetails.htmlfooter === "NULL" ? '' : vm.templatedetails.htmlfooter;
                        vm.mycontentheader= vm.templatedetails.parsedheader ;
                        vm.mycontent=  vm.templatedetails.parsedbody ;
                        vm.mycontentfooter = vm.templatedetails.parsedfooter ;
                        vm.headerimages[0]= vm.templatedetails.headerimage === "NULL" ? '' : vm.templatedetails.headerimage;
                        vm.footerimages[0]= vm.templatedetails.footerimage === "NULL" ? '' : vm.templatedetails.footerimage; 
                        vm.backgroundimages[0]= vm.templatedetails.backgroundimage === "NULL" ? '' : vm.templatedetails.backgroundimage; 
                        vm.maxHeaderHeight= vm.templatedetails.maxHeaderHeight ; 
                        vm.maxFooterHeight= vm.templatedetails.maxFooterHeight ; 
                        vm.pageMarginL= vm.templatedetails.pageMarginLeft ; 
                        vm.pageMarginR= vm.templatedetails.pageMarginRight ; 
                        vm.pageMarginT= vm.templatedetails.pageMarginTop ; 
                        vm.pageMarginB= vm.templatedetails.pageMarginBottom ; 
                        vm.pageSize= vm.templatedetails.pageSize ; 
                        vm.pageOrientation= vm.templatedetails.pageOrientation ; 
                        vm.templatename = vm.templatedetails.templatename     ;
                        vm.pagebreak = vm.templatedetails.pagebreak;
                        //check for empty set and do message
                        messagetxt = "templateDetails obtained";
                        Notification.success({message: messagetxt, delay: 5000});
                        
                    } else {
                        messagetxt = "No templates found";
                        Notification.warning({message: messagetxt, delay: 5000});
                    }
                    return;
                },
                function (error) {
                    $log.debug('Caught an error gettemplateDetails:', error); 
                    vm.templatedetails = [];
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

        function removetemplate(templatename) {

            var path = "../v1/template";
    
            var thedata = {
                templatename: templatename
            };
            $log.debug('about removetemplate ', path, thedata,vm.templatename);
            return TemplateServices.removetemplate(path, thedata)
                .then(function(data){
                    $log.debug('removetemplate returned data');
                    $log.debug(data, data.error);
                    if (data.error === true) {
                        $log.debug('removetemplate error returned', data.error);
                        return ($q.reject(data));                        
                    }
                    
                    vm.templatedetails = data;
                    $log.debug(vm.templatedetails);
                    $log.debug(vm.templatedetails.message);
                    vm.message = vm.templatedetails.message;
                    Notification.success({message: vm.message, delay: 5000});
                    getTemplateNames('').then(function(zdata) {
                        $log.debug('activate gettemplateNames fetched', zdata);
                    },                     
                        function (error) {
                            $log.debug('Caught an error gettemplateDetails after update:', error); 
                            vm.data = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
    
                    return;
                }).catch(function(e) {
                    $log.debug('removetemplate failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }

        function updatetemplate(templatename) {
            var saveSelectedStudents = vm.selectedStudents;
            vm.selectedStudents = [];
            pdfForElement('convertthis');
            vm.selectedStudents = saveSelectedStudents;
            
            var path = "../v1/templateupdate"; // put wasn't working?
            var thedata = setPDFdata(templatename);
            $log.debug('about updatetemplate ', thedata, path);
            
            return TemplateServices.updateTemplate(path, thedata)
                .then(function(data){
                    $log.debug('updatetemplate returned data');
                    $log.debug(data, data.error);
                    if (data.error === true) {
                        $log.debug('updateTemplate error returned', data.error);
                        return ($q.reject(data));                        
                    }
                    vm.templatedetails = data;
                    $log.debug(vm.templatedetails);
                    $log.debug(vm.templatedetails.message);
                    vm.message = vm.templatedetails.message;
                  
                }).catch(function(e) {
                    $log.debug('updatetemplate failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });

        }
        function setPDFdata(templatename) {
            var thedata = {
                htmlheader : vm.htmlcontentdata.htmlcontentheader === undefined ? '' :  vm.htmlcontentdata.htmlcontentheader  , 
                htmlbody : vm.htmlcontentdata.htmlcontent === undefined ? '' :   vm.htmlcontentdata.htmlcontent      , 
                htmlfooter : vm.htmlcontentdata.htmlcontentfooter === undefined ? '' : vm.htmlcontentdata.htmlcontentfooter, 
                parsedheader : vm.mycontentheader === undefined ? '' : vm.mycontentheader, 
                parsedbody : vm.mycontent === undefined ? '' : vm.mycontent, 
                parsedfooter : vm.mycontentfooter === undefined ? '' : vm.mycontentfooter , 
                headerimage : vm.headerimages === null ? '' : vm.headerimages[0], 
                footerimage : vm.footerimages === null ? '' : vm.footerimages[0],
                backgroundimage : vm.backgroundimages === null ? '' : vm.backgroundimages[0],
                maxHeaderHeight : vm.maxHeaderHeight === undefined ? 0 : vm.maxHeaderHeight, 
                maxFooterHeight : vm.maxFooterHeight === undefined ? 0 : vm.maxFooterHeight, 
                pageMarginLeft : vm.pageMarginL === undefined ? 0 : vm.pageMarginL, 
                pageMarginRight : vm.pageMarginR === undefined ? 0 : vm.pageMarginR,
                pageMarginTop : vm.pageMarginT === undefined ? 0 : vm.pageMarginT, 
                pageMarginBottom : vm.pageMarginB === undefined ? 0 : vm.pageMarginB, 
                pageSize : vm.pageSize === undefined ? 'LETTER' : vm.pageSize, 
                pageOrientation : vm.pageOrientation === undefined ? 'portrait' : vm.pageOrientation, 
                templateName : templatename,
                pagebreak : vm.pagebreak
            };
            return thedata;
        }
        function createtemplate(templatename) {
            if (vm.selected === false) {
                var error = "no rows selected for template";
                Notification.error({message: error, delay: 5000});
                return;                
            }

            var saveSelectedStudents = vm.selectedStudents;
            vm.selectedStudents = [];
            pdfForElement('convertthis');
            vm.selectedStudents = saveSelectedStudents;

            
            var path = "../v1/template";

            var thedata = setPDFdata(templatename);
    
            $log.debug('about createtemplate ', path, thedata,vm.templateName);
            return TemplateServices.createtemplate(path, thedata)
                .then(function(data){
                    $log.debug('createtemplate returned data');
                    $log.debug(data);
                    if (typeof(data) !== 'undefined') {
                        vm.templatedetails = data;
                        $log.debug(vm.templatedetails);
                        $log.debug(vm.templatedetails.message);
                        vm.message = vm.templatedetails.message;
                        Notification.success({message: vm.message, delay: 5000});
                    } else {
                        Notification.success({message: "Not created", delay: 5000});
                    }
                    getTemplateNames(templatename).then(function(zdata) {
                        $log.debug('activate gettemplateNames fetched', zdata);
                    },                     
                        function (error) {
                            $log.debug('Caught an error gettemplateNames after update:', error); 
                            vm.data = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return vm.templatedetails;
                }).catch(function(e) {
                    $log.debug('createtemplate failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }

        function getStyles() {
            var styles = {
            		tableExample: {
            			margin: [0, 5, 0, 15]
            		},
            		tableHeader: {
            			bold: true,
            			fontSize: 13,
            			color: 'black'
            		},
            		dashed: {
            		    dash: {length: 5}
            		},

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
        		    width: 150,
        		    fontSize: 12
        		  },
        		  smalllines: {
        		    fontSize: 18,
        		    alignment: 'center',
        		    width: vm.pagewidthpx,
        		    lineHeight: 1.5
        		  },
        		  extrasmalllines: {
        		    fontSize: 10,
        		    alignment: 'center',
        		    width: vm.pagewidthpx
        		  },
        		  mediumlines: {
        		    fontSize: 35,
        		    bold: true,
        		    alignment: 'center',
        		    width: vm.pagewidthpx
        		  },
        		  ymcaheader: {
        		    fontSize: 25,
        		    bold: true,
        		    margin: [270,45,0,20],
        		    width: vm.pagewidthpx
        		  },
        		  biglines: {
        		    fontSize: 23,
        		    bold: true,
        		    alignment: 'center',
        		    width: vm.pagewidthpx
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

            		
            	};
            	return styles;
            
        }
        function substitute(content,students, pagebreak,certdata) {
            var tmp,obj;
            var contentdtl=[];
            if (typeof(students) !== 'undefined' && students.length > 0 ) {
                for (var i=0; i<students.length; i++) {       
                    $log.debug('process student:',students[i]);
                    if (i < students.length -1  ) {
                        if (vm.pagebreak == "student") {
                            pagebreak = {pageBreak: 'before', text: ''}; 
                        } else {
                            pagebreak = {};
                        }
                    } else {
                        pagebreak = {};
                    }
                    $log.debug("types", content.length, typeof(pagebreak));
                    tmp=content;

                    tmp = tmp.replace(/{agecat}/g,students[i].agecat);
                    tmp = tmp.replace(/{classcat}/g,students[i].classcat);
                    tmp = tmp.replace(/{nclass}/g,students[i].nclass);
                    tmp = tmp.replace(/{pgrmcat}/g,students[i].pgrmcat);
                    tmp = tmp.replace(/{nextClass}/g,students[i].nextClass);

                    tmp = tmp.replace(/{age}/g,students[i].age);
                    tmp = tmp.replace(/{birthday}/g,students[i].birthday);
                    tmp = tmp.replace(/{phone}/g,students[i].phone);
                    tmp = tmp.replace(/{parent}/g,students[i].parent);
                    tmp = tmp.replace(/{zip}/g,students[i].zip);
                    tmp = tmp.replace(/{city}/g,students[i].city);
                    tmp = tmp.replace(/{state}/g,students[i].state);
                    tmp = tmp.replace(/{address}/g,students[i].address);
                    tmp = tmp.replace(/{email}/g,students[i].email);
                    tmp = tmp.replace(/{beltsize}/g,students[i].BeltSize);
                    tmp = tmp.replace(/{daysAttended}/g,students[i].daysAttended);
                    tmp = tmp.replace(/{daysSinceLastTest}/g,students[i].daysSinceLastTest);
                    tmp = tmp.replace(/{lastPromoted}/g,students[i].lastpromoted);

                    tmp = tmp.replace(/{FirstName}/g,students[i].FirstName);
                    tmp = tmp.replace(/{LastName}/g,students[i].LastName);
                    tmp = tmp.replace(/{classwas}/g,students[i].classWas);
                    tmp = tmp.replace(/{pgmwas}/g,students[i].pgmWas);

                    tmp = tmp.replace(/{studentname}/g,students[i].studentname);
                    tmp = tmp.replace(/{nextRank}/g,students[i].RankAchievedInTest);
                    tmp = tmp.replace(/{certDate}/g,moment(certdata.certDate).format("MMM DD, YYYY"));
                    tmp = tmp.replace(/{teststarttime}/g,moment(certdata.teststarttime).format("hh:mm A"));
                    tmp = tmp.replace(/{testfee}/g,certdata.testfee);
                    tmp = tmp.replace(/{school}/g,certdata.school);
                    tmp = tmp.replace(/{program}/g,certdata.program);
                    tmp = tmp.replace(/{instructor1}/g,certdata.instructor1);
                    tmp = tmp.replace(/{instructor2}/g,certdata.instructor2);
                    tmp = tmp.replace(/{instructor3}/g,certdata.instructor3);
                    tmp = tmp.replace(/{instructor4}/g,certdata.instructor4);
                    tmp = tmp.replace(/{title1}/g,certdata.title1);
                    tmp = tmp.replace(/{title2}/g,certdata.title2);
                    tmp = tmp.replace(/{title3}/g,certdata.title3);
                    tmp = tmp.replace(/{title4}/g,certdata.title4);
                    try {
                        obj = JSON.parse('[' + tmp + ']');
                    } catch (e) {
                      $log.debug(e instanceof SyntaxError); // true
                      $log.debug(e.message);                // "missing ; before statement"
                      $log.debug(e.name);                   // "SyntaxError"
                      $log.debug(e.fileName);               // "Scratchpad/1"
                      $log.debug(e.lineNumber);             // 1
                      $log.debug(e.columnNumber);           // 4
                      $log.debug(e.stack);                  // "@Scratchpad/1:2:3\n"
                    }
                    contentdtl.push([
                        obj,
//                    {text:  students[i].studentname, style: ['mediumlines','botfiller']},
                    pagebreak
                        ]);

                }

            } else {
                contentdtl = [content];
            }
            return contentdtl;
        }
        function doPDF() {
         //debug   var tb = textAngularManager.getToolbarScopes();
            pdfForElement('convertthis').open();
 // pdfForElement('convertthis');
        }
        function genPDF(templatename) {
            var mycontent = vm.mycontent;
            var mycontentheader = vm.mycontentheader;
            var mycontentfooter = vm.mycontentfooter;
            var students = vm.selectedStudents;
        var program = "and is therefore awarded the rank of";
        var testfee = 25;
            
        var certdata={
          certDate: vm.testdatelist.testdate,
          teststarttime: vm.testdatelist.starttime,
          testendtime: vm.testdatelist.endtime,
          school: vm.userdta.school,
          program: program,
          testfee: testfee,
          instructor1: vm.testdatelist.tester1,
          instructor2: vm.testdatelist.tester2,
          instructor3: vm.testdatelist.tester3,
          instructor4: vm.testdatelist.tester4,
          title1: _.findWhere(vm.instructorlist, {name: vm.testdatelist.tester1}).instructortitle,
          title2: _.findWhere(vm.instructorlist, {name: vm.testdatelist.tester2}).instructortitle,
          title3: _.findWhere(vm.instructorlist, {name: vm.testdatelist.tester3}).instructortitle,
          title4: _.findWhere(vm.instructorlist, {name: vm.testdatelist.tester4}).instructortitle
        };

            $log.debug('after parsehmtl',mycontent,students, typeof(students), students.length);
            var contentdtl = [];
            var tmp;
            var obj;
            var pagebreak;
/*            
            if (typeof(students) !== 'undefined' && students.length > 0 ) {
                for (var i=0; i<students.length; i++) {       
                    $log.debug('process student:',students[i]);
                    if (i < students.length -1  ) {
                        if (vm.pagebreak == "student") {
                            pagebreak = {pageBreak: 'before', text: ''}; 
                        } else {
                            pagebreak = {};
                        }
                    } else {
                        pagebreak = {};
                    }
                    $log.debug("types", mycontent.length, typeof(pagebreak));
                    tmp=mycontent;

                    tmp = tmp.replace(/{agecat}/g,students[i].agecat);
                    tmp = tmp.replace(/{classcat}/g,students[i].classcat);
                    tmp = tmp.replace(/{nclass}/g,students[i].nclass);
                    tmp = tmp.replace(/{pgrmcat}/g,students[i].pgrmcat);
                    tmp = tmp.replace(/{nextClass}/g,students[i].nextClass);

                    tmp = tmp.replace(/{age}/g,students[i].age);
                    tmp = tmp.replace(/{birthday}/g,students[i].birthday);
                    tmp = tmp.replace(/{phone}/g,students[i].phone);
                    tmp = tmp.replace(/{parent}/g,students[i].parent);
                    tmp = tmp.replace(/{zip}/g,students[i].zip);
                    tmp = tmp.replace(/{city}/g,students[i].city);
                    tmp = tmp.replace(/{state}/g,students[i].state);
                    tmp = tmp.replace(/{address}/g,students[i].address);
                    tmp = tmp.replace(/{email}/g,students[i].email);
                    tmp = tmp.replace(/{beltsize}/g,students[i].beltsize);
                    tmp = tmp.replace(/{daysAttended}/g,students[i].daysAttended);
                    tmp = tmp.replace(/{daysSinceLastTest}/g,students[i].daysSinceLastTest);
                    tmp = tmp.replace(/{lastPromoted}/g,students[i].lastPromoted);

                    tmp = tmp.replace(/{FirstName}/g,students[i].FirstName);
                    tmp = tmp.replace(/{LastName}/g,students[i].LastName);
                    tmp = tmp.replace(/{classwas}/g,students[i].classWas);
                    tmp = tmp.replace(/{pgmwas}/g,students[i].pgmWas);

                    tmp = tmp.replace(/{studentname}/g,students[i].studentname);
                    tmp = tmp.replace(/{nextRank}/g,students[i].RankAchievedInTest);
                    tmp = tmp.replace(/{certDate}/g,moment(certdata.certDate).format("MMM DD, YYYY"));
                    tmp = tmp.replace(/{teststarttime}/g,moment(certdata.teststarttime).format("hh:mm A"));
                    tmp = tmp.replace(/{testfee}/g,certdata.testfee);
                    tmp = tmp.replace(/{school}/g,certdata.school);
                    tmp = tmp.replace(/{program}/g,certdata.program);
                    tmp = tmp.replace(/{instructor1}/g,certdata.instructor1);
                    tmp = tmp.replace(/{instructor2}/g,certdata.instructor2);
                    tmp = tmp.replace(/{instructor3}/g,certdata.instructor3);
                    tmp = tmp.replace(/{instructor4}/g,certdata.instructor4);
                    tmp = tmp.replace(/{title1}/g,certdata.title1);
                    tmp = tmp.replace(/{title2}/g,certdata.title2);
                    tmp = tmp.replace(/{title3}/g,certdata.title3);
                    tmp = tmp.replace(/{title4}/g,certdata.title4);
                    try {
                        obj = JSON.parse('[' + tmp + ']');
                    } catch (e) {
                      $log.debug(e instanceof SyntaxError); // true
                      $log.debug(e.message);                // "missing ; before statement"
                      $log.debug(e.name);                   // "SyntaxError"
                      $log.debug(e.fileName);               // "Scratchpad/1"
                      $log.debug(e.lineNumber);             // 1
                      $log.debug(e.columnNumber);           // 4
                      $log.debug(e.stack);                  // "@Scratchpad/1:2:3\n"
                    }
                    contentdtl.push([
                        obj,
//                    {text:  students[i].studentname, style: ['mediumlines','botfiller']},
                    pagebreak
                        ]);

                }

            } else {
                contentdtl = [mycontent];
            }
*/
            contentdtl = substitute(mycontent,students,pagebreak,certdata);
            try {
                //todo call substitute for header and footer too
                tmp = mycontentheader;
                obj = JSON.parse('[' + tmp + ']');
                mycontentheader = obj;
                tmp = mycontentfooter;
                obj = JSON.parse('[' + tmp + ']');
                mycontentfooter = obj;
            } catch (e) {
              $log.debug(e instanceof SyntaxError); // true
              $log.debug(e.message);                // "missing ; before statement"
              $log.debug(e.name);                   // "SyntaxError"
              $log.debug(e.fileName);               // "Scratchpad/1"
              $log.debug(e.lineNumber);             // 1
              $log.debug(e.columnNumber);           // 4
              $log.debug(e.stack);                  // "@Scratchpad/1:2:3\n"
            }

            var background;
            if (typeof(vm.backgroundimages[0]) !== undefined && vm.backgroundimages[0] !== "") {
                calcsizes();
                var rptwidth = vm.pagewidthpx;
                var rptheight = vm.pageheightpx;
                background = {      
           			image: vm.backgroundimages[0],
                   width: rptwidth,
                   height: rptheight
                };
            } else {
                background = '';
            }

            var docDefinition = {
                  pageOrientation: vm.pageOrientation,
                  pageMargins: [
                      vm.pageMarginL,
                      vm.pageMarginT,
                      vm.pageMarginR,
                      vm.pageMarginB
                    ],
                  pageSize: vm.pageSize,
                  background,
                    header: mycontentheader,
                    content: contentdtl,
                    footer: mycontentfooter,    
                    styles: getStyles()
                  };
                  
            var myJsonString = JSON.stringify(docDefinition);
            $log.debug('doc json',myJsonString);
            
            
            pdfMake.createPdf(docDefinition).open();
        }
        function pdfForElement(id) {
            var students = vm.selectedStudents;
            var sl;
            var parseType;
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
            var marginConversion = {
                "margin-left": "marginLeft",
                "margin-right": "marginRight",
                "margin-top": "marginTop",
                "margin-bottom": "marginBottom"
            };
            function ParseContainer(cnt, e, p, styles, parseType) {
            var elements = [];
            var children = e.childNodes;
            if (children.length !== 0) {
              for (var i = 0; i < children.length; i++) {
                  p = ParseElement(elements, children[i], p, parseType, styles);
              }
            }
            if (elements.length !== 0) {
              for (var i = 0; i < elements.length; i++) {
//                  if (elements[i].length > 0) {
                      cnt.push(elements[i]);
 //                 }
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
                      $log.debug("has a style", st[0],st[1], o);
                    switch (st[0]) {
                      case "padding-left": 
                        {
                            o.margin = [parseInt(st[1]), 0, 0, 0];
                            break;
                        }
                      case "padding-right": 
                        {
                            o.margin = [0, 0, parseInt(st[1]), 0];
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
                    case "margin-bottom":
                        o.marginBottom = parseInt(st[1]);
                        break;
                    case "margin-top":
                        o.marginTop = parseInt(st[1]);
                        break;
                    case "margin-left":
                        o.marginLeft = parseInt(st[1]);
                        break;
                    case "margin-right":
                        o.marginRight = parseInt(st[1]);
                        break;
                    case "color":
                        o.color = parseColor(st[1]);
                        break;
                    case "background-color":
                        o.background = parseColor(st[1]);
                        break;                            
                    }
                  }
                  if (st.length === 1) {
                      $log.debug("has a class", st[0], o);
                          o.style = st[0];
                  }
                }
            //                  }
              $log.debug('computestyle done', o);
            
            }
            function ParseElement(cnt, e, p, parseType, styles ) {
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
                var nodeSize = e.getAttribute("size");
                if (nodeSize) {
                    //https://websemantics.uk/articles/font-size-conversion/
                    var fs=13; //default
                    switch  (nodeSize) {
                    case "1": { fs=8; break; }
                    case "2": { fs=10; break; }
                    case "3": { fs=13; break; }
                    case "4": { fs=16; break; }
                    case "5": { fs=18; break; }
                    case "6": { fs=24; break; }
                    case "7": { fs=32; break; }
                    }
                        
                    styles.push("font-size: " + fs);
                }    
                var nodeClass = e.getAttribute("class");
                if (nodeClass) {
                    classes = nodeClass.toLowerCase().trim().split(" ");
                    classes.forEach(function(nodeClass) {
                        if (typeof(classStyles[nodeClass]) != 'undefined') {
                            classStyles[nodeClass].forEach(function(style) {
                                styles.push(style);
                            });
                        } else {
                            styles.push(nodeClass);
                        }
                        
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
                    p = ParseContainer(cnt, e, p, styles.concat(elementStyles[e.nodeName.toLowerCase()]),parseType);
                  break;
                }
                 case "h1":
                            case "h2":
                            case "h3":
                            case "h4":
                            case "h5":
              case "h6":
                {
                p = CreateParagraph();
                if (parseType !== "header" && parseType !== "footer") {
                    p.marginBottom = 4;
                    p.marginTop = 10;
                }
                p = ParseContainer(cnt, e, p, styles.concat(elementStyles[e.nodeName.toLowerCase()]),parseType);
                    cnt.push(p);          
                  break;
                }
              case "blockquote":
                {
//                    p = create("text");
                    var st = create("stack");
                    st.margin = [20, 0, 0, 0];
                    p = ParseContainer(st.stack, e, p, styles, parseType);
                    cnt.push(st);
                    
                  break;
                }
              case "span":
                {
                  p = ParseContainer(cnt, e, p, styles,parseType);
                  break;
                }
              case "hr":
                {
                  $log.debug("hr found", e.className);
                  var c;
                  var xlen;
                  if (pctlen) {
                      xlen = vm.pagewidthpx*pctlen/100 - vm.pageMarginR - vm.pageMarginL;
                  } else {
                      xlen = vm.pagewidthpx - vm.pageMarginR - vm.pageMarginL;
                  }
                  if (e.className === "dashed") {
                    c = {"marginTop": 10,
                        "canvas": [ 
                        {
                            "type": 'line',
                            "x1": 0 + vm.pageMarginL, "y1": 10,
                            "x2": xlen, "y2": 10,
        					"dash": {length: 5},
                            "lineWidth": 2
                        }
                    ]
                  };
                      
                  } else {
                    c = {"marginTop": 10,
                        "canvas": [ 
                        {
                            "type": 'line',
                            "x1": 0 + vm.pageMarinL, "y1": 10,
                            "x2": xlen, "y2": 10,
                            "lineWidth": 2
                        }
                    ]
                  };
                      
                  }

                  cnt.push(c);
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
//                                    style: 'tableExample',
                                    widths: [],
                                    body: [] 
//                                    col: []
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
                            borderclasses = borderclass.trim().toLowerCase().split(" ");
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
                  
  //                p = ParseContainer(t.table.col, e, p, styles,parseType);
            
                  var colwcalc = e.getElementsByTagName("col");
                  if (colwcalc) {
                      for (var iter=0;iter<colwcalc.length;iter++) {
                          var tmp = colwcalc[iter].width.replace(/\%/g, '')*(vm.pagewidthpx-vm.pageMarginL-vm.pageMarginR)/vm.pagewidthpx;
                          t.table.widths.push(tmp + '%');
                      }
                  }
                  //only need it for the widths, as the col is not supported in pdfmake
    //              delete t.table.col;

                  p = ParseContainer(t.table.body, e, p, styles,parseType);

                  if (!colwcalc) {
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
                  }

//                  ComputeStyle(t.table, styles);
                  typeof(t.table.marginLeft) !== 'undefined' ?  delete t.table.marginLeft : '';
                  typeof(t.table.marginRight) !== 'undefined' ?  delete t.table.marginRight : '';
                  typeof(t.table.marginTop) !== 'undefined' ?  delete t.table.marginTop : '';
                  typeof(t.table.marginBottom) !== 'undefined' ?  delete t.table.marginBottom : '';
                  var margins = [];
                  var marg=[];
                  var mlen;
                  if (styles.length > 0) {
                       var st = create("stack");
                      st.stack.push(t);
                      for (var iter=0;iter < styles.length;iter++){
                          marg = styles[iter].split(":");
                          if (marg[0].includes("margin")) {
                            if (typeof(marginConversion[marg[0]]) !== 'undefined') {
                                mlen = parseInt(marg[1],10);
                                st[marginConversion[marg[0]]] = mlen;
                            }
                          }
                      }
                      cnt.push(st);
                  } else {
                      cnt.push(t);
                  }

                  break;
                }
              case "tbody":
                {
                  p = ParseContainer(cnt, e, p, styles,parseType);
                  //p = CreateParagraph();
                  break;
                }
/*              case "colgroup":
                {
                  p = ParseContainer(cnt, e, p, styles,parseType);
                  //p = CreateParagraph();
                  break;
                }
              case "col":
                {
                  var col = [];
                  p = ParseContainer(cnt, e, p, styles,parseType);
                  //p = CreateParagraph();
                  cnt.push(col);
                  break;
                }
  */            case "tr":
                {
                  var row = [];
                  p = ParseContainer(row, e, p, styles,parseType);
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
                        //table style drifting down
//                    p = ParseContainer(st.stack, e, p, styles, parseType);
                    p = ParseContainer(st.stack, e, p, [], parseType);
                    cnt.push(st);
                    break;
                }
                case "div":
                {
                  $log.debug("div found");
                  
                //    p = create("text");
                    var st = create("stack");
                //    st.stack.push(p);

                  var margins = [];
                  var marg=[];
                  var mlen;
                  if (styles.length > 0) {
                      for (var iter=0;iter < styles.length;iter++){
                          marg = styles[iter].split(":");
                          if (marg[0].includes("margin")) {
                            if (typeof(marginConversion[marg[0]]) !== 'undefined') {
                                mlen = parseInt(marg[1],10);
                                st[marginConversion[marg[0]]] = mlen;
                            }
                          }
                          if (marg[0] === "width" && marg[1].includes("%") ) {
                                pctlen = parseInt(marg[1],10);
                          }
                      }
                  }                  
                  p = ParseContainer(st.stack, e, p, [],parseType);
//                  st.stack.push(p);
            
                  cnt.push(st);
                  break;
                }
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
                  p = ParseContainer(st.stack, e, p, styles,parseType);
            
                  cnt.push(st);
                  break;
                }
                
              case "ol":
              case "ul":
                  {
                    $log.debug(e.nodeName,cnt, e, p);
                      var list = create(e.nodeName.toLowerCase());
                      ComputeStyle(list, styles);
                      p = ParseContainer(list[e.nodeName.toLowerCase()], e, p, styles,parseType);
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
                      p = ParseContainer(st.stack, e, p, styles,parseType);
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
                  p = ParseContainer(stackP.stack, e, p, [], parseType);
            
                  cnt.push(stackP);
                  break;
                }
              case "img":
                {
                    var regex = /([\w-]*)\s*:\s*([^;]*)/g;
                    var match; //helper variable for the refegex
                    var imageSize={};
                    var maxResolution={};
                    if(parseType === "header" ) {
//                        width: 435,
//                        height: 830
                        maxResolution = {
                            width: vm.pagewidthpx*0.333,
                            height: vm.maxHeaderHeight
                        };
                        
                    } else if(parseType === "footer" ) {
//                        width: 435,
//                        height: 830
                        maxResolution = {
                            width: vm.pagewidthpx*0.333,
                            height: vm.maxFooterHeight
                        };
                        
                    } else {

                    }
                    $log.debug('img settings', 
                    e.width, 
                    e.height, 
                    e.clientWidth, 
                    e.clientHeight, 
                    e.naturalWidth, 
                    e.naturalHeight
                    );
                    if (e.getAttribute("style")) {
                        while ((match = regex.exec(e.getAttribute("style"))) !== null) {
                            imageSize[match[1]] = parseInt(match[2].trim(),10);
                        }
                    } else {
                        imageSize = {
//                            height: e.getAttribute("src").height,
//                            width: e.getAttribute("src").width
//                            width: "100"
                            width: e.width,
                            height: e.height
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
                    $log.debug('img settings if scaled', imageSize);
                    
                    cnt.push({
//                        image: images[e.getAttribute("src")].data,
                        image: e.src,
                         width: imageSize.width,
                        //causes prob with pdfmake for header
                        height: imageSize.height
//                        height: 75
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
            function ParseHtml(cnt, htmlText, parseType) {
                //temp hack to remove junk
                var rsb1 = new RegExp(/<span id="selectionBoundary_\d+_\d+" class="rangySelectionBoundary">[^<>]+?<\/span>/ig);
            	var rsb2 = new RegExp(/<span class="rangySelectionBoundary" id="selectionBoundary_\d+_\d+">[^<>]+?<\/span>/ig);
            	var rsb3 = new RegExp(/<span id="selectionBoundary_\d+_\d+" class="rangySelectionBoundary">[^<>]+?<\/span>/ig);                
                if ($(htmlText).length > 0) {
                    var html = $(htmlText.replace(/\t/g, "").replace(/\n/g, "").replace(rsb1,'').replace(rsb2,'').replace(rsb3,''));
                    var p = CreateParagraph();
                    for (var i = 0; i < html.length; i++){
                        ParseElement(cnt, html.get(i), p, parseType, []);
                    }
                    $log.debug('parsehmtl', p, cnt);
                    return cnt;
                } else {
                    return cnt;
                }
            }
            function CreateParagraph() {
            var p = {
              text: []
            };
            return p;
            }
            function create(name, content) {
                var o = {};
                content = content || [];
                o[name] = content;
                return o;
            }

            var content=[];
            var headercontent=[];
            var footercontent=[];

            parseType="body";
            var mycontent = ParseHtml(content,vm.htmlcontentdata.htmlcontent,parseType);
            vm.mycontent = JSON.stringify(mycontent);
            parseType="header";
            var mycontentheader = ParseHtml(headercontent,vm.htmlcontentdata.htmlcontentheader,parseType);
            vm.mycontentheader = JSON.stringify(mycontentheader);
            parseType="footer";
            var mycontentfooter = ParseHtml(footercontent,vm.htmlcontentdata.htmlcontentfooter,parseType);
            vm.mycontentfooter = JSON.stringify(mycontentfooter);
            $log.debug('header',mycontentheader);
            $log.debug('footer',mycontentfooter);
            
            $log.debug('after parsehmtl',mycontent,students, typeof(students), students.length);
            var contentdtl = [];
            var tmp;
            var obj;
            var pagebreak;
            if (typeof(students) !== 'undefined' && students.length > 0 ) {
                for (var i=0; i<students.length; i++) {       
                    $log.debug('process student:',students[i]);
                    if (i < students.length -1  ) {
                        if (vm.pagebreak == "student") {
                            pagebreak = {pageBreak: 'before', text: ''}; 
                        } else {
                            pagebreak = {};
                        }
                    } else {
                        pagebreak = {};
                    }

/*
                    if (i < students.length -1  ) {
                        pagebreak = {pageBreak: 'before', text: ''}; 
                    } else {
                        pagebreak = {};
                    }
  */                  
                    $log.debug("types", mycontent.length, typeof(pagebreak));
                    tmp=JSON.stringify(mycontent[0]);
                    for (var j=1; j<mycontent.length; j++ ) {
                        $log.debug("mycon j", JSON.stringify(mycontent[j]) );
                        tmp = tmp + ',' + JSON.stringify(mycontent[j]);
                    }
                    tmp = tmp.replace(/{FirstName}/g,students[i].studentname);
                    try {
                        obj = JSON.parse('[' + tmp + ']');
                    } catch (e) {
                      $log.debug(e instanceof SyntaxError); // true
                      $log.debug(e.message);                // "missing ; before statement"
                      $log.debug(e.name);                   // "SyntaxError"
                      $log.debug(e.fileName);               // "Scratchpad/1"
                      $log.debug(e.lineNumber);             // 1
                      $log.debug(e.columnNumber);           // 4
                      $log.debug(e.stack);                  // "@Scratchpad/1:2:3\n"
                    }
                    contentdtl.push([
                        obj,
//                    {text:  students[i].studentname, style: ['mediumlines','botfiller']},
                    pagebreak
                        ]);

                }

            } else {
                contentdtl = [mycontent];
            }
            var pctlen;
/*
            var helement = document.getElementById('testValidationHeader');
            var hpositionInfo = helement.getBoundingClientRect();
            var hheight = hpositionInfo.height;
            var hwidth = hpositionInfo.width;
            
            var felement = document.getElementById('testValidationFooter');
            var fpositionInfo = felement.getBoundingClientRect();
            var fheight = fpositionInfo.height;
            var fwidth = fpositionInfo.width;
            $log.debug('header height, width',hheight,hwidth);
*/
                var background;
                if (vm.backgroundimages !== null) {
                    if (typeof(vm.backgroundimages[0]) !== undefined && vm.backgroundimages[0] !== "") {
                        calcsizes();
                        var rptwidth = vm.pagewidthpx;
                        var rptheight = vm.pageheightpx;
                        background = {      
                   			image: vm.backgroundimages[0],
                           width: rptwidth,
                           height: rptheight
                        };
                    } else {
                    background = '';
                    }
                } else {
                    background = '';
                }

                  var docDefinition = {
                  pageOrientation: vm.pageOrientation,
                  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
//                  pageMargins: vm.pageMargins,
/*                  pageMargins: [
                      vm.pageMarginL,
                      hheight > vm.pageMarginT ? hheight : vm.pageMarginT,
                      vm.pageMarginR,
                      fheight > vm.pageMarginB ? fheight : vm.pageMarginB
                    ],
*/
                  pageMargins: [
                      vm.pageMarginL,
                      vm.pageMarginT,
                      vm.pageMarginR,
                      vm.pageMarginB
                    ],
                  pageSize: vm.pageSize,
                  background,
    //note the page margin needs enough height to fit the header, and the first set of content should deal with the height topMargin
                    header: mycontentheader,
                    content: contentdtl,
                    footer: mycontentfooter,    
                styles: {
            		tableExample: {
            			margin: [0, 5, 0, 15]
            		},
            		tableHeader: {
            			bold: true,
            			fontSize: 13,
            			color: 'black'
            		},
            		dashed: {
            		    dash: {length: 5}
            		},

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
        		    width: 150,
        		    fontSize: 12
        		  },
        		  smalllines: {
        		    fontSize: 18,
        		    alignment: 'center',
        		    width: vm.pagewidthpx,
        		    lineHeight: 1.5
        		  },
        		  extrasmalllines: {
        		    fontSize: 10,
        		    alignment: 'center',
        		    width: vm.pagewidthpx
        		  },
        		  mediumlines: {
        		    fontSize: 35,
        		    bold: true,
        		    alignment: 'center',
        		    width: vm.pagewidthpx
        		  },
        		  ymcaheader: {
        		    fontSize: 25,
        		    bold: true,
        		    margin: [270,45,0,20],
        		    width: vm.pagewidthpx
        		  },
        		  biglines: {
        		    fontSize: 23,
        		    bold: true,
        		    alignment: 'center',
        		    width: vm.pagewidthpx
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

            		
            	}
            
                  };
                  
            var myJsonString = JSON.stringify(docDefinition);
            $log.debug('doc json',myJsonString);

/*const pdfDocGenerator = pdfMake.createPdf(docDefinition);
pdfDocGenerator.getDataUrl((dataUrl) => {
	const targetElement = document.querySelector('#iframeContainer');
	const iframe = document.createElement('iframe');
	iframe.src = dataUrl;
	targetElement.appendChild(iframe);
});
*/
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
