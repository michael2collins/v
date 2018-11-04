const { jQuery: $ } = window;

export class ResetpwdController {
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
        this.flashService = flashService;
        this.userServices = userServices;
        this.$q = $q;

        $log.debug('enter ResetpwdController');
    }

    $onInit() {
        console.log("initializing Login...");
        this.username = null;
        this.password = null;
        this.firstname = null;
        this.lastname = null;
        this.email = null;
        this.isconfirm = null;
        this.confirm_password = null;
        this.re = /^[a-zA-Z]\w{3,14}$/;

        this.isconfirm = null;

        this.dataLoading = false;
        this.apiKey = {};
        this.userServices.ClearCredentials();
        $('body').attr('id', 'signin-page');
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });

    }

    $onDestroy() {
        this.$log.debug("ResetpwdController dismissed");
        this.$log.debugEnabled(false);
    }




    compare(repass) {
        var self = this;
        self.$log.debug('compare', repass);
        self.isconfirm = self.password == repass ? true : false;
    }


    resetpwd() {
        var self = this;
        self.$log.debug('controller resetpwd function entered', self.username, self.password);
        self.$log.debug('token', self.$routeParams.token);
        self.dataLoading = true;
        var path = encodeURI('../v1/resetpassword?user=' + self.username +
            '&token=' + self.$routeParams.token +
            '&newpassword=' + self.password +
            '&email=' + self.email);

        return self.userServices.resetpassword(path).then(function(data) {
                self.$log.debug('UserServices resetpwd returned data');
                self.$log.debug(data);
                self.apiKey = data.api_Key;
                self.userServices.ResetCredentials(data.username, data.api_key);
                self.$("body>.default-page").show();
                self.$("body>.extra-page").html($(".page-content").html()).hide();
                self.$('body').attr('id', '');
                self.flashService.Success("Password reset complete");

                self.$location.path('/#');
                return data;
            },
            function(error) {
                self.$log.debug('Caught an error UserServices resetpwd, going to notify:', error);
                self.userServices.SetCredentials('', '', '');
                self.userServices.setapikey('');
                self.flashService.Err(error);
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.dataLoading = false;
        });

    }
}
