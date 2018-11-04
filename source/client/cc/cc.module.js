//const { Stripe: Stripe } = window;

import angular from 'angular';

import { CoreModule } from '../../js/core/core.module';

import { portalDataService } from '../portal/portaldata.service';
import { StudentServices } from '../../js/services/studentServices';

import { CardViewInstanceController } from './creditcardview.controller';

import { creditcardviewComponent } from './creditcardview.component';
//import { stripeConfig } from './stripeconfig';


 export const CCModule =   angular
    .module('ngadmin.cc', [CoreModule])
   .component('creditcardviewComponent', creditcardviewComponent)
   .controller('CardViewInstanceController', CardViewInstanceController)
   .service('StudentServices', StudentServices)
   .service('portalDataService', portalDataService)
//   .config(stripeConfig)
   .name;

 