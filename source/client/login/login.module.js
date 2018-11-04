import angular from 'angular';
import { loginComponent } from './login.component'; 
import { logoutComponent } from './logout.component'; 
import { changepwdComponent } from './changepwd.component'; 
import { forgotpwdComponent } from './forgotpwd.component'; 
import { pagesignupComponent } from './pagesignup.component'; 
import { resetpwdComponent } from './resetpwd.component'; 

import { UserServices } from '../../js/services/userServices';
import { CalendarServices } from '../../js/services/calendarServices';
import { StudentServices } from '../../js/services/studentServices';
import { ClassServices } from '../../js/services/classServices';
import { FlashService } from '../../js/services/flashServices';

import { PageSigninController } from './pagesignin.controller';
import { PageLockScreenController } from './page-lock-screen.controller';
import { ChangepwdController } from './changepwd.controller';
import { PageSignupController } from './pagesignup.controller';
import { ResetpwdController } from './resetpwd.controller';
import { ForgotpwdController } from './forgotpwd.controller';

import signintemplate from './page-signin.html';
import locktemplate from './page-lock-screen.html';
import changepwdtemplate from './change-pwd.html';
import forgotpwdtemplate from './forgot-pwd.html';
import pagesignuptemplate from './page-signup.html';
import resetpwdtemplate from './reset-pwd.html';


import { CoreModule } from '../../js/core/core.module';


export const LoginModule =  angular
    .module('ngadmin.login', [CoreModule])
    .component('loginComponent',loginComponent)
    .component('logoutComponent',logoutComponent)
    .component('changepwdComponent',changepwdComponent)
    .component('forgotpwdComponent',forgotpwdComponent)
    .component('pagesignupComponent',pagesignupComponent)
    .component('resetpwdComponent',resetpwdComponent)
    .controller('PageSigninController', PageSigninController)
    .controller('PageLockScreenController', PageLockScreenController)
    .controller('ChangepwdController', ChangepwdController)
    .controller('PageSignupController', PageSignupController)
    .controller('ResetpwdController', ResetpwdController)
    .controller('ForgotpwdController', ForgotpwdController)
    .service('calendarServices', CalendarServices)
    .service('studentServices', StudentServices)
    .service('flashService', FlashService)
    .service('classServices', ClassServices)
    .service('userServices', UserServices)
   .config(loginconfig)
   .name;

 
function loginconfig($routeProvider) {
    'ngInject';
    $routeProvider
            .when('/page-signin', {
                template: signintemplate
            })
            .when('/page-signup', {
                template: pagesignuptemplate
            })
            .when('/change-pwd', {
                template: changepwdtemplate
            })
            .when('/reset-pwd', {
                template: resetpwdtemplate
            })
            .when('/forgot-pwd', {
                template: forgotpwdtemplate
            })
            .when('/page-lock-screen', {
                template: locktemplate
            })
            .otherwise({
                redirectTo: '/page-signin'
                //           redirectTo: '/'
            });
}