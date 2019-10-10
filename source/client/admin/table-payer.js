import angular from 'angular';

export class PayerTableBasicController {
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
        vm.Payer = {};
        vm.thisPayer = [];
        vm.picklist =[];
        vm.selected=false;
        vm.invoicevalue='Yes';

        vm.gridLength = {};
        vm.initialLength = 10;
        vm.rowheight = 32;
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);


        vm.setgridOptions();
        vm.activate();

    }
    $onDestroy() {
        this.$log.log("table-basic-payer dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;

        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('PayerTableBasicController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("table-basic-payer started");

        });

        vm.getPayers().then(function() {
            vm.$log.log('getPayers activate done');
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

    removePayer(input) {
        var vm = this;
        vm.$log.log('removePayer entered', input);
        var path = "../v1/payer";
        var thedata = {
            payerid: input.payerid
        };
        var data = {};
        data.PayerExistsList = {};

        //check nclasspays, npayments
        return vm.ClassServices.removePayer(path, thedata)
            .then(function(data) {
                vm.$log.log('removePayer returned data');
                vm.$log.log(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    vm.PayerFKExists = data.PayerExistsList;
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getPayers().then(function(zdata) {
                        vm.$log.log('getPayers returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getPayers after remove:', error);
                        vm.thisPayer = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.log('removePayer failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addPayer(rowEntity) {
        var vm = this;
        vm.updatePayer(rowEntity, 'Add');
    }
    update2Payer(rowEntity) {
        var vm = this;
        vm.updatePayer(rowEntity, 'Update');
        
    }
    updatePayer(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/payer";

        var thedata = {
            payerid: rowEntity.payerid,
            payername: rowEntity.payername,
            payeremail: rowEntity.payeremail,
            createInvoice: rowEntity.createinvoice,
        };

        vm.$log.log('about updatePayer ', thedata, updpath, updatetype);
        return vm.ClassServices.updatePayer(updpath, thedata)
            .then(function(data) {
                vm.$log.log('updatePayer returned data');
                vm.$log.log(data);
                vm.thisPayer = data;
                vm.$log.log(vm.thisPayer);
                vm.$log.log(vm.thisPayer.message);
                vm.message = vm.thisPayer.message;
                if ((typeof vm.thisPayer === 'undefined' || vm.thisPayer.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                if (updatetype === 'Add') {
                    vm.getPayers().then(function(zdata) {
                            vm.$log.log('getPayer returned', zdata);
                        },
                        function(error) {
                            vm.$log.log('Caught an error getPayer after remove:', error);
                            vm.thisPayer = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });

                }

                return vm.thisPayer;
            }).catch(function(e) {
                vm.$log.log('updatePayer failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    changeInvoicing() {
        var vm = this;
        if (vm.selected === false) {
            var error = "no rows selected";
            vm.Notification.error({ message: error, delay: 5000 });
            return;
        }
        vm.invoiceset();
    }
    getPayers() {
        var vm = this;
        vm.$log.log('getPayer entered');
        var path = '../v1/payers';

        return vm.ClassServices.getPayers(path).then(function(data) {
            vm.$log.log('getPayers returned data');
            vm.$log.log(data);

            vm.gridOptions.data = data.payerlist;

        }, function(error) {
            vm.$log.log('Caught an error getPayers:', error);
            vm.gridOptions.data = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }
    setgridOptions() {
        var vm = this;
    //
        var ctpl = '<div class="ui-grid-cell-contents"><span><toggle-switch on-label="Yes" off-label="No" ';
            ctpl += ' type="checkbox" ng-model="row.entity.createInvoice" ng-change="grid.appScope.update2Payer(row.entity)" ';
            ctpl += ' class="switch-primary switch-mini "></toggle-switch></span></div>';

        vm.gridOptions = {
            enableFiltering: true,
            enableCellEditOnFocus: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.initialLength,
            rowHeight: vm.rowheight,
            appScopeProvider: vm,
            columnDefs: [

                {
                    field: 'payername',
                    displayName: 'Payer Name',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                },
                {
                    field: 'payeremail',
                    displayName: "Payer Email",
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'createInvoice',
                    displayName: "Generate Invoice?",
                    type: 'boolean',
                    cellTemplate: ctpl,                    
                    enableCellEdit: true
                },
                {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removePayer(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
                            vm.updatePayer(rowEntity, 'Update');
                        }
                    });
                gridApi.selection.on.rowSelectionChanged(vm.$scope, function(row) {
                    var msg = 'pickgrid row selected ' + row.entity;
                    vm.$log.log(msg);

                    var selectedArr = vm.gridApi.selection.getSelectedRows();
                    vm.$log.log('selected', selectedArr);
                    vm.setSelectedArray(selectedArr);

                });
                gridApi.selection.on.rowSelectionChangedBatch(vm.$scope, function(rows) {
                    vm.$log.log("grid batch");
                    var selectedArr = vm.gridApi.selection.getSelectedRows();
                    vm.$log.log('batch selected', selectedArr);
                    vm.setSelectedArray(selectedArr);

                });

            }
        };

    }
    setSelectedArray(inputArray) {
        var vm = this;
        vm.$log.log("setSelectedArray entered", inputArray);
        vm.picklist = [];


        if (inputArray.length > 0) {
            vm.selected = true;
            for (var i = 0, len = inputArray.length; i < len; i++) {
                var info = {
                    payerid: inputArray[i].payerid,
                    payername: inputArray[i].payername,
                    payeremail: inputArray[i].payeremail,
                    createInvoice: inputArray[i].createInvoice
                };
                vm.picklist.push(info);
            }
        }
        else {
            vm.selected = false;
            return;
        }

        vm.$log.log("setarray", vm.picklist);

    }

  invoiceset() {
    var vm = this;
    vm.$log.log('hit invoiceset');

    var path = "../v1/payerinvoice";
    var thedata = {
      invoicevlu: vm.invoicevalue,
      selectedPayers: vm.picklist,
    };

    vm.$log.log('about set createInvoice for payer picklist ', thedata, path);

    return vm.ClassServices.invoiceset(path, thedata)
      .then(function(data) {
        vm.$log.log('invoiceset returned data');
        vm.$log.log(data);
        vm.message = data.message;
        if ((typeof data === 'undefined' || data.error === true) &&
          typeof data !== 'undefined') {
          vm.Notification.error({ message: vm.message, delay: 5000 });
          return (vm.$q.reject(data));
        }
        else {
          vm.Notification.success({ message: vm.message, delay: 5000 });
        }

        vm.getPayers().then(function(zdata) {
                vm.$log.log('getPayer returned', zdata);
            },
            function(error) {
                vm.$log.log('Caught an error getPayer after remove:', error);
                vm.thisPayer = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));
            });

      }).catch(function(e) {
        vm.$log.log('invoiceset failure:');
        vm.$log.log("error", e);
        vm.message = e;
        vm.Notification.error({ message: e, delay: 5000 });
        throw e;
      });


  }

}
