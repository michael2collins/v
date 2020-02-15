
import { FormLayoutsControllerEditStudent } from './editstudent.controller';
import { PrintStudentController } from './printstudent.controller';
import template from './form-layouts-editstudent.html';
import printtemplate from './print-layouts-editstudent.html';

export let editstudentComponent  = {
//bindings: {},  
  controller: FormLayoutsControllerEditStudent,
//  controllerAs: "vm",
  template: template
};

export let printstudentComponent  = {
//bindings: {},  
  controller: PrintStudentController,
//  controllerAs: "vm",
  template: printtemplate
};
