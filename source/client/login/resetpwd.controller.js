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

        this.isconfirm = null;

        this.dataLoading = false;
        this.apiKey = {};
        this.userServices.ClearCredentials();
        $('body').attr('id', 'signin-page');
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });

    }

    $onDestroy() {
        this.$log.log("ResetpwdController dismissed");
        //this.$log.logEnabled(false);
    }




    compare(repass) {
        var self = this;
        self.$log.log('compare', repass);
        self.isconfirm = self.password == repass ? true : false;
    }


    resetpwd() {
        var self = this;
        self.$log.log('controller resetpwd function entered', self.username, self.password);
        self.$log.log('token', self.$routeParams.token);
        self.dataLoading = true;
        var path = encodeURI('../v1/resetpassword?user=' + self.username +
            '&token=' + self.$routeParams.token +
            '&newpassword=' + self.password +
            '&email=' + self.email);

        return self.userServices.resetpassword(path).then(function(data) {
                self.$log.log('UserServices resetpwd returned data');
                self.$log.log(data);
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
                self.$log.log('Caught an error UserServices resetpwd, going to notify:', error);
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
