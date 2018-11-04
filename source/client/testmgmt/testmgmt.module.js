import angular from 'angular';

import { CoreModule } from '../../js/core/core.module';
//import { DirectiveModule } from '../../js/directives/directive.module';

import { portalDataService } from '../portal/portaldata.service';
import { TestingServices } from '../../js/services/testingServices';
import { CalendarServices } from '../../js/services/calendarServices';
import { AttendanceServices } from '../../js/services/attendanceServices';
import { UserServices } from '../../js/services/userServices';
import { TemplateServices } from '../../js/services/templateServices';

import { TestCandidateTableBasicController } from './testcandidates.controller';
import { ModalTestRptInstanceController } from './testrpt.controller';
import { ModalPromotionInstanceController } from './promotion.controller';
import { Util } from '../../js/utility/utility';

import template from './testcandidates.html';
import { testmgmtComponent, testrptComponent,promotionComponent } from './testmgmt.component';

export const TestmgmtModule = angular
 .module('ngadmin.testmgmt', [ CoreModule,
  'ui.grid',
  'ui.grid.pagination',
  'ui.grid.cellNav',
  'ui.grid.edit',
  'ui.grid.autoResize',
  'ui.grid.selection',
  'ui.grid.resizeColumns',
  'ui.grid.pinning',
  'ui.grid.moveColumns',
  'ui.grid.exporter',
  'ui.grid.importer',
  'ui.grid.grouping',
  'ui.grid.saveState'
 ])
 .component('testmgmtComponent', testmgmtComponent)
 .component('testrptComponent', testrptComponent)
 .component('promotionComponent', promotionComponent)
 .controller('TestCandidateTableBasicController', TestCandidateTableBasicController)
 .controller('ModalTestRptInstanceController', ModalTestRptInstanceController)
 .controller('ModalPromotionInstanceController', ModalPromotionInstanceController)
 .service('TestingServices', TestingServices)
 .service('CalendarServices', CalendarServices)
 .service('AttendanceServices', AttendanceServices)
 .service('UserServices', UserServices)
 .service('TemplateServices', TemplateServices)
 .service('portalDataService', portalDataService)
 .service('Util', Util)
 .config(config)
 .name;

function config($routeProvider) {
 'ngInject';
 $routeProvider
  .when('/table-basic-testcandidates', {
   template: template
  });
}
