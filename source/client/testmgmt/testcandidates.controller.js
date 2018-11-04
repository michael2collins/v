import angular from 'angular';
//const { moment: moment } = window;
const { pdfMake: pdfMake } = window;

export class TestCandidateTableBasicController {
    constructor(
        $routeParams, $log, TestingServices, CalendarServices, $location, $window, $q,
        $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants, $timeout, UserServices,
        TemplateServices, AttendanceServices, $uibModal, _, moment,
        portalDataService, Util
    ) {
        'ngInject';
//        this.textAngularManager = textAngularManager;
        this.$routeParams = $routeParams;
        this.$log = $log;
        this.TestingServices = TestingServices;
        this.CalendarServices = CalendarServices;
        this.$location = $location;
        this.$window = $window;
        this.$q = $q;
        this.$scope = $scope;
        this.$route = $route;
        this.Notification = Notification;
        this.uiGridConstants = uiGridConstants;
        this.uiGridGroupingConstants = uiGridGroupingConstants;
        this.$timeout = $timeout;
        this.UserServices = UserServices;
        this.TemplateServices = TemplateServices;
        this.AttendanceServices = AttendanceServices;
        this.$uibModal = $uibModal;
        this._ = _;
        this.moment = moment;
        this.portalDataService = portalDataService;
        this.Util = Util;

    }
    $onDestroy() {
        this.$log.debug("TestCandidateTableBasicController dismissed");
        this.$log.debugEnabled(false);
    }

    $onInit() {
        console.log("TestCandidateTableBasicController ...");

        var vm = this;

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
        vm.resgridApi = {};
        vm.gridApi = {};
        vm.resgridOptions = {};
        vm.resgridOptions.data = [{}];
        vm.selectedStudents = [];
        vm.TestCandidateSelected = '';
        vm.testcandidatenames = [];
        vm.instructorlist = [];
        vm.testcandidate = '';
        vm.ContactID = '';
        vm.selected = false;
        vm.testname = '';
        vm.testtype = '';
        vm.userdta = {};
        vm.htmlcontentdisabled = false;
        vm.htmlcontentcanEdit = true;
        vm.templatenameSelected = '';
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
        vm.pagebreak = '';
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
        vm.mycontentheader = '';
        vm.mycontent = '';
        vm.mycontentfooter = '';
        vm.checklistcoldef = '';
        vm.promopostcard = '';
        vm.beltlabelcoldef = '';
        vm.tcsrccoldef = '';
        vm.tclistcoldef = '';
        vm.tempres = '';
        vm.htmlcontentdata = {};
        vm.htmlcontentdata.htmlcontentheader = '';
        vm.htmlcontentdata.htmlcontent = '';
        vm.htmlcontentdata.htmlcontentfooter = '';
        vm.styleleft = "400px";
        vm.styleright = "400px";
        vm.gridright = 10; //5
        vm.gridleft = 10; //5
        vm.gridleftcnt = 0;
        vm.gridrightcnt = 0;
        vm.restricted = true;


        vm.activate();
    }

    setActiveTab(activeTab, thecaller) {
        var self = this;
        self.$log.debug('set activetab as:', activeTab, thecaller);
        self.TestingServices.setActiveTab(activeTab, thecaller);

    }

    getActiveTab() {
        var self = this;
        var atab = self.TestingServices.getActiveTab();
        self.$log.debug('get activetab is:', atab);
        self.active = atab;
        return atab;
    }

    setSlide(direction) {
        var vm = this;
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
            //                vm.styleright = "400px";
            //                vm.styleleft = "400px";                
            //                vm.gridright = 5;
            //                vm.gridleft = 5;
            vm.showright = true;
            vm.showleft = true;
        }
    }

    createTestChecklist() {
        var vm = this;
        if (vm.selected === false) {
            var error = "no rows selected for test candidate";
            vm.Notification.error({ message: error, delay: 5000 });
            return;
        }
        vm.getGeneralColDefs('test', 'checklist').then(function() {
            vm.$log.debug('getGeneralColDefs ready');

            var saveResgridOptions = angular.copy(vm.resgridOptions);
            var vmTestRptmodal = vm;
            var rptlayout = 'testRpt';
            var testDate = vmTestRptmodal.TestCandidateSelected.name;
            var testTime = vmTestRptmodal.testdatelist.starttime;
            var rptGridOptions = {};
            //            rptGridOptions.data = vm.resgridOptions.data;
            rptGridOptions = saveResgridOptions;
            rptGridOptions.data = vm.selectedStudents;

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


            vm.TestingServices.setGrid(rptGridOptions, vm.resgridApi, testDate, testTime);

            vmTestRptmodal.animationsEnabled = true;

            vmTestRptmodal.modalInstance = undefined;
            vmTestRptmodal.retvlu = '';

            vmTestRptmodal.modalInstance = vmTestRptmodal.$uibModal.open({
                animation: vmTestRptmodal.animationsEnabled,
                //                templateUrl: 'templates/testmgmt/testRpt.html',
                //                controller: 'ModalTestRptInstanceController as vmnew',
                component: 'testrptComponent',
                size: 'lg',
                resolve: {
                    classname: function() {
                        vmTestRptmodal.$log.debug('return from open');
                        return vmTestRptmodal.retvlu;
                    }
                }
            });
            vmTestRptmodal.modalInstance.result.then(function(retvlu) {
                vmTestRptmodal.$log.debug('search modalInstance result :', retvlu);
                vmTestRptmodal.retvlu = retvlu;
            }, function() {
                vmTestRptmodal.$log.info('Modal dismissed at: ' + new Date());
            });

            //restore
            //          vm.resgridOptions = saveResgridOptions;

        }).catch(function(e) {
            vm.$log.debug("createTestChecklist error in activate", e);
        });

    }

    createPromoPostcards() {
        var vm = this;
        if (vm.selected === false) {
            var error = "no rows selected for createPromoPostcards";
            vm.Notification.error({ message: error, delay: 5000 });
            return;
        }
        vm.getGeneralColDefs('test', 'promopostcard').then(function() {
            vm.$log.debug('getGeneralColDefs ready createPromoPostcards');

            var saveResgridOptions = angular.copy(vm.resgridOptions);
            var vmTestRptmodal = vm;
            var rptlayout = 'testRpt';
            var testDate = vmTestRptmodal.TestCandidateSelected.name;
            var testTime = vmTestRptmodal.testdatelist.starttime;
            var rptGridOptions = {};
            //            rptGridOptions.data = vm.resgridOptions.data;
            rptGridOptions = saveResgridOptions;
            rptGridOptions.data = vm.selectedStudents;

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


            vm.TestingServices.setGrid(rptGridOptions, vm.resgridApi, testDate, testTime);

            vmTestRptmodal.animationsEnabled = true;

            vmTestRptmodal.modalInstance = undefined;
            vmTestRptmodal.retvlu = '';

            vmTestRptmodal.modalInstance = vmTestRptmodal.$uibModal.open({
                animation: vmTestRptmodal.animationsEnabled,
                //                templateUrl: 'templates/testmgmt/testRpt.html',
                //                controller: 'ModalTestRptInstanceController as vmnew',
                component: 'testrptComponent',
                size: 'lg',
                resolve: {
                    classname: function() {
                        vmTestRptmodal.$log.debug('return from open');
                        return vmTestRptmodal.retvlu;
                    }
                }
            });
            vmTestRptmodal.modalInstance.result.then(function(retvlu) {
                vmTestRptmodal.$log.debug('search modalInstance result :', retvlu);
                vmTestRptmodal.retvlu = retvlu;
            }, function() {
                vmTestRptmodal.$log.info('Modal dismissed at: ' + new Date());
            });

            //restore
            //          vm.resgridOptions = saveResgridOptions;

        }).catch(function(e) {
            vm.$log.debug("createPromoPostcards error in activate", e);
        });

    }

    convertDataToColumns(thedata, fields, fieldlabels, numOfCols) {
        var convertedData = [];
        var datalen = thedata.length;
        var fieldlen = fields.length;
        var colarr = [];
        var rowstr;
        var colcounter = 0;
        //rare, but if there are more cols then selected rows
        numOfCols = datalen < numOfCols ? datalen : numOfCols;
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

    createBeltLabels() {
        var vm = this;
        if (vm.selected === false) {
            var error = "no rows selected for createBeltLabels";
            vm.Notification.error({ message: error, delay: 5000 });
            return;
        }
        vm.getGeneralColDefs('test', 'beltlabels').then(function() {
            vm.$log.debug('getGeneralColDefs ready createBeltLabels');

            var saveResgridOptions = angular.copy(vm.resgridOptions);
            var vmTestRptmodal = vm;
            var rptlayout = 'testRpt';
            var testDate = vmTestRptmodal.TestCandidateSelected.name;
            var testTime = vmTestRptmodal.testdatelist.starttime;
            var rptGridOptions = {};
            //            rptGridOptions.data = vm.resgridOptions.data;
            //            var half_length = Math.ceil(vm.resgridOptions.data.length / 2);    
            rptGridOptions = saveResgridOptions;
            rptGridOptions.data = vm.convertDataToColumns(
                vm.selectedStudents, ['FullName', 'RankAchievedInTest', 'BeltSize'], ['Name:', 'Rank:', 'Size:'],
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
                        return (0);
                    },
                    vLineWidth: function(i, node) {
                        return (0);
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

            vm.TestingServices.setGrid(rptGridOptions, vm.resgridApi, testDate, testTime, rptlayout);

            vmTestRptmodal.animationsEnabled = true;

            vmTestRptmodal.modalInstance = undefined;
            vmTestRptmodal.retvlu = '';

            vmTestRptmodal.modalInstance = vmTestRptmodal.$uibModal.open({
                animation: vmTestRptmodal.animationsEnabled,
                //                templateUrl: 'templates/testmgmt/testRpt.html',
                //                controller: 'ModalTestRptInstanceController as vmnew',
                component: 'testrptComponent',
                size: 'lg',
                resolve: {
                    classname: function() {
                        vmTestRptmodal.$log.debug('return from open');
                        return vmTestRptmodal.retvlu;
                    }
                }
            });
            vmTestRptmodal.modalInstance.result.then(function(retvlu) {
                vmTestRptmodal.$log.debug('search modalInstance result :', retvlu);
                vmTestRptmodal.retvlu = retvlu;
            }, function() {
                vmTestRptmodal.$log.info('Modal dismissed at: ' + new Date());
            });

            //restore
            //          vm.resgridOptions = saveResgridOptions;

        }).catch(function(e) {
            vm.$log.debug("createBeltLabels error in activate", e);
        });

    }

    calcsizes() {
        var vm = this;
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

    setLimit(thelimit) {
        var vm = this;
        vm.$log.debug('setLimit', thelimit);
        vm.limit = thelimit;
    }

    addToTest(testingid) {
        var vm = this;
        vm.$log.debug('addToTest entered', testingid);
        vm.createtestcandidate(testingid);
    }

    removeFromTest(testingid) {
        var vm = this;
        vm.$log.debug('removeFromTest entered');
        vm.removetestcandidate(testingid);
    }

    activate() {
        var vm = this;

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vm.$log.debugEnabled(true);
            vm.$log.debug("table-basic-testcandidates started");

        });
        vm.portalDataService.Portlet('testcandidates.controller.js');


        vm.getTestDates();
        vm.initGridOptions();
        vm.initResGridOptions();
        vm.getUserDetails();
        vm.getTemplateNames('').then(function() {
            vm.$log.debug('activate eventdetails fetched');
        });

        vm.$q.all([
                vm.getGeneralColDefs('test', 'checklist').then(function() {
                    vm.$log.debug('getGeneralColDefs ready');

                }).catch(function(e) {
                    vm.$log.debug("getPayerList error in activate", e);
                }),
                vm.getGeneralColDefs('test', 'Testcandidatesource').then(function() {
                    vm.$log.debug('getGeneralColDefs ready');
                    vm.setGridOptions();

                }).catch(function(e) {
                    vm.$log.debug("getPayerList error in activate", e);
                }),
                vm.getGeneralColDefs('test', 'Testcandidatelist').then(function() {
                    vm.$log.debug('getGeneralColDefs ready');
                    vm.setResGridOptions();
                }).catch(function(e) {
                    vm.$log.debug("testcandidates error in activate", e);
                }),
                vm.getInstructorList().then(function() {
                    vm.$log.debug('getInstructorList ready');

                }).catch(function(e) {
                    vm.$log.debug("testcandidates error in activate", e);
                })
            ])
            .then(function() {
                vm.$log.debug('testcandidates activation done');
            });
    }

    changeTab(tabname) {
        var vm = this;
        if (tabname === 'tab-test') {
            //            setGridOptions();
            //            setResGridOptions();

        }
        else if (tabname === 'tab-testmanage') {
            //           setResGridOptions();
        }
        else if (tabname === 'tab-testmaterial') {}
        else {
            vm.$log.debug('dont know tab', tabname);
        }
    }

    getUserDetails() {
        var vm = this;
        vm.$log.debug('getUserDetails entered');
        return vm.UserServices.getUserDetails().then(function(data) {
                vm.$log.debug("testcandidate getuserdetails returned:", data);
                vm.userdta = data;
                return vm.userdta;
            },

            function(error) {
                vm.$log.debug('Caught an error getUserDetails, going to notify:', error);
                vm.userdta = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    getGeneralColDefs(colkey, colsubkey) {
        var vm = this;
        vm.$log.debug('getGeneralColDefs entered', colkey, colsubkey);
        var path = encodeURI("../v1/gencoldefs?colkey=" + colkey + "&colsubkey=" + colsubkey);

        return vm.TestingServices.getGeneralColDefs(path).then(function(data) {
                vm.$log.debug("getGeneralColDefs returned:", data);
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
                vm.$log.debug('Caught an error getGeneralColDefs, going to notify:', error);
                vm.userdta = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    updateTest() {
        var vm = this;
        vm.$log.debug('updateTest entered');
        var path = "../v1/testing";
        var indata = {
            ID: vm.testdatelist.testingid,
            Tester1: vm.testdatelist.tester1,
            Tester2: vm.testdatelist.tester2,
            Tester3: vm.testdatelist.tester3,
            Tester4: vm.testdatelist.tester4
        };

        vm.$log.debug('about updateTesting ', indata, path);

        return vm.TestingServices.updateTesting(path, indata)
            .then(function(data) {
                vm.$log.debug('updateTesting returned data');
                vm.$log.debug(data);
                vm.message = data.message;

            }).catch(function(e) {
                vm.$log.debug('updateTesting failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getInstructorList() {
        var vm = this;
        vm.$log.debug('getInstructorList entered');
        var refreshpath = "../v1/instructorlist";
        var witnessdefault = {
            firstname: 'Witness',
            lastname: '',
            instructortitle: '',
            name: 'Witness'
        };
        return vm.CalendarServices.getinstructorlist(refreshpath).then(function(data) {
                vm.$log.debug(' calservices getinstructorlist returned data');
                vm.$log.debug(data);
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
                vm.$log.debug('Caught an error getinstructorlist, going to notify:', error);
                vm.instructorlist = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }


    getTestDates(testname) {
        var vm = this;
        if (typeof testname === 'undefined') {
            return {};
        }
        vm.$log.debug('getTestDates entered', testname);
        var refreshpath = encodeURI("../v1/testdates?testname=" + testname.name);
        var error;
        vm.testname = testname.name;
        vm.testtype = testname.eventtype;

        return vm.TestingServices.getTestDates(refreshpath).then(function(data) {
                vm.$log.debug('getTestDates returned data');
                vm.$log.debug(data);
                if (data.testdatelist.length > 1) {
                    error = "too many testdates found:" + data.testdatelist.length;
                    vm.message = error;
                    vm.Notification.error({ message: error, delay: 5000 });
                    vm.testdatelist = [];
                    return (vm.$q.reject(error));
                }
                if (data.testdatelist.length === 1) {
                    vm.testdatelist = data.testdatelist[0];
                    vm.testdatelist.starttime = vm.Util.convertTime(data.testdatelist[0].startdate);
                    vm.testdatelist.endtime = vm.Util.convertTime(data.testdatelist[0].enddate);
                    vm.gettestcandidateList(vm.testname, vm.testtype).then(function(zdata) {
                            vm.$log.debug('gettestcandidateList returned', zdata);
                        },
                        function(error) {
                            vm.$log.debug('Caught an error gettestcandidateList after update:', error);
                            vm.data = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });
                    vm.gettestcandidateDetails(vm.testdatelist.testtype).then(function(zdata) {
                            vm.$log.debug('gettestcandidateDetails returned', zdata);
                        },
                        function(error) {
                            vm.$log.debug('Caught an error gettestcandidateDetails after update:', error);
                            vm.data = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });


                }
                else {
                    error = "No testdates found in calendar for:" + testname.name;
                    vm.message = error;
                    vm.Notification.error({ message: error, delay: 5000 });
                    vm.testdatelist = [];
                    return (vm.$q.reject(error));

                }
                return vm.testdatelist;
            },
            function(error) {
                vm.$log.debug('Caught an error getTestDates, going to notify:', error);
                vm.testdatelist = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    testdateshow() {
        var vm = this;
        var show = false;
        if (vm.testdatelist !== undefined) {
            show = typeof(vm.testdatelist) === 'object' ? true : false;
        }
        //         vm.$log.debug('testdateshow', typeof(vm.testdatelist), vm.testdatelist, show);
        return show;
    }

    removetestcandidate(testingid) {
        var vm = this;
        if (vm.selected === false) {
            var error = "no rows selected for testcandidate";
            vm.Notification.error({ message: error, delay: 5000 });
            return;
        }

        var path = "../v1/testcandidateregistration";

        var thedata = {
            testingid: testingid,
            selectedStudents: vm.selectedStudents
        };
        vm.$log.debug('about removetestcandidate ', path, thedata, vm.testname);
        return vm.TestingServices.removetestcandidate(path, thedata)
            .then(function(data) {
                vm.$log.debug('removetestcandidate returned data');
                vm.$log.debug(data);
                vm.thistestcandidate = data;
                vm.$log.debug(vm.thistestcandidate);
                vm.$log.debug(vm.thistestcandidate.message);
                vm.message = vm.thistestcandidate.message;
                vm.Notification.success({ message: vm.message, delay: 5000 });
                vm.gettestcandidateList(vm.testname, vm.testtype).then(function(zdata) {
                        vm.$log.debug('gettestcandidateList returned', zdata);
                    },
                    function(error) {
                        vm.$log.debug('Caught an error gettestcandidateList after update:', error);
                        vm.data = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });

                return vm.thistestcandidate;
            }).catch(function(e) {
                vm.$log.debug('removetestcandidate failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    createtestcandidate(testingid) {
        var vm = this;
        if (vm.selected === false) {
            var error = "no rows selected for testcandidate";
            vm.Notification.error({ message: error, delay: 5000 });
            return;
        }

        var path = "../v1/testcandidateregistration";

        var thedata = {
            testingid: testingid,
            selectedStudents: vm.selectedStudents
        };
        vm.$log.debug('about createtestcandidate ', path, thedata, vm.testname);
        return vm.TestingServices.createtestcandidate(path, thedata)
            .then(function(data) {
                vm.$log.debug('createtestcandidate returned data');
                vm.$log.debug(data);
                if (typeof(data) !== 'undefined') {
                    vm.thistestcandidate = data;
                    vm.$log.debug(vm.thistestcandidate);
                    vm.$log.debug(vm.thistestcandidate.message);
                    vm.message = vm.thistestcandidate.message;
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                else {
                    vm.Notification.success({ message: "Not created", delay: 5000 });
                }
                vm.gettestcandidateList(vm.testname, vm.testtype).then(function(zdata) {
                        vm.$log.debug('gettestcandidateList returned', zdata);
                    },
                    function(error) {
                        vm.$log.debug('Caught an error gettestcandidateList after update:', error);
                        vm.data = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return;

            }).catch(function(e) {
                vm.$log.debug('createtestcandidate failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    gettestcandidateList(thetestname, thetesttype) {
        var vm = this;
        vm.$log.debug('gettestcandidateList entered', thetestname, thetesttype);
        var refreshpath = encodeURI('../v1/testcandidatelist?testname=' + thetestname + '&testtype=' + thetesttype);
        var mom;
        var now = moment();

        vm.$log.debug('gettestcandidateList path:', refreshpath);

        return vm.TestingServices.gettestcandidateList(refreshpath).then(function(data) {
                vm.$log.debug('gettestcandidateList returned data');
                vm.$log.debug(data);
                if (typeof(data) !== 'undefined' && data.testcandidateList.error !== false) {
                    for (var iter = 0; iter < data.testcandidateList.length; iter++) {
                        mom = moment(data.testcandidateList[iter].lastpromoted);
                        data.testcandidateList[iter].daysSinceLastTest = now.diff(mom, 'days');
                        if (data.testcandidateList[iter].age >= data.testcandidateList[iter].ageForNextClass &&
                            data.testcandidateList[iter].RankAchievedInTest == data.testcandidateList[iter].rankForNextClass) {
                            //                                data.testcandidateList[iter].recommendedClass = data.testcandidateList[iter].nextClass;
                            data.testcandidateList[iter].recommendedClassid = data.testcandidateList[iter].nextClassid;
                            data.testcandidateList[iter].recommendedPgmid = data.testcandidateList[iter].nextPgmid;
                            data.testcandidateList[iter].recommendedClassnm = data.testcandidateList[iter].nextClassnm;
                            data.testcandidateList[iter].recommendedPgmnm = data.testcandidateList[iter].nextPgmnm;
                            data.testcandidateList[iter].changeClass = true;
                        }
                        data.testcandidateList[iter].promote = true;
                    }
                    vm.setResGridOptions();
                    vm.resgridOptions.data = data.testcandidateList;
                }
                return;
            },
            function(error) {
                vm.$log.debug('Caught an error gettestcandidateList:', error);
                vm.resgridOptions.data = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    gettestcandidateDetails(thetesttype) {
        var vm = this;

        //called by gettestdates
        vm.$log.debug('gettestcandidateDetails entered:', thetesttype);
        var path = encodeURI('../v1/testcandidatedetails?testtype=' + thetesttype);
        if (vm.restricted !== undefined) {
            path = path + '&supplement=' + vm.restricted;
        }
        var messagetxt;
        //view testcandidatesource
        vm.$log.debug('gettestcandidateDetails path:', path);

        return vm.TestingServices.gettestcandidateDetails(path).then(function(data) {
                vm.$log.debug('gettestcandidateDetails returned data');
                vm.$log.debug(data);
                if (typeof(data.testcandidatedetails) !== 'undefined' && data.testcandidatedetails.length > 0) {
                    vm.gridOptions.data = data.testcandidatedetails;

                    vm.$log.debug("details", data.testcandidatedetails[0]);

                    vm.ContactID = data.testcandidatedetails[0].contactID;

                    //check for empty set and do message
                    messagetxt = "testcandidateDetails obtained";
                    vm.Notification.success({ message: messagetxt, delay: 5000 });

                }
                else {
                    messagetxt = "No test candidates found";
                    vm.Notification.warning({ message: messagetxt, delay: 5000 });
                }
                return;
            },
            function(error) {
                vm.$log.debug('Caught an error gettestcandidateDetails:', error);
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

    gettestcandidateNames(testcandidatepartial) {
        var vm = this;
        vm.$log.debug('gettestcandidateNames entered');
        var path = encodeURI('../v1/testcandidatenames?testcandidatepartial=' + testcandidatepartial);

        vm.$log.debug('gettestcandidateNames path:', path);

        return vm.TestingServices.gettestcandidateNames(path).then(function(data) {
                vm.$log.debug('gettestcandidateNames returned data');
                vm.$log.debug(data);
                vm.testcandidatenames = data.testcandidatenames;
                //check for empty set and do message
                //messagetxt = "testcandidateDetails obtained";
                //Notification.success({message: messagetxt, delay: 5000});
                return;
            },
            function(error) {
                vm.$log.debug('Caught an error gettestcandidateDetails:', error);
                vm.data.testcandidatelist = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    initGridOptions() {
        var vm = this;


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
                vm.$log.debug('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged(vm.$scope, function(row) {
                    var msg = 'grid row selected ' + row.entity;
                    vm.$log.debug(msg);

                    var selectedStudentarr = this.grid.api.selection.getSelectedRows();
                    vm.gridleftcnt = selectedStudentarr.length;
                    vm.$log.debug('selected', selectedStudentarr);
                    vm.setSelectedArray(selectedStudentarr);

                });
                gridApi.selection.on.rowSelectionChangedBatch(vm.$scope, function(rows) {
                    vm.$log.debug("grid batch");
                    var selectedStudentarr = this.grid.api.selection.getSelectedRows();
                    vm.gridleftcnt = selectedStudentarr.length;
                    vm.$log.debug('batch selected', selectedStudentarr);
                    vm.setSelectedArray(selectedStudentarr);

                });
                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        vm.$log.debug('rowEntity');
                        vm.$log.debug(rowEntity);
                        //Alert to show what info about the edit is available
                        vm.$log.debug('Column: ' + colDef.name +
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue);
                        if (newValue != oldValue) {
                            vm.updatetestcandidate(colDef, newValue, rowEntity);
                        }
                    });
            }

        };


        vm.$log.debug('setGridOptions gridOptions', vm.gridOptions);

    }

    setGridOptions() {
        var vm = this;


        vm.gridOptions = {
            columnDefs: vm.tcsrccoldef.columns

        };


        vm.$log.debug('setGridOptions gridOptions', vm.gridOptions);

    }

    initResGridOptions() {
        var vm = this;

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
                vm.$log.debug('resgridapi onRegisterApi');
                vm.resgridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged(vm.$scope, function(row) {
                    var msg = 'grid row selected ' + row.entity;
                    vm.$log.debug(msg);

                    var selectedStudentarr = this.grid.api.selection.getSelectedRows();
                    vm.gridrightcnt = selectedStudentarr.length;

                    vm.$log.debug('selected', selectedStudentarr);
                    vm.setresSelectedArray(selectedStudentarr);

                });
                gridApi.selection.on.rowSelectionChangedBatch(vm.$scope, function(rows) {
                    vm.$log.debug("grid batch");
                    var selectedStudentarr = this.grid.api.selection.getSelectedRows();
                    vm.gridrightcnt = selectedStudentarr.length;
                    vm.$log.debug('batch selected', selectedStudentarr);
                    vm.setresSelectedArray(selectedStudentarr);

                });
                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        vm.$log.debug('rowEntity');
                        vm.$log.debug(rowEntity);
                        //Alert to show what info about the edit is available
                        vm.$log.debug('Column: ' + colDef.name +
                            ' newValue: ' + newValue + ' oldValue: ' + oldValue);
                        if (newValue != oldValue) {
                            vm.updatetestcandidate(colDef, newValue, rowEntity);
                        }
                    });

            }
        };

        vm.$log.debug('setResGridOptions ', vm.resgridOptions);

    }

    setResGridOptions() {
        var vm = this;

        vm.resgridOptions = {
            columnDefs: vm.tclistcoldef.columns

        };

        vm.$log.debug('setResGridOptions ', vm.resgridOptions);

    }

    updatetestcandidate(colDef, newValue, rowEntity) {
        var vm = this;
        var path = "../v1/testcandidateregistration";
        var indata = {
            changedColumn: colDef,
            newValue: newValue,
            ContactID: rowEntity.ContactID,
            testcandidate: vm.testcandidate,
        };

        vm.$log.debug('about updatetestcandidate ', indata, path);

        return vm.TestingServices.updatetestcandidate(path, indata)
            .then(function(data) {
                vm.$log.debug('updatetestcandidate returned data');
                vm.$log.debug(data);
                vm.thiscoldef = data;
                vm.$log.debug(vm.thiscoldef);
                vm.$log.debug(vm.thiscoldef.message);
                vm.message = vm.thiscoldef.message;

            }).catch(function(e) {
                vm.$log.debug('updatetestcandidate failure:');
                vm.$log.debug("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    promotetestcandidate() {
        var vm = this;

        vm.getGeneralColDefs('test', 'promotion').then(function() {
            vm.$log.debug('getGeneralColDefs ready');

            var saveResgridOptions = angular.copy(vm.resgridOptions);
            var vmTestRptmodal = vm;
            var testDate = vmTestRptmodal.TestCandidateSelected.name;
            var testTime = vmTestRptmodal.testdatelist.starttime;
            var rptGridOptions = {};
            rptGridOptions = saveResgridOptions;
            rptGridOptions.data = vm.selectedStudents;

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


            vm.TestingServices.setGrid(rptGridOptions, vm.resgridApi, testDate, testTime);

            vmTestRptmodal.animationsEnabled = true;

            vmTestRptmodal.modalInstance = undefined;
            vmTestRptmodal.retvlu = '';

            vmTestRptmodal.modalInstance = vmTestRptmodal.$uibModal.open({
                animation: vmTestRptmodal.animationsEnabled,
//                templateUrl: 'templates/testmgmt/promotion.html',
//                controller: 'ModalPromotionInstanceController as vm',
                component: 'promotionComponent',
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    classname: function() {
                        vmTestRptmodal.$log.debug('return from open');
                        return vmTestRptmodal.retvlu;
                    }
                }
            });
            vmTestRptmodal.modalInstance.result.then(function(retvlu) {
                vmTestRptmodal.$log.debug('search modalInstance result :', retvlu);
                vmTestRptmodal.retvlu = retvlu;
            }, function() {
                vmTestRptmodal.$log.info('Modal dismissed at: ' + new Date());
            });

            //restore
            //          vm.resgridOptions = saveResgridOptions;

        }).catch(function(e) {
            vm.$log.debug("promotetestcandidate error in modal", e);
        });



    }

    setSelectedArray(inputArray) {
        var vm = this;
        vm.$log.debug("setSelectedArray entered", inputArray);
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

        vm.$log.debug("setarray", vm.selectedStudents);

    }

    setresSelectedArray(inputArray) {
        var vm = this;
        vm.$log.debug("setresSelectedArray entered", inputArray);
        vm.selectedStudents = [];

        if (inputArray.length > 0) {
            vm.selected = true;
            for (var i = 0, len = inputArray.length; i < len; i++) {

                var info = {
                    ContactID: inputArray[i].contactID,
                    studentname: inputArray[i].FirstName + ' ' + inputArray[i].LastName,
                    FullName: inputArray[i].FullName,
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
                    crid: inputArray[i].crid,
                    cpid: inputArray[i].cpid

                };
                vm.selectedStudents.push(info);
            }
        }
        else {
            vm.selected = false;
            return;
        }

        vm.$log.debug("setarray", vm.selectedStudents);

    }

    getTemplateNames(templatepartial) {
        var vm = this;
        vm.$log.debug('getTemplateNames entered');
        var path = encodeURI('../v1/templatenames?templatepartial=' + templatepartial);

        vm.$log.debug('gettemplateNames path:', path);

        return vm.TemplateServices.gettemplateNames(path).then(function(data) {
                vm.$log.debug('gettemplateNames returned data');
                vm.$log.debug(data);
                vm.templatelist = data.templatelist;
                return;
            },
            function(error) {
                vm.$log.debug('Caught an error getTemplateNames:', error);
                vm.templatelist = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    gettemplateDetails(templateSelected) {
        var vm = this;
        //called by gettestdates
        vm.$log.debug('gettemplateDetails entered:', templateSelected.templatename);
        var path = encodeURI('../v1/templatedetails?templatename=' + templateSelected.templatename);
        var messagetxt;
        //view templatesource
        vm.$log.debug('gettemplateDetails path:', path);

        return vm.TemplateServices.gettemplateDetails(path).then(function(data) {
                vm.$log.debug('gettemplateDetails returned data');
                vm.$log.debug(data);
                if (typeof(data.templatedetails) !== 'undefined' && data.templatedetails.length > 0) {
                    vm.templatedetails = data.templatedetails[0];
                    vm.$log.debug("details", data.templatedetails[0]);

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
                    vm.Notification.success({ message: messagetxt, delay: 5000 });

                }
                else {
                    messagetxt = "No templates found";
                    vm.Notification.warning({ message: messagetxt, delay: 5000 });
                }
                return;
            },
            function(error) {
                vm.$log.debug('Caught an error gettemplateDetails:', error);
                vm.templatedetails = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }

    getStyles() {
        var vm = this;
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

    substitute(content, students, pagebreak, certdata) {
        var vm = this;
        var tmp, obj;
        var contentdtl = [];
        if (typeof(students) !== 'undefined' && students.length > 0) {
            for (var i = 0; i < students.length; i++) {
                vm.$log.debug('process student:', students[i]);
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
                vm.$log.debug("types", content.length, typeof(pagebreak));
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
                    vm.$log.debug(e instanceof SyntaxError); // true
                    vm.$log.debug(e.message); // "missing ; before statement"
                    vm.$log.debug(e.name); // "SyntaxError"
                    vm.$log.debug(e.fileName); // "Scratchpad/1"
                    vm.$log.debug(e.lineNumber); // 1
                    vm.$log.debug(e.columnNumber); // 4
                    vm.$log.debug(e.stack); // "@Scratchpad/1:2:3\n"
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

    genPDF(templatename) {
        var vm = this;
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
            title1: vm._.findWhere(vm.instructorlist, { name: vm.testdatelist.tester1 }).instructortitle,
            title2: vm._.findWhere(vm.instructorlist, { name: vm.testdatelist.tester2 }).instructortitle,
            title3: vm._.findWhere(vm.instructorlist, { name: vm.testdatelist.tester3 }).instructortitle,
            title4: vm._.findWhere(vm.instructorlist, { name: vm.testdatelist.tester4 }).instructortitle
        };

        vm.$log.debug('after parsehmtl', mycontent, students, typeof(students), students.length);
        var contentdtl = [];
        var tmp;
        var obj;
        var pagebreak;
        contentdtl = vm.substitute(mycontent, students, pagebreak, certdata);
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
            vm.$log.debug(e instanceof SyntaxError); // true
            vm.$log.debug(e.message); // "missing ; before statement"
            vm.$log.debug(e.name); // "SyntaxError"
            vm.$log.debug(e.fileName); // "Scratchpad/1"
            vm.$log.debug(e.lineNumber); // 1
            vm.$log.debug(e.columnNumber); // 4
            vm.$log.debug(e.stack); // "@Scratchpad/1:2:3\n"
        }

        var background;
        if (typeof(vm.backgroundimages[0]) !== undefined && vm.backgroundimages[0] !== "") {
            vm.calcsizes();
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
            header: mycontentheader,
            content: contentdtl,
            footer: mycontentfooter,
            styles: vm.getStyles()
        };
        docDefinition.background = background;

        var myJsonString = JSON.stringify(docDefinition);
        vm.$log.debug('doc json', myJsonString);


        pdfMake.createPdf(docDefinition).open();
    }

}
