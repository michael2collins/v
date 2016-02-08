(function () {
    'use strict';

    angular
        .module('ng-admin')

    .controller('TournamentController', TournamentController);
    TournamentController.$inject = ['TournamentServices',
    '$scope',
    '$rootScope',
    '$routeParams',
    '$log',
    '$location'
    ];

    function TournamentController(TournamentServices, $scope, $rootScope, $routeParams, $log, $location) {
        /* jshint validthis: true */
        var vmstudent = this;

        vmstudent.getStudent = getStudent;
        vmstudent.idpresent = idpresent;
        vmstudent.getAllZips = getAllZips;
        vmstudent.getStudentLists = getStudentLists;
        vmstudent.getRankList = getRankList;
        vmstudent.updateStudent = updateStudent;
        vmstudent.students = [];
        vmstudent.genders = [];
        vmstudent.zipList = [];
        vmstudent.concat = '';
        vmstudent.ContactTypeList = [];
        vmstudent.CurrentRankList = [];
        vmstudent.CurrentReikiRankList = [];
        vmstudent.StudentSchoolList = [];
        vmstudent.GuiSizeList = [];
        vmstudent.ShirtSizeList = [];
        vmstudent.BeltSizeList = [];
        vmstudent.instructorTitleList = [];
        vmstudent.getBirthday = getBirthday;
        vmstudent.dateopen = dateopen;
        vmstudent.students.pictureurldecache = undefined;
        vmstudent.setActiveTab = setActiveTab;
        vmstudent.getActiveTab = getActiveTab;
        vmstudent.EventName = '';

        vmstudent.menu_h = $('#sidebar').height();
        vmstudent.setHeight = setHeight;
        vmstudent.path = '../v1/students/' + $routeParams.id;
        vmstudent.zippath = '../v1/zips';
        vmstudent.id = $routeParams.id;

        vmstudent.sListPath = '../v1/studentlists';
        vmstudent.rankListPath = '../v1/ranklist';

        $log.debug('Routeparam is:');
        $log.debug($routeParams.id);

        vmstudent.status = {
            opened: false
        };

        setLists();
        getAllZips();
        getStudentLists();
        getRankList();
        activate();

        function idpresent() {
            return vmstudent.id > 0;
        }
        
        function dateopen($event) {
            vmstudent.status.opened = true;
        }

        function activate() {
            $log.debug('about activate editstudent ');
            
            return getStudent().then(function () {
                $log.debug('activated EditStudent view');
                var thetab = TournamentServices.getActiveTab();
                $log.debug('activate the active tab', thetab);

            });
        }

        function getBirthday(bday) {
            $log.debug('bday');
            $log.debug(bday);
            return new Date(bday);
        }


        function getStudent() {
            return TournamentServices.getStudent(vmstudent.path).then(function (data) {
                $log.debug('getStudent returned data');
                $log.debug(data.data);
                //TournamentServices.setTheStudent(data.data);
                vmstudent.students = data.data;
                return vmstudent.students;
            });
        }

        function updateStudent() {
            $log.debug('about updateStudent ', vmstudent.students);
            return TournamentServices.updateStudent(vmstudent.path, vmstudent.students).then(function (data) {
                $log.debug('updateStudent returned data: goto', vmstudent.path);
                $log.debug(data.data);
                vmstudent.students = data.data;
                getStudent();
            });
        }

        function getAllZips() {
            return TournamentServices.getAllZips(vmstudent.zippath).then(function (data) {
                $log.debug('getAllZips returned data');
                $log.debug(data.data);
                vmstudent.zipList = data.data;

                return vmstudent.zipList;
            });
        }

        function getStudentLists() {
            return TournamentServices.getStudentLists(vmstudent.sListPath).then(function (data) {
                $log.debug('getStudentLists returned data');
                $log.debug(data.data);
                vmstudent.StudentList = data.data;

                return vmstudent.StudentList;
            });
        }

        function getRankList() {
            return TournamentServices.getRankList(vmstudent.rankListPath).then(function (data) {
                $log.debug('getRankList returned data');
                $log.debug(data.data);
                vmstudent.RankList = data.data;

                return vmstudent.RankList;
            });
        }

        function setHeight() {
            $('#form-layouts-editstudent ul.nav-pills li a').live('click', function () {
                $log.debug('set height');
                var tab_id = $(this).attr('href');
                var tab_h = $(tab_id).height();
                if (tab_h < vmstudent.menu_h) {
                    $(tab_id).css('height', '960px');
                }
            });
        }

        function setLists() {
            vmstudent.genders = ['Female', 'Male', 'Unknown'];
        }

        function setActiveTab( activeTab ){
            $log.debug('set activetab as:', activeTab);
            TournamentServices.setActiveTab(activeTab);
        }

        function getActiveTab(){
            return TournamentServices.getActiveTab();
        }


    }

})();
