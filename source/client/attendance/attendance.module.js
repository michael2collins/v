import angular from 'angular';

import { DirectiveModule } from '../../js/directives/directive.module';
import { CoreModule } from '../../js/core/core.module';
import { CommonModule } from '../common/common.module';

import { AttendanceServices } from '../../js/services/attendanceServices';
import { Util } from '../../js/utility/utility';

import { AttendanceTableBasicController } from './attendance.controller';
import { attendanceComponent } from './attendance.component';
import attendancetemplate from './attendance.html';

export const AttendanceModule = angular
   .module('ngadmin.attendance', [DirectiveModule,CoreModule,CommonModule])
   .service('AttendanceServices', AttendanceServices)
   .service('Util', Util)
   .controller('AttendanceTableBasicController', AttendanceTableBasicController)
   .component('attendanceComponent', attendanceComponent)
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