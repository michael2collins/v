import angular from 'angular';

import { CoreModule } from '../../js/core/core.module';

import { TestingServices } from '../../js/services/testingServices';
import { RankTypeController } from './ranktype.controller';
import { ranktypeComponent } from './ranktype.component';

export const CommonModule = angular
 .module('ngadmin.common', [ CoreModule ])
 .component('ranktypeComponent', ranktypeComponent)
 .controller('RankTypeController', RankTypeController)
 .service('TestingServices', TestingServices)
 .name;

