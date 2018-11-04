const { jQuery: $ } = window;

export class ChangepwdController {
    constructor($scope,
        $log,
        $routeParams,
        $location,
        flashService,
        userServices,
        Notification,
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
        this.notification = Notification;

        $log.debug('enter ChangepwdController');
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
        this.oldpassword = null;
        this.re = /^[a-zA-Z]\w{3,14}$/;

        this.isconfirm = null;

        this.dataLoading = false;
        this.apiKey = {};

        self.userdta = this.userServices.getUserDetails();
        $('body').attr('id', 'signup-page');
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });

    }

    $onDestroy() {
        this.$log.debug("ChangepwdController dismissed");
        this.$log.debugEnabled(false);
    }





    compare(repass) {
        var self = this;
        self.$log.debug('compare', repass);
        self.isconfirm = self.password == repass ? true : false;
    }

    changepwd() {
        var self = this;
        self.$log.debug('ChangepwdController register function entered');
        self.dataLoading = true;
        var thedata = {
            username: self.userdta.username,
            confirm_password: self.confirm_password,
            password: self.password,
            oldpassword: self.oldpassword
        };
        var path = '/v1/changepassword';
        self.$log.debug('controller register thedata:', thedata);

        self.dataLoading = true;

        return self.userServices.createUser(path, thedata).then(function(data) {
                self.$log.debug('register returned data');
                self.$log.debug(data);
                //                            alert('Change successful', true);
                self.notification.success({ message: 'Change successful', delay: 5000 });

                self.$location.path('/#');
                return data;
            },
            function(error) {
                self.$log.debug('Caught an error , going to notify:', error);
                self.flashService.Err(error);
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.dataLoading = false;
        });

    }


}
