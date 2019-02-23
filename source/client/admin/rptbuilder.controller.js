//import angular from 'angular';
const { Image: Image } = window;
const { pdfMake: pdfMake } = window;

export class RptBuilderController {
    constructor(
        $log, $routeParams, TestingServices, CalendarServices, $location, $window, $q,
        $scope, $route, Notification, uiGridConstants, uiGridGroupingConstants, $timeout, moment, UserServices,
        TemplateServices, AttendanceServices, textAngularManager, $uibModal, _, portalDataService, Util

    ) {
        'ngInject';
        this.$log = $log;
        this.$routeParams = $routeParams;

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
        this.moment = moment;
        this.UserServices = UserServices;
        this.TemplateServices = TemplateServices;
        this.AttendanceServices = AttendanceServices;
        this.textAngularManager = textAngularManager;
        this.$uibModal = $uibModal;
        this._ = _;
        this.portalDataService = portalDataService;
        this.Util = Util;
    }
    $onInit() {

        var vm = this;

        vm.limit = 0;
        vm.limits = [10, 20, 50, 100, 200, 500, 5000];
        vm.data = [];
        vm.state = {};
        vm.thiscoldef = '';
        vm.colkey = 'testcandidate';
        vm.colsubkey = '';
        vm.colsubkeys = [];
        vm.coldeflist = [];
        vm.testcandidatetmp = {};
        vm.gcolumns = [];
        vm.loading = true;
        vm.loadAttempted = false;
        vm.gridOptions = {};
        vm.resgridApi = {};
        vm.gridApi = {};
        vm.resgridOptions = {};
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
        vm.mycontentheader = {};
        vm.mycontent = {};
        vm.mycontentfooter = {};
        vm.checklistcoldef = {};
        vm.promopostcard = {};
        vm.beltlabelcoldef = {};
        vm.tcsrccoldef = {};
        vm.tclistcoldef = {};
        vm.tempres = {};

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
            <p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p>' +
                vm.textAngularManager.getVersion().substring(1) +
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

        vm.restricted = true;
        vm.testdatelist=[];
        vm.ranktypelist =[];
        vm.ranktypeselected = '';
        vm.styleleft = "400px";
        vm.styleright = "400px";
        vm.gridright = 10; //5
        vm.gridleft = 10; //5
        vm.gridleftcnt = 0;
        vm.gridrightcnt = 0;

        vm.activate();
    }

    $onDestroy() {
        this.$log.log("rptbuilder controller dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;

        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('RptBuilderController',vm.UserServices.isDebugEnabled());
        }
        
        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("rptbuilder-controller started");

        });

        vm.getTestDates();
        vm.getRankTypes();
        vm.initGridOptions();
        vm.getUserDetails();
//        vm.getTemplateNames('').then(function() {
//            vm.$log.log('activate eventdetails fetched');
//        });

        vm.$q.all([
                vm.getGeneralColDefs('test', 'Testcandidatesource').then(function() {
                    vm.$log.log('getGeneralColDefs ready');
                    vm.setGridOptions();

                }).catch(function(e) {
                    vm.$log.log("getPayerList error in activate", e);
                }),
                vm.getTemplateNames('').then(function() {
                    vm.$log.log('activate getTemplateNames fetched');
                }).catch(function(e) {
                    vm.$log.log("rptbuilder error in activate", e);
                }),
                vm.getInstructorList().then(function() {
                    vm.$log.log('getInstructorList ready');

                }).catch(function(e) {
                    vm.$log.log("rptbuilder error in activate", e);
                })
            ])
            .then(function() {
                vm.$log.log('rptbuilder activation done');
                vm.refresHtml();
            });

    }
    changeRankType(){
        var vm=this;
        vm.$log.log("changeRankType", vm.ranktypeselected);
        vm.refreshList();
    }
    
    refreshList() {
        var vm = this;

        vm.gettestcandidateDetails(vm.testdatelist.testtype).then(function(zdata) {
                vm.$log.log('gettestcandidateDetails returned', zdata);
            },
            function(error) {
                vm.$log.log('Caught an error gettestcandidateDetails after update:', error);
                vm.data = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            });
    }
    
    getRankTypes() {
        var vm = this;
        vm.$log.log('getRankTypes entered');
        var path = encodeURI("../v1/ranktypes");
        var error;

        return vm.TestingServices.getRankTypes(path).then(function(data) {
                vm.$log.log('getRankTypes returned data');
                vm.$log.log(data);
                if (data.ranktypelist.length > 0) {
                    vm.ranktypelist = data.ranktypelist;
                    vm.ranktypeselected = vm.ranktypelist[0].ranktype;
                }
                else {
                    error = "No ranktpes found" ;
                    vm.message = error;
                    vm.Notification.error({ message: error, delay: 5000 });
                    vm.ranktypelist = [];
                    return (vm.$q.reject(error));

                }
                return vm.ranktypelist;
            },
            function(error) {
                vm.$log.log('Caught an error ranktypelist, going to notify:', error);
                vm.ranktypelist = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            }).
        finally(function() {
            vm.loading = false;
            vm.loadAttempted = true;
        });

    }
    getUserDetails() {
        var vm = this;
        vm.$log.log('getUserDetails entered');
        return vm.UserServices.getUserDetails().then(function(data) {
                vm.$log.log("testcandidate getuserdetails returned:", data);
                vm.userdta = data;
                return vm.userdta;
            },

            function(error) {
                vm.$log.log('Caught an error getUserDetails, going to notify:', error);
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

    testdateshow() {
        var vm = this;
        var show = false;
        if (vm.testdatelist !== undefined) {
            show = typeof(vm.testdatelist) === 'object' ? true : false;
        }
        //         vm.$log.log('testdateshow', typeof(vm.testdatelist), vm.testdatelist, show);
        return show;
    }

    getTestDates(testname) {
        var vm = this;
        if (typeof testname === 'undefined') {
            return {};
        }
        vm.$log.log('getTestDates entered', testname);
        var refreshpath = encodeURI("../v1/testdates?testname=" + testname.name);
        var error;
        vm.testname = testname.name;
        vm.testtype = testname.eventtype;

        return vm.TestingServices.getTestDates(refreshpath).then(function(data) {
                vm.$log.log('getTestDates returned data');
                vm.$log.log(data);
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
                    vm.gettestcandidateDetails(vm.testdatelist.testtype).then(function(zdata) {
                            vm.$log.log('gettestcandidateDetails returned', zdata);
                        },
                        function(error) {
                            vm.$log.log('Caught an error gettestcandidateDetails after update:', error);
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
                vm.$log.log('Caught an error getTestDates, going to notify:', error);
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

    getGeneralColDefs(colkey, colsubkey) {
        var vm = this;
        vm.$log.log('getGeneralColDefs entered', colkey, colsubkey);
        var path = encodeURI("../v1/gencoldefs?colkey=" + colkey + "&colsubkey=" + colsubkey);

        return vm.TestingServices.getGeneralColDefs(path).then(function(data) {
                vm.$log.log("getGeneralColDefs returned:", data);
                var retdata = JSON.parse(data.gcolumns[0][0]);

                if (colsubkey === 'Testcandidatesource') {
                    vm.tcsrccoldef = retdata;
                }

                return retdata;
            },

            function(error) {
                vm.$log.log('Caught an error getGeneralColDefs, going to notify:', error);
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

    setSelectedArray(inputArray) {
        var vm = this;
        vm.$log.log("setSelectedArray entered", inputArray);
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

        vm.$log.log("setarray", vm.selectedStudents);

    }

    gettestcandidateDetails(thetesttype) {
        var vm = this;

        //called by gettestdates
        vm.$log.log('gettestcandidateDetails entered:', thetesttype);
        var path = encodeURI('../v1/testcandidatedetails?testtype=' + thetesttype + '&ranktype=' + vm.ranktypeselected);
        if (vm.restricted !== undefined) {
            path = path + '&supplement=' + vm.restricted;
        }
        var messagetxt;
        //view testcandidatesource
        vm.$log.log('gettestcandidateDetails path:', path);

        return vm.TestingServices.gettestcandidateDetails(path).then(function(data) {
                vm.$log.log('gettestcandidateDetails returned data');
                vm.$log.log(data);
                if (typeof(data.testcandidatedetails) !== 'undefined' && data.testcandidatedetails.length > 0) {
                    vm.gridOptions.data = data.testcandidatedetails;

                    vm.$log.log("details", data.testcandidatedetails[0]);

                    vm.ContactID = data.testcandidatedetails[0].contactID;

                    //check for empty set and do message
                    messagetxt = "testcandidateDetails obtained";
                    vm.Notification.success({ message: messagetxt, delay: 5000 });
                }
                else {
                    messagetxt = "No test candidates found";
                    vm.Notification.warning({ message: messagetxt, delay: 5000 });
                }
                return data.testcandidatedetails;
            },
            function(error) {
                vm.$log.log('Caught an error gettestcandidateDetails:', error);
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

    gettestcandidateNames(testcandidatepartial) {
        var vm = this;
        vm.$log.log('gettestcandidateNames entered');
        var path = encodeURI('../v1/testcandidatenames?testcandidatepartial=' + testcandidatepartial);

        vm.$log.log('gettestcandidateNames path:', path);

        return vm.TestingServices.gettestcandidateNames(path).then(function(data) {
                vm.$log.log('gettestcandidateNames returned data');
                vm.$log.log(data);
                vm.testcandidatenames = data.testcandidatenames;
                //check for empty set and do message
                //messagetxt = "testcandidateDetails obtained";
                //Notification.success({message: messagetxt, delay: 5000});
                return;
            },
            function(error) {
                vm.$log.log('Caught an error gettestcandidateDetails:', error);
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

            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged(vm.$scope, function(row) {
                    var msg = 'grid row selected ' + row.entity;
                    vm.$log.log(msg);

                    var selectedStudentarr = this.grid.api.selection.getSelectedRows();
                    vm.gridleftcnt = selectedStudentarr.length;
                    vm.$log.log('selected', selectedStudentarr);
                    vm.setSelectedArray(selectedStudentarr);

                });
                gridApi.selection.on.rowSelectionChangedBatch(vm.$scope, function(rows) {
                    vm.$log.log("grid batch");
                    var selectedStudentarr = this.grid.api.selection.getSelectedRows();
                    vm.gridleftcnt = selectedStudentarr.length;
                    vm.$log.log('batch selected', selectedStudentarr);
                    vm.setSelectedArray(selectedStudentarr);

                });
            }

        };


        vm.$log.log('setGridOptions gridOptions', vm.gridOptions);

    }

    setGridOptions() {
        var vm = this;


        vm.gridOptions = {
            columnDefs: vm.tcsrccoldef.columns

        };


        vm.$log.log('setGridOptions gridOptions', vm.gridOptions);

    }

    getInstructorList() {
        var vm = this;
        vm.$log.log('getInstructorList entered');
        var refreshpath = "../v1/instructorlist";
        var witnessdefault = {
            firstname: 'Witness',
            lastname: '',
            instructortitle: '',
            name: 'Witness'
        };
        return vm.CalendarServices.getinstructorlist(refreshpath).then(function(data) {
                vm.$log.log(' calservices getinstructorlist returned data');
                vm.$log.log(data);
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
                vm.$log.log('Caught an error getinstructorlist, going to notify:', error);
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


    refresHtml() {
        var vm = this;
        vm.$log.log('refresHtml called');
        vm.htmlcontentdata.htmlcontentall = '';
        vm.htmlcontentdata.htmlcontentall += (typeof(vm.htmlcontentdata.htmlcontentheader) !== "undefined") ? vm.htmlcontentdata.htmlcontentheader : '';
        vm.htmlcontentdata.htmlcontentall += (typeof(vm.htmlcontentdata.htmlcontent) !== "undefined") ? vm.htmlcontentdata.htmlcontent : '';
        vm.htmlcontentdata.htmlcontentall += (typeof(vm.htmlcontentdata.htmlcontentfooter) !== "undefined") ? vm.htmlcontentdata.htmlcontentfooter : '';

    }
    htmlcontentsubmit() {
        var vm = this;
        vm.$log.log('Submit triggered');
    }
    htmlcontentclear() {
        var vm = this;
        vm.$log.log('clear');
        vm.htmlcontentdata = {
            orightml: ' <h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>'
        };
        vm.refresHtml();

    }
    setHeaderLogo() {
        var vm = this;
        vm.htmlcontentheader = {
            orightml: ' <table class="noborders"><colgroup><col width="33.3%"><col width="33.3%"><col width="33.3%"></colgroup><tbody> <tr><td >Left</td><td>Center</td><td>Right</td></tr> <tr><td>Left</td><td> <img src="' +
                vm.headerimages[0] +
                '"/></td><td>Right</td></tr></tbody></table>'
        };
        vm.htmlcontentdata.htmlcontentheader = vm.htmlcontentheader.orightml;
        vm.$log.log("setheaderlogo entered", vm.htmlcontentheader.orightml);
        vm.refresHtml();
    }
    setFooterLogo() {
        var vm = this;
        vm.htmlcontentfooter = {
            orightml: ' <table class="noborders"><colgroup><col width="33.3%"><col width="33.3%"><col width="33.3%"></colgroup><tbody> <tr><td >Left</td><td>Center</td><td>Right</td></tr> <tr><td>Left</td><td> <img src="' +
                vm.footerimages[0] +
                '"/></td><td>Right</td></tr></tbody></table>'
        };
        vm.htmlcontentdata.htmlcontentfooter = vm.htmlcontentfooter.orightml;
        vm.$log.log("setfooterlogo entered", vm.htmlcontentfooter.orightml);
        vm.refresHtml();
    }
    setBodyImage() {
        var vm = this;
        vm.htmlcontentbody = {
            orightml: ' <img src="' + vm.bodyimages[0] + '"/>'
        };
        //todo figure out how to loop and insert content to existing pointer location
        vm.htmlcontentdata.htmlcontentbody = vm.htmlcontentbody.orightml;
        vm.$log.log("setBodyImage entered", vm.htmlcontentbody.orightml);
        vm.refresHtml();
    }
    setBackgroundImage() {
        var vm = this;
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
        vm.$log.log("setBackgroundImage entered", vm.htmlbackground);
        vm.refresHtml();
    }

    htmlcontentreset() {
        var vm = this;
        vm.$log.log('reset');

        vm.htmlcontentdata.htmlcontent = vm.htmlcontentdata.orightml;
    }
    htmlcontenttestPaste($html) {
        var vm = this;
        vm.$log.log('Hit Paste', arguments);
        return '<p>Jackpot</p>';
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


    getBase64Image(img) {
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
    getCertificateText(certdata, students) {
        //get from db
        //Studio
        //Reiki
        var textout = [];
        if (students.rankType == "YMCA") {
            textout = [
                { text: 'YMCA Program', style: ['ymcaheader'] },
                { text: 'This is to certify that\n', style: ['smalllines', 'spread'] },
                { text: students.studentname + '\n', style: ['mediumlines', 'ymcabotfiller'] },
                { text: 'Has successfully completed an eight week Martial Arts Program in the\nart of Shaolin Kempo Karate and Jiu-Jitsu.\n\n', style: ['smalllines', 'spread'] },
                { text: 'Dated this ' + certdata.certDate + ' at the MetroWest YMCA\n', style: ['smalllines', 'spread'] }
            ];
        }
        if (students.rankType == "AdultKarate" || students.rankType == "ChildrenKarate" || students.rankType == "BlackBelt") {
            textout = [
                { text: '', style: ['topfiller'] },
                { text: 'This is to certify that\n', style: ['smalllines', 'spread'] },
                { text: students.studentname + '\n', style: ['mediumlines', 'botfiller'] },
                { text: 'Has successfully demonstrated the required level of ability and\nknowledge in the art of Shaolin Kempo Karate and Jiu-Jitsu and\n' + certdata.program + '\n', style: ['smalllines', 'spread'] },
                { text: students.nextRank + '\n', style: ['biglines', 'bigtop'] },
                { text: 'Dated this ' + certdata.certDate + ' at ' + certdata.school + '\n', style: ['smalllines', 'spread'] }
            ];
        }
        return textout;
    }
    getCertificateSignatures(certdata, students) {
        var textout = [];
        textout = [
            { width: 70, text: '' },
            {
                stack: [
                    { text: '', marginTop: 57 },
                    { text: certdata.instructor1 + '\n', marginLeft: 40 - certdata.instructor1.length * 1.5 / 2, style: 'signature' },
                    { text: certdata.title1.length > 0 ? certdata.title1 : " ", marginLeft: 40 - certdata.title1.length * 1.5 / 2, style: 'signature' },
                    { text: '', marginTop: 38 },
                    { text: certdata.instructor2 + '\n', marginLeft: 40 - certdata.instructor2.length * 1.5 / 2, style: 'signature' },
                    { text: certdata.title2.length > 0 ? certdata.title2 : " ", marginLeft: 40 - certdata.title2.length * 1.5 / 2, style: 'signature' },
                ]
            },
            { width: 190, text: '' },
            {
                stack: [
                    { text: '', marginTop: 57 },
                    { text: certdata.instructor3 + '\n', marginLeft: 50 - certdata.instructor3.length * 1.5 / 2 + certdata.instructor1.length * 1.5 / 2, style: 'signature' },
                    { text: certdata.title3.length > 0 ? certdata.title3 : " ", marginLeft: 50 - certdata.title3.length * 1.5 / 2 + certdata.title1.length * 1.5 / 2, style: 'signature' },
                    { text: '', marginTop: 38 },
                    { text: certdata.instructor4 + '\n', marginLeft: 50 - certdata.instructor4.length * 1.5 / 2 + certdata.instructor2.length * 1.5 / 2, style: 'signature' },
                    { text: certdata.title4.length > 0 ? certdata.title4 : " ", marginLeft: 50 - certdata.title4.length * 1.5 / 2 + certdata.title2.length * 1.5 / 2, style: 'signature' },
                ]
            }
        ];

        return textout;
    }
    getContent(students, certdata) {
        var vm = this;
        vm.$log.log('getContent entered', students, certdata);
        var contentdtl = [];
        var pagebreak;
        var certtext = [];
        var columns = [];

        for (var i = 0; i < students.length; i++) {
            certtext = vm.getCertificateText(certdata, students[i]);
            columns = vm.getCertificateSignatures(certdata, students[i]);
            if (i < students.length - 1) {
                pagebreak = { pageBreak: 'before', text: '' };
            }
            else {
                pagebreak = {};
            }
            contentdtl.push([certtext, "{", columns, "}", pagebreak]);
        }
        return contentdtl;
    }
    createCertificate() {
        var vm = this;

        var rptwidth = 792;
        var rptheight = 600;
        var sigwidth = 150;

        var testImageDataUrl = 'data:image/png;base64,' + vm.getBase64Image("images/logos/StudioDiplomaTemplate.png");
        //var testImageDataUrl ='data:image/png;base64,'+ this.getBase64Image("images/reports/dragon.jpg");
        //var logoImageDataUrl ='data:image/png;base64,'+ this.getBase64Image("images/logos/vlogo.gif");
        var program = "and is therefore awarded the rank of";

        vm.$log.log('testers', vm.testdatelist);
        vm.$log.log('titles', vm.instructorlist);
        vm.$log.log('title1', vm._.findWhere(vm.instructorlist, { name: vm.testdatelist.tester1 }));
        vm.$log.log('school', vm.userdta);
        var students = vm.selectedStudents;
        var certdata = {
            certDate: vm.testdatelist.testdate,
            school: vm.userdta.school,
            program: program,
            instructor1: vm.testdatelist.tester1,
            instructor2: vm.testdatelist.tester2,
            instructor3: vm.testdatelist.tester3,
            instructor4: vm.testdatelist.tester4,
            title1: vm._.findWhere(vm.instructorlist, { name: vm.testdatelist.tester1 }).instructortitle,
            title2: vm._.findWhere(vm.instructorlist, { name: vm.testdatelist.tester2 }).instructortitle,
            title3: vm._.findWhere(vm.instructorlist, { name: vm.testdatelist.tester3 }).instructortitle,
            title4: vm._.findWhere(vm.instructorlist, { name: vm.testdatelist.tester4 }).instructortitle
        };

        var thecontent = vm.getContent(students, certdata);
        vm.$log.log('thecontent', thecontent, 'json', JSON.stringify(thecontent));


        var docDefinition = {
            pageOrientation: 'landscape',
            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
            pageMargins: [40, 60, 40, 0],
            pageSize: 'LETTER',
            background: [{
                image: testImageDataUrl,
                width: rptwidth,
                height: rptheight
            }],
            content: thecontent,
            styles: {
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
                    margin: [270, 45, 0, 20],
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
        vm.$log.log('doc json', myJsonString);

       // var now = new Date();
        //var pdfDoc = printer.createPdfKitDocument(docDefinition);
        //pdfDoc.pipe(fs.createWriteStream('pdfs/images.pdf'));
        //pdfDoc.end();

        // pdfMake.createPdf(docDefinition).download('Report.pdf');
        pdfMake.createPdf(docDefinition).open();
    }

    getTemplateNames(templatepartial) {
        var vm = this;
        vm.$log.log('getTemplateNames entered');
        var path = encodeURI('../v1/templatenames?templatepartial=' + templatepartial);

        vm.$log.log('gettemplateNames path:', path);

        return vm.TemplateServices.gettemplateNames(path).then(function(data) {
                vm.$log.log('gettemplateNames returned data');
                vm.$log.log(data);
                vm.templatelist = data.templatelist;
                return;
            },
            function(error) {
                vm.$log.log('Caught an error getTemplateNames:', error);
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
        vm.$log.log('gettemplateDetails entered:', templateSelected.templatename);
        var path = encodeURI('../v1/templatedetails?templatename=' + templateSelected.templatename);
        var messagetxt;
        //view templatesource
        vm.$log.log('gettemplateDetails path:', path);

        return vm.TemplateServices.gettemplateDetails(path).then(function(data) {
                vm.$log.log('gettemplateDetails returned data');
                vm.$log.log(data);
                if (typeof(data.templatedetails) !== 'undefined' && data.templatedetails.length > 0) {
                    vm.templatedetails = data.templatedetails[0];
                    vm.$log.log("details", data.templatedetails[0]);

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
                vm.$log.log('Caught an error gettemplateDetails:', error);
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

    removetemplate(templatename) {
        var vm = this;

        var path = "../v1/template";

        var thedata = {
            templatename: templatename
        };
        vm.$log.log('about removetemplate ', path, thedata, vm.templatename);
        return vm.TemplateServices.removetemplate(path, thedata)
            .then(function(data) {
                vm.$log.log('removetemplate returned data');
                vm.$log.log(data, data.error);
                if (data.error === true) {
                    vm.$log.log('removetemplate error returned', data.error);
                    return (vm.$q.reject(data));
                }

                vm.templatedetails = data;
                vm.$log.log(vm.templatedetails);
                vm.$log.log(vm.templatedetails.message);
                vm.message = vm.templatedetails.message;
                vm.Notification.success({ message: vm.message, delay: 5000 });
                vm.getTemplateNames('').then(function(zdata) {
                        vm.$log.log('activate gettemplateNames fetched', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error gettemplateDetails after update:', error);
                        vm.data = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });

                return;
            }).catch(function(e) {
                vm.$log.log('removetemplate failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    updatetemplate(templatename) {
        var vm = this;
        var saveSelectedStudents = vm.selectedStudents;
        vm.selectedStudents = [];
//        vm.pdfForElement('convertthis');
        vm.selectedStudents = saveSelectedStudents;

        var path = "../v1/templateupdate"; // put wasn't working?
        var thedata = vm.setPDFdata(templatename);
        vm.$log.log('about updatetemplate ', thedata, path);

        return vm.TemplateServices.updateTemplate(path, thedata)
            .then(function(data) {
                vm.$log.log('updatetemplate returned data');
                vm.$log.log(data, data.error);
                if (data.error === true) {
                    vm.$log.log('updateTemplate error returned', data.error);
                    return (vm.$q.reject(data));
                }
                vm.templatedetails = data;
                vm.$log.log(vm.templatedetails);
                vm.$log.log(vm.templatedetails.message);
                vm.message = vm.templatedetails.message;

            }).catch(function(e) {
                vm.$log.log('updatetemplate failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }
    setPDFdata(templatename) {
        var vm = this;
        var thedata = {
            htmlheader: vm.htmlcontentdata.htmlcontentheader === undefined ? '' : vm.htmlcontentdata.htmlcontentheader,
            htmlbody: vm.htmlcontentdata.htmlcontent === undefined ? '' : vm.htmlcontentdata.htmlcontent,
            htmlfooter: vm.htmlcontentdata.htmlcontentfooter === undefined ? '' : vm.htmlcontentdata.htmlcontentfooter,
            parsedheader: vm.mycontentheader === undefined ? '' : vm.mycontentheader,
            parsedbody: vm.mycontent === undefined ? '' : vm.mycontent,
            parsedfooter: vm.mycontentfooter === undefined ? '' : vm.mycontentfooter,
            headerimage: vm.headerimages === null ? '' : vm.headerimages[0],
            footerimage: vm.footerimages === null ? '' : vm.footerimages[0],
            backgroundimage: vm.backgroundimages === null ? '' : vm.backgroundimages[0],
            maxHeaderHeight: vm.maxHeaderHeight === undefined ? 0 : vm.maxHeaderHeight,
            maxFooterHeight: vm.maxFooterHeight === undefined ? 0 : vm.maxFooterHeight,
            pageMarginLeft: vm.pageMarginL === undefined ? 0 : vm.pageMarginL,
            pageMarginRight: vm.pageMarginR === undefined ? 0 : vm.pageMarginR,
            pageMarginTop: vm.pageMarginT === undefined ? 0 : vm.pageMarginT,
            pageMarginBottom: vm.pageMarginB === undefined ? 0 : vm.pageMarginB,
            pageSize: vm.pageSize === undefined ? 'LETTER' : vm.pageSize,
            pageOrientation: vm.pageOrientation === undefined ? 'portrait' : vm.pageOrientation,
            templateName: templatename,
            pagebreak: vm.pagebreak
        };
        return thedata;
    }
    createtemplate(templatename) {
        var vm = this;
        if (vm.selected === false) {
            var error = "no rows selected for template";
            vm.Notification.error({ message: error, delay: 5000 });
            return;
        }

        var saveSelectedStudents = vm.selectedStudents;
        vm.selectedStudents = [];
        vm.pdfForElement('convertthis');
        vm.selectedStudents = saveSelectedStudents;


        var path = "../v1/template";

        var thedata = vm.setPDFdata(templatename);

        vm.$log.log('about createtemplate ', path, thedata, vm.templateName);
        return vm.TemplateServices.createtemplate(path, thedata)
            .then(function(data) {
                vm.$log.log('createtemplate returned data');
                vm.$log.log(data);
                if (typeof(data) !== 'undefined') {
                    vm.templatedetails = data;
                    vm.$log.log(vm.templatedetails);
                    vm.$log.log(vm.templatedetails.message);
                    vm.message = vm.templatedetails.message;
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                else {
                    vm.Notification.success({ message: "Not created", delay: 5000 });
                }
                vm.getTemplateNames(templatename).then(function(zdata) {
                        vm.$log.log('activate gettemplateNames fetched', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error gettemplateNames after update:', error);
                        vm.data = [];
                        vm.message = error;
                    vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return vm.templatedetails;
            }).catch(function(e) {
                vm.$log.log('createtemplate failure:');
                vm.$log.log("error", e);
                vm.message = e;
            vm.Notification.error({ message: e, delay: 5000 });
                throw e;
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
                vm.$log.log('process student:', students[i]);
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
                vm.$log.log("types", content.length, typeof(pagebreak));
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
                tmp = tmp.replace(/{certDate}/g, vm.moment(certdata.certDate).format("MMM DD, YYYY"));
                tmp = tmp.replace(/{teststarttime}/g, vm.moment(certdata.teststarttime).format("hh:mm A"));
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
                    vm.$log.log(e instanceof SyntaxError); // true
                    vm.$log.log(e.message); // "missing ; before statement"
                    vm.$log.log(e.name); // "SyntaxError"
                    vm.$log.log(e.fileName); // "Scratchpad/1"
                    vm.$log.log(e.lineNumber); // 1
                    vm.$log.log(e.columnNumber); // 4
                    vm.$log.log(e.stack); // "@Scratchpad/1:2:3\n"
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
    doPDF() {
        var vm = this;
        //debug   var tb = textAngularManager.getToolbarScopes();
        vm.pdfForElement('convertthis').open();
        // pdfForElement('convertthis');
    }
    genPDF(templatename) {
        var vm = this;
        vm.calcsizes();        

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

        vm.$log.log('after parsehmtl', mycontent, students, typeof(students), students.length);
        var contentdtl = [];
        var tmp;
        var obj;
        var pagebreak;
        /*            
                    if (typeof(students) !== 'undefined' && students.length > 0 ) {
                        for (var i=0; i<students.length; i++) {       
                          vm.$log.log('process student:',students[i]);
                            if (i < students.length -1  ) {
                                if (vm.pagebreak == "student") {
                                    pagebreak = {pageBreak: 'before', text: ''}; 
                                } else {
                                    pagebreak = {};
                                }
                            } else {
                                pagebreak = {};
                            }
                          vm.$log.log("types", mycontent.length, typeof(pagebreak));
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
                            vm.$log.log(e instanceof SyntaxError); // true
                            vm.$log.log(e.message);                // "missing ; before statement"
                            vm.$log.log(e.name);                   // "SyntaxError"
                            vm.$log.log(e.fileName);               // "Scratchpad/1"
                            vm.$log.log(e.lineNumber);             // 1
                            vm.$log.log(e.columnNumber);           // 4
                            vm.$log.log(e.stack);                  // "@Scratchpad/1:2:3\n"
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
            vm.$log.log(e instanceof SyntaxError); // true
            vm.$log.log(e.message); // "missing ; before statement"
            vm.$log.log(e.name); // "SyntaxError"
            vm.$log.log(e.fileName); // "Scratchpad/1"
            vm.$log.log(e.lineNumber); // 1
            vm.$log.log(e.columnNumber); // 4
            vm.$log.log(e.stack); // "@Scratchpad/1:2:3\n"
        }

        var background;
        if (typeof(vm.backgroundimages[0]) !== undefined && vm.backgroundimages[0] !== "") {
            
            var rptwidth = vm.pagewidthpx;
            var rptheight = vm.pageheightpx;
            background = { image: vm.backgroundimages[0], width: rptwidth, height: rptheight };
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
        vm.$log.log('doc json', myJsonString);


        pdfMake.createPdf(docDefinition).open();
    }
    pdfForElement(id) {
        var vm = this;
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
        var zebra = { fillColor: function(i, node) { return (i % 2 === 0) ? "#CCCCCC" : null; } };
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
            }
            else if (rgbRegex.test(color)) {
                var decimalColors = rgbRegex.exec(color).slice(1);
                for (var i = 0; i < 3; i++) {
                    var decimalValue = parseInt(decimalColors[i], 10);
                    if (decimalValue > 255) {
                        decimalValue = 255;
                    }
                    var hexString = '0' + decimalValue.toString(16);
                    hexString = hexString.slice(-2);
                    decimalColors[i] = hexString;
                }
                return '#' + decimalColors.join('');
            }
            else if (nameRegex.test(color)) {
                return color;
            }
            else {
                console.error('Could not parse color "' + color + '"');
                return color;
            }
        }

        function ComputeStyle(o, styles) {
            vm.$log.log('computestyle in', styles, o);
            //                  if (o.stack !== undefined) {
            for (var i = 0; i < styles.length; i++) {
                var st = styles[i].trim().toLowerCase().split(":");
                if (st.length === 2) {
                    st[1] = st[1].trim();
                    vm.$log.log("has a style", st[0], st[1], o);
                    switch (st[0]) {
                        case "padding-left":
                            {
                                o.margin = [parseInt(st[1], 10), 0, 0, 0];
                                break;
                            }
                        case "padding-right":
                            {
                                o.margin = [0, 0, parseInt(st[1], 10), 0];
                                break;
                            }
                        case "font-size":
                            {
                                o.fontSize = parseInt(st[1], 10);
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
                            o.marginBottom = parseInt(st[1], 10);
                            break;
                        case "margin-top":
                            o.marginTop = parseInt(st[1], 10);
                            break;
                        case "margin-left":
                            o.marginLeft = parseInt(st[1], 10);
                            break;
                        case "margin-right":
                            o.marginRight = parseInt(st[1], 10);
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
                    vm.$log.log("has a class", st[0], o);
                    o.style = st[0];
                }
            }
            //                  }
            vm.$log.log('computestyle done', o);

        }

        function ParseElement(cnt, e, p, parseType, styles) {
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
                    var fs = 13; //default
                    switch (nodeSize) {
                        case "1":
                            { fs = 8; break; }
                        case "2":
                            { fs = 10; break; }
                        case "3":
                            { fs = 13; break; }
                        case "4":
                            { fs = 16; break; }
                        case "5":
                            { fs = 18; break; }
                        case "6":
                            { fs = 24; break; }
                        case "7":
                            { fs = 32; break; }
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
                        }
                        else {
                            styles.push(nodeClass);
                        }

                    });
                }
            }

            vm.$log.log("parseelement", e, e.nodename);
            switch (e.nodeName.toLowerCase()) {
                case "#text":
                    {
                        sl = e.textContent.replace(/\n/g, "");
                        vm.$log.log('in text', sl, 'len', sl.length);
                        if (sl.length > 0) {
                            var t = {
                                text: e.textContent.replace(/\n/g, "")
                            };
                            if (styles) ComputeStyle(t, styles);
                            if (Array.isArray(p.text)) {
                                p.text.push(t);
                            }
                            else {
                                vm.$log.log("skipping text", p);
                            }
                            vm.$log.log('in text', e.textContent, p);
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
                        p = ParseContainer(cnt, e, p, styles.concat(elementStyles[e.nodeName.toLowerCase()]), parseType);
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
                        p = ParseContainer(cnt, e, p, styles.concat(elementStyles[e.nodeName.toLowerCase()]), parseType);
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
                        p = ParseContainer(cnt, e, p, styles, parseType);
                        break;
                    }
                case "hr":
                    {
                        vm.$log.log("hr found", e.className);
                        var c;
                        var xlen;
                        if (pctlen) {
                            xlen = vm.pagewidthpx * pctlen / 100 - vm.pageMarginR - vm.pageMarginL;
                        }
                        else {
                            xlen = vm.pagewidthpx - vm.pageMarginR - vm.pageMarginL;
                        }
                        if (e.className === "dashed") {
                            c = {
                                "marginTop": 10,
                                "canvas": [{
                                    "type": 'line',
                                    "x1": 0 + vm.pageMarginL,
                                    "y1": 10,
                                    "x2": xlen,
                                    "y2": 10,
                                    "dash": { length: 5 },
                                    "lineWidth": 2
                                }]
                            };

                        }
                        else {
                            c = {
                                "marginTop": 10,
                                "canvas": [{
                                    "type": 'line',
                                    "x1": 0 + vm.pageMarinL,
                                    "y1": 10,
                                    "x2": xlen,
                                    "y2": 10,
                                    "lineWidth": 2
                                }]
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
                        var borderclasses = [];
                        var mlayouts = [];
                        if (border) {
                            if (parseInt(border) == 1) isBorder = true;
                        }
                        else {
                            borderclass = e.getAttribute("class");
                            if (borderclass.length > 0) {
                                borderclasses = borderclass.trim().toLowerCase().split(" ");
                                //                                borderclasses.forEach(function(borderclass) {
                                for (var i = 0, len = borderclasses.length; i < len; i++) {
                                    if (typeof(borderclassStyles[borderclasses[i]]) !== 'undefined') {

                                        borderclassStyles[borderclasses[i]].forEach(function(layout) {
                                            mlayouts.push(layout);
                                        });
                                    }
                                }
                                if (mlayouts.length > 0) {
                                    t.layout = mlayouts[0];
                                }
                                else { t.layout = 'noBorders'; }
                            }
                            else {
                                t.layout = 'noBorders';
                            }
                        }

                        //                p = ParseContainer(t.table.col, e, p, styles,parseType);

                        var colwcalc = e.getElementsByTagName("col");
                        if (colwcalc) {
                            for (var iter = 0; iter < colwcalc.length; iter++) {
                                var tmp = colwcalc[iter].width.replace(/\%/g, '') * (vm.pagewidthpx - vm.pageMarginL - vm.pageMarginR) / vm.pagewidthpx;
                                t.table.widths.push(tmp + '%');
                            }
                        }
                        //only need it for the widths, as the col is not supported in pdfmake
                        //              delete t.table.col;

                        p = ParseContainer(t.table.body, e, p, styles, parseType);

                        if (!colwcalc) {
                            var widths = e.getAttribute("widths");
                            if (!widths) {
                                if (t.table.body.length !== 0) {
                                    if (t.table.body[0].length !== 0)
                                        for (var k = 0; k < t.table.body[0].length; k++)
                                            t.table.widths.push("*");
                                }
                            }
                            else {
                                var w = widths.split(",");
                                for (var k = 0; k < w.length; k++)
                                    t.table.widths.push(w[k]);
                            }
                        }

                        //                  ComputeStyle(t.table, styles);
                        typeof(t.table.marginLeft) !== 'undefined' ? delete t.table.marginLeft : '';
                        typeof(t.table.marginRight) !== 'undefined' ? delete t.table.marginRight : '';
                        typeof(t.table.marginTop) !== 'undefined' ? delete t.table.marginTop : '';
                        typeof(t.table.marginBottom) !== 'undefined' ? delete t.table.marginBottom : '';
                        var margins = [];
                        var marg = [];
                        var mlen;
                        if (styles.length > 0) {
                            var st = create("stack");
                            st.stack.push(t);
                            for (var iter = 0; iter < styles.length; iter++) {
                                marg = styles[iter].split(":");
                                if (marg[0].includes("margin")) {
                                    if (typeof(marginConversion[marg[0]]) !== 'undefined') {
                                        mlen = parseInt(marg[1], 10);
                                        st[marginConversion[marg[0]]] = mlen;
                                    }
                                }
                            }
                            cnt.push(st);
                        }
                        else {
                            cnt.push(t);
                        }

                        break;
                    }
                case "tbody":
                    {
                        p = ParseContainer(cnt, e, p, styles, parseType);
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
                      */
                case "tr":
                    {
                        var row = [];
                        p = ParseContainer(row, e, p, styles, parseType);
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
                            st.rowSpan = parseInt(rspan, 10);
                        var cspan = e.getAttribute("colspan");
                        if (cspan)
                            st.colSpan = parseInt(cspan, 10);
                        //table style drifting down
                        //                    p = ParseContainer(st.stack, e, p, styles, parseType);
                        p = ParseContainer(st.stack, e, p, [], parseType);
                        cnt.push(st);
                        break;
                    }
                case "div":
                    {
                        vm.$log.log("div found");

                        //    p = create("text");
                        var st = create("stack");
                        //    st.stack.push(p);

                        var margins = [];
                        var marg = [];
                        var mlen;
                        if (styles.length > 0) {
                            for (var iter = 0; iter < styles.length; iter++) {
                                marg = styles[iter].split(":");
                                if (marg[0].includes("margin")) {
                                    if (typeof(marginConversion[marg[0]]) !== 'undefined') {
                                        mlen = parseInt(marg[1], 10);
                                        st[marginConversion[marg[0]]] = mlen;
                                    }
                                }
                                if (marg[0] === "width" && marg[1].includes("%")) {
                                    pctlen = parseInt(marg[1], 10);
                                }
                            }
                        }
                        p = ParseContainer(st.stack, e, p, [], parseType);
                        //                  st.stack.push(p);

                        cnt.push(st);
                        break;
                    }
                case "li":
                    {
                        vm.$log.log("li found");

                        p = CreateParagraph();
                        p.lineHeight = 1.25;
                        var st = {
                            stack: []
                        };
                        st.stack.push(p);
                        ComputeStyle(st.stack, styles);
                        st.stack.styles = styles;
                        p = ParseContainer(st.stack, e, p, styles, parseType);

                        cnt.push(st);
                        break;
                    }

                case "ol":
                case "ul":
                    {
                        vm.$log.log(e.nodeName, cnt, e, p);
                        var list = create(e.nodeName.toLowerCase());
                        ComputeStyle(list, styles);
                        p = ParseContainer(list[e.nodeName.toLowerCase()], e, p, styles, parseType);
                        list.margin = [20, 0, 0, 0];
                        cnt.push(list);
                        break;
                    }
                case "font":
                    {
                        vm.$log.log("font found");
                        p = CreateParagraph();
                        var st = {
                            stack: []
                        };
                        st.stack.push(p);
                        ComputeStyle(st, styles);
                        p = ParseContainer(st.stack, e, p, styles, parseType);
                        cnt.push(st);

                        break;
                    }
                case "p":
                    {
                        vm.$log.log("p found");
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
                        var imageSize = {};
                        var maxResolution = {};
                        if (parseType === "header") {
                            //                        width: 435,
                            //                        height: 830
                            maxResolution = {
                                width: vm.pagewidthpx * 0.333,
                                height: vm.maxHeaderHeight
                            };

                        }
                        else if (parseType === "footer") {
                            //                        width: 435,
                            //                        height: 830
                            maxResolution = {
                                width: vm.pagewidthpx * 0.333,
                                height: vm.maxFooterHeight
                            };

                        }
                        else {

                        }
                        vm.$log.log('img settings',
                            e.width,
                            e.height,
                            e.clientWidth,
                            e.clientHeight,
                            e.naturalWidth,
                            e.naturalHeight
                        );
                        if (e.getAttribute("style")) {
                            while ((match = regex.exec(e.getAttribute("style"))) !== null) {
                                imageSize[match[1]] = parseInt(match[2].trim(), 10);
                            }
                        }
                        else {
                            imageSize = {
                                //                            height: e.getAttribute("src").height,
                                //                            width: e.getAttribute("src").width
                                //                            width: "100"
                                width: e.width,
                                height: e.height
                            };
                        }

                        if (imageSize.width > maxResolution.width) {
                            var scaleByWidth = maxResolution.width / imageSize.width;
                            imageSize.width *= scaleByWidth;
                            imageSize.height *= scaleByWidth;
                        }
                        if (imageSize.height > maxResolution.height) {
                            var scaleByHeight = maxResolution.height / imageSize.height;
                            imageSize.width *= scaleByHeight;
                            imageSize.height *= scaleByHeight;
                        }
                        vm.$log.log('img settings if scaled', imageSize);

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
                        vm.$log.log("Parsing for node " + e.nodeName + " not found");
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
            if (vm.$window.$(htmlText).length > 0) {
                var html = vm.$window.$(htmlText.replace(/\t/g, "").replace(/\n/g, "").replace(rsb1, '').replace(rsb2, '').replace(rsb3, ''));
                var p = CreateParagraph();
                for (var i = 0; i < html.length; i++) {
                    ParseElement(cnt, html.get(i), p, parseType, []);
                }
                vm.$log.log('parsehmtl', p, cnt);
                return cnt;
            }
            else {
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

        var content = [];
        var headercontent = [];
        var footercontent = [];
        vm.calcsizes();

        parseType = "body";
        var mycontent = ParseHtml(content, vm.htmlcontentdata.htmlcontent, parseType);
        vm.mycontent = JSON.stringify(mycontent);
        parseType = "header";
        var mycontentheader = ParseHtml(headercontent, vm.htmlcontentdata.htmlcontentheader, parseType);
        vm.mycontentheader = JSON.stringify(mycontentheader);
        parseType = "footer";
        var mycontentfooter = ParseHtml(footercontent, vm.htmlcontentdata.htmlcontentfooter, parseType);
        vm.mycontentfooter = JSON.stringify(mycontentfooter);
        vm.$log.log('header', mycontentheader);
        vm.$log.log('footer', mycontentfooter);

        vm.$log.log('after parsehmtl', mycontent, students, typeof(students), students.length);
        var contentdtl = [];
        var tmp;
        var obj;
        var pagebreak;
        if (typeof(students) !== 'undefined' && students.length > 0) {
            for (var i = 0; i < students.length; i++) {
                vm.$log.log('process student:', students[i]);
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

                /*
                                    if (i < students.length -1  ) {
                                        pagebreak = {pageBreak: 'before', text: ''}; 
                                    } else {
                                        pagebreak = {};
                                    }
                  */
                vm.$log.log("types", mycontent.length, typeof(pagebreak));
                tmp = JSON.stringify(mycontent[0]);
                for (var j = 1; j < mycontent.length; j++) {
                    vm.$log.log("mycon j", JSON.stringify(mycontent[j]));
                    tmp = tmp + ',' + JSON.stringify(mycontent[j]);
                }
                tmp = tmp.replace(/{FirstName}/g, students[i].studentname);
                try {
                    obj = JSON.parse('[' + tmp + ']');
                }
                catch (e) {
                    vm.$log.log(e instanceof SyntaxError); // true
                    vm.$log.log(e.message); // "missing ; before statement"
                    vm.$log.log(e.name); // "SyntaxError"
                    vm.$log.log(e.fileName); // "Scratchpad/1"
                    vm.$log.log(e.lineNumber); // 1
                    vm.$log.log(e.columnNumber); // 4
                    vm.$log.log(e.stack); // "@Scratchpad/1:2:3\n"
                }
                contentdtl.push([
                    obj,
                    //                    {text:  students[i].studentname, style: ['mediumlines','botfiller']},
                    pagebreak
                ]);

            }

        }
        else {
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
                  vm.$log.log('header height, width',hheight,hwidth);
        */
        var background;
        
        if (vm.backgroundimages !== null) {
            if (typeof(vm.backgroundimages[0]) !== undefined && vm.backgroundimages[0] !== "") {
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


            }

        };
        docDefinition.background = background;

        var myJsonString = JSON.stringify(docDefinition);
        vm.$log.log('doc json', myJsonString);

        /*const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getDataUrl((dataUrl) => {
        	const targetElement = document.querySelector('#iframeContainer');
        	const iframe = document.createElement('iframe');
        	iframe.src = dataUrl;
        	targetElement.appendChild(iframe);
        });
        */
        return pdfMake.createPdf(docDefinition);

    }

    encodeImageFileAsURL(fileid, fileoutid) {
        var vm = this;

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
                // $log.log("Converted Base64 version is " + document.getElementById(fileoutid).innerHTML);
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    }


}
