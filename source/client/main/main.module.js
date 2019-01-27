import angular from 'angular';

import { CoreModule } from '../../js/core/core.module';
import { DirectiveModule } from '../../js/directives/directive.module';

import { UserServices } from '../../js/services/userServices';
import { CalendarServices } from '../../js/services/calendarServices';
import { StudentServices } from '../../js/services/studentServices';
import { ClassServices } from '../../js/services/classServices';
import { AttendanceServices } from '../../js/services/attendanceServices';
import { TestingServices } from '../../js/services/testingServices';
import { EventServices } from '../../js/services/eventServices';
import { TemplateServices } from '../../js/services/templateServices';
import { PaymentServices } from '../../js/services/paymentServices';
import { StatsServices } from '../../js/services/statsServices';
import { CalUtil } from '../../js/utility/calutility';
import { Util } from '../../js/utility/utility';
import { AppController } from './app.controller';
import { portalDataService } from '../portal/portaldata.service';
import maintemplate from './main.html';
import { mainComponent } from './main.component';


export const MainModule = angular
   .module('ngadmin.main', [CoreModule, DirectiveModule])
   .component('mainComponent', mainComponent)
   .controller('AppController', AppController)
   .service('attendanceServices', AttendanceServices)
   .service('testingServices', TestingServices)
   .service('eventServices', EventServices)
   .service('templateServices', TemplateServices)
   .service('paymentServices', PaymentServices)
   .service('statsServices', StatsServices)
   .service('calUtil', CalUtil)
   .service('Util', Util)

   .service('portalDataService', portalDataService)
   .service('userServices', UserServices)
   .service('calendarServices', CalendarServices)
   .service('studentServices', StudentServices)
   .service('classServices', ClassServices)
   .config(mainconfig)
   .name;

function mainconfig($routeProvider) {
   'ngInject';
   $routeProvider
      .when('/main', {
         template: maintemplate
      });
}
