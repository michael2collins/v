const { jQuery: $ } = window;

export class ResetpwdController {
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
        this.userServices = userServices;
        this.$rootScope = $rootScope;
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
//        this.re = /^[a-zA-Z]\w{3,14}$/;
        this.strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        this.mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
        this.flash = this.$rootScope.flash;

        this.passwordStrength = {
            "float": "left",
            "width": "100px",
            "height": "25px",
            "margin-left": "5px"
        };

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


    analyze(value) {
        var vm=this;
        if(vm.strongRegex.test(value)) {
            vm.passwordStrength["background-color"] = "green";
        } else if(vm.mediumRegex.test(value)) {
            vm.passwordStrength["background-color"] = "orange";
        } else {
            vm.passwordStrength["background-color"] = "red";
        }
    }

     toggle() { 
            var temp2 = document.getElementById("newpassword"); 
            var temp3 = document.getElementById("confirm_password"); 
            if (temp2.type === "password") { 
                temp2.type = "text"; 
                temp3.type = "text"; 
            } 
            else { 
                temp2.type = "password"; 
                temp3.type = "password"; 
            } 
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
                if (data.error === true) {
                    self.UserServices.SetCredentials('', '', '','');
                    self.FlashService.Err(data.message,false);
                    self.flash=self.$rootScope.flash;
                    return (self.$q.reject(data));
                }
                
                self.apiKey = data.api_Key;
                self.userServices.ResetCredentials(data.username, data.api_key);
                $("body>.default-page").show();
                $("body>.extra-page").html($(".page-content").html()).hide();
                $('body').attr('id', '');
                self.flashService.Success("Password reset complete",false);
                    self.flash=self.$rootScope.flash;

                self.$location.path('/#');
                return data;
            },
            function(error) {
                self.$log.log('Caught an error UserServices resetpwd, going to notify:', error);
                self.userServices.SetCredentials('', '', '');
                self.userServices.setapikey('');
                self.flashService.Err(error,false);
                    self.flash=self.$rootScope.flash;
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.dataLoading = false;
        });

    }
}
