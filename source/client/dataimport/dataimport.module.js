import angular from 'angular';

import { CoreModule } from '../../js/core/core.module';
import { DirectiveModule } from '../../js/directives/directive.module';

import { portalDataService } from '../portal/portaldata.service';
import { StudentServices } from '../../js/services/studentServices';

import { DataImportController } from './dataimport.controller';
import { ImpstudentController } from './impstudent.controller';
import { ImpclassController } from './impclass.controller';
import { ImphistoryController } from './imphistory.controller';
import { ImpattendController } from './impattend.controller';

import { Util } from '../../js/utility/utility';
import textDate from '../../js/filters/textdate.filter';

import template from './dataimport.html';
import { impstudentComponent,impclassComponent,imphistoryComponent,impattendComponent,dataimportComponent } from './impstudent.component';

export const DataimportModule = angular
   .module('ngadmin.dataimport', [CoreModule, DirectiveModule,
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
      'ui.grid.validate',
      'ui.grid.rowEdit',
      'ui.grid.grouping',
      'ui.grid.saveState'
   ])
   .component('impstudentComponent', impstudentComponent)
   .component('impclassComponent', impclassComponent)
   .component('imphistoryComponent', imphistoryComponent)
   .component('impattendComponent', impattendComponent)
   .component('dataimportComponent', dataimportComponent)
   .controller('ImpstudentController', ImpstudentController)
   .controller('ImpclassController', ImpclassController)
   .controller('ImphistoryController', ImphistoryController)
   .controller('ImpattendController', ImpattendController)
   .controller('DataImportController', DataImportController)
   .service('portalDataService', portalDataService)
   .service('StudentServices', StudentServices)
   .service('Util', Util)
   .filter('textDate', textDate)
   .config(config)
   .name;

function config($routeProvider) {
   'ngInject';
   $routeProvider
      .when('/impstudent', {
         template: template
      });
}
