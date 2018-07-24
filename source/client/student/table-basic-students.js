(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin.student')
        .controller('StudentsTableBasicController', StudentsTableBasicController);

    StudentsTableBasicController.$inject = [
        '$scope',
        '$log',
        'StudentServices',
        '$q'
    ];

    function StudentsTableBasicController( $scope, $log, StudentServices, $q) {
        /* jshint validthis: true */
        var vm = this;
        vm.setLimit = setLimit;
        vm.setRank = setRank;
        vm.getRank = getRank;
        vm.activate = activate;
        vm.getContactType = getContactType;
        vm.getLimit = getLimit;
        vm.getStatus = getStatus;
        vm.setStatus = setStatus;
        vm.refreshStudents = refreshStudents;
        vm.editStudentFromPick = editStudentFromPick;
        vm.disable = undefined;
        vm.Rank = '';
        vm.limit = 20;
        vm.status = 'Active';
        vm.limits = [10,20,50,100,200,500];
        vm.statuses = [];
        vm.contacttypes;
        vm.RankList = [];
        vm.StudentList = [];
        vm.thecontacttype = 'Student';
        vm.doneActivate = false;
        vm.refreshstudentlist = [];
        vm.studentpick;
        vm.eventResult;
        
         vm.isCollapsed = true;

        if (!vm.doneActivate) {
            activate();
        }
        
        function setLimit(thelimit) {
            $log.debug('setLimit',thelimit);
            vm.limit = thelimit;
        }
        function setContactType(thetype) {
            $log.debug('thetype',thetype);
            vm.thecontacttype = thetype;
        }
        function setRank(therank) {
            $log.debug('setRank',therank);
            vm.Rank = therank;
        }
        function setStatus(thestatus) {
            vm.status = thestatus;
        }
        function getStatus() {
            return vm.status;
        }
        function getRank() {
            $log.debug('getRank');
            return vm.Rank;
        }
        function getContactType(){
            $log.debug('getContactType');
            return vm.thecontacttype;
        }
        function getLimit() {
            $log.debug('getLimit');
            return vm.limit;
        }

//        $.fn.Data.Portlet();
        function activate() {
            $q.all([
                    getStudentLists().then(function() {
                        $log.debug('getStudentLists ContactTypeList',vm.StudentList.ContactTypeList);
                        $log.debug('getStudentLists ClassStatusList',vm.StudentList.ClassStatusList);
                       setContactType(vm.StudentList.ContactTypeList[0].listvalue);
                       setStatus(vm.StudentList.ClassStatusList[0].listvalue);
                       setLimit(vm.limits[1]);
                   }),
                    getRankList().then(function() {
                        $log.debug('getRankList',vm.RankList);
                        
                       setRank('All');
                        $log.debug('setRank', vm.Rank);
                     })
                ])
                .then(function() {
                    $log.debug('getAllStudents activate returned');
                    vm.doneActivate = true;
            });
        }

        function getRankList() {
            var path='../v1/ranklist'
            return StudentServices.getRankList(path).then(function (data) {
                $log.debug('getRankList returned data');
                $log.debug(data);
                vm.RankList = data;

                return vm.RankList;
            });
        }

        function getStudentLists() {
            var path = '../v1/studentlists';
            return StudentServices.getStudentLists(path).then(function (data) {
                $log.debug('getStudentLists returned data');
                $log.debug(data);
                vm.StudentList = data;

                return vm.StudentList;
            });
        }

        function getContactTypes() {
            return StudentServices.getContactTypeCounts().then(function(data){
                    $log.debug('controller getContactTypes returned data');
                    $log.debug(data.contacttypes);
                    vm.contacttypes = data.contacttypes;
                    $log.debug('controller contacttypes service data',vm.contacttypes);
                    return vm.contacttypes;
                });
        }
        
        function refreshStudents(theinput) {
            return StudentServices.refreshStudents(theinput).then(function(data){
                    $log.debug('controller refreshStudents returned data');
                    $log.debug(data);
                    vm.refreshstudentlist = data;
                    $log.debug('controller refreshstudentlist service data',vm.refreshstudentlist);
                    return vm.refreshstudentlist;
                });
            
        }

        
//         function editStudentFromPick(item,model){
         function editStudentFromPick(item){
            vm.eventResult = {item: item};
            $log.debug('editStudentFromPick', vm.eventResult);
        }


    }

})(window,window.angular);