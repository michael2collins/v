(function(window, angular, pdfMake) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('TestCandidateTableBasicController', TestCandidateTableBasicController);


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
        '$uibModal',
        '_'
    ];

    function TestCandidateTableBasicController($routeParams, $log, TestingServices, CalendarServices, $location, $window, $q,
        $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants, $timeout, moment, UserServices,
        TemplateServices, AttendanceServices, textAngularManager, $uibModal, _) {
        /* jshint validthis: true */

        var vm = this;

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
        vm.setSlide = setSlide;
        vm.setLimit = setLimit;
        vm.createtestcandidate = createtestcandidate;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        vm.createTestChecklist = createTestChecklist;
        vm.createPromoPostcards = createPromoPostcards;
        vm.createBeltLabels = createBeltLabels;
        vm.genPDF = genPDF;
        vm.limit = 0;
        vm.limits = [10, 20, 50, 100, 200, 500, 5000];
        vm.gridLength = {};
        vm.initialLength = 10;
        vm.rowheight = 25;
        
        vm.data = [];
        vm.state = {};
        vm.thiscoldef = '';
        vm.colkey = 'testcandidate';
        vm.colsubkey = '';
        vm.colsubkeys = [];
        vm.coldeflist = [];
        vm.testcandidatetmp;
        vm.gcolumns = [];
        vm.loading = true;
        vm.loadAttempted = false;
        vm.gridOptions = {};
        vm.gridOptions.data = [{}];
        vm.resgridApi;
        vm.gridApi;
        vm.resgridOptions = {};
        vm.resgridOptions.data = [{}];
        vm.selectedStudents = [];
        vm.TestCandidateSelected = '';
        vm.testcandidatenames = [];
        vm.instructorlist = [];
        vm.testcandidate = '';
        vm.ContactID = '';
        vm.selected = false;
        vm.testname;
        vm.testtype;
        vm.userdta;
        vm.htmlcontentdisabled = false;
        vm.htmlcontentcanEdit = true;
        vm.gettemplateDetails = gettemplateDetails;
        vm.templatenameSelected = '';
        vm.testdateshow = testdateshow;
        vm.changeTab = changeTab;
        vm.templatedetails = "";
        vm.templatename = "";
        vm.templatelist = [];
        vm.htmlcontentname = "";
        vm.htmlcontentwebsite = "";
        vm.bodyimages = [];
        vm.headerimages = [];
        vm.footerimages = [];
        vm.backgroundimages = [];
        vm.htmlbackground = [];
        vm.pageSizes = ['EXECUTIVE', 'FOLIO', 'LEGAL', 'LETTER', 'TABLOID'];
        vm.pageSize = "LETTER";
        vm.pageOrientations = ['landscape', 'portrait'];
        vm.pageOrientation = "portrait";
        vm.pagebreaks = ['none', 'student'];
        vm.pagebreak;
        vm.pageMarginL = 10;
        vm.pageMarginT = 10;
        vm.pageMarginR = 10;
        vm.pageMarginB = 10;
        vm.pageMargins = [vm.pageMarginL, vm.pageMarginT, vm.pageMarginR, vm.pageMarginB];
        vm.pagewidthpx = 0;
        vm.pageheightpx = 0;
        vm.dpi = 72;
        vm.maxHeaderHeight = 200;
        vm.maxFooterHeight = 200;
        vm.mycontentheader;
        vm.mycontent;
        vm.mycontentfooter;
        vm.checklistcoldef;
        vm.promopostcard;
        vm.beltlabelcoldef;
        vm.tcsrccoldef;
        vm.tclistcoldef;
        vm.tempres;
        vm.htmlcontentdata = {};
        vm.htmlcontentdata.htmlcontentheader;
        vm.htmlcontentdata.htmlcontent;
        vm.htmlcontentdata.htmlcontentfooter;
        vm.styleleft="400px";
        vm.styleright="400px";
        vm.gridright=5;
        vm.gridleft=5;

        $scope.$on('$routeChangeSuccess', function(event, current, previous) {
            $log.debugEnabled(true);
            $log.debug("table-basic-testcandidates started");

        });
        $scope.$on('$destroy', function iVeBeenDismissed() {
            $log.debug("table-basic-testcandidates dismissed");
            $log.debugEnabled(false);
        });

        activate();

        function setSlide(direction) {
            if (direction == 'left') {
//                vm.styleright = "col-md-9";
//                vm.styleleft = 'col-md-1';                
                vm.styleright = "770px";
                vm.styleleft = "0px";               
                vm.gridright = 10;
                vm.gridleft = 0;
                vm.showright = true;
                vm.showleft = false;
            }
            if (direction == 'right') {
//                vm.styleright = "col-md-1";
//                vm.styleleft = 'col-md-9';                
                vm.styleright = "0px";
                vm.styleleft = "770px";                
                vm.gridright = 0;
                vm.gridleft = 10;
                vm.showright = false;
                vm.showleft = true;
            }
            if (direction == 'center') {
//                vm.styleright = "col-md-1";
//                vm.styleleft = 'col-md-9';                
                vm.styleright = "400px";
                vm.styleleft = "400px";                
                vm.gridright = 5;
                vm.gridleft = 5;
                vm.showright = true;
                vm.showleft = true;
            }
        }
        
        function createTestChecklist() {
            if (vm.selected === false) {
                var error = "no rows selected for test candidate";
                Notification.error({ message: error, delay: 5000 });
                return;
            }
            getGeneralColDefs('test', 'checklist').then(function() {
                $log.debug('getGeneralColDefs ready');

                var saveResgridOptions = angular.copy(vm.resgridOptions);
                var vmTestRptmodal = vm;
                var rptlayout = 'testRpt';
                var testDate = vmTestRptmodal.TestCandidateSelected.name;
                var testTime = vmTestRptmodal.testdatelist.starttime;
                var rptGridOptions = {};
                //            rptGridOptions.data = vm.resgridOptions.data;
                rptGridOptions = saveResgridOptions;
                rptGridOptions.enableGridMenu = true;
                rptGridOptions.columnDefs = vm.checklistcoldef.columns;
                //        rptGridOptions.exporterPdfTableLayout = {fillColor: function (i, node) { return (i % 2 === 0) ?  '#CCCCCC' : null; }} ;
                rptGridOptions.exporterPdfDefaultStyle = { fontSize: 7 };
                rptGridOptions.exporterPdfTableStyle = { margin: [15, 15, 15, 15] };
                rptGridOptions.exporterPdfTableHeaderStyle = { fontSize: 9, bold: true, italics: true, color: 'blue' };
                rptGridOptions.exporterPdfHeader = { text: "Student/Belt Test Checklist for testing on: " + testDate, style: 'headerStyle' };
                rptGridOptions.exporterPdfFooter = myexporterPdfFooter;

                function myexporterPdfFooter(currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                }
                rptGridOptions.exporterPdfCustomFormatter = myexporterPdfCustomFormatter;

                function myexporterPdfCustomFormatter(docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 18, bold: true, margin: 5 };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: 15 };
                    docDefinition.content[0].layout = {
                        fillColor: function(i, node) { return (i % 2 === 0) ? '#CCCCCC' : null; }
                    };

                    return docDefinition;
                }
                rptGridOptions.exporterPdfOrientation = 'landscape';
                rptGridOptions.exporterPdfPageSize = 'LETTER';
                rptGridOptions.exporterPdfMaxGridWidth = 600;


                TestingServices.setGrid(rptGridOptions, vm.resgridApi, testDate, testTime);

                vmTestRptmodal.animationsEnabled = true;

                vmTestRptmodal.modalInstance = undefined;
                vmTestRptmodal.retvlu = '';

                vmTestRptmodal.modalInstance = $uibModal.open({
                    animation: vmTestRptmodal.animationsEnabled,
                    templateUrl: 'templates/states/testRpt.html',
                    controller: 'ModalTestRptInstanceController as vmnew',
                    size: 'lg',
                    resolve: {
                        classname: function() {
                            $log.debug('return from open');
                            return vmTestRptmodal.retvlu;
                        }
                    }
                });
                vmTestRptmodal.modalInstance.result.then(function(retvlu) {
                    $log.debug('search modalInstance result :', retvlu);
                    vmTestRptmodal.retvlu = retvlu;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                //restore
                //          vm.resgridOptions = saveResgridOptions;

            }).catch(function(e) {
                $log.debug("createTestChecklist error in activate", e);
            });

        }

        function createPromoPostcards() {
            if (vm.selected === false) {
                var error = "no rows selected for createPromoPostcards";
                Notification.error({ message: error, delay: 5000 });
                return;
            }
            getGeneralColDefs('test', 'promopostcard').then(function() {
                $log.debug('getGeneralColDefs ready createPromoPostcards');

                var saveResgridOptions = angular.copy(vm.resgridOptions);
                var vmTestRptmodal = vm;
                var rptlayout = 'testRpt';
                var testDate = vmTestRptmodal.TestCandidateSelected.name;
                var testTime = vmTestRptmodal.testdatelist.starttime;
                var rptGridOptions = {};
                //            rptGridOptions.data = vm.resgridOptions.data;
                rptGridOptions = saveResgridOptions;
                rptGridOptions.enableGridMenu = true;
                rptGridOptions.columnDefs = vm.promopostcard.columns;
                rptGridOptions.exporterPdfDefaultStyle = { fontSize: 7 };
                rptGridOptions.exporterPdfTableStyle = { margin: [15, 15, 15, 15] };
                rptGridOptions.exporterPdfTableHeaderStyle = { fontSize: 9, bold: true, italics: true, color: 'blue' };
                rptGridOptions.exporterPdfHeader = { text: "Promotion Postcards for test on: " + testDate, style: 'headerStyle' };
                rptGridOptions.exporterPdfFooter = myexporterPdfFooter;

                function myexporterPdfFooter(currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                }
                rptGridOptions.exporterPdfCustomFormatter = myexporterPdfCustomFormatter;

                function myexporterPdfCustomFormatter(docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 18, bold: true, margin: 5 };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: 15 };
                    docDefinition.content[0].layout = {
                        fillColor: function(i, node) { return (i % 2 === 0) ? '#CCCCCC' : null; }
                    };

                    return docDefinition;
                }
                rptGridOptions.exporterPdfOrientation = 'landscape';
                rptGridOptions.exporterPdfPageSize = 'LETTER';
                rptGridOptions.exporterPdfMaxGridWidth = 600;


                TestingServices.setGrid(rptGridOptions, vm.resgridApi, testDate, testTime);

                vmTestRptmodal.animationsEnabled = true;

                vmTestRptmodal.modalInstance = undefined;
                vmTestRptmodal.retvlu = '';

                vmTestRptmodal.modalInstance = $uibModal.open({
                    animation: vmTestRptmodal.animationsEnabled,
                    templateUrl: 'templates/states/testRpt.html',
                    controller: 'ModalTestRptInstanceController as vmnew',
                    size: 'lg',
                    resolve: {
                        classname: function() {
                            $log.debug('return from open');
                            return vmTestRptmodal.retvlu;
                        }
                    }
                });
                vmTestRptmodal.modalInstance.result.then(function(retvlu) {
                    $log.debug('search modalInstance result :', retvlu);
                    vmTestRptmodal.retvlu = retvlu;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                //restore
                //          vm.resgridOptions = saveResgridOptions;

            }).catch(function(e) {
                $log.debug("getPayerList error in activate", e);
            });

        }

        function convertDataToColumns(thedata, fields, fieldlabels, numOfCols) {
            var convertedData = [];
            var datalen = thedata.length;
            var fieldlen = fields.length;
            var colarr = [];
            var rowstr;
            var colcounter = 0;
            //convert fields to rows
            for (var i = 0; i < datalen; i++) {
                var fieldstr = [];
                colcounter = colcounter + 1;
                //keep track of when we want to output 
                if (colcounter > numOfCols) {
                    colarr = [];
                    colcounter = 1;
                }
                //split the row into a row per field
                for (var j = 0; j < fieldlen; j++) {
                    fieldstr[j] = fieldlabels[j] + " " + thedata[i][fields[j]];
                }
                colarr.push(fieldstr);
                //now we can output
                if (colcounter === numOfCols) {
                    //for the field row loop, we need to realign rows into columns
                    for (var m = 0; m < fieldlen; m++) {
                        rowstr = '{';
                        for (var k = 0; k < numOfCols - 1; k++) {
                            var c = k + 1;
                            rowstr = rowstr + '"column' + c + '" : "' + colarr[k][m] + '",';
                        }
                        rowstr = rowstr + '"column' + numOfCols + '" : "' + colarr[numOfCols - 1][m] + '" }';
                        convertedData.push(JSON.parse(rowstr));
                    }
                }
            }
            return convertedData;
        }

        function createBeltLabels() {
            if (vm.selected === false) {
                var error = "no rows selected for createBeltLabels";
                Notification.error({ message: error, delay: 5000 });
                return;
            }
            getGeneralColDefs('test', 'beltlabels').then(function() {
                $log.debug('getGeneralColDefs ready createBeltLabels');

                var saveResgridOptions = angular.copy(vm.resgridOptions);
                var vmTestRptmodal = vm;
                var rptlayout = 'testRpt';
                var testDate = vmTestRptmodal.TestCandidateSelected.name;
                var testTime = vmTestRptmodal.testdatelist.starttime;
                var rptGridOptions = {};
                //            rptGridOptions.data = vm.resgridOptions.data;
                //            var half_length = Math.ceil(vm.resgridOptions.data.length / 2);    
                rptGridOptions = saveResgridOptions;
                rptGridOptions.data = convertDataToColumns(
                    vm.resgridOptions.data, ['FullName', 'RankAchievedInTest', 'BeltSize'], ['Name:', 'Rank:', 'Size:'],
                    2);
                rptGridOptions.exporterHeaderFilter = myexpHeaderFilter;

                function myexpHeaderFilter(displayName) {
                    return '';
                }
                rptGridOptions.enableGridMenu = true;
                rptGridOptions.columnDefs = vm.beltlabelcoldef.columns;
                rptGridOptions.exporterPdfDefaultStyle = { fontSize: 7 };
                rptGridOptions.exporterPdfCustomFormatter = myexporterPdfCustomFormatter;

                function myexporterPdfCustomFormatter(docDefinition) {
                    //                          docDefinition.content[0].layout = 'noBorders';
                    docDefinition.content[0].layout = {
                        paddingBottom: function(i, node) {
                            return (i % 3 === 0) ? 10 : 0;
                        },
                        hLineWidth: function(i, node) {
                            return (0)
                        },
                        vLineWidth: function(i, node) {
                            return (0)
                        }
                    };
                    docDefinition.content[0].table.widths = ['*', '*'];
                    docDefinition.pageMargins = [10, 0, 0, 0];
                    /*{
                          hLineWidth: function(i, node) {
                             return (i === 0 || i === node.table.body.length) ? 2 : 1;},
                          vLineWidth: function(i, node) {
                             return (i === 0 || i === node.table.widths.length) ? 2 : 1;},
                          hLineColor: function(i, node) {
                             return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';},
                          vLineColor: function(i, node) {
                              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';}
                    } */
                    return docDefinition;
                }
                rptGridOptions.exporterPdfOrientation = 'portrait';
                rptGridOptions.exporterPdfPageSize = 'LETTER';
                rptGridOptions.exporterPdfMaxGridWidth = 400;

                TestingServices.setGrid(rptGridOptions, vm.resgridApi, testDate, testTime, rptlayout);

                vmTestRptmodal.animationsEnabled = true;

                vmTestRptmodal.modalInstance = undefined;
                vmTestRptmodal.retvlu = '';

                vmTestRptmodal.modalInstance = $uibModal.open({
                    animation: vmTestRptmodal.animationsEnabled,
                    templateUrl: 'templates/states/testRpt.html',
                    controller: 'ModalTestRptInstanceController as vmnew',
                    size: 'lg',
                    resolve: {
                        classname: function() {
                            $log.debug('return from open');
                            return vmTestRptmodal.retvlu;
                        }
                    }
                });
                vmTestRptmodal.modalInstance.result.then(function(retvlu) {
                    $log.debug('search modalInstance result :', retvlu);
                    vmTestRptmodal.retvlu = retvlu;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                //restore
                //          vm.resgridOptions = saveResgridOptions;

            }).catch(function(e) {
                $log.debug("getPayerList error in activate", e);
            });

        }

        function calcsizes() {
            var shortside, longside;
            vm.pagewidthpx = 0;
            vm.pageheightpx = 0;
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
            $log.debug('setLimit', thelimit);
            vm.limit = thelimit;
        }

        function addToTest(testingid) {
            $log.debug('addToTest entered', testingid);
            createtestcandidate(testingid);
        }

        function removeFromTest(testingid) {
            $log.debug('removeFromTest entered');
            removetestcandidate(testingid);
        }

        function activate() {
            getTestDates();
            initGridOptions();
            initResGridOptions();
            getUserDetails();
            getTemplateNames('').then(function() {
                $log.debug('activate eventdetails fetched');
            });

            $q.all([
                    getGeneralColDefs('test', 'checklist').then(function() {
                        $log.debug('getGeneralColDefs ready');

                    }).catch(function(e) {
                        $log.debug("getPayerList error in activate", e);
                    }),
                    getGeneralColDefs('test', 'Testcandidatesource').then(function() {
                        $log.debug('getGeneralColDefs ready');
                        setGridOptions();

                    }).catch(function(e) {
                        $log.debug("getPayerList error in activate", e);
                    }),
                    getGeneralColDefs('test', 'Testcandidatelist').then(function() {
                        $log.debug('getGeneralColDefs ready');
                        setResGridOptions();
                    }).catch(function(e) {
                        $log.debug("testcandidates error in activate", e);
                    }),
                    getInstructorList().then(function() {
                        $log.debug('getInstructorList ready');

                    }).catch(function(e) {
                        $log.debug("testcandidates error in activate", e);
                    })
                ])
                .then(function() {
                    $log.debug('testcandidates activation done');
                });
        }

        function changeTab(tabname) {
            if (tabname === 'tab-test') {
                //            setGridOptions();
                //            setResGridOptions();

            }
            else if (tabname === 'tab-testmanage') {
                //           setResGridOptions();
            }
            else if (tabname === 'tab-testmaterial') {}
            else {
                $log.debug('dont know tab', tabname);
            }
        }

        function getUserDetails() {
            $log.debug('getUserDetails entered');
            return UserServices.getUserDetails().then(function(data) {
                    $log.debug("testcandidate getuserdetails returned:", data);
                    vm.userdta = data;
                    return vm.userdta;
                },

                function(error) {
                    $log.debug('Caught an error getUserDetails, going to notify:', error);
                    vm.userdta = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function getGeneralColDefs(colkey, colsubkey) {
            $log.debug('getGeneralColDefs entered', colkey, colsubkey);
            var path = encodeURI("../v1/gencoldefs?colkey=" + colkey + "&colsubkey=" + colsubkey);

            return TestingServices.getGeneralColDefs(path).then(function(data) {
                    $log.debug("getGeneralColDefs returned:", data);
                    var retdata = JSON.parse(data.gcolumns[0][0]);
                    if (colsubkey === 'checklist') {
                        vm.checklistcoldef = retdata;
                    }
                    if (colsubkey === 'promopostcard') {
                        vm.promopostcard = retdata;
                    }
                    if (colsubkey === 'promotion') {
                        vm.promotioncoldef = retdata;
                    }
                    if (colsubkey === 'beltlabels') {
                        vm.beltlabelcoldef = retdata;
                    }
                    if (colsubkey === 'Testcandidatesource') {
                        vm.tcsrccoldef = retdata;
                    }
                    if (colsubkey === 'Testcandidatelist') {
                        vm.tclistcoldef = retdata;
                    }

                    return retdata;
                },

                function(error) {
                    $log.debug('Caught an error getGeneralColDefs, going to notify:', error);
                    vm.userdta = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function updateTest() {
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
                .then(function(data) {
                    $log.debug('updateTesting returned data');
                    $log.debug(data);
                    vm.message = data.message;

                }).catch(function(e) {
                    $log.debug('updateTesting failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({ message: e, delay: 5000 });
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
            return CalendarServices.getinstructorlist(refreshpath).then(function(data) {
                    $log.debug(' calservices getinstructorlist returned data');
                    $log.debug(data);
                    vm.instructorlist = data.instructorlist;
                    if (typeof data.instructorlist !== 'undefined') {
                        for (var i = 0; i < data.instructorlist.length; i++) {
                            vm.instructorlist[i].name = data.instructorlist[i].firstname + ' ' + data.instructorlist[i].lastname;
                        }
                    }
                    vm.instructorlist.unshift(witnessdefault);
                    return vm.instructorlist;
                },
                function(error) {
                    $log.debug('Caught an error getinstructorlist, going to notify:', error);
                    vm.instructorlist = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function convertTime(thetime) {
            if (typeof(thetime) !== 'undefined') {
                var m = moment(thetime, "MM/DD/YYYY hh:mm A z");
                $log.debug('convertTime: passed in: ', thetime,
                    'isvalid?', m.isValid(),
                    'where invalid', m.invalidAt());
                return moment(thetime, "MM/DD/YYYY hh:mm A z").tz('America/New_York').format('MM/DD/YYYY hh:mm A z');
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

            return TestingServices.getTestDates(refreshpath).then(function(data) {
                    $log.debug('getTestDates returned data');
                    $log.debug(data);
                    if (data.testdatelist.length > 1) {
                        error = "too many testdates found:" + data.testdatelist.length;
                        vm.message = error;
                        Notification.error({ message: error, delay: 5000 });
                        vm.testdatelist = [];
                        return ($q.reject(error));
                    }
                    if (data.testdatelist.length === 1) {
                        vm.testdatelist = data.testdatelist[0];
                        vm.testdatelist.starttime = convertTime(data.testdatelist[0].startdate);
                        vm.testdatelist.endtime = convertTime(data.testdatelist[0].enddate);
                        gettestcandidateList(vm.testname, vm.testtype).then(function(zdata) {
                                $log.debug('gettestcandidateList returned', zdata);
                            },
                            function(error) {
                                $log.debug('Caught an error gettestcandidateList after update:', error);
                                vm.data = [];
                                vm.message = error;
                                Notification.error({ message: error, delay: 5000 });
                                return ($q.reject(error));
                            });
                        gettestcandidateDetails(vm.testdatelist.testtype).then(function(zdata) {
                                $log.debug('gettestcandidateDetails returned', zdata);
                            },
                            function(error) {
                                $log.debug('Caught an error gettestcandidateDetails after update:', error);
                                vm.data = [];
                                vm.message = error;
                                Notification.error({ message: error, delay: 5000 });
                                return ($q.reject(error));
                            });


                    }
                    else {
                        error = "No testdates found in calendar for:" + testname.name;
                        vm.message = error;
                        Notification.error({ message: error, delay: 5000 });
                        vm.testdatelist = [];
                        return ($q.reject(error));

                    }
                    return vm.testdatelist;
                },
                function(error) {
                    $log.debug('Caught an error getTestDates, going to notify:', error);
                    vm.testdatelist = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function testdateshow() {
            var show = false;
            if (vm.testdatelist !== undefined) {
                show = typeof(vm.testdatelist) === 'object' ? true : false;
            }
            //        $log.debug('testdateshow', typeof(vm.testdatelist), vm.testdatelist, show);
            return show;
        }

        function removetestcandidate(testingid) {
            if (vm.selected === false) {
                var error = "no rows selected for testcandidate";
                Notification.error({ message: error, delay: 5000 });
                return;
            }

            var path = "../v1/testcandidateregistration";

            var thedata = {
                testingid: testingid,
                selectedStudents: vm.selectedStudents
            };
            $log.debug('about removetestcandidate ', path, thedata, vm.testname);
            return TestingServices.removetestcandidate(path, thedata)
                .then(function(data) {
                    $log.debug('removetestcandidate returned data');
                    $log.debug(data);
                    vm.thistestcandidate = data;
                    $log.debug(vm.thistestcandidate);
                    $log.debug(vm.thistestcandidate.message);
                    vm.message = vm.thistestcandidate.message;
                    Notification.success({ message: vm.message, delay: 5000 });
                    gettestcandidateList(vm.testname, vm.testtype).then(function(zdata) {
                            $log.debug('gettestcandidateList returned', zdata);
                        },
                        function(error) {
                            $log.debug('Caught an error gettestcandidateList after update:', error);
                            vm.data = [];
                            vm.message = error;
                            Notification.error({ message: error, delay: 5000 });
                            return ($q.reject(error));
                        });

                    return vm.thistestcandidate;
                }).catch(function(e) {
                    $log.debug('removetestcandidate failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({ message: e, delay: 5000 });
                    throw e;
                });
        }


        function createtestcandidate(testingid) {
            if (vm.selected === false) {
                var error = "no rows selected for testcandidate";
                Notification.error({ message: error, delay: 5000 });
                return;
            }

            var path = "../v1/testcandidateregistration";

            var thedata = {
                testingid: testingid,
                selectedStudents: vm.selectedStudents
            };
            $log.debug('about createtestcandidate ', path, thedata, vm.testname);
            return TestingServices.createtestcandidate(path, thedata)
                .then(function(data) {
                    $log.debug('createtestcandidate returned data');
                    $log.debug(data);
                    if (typeof(data) !== 'undefined') {
                        vm.thistestcandidate = data;
                        $log.debug(vm.thistestcandidate);
                        $log.debug(vm.thistestcandidate.message);
                        vm.message = vm.thistestcandidate.message;
                        Notification.success({ message: vm.message, delay: 5000 });
                    }
                    else {
                        Notification.success({ message: "Not created", delay: 5000 });
                    }
                    gettestcandidateList(vm.testname, vm.testtype).then(function(zdata) {
                            $log.debug('gettestcandidateList returned', zdata);
                        },
                        function(error) {
                            $log.debug('Caught an error gettestcandidateList after update:', error);
                            vm.data = [];
                            vm.message = error;
                            Notification.error({ message: error, delay: 5000 });
                            return ($q.reject(error));
                        });
                    return;

                }).catch(function(e) {
                    $log.debug('createtestcandidate failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({ message: e, delay: 5000 });
                    throw e;
                });
        }

        function gettestcandidateList(thetestname, thetesttype) {
            $log.debug('gettestcandidateList entered', thetestname, thetesttype);
            var refreshpath = encodeURI('../v1/testcandidatelist?testname=' + thetestname + '&testtype=' + thetesttype);
            var mom;
            var now = moment();

            $log.debug('gettestcandidateList path:', refreshpath);

            return TestingServices.gettestcandidateList(refreshpath).then(function(data) {
                    $log.debug('gettestcandidateList returned data');
                    $log.debug(data);
                    if (typeof(data) !== 'undefined' && data.testcandidateList.error !== false) {
                        for (var iter = 0; iter < data.testcandidateList.length; iter++) {
                            mom = moment(data.testcandidateList[iter].lastpromoted);
                            data.testcandidateList[iter].daysSinceLastTest = now.diff(mom, 'days');
                            if (data.testcandidateList[iter].age >= data.testcandidateList[iter].ageForNextClass &&
                                data.testcandidateList[iter].RankAchievedInTest == data.testcandidateList[iter].rankForNextClass ) {
//                                data.testcandidateList[iter].recommendedClass = data.testcandidateList[iter].nextClass;
                                data.testcandidateList[iter].recommendedClassid = data.testcandidateList[iter].nextClassid;
                                data.testcandidateList[iter].recommendedPgmid = data.testcandidateList[iter].nextPgmid;
                                data.testcandidateList[iter].recommendedClassnm = data.testcandidateList[iter].nextClassnm;
                                data.testcandidateList[iter].recommendedPgmnm = data.testcandidateList[iter].nextPgmnm;
                                data.testcandidateList[iter].changeClass = true;
                            }
                            data.testcandidateList[iter].promote = true;
                        }
                        setResGridOptions();
                        vm.resgridOptions.data = data.testcandidateList;
                    }
                    return;
                },
                function(error) {
                    $log.debug('Caught an error gettestcandidateList:', error);
                    vm.resgridOptions.data = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function gettestcandidateDetails(thetesttype) {
            //called by gettestdates
            $log.debug('gettestcandidateDetails entered:', thetesttype);
            var path = encodeURI('../v1/testcandidatedetails?testtype=' + thetesttype);
            var messagetxt;
            //view testcandidatesource
            $log.debug('gettestcandidateDetails path:', path);

            return TestingServices.gettestcandidateDetails(path).then(function(data) {
                    $log.debug('gettestcandidateDetails returned data');
                    $log.debug(data);
                    if (typeof(data.testcandidatedetails) !== 'undefined' && data.testcandidatedetails.length > 0) {
                        vm.gridOptions.data = data.testcandidatedetails;

                        $log.debug("details", data.testcandidatedetails[0]);

                        vm.ContactID = data.testcandidatedetails[0].contactID;

                        //check for empty set and do message
                        messagetxt = "testcandidateDetails obtained";
                        Notification.success({ message: messagetxt, delay: 5000 });

                    }
                    else {
                        messagetxt = "No test candidates found";
                        Notification.warning({ message: messagetxt, delay: 5000 });
                    }
                    return;
                },
                function(error) {
                    $log.debug('Caught an error gettestcandidateDetails:', error);
                    vm.data = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function gettestcandidateNames(testcandidatepartial) {
            $log.debug('gettestcandidateNames entered');
            var path = encodeURI('../v1/testcandidatenames?testcandidatepartial=' + testcandidatepartial);

            $log.debug('gettestcandidateNames path:', path);

            return TestingServices.gettestcandidateNames(path).then(function(data) {
                    $log.debug('gettestcandidateNames returned data');
                    $log.debug(data);
                    vm.testcandidatenames = data.testcandidatenames;
                    //check for empty set and do message
                    //messagetxt = "testcandidateDetails obtained";
                    //Notification.success({message: messagetxt, delay: 5000});
                    return;
                },
                function(error) {
                    $log.debug('Caught an error gettestcandidateDetails:', error);
                    vm.data.testcandidatelist = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function initGridOptions() {


            vm.gridOptions = {
                enableFiltering: true,
                paginationPageSizes: vm.limits,
                paginationPageSize: 10,
                rowHeight: 100,
                //                columnDefs: vm.tcsrccoldef.columns,
                //rowHeight: 15,
                showGridFooter: true,
                enableColumnResizing: true,
                enableGridMenu: true,
                showColumnFooter: true,
                appScopeProvider: vm,
                exporterCsvFilename: 'testcandidate.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 500,
                exporterPdfFooter: function(currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function(docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                onRegisterApi: function(gridApi) {
                    $log.debug('vm gridapi onRegisterApi');
                    vm.gridApi = gridApi;

                    gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                        var msg = 'grid row selected ' + row.entity;
                        $log.debug(msg);

                        var selectedStudentarr = this.grid.api.selection.getSelectedRows();
                        $log.debug('selected', selectedStudentarr);
                        setSelectedArray(selectedStudentarr);

                    });
                    gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                        $log.debug("grid batch");
                        var selectedStudentarr = this.grid.api.selection.getSelectedRows();
                        $log.debug('batch selected', selectedStudentarr);
                        setSelectedArray(selectedStudentarr);

                    });
                    gridApi.edit.on.afterCellEdit($scope,
                        function(rowEntity, colDef, newValue, oldValue) {
                            $log.debug('rowEntity');
                            $log.debug(rowEntity);
                            //Alert to show what info about the edit is available
                            $log.debug('Column: ' + colDef.name +
                                ' newValue: ' + newValue + ' oldValue: ' + oldValue);
                            if (newValue != oldValue) {
                                updatetestcandidate(colDef, newValue, rowEntity);
                            }
                        });
                }

            };


            $log.debug('setGridOptions gridOptions', vm.gridOptions);

        }

        function setGridOptions() {


            vm.gridOptions = {
                columnDefs: vm.tcsrccoldef.columns

            };


            $log.debug('setGridOptions gridOptions', vm.gridOptions);

        }

        function initResGridOptions() {

            vm.resgridOptions = {
                enableFiltering: true,
                paginationPageSizes: vm.limits,
                paginationPageSize: 10,
                rowHeight: 100,
                showGridFooter: true,
                enableColumnResizing: true,
                enableGridMenu: true,
                enableHorizontalScrollbar: 2,
                showColumnFooter: true,
                exporterCsvFilename: 'testcandidate.csv',
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
                    $log.debug('resgridapi onRegisterApi');
                    vm.resgridApi = gridApi;

                    gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                        var msg = 'grid row selected ' + row.entity;
                        $log.debug(msg);

                        var selectedStudentarr = this.grid.api.selection.getSelectedRows();

                        $log.debug('selected', selectedStudentarr);
                        setresSelectedArray(selectedStudentarr);

                    });
                    gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                        $log.debug("grid batch");
                        var selectedStudentarr = this.grid.api.selection.getSelectedRows();
                        $log.debug('batch selected', selectedStudentarr);
                        setresSelectedArray(selectedStudentarr);

                    });
                    gridApi.edit.on.afterCellEdit($scope,
                        function(rowEntity, colDef, newValue, oldValue) {
                            $log.debug('rowEntity');
                            $log.debug(rowEntity);
                            //Alert to show what info about the edit is available
                            $log.debug('Column: ' + colDef.name +
                                ' newValue: ' + newValue + ' oldValue: ' + oldValue);
                            if (newValue != oldValue) {
                                updatetestcandidate(colDef, newValue, rowEntity);
                            }
                        });

                }
            };

            $log.debug('setResGridOptions ', vm.resgridOptions);

        }

        function setResGridOptions() {

            vm.resgridOptions = {
                columnDefs: vm.tclistcoldef.columns

            };

            $log.debug('setResGridOptions ', vm.resgridOptions);

        }

        function updatetestcandidate(colDef, newValue, rowEntity) {
            var path = "../v1/testcandidateregistration";
            var indata = {
                changedColumn: colDef,
                newValue: newValue,
                ContactID: rowEntity.ContactID,
                testcandidate: vm.testcandidate,
            };

            $log.debug('about updatetestcandidate ', indata, path);

            return TestingServices.updatetestcandidate(path, indata)
                .then(function(data) {
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
                    Notification.error({ message: e, delay: 5000 });
                    throw e;
                });

        }

        function promotetestcandidate() {

            getGeneralColDefs('test', 'promotion').then(function() {
                $log.debug('getGeneralColDefs ready');

                var saveResgridOptions = angular.copy(vm.resgridOptions);
                var vmTestRptmodal = vm;
                var testDate = vmTestRptmodal.TestCandidateSelected.name;
                var testTime = vmTestRptmodal.testdatelist.starttime;
                var rptGridOptions = {};
                rptGridOptions = saveResgridOptions;
                rptGridOptions.enableGridMenu = true;
                rptGridOptions.columnDefs = vm.promotioncoldef.columns;
                //        rptGridOptions.exporterPdfTableLayout = {fillColor: function (i, node) { return (i % 2 === 0) ?  '#CCCCCC' : null; }} ;
                rptGridOptions.exporterPdfDefaultStyle = { fontSize: 7 };
                rptGridOptions.exporterPdfTableStyle = { margin: [15, 15, 15, 15] };
                rptGridOptions.exporterPdfTableHeaderStyle = { fontSize: 9, bold: true, italics: true, color: 'blue' };
                rptGridOptions.exporterPdfHeader = { text: "Student/Belt Test Checklist for testing on: " + testDate, style: 'headerStyle' };
                rptGridOptions.exporterPdfFooter = myexporterPdfFooter;
                rptGridOptions.enableCellEditOnFocus = true;

                rptGridOptions.paginationPageSizes = vm.limits;
                rptGridOptions.paginationPageSize = vm.initialLength;
                rptGridOptions.rowHeight = vm.rowheight;


                function myexporterPdfFooter(currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                }
                rptGridOptions.exporterPdfCustomFormatter = myexporterPdfCustomFormatter;

                function myexporterPdfCustomFormatter(docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 18, bold: true, margin: 5 };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: 15 };
                    docDefinition.content[0].layout = {
                        fillColor: function(i, node) { return (i % 2 === 0) ? '#CCCCCC' : null; }
                    };

                    return docDefinition;
                }
                rptGridOptions.exporterPdfOrientation = 'landscape';
                rptGridOptions.exporterPdfPageSize = 'LETTER';
                rptGridOptions.exporterPdfMaxGridWidth = 600;


                TestingServices.setGrid(rptGridOptions, vm.resgridApi, testDate, testTime);

                vmTestRptmodal.animationsEnabled = true;

                vmTestRptmodal.modalInstance = undefined;
                vmTestRptmodal.retvlu = '';

                vmTestRptmodal.modalInstance = $uibModal.open({
                    animation: vmTestRptmodal.animationsEnabled,
                    templateUrl: 'templates/states/promotion.html',
                    controller: 'ModalPromotionInstanceController as vm',
                    size: 'lg',
                    windowClass: 'my-modal-popup',
                    resolve: {
                        classname: function() {
                            $log.debug('return from open');
                            return vmTestRptmodal.retvlu;
                        }
                    }
                });
                vmTestRptmodal.modalInstance.result.then(function(retvlu) {
                    $log.debug('search modalInstance result :', retvlu);
                    vmTestRptmodal.retvlu = retvlu;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                //restore
                //          vm.resgridOptions = saveResgridOptions;

            }).catch(function(e) {
                $log.debug("createTestChecklist error in activate", e);
            });



        }

        function setSelectedArray(inputArray) {
            $log.debug("setSelectedArray entered", inputArray);
            vm.selectedStudents = [];
            //todo: move readyfornext rank to studentregistration

            if (inputArray.length > 0) {
                vm.selected = true;
                for (var i = 0, len = inputArray.length; i < len; i++) {
                    var info = {
                        ContactID: inputArray[i].contactID,
                        studentname: inputArray[i].FirstName + ' ' + inputArray[i].LastName,
                        FirstName: inputArray[i].FirstName,
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
            }
            else {
                vm.selected = false;
                return;
            }

            $log.debug("setarray", vm.selectedStudents);

        }

        function setresSelectedArray(inputArray) {
            $log.debug("setresSelectedArray entered", inputArray);
            vm.selectedStudents = [];

            if (inputArray.length > 0) {
                vm.selected = true;
                for (var i = 0, len = inputArray.length; i < len; i++) {
                    var info = {
                        ContactID: inputArray[i].contactID,
                        studentname: inputArray[i].FirstName + ' ' + inputArray[i].LastName,
                        FirstName: inputArray[i].FirstName,
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
                        zip: inputArray[i].zip,
                        AttendPromoteTarget: inputArray[i].AttendPromoteTarget,
                        DurationPromoteTarget: inputArray[i].DurationPromoteTarget,
                        class: inputArray[i].class,
                        rankForNextClass: inputArray[i].rankForNextClass,
                        ranklistForNextClass: inputArray[i].ranklistForNextClass,
                        ageForNextClass: inputArray[i].ageForNextClass,
                        nextClassid: inputArray[i].nextClassid,
                        nextPgmid: inputArray[i].nextPgmid,
                        crid: inputArray[i].crid
                        
                    };
                    vm.selectedStudents.push(info);
                }
            }
            else {
                vm.selected = false;
                return;
            }

            $log.debug("setarray", vm.selectedStudents);

        }

        function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            }
            else {
                return '';
            }
        }

        function getTemplateNames(templatepartial) {
            $log.debug('getTemplateNames entered');
            var path = encodeURI('../v1/templatenames?templatepartial=' + templatepartial);

            $log.debug('gettemplateNames path:', path);

            return TemplateServices.gettemplateNames(path).then(function(data) {
                    $log.debug('gettemplateNames returned data');
                    $log.debug(data);
                    vm.templatelist = data.templatelist;
                    return;
                },
                function(error) {
                    $log.debug('Caught an error getTemplateNames:', error);
                    vm.templatelist = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }

        function gettemplateDetails(templateSelected) {
            //called by gettestdates
            $log.debug('gettemplateDetails entered:', templateSelected.templatename);
            var path = encodeURI('../v1/templatedetails?templatename=' + templateSelected.templatename);
            var messagetxt;
            //view templatesource
            $log.debug('gettemplateDetails path:', path);

            return TemplateServices.gettemplateDetails(path).then(function(data) {
                    $log.debug('gettemplateDetails returned data');
                    $log.debug(data);
                    if (typeof(data.templatedetails) !== 'undefined' && data.templatedetails.length > 0) {
                        vm.templatedetails = data.templatedetails[0];
                        $log.debug("details", data.templatedetails[0]);

                        vm.htmlcontentdata.htmlcontentheader = vm.templatedetails.htmlheader === "NULL" ? '' : vm.templatedetails.htmlheader;
                        vm.htmlcontentdata.htmlcontent = vm.templatedetails.htmlbody === "NULL" ? '' : vm.templatedetails.htmlbody;
                        vm.htmlcontentdata.htmlcontentfooter = vm.templatedetails.htmlfooter === "NULL" ? '' : vm.templatedetails.htmlfooter;
                        vm.mycontentheader = vm.templatedetails.parsedheader;
                        vm.mycontent = vm.templatedetails.parsedbody;
                        vm.mycontentfooter = vm.templatedetails.parsedfooter;
                        vm.headerimages[0] = vm.templatedetails.headerimage === "NULL" ? '' : vm.templatedetails.headerimage;
                        vm.footerimages[0] = vm.templatedetails.footerimage === "NULL" ? '' : vm.templatedetails.footerimage;
                        vm.backgroundimages[0] = vm.templatedetails.backgroundimage === "NULL" ? '' : vm.templatedetails.backgroundimage;
                        vm.maxHeaderHeight = vm.templatedetails.maxHeaderHeight;
                        vm.maxFooterHeight = vm.templatedetails.maxFooterHeight;
                        vm.pageMarginL = vm.templatedetails.pageMarginLeft;
                        vm.pageMarginR = vm.templatedetails.pageMarginRight;
                        vm.pageMarginT = vm.templatedetails.pageMarginTop;
                        vm.pageMarginB = vm.templatedetails.pageMarginBottom;
                        vm.pageSize = vm.templatedetails.pageSize;
                        vm.pageOrientation = vm.templatedetails.pageOrientation;
                        vm.templatename = vm.templatedetails.templatename;
                        vm.pagebreak = vm.templatedetails.pagebreak;
                        //check for empty set and do message
                        messagetxt = "templateDetails obtained";
                        Notification.success({ message: messagetxt, delay: 5000 });

                    }
                    else {
                        messagetxt = "No templates found";
                        Notification.warning({ message: messagetxt, delay: 5000 });
                    }
                    return;
                },
                function(error) {
                    $log.debug('Caught an error gettemplateDetails:', error);
                    vm.templatedetails = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
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
                    dash: { length: 5 }
                },

                bigtop: {
                    margin: [0, 0, 0, 0]
                },
                topfiller: {
                    margin: [0, 40]
                },
                botfiller: {
                    margin: [0, 5]
                },
                ymcabotfiller: {
                    margin: [0, 12]
                },
                spread: {
                    margin: [0, 5]
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
                    margin: [270, 45, 0, 20],
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

        function substitute(content, students, pagebreak, certdata) {
            var tmp, obj;
            var contentdtl = [];
            if (typeof(students) !== 'undefined' && students.length > 0) {
                for (var i = 0; i < students.length; i++) {
                    $log.debug('process student:', students[i]);
                    if (i < students.length - 1) {
                        if (vm.pagebreak == "student") {
                            pagebreak = { pageBreak: 'before', text: '' };
                        }
                        else {
                            pagebreak = {};
                        }
                    }
                    else {
                        pagebreak = {};
                    }
                    $log.debug("types", content.length, typeof(pagebreak));
                    tmp = content;

                    tmp = tmp.replace(/{agecat}/g, students[i].agecat);
                    tmp = tmp.replace(/{classcat}/g, students[i].classcat);
                    tmp = tmp.replace(/{nclass}/g, students[i].nclass);
                    tmp = tmp.replace(/{pgrmcat}/g, students[i].pgrmcat);
                    tmp = tmp.replace(/{nextClass}/g, students[i].nextClass);

                    tmp = tmp.replace(/{age}/g, students[i].age);
                    tmp = tmp.replace(/{birthday}/g, students[i].birthday);
                    tmp = tmp.replace(/{phone}/g, students[i].phone);
                    tmp = tmp.replace(/{parent}/g, students[i].parent);
                    tmp = tmp.replace(/{zip}/g, students[i].zip);
                    tmp = tmp.replace(/{city}/g, students[i].city);
                    tmp = tmp.replace(/{state}/g, students[i].state);
                    tmp = tmp.replace(/{address}/g, students[i].address);
                    tmp = tmp.replace(/{email}/g, students[i].email);
                    tmp = tmp.replace(/{beltsize}/g, students[i].BeltSize);
                    tmp = tmp.replace(/{daysAttended}/g, students[i].daysAttended);
                    tmp = tmp.replace(/{daysSinceLastTest}/g, students[i].daysSinceLastTest);
                    tmp = tmp.replace(/{lastPromoted}/g, students[i].lastpromoted);

                    tmp = tmp.replace(/{FirstName}/g, students[i].FirstName);
                    tmp = tmp.replace(/{LastName}/g, students[i].LastName);
                    tmp = tmp.replace(/{classwas}/g, students[i].classWas);
                    tmp = tmp.replace(/{pgmwas}/g, students[i].pgmWas);

                    tmp = tmp.replace(/{studentname}/g, students[i].studentname);
                    tmp = tmp.replace(/{nextRank}/g, students[i].RankAchievedInTest);
                    tmp = tmp.replace(/{certDate}/g, moment(certdata.certDate).format("MMM DD, YYYY"));
                    tmp = tmp.replace(/{teststarttime}/g, moment(certdata.teststarttime).format("hh:mm A"));
                    tmp = tmp.replace(/{testfee}/g, certdata.testfee);
                    tmp = tmp.replace(/{school}/g, certdata.school);
                    tmp = tmp.replace(/{program}/g, certdata.program);
                    tmp = tmp.replace(/{instructor1}/g, certdata.instructor1);
                    tmp = tmp.replace(/{instructor2}/g, certdata.instructor2);
                    tmp = tmp.replace(/{instructor3}/g, certdata.instructor3);
                    tmp = tmp.replace(/{instructor4}/g, certdata.instructor4);
                    tmp = tmp.replace(/{title1}/g, certdata.title1);
                    tmp = tmp.replace(/{title2}/g, certdata.title2);
                    tmp = tmp.replace(/{title3}/g, certdata.title3);
                    tmp = tmp.replace(/{title4}/g, certdata.title4);
                    try {
                        obj = JSON.parse('[' + tmp + ']');
                    }
                    catch (e) {
                        $log.debug(e instanceof SyntaxError); // true
                        $log.debug(e.message); // "missing ; before statement"
                        $log.debug(e.name); // "SyntaxError"
                        $log.debug(e.fileName); // "Scratchpad/1"
                        $log.debug(e.lineNumber); // 1
                        $log.debug(e.columnNumber); // 4
                        $log.debug(e.stack); // "@Scratchpad/1:2:3\n"
                    }
                    contentdtl.push([
                        obj,
                        //                    {text:  students[i].studentname, style: ['mediumlines','botfiller']},
                        pagebreak
                    ]);

                }

            }
            else {
                contentdtl = [content];
            }
            return contentdtl;
        }

        function genPDF(templatename) {
            var mycontent = vm.mycontent;
            var mycontentheader = vm.mycontentheader;
            var mycontentfooter = vm.mycontentfooter;
            var students = vm.selectedStudents;
            var program = "and is therefore awarded the rank of";
            var testfee = 25;

            var certdata = {
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
                title1: _.findWhere(vm.instructorlist, { name: vm.testdatelist.tester1 }).instructortitle,
                title2: _.findWhere(vm.instructorlist, { name: vm.testdatelist.tester2 }).instructortitle,
                title3: _.findWhere(vm.instructorlist, { name: vm.testdatelist.tester3 }).instructortitle,
                title4: _.findWhere(vm.instructorlist, { name: vm.testdatelist.tester4 }).instructortitle
            };

            $log.debug('after parsehmtl', mycontent, students, typeof(students), students.length);
            var contentdtl = [];
            var tmp;
            var obj;
            var pagebreak;
            contentdtl = substitute(mycontent, students, pagebreak, certdata);
            try {
                //todo call substitute for header and footer too
                tmp = mycontentheader;
                obj = JSON.parse('[' + tmp + ']');
                mycontentheader = obj;
                tmp = mycontentfooter;
                obj = JSON.parse('[' + tmp + ']');
                mycontentfooter = obj;
            }
            catch (e) {
                $log.debug(e instanceof SyntaxError); // true
                $log.debug(e.message); // "missing ; before statement"
                $log.debug(e.name); // "SyntaxError"
                $log.debug(e.fileName); // "Scratchpad/1"
                $log.debug(e.lineNumber); // 1
                $log.debug(e.columnNumber); // 4
                $log.debug(e.stack); // "@Scratchpad/1:2:3\n"
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
            }
            else {
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
            $log.debug('doc json', myJsonString);


            pdfMake.createPdf(docDefinition).open();
        }

    }

})(window, window.angular, window.pdfMake);
