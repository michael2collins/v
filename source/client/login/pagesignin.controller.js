const { jQuery: $ } = window;

export class PageSigninController {
    constructor($scope,
        $log,
        $routeParams,
        $location,
        flashService,
        userServices,
        calendarServices,
        studentServices,
        classServices,
        $rootScope,
        $q
    ) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.$rootScope=$rootScope;
        this.FlashService = flashService;
        this.UserServices = userServices;
        this.CalendarServices = calendarServices;
        this.StudentServices = studentServices;
        this.ClassServices = classServices;
        this.$q = $q;

    }
    $onInit() {
        this.username = null;
        this.password = null;
        this.dataLoading = false;
        this.apiKey = {};
        this.UserServices.ClearCredentials();
        this.flash = this.$rootScope.flash;
        $('body').attr('id', 'signin-page');
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });

    }

    $onDestroy() {
        this.$log.log("main dismissed");
    }


    login() {
        var self = this;
        self.$log.log('controller login function entered', self.username, self.password);

        self.dataLoading = true;

        return self.UserServices.Login(self.username, self.password).then(function(data) {
                if (data.error === true) {
                    self.UserServices.SetCredentials('', '', '','');
                    self.FlashService.Err(data.message,false);
                    self.flash=self.$rootScope.flash;
                    return (self.$q.reject(data));
                }
                self.apiKey = data.apiKey;
                self.UserServices.SetCredentials(self.username, self.password, self.apiKey, data.role);
        var location = data.role == 'admin' 
                || data.role == 'operator'  ? '/main' : '/userpay';

                $("body>portal-component>div.default-page").show();
                $("body>.extra-page").html($(".page-content").html()).hide();
                $('body').attr('id', '');
                $('#page-wrapper').css({ 'background-color': '' });
                $('#wrapper').css({ 'background': '' });

                self.$location.path(location);
                return data;
            },
            function(error) {
                if (self.$log.getInstance(self.UserServices.isDebugEnabled()) !== undefined ) {
                    self.$log = self.$log.getInstance('PageSigninController',self.UserServices.isDebugEnabled());
                }
                
                self.$log.log('Caught an error UserServices, going to notify:', error);
                self.UserServices.SetCredentials('', '', '', '');
                self.UserServices.setapikey('');
                self.FlashService.Err(error,false);
                self.flash=self.$rootScope.flash;
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.dataLoading = false;
        });

    }
}
