//import { TestCandidateTableBasicController } from './testcandidates.controller';

//import template from './testcandidates.html';
import { ModalTestRptInstanceController } from './testrpt.controller';
import template from './testRpt.html';

import { ModalPromotionInstanceController } from './promotion.controller';
import promotemplate from './promotion.html';

export const testmgmtComponent = {
//    template,
//    controller: EventTableBasicController
};

export let testrptComponent  = {
bindings: {},  
  controller: ModalTestRptInstanceController,
  controllerAs: "vmnew",
  template: template
};
export let promotionComponent  = {
bindings: {},  
  controller: ModalPromotionInstanceController,
  controllerAs: "vm",
  template: promotemplate
};
