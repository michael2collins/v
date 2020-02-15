
import { StudentClassController } from './studentclass.controller';

import studentclasstemplate from './studentclass.html';

export let studentclassComponent = {
  bindings: {
//    students: '<'
  },  
    controller: StudentClassController,
    template: studentclasstemplate
};