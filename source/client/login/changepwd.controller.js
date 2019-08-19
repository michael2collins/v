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
        this.userdta = null;

//in case we want to go back        
//        this.re = /^[a-zA-Z]\w{3,14}$/;
//                ng-pattern="vm.re"
/*
RegEx	Description
^	The password string will start this way
(?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
(?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
(?=.*[0-9])	The string must contain at least 1 numeric character
(?=.[!@#\$%\^&])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
(?=.{8,})	The string must be eight characters or longer
*/
        this.strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        this.mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

        this.isconfirm = null;

        this.dataLoading = false;
//        this.apiKey = {};
        this.passwordStrength = {
            "float": "left",
            "width": "100px",
            "height": "25px",
            "margin-left": "5px"
        };

//        this.getUserDetails();
        $('body').attr('id', 'signup-page');
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });

    }

    $onDestroy() {
        this.$log.log("ChangepwdController dismissed");
        //this.$log.logEnabled(false);
    }

    getUserDetails() {
        var vm = this;

        vm.$log.log('ChangepwdController controller getUserDetails entered');
        return vm.UserServices.getUserDetails().then(function(data) {
                vm.$log.log("ChangepwdController controller service getuserdetails returned:", data);
                vm.userdta = data;
                return vm.userdta;
            },

            function(error) {
                vm.$log.log('Caught an error getUserDetails, going to notify:', error);
                vm.userdta = [];
                vm.message = error;
                return (vm.$q.reject(error));
            }).
        finally(function() {});

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
            var temp = document.getElementById("oldpassword"); 
            var temp2 = document.getElementById("newpassword"); 
            var temp3 = document.getElementById("confirm_password"); 
            if (temp.type === "password") { 
                temp.type = "text"; 
                temp2.type = "text"; 
                temp3.type = "text"; 
            } 
            else { 
                temp.type = "password"; 
                temp2.type = "password"; 
                temp3.type = "password"; 
            } 
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
//            username: self.userdta.username,
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
