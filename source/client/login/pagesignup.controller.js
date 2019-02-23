const { jQuery: $ } = window;

export class PageSignupController {
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

    }

    $onInit() {
        this.username = null;
        this.password = null;
        this.firstname = null;
        this.lastname = null;
        this.email = null;
        this.isconfirm = null;
        this.confirm_password = null;
        this.re = /^[a-zA-Z]\w{3,14}$/;

        this.dataLoading = false;
        this.apiKey = {};
        this.UserServices.ClearCredentials();
        $('body').attr('id', 'signup-page');
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });
    }

    $onDestroy() {
        this.$log.log("PageSignupController dismissed");
        //this.$log.logEnabled(false);
    }

    compare(repass) {
        var self = this;
        self.$log.log('compare', repass);
        self.isconfirm = self.password == repass ? true : false;
    }

    register() {
        var self = this;
        self.$log.log('controller register function entered');
        self.dataLoading = true;
        var thedata = {
            username: self.username,
            confirm_password: self.confirm_password,
            firstname: self.firstname,
            lastname: self.lastname,
            email: self.email,
            password: self.password
        };
        var path = '/v1/register';
        self.$log.log('controller register thedata:', thedata);

        self.dataLoading = true;

        return self.UserServices.createUser(path, thedata).then(function(data) {
                self.$log.log('register returned data');
                self.$log.log(data);
                self.FlashService.Success('Registration successful', true);
                self.$location.path('/page-signin');
                return data;
            },
            function(error) {
                self.$log.log('Caught an error Registration, going to notify:', error);
                self.FlashService.Err(error);
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.dataLoading = false;
        });

    }

}
