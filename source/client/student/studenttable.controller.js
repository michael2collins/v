//import angular from 'angular';

export class StudentsTableBasicController {
    constructor(
        $scope, $log, StudentServices, Util, $routeParams, uiGridConstants,
        $window, Notification, $controller, $timeout, $q, TestingServices, UserServices
    ) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;
        this.StudentServices = StudentServices;
        this.Util = Util;
        this.$routeParams = $routeParams;
        this.uiGridConstants = uiGridConstants;
        this.$window = $window;
        this.Notification = Notification;
        this.$timeout = $timeout;
        this.$controller = $controller;
        this.$q = $q;
        this.TestingServices = TestingServices;
        this.UserServices = UserServices;
    }

    $onInit() {

        var vm = this;
        vm.disable = undefined;
        vm.Rank = '';
        vm.status = 'Active';
        vm.statuses = [];
        vm.contacttypes = [];
        vm.RankList = [];
        vm.StudentList = [];
        vm.thecontacttype = 'All';
        vm.doneActivate = false;
        vm.refreshstudentlist = [];
        vm.studentpick;
        vm.eventResult;
        vm.studentpickparent = {};

        vm.userprefpath = "../v1/userprefcols/allstudents";

        vm.gcolumns = [];
        vm.userprefcols = [];
        vm.listA = [];
        vm.listB = [];
        vm.gridOptions = {};
        vm.gridApi;
        var studentXS=30;
        var studentS=60;
        var studentM=150;
        var studentL=250;

        vm.userData = [
            { id: 1, colname: 'FirstName', default: 'true', minsize: studentM },
            { id: 2, colname: 'ID', default: 'true', minsize: studentS },
            { id: 3, colname: 'LastName', default: 'true', minsize: studentM },
            { id: 4, colname: 'Email', default: 'true', minsize: studentL },
            { id: 5, colname: 'Email2', default: 'false', minsize: studentL },
            { id: 6, colname: 'Parent', default: 'false', minsize: studentM },
            { id: 7, colname: 'Phone', default: 'true', minsize: studentM },
            { id: 8, colname: 'AltPhone', default: 'false', minsize: studentS },
            { id: 9, colname: 'Address', default: 'false', minsize: studentL },
            { id: 10, colname: 'City', default: 'false', minsize: studentM },
            { id: 11, colname: 'State', default: 'false', minsize: studentXS },
            { id: 12, colname: 'ZIP', default: 'false', minsize: studentS },
            { id: 13, colname: 'Notes', default: 'false', minsize: studentM },
            { id: 14, colname: 'Birthday', default: 'false', minsize: studentXS },
            { id: 15, colname: 'BeltSize', default: 'false', minsize: studentXS },
            { id: 16, colname: 'ContactType', default: 'false', minsize: studentM },
            { id: 17, colname: 'InstructorFlag', default: 'false', minsize: studentXS },
            { id: 18, colname: 'quickbooklink', default: 'false', minsize: studentS },
            { id: 19, colname: 'instructorTitle', default: 'false', minsize: studentM },
            { id: 20, colname: 'sex', default: 'false', minsize: studentXS },
            { id: 21, colname: 'medicalConcerns', default: 'false', minsize: studentM },
            { id: 22, colname: 'GuiSize', default: 'false', minsize: studentXS },
            { id: 23, colname: 'studentclassstatus', default: 'false', minsize: studentS },
            { id: 24, colname: 'ranktype', default: 'false', minsize: studentS }
        ];

        vm.gridLength = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.limits2 = ["All", "5", "10", "20", "50", "100", "200"];
        vm.limit = "All";
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);
        vm.ranktypeselected = '';
        vm.ranktypeparent = {};
        vm.isCollapsed=true;
        vm.setGridOptions();
        vm.activate();
    }

    $onDestroy() {
        this.$log.log("StudentsTableBasicController dismissed");
    }

    updateRankType(ranktypeparent, prop, value) {
        var vm = this;
        vm.ranktypeparent[prop] = value;
        vm.ranktypeselected = vm.ranktypeparent.ranktype;
        vm.getRankList();
        vm.setRank('All');
        vm.$log.log('setRank', vm.Rank);
        vm.requery();

    }
    isOkRT() {
        var vm = this;
        return (Object.keys(vm.ranktypeparent).length === 0 && vm.ranktypeparent.constructor === Object) ? false : true;
    }

    setContactType(thetype) {
        var vm = this;
        vm.$log.log('thetype', thetype);
        vm.thecontacttype = thetype;
    }
    setRank(therank) {
        var vm = this;
        vm.$log.log('setRank', therank);
        vm.Rank = therank;
    }
    setStatus(thestatus) {
        var vm = this;
        vm.status = thestatus;
    }
    getStatus() {
        var vm = this;
        return vm.status;
    }
    getRank() {
        var vm = this;
        vm.$log.log('getRank');
        return vm.Rank;
    }
    getContactType() {
        var vm = this;
        vm.$log.log('getContactType');
        return vm.thecontacttype;
    }
    getLimit() {
        var vm = this;
        vm.$log.log('getLimit');
        return vm.limit;
    }
    setLimit(thelimit) {
        var vm = this;
        vm.$log.log('setLimit', thelimit);
        vm.limit = thelimit;
    }
    activate() {
        var vm = this;
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('StudentsTableBasicController',vm.UserServices.isDebugEnabled());
        }

//        vm.portalDataService.Portlet('studenttable.controller.js');

        vm.$q.all([
                vm.getUserPrefCols().then(function() {
                    vm.$log.log('getUserPrefCols', vm.gcolumns);
                }),
                vm.getStudentLists().then(function() {
                    vm.$log.log('getStudentLists ContactTypeList', vm.StudentList.ContactTypeList);
                    vm.$log.log('getStudentLists ClassStatusList', vm.StudentList.ClassStatusList);
                    //   vm.setContactType(vm.StudentList.ContactTypeList[0].listvalue);
                    vm.setStatus(vm.StudentList.ClassStatusList[0].listvalue);
                    //vm.setLimit(vm.limits[1]);
                }),
                vm.getRankList().then(function() {
                    vm.$log.log('getRankList', vm.RankList);
                    vm.setRank('All');
                    vm.$log.log('setRank', vm.Rank);
                })
                /*                vm.getRankTypes().then(function() {
                                    vm.$log.log('getRankTypes', vm.ranktypelist);
                                })
                */
            ])
            .then(function() {
                vm.$log.log('getAllStudents activate returned');
                //                vm.doneActivate = true;
                //vm.requery();
            });
    }

    getRankList() {
        var vm = this;
        var path = '../v1/ranklist';
        var data = {
            ranktype: vm.ranktypeselected
        };

        return vm.StudentServices.getRankList(data, path).then(function(data) {
            vm.$log.log('getRankList returned data');
            vm.$log.log(data);
            vm.RankList = data;

            return vm.RankList;
        });
    }

    getStudentLists() {
        var vm = this;
        var path = '../v1/studentlists';
        return vm.StudentServices.getStudentLists(path).then(function(data) {
            vm.$log.log('getStudentLists returned data');
            vm.$log.log(data);
            vm.StudentList = data;

            return vm.StudentList;
        });
    }

    getContactTypes() {
        var vm = this;
        return vm.StudentServices.getContactTypeCounts().then(function(data) {
            vm.$log.log('controller getContactTypes returned data');
            vm.$log.log(data.contacttypes);
            vm.contacttypes = data.contacttypes;
            vm.$log.log('controller contacttypes service data', vm.contacttypes);
            return vm.contacttypes;
        });
    }

//    editStudentFromPick(studentpickparent, prop, value) {
   editStudentFromPick(event) {
        var vm = this;
  //      vm.studentpickparent[prop] = value;
//         vm.eventResult = vm.studentpickparent.studentpick;
      vm.studentpickparent = event.studentpickparent;
      vm.eventResult = vm.studentpickparent.studentpick;

    }

    toggleFiltering() {
        var vm = this;
        vm.$log.log('toggleFiltering');
        vm.gridOptions.enableFiltering = !vm.gridOptions.enableFiltering;
    }
    requery() {
        var vm = this;
        vm.$log.log('requery entered');
        vm.getAllStudents().then(function() {
            vm.$log.log('refreshed students');
        });
    }

    setGridLength(size) {
        var vm = this;
        vm.gridLength = {
            height: (size * vm.rowheight) + vm.headerheight + 'px'
        };
    }

    getGridLength() {
        var vm = this;
        return vm.gridLength;
    }

    getUserPrefCols() {
        var vm = this;
        vm.$log.log('getUserPrefCols entered');
        return vm.StudentServices.getUserPrefCols(vm.userprefpath).then(function(data) {
            vm.$log.log('getUserPrefCols returned data');
            vm.userprefcols = data.userprefcols;
            vm.$log.log(vm.userprefcols);
            var foundit;
            for (var j = 0, lenu = vm.userData.length; j < lenu; j++) {
                foundit = false;
                for (var i = 0, len = vm.userprefcols.length; i < len; i++) {
                    //$log.log('colprefs',vm.userprefcols[i].prefcolumn);
                    if (vm.userData[j].colname == vm.userprefcols[i].prefcolumn) {
                        vm.listA.push(vm.userData.slice(j, j + 1)[0]); //A is the list that we display
                        //      $log.log('listA:', vm.userData.slice(j,j+1)[0]);
                        foundit = true;
                        break; //skip as we found something
                    }
                }
                if (!foundit) {
                    //    $log.log('listB:', vm.userData.slice(j,j+1)[0]);
                    vm.listB.push(vm.userData.slice(j, j + 1)[0]); //B gets the not matches
                }

            }
            vm.$log.log('listA', vm.listA);
            vm.$log.log('listB', vm.listB);

            vm.gcolumns = [];

            vm.$log.log('setGridOptions col count', vm.listA.length);

            for (var i = 0, len = vm.listA.length; i < len; i++) {
                if (vm.listA[i].colname == 'ID') {
                    continue; //skip as we will add it at the end 
                }
                vm.gcolumns.push({ field: vm.listA[i].colname, enableFiltering: true, enableSorting: true, width: "*", headerCellClass: vm.Util.highlightFilteredHeader, minWidth: vm.listA[i].minsize, enableCellEdit: false });

            }

            var ctpl = '<div class="ui-grid-cell-contents"><span>';
            ctpl += '<a role="button" class="btn btn-blue" style="padding:  0px 14px;" ';
            ctpl += ' href="/#/form-layouts-editstudent/id/{{COL_FIELD}}" ><i class="fa fa-edit"></i>&nbsp; Edit</a></span>';
            ctpl += '<span> <a role="button" class="btn btn-red" style="padding:  0px 14px;" ';
            ctpl += 'ng-click="grid.appScope.$ctrl.removeStudent(row.entity)" >';
            ctpl += '<i class="fa fa-trash"></i>&nbsp; Delete</a></span></div>';

            vm.gcolumns.push({
                name: 'ID',
                displayName: 'Edit',
                enableFiltering: false,
                enableSorting: false,
                enableHiding: false,
                enableCellEdit: false,
                cellTemplate: ctpl,
                width: 200
            });


            vm.getAllStudents().then(function(zdata) {

                    vm.$log.log('getuserpref cols getallStudent returned', zdata);
                },
                function(error) {
                    vm.$log.log('Caught an error getallStudent getStudent :', error);
                    vm.gridOptions.data = [];
                    vm.message = error;
                    vm.Notification.error({ message: error, delay: 5000 });
                    return (vm.$q.reject(error));
                });

            return vm.userprefcols;
        });
    }

    removeStudent(input) {
        var vm = this;
        vm.$log.log('removeStudent entered', input);
        var path = '../v1/student';
        var thedata = {
            id: input.ID
        };
        var data = {};
        data.StudentExistsList = {};

        return vm.StudentServices.removeStudent(thedata, path)
            .then(function(data) {
                vm.$log.log('removeStudent returned data');
                vm.$log.log(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    vm.StudentFKExists = data.StudentExistsList;
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getAllStudents().then(function(zdata) {
                        vm.$log.log('getStudent returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getStudent after remove:', error);
                        vm.gridOptions.data = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.log('removeStudent failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    getAllStudents() {
        var vm = this;
        vm.$log.log('getAllStudents tb grid');
        vm.gridOptions.data = [];
        var path = '../v1/students';

        var refreshpath = encodeURI(path +
            '?contacttype=' + vm.getContactType() +
            '&thelimit=' + vm.getLimit() +
            '&status=' + vm.getStatus() +
            '&ranktype=' + vm.ranktypeselected +
            '&therank=' + vm.getRank());

        vm.$log.log('refreshtheAttendance path:', refreshpath);

        return vm.StudentServices.getAllStudents(refreshpath).then(function(data) {
            vm.setGridOptions();
            vm.gridOptions.data = data.students;

            //    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

            return vm.gridOptions.data;
        });
    }

    setGridOptions() {
        var vm = this;


        vm.gridOptions = {
            showGridFooter: true,
            //            enableFiltering: true,
            enableGridMenu: true,
                        paginationPageSizes: vm.limits,
            //paginationPageSizes: [5, 10, 100],
                        paginationPageSize: vm.initialLength,
            //paginationPageSize: 10,
                        rowHeight: vm.rowheight,
            enableCellEditOnFocus: true,
            columnDefs: vm.gcolumns,
            appScopeProvider: vm,
            enableColumnResizing: true,
            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.log('pagination changed');
                    vm.setGridLength(pageSize);
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });

            }
        };

        vm.$log.log('gcolumns', vm.gcolumns);
        vm.$log.log('gridOptions', vm.gridOptions);
    }

}
