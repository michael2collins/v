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
    '$location',
    'Notification'
    ];

    function FormLayoutsControllerEditStudent(StudentServices, $scope, $rootScope, $routeParams, $log, $location,Notification) {
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
        vmstudent.setActiveTab = setActiveTab;
        vmstudent.getActiveTab = getActiveTab;
        
        vmstudent.active = [];
  //      vmstudent.media;
    //    vmstudent.callback = callback;
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

        function dateopen($event) {
            vmstudent.status.opened = true;
        }
        
          vmstudent.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
          vmstudent.bdateformat = vmstudent.formats[4];
         

        function activate() {
            $log.debug('about activate editstudent ');
            
            return getStudent().then(function () {
                $log.debug('activated EditStudent view');
            //    StudentServices.setActiveTab(1,'EditStudent controller');
                var thetab = StudentServices.getActiveTab();
                $log.debug('activate the active tab', thetab);
            //    vmstudent.active[thetab] = true;
                vmstudent.active = thetab;
            },function(error) {
                    $log.debug('activate editstudent',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function getBirthday(bday) {
            $log.debug('bday');
            $log.debug(bday);
            return new Date(bday);
        }

//        function callback(media) {
//            $log.debug('callback entered');
//            //$log.debug(media);
//        }
        function getStudent() {
            return StudentServices.getStudent(vmstudent.path).then(function (data) {
                $log.debug('getStudent returned data');
                $log.debug(data.data);
                StudentServices.setTheStudent(data.data);
                vmstudent.students = data.data;
                $log.debug('studen pic url', vmstudent.students.pictureurl);
                if (_.isEmpty(vmstudent.students.pictureurl)) {
                    $log.debug('empty picture');
                    vmstudent.students.pictureurldecache = 'missingstudentpicture.png';
                } else {
                    vmstudent.students.pictureurldecache = vmstudent.students.pictureurl +  '?decache=' + Math.random();
                }
                $log.debug('get Birthday:', vmstudent.students.Birthday);
                if (_.isEmpty(vmstudent.students.Birthday)) {
                    vmstudent.students.Birthday = getBirthday(new Date());
                } else {
                    vmstudent.students.Birthday = getBirthday(vmstudent.students.Birthday);
                }

                $log.debug('studen pic url decache', vmstudent.students.pictureurldecache);
                return vmstudent.students;
            },function(error) {
                    $log.debug('getStudent',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function updateStudent() {
            $log.debug('about updateStudent ', vmstudent.students);
            $log.debug('with Birthday', vmstudent.students.Birthday);
            
            return StudentServices.updateStudent(vmstudent.path, vmstudent.students).then(function (data) {
                $log.debug('updateStudent returned data: goto', vmstudent.path);
                $log.debug(data.data);
                vmstudent.students = data.data;
                //          $log.debug('set route', $routeParams);
                //            $location.url('#/form-layouts-editstudent?id=' + $routeParams.id );
                //          return vmstudent.students;
                getStudent();
            },function(error) {
                    $log.debug('updateStudent',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
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
            },function(error) {
                    $log.debug('getAllZips',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });        
            
        }

        function getStudentLists() {
            return StudentServices.getStudentLists(vmstudent.sListPath).then(function (data) {
                $log.debug('controller getStudentLists returned data');
                $log.debug(data.data);
                vmstudent.StudentList = data.data;

                return vmstudent.StudentList;
            },function(error) {
                    $log.debug('getStudentLists ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
            });
        }

        function getRankList() {
            return StudentServices.getRankList(vmstudent.rankListPath).then(function (data) {
                $log.debug('getRankList returned data');
                $log.debug(data.data);
                vmstudent.RankList = data.data;

                return vmstudent.RankList;
            },function(error) {
                    $log.debug('getRankList ',error);
                    Notification.error({message: error, delay: 5000});
                    return (error);
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

        function setActiveTab( activeTab, thecaller ){
            $log.debug('set activetab as:', activeTab, thecaller);
            StudentServices.setActiveTab(activeTab, thecaller);
        }

        function getActiveTab(){
            var atab =  StudentServices.getActiveTab();
            $log.debug('get activetab is:', atab);
            return atab;
        }


    }

})();
