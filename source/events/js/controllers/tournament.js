(function () {
    'use strict';

    angular
        .module('ngadmin')

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
        vmstudent.age = age;

        vmstudent.menu_h = $('#sidebar').height();
        vmstudent.setHeight = setHeight;
        vmstudent.path = '../v1/students/' + $routeParams.id;
        vmstudent.zippath = '../v1/zips';
        vmstudent.id = $routeParams.id;

        vmstudent.sListPath = '../v1/studentlists';
        vmstudent.rankListPath = '../v1/ranklist';

          vmstudent.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
          vmstudent.bdateformat = vmstudent.formats[4];

        $log.log('Routeparam is:');
        $log.log($routeParams.id);

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
            $log.log('about activate editstudent ');
            
            return getStudent().then(function () {
                $log.log('activated EditStudent view');
                var thetab = TournamentServices.getActiveTab();
                $log.log('activate the active tab', thetab);

            });
        }

        function getBirthday(bday) {
            $log.log('bday');
            $log.log(bday);
            return new Date(bday);
        }
        function age(bdate) {
            var birth = new Date(bdate);
            var curr  = new Date();
            var diff = curr.getTime() - birth.getTime();
            return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        }


        function getStudent() {
            return TournamentServices.getStudent(vmstudent.path).then(function (data) {
                $log.log('getStudent returned data');
                $log.log(data);
                //TournamentServices.setTheStudent(data);
                vmstudent.students = data;
                $log.log('get Birthday:', vmstudent.students.Birthday);
                if (_.isEmpty(vmstudent.students.Birthday)) {
                    vmstudent.students.Birthday = getBirthday(new Date());
                } else {
                    vmstudent.students.Birthday = getBirthday(vmstudent.students.Birthday);
                }
                
                return vmstudent.students;
            });
        }

        function updateStudent() {
            $log.log('about updateStudent ', vmstudent.students);
            return TournamentServices.updateStudent(vmstudent.path, vmstudent.students).then(function (data) {
                $log.log('updateStudent returned data: goto', vmstudent.path);
                $log.log(data);
                //data returned is not the student
       //         vmstudent.students = data;
                getStudent();
            });
        }

        function getAllZips() {
            return TournamentServices.getAllZips(vmstudent.zippath).then(function (data) {
                $log.log('getAllZips returned data');
                $log.log(data);
                vmstudent.zipList = data;

                return vmstudent.zipList;
            });
        }

        function getStudentLists() {
            return TournamentServices.getStudentLists(vmstudent.sListPath).then(function (data) {
                $log.log('getStudentLists returned data');
                $log.log(data);
                vmstudent.StudentList = data;

                return vmstudent.StudentList;
            });
        }

        function getRankList() {
            return TournamentServices.getRankList(vmstudent.rankListPath).then(function (data) {
                $log.log('getRankList returned data');
                $log.log(data);
                vmstudent.RankList = data;

                return vmstudent.RankList;
            });
        }

        function setHeight() {
            $('#form-layouts-editstudent ul.nav-pills li a').live('click', function () {
                $log.log('set height');
                var tab_id = $(this).attr('href');
                var tab_h = $(tab_id).height();
                if (tab_h < vmstudent.menu_h) {
                    $(tab_id).css('height', '960px');
                }
            });
        }

        function setLists() {
            vmstudent.genders = {
    availableOptions: [
      {id: 'Female', name: 'Female'},
      {id: 'Male', name: 'Male'}
    ],
   };
           // vmstudent.genders = {id:'Female', id:'Male'};
        }

        function setActiveTab( activeTab, thecaller ){
            $log.log('set activetab as:', activeTab, thecaller);
            TournamentServices.setActiveTab(activeTab, thecaller);
        }

        function getActiveTab(){
            var atab =  TournamentServices.getActiveTab();
            $log.log('get activetab is:', atab);
            return atab;
        }



    }

})();
