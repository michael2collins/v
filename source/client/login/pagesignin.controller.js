const { jQuery: $ } = window;

export class PageSigninController {
    constructor($scope,
        $log,
        $routeParams,
        $location,
        flashService,
        userServices,
        //        attendanceServices, 
        calendarServices,
        //        eventServices, 
        studentServices,
        //        paymentServices, 
        classServices,
        //        testingServices, 
        //        TemplateServices, 
   //deprecated     $cookieStore,
        $q
    ) {
        'ngInject';
        /* jshint validthis: true */
        this.$scope = $scope;
        this.$log = $log;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.FlashService = flashService;
        this.UserServices = userServices;
        //        this.AttendanceServices = attendanceServices;
        this.CalendarServices = calendarServices;
        //        this.EventServices = eventServices;
        this.StudentServices = studentServices;
        //        this.PaymentServices = paymentServices;
        this.ClassServices = classServices;
        //        this.TestingServices = testingServices;
        //        this.TemplateServices = TemplateServices;
       // this.$cookieStore = $cookieStore;
        this.$q = $q;

        $log.debug('enter PageSigninController');
        $log.debug('username', this.username);
        //        (function initController() {
        // reset login status
        //        this.UserServices.ClearCredentials();
        //      })();

    }
    //      $log.debug('password', this.password);


    //            $("body>.default-page").hide();
    //            $("body>.extra-page").html($(".page-content").html()).show();
    $onInit() {
        console.log("initializing Login...");
        this.username = null;
        this.password = null;
        this.dataLoading = false;
        this.apiKey = {};
        this.UserServices.ClearCredentials();
        $('body').attr('id', 'signin-page');
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });

    }

    $onDestroy() {
        this.$log.debug("main dismissed");
        this.$log.debugEnabled(false);
    }


    login() {
        var self = this;
        self.$log.debug('controller login function entered', self.username, self.password);

        self.dataLoading = true;

        return self.UserServices.Login(self.username, self.password).then(function(data) {
                //    this.$log.debug('UserServices login returned data');
                //    this.$log.debug(data, data.error);
                if (data.error === true) {
                    //       self.$log.debug('UserServices error returned', data.error);
                    self.UserServices.SetCredentials('', '', '');
                    //                    self.AttendanceServices.setapikey('');
                    //self.CalendarServices.setapikey('');
                    //                    self.EventServices.setapikey('');
                    //self.StudentServices.setapikey('');
                    //                    self.PaymentServices.setapikey('');
                    //self.ClassServices.setapikey('');
                    //self.UserServices.setapikey('');
                    //                    self.TestingServices.setapikey('');
                    //                    self.TemplateServices.setapikey('');
                    self.FlashService.Err(data.message);
                    return (self.$q.reject(data));
                }
                self.apiKey = data.apiKey;
                //                self.apiKey = data.apiKey;
                self.UserServices.SetCredentials(self.username, self.password, self.apiKey);

                //               self.AttendanceServices.setapikey(self.apiKey);
                //self.CalendarServices.setapikey(self.apiKey);
                //               self.EventServices.setapikey(self.apiKey);
                //self.StudentServices.setapikey(self.apiKey);
                //               self.PaymentServices.setapikey(self.apiKey);
                //self.ClassServices.setapikey(self.apiKey);
                //self.UserServices.setapikey(self.apiKey);
                //               self.TestingServices.setapikey(self.apiKey);
                //               self.TemplateServices.setapikey(self.apiKey);

                $("body>portal-component>div.default-page").show();
                $("body>.extra-page").html($(".page-content").html()).hide();
                $('body').attr('id', '');
                $('#page-wrapper').css({ 'background-color': '' });
                $('#wrapper').css({ 'background': '' });

                self.$location.path('/main');
                return data;
            },
            function(error) {
                self.$log.debug('Caught an error UserServices, going to notify:', error);
                //    vm.message = error;
                //    Notification.error({message: error, delay: 5000});
                self.UserServices.SetCredentials('', '', '');
                //              self.AttendanceServices.setapikey('');
                //self.CalendarServices.setapikey('');
                //                self.EventServices.setapikey('');
                //self.StudentServices.setapikey('');
                //                self.PaymentServices.setapikey('');
                //self.ClassServices.setapikey('');
                self.UserServices.setapikey('');
                //                self.TestingServices.setapikey('');
                //                self.TemplateServices.setapikey('');
                self.FlashService.Err(error);
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.dataLoading = false;
        });

    }
}
