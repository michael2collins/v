const { jQuery: $ } = window;

export class ForgotpwdController {
    constructor($scope,
        $log,
        $routeParams,
        $location,
        flashService,
        userServices,
        $rootScope,
        $q
    ) {
        'ngInject';

        this.$scope = $scope;
        this.$log = $log;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.flashService = flashService;
        this.$rootScope = $rootScope;
        this.userServices = userServices;
        this.$q = $q;

    }

    $onInit() {
        this.username = null;
        this.password = null;
        this.dataLoading = false;
        this.apiKey = {};
        this.userServices.ClearCredentials();
        this.flash = this.$rootScope.flash;

        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });
        $('body').attr('id', 'signin-page');

    }

    $onDestroy() {
        this.$log.log("ForgotpwdController dismissed");
        //this.$log.logEnabled(false);
    }


    forgotpwd() {
        var self = this;
        self.$log.log('controller forgotpwd function entered', self.username);
        var path = '../v1/forgotpassword?username=' + self.username;
        self.dataLoading = true;

        return self.userServices.forgotpassword(path).then(function(data) {
                self.$log.log('UserServices returned data');
                self.$log.log(data);
                if (data.error === true) {
                    self.UserServices.SetCredentials('', '', '','');
                    self.FlashService.Err(data.message,false);
                    self.flash=self.$rootScope.flash;
                    return (self.$q.reject(data));
                }
                
                self.apiKey = data.apiKey;
                alert("Check your email for reset information");

                self.$location.path('/#');
                return data;
            },
            function(error) {
                self.$log.log('Caught an error UserServices, going to notify:', error);
                self.userServices.SetCredentials('', '', '');
                self.flashService.Err(error);
                    self.flash=self.$rootScope.flash;
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.dataLoading = false;
        });

    }
}
