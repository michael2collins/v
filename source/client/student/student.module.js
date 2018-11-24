import angular from 'angular';
import studenttemplate from './table-basic-students.html';
import editstudenttempate from './form-layouts-editstudent.html';


import { editstudentComponent } from './editstudent.component';
import { newpayerComponent } from './newpayer.component';
import { newpayerinstComponent } from './newpayerinst.component';
import { newstudentComponent } from './newstudent.component';
import { newstudentinstComponent } from './newstudentinst.component';
import { studentclassComponent } from './studentclass.component';
import { studentdualComponent } from './studentdual.component';
import { studentdualgridComponent } from './studentdual.component';
import { studenthistoryComponent } from './studenthistory.component';
import { studentpaymentComponent } from './studentpayment.component';
import { studenttableComponent } from './studenttable.component';

import { StudentPaymentController } from './studentpayment.controller';
import { ModalNewPayerController } from './newpayer.controller';
import { ModalNewPayerInstanceController } from './newpayerinst.controller';
import { ModalNewStudentController } from './newstudent.controller';
import { ModalNewStudentInstanceController } from './newstudentinst.controller';
import { StudentClassController } from './studentclass.controller';
import { StudentHistoryController } from './studenthistory.controller';
import { FormLayoutsControllerEditStudent } from './editstudent.controller';
import { ctrlDualList } from './studentdual.controller';
import { StudentsTableBasicController } from './studenttable.controller';

import { StudentServices } from '../../js/services/studentServices';
import { ClassServices } from '../../js/services/classServices';
import { PhotoServices } from '../../js/services/photoServices';
import { PaymentServices } from '../../js/services/paymentServices';
import { TestingServices } from '../../js/services/testingServices';
import { Util } from '../../js/utility/utility';

import { CommonModule } from '../common/common.module';
import { PhotoModule } from '../photos/photo.module';
import { DirectiveModule } from '../../js/directives/directive.module';
import { CoreModule } from '../../js/core/core.module';

export const StudentModule = angular
 .module('ngadmin.student', [PhotoModule, CoreModule, DirectiveModule, CommonModule])
 .service('StudentServices', StudentServices)
 .service('ClassServices', ClassServices)
 .service('PhotoServices', PhotoServices)
 .service('PaymentServices', PaymentServices)
 .service('TestingServices', TestingServices)
 .service('Util', Util)
 .controller('StudentPaymentController', StudentPaymentController)
 .controller('ModalNewPayerController', ModalNewPayerController)
 .controller('ModalNewPayerInstanceController', ModalNewPayerInstanceController)
 .controller('ModalNewStudentController', ModalNewStudentController)
 .controller('ModalNewStudentInstanceController', ModalNewStudentInstanceController)
 .controller('StudentClassController', StudentClassController)
 .controller('StudentHistoryController', StudentHistoryController)
 .controller('FormLayoutsControllerEditStudent', FormLayoutsControllerEditStudent)
 .controller('StudentPaymentController', StudentPaymentController)
 .controller('ctrlDualList', ctrlDualList)
 .controller('StudentsTableBasicController', StudentsTableBasicController)
 .component('editstudentComponent', editstudentComponent)
 .component('newpayerComponent', newpayerComponent)
 .component('newpayerinstComponent', newpayerinstComponent)
 .component('newstudentComponent', newstudentComponent)
 .component('newstudentinstComponent', newstudentinstComponent)
 .component('studentclassComponent', studentclassComponent)
 .component('studentdualComponent', studentdualComponent)
 .component('studentdualgridComponent', studentdualgridComponent)
 .component('studenthistoryComponent', studenthistoryComponent)
 .component('studentpaymentComponent', studentpaymentComponent)
 .component('studenttableComponent', studenttableComponent)
 .config(studentconfig)
 .name;


function studentconfig($routeProvider) {
 'ngInject';
 $routeProvider
  .when('/table-basic-students', {
   template: studenttemplate
  })

  .when('/form-layouts-editstudent/id/:id', {
   template: editstudenttempate
  })

  .when('/form-layouts-editstudent/id/:id/myclass/:myclass', {
   template: editstudenttempate
  })

  .otherwise({
   redirectTo: '/page-signin'
   //           redirectTo: '/'
  });
}
