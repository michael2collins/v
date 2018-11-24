import angular from 'angular';

import { CoreModule } from '../../js/core/core.module';
import { DirectiveModule } from '../../js/directives/directive.module';

import { TestingServices } from '../../js/services/testingServices';
import { ClassServices } from '../../js/services/classServices';
import { StudentServices } from '../../js/services/studentServices';

import { ranktypeComponent } from './ranktype.component';
import { rankselectComponent } from './rankselect.component';
import { studentclassmodalComponent } from './studentclassmodal.component';
import { studentclassmodalinstComponent } from './studentclassmodalinst.component';

import { RankTypeController } from './ranktype.controller';
import { RankSelectController } from './rankselect.controller';
import { ModalSetStudentClassController } from './studentclassmodal.controller';
import { StudentClassModalInstanceController } from './studentclassmodalinst.controller';

export const CommonModule = angular
 .module('ngadmin.common', [ CoreModule,DirectiveModule ])
 .component('ranktypeComponent', ranktypeComponent)
 .component('rankselectComponent', rankselectComponent)
 .component('studentclassmodalComponent', studentclassmodalComponent)
 .component('studentclassmodalinstComponent', studentclassmodalinstComponent)
 .controller('RankTypeController', RankTypeController)
 .controller('RankSelectController', RankSelectController)
 .controller('ModalSetStudentClassController', ModalSetStudentClassController)
 .controller('StudentClassModalInstanceController', StudentClassModalInstanceController)
 .service('TestingServices', TestingServices)
 .service('ClassServices', ClassServices)
 .service('StudentServices', StudentServices)
 .name;

