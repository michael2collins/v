import angular from 'angular';

export class ClassTableBasicController {
    constructor(
       $log,$q,$scope,$interval,ClassServices,UserServices, Util,uiGridConstants,Notification,moment,iddropdownFilter,portalDataService, _, PhotoUtil
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
        this._ = _;
        this.PhotoUtil = PhotoUtil;
    }
    $onInit() {

        var vm = this;
//        var $ = angular.element;
        vm.isCollapsed = true;

        vm.gridOptions = {};
        vm.gridApi = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.imgsrc = "./images/classes/";
        vm.Class = {};
        vm.rankTypes = [];
        vm.ranks = [];
        vm.ranks2 = [];
        vm.thisranks = [];
        vm.thisClass = [];
        vm.gridLength = {};
        vm.initialLength = 5;
        vm.rowheight = 130; //32
        vm.headerheight = 140;
        vm.setGridLength(vm.initialLength);

        vm.setgridOptions();
        vm.activate();
    }
    $onDestroy() {
        this.$log.log("table-basic-class dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;
//        vm.portalDataService.Portlet('table-basic-class');

        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('ClassTableBasicController',vm.UserServices.isDebugEnabled());
        }

        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("table-basic-class started");

        });



        vm.getClass().then(function() {
           vm.$log.log('getClass activate done');
           vm.$q.all([
                    vm.getrankTypes().then(function() {
                       vm.$log.log('getrankTypes activate done', vm.rankTypes);
                        vm.changeRanktype();
                    }, function(error) {
                        return(vm.$q.reject(error));
                    })
                ])
                .then(function() {
                   vm.$log.log(' activate done');
                    vm.setgridOptions();
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
                });

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


    removeClass(input) {
        var vm = this;
       vm.$log.log('removeClass entered', input);
        var path = "../v1/class";
        var thedata = {
            id: input.id
        };
        var data = {};
        data.ClassExistsList = {};

        //check ???
        return vm.ClassServices.removeClass(thedata, path)
            .then(function(data) {
               vm.$log.log('removeClass returned data');
               vm.$log.log(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    vm.ClassFKExists = data.ClassExistsList;
                    return(vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getClass().then(function(zdata) {
                       vm.$log.log('getClass returned', zdata);
                    },
                    function(error) {
                       vm.$log.log('Caught an error getClass after remove:', error);
                        vm.thisClass = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return(vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
               vm.$log.log('removeClass failure:');
               vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addClass(rowEntity) {
        var vm = this;
        vm.updateClass(rowEntity, 'Add');
    }
    updateClass(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/class";

        var vlu = {};
        vlu.rankForNextClass = vm.Util.getByValue(vm.ranks, rowEntity.rankForNextClass, 'value', 'label');
        vlu.ranklistForNextClass = vm.Util.getByValue(vm.rankTypes, rowEntity.ranklistForNextClass, 'id', 'value');
        vlu.registrationType = vm.Util.getByValue(vm.rankTypes, rowEntity.registrationType, 'id', 'value');

        var thedata = {
            id: rowEntity.id,
            class: rowEntity.class,
            registrationType: vlu.registrationType,
            nextClass: rowEntity.nextClass,
            ranklistForNextClass: vlu.ranklistForNextClass,
            rankForNextClass: vlu.rankForNextClass,
            ageForNextClass: rowEntity.ageForNextClass,
            sort: rowEntity.sort,
            pictureurl: rowEntity.pictureurl
        };

       vm.$log.log('about updateClass ', thedata, updpath, updatetype);
        return vm.ClassServices.updateClass(updpath, thedata)
            .then(function(data) {
               vm.$log.log('updateClass returned data');
               vm.$log.log(data);
                vm.thisClass = data;
               vm.$log.log(vm.thisClass);
               vm.$log.log(vm.thisClass.message);
                vm.message = vm.thisClass.message;
                if ((typeof vm.thisClass === 'undefined' || vm.thisClass.error === true) &&
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
                vm.getClass().then(function(zdata) {
                       vm.$log.log('getClass returned', zdata);
                    },
                    function(error) {
                       vm.$log.log('Caught an error getClass after remove:', error);
                        vm.thisClass = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return(vm.$q.reject(error));
                    });

                //                   }

                return vm.thisClass;
            }).catch(function(e) {
               vm.$log.log('updateClass failure:');
               vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getClass() {
        var vm = this;
       vm.$log.log('getClass entered');
        var path = '../v1/class';

        return vm.ClassServices.getClasses(path).then(function(data) {
           vm.$log.log('getClasses returned data');
           vm.$log.log(data);

            vm.gridOptions.data = data.Classlist;
            vm.Class.sort = parseInt (vm.Util.maxObjArr(data.Classlist, 'sort'), 10) + 1;

        }, function(error) {
           vm.$log.log('Caught an error getClasses:', error);
            vm.Classlist = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return(vm.$q.reject(error));

        });
    }

    changeRanktype() {
        var vm = this;
        vm.Class.registrationTypeVlu = vm.Util.getByValue(vm.rankTypes, vm.Class.registrationType, 'id', 'value');
        //            getRanks();
        vm.getRanks().then(function() {
           vm.$log.log('getranks activate done', vm.ranks);
            vm.gridApi.grid.columns[1].filters[0].term = String(vm.Class.registrationTypeVlu);
            //            vm.gridApi.grid.columns[1].filters[0].term = parseInt(vm.Class.registrationType,10);
            vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);
        }, function(error) {
            return(vm.$q.reject(error));
        });


    }
    changeRanklisttype() {
        //            vm.Class.registrationTypeVlu = vm.Util.getByValue(vm.rankTypes, vm.Class.registrationType, 'id', 'value');
        //            getRanks();
        //            vm.gridApi.grid.columns[1].filters[0].term = String(vm.Class.registrationTypeVlu);
        //            vm.gridApi.grid.columns[1].filters[0].term = parseInt(vm.Class.registrationType,10);
        //            vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

    }

    getrankTypes() {
        var vm = this;
       vm.$log.log('getrankTypes entered');
        var path = '../v1/ranktypeids';
        return vm.ClassServices.getRankTypes(path).then(function(data) {
           vm.$log.log('getrankTypes returned data');
           vm.$log.log(data);

            vm.rankTypes = data.ranktypelist;
           vm.$log.log(data.message);
            vm.message = data.message;
            if ((typeof vm.rankTypes === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return(vm.$q.reject(data));
            }
            else {
                vm.Class.registrationType = String(vm.rankTypes[0].id);
                vm.Class.registrationTypeVlu = String(vm.rankTypes[0].value);
            }
            return vm.rankTypes;
        }, function(error) {
           vm.$log.log('Caught an error getrankTypes:', error);
            vm.rankTypes = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return(vm.$q.reject(error));

        });
    }
    getRanks(mode) {
        var vm = this;
       vm.$log.log('getranks entered', vm.Class.registrationTypeVlu);
        var path;
        if (mode === "All") {
            vm.Class.registrationTypeVlu = 'AdultKarate';
        }
        path = encodeURI('../v1/ranks?ranktype=' + vm.Class.registrationTypeVlu);
        return vm.getRanksquery(path).then(function(data) {
            vm.ranks = data;
            vm.Class.rankForNextClass = String(vm.ranks[0].value);
            vm.Class.ranklistForNextClass =
                typeof vm.Class.registrationType !== undefined ? vm.Class.registrationType : '';
        }, function(error) {
           vm.$log.log('Caught an error getranks:', error);
            vm.ranks = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return(vm.$q.reject(error));
        });

    }
    getRanksquery(path) {
        var vm = this;
       vm.$log.log('getranksquery entered', path);

        return vm.ClassServices.getRanks(path).then(function(data) {
           vm.$log.log('getranks returned data');
           vm.$log.log(data);

            var ranks = data.Ranklist;
           vm.$log.log(data.message);
            vm.message = ranks.message;
            if ((typeof ranks === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return(vm.$q.reject(data));
            }
            return ranks;
        }, function(error) {
           vm.$log.log('Caught an error getranks:', error);
            //ranks = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return(vm.$q.reject(error));

        });
    }

    getRankss(mode) {
        var vm = this;
       vm.$log.log('getranks entered', vm.Class.registrationTypeVlu);
        var path;
        if (mode === "All") {
            path = encodeURI('../v1/ranks?ranktype=AdultKarate');
        }
        else {
            path = encodeURI('../v1/ranks?ranktype=' + vm.Class.registrationTypeVlu);
        }

        return vm.ClassServices.getRanks(path).then(function(data) {
           vm.$log.log('getranks returned data');
           vm.$log.log(data);

            vm.ranks = data.Ranklist;
           vm.$log.log(data.message);
            vm.message = vm.ranks.message;
            if ((typeof vm.ranks === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return(vm.$q.reject(data));
            }
            else {
                vm.Class.rankForNextClass = String(data.Ranklist[0].value);
            }
            return vm.ranks;
        }, function(error) {
           vm.$log.log('Caught an error getranks:', error);
            vm.ranks = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return(vm.$q.reject(error));

        });
    }

    geturl(input) {
        var vm = this;
        return vm.imgsrc + input;
    }
    setPhoto(rowentity) {
        var vm=this;
        var dataToPass={};
        dataToPass.pictureurl = ""; 
        dataToPass.picnm = rowentity.class;
        vm.openPhoto(dataToPass);
    }
    openPhoto(rowentity) {
        var vm=this;
        var dataToPass={};
        dataToPass.pictureurl = rowentity.pictureurl; 
        dataToPass.picnm = rowentity.class;
        dataToPass.LastName = "";
        dataToPass.type = "classes";
        if (vm._.isEmpty(dataToPass.pictureurl)) {
            vm.$log.log('empty picture');
            dataToPass.pictureurldecache = 'missingstudentpicture.png';
        }
        else {
            dataToPass.pictureurldecache = dataToPass.pictureurl + '?decache=' + Math.random();
        }
        vm.PhotoUtil.openPhotoModal(vm, dataToPass);

    }
    
    setgridOptions() {
        var vm = this;

        var tpl = '<div class="ui-grid-cell-contents"> <zoom ng-src="{{grid.appScope.geturl(grid.getCellValue(row, col))}}" ';
        tpl = tpl + ' frame="example{{rowRenderIndex}}" img="image{{rowRenderIndex}}"  zoomlvl="2.5" lazy-src></zoom>';
        tpl = tpl + ' <span>  <a ng-click="grid.appScope.openPhoto(row.entity)" role="button" ';
        tpl = tpl + ' class="btn btn-blue" style="padding:  0px 14px;"  ><i class="fas fa-pencil-alt"></i>&nbsp; Edit</a></span></div>';

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

                {
                    field: 'class',
                    displayName: 'Class',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true
                },
                {
                    field: 'registrationType',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.rankTypes,
                    //                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>', 
                    filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                    filter: {
                        //                        term: 'AdultKarate',
                        //                        term: vm.Class.registrationTypeVlu,
                        //                        options: vm.rankTypes        
                        type: vm.uiGridConstants.filter.SELECT,
                        selectOptions: vm.rankTypes
                    }
                },
                {
                    field: 'ranklistForNextClass',
                    displayName: 'Type of Next Class',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: false,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'value',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.rankTypes,
                    //      filterHeaderTemplate: 'templates/includes/filtercoltemplatevlu.html',
                    //    filter: { 
                    //        type: vm.uiGridConstants.filter.SELECT,
                    //        selectOptions: vm.rankTypes
                    //    }
                },
                {
                    field: 'nextClass',
                    displayName: 'Next Class',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'ageForNextClass',
                    displayName: 'Age for Next Class',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'rankForNextClass',
                    displayName: 'Rank for Next Class',
                    enableCellEdit: true,
                    enableFiltering: false,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'label',
                    editDropdownValueLabel: 'label',
                    editDropdownOptionsFunction: function(rowEntity, colDef) {
                        var path;

                        path = encodeURI('../v1/ranks?ranktype=' + rowEntity.ranklistForNextClass);
                        return vm.getRanksquery(path).then(function(data) {
                            vm.thisranks = data;
                            return data;
                        });
                    }
                },
                {
                    field: 'sort',
                    displayName: 'Sort Order',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true
                },
                {
                    field: 'pictureurl',
                    minWidth: 200,
                    displayName: 'Picture',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    cellTemplate: tpl
                }, {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeClass(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
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
                            if (colDef.name === "ranklistForNextClass") {
                                //clear the rankForNextClass when the type is changed
                                rowEntity.rankForNextClass = "NULL";
                            }
                            vm.updateClass(rowEntity, 'Update');
                        }
                    });

            }
        };
    }

}
