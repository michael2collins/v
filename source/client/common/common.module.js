import angular from 'angular';

import { CoreModule } from '../../js/core/core.module';
import { DirectiveModule } from '../../js/directives/directive.module';

import { TestingServices } from '../../js/services/testingServices';
import { ClassServices } from '../../js/services/classServices';
import { StudentServices } from '../../js/services/studentServices';
import { PaymentServices } from '../../js/services/paymentServices';

import { ranktypeComponent } from './ranktype.component';
import { rankselectComponent } from './rankselect.component';
import { studentclassmodalComponent } from './studentclassmodal.component';
import { studentclassmodalinstComponent } from './studentclassmodalinst.component';
import { newpayerComponent } from './newpayer.component';
import { newpayerinstComponent } from './newpayerinst.component';

import { RankTypeController } from './ranktype.controller';
import { RankSelectController } from './rankselect.controller';
import { ModalSetStudentClassController } from './studentclassmodal.controller';
import { StudentClassModalInstanceController } from './studentclassmodalinst.controller';
import { ModalNewPayerController } from './newpayer.controller';
import { ModalNewPayerInstanceController } from './newpayerinst.controller';

export const CommonModule = angular
 .module('ngadmin.common', [ CoreModule,DirectiveModule ])
 .component('ranktypeComponent', ranktypeComponent)
 .component('rankselectComponent', rankselectComponent)
 .component('studentclassmodalComponent', studentclassmodalComponent)
 .component('studentclassmodalinstComponent', studentclassmodalinstComponent)
 .component('newpayerComponent', newpayerComponent)
 .component('newpayerinstComponent', newpayerinstComponent)
 .controller('RankTypeController', RankTypeController)
 .controller('RankSelectController', RankSelectController)
 .controller('ModalSetStudentClassController', ModalSetStudentClassController)
 .controller('StudentClassModalInstanceController', StudentClassModalInstanceController)
 .controller('ModalNewPayerController', ModalNewPayerController)
 .controller('ModalNewPayerInstanceController', ModalNewPayerInstanceController)
 .service('TestingServices', TestingServices)
 .service('ClassServices', ClassServices)
 .service('StudentServices', StudentServices)
 .service('PaymentServices', PaymentServices)
 .name;

