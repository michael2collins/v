const { jQuery: $ } = window;

export class ForgotpwdController {
    constructor($scope,
        $log,
        $routeParams,
        $location,
        flashService,
        userServices,
        $q
    ) {
        'ngInject';

        this.$scope = $scope;
        this.$log = $log;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.FlashService = flashService;
        this.UserServices = userServices;
        this.$q = $q;

        $log.debug('enter ForgotpwdController');
    }

    $onInit() {
        console.log("initializing Login...");
        this.username = null;
        this.password = null;
        this.dataLoading = false;
        this.apiKey = {};
        this.UserServices.ClearCredentials();
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });
        $('body').attr('id', 'signin-page');

    }

    $onDestroy() {
        this.$log.debug("ForgotpwdController dismissed");
        this.$log.debugEnabled(false);
    }


    forgotpwd() {
        var self = this;
        self.$log.debug('controller forgotpwd function entered', self.username);
        var path = '../v1/forgotpassword?username=' + self.username;
        self.dataLoading = true;

        return self.userServices.forgotpassword(path).then(function(data) {
                self.$log.debug('UserServices returned data');
                self.$log.debug(data);
                self.apiKey = data.apiKey;
                alert("Check your email for reset information");

                self.$location.path('/#');
                return data;
            },
            function(error) {
                self.$log.debug('Caught an error UserServices, going to notify:', error);
                self.UserServices.SetCredentials('', '', '');
                self.flashService.Err(error);
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.dataLoading = false;
        });

    }
}
