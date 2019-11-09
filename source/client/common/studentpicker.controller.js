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
        vm.eventResult = {};
        vm.studentpick ='';
    }
    $onDestroy() {
        this.$log.log("StudentPickerController dismissed");
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
/*
    editStudentFromPick(item) {
        var vm = this;
        vm.eventResult = { item: item };
        vm.$log.log('editStudentFromPick', vm.eventResult);
    }
*/
    update(prop, value) {
        var vm=this;
           vm.onUpdate( {studentpickparent: vm.studentpickparent, prop: prop, value: vm.studentpickparent.studentpick});
  }
    
}
