import angular from 'angular';
import { CoreModule } from '../../js/core/core.module';
import { DirectiveModule } from '../../js/directives/directive.module';

import { portalDataService } from '../portal/portaldata.service';
import { StudentServices } from '../../js/services/studentServices';
import { ClassServices } from '../../js/services/classServices';

import { PaymentViewInstanceController } from './paymentview.controller';
import { PaymentTrackingController } from './paymenttracking.controller';
import { Util } from '../../js/utility/utility';

import template from './template/table-basic-paymenttracking.html';
import { paymenttrackingComponent, paymentviewComponent } from './paymenttracking.component';
//import { creditcardviewComponent } from '../cc/creditcardview.component';

import { CCModule } from '../cc/cc.module';
import iddropdown from '../../js/filters/iddropdown.filter';
import currencyFilter from '../../js/filters/currency.filter';
import textDate from '../../js/filters/textdate.filter';

export const PaymentModule = angular
   .module('ngadmin.payment', [CCModule, CoreModule, DirectiveModule,
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
   .component('paymenttrackingComponent', paymenttrackingComponent)
   .component('paymentviewComponent', paymentviewComponent)
//   .component('creditcardviewComponent', creditcardviewComponent)
   .controller('PaymentViewInstanceController', PaymentViewInstanceController)
   .controller('PaymentTrackingController', PaymentTrackingController)
   .service('StudentServices', StudentServices)
   .service('ClassServices', ClassServices)
   .service('portalDataService', portalDataService)
   .service('Util', Util)
   .filter('iddropdown', iddropdown)
   .filter('currencyFilter', currencyFilter)
   .filter('textDate', textDate)
   .config(config)
   .name;

function config($routeProvider) {
   'ngInject';
   $routeProvider
      .when('/table-basic-paymenttracking', {
         template: template
      });
}
