const { jQuery: $ } = window;

export class PageSignupController {
    constructor($scope,
        $log,
        $routeParams,
        $location,
        flashService,
        userServices,
        StudentServices,
        $rootScope,
        $q
    ) {
        'ngInject';

        this.$scope = $scope;
        this.$log = $log;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.FlashService = flashService;
        this.UserServices = userServices;
        this.StudentServices = StudentServices;
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
        this.flash = this.$rootScope.flash;
        this.StudentList =[];
        this.school= null;

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

        this.UserServices.ClearCredentials();
        this.getStudentLists();
        $('body').attr('id', 'signup-page');
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });
    }

    $onDestroy() {
        this.$log.log("PageSignupController dismissed");
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
    
   getStudentLists() {
      var vm = this;
      var sListPath = '../v1/studentschools';


      return vm.StudentServices.getStudentLists(sListPath).then(function(data) {
         vm.$log.log('controller getStudentLists returned data');
         vm.$log.log(data);
         vm.StudentList = data;

         return vm.StudentList;
      }, function(error) {
         vm.$log.log('getStudentLists ', error);
         vm.Notification.error({ message: error, delay: 5000 });
         return (error);
      });
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
            password: self.password,
            school: self.school
        };
        var path = '/v1/register';
        self.$log.log('controller register thedata:', thedata);

        self.dataLoading = true;

        return self.UserServices.createUser(path, thedata).then(function(data) {
                self.$log.log('register returned data');
                self.$log.log(data);
                if (data.error === true) {
                    self.UserServices.SetCredentials('', '', '','');
                    self.FlashService.Err(data.message,false);
                    self.flash=self.$rootScope.flash;
                    return (self.$q.reject(data));
                }
                
                self.FlashService.Success('Registration successful', true);
                    self.flash=self.$rootScope.flash;
                self.$location.path('/page-signin');
                return data;
            },
            function(error) {
                self.$log.log('Caught an error Registration, going to notify:', error);
                self.FlashService.Err(error);
                    self.flash=self.$rootScope.flash;
                return (self.$q.reject(error));
            }).
        finally(function() {
            self.dataLoading = false;
        });

    }

}
