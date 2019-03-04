import angular from 'angular';

export class BasicTableBasicController {
    constructor(

        $log, $q, $scope, $interval, ClassServices, UserServices, uiGridConstants, Notification, moment, iddropdownFilter, Util, portalDataService

    ) {
        'ngInject';
        this.$log = $log;
        this.$q = $q;
        this.$scope = $scope;
        this.$interval = $interval;
        this.ClassServices = ClassServices;
        this.uiGridConstants = uiGridConstants;
        this.Notification = Notification;
        this.moment = moment;
        this.Util = Util;
        this.iddropdownFilter = iddropdownFilter;
        this.portalDataService = portalDataService;
        this.UserServices = UserServices;
    }
    $onInit() {

        var vm = this;


        var $ = angular.element;

        vm.isCollapsed = true;
        vm.gridOptions = {};
        vm.gridApi;
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.Basic = {};
        //        [{"id":"ChildrenKarate","value":"ChildrenKarate","order":1},{"id":"AdultKarate","value":"AdultKarate","order":2},{"id":"Wellness","value":"Wellness","order":3},{"id":"Other","value":"Other","order":4},{"id":"Kickboxing","value":"Kickboxing","order":5},{"id":"Zoomba","value":"Zoomba","order":6},{"id":"AfterSchool","value":"AfterSchool","order":7}];
        vm.listTypes = [
            { "id": "beltsize", "value": "beltsize", "order": 1 },
            { "id": "ClassStatus", "value": "ClassStatus", "order": 2 },
            { "id": "Classtype", "value": "Classtype", "order": 3 },
            { "id": "ContactType", "value": "ContactType", "order": 4 },
            { "id": "gisize", "value": "gisize", "order": 5 },
            { "id": "Instructor Title", "value": "Instructor Title", "order": 6 },
            { "id": "PaymentPlan", "value": "PaymentPlan", "order": 7 },
            { "id": "PaymentType", "value": "PaymentType", "order": 8 },
            { "id": "ranktypelist", "value": "ranktypelist", "order": 9 },
            { "id": "pgmcat", "value": "pgmcat", "order": 10 },
            { "id": "classcat", "value": "classcat", "order": 11 },
            { "id": "agecat", "value": "agecat", "order": 12 },
            { "id": "shirtsize", "value": "shirtsize", "order": 13 }
        ];
        vm.thisBasic = [];

        vm.gridLength = {};
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);


        vm.setgridOptions();
        vm.activate();

    }
    $onDestroy() {
        this.$log.log("table-basic-basic dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;
//        vm.portalDataService.Portlet('table-basic-basic');

        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('BasicTableBasicController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("table-basic-basic started");

        });

        vm.getBasic().then(function() {
            vm.$log.log('getBasic activate done');
        }, function(error) {
            return (vm.$q.reject(error));
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

    removeBasic(input) {
        var vm = this;
        vm.$log.log('removeBasic entered', input);
        var path = "../v1/basic";
        var thedata = {
            id: input.id
        };
        var data = {};
        data.BasicExistsList = {};

        //check nclasspays, nclasspgm, studentregistration, testcandidates
        return vm.ClassServices.removeBasic(thedata, path)
            .then(function(data) {
                vm.$log.log('removeBasic returned data');
                vm.$log.log(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    vm.BasicFKExists = data.BasicExistsList;
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getBasic().then(function(zdata) {
                        vm.$log.log('getBasic returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getBasic after remove:', error);
                        vm.thisBasic = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.log('removeBasic failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addBasic(rowEntity) {
        var vm = this;
        vm.updateBasic(rowEntity, 'Add');
    }
    updateBasic(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/basic";
        // listtype, listkey, listvalue, listorder 

        var thedata = {
            id: rowEntity.id,
            listtype: rowEntity.listtype,
            listkey: rowEntity.listkey,
            listvalue: rowEntity.listvalue,
            listorder: rowEntity.listorder
        };

        vm.$log.log('about updateBasic ', thedata, updpath, updatetype);
        return vm.ClassServices.updateBasic(updpath, thedata)
            .then(function(data) {
                vm.$log.log('updateBasic returned data');
                vm.$log.log(data);
                vm.thisBasic = data;
                vm.$log.log(vm.thisBasic);
                vm.$log.log(vm.thisBasic.message);
                vm.message = vm.thisBasic.message;
                if ((typeof vm.thisBasic === 'undefined' || vm.thisBasic.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                if (updatetype === 'Add') {
                    vm.getBasic().then(function(zdata) {
                            vm.$log.log('getBasic returned', zdata);
                        },
                        function(error) {
                            vm.$log.log('Caught an error getBasic after remove:', error);
                            vm.thisBasic = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });

                }

                return vm.thisBasic;
            }).catch(function(e) {
                vm.$log.log('updateBasic failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getBasic() {
        var vm = this;
        vm.$log.log('getBasic entered');
        var path = '../v1/basic';

        return vm.ClassServices.getBasics(path).then(function(data) {
            vm.$log.log('getBasics returned data');
            vm.$log.log(data);

            vm.gridOptions.data = data.Basiclist;

        }, function(error) {
            vm.$log.log('Caught an error getBasics:', error);
            vm.Basiclist = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

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
            columnDefs: [

                {
                    field: 'listtype',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.listTypes,
                    filterHeaderTemplate: 'templates/includes/filtercoltemplate.html',
                    filter: {
                        options: vm.listTypes
                    }
                },
                {
                    field: 'listkey',
                    displayName: 'listkey',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                },
                {
                    field: 'listvalue',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'listorder',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeBasic(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
                }

            ],

            //rowHeight: 15,
            showGridFooter: false,
            enableColumnResizing: true,

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
                            vm.updateBasic(rowEntity, 'Update');
                        }
                    });

            }
        };

    }

}
