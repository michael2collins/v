import './paymenttracking.less';

import { PaymentViewInstanceController } from './paymentview.controller';
import template from './paymentView.html';


export const paymenttrackingComponent = {
};

export let paymentviewComponent  = {
bindings: {},  
  controller: PaymentViewInstanceController,
  controllerAs: "vm",
  template: template
};
