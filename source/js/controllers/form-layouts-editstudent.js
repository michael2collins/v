(function () {
    'use strict';

    angular
        .module('ng-admin')

    .controller('FormLayoutsControllerEditStudent', FormLayoutsControllerEditStudent);
    FormLayoutsControllerEditStudent.$inject = ['StudentServices',
    '$scope',
    '$rootScope',
    '$routeParams',
    '$log',
    '$location'
    ];

    function FormLayoutsControllerEditStudent(StudentServices, $scope, $rootScope, $routeParams, $log, $location) {
        /* jshint validthis: true */
        var vmstudent = this;

        vmstudent.getStudent = getStudent;
        vmstudent.getAllZips = getAllZips;
        vmstudent.getStudentLists = getStudentLists;
        vmstudent.getRankList = getRankList;
        vmstudent.updateStudent = updateStudent;
        vmstudent.setStudentPIC = setStudentPIC;
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

        vmstudent.menu_h = $('#sidebar').height();
        vmstudent.setHeight = setHeight;
        vmstudent.path = '../v1/students/' + $routeParams.id;
        //      vmstudent.path = '../v1/students/5340';
        vmstudent.zippath = '../v1/zips';

        vmstudent.sListPath = '../v1/studentlists';
        vmstudent.rankListPath = '../v1/ranklist';

        $log.debug('Routeparam is:');
        $log.debug($routeParams.id);

        vmstudent.status = {
            opened: false
        };

        //        $.fn.Data.Portlet();
        //        setHeight();
        setLists();
        getAllZips();
        getStudentLists();
        getRankList();
        activate();
        /*
          $scope.today = function() {
            $scope.dt = new Date();
          };
          $scope.today();

          $scope.clear = function () {
            $scope.dt = null;
          };

          // Disable weekend selection
          $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
          };

          $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
          };
          $scope.toggleMin();
*/
        function dateopen($event) {
            vmstudent.status.opened = true;
        }
        /*
          $scope.dateOptions = {
         //   formatYear: 'yy',
         //   startingDay: 1
          };
          $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
          $scope.format = $scope.formats[4];
         */

        function activate() {
            $log.debug('about activate editstudent ');
            return getStudent().then(function () {
                $log.debug('activated EditStudent view');

            });
        }

        function getBirthday(bday) {
            $log.debug('bday');
            $log.debug(bday);
            return new Date(bday);
        }

        function getStudent() {
            return StudentServices.getStudent(vmstudent.path).then(function (data) {
                $log.debug('getStudent returned data');
                $log.debug(data.data);
                StudentServices.setTheStudent(data.data);
                vmstudent.students = data.data;
                vmstudent.students.pictureurldecache = vmstudent.students.pictureurl +  '?decache=' + Math.random();
                return vmstudent.students;
            });
        }

        function updateStudent() {
            $log.debug('about updateStudent ', vmstudent.students);
            return StudentServices.updateStudent(vmstudent.path, vmstudent.students).then(function (data) {
                $log.debug('updateStudent returned data: goto', vmstudent.path);
                $log.debug(data.data);
                vmstudent.students = data.data;
                //          $log.debug('set route', $routeParams);
                //            $location.url('#/form-layouts-editstudent?id=' + $routeParams.id );
                //          return vmstudent.students;
                getStudent();
            });
        }

        function setStudentPIC(pic) {
            $log.debug('about setStudentPIC ', pic);
            vmstudent.students.pictureurl = pic;
            $log.debug('about setStudentPIC ', vmstudent.students);
//            return StudentServices.updateStudent(vmstudent.path, vmstudent.students).then(function (data) {
 //               $log.debug('setStudentPIC returned data: goto', vmstudent.path);
  //              $log.debug(data.data);
//                vmstudent.students = data.data;
//                //          $log.debug('set route', $routeParams);
//                //            $location.url('#/form-layouts-editstudent?id=' + $routeParams.id );
//                //          return vmstudent.students;
//                //getStudent();
//            });
              updateStudent();
        }

        function getAllZips() {
            return StudentServices.getAllZips(vmstudent.zippath).then(function (data) {
                $log.debug('getAllZips returned data');
                $log.debug(data.data);
                vmstudent.zipList = data.data;

                return vmstudent.zipList;
            });
        }

        function getStudentLists() {
            return StudentServices.getStudentLists(vmstudent.sListPath).then(function (data) {
                $log.debug('getStudentLists returned data');
                $log.debug(data.data);
                vmstudent.StudentList = data.data;

                return vmstudent.StudentList;
            });
        }

        function getRankList() {
            return StudentServices.getRankList(vmstudent.rankListPath).then(function (data) {
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
    }

})();
