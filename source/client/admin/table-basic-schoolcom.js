import angular from 'angular';

export class SchoolcomTableBasicController {
    constructor(
       $log,$q,$scope,$interval,ClassServices,UserServices, Util,uiGridConstants,Notification,moment,iddropdownFilter,portalDataService
    ) {
        'ngInject';
        this.$log =$log;
        this.$q =$q;
        this.$scope = $scope;
        this.$interval = $interval;
        this.ClassServices = ClassServices;
        this.Util = Util;
        this.uiGridConstants = uiGridConstants;
        this.Notification = Notification;
        this.moment = moment;
        this.iddropdownFilter = iddropdownFilter;
        this.portalDataService = portalDataService;
        this.UserServices = UserServices;
    }
    $onInit() {

        var vm = this;
        vm.isCollapsed = true;

        vm.gridOptions = {};
        vm.gridApi = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.Schoolcom = {};
        vm.thisSchoolcom = [];
        vm.gridLength = {};
        vm.initialLength = 5;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);

        vm.setgridOptions();
        vm.activate();
    }
    $onDestroy() {
        this.$log.log("table-Basic-Schoolcom dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;
        vm.portalDataService.Portlet('table-Basic-Schoolcom');
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('SchoolcomTableBasicController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("table-Basic-Schoolcom started");

        });

        vm.getSchoolcom().then(function() {
           vm.$log.log('getBasic activate done');
//            vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
        }, function(error) {
            return(vm.$q.reject(error));
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


    removeSchoolcom(input) {
        var vm = this;
       vm.$log.log('removeSchoolcom entered', input);
        var path = "../v1/schoolcom";
        var thedata = {
            id: input.id
        };
        var data = {};
        data.SchoolcomExistsList = {};

        //check ???
        return vm.ClassServices.removeSchoolcom(thedata, path)
            .then(function(data) {
               vm.$log.log('removeSchoolcom returned data');
               vm.$log.log(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    vm.SchoolcomFKExists = data.SchoolcomExistsList;
                    return(vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getSchoolcom().then(function(zdata) {
                       vm.$log.log('getSchoolcom returned', zdata);
                    },
                    function(error) {
                       vm.$log.log('Caught an error getSchoolcom after remove:', error);
                        vm.thisSchoolcom = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return(vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
               vm.$log.log('removeSchoolcom failure:');
               vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addSchoolcom(rowEntity) {
        var vm = this;
        vm.updateSchoolcom(rowEntity, 'Add');
    }
    updateSchoolcom(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/schoolcom";

        var vlu = {};
        var thedata = {
            id: rowEntity.id,
            schoolReplyEmail: rowEntity.schoolReplyEmail,
            schoolReplySignature: rowEntity.schoolReplySignature,
            invoicebatchenabled: rowEntity.invoicebatchenabled
        };

       vm.$log.log('about updateSchoolcom ', thedata, updpath, updatetype);
        return vm.ClassServices.updateSchoolcom(updpath, thedata)
            .then(function(data) {
               vm.$log.log('updateSchoolcom returned data');
               vm.$log.log(data);
                vm.thisSchoolcom = data;
               vm.$log.log(vm.thisSchoolcom);
               vm.$log.log(vm.thisSchoolcom.message);
                vm.message = vm.thisSchoolcom.message;
                if ((typeof vm.thisSchoolcom === 'undefined' || vm.thisSchoolcom.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({
                        message: vm.message + ': ' + (
                            typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
                        delay: 5000
                    });
                    return(vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                //                    if (updatetype === 'Add') {
                vm.getSchoolcom().then(function(zdata) {
                       vm.$log.log('getSchoolcom returned', zdata);
                    },
                    function(error) {
                       vm.$log.log('Caught an error getSchoolcom after remove:', error);
                        vm.thisSchoolcom = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return(vm.$q.reject(error));
                    });

                //                   }

                return vm.thisSchoolcom;
            }).catch(function(e) {
               vm.$log.log('updateSchoolcom failure:');
               vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getSchoolcom() {
        var vm = this;
       vm.$log.log('getSchoolcom entered');
        var path = '../v1/schoolcom';

        return vm.ClassServices.getSchoolcom(path).then(function(data) {
           vm.$log.log('getSchoolcom returned data');
           vm.$log.log(data);
            vm.setgridOptions();

            vm.gridOptions.data = data.Schoolcomlist;

        }, function(error) {
           vm.$log.log('Caught an error getSchoolcom:', error);
            vm.Schoolcomlist = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return(vm.$q.reject(error));

        });
    }

    setgridOptions() {
        var vm = this;

        vm.gridOptions = {
            enableFiltering: true,
            enableCellEditOnFocus: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.initialLength,
            rowHeight: vm.rowheight,
            appScopeProvider: vm,
            showGridFooter: false,
            enableColumnResizing: true,
            columnDefs: [
//id, schoolReplyEmail, schoolReplySignature, invoicebatchenabled

                {
                    field: 'schoolReplyEmail',
                    displayName: 'schoolReplyEmail',
                    headerCellSchoolcom: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, {
                    field: 'schoolReplySignature',
                    displayName: 'schoolReplySignature',
                    headerCellSchoolcom: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, {
                    field: 'invoicebatchenabled',
                    displayName: 'invoicebatchenabled',
                    headerCellSchoolcom: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                }, {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeSchoolcom(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
                }

            ],


            onRegisterApi: function(gridApi) {
               vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                   vm.$log.log('pagination changed');
                    vm.setGridLength(pageSize);
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });

                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            vm.updateSchoolcom(rowEntity, 'Update');
                        }
                    });

            }
        };
    }

}
