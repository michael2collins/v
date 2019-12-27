import angular from 'angular';

export class CardController {
    constructor(
        $log, $scope
    ) {
        'ngInject';
        this.$log = $log;
        this.$scope = $scope;
    }

    $onInit() {
        var vm = this;
        vm.$log.log("CardController entered");
        vm.card = vm.$scope.$parent.card;
        vm.cardparent = vm.$scope.$parent.$parent.$parent.$parent.$ctrl;
    }
    $onDestroy() {
        this.$log.log("CardController dismissed");
    }
    $onChanges(changes) {
        var vm = this;
        vm.$log.log("CardController changed", changes);
        if (changes.cardparent) {
            vm.cardparent = angular.copy(this.cardparent);
        }
/*        if (changes.cardparent2) {
            vm.cardparent2 = angular.copy(this.cardparent2);
        }
*/
    }
    

    update() {
        var vm = this;
        vm.onUpdate({
            $event: {
                cardparent: vm.cardparent
            }
        });
    }
}
