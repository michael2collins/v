import angular from 'angular';

export class StudentPickerController {
    constructor(
        $log, $scope, StudentServices
    ) {
        'ngInject';
        this.$log = $log;
        this.$scope = $scope;
        this.StudentServices = StudentServices;
    }

    $onInit() {
        var vm = this;
        vm.$log.log("StudentPickerController entered");
        vm.refreshstudentlist = {};
    }
    $onDestroy() {
        this.$log.log("StudentPickerController dismissed");
    }
    $onChanges(changes) {
        var vm = this;
        vm.$log.log("StudentPickerController changed", changes);
        if (changes.studentpickparent) {
            vm.studentpickparent = angular.copy(this.studentpickparent);
        }
/*        if (changes.studentpickparent2) {
            vm.studentpickparent2 = angular.copy(this.studentpickparent2);
        }
*/
    }
    

    refreshStudents(theinput) {
        var vm = this;
        return vm.StudentServices.refreshStudents(theinput).then(function(data) {
            vm.$log.log('studenttable search result controller refreshStudents returned data');
            vm.$log.log(data);
            vm.refreshstudentlist = data;
            vm.$log.log('controller refreshstudentlist service data', vm.refreshstudentlist);
            return vm.refreshstudentlist;
        });

    }
    update() {
        var vm = this;
        vm.onUpdate({
            $event: {
                studentpickparent: vm.studentpickparent
            }
        });
    }
    /*    update2(){
            var vm=this;
            vm.onUpdate2( {
                $event: {
                    studentpickparent2: vm.studentpickparent2
                }
            });
      }
    */
}
