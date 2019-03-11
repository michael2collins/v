
import angular from 'angular';

import { CoreModule } from '../../js/core/core.module';

import { portalDataService } from '../portal/portaldata.service';
import { StudentServices } from '../../js/services/studentServices';

import { CardViewInstanceController } from './creditcardview.controller';
import { OtherpayInstanceController } from './otherpayview.controller';

import { creditcardviewComponent, otherpaymentviewComponent } from './creditcardview.component';


 export const CCModule =   angular
    .module('ngadmin.cc', [CoreModule])
   .component('creditcardviewComponent', creditcardviewComponent)
   .component('otherpaymentviewComponent', otherpaymentviewComponent)
   .controller('CardViewInstanceController', CardViewInstanceController)
   .controller('OtherpayInstanceController', OtherpayInstanceController)
   .service('StudentServices', StudentServices)
   .service('portalDataService', portalDataService)
   .name;

 