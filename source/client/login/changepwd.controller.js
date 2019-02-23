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

    }

    $onInit() {
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
        this.$log.log("ChangepwdController dismissed");
        //this.$log.logEnabled(false);
    }





    compare(repass) {
        var self = this;
        self.$log.log('compare', repass);
        self.isconfirm = self.password == repass ? true : false;
    }

    changepwd() {
        var self = this;
        self.$log.log('ChangepwdController register function entered');
        self.dataLoading = true;
        var thedata = {
            username: self.userdta.username,
            confirm_password: self.confirm_password,
            password: self.password,
            oldpassword: self.oldpassword
        };
        var path = '/v1/changepassword';
        self.$log.log('controller register thedata:', thedata);

        self.dataLoading = true;

        return self.userServices.createUser(path, thedata).then(function(data) {
                self.$log.log('register returned data');
                self.$log.log(data);
                //                            alert('Change successful', true);
                self.notification.success({ message: 'Change successful', delay: 5000 });

                self.$location.path('/#');
                return data;
            },
            function(error) {
                self.$log.log('Caught an error , going to notify:', error);
                self.flashService.Err(error);
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.dataLoading = false;
        });

    }


}
