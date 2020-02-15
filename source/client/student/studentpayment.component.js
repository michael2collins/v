
import { StudentPaymentController } from './studentpayment.controller';

import studentpaymenttemplate from './studentpayment.html';

export let studentpaymentComponent = {
  bindings: {
//    students: '<',
//    disenable: '<'
    
  },  
    controller: StudentPaymentController,
    template: studentpaymenttemplate
};