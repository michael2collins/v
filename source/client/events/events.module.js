import angular from 'angular';

import { CoreModule } from '../../js/core/core.module';
import { DirectiveModule } from '../../js/directives/directive.module';


import { portalDataService } from '../portal/portaldata.service';
import { EventServices } from '../../js/services/eventServices';
import { EventTableBasicController } from './eventcreation.controller';
import { Util } from '../../js/utility/utility';

import template from './eventcreation.html';
import { eventcreationComponent } from './eventcreation.component';


export const EventsModule = angular
 .module('ngadmin.events', [CoreModule,DirectiveModule])
 .component('eventcreationComponent', eventcreationComponent)
 .controller('EventTableBasicController', EventTableBasicController)
 .service('EventServices', EventServices)
 .service('portalDataService', portalDataService)
 .service('Util', Util)
 .config(eventconfig)
 .name;

function eventconfig($routeProvider) {
 'ngInject';
 $routeProvider
  .when('/table-basic-eventcreation', {
   template: template
  });
}
