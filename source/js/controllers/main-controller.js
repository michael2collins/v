(function(window, angular, $) {
    'use strict';

    angular
        .module('ng-admin.all')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope',
        'UserServices',
        'CalendarServices',
        'StudentServices',
        'ClassServices',
        'Notification',
        '$uibModal',
        'uiGridConstants',
        '$q',
        '$log',
        '$interval',
        '$timeout',
        'Idle',
        'Title',
        '$location',
        '$cookies',
        '$window'
    ];


    function MainController($scope,
        UserServices,
        CalendarServices,
        StudentServices,
        ClassServices,
        Notification,
        $uibModal,
        uiGridConstants,
        $q,
        $log,
        $interval,
        $timeout,
        Idle,
        Title,
        $location,
        $cookies,
        $window
    ) {
        var vm = this;
        vm.loadTopbar = loadTopbar;
        vm.loadSidebar = loadSidebar;
        vm.loadPageHeader = loadPageHeader;
        vm.clearNewStudents = clearNewStudents;
        vm.clearTestStudents = clearTestStudents;
        vm.clearOverdueStudents = clearOverdueStudents;
        vm.clearNoshowStudents = clearNoshowStudents;
        vm.getEmailCount = getEmailCount;
        vm.newEmail = newEmail;
        vm.openEmail = openEmail;
        vm.isokf = isokf;
        vm.userdta = {};
        vm.myuser;
        vm.message;
        vm.data;
        vm.thisTasknamelist = [];
        vm.alertcount;
        vm.newstudents= [];
        vm.teststudents= [];
        vm.overduestudents= [];
        vm.noshowstudents= [];
        vm.emailcount='';
          vm.userOptions = {};
          vm.okNotify;
          vm.mydelay;
        vm.showTimeout = showTimeout;  
          vm.showTimeoutv=false;

//        vm.setInterval = setInterval;
//        function setInterval(){
//            CalendarServices.setIntervalValue(vm.mydelay *1000);
//        }
        vm.openSettings = openSettings;
        vm.origtitle='V Dojo';
        Title.store(vm.origtitle);
        Title.idleMessage(vm.origtitle);

        $scope.$on('IdleStart', function() {
            $log.debug('IdleStart');
            Title.original();
            $scope.$apply();
        });
        $scope.$on('IdleEnd', function() {
            $log.debug('IdleEnd');
            Title.restore();
            vm.showTimeoutv=false;
            $scope.$apply();
        });
        $scope.$on('IdleWarn', function(e, countdown) {
            $log.debug('IdleWarn',countdown);
            $scope.remaining = { totalSeconds: countdown };
            $scope.remaining.minutes = Math.floor(countdown/60);
            $scope.remaining.seconds = padLeft(countdown - $scope.remaining.minutes * 60, 2);            
            $scope.minutes = $scope.remaining.minutes;
            $scope.seconds = $scope.remaining.seconds;
            Title.setAsIdle(countdown);            
            Title.idleMessage('Timeout in {{minutes}}:{{seconds}} ');
            Title.timedOutMessage("Whoops you've pretimedout");
            vm.showTimeoutv=true;
            $scope.$apply();
        });
        $scope.$on('IdleTimeout', function() {
            $log.debug('IdleTimeout');
            Title.setAsTimedOut();
            //give login 60 seconds
            Idle.setIdle(30);
            Idle.setTimeout(30);
            vm.showTimeoutv=false;
            UserServices.ClearCredentials();
            $scope.$apply();

            $location.path('/page-lock-screen');
        });
        $scope.$on('Keepalive', function() {
            $log.debug('Keepalive');
        });


        $scope.$on('$destroy', function iVeBeenDismissed() {
            $log.debug("main dismissed");
            $log.debugEnabled(false);
        });

        $scope.$on('$routeChangeSuccess', function(event, current, previous) {
            $log.debugEnabled(true);
            $log.debug('routechange in main for success');
            vm.data = $.fn.Data.get(current.originalPath);
            if (vm.isok) {
            //do first right away then check at interval 
                getUserOptions();
                getUserDetails();
                getEmailCount();
            }
            
            intervalChecker();
        });
            

        $.fn.Data.Portlet('main-controller.js');
        
        function padLeft(nr, n, str){
          return new Array(n-String(nr).length+1).join(str||'0')+nr;
        }
        function showTimeout() {
            return vm.showTimeoutv;
        }
        function intervalChecker() {
            $log.debug('main controller intervalChecker entered' );
            var thedelay = CalendarServices.getIntervalValue();
            islogin();
            $timeout(intervalChecker,thedelay * 1000);
/*            $interval(function() {
                $log.debug('mainc interval entered');
                thedelay = CalendarServices.getIntervalValue();
            }, thedelay);
*/            
        }

    //todo: move this to a common class    
    function getUserOptions() {
      $log.debug('getUserOptions entered');
      var path = "../v1/useroptions";
      return UserServices.getUserOptions(path).then(function(data) {
          $log.debug("main controller service getUserOptions returned:", data);
          if ((typeof data.options === 'undefined' || data.options.error === true) &&
            typeof data !== 'undefined') {
            var themsg = {
              message: data.message + ': ' +
                (typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
              delay: 5000
            };
            Notification.error(themsg);
            return($q.reject(data));
          }
          else {
            try {
              vm.userOptions = JSON.parse(data.options);
              vm.okNotify = (vm.userOptions.notify ? vm.userOptions.notify : false);
              vm.mydelay = (vm.userOptions.delay ? vm.userOptions.delay : 30);
              $scope.idle = (vm.userOptions.idle ? vm.userOptions.idle : 5);
              $scope.timeout = (vm.userOptions.timeout ? vm.userOptions.timeout : 5);
              Title.setAsIdle($scope.idle);
              Idle.setIdle($scope.idle);
              Idle.setTimeout($scope.timeout);

              Idle.watch();
              
              CalendarServices.setIntervalValue(vm.mydelay);
              CalendarServices.setOkNotify(vm.okNotify);
              //Notification.success({message: vm.message, delay: 5000});
            }
            catch (e) {
              $log.debug(e instanceof SyntaxError); // true
              $log.debug(e.message); // "missing ; before statement"
              $log.debug(e.name); // "SyntaxError"
              $log.debug(e.fileName); // "Scratchpad/1"
              $log.debug(e.lineNumber); // 1
              $log.debug(e.columnNumber); // 4
              $log.debug(e.stack); // "@Scratchpad/1:2:3\n"
              Notification.error(e.message);
              return($q.reject(data));
            }

          }

          return vm.userOptions;
        },

        function(error) {
          $log.debug('Caught an error getUserOptions, going to notify:', error);
          vm.userOptions = [];
          vm.message = error;
          Notification.error({ message: error, delay: 5000 });
          return ($q.reject(error));
        }).
      finally(function() {});

    }
        
        function openSettings() {
            var thisModal = vm;
 
            thisModal.animationsEnabled = true;

            thisModal.modalInstance = undefined;
            thisModal.retvlu = '';

            thisModal.modalInstance = $uibModal.open({
                animation: thisModal.animationsEnabled,
                templateUrl: 'templates/states/user-settings.html',
                controller: 'ModalUserSettingsInstanceController as vm',
                size: 'md',
                windowClass: 'my-modal-popup',
                resolve: {
                    classname: function() {
                        $log.debug('return from open');
                        return thisModal.retvlu;
                    }
                    
                }
            });
            thisModal.modalInstance.result.then(function(retvlu) {
                $log.debug('search modalInstance result :', retvlu);
                thisModal.retvlu = retvlu;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });

        }

        function newEmail() {
            var emailModal = vm;

            emailModal.animationsEnabled = true;

            emailModal.modalInstance = undefined;
            emailModal.retvlu = '';

            emailModal.modalInstance = $uibModal.open({
                animation: emailModal.animationsEnabled,
                templateUrl: 'templates/states/email.html',
                controller: 'ModalEmailInstanceController as vm',
                size: 'md',
                scope: $scope,
                windowClass: 'my-modal-popup',
                resolve: {
                    myinitial: function() {return {} },
                    contactform: function () {
                        return $scope.contactform;
                    }
                }
            });
            emailModal.modalInstance.result.then(function(retvlu) {
                $log.debug('search modalInstance result :', retvlu);
                emailModal.retvlu = retvlu;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });

        }
        function openEmail() {
            var emailModal = vm;
 
            emailModal.animationsEnabled = true;

            emailModal.modalInstance = undefined;
            emailModal.retvlu = '';

            emailModal.modalInstance = $uibModal.open({
                animation: emailModal.animationsEnabled,
                templateUrl: 'templates/states/emaillist.html',
                controller: 'ModalEmailListInstanceController as vm',
                size: 'lg',
                windowClass: 'my-modal-popup',
                resolve: {
                    classname: function() {
                        $log.debug('return from open');
                        return emailModal.retvlu;
                    }
                    
                }
            });
            emailModal.modalInstance.result.then(function(retvlu) {
                $log.debug('search modalInstance result :', retvlu);
                emailModal.retvlu = retvlu;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });

        }

        function islogin() {

            $log.debug('islogin main controller');
            vm.isok = UserServices.isapikey();
            vm.userdta={};

            if (vm.isok) {
                $log.debug('setting apikey for services in main controller');
                var thekey = UserServices.getapikey();
                CalendarServices.setapikey(thekey);
                StudentServices.setapikey(thekey);
                UserServices.setapikey(thekey);

                $q.all([
                        gettheTasknamelist().then(function() {
                            $log.debug('gettheTasknamelist returned');
                        }),
                        getEmailCount().then(function() {
                            $log.debug('getEmailCount returned');
                        }),
                        getTNotifications().then(function() {
                            $log.debug('getNotifications returned');
                        })
                    ])
                    .then(function() {
                        $log.debug('getAll stats done returned');
                        setAlertCount();
                    });

            }

        }

        function setAlertCount() {
            vm.alertcount = vm.teststudents.length + 
                vm.newstudents.length + 
                vm.overduestudents.overdue.length + 
                vm.noshowstudents.noshow.length + 
                vm.thisTasknamelist.length;
            
        }
        function clearNewStudents() {
            $log.debug("clearNewStudents entered");
            for(var i=0; i < vm.newstudents.length; i++) {
                removeNotification(vm.newstudents[i].id);
            }
        }
        function clearTestStudents() {
            $log.debug("clearTestStudents entered");
            for(var i=0; i < vm.teststudents.length; i++) {
                removeNotification(vm.teststudents[i].id);
            }
        }
        function clearOverdueStudents() {
            $log.debug("clearOverdueStudents entered");
        }
        function clearNoshowStudents() {
            $log.debug("clearNoshowStudents entered");
        }
        function gettheTasknamelist() {
            $log.debug('gettheTasknamelist entered');
            var refreshpath = "../v1/tasknamelist";

            return CalendarServices.gettasknamelist(refreshpath).then(function(data) {
                    $log.debug('gettasknamelists returned data');
                    $log.debug(data);
                    vm.thisTasknamelist = data.tasknamelist;
                    return vm.thisTasknamelist;
                },
                function(error) {
                    $log.debug('Caught an error gettheTasknamelist, going to notify:', error);
                    vm.thisTasknamelist = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {
                vm.loading = false;
                vm.loadAttempted = true;
            });

        }
        
        function getUserDetails() {
            $log.debug('getUserDetails entered');
            return UserServices.getUserDetails().then(function(data) {
                    $log.debug("main controller service getuserdetails returned:", data);
                    islogin();
                    vm.userdta = data;
                    vm.myuser = data.userid;
                    
                    return vm.userdta;
                },

                function(error) {
                    $log.debug('Caught an error getUserDetails, going to notify:', error);
                    vm.userdta = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {});

        }
        function getTNotifications() {
            $log.debug('getNotifications entered');
            var path = "../v1/notification";
            return StudentServices.getNotifications(path).then(function(data) {
                    $log.debug("service getNotifications returned:", data);
                if (typeof(data.NotificationList) !== 'undefined' && data.error === false) {
                    $log.debug('NotificationList', data.NotificationList);
                    vm.newstudents = [];
                    vm.teststudents = [];
                    for (var i=0;i < data.NotificationList.length; i++){
                        var newstu = {}, teststu ={};
                        if (data.NotificationList[i].type === "newstudent") {
                             newstu = {
                                id: data.NotificationList[i].id,
                                type: data.NotificationList[i].type,
                                notifkey: data.NotificationList[i].notifkey,
                                value: data.NotificationList[i].value,
                                firstname: data.NotificationList[i].firstname,
                                lastname: data.NotificationList[i].lastname,
                                contactid: data.NotificationList[i].contactid
                            };
                            vm.newstudents.push(newstu);
                        }
                        if (data.NotificationList[i].type === "readytotest") {
                             teststu = {
                                id: data.NotificationList[i].id,
                                type: data.NotificationList[i].type,
                                notifkey: data.NotificationList[i].notifkey,
                                value: data.NotificationList[i].value,
                                firstname: data.NotificationList[i].firstname,
                                lastname: data.NotificationList[i].lastname,
                                contactid: data.NotificationList[i].contactid
                            };
                            vm.teststudents.push(teststu);
                        }
                    }
    /*        vm.newstudents= { "new": 
                [                 
                    { "id": 1, "firstname": "first1", "lastname": "last1" },
                    { "id": 2, "firstname": "first2", "lastname": "last2" }
                ]
            };
            vm.teststudents= { "test": 
                [                 
                    { "id": 1, "firstname": "first1", "lastname": "last1" },
                    { "id": 2, "firstname": "first2", "lastname": "last2" }
                ]
            };
      */
                } else {
                    if (typeof(data) !== 'undefined') {
                        Notification.error({message: typeof(data.message) !== 'undefined' ? data.message : 'error NotificationList', delay: 5000});
                    } //else ok to have no ranklist
                }
              vm.overduestudents= { "overdue": 
                [                 
                    { "id": 1, "firstname": "first1", "lastname": "last1" },
                    { "id": 2, "firstname": "first2", "lastname": "last2" }
                ]
            };
            vm.noshowstudents= { "noshow": 
                [                 
                    { "id": 1, "firstname": "first1", "lastname": "last1" },
                    { "id": 2, "firstname": "first2", "lastname": "last2" }
                ]
            };
                    setAlertCount();

                    return;
                },

                function(error) {
                    $log.debug('Caught an error getNotifications, going to notify:', error);
                    vm.notifications = [];
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {});

        }

        function getEmailCount() {
            $log.debug('getEmailCount entered');
            var path='../v1/emailcount';

            return StudentServices.getEmailcount(path).then(function(data){
                    $log.debug('getEmailCount returned data');
                    $log.debug(data);
                    if ((typeof vm.emailcount === 'undefined' || vm.emailcount.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        return($q.reject(data));
                    } else {
                    //    Notification.success({message: vm.message, delay: 5000});
                        vm.emailcount = ( data.emailcount[0].count > 0 ? data.emailcount[0].count : '' ); 
                    }


                }, function(error) {
                    $log.debug('Caught an error getEmailLists:', error); 
                    vm.emailcount = '';
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        
        function removeNotification(id) {
            $log.debug('removeNotification entered');
            var thedata = {
                id: id
            };
            return StudentServices.removeNotification(thedata).then(function(data) {
                    $log.debug("service removeNotification returned:", data);
                    getTNotifications();

                    return;
                },

                function(error) {
                    $log.debug('Caught an error removeNotification, going to notify:', error);
                    vm.message = error;
                    Notification.error({ message: error, delay: 5000 });
                    return ($q.reject(error));
                }).
            finally(function() {});

        }

        function isokf() {
            //        $log.debug('isokf');
            vm.isok = UserServices.isapikey();
            return vm.isok;
        }

        function loadPageHeader() {
            $log.debug("loadPageHeader entered");
        }

        function loadTopbar() {
            $log.debug("loadTopbar");
            $("[data-toggle='offcanvas']").on('click', function() {
                $('#sidebar-wrapper').toggleClass('active');
                return false;
            });
            // Setting toggle in mobile view 
            $('#setting-toggle').click(function() {
                $log.debug('mobile toggle');
                $('.topbar-main').toggle();
            });
        }

        function loadSidebar() {
            $log.debug('loadSidebar');
            //BEGIN SIDEBAR FIXED
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                height: $(window).height() - 100,
                width: '250px',
                size: '10px',
                railVisible: true,
                alwaysVisible: true,
                color: 'gray',
                railColor: 'gray',
                wheelStep: 5
            }); 
            $(window).scroll(function() {
                if ($(this).scrollTop() > 50) {
                    if ($('body').hasClass('topbar-fixed')) {}
                    else {
                        $('.sidebar-fixed #sidebar-wrapper').css('top', '0px');
                    }
                }
                else {
                    if ($('body').hasClass('topbar-fixed')) {}
                    else {
                        $('.sidebar-fixed #sidebar-wrapper').css('top', '50px');
                    }
                }
            });
            //END SIDEBAR FIXED

            $('#menu-toggle').toggle(
                function() {
                    $log.debug('menu-toggle');
                    if ($('#wrapper').hasClass('right-sidebar')) {
                        $('body').addClass('right-side-collapsed');
                        $('.navbar-header').addClass('logo-collapsed');
                    }
                    else {
                        $(this).find('i').removeClass('icon-arrow-left').addClass('icon-arrow-right');
                        $('body').addClass('left-side-collapsed');
                        $('.navbar-header').addClass('logo-collapsed');
                        $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({ destroy: true });
                        $('#sidebar').css('height', 'auto');
                        $('#sidebar').css('width', '55px');
                        $('#sidebar').css('overflow', 'initial');
                        $('#sidebar .menu-scroll').css('overflow', 'initial');
                        $('body').removeClass('sidebar-fixed');
                    }
                },
                function() {
                    if ($('#wrapper').hasClass('right-sidebar')) {
                        $('body').removeClass('right-side-collapsed');
                        $('.navbar-header').removeClass('logo-collapsed');
                    }
                    else {
                        $(this).find('i').removeClass('icon-arrow-right').addClass('icon-arrow-left');
                        $('body').removeClass('left-side-collapsed');
                        $('.navbar-header').removeClass('logo-collapsed');
                        $('body').addClass('sidebar-fixed');
                        $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                            "height": $(window).height() - 50,
                            'width': '250px',
                            'wheelStep': 5
                        });
                        $('#sidebar .menu-scroll').css('overflow', 'hidden');
                    }
                }
            );

            if ($('#wrapper').hasClass('right-sidebar')) {
                $('ul#side-menu li').hover(function() {
                    if ($('body').hasClass('right-side-collapsed')) {
                        $(this).addClass('nav-hover');
                    }
                }, function() {
                    if ($('body').hasClass('right-side-collapsed')) {
                        $(this).removeClass('nav-hover');
                    }
                });
            }
            else {
                $('ul#side-menu li').hover(function() {
                    if ($('body').hasClass('left-side-collapsed')) {
                        $(this).addClass('nav-hover');
                    }
                }, function() {
                    if ($('body').hasClass('left-side-collapsed')) {
                        $(this).removeClass('nav-hover');
                    }
                });
            }


        }

    }


})(window, window.angular, window.$);
