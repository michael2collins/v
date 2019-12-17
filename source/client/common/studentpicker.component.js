import { StudentPickerController } from './studentpicker.controller';
import template from './studentpicker.html';
import './common.less';

export let studentpickerComponent  = {
  controller: StudentPickerController,
  template: template,
 bindings: {
    studentpickparent: '<',
//mlc future reference
//    studentpickparent2: '<',
    onUpdate: '&',
//    onUpdate2: '&'
  }  
};
