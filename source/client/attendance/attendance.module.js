import angular from 'angular';

import { DirectiveModule } from '../../js/directives/directive.module';
import { CoreModule } from '../../js/core/core.module';
import { CommonModule } from '../common/common.module';

import { AttendanceServices } from '../../js/services/attendanceServices';
import { Util } from '../../js/utility/utility';

import { AttendanceTableBasicController } from './attendance.controller';
import { attendanceComponent,main,childComponent,attendanceCard,attendanceCardlist } from './attendance.component';
import attendancetemplate from './attendance.html';

import { ChildController } from './child.controller';
import { MaincController } from './mainc.controller';
import { CardController } from './card.controller';
import { CardlistController } from './cardlist.controller';


export const AttendanceModule = angular
   .module('ngadmin.attendance', [DirectiveModule,CoreModule,CommonModule])
   .service('AttendanceServices', AttendanceServices)
   .service('Util', Util)
   .controller('AttendanceTableBasicController', AttendanceTableBasicController)
   .controller('MaincController',MaincController)
   .controller('ChildController',ChildController)
   .controller('CardController',CardController)
   .controller('CardlistController',CardlistController)
   .component('attendanceComponent', attendanceComponent)
   .component('main', main)
   .component('childComponent', childComponent)
   .component('attendanceCard', attendanceCard)
   .component('attendanceCardlist', attendanceCardlist)
   .config(attendconfig)
   .name;


function attendconfig($routeProvider) {
   'ngInject';
   $routeProvider
      .when('/table-basic-attendance', {
         template: attendancetemplate
      })

      .otherwise({
         redirectTo: '/page-signin'
         //           redirectTo: '/'
      });
}