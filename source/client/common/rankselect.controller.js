export class RankSelectController {
    constructor(
        $log, Notification, StudentServices, $scope,$attrs
    ) {
        'ngInject';
        this.$log = $log;
        this.$scope = $scope;
        this.Notification = Notification;
        this.StudentServices = StudentServices;
        this.$attrs = $attrs;
    }

    $onInit() {

        var vm = this;
        vm.ranktypelist = [];
        vm.ranktypeselected = '';
        vm.rankpickparent = {};

        vm.$scope.$on('$viewContentLoaded', 
        function(event){ 
            vm.disenable=vm.$attrs.disenable;

        });

        vm.activate();

    }

    $onDestroy() {
        this.$log.log("RankSelectController dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;

        /*        vm.getRankList().then(function() {
                    vm.$log.log('getRankTypes', vm.ranktypelist);
                    // parent doesn't get notice, better for user to pick
                    //vm.rankpickparent.ranktype = vm.ranktypelist[0].ranktype;
                });
        */
    }

    updateRankType(rankpickparent, prop, value) {
        var vm = this;
        vm.rankpickparent[prop] = value;
        vm.getRank();

    }
    update(prop, value) {
        var vm = this;
        vm.$log.log('update rankselect', prop, value);
        if (prop === 'rank') {
            //pass along value of whole parent?
            vm.onUpdate({ rankpickparent: vm.rankpickparent, prop: prop, value: vm.rankpickparent });
        }
        else {
            vm.Notification.error({ message: "Error: prop unknown:" + prop, delay: 5000 });

        }
        //   vm.$scope.$parent.$parent.$ctrl.updateRankType({rankpickparent: vm.rankpickparent, prop: prop, value: value});
    }

    isOk() {
        var vm = this;
        return (Object.keys(vm.rankpickparent).length === 0 && vm.rankpickparent.constructor === Object) ? false : true;
    }

    getRank(theinput) {
        var vm = this;
        vm.$log.log('getrank', theinput, vm.rankpickparent.ranktype);

        return vm.StudentServices.getRank(vm.rankpickparent.ranktype).then(function(data) {
            vm.$log.log('controller getRank returned data', vm.rankpickparent.ranktype);
            vm.$log.log(data);
            vm.ranklist = data;
            vm.$log.log('controller getRank service data', vm.ranklist);
            return vm.ranklist;
        });

    }
    /*
        getRankList() {
            var vm = this;
            var path = encodeURI("../v1/ranklist");
            var error;

            return vm.StudentServices.getRankList( path).then(function(data) {

                vm.$log.log('getRankList returned data');
                vm.$log.log(data);
                //            vm.RanksList = data;
                if (data.rankList.length > 0) {
                    vm.RanksList = data;
                    //better to pick                    vm.ranktypeselected = vm.RanksList[0].ranktype;
                }
                else {
                    error = "No rank types found";
                    vm.message = error;
                    vm.Notification.error({ message: error, delay: 5000 });
                    vm.RanksList = [];
                    return (vm.$q.reject(error));

                }

                return vm.RanksList;
            }, function(error) {
                vm.$log.log('Caught an error getRankList, going to notify:', error);
                vm.RanksList = [];
                vm.message = error;
                vm.Notification.error({ message: error, delay: 5000 });
                return (vm.$q.reject(error));

            });
        }
    */
}
