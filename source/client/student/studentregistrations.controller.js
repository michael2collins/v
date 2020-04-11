//import angular from 'angular';

export class StudentRegistrationsController {
    constructor(
        $scope, $log, StudentServices, Util, $routeParams, uiGridConstants,
        $window, Notification, $controller, $timeout, $q, UserServices, ClassServices
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
        this.UserServices = UserServices;
        this.ClassServices = ClassServices;
    }

    $onInit() {

        var vm = this;

        vm.gcolumns = [];
        vm.gridOptions = {};
        vm.gridApi;

        var studentXS = 30;
        var studentS = 60;
        var studentM = 150;
        var studentL = 250;

        vm.listA = [
            { id: 1, colname: 'contactid', default: 'true', minsize: studentM },
            { id: 2, colname: 'FirstName', default: 'true', minsize: studentM },
            { id: 3, colname: 'LastName', default: 'true', minsize: studentM },
            { id: 4, colname: 'classpayid', default: 'true',dispname: 'ClassPay', minsize: studentS },
            { id: 5, colname: 'paymentid', default: 'true',dispname: 'PayPlan', minsize: studentS },
            { id: 6, colname: 'pcpid', default: 'true', dispname: 'Coverage', minsize: studentS },
            { id: 7, colname: 'registrationid', default: 'true', dispname: 'Reg', minsize: studentS },
            { id: 8, colname: 'studentClassStatus', default: 'false', minsize: studentM },
            { id: 9, colname: 'expiresOn', default: 'false', minsize: studentM },
            { id: 10, colname: 'pgmclass', default: 'true', minsize: studentM },
            { id: 11, colname: 'classtype', default: 'true', minsize: studentM },
            { id: 12, colname: 'classid', default: 'true', minsize: studentS },
            { id: 13, colname: 'pgmid', default: 'true', minsize: studentS },
            { id: 14, colname: 'pgmcat', default: 'false', minsize: studentM },
            { id: 15, colname: 'classcat', default: 'false', minsize: studentM },
            { id: 16, colname: 'agecat', default: 'false', minsize: studentM },
            { id: 17, colname: 'classclass', default: 'true', minsize: studentM },
            { id: 18, colname: 'sort', default: 'false', minsize: studentXS },
            { id: 19, colname: 'nextclass', default: 'false', minsize: studentM },
            { id: 20, colname: 'rankfornextclass', default: 'false', minsize: studentM },
            { id: 21, colname: 'agefornextclass', default: 'false', minsize: studentXS },
            { id: 22, colname: 'pictureurl', default: 'false', minsize: studentM },
            { id: 23, colname: 'registrationtype', default: 'true', minsize: studentM },
            { id: 24, colname: 'isTestfeewaived', default: 'false', minsize: studentXS },
            { id: 25, colname: 'primaryContact', default: 'false', minsize: studentXS },
            { id: 26, colname: 'payerName', default: 'true', minsize: studentM },
            { id: 27, colname: 'payerid', default: 'false', minsize: studentS },
            { id: 28, colname: 'PaymentAmount', default: 'true', minsize: studentS },

        ];

        vm.gridLength = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);
        vm.isCollapsed = true;
        vm.setColumns();
        vm.setGridOptions();
        vm.activate();
    }

    $onDestroy() {
        this.$log.log("StudentRegistrationsController dismissed");
        //this.$log.logEnabled(false);
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
    setColumns() {
        var vm = this;
        vm.gcolumns = [];

        vm.$log.log('setGridOptions col count', vm.listA.length);

        var ctpl = '<div class="ui-grid-cell-contents"><span>';
        ctpl += '<a role="button" class="btn btn-blue" style="padding:  0px 14px;" ';
        ctpl += ' href="/#/form-layouts-editstudent/id/{{COL_FIELD}}" ><i class="fa fa-edit"></i>&nbsp; Edit</a></span>';
        ctpl += '<span> <a role="button" class="btn btn-red" style="padding:  0px 14px;" ';
        ctpl += 'ng-click="grid.appScope.removeStudentReg(row.entity)" >';
        ctpl += '<i class="fa fa-trash"></i>&nbsp; Reg.</a></span>';
        ctpl += '<span> <a role="button" class="btn btn-red" style="padding:  0px 14px;" ';
        ctpl += 'ng-click="grid.appScope.removeStudentPplan(row.entity)" >';
        ctpl += '<i class="fa fa-trash"></i>&nbsp; PayPlan</a></span>';
        ctpl += '<span> <a role="button" class="btn btn-red" style="padding:  0px 14px;" ';
        ctpl += 'ng-click="grid.appScope.removeStudentCP(row.entity)" >';
        ctpl += '<i class="fa fa-trash"></i>&nbsp; ClassPay</a></span>';
        ctpl += '<span> <a role="button" class="btn btn-red" style="padding:  0px 14px;" ';
        ctpl += 'ng-click="grid.appScope.removeStudentPCP(row.entity)" >';
        ctpl += '<i class="fa fa-trash"></i>&nbsp; Coverage</a></span>';
        ctpl += '</div>';

        vm.gcolumns.push({
            name: 'contactid',
            displayName: 'Edit',
            enableFiltering: false,
            enableSorting: false,
            enableHiding: false,
            enableCellEdit: false,
            cellTemplate: ctpl,
            width: 500
        });

        for (var i = 0, len = vm.listA.length; i < len; i++) {
            if (vm.listA[i].colname == 'contactid') {
                continue; //skip as we will add it at the end 
            }
            vm.gcolumns.push({
                field: vm.listA[i].colname,
                enableFiltering: true,
                enableSorting: true,
                visible: vm.listA[i].default == 'true' ? true : false,
                displayName: vm.listA[i].dispname == undefined ? vm.listA[i].colname : vm.listA[i].dispname,
                width: "*",
                headerCellClass: vm.Util.highlightFilteredHeader,
                minWidth: vm.listA[i].minsize,
                enableCellEdit: false
            });

        }

    }
    activate() {
        var vm = this;
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined) {
            vm.$log = vm.$log.getInstance('StudentRegistrationsController', vm.UserServices.isDebugEnabled());
        }


        vm.getStudentRegistrations().then(function() {

        });
    }

    removeStudentCP(input) {
        var vm = this;
        vm.$log.log('removeStudentCP entered');
        var path = "../v1/studentclasspays";
        var thedata = {
            studentid: input.contactid,
            classpayid: input.classpayid
        };
        return vm.ClassServices.removeStudentClasspays(path, thedata)
            .then(function(data) {
                vm.$log.log('removeStudentClasspays returned data');
                vm.$log.log(data);
                vm.$log.log(data.message);
                vm.message = data.message;
                if ((typeof data.studentregistration === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return(vm.$q.reject(data));
                }

                vm.getStudentRegistrations();
                return data;
            }).catch(function(e) {
                vm.$log.log('removeStudentClasspays failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }
    removeStudentPCP(input) {
        //remove from paymentclasspay
        var vm = this;
        vm.$log.log('removePaymentPay entered', input);
        var path = "../v1/paymentpay";
        var thedata = {
            pcpid: input.pcpid
        };
        return vm.ClassServices.removePaymentPay(path, thedata)
            .then(function(data) {
                vm.$log.log('removePaymentPay returned data');
                vm.$log.log(data);
                vm.$log.log(data.message);
                vm.message = data.message;
                if ((typeof data.paymentplan === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return(vm.$q.reject(data));
                }
                vm.getStudentRegistrations();
                return data;
            }).catch(function(e) {
                vm.$log.log('removePaymentPay failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }
    removeStudentPplan(input) {
        //remove from npayments
        var vm = this;
        vm.$log.log('removePaymentPlan entered', input);
        var path = "../v1/paymentplan";
        var thedata = {
            paymentid: input.paymentid,
            payerid: input.payerid
        };
        return vm.ClassServices.removePaymentPlan(path, thedata)
            .then(function(data) {
                vm.$log.log('removePaymentPlan returned data');
                vm.$log.log(data);
                vm.$log.log(data.message);
                vm.message = data.message;
                if ((typeof data.paymentplan === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return(vm.$q.reject(data));
                }
                vm.getStudentRegistrations();
                return data;
            }).catch(function(e) {
                vm.$log.log('removePaymentPlan failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    removeStudentReg(input) {
        var vm = this;
        vm.$log.log('removeStudentRegistration entered');
        var path = "../v1/studentregistrationid";
        var thedata = {
            studentid: input.contactid,
            registrationid: input.registrationid
        };
        return vm.ClassServices.removeStudentRegistration(path, thedata)
            .then(function(data) {
                vm.$log.log('removeStudentRegistration returned data');
                vm.$log.log(data);
                vm.$log.log(data.message);
                vm.message = data.message;
                if ((typeof data.studentregistration === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return(vm.$q.reject(data));
                }
                vm.getStudentRegistrations();
                return data;
            }).catch(function(e) {
                vm.$log.log('removeStudentRegistration failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
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


    getStudentRegistrations() {

        var vm = this;
        var path = "../v1/registrationlist";
        vm.gridOptions.data = [];

        return vm.StudentServices.getStudentRegistrations(path).then(function(data) {
            vm.Util.checkDataSuccessv2(data, data.registrationlist, vm.Notification, vm.$q, 'getStudentRegistrations', true);

            vm.gridOptions.data = data.registrationlist;

        }, function(error) {
            vm.Util.exceptionError(error, "getStudentRegistrations", vm.Notification);
            vm.gridOptions.data = [];
            return (vm.$q.reject(error));

        });

    }



    setGridOptions() {
        var vm = this;


        vm.gridOptions = {
            showGridFooter: true,
            enableFiltering: true,
            enableGridMenu: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.initialLength,
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
