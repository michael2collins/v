import './cc.less'; 


import { CardViewInstanceController } from './creditcardview.controller';
import template from './creditcardView.html';

import { OtherpayInstanceController } from './otherpayview.controller';
import othtemplate from './otherpayView.html';

export let creditcardviewComponent  = {
bindings: {},  
  controller: CardViewInstanceController,
  controllerAs: "vm",
  template: template
};
export let otherpaymentviewComponent  = {
bindings: {},  
  controller: OtherpayInstanceController,
  controllerAs: "vm",
  template: othtemplate
};
