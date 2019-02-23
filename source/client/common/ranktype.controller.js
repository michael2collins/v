
export class RankTypeController {
    constructor(
        $log, Notification, TestingServices, $scope
    ) {
        'ngInject';
        this.$log = $log;
        this.$scope = $scope;
        this.Notification = Notification;
        this.TestingServices = TestingServices;
    }

    $onInit() {

        var vm = this;
        vm.ranktypelist = [];
        vm.ranktypeselected = '';
        vm.activate();

    }

    $onDestroy() {
        this.$log.log("RankTypeController dismissed");
        //this.$log.logEnabled(false);
    }

    activate() {
        var vm = this;

        vm.getRankTypes().then(function() {
            vm.$log.log('getRankTypes', vm.ranktypelist);
// parent doesn't get notice, better for user to pick
//vm.ranktypeparent.ranktype = vm.ranktypelist[0].ranktype;
        })
    }
    
    update(prop, value) {
        var vm=this;
           vm.onUpdate( {ranktypeparent: vm.ranktypeparent, prop: prop, value: vm.ranktypeparent.ranktype});
 //   vm.$scope.$parent.$parent.$ctrl.updateRankType({ranktypeparent: vm.ranktypeparent, prop: prop, value: value});
  }

    changeRankType() {
        var vm = this;
        vm.$log.log("changeRankType", vm.ranktypeselected);
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
                    vm.ranktypelist.push({ranktype: 'missing'});
                    vm.ranktypeselected = vm.ranktypelist[0].ranktype;
                }
                else {
                    error = "No ranktpes found";
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


}
