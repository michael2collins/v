import angular from 'angular';
import studenttemplate from './table-basic-students.html';
import studenthistoriestemplate from './table-basic-studenthistories.html';
import editstudenttempate from './form-layouts-editstudent.html';


import { editstudentComponent } from './editstudent.component';
//import { newpayerComponent } from './newpayer.component';
//import { newpayerinstComponent } from './newpayerinst.component';
import { newstudentComponent } from './newstudent.component';
import { newstudentinstComponent } from './newstudentinst.component';
import { studentclassComponent } from './studentclass.component';
import { studentdualComponent } from './studentdual.component';
import { studentdualgridComponent } from './studentdual.component';
import { studenthistoryComponent } from './studenthistory.component';
import { studentattendComponent } from './studentattend.component';
import { studentpaymentComponent } from './studentpayment.component';
import { studenttableComponent } from './studenttable.component';
import { studenthistoriestableComponent } from './studenthistoriestable.component';
//import { studentclasseditComponent } from './studentclassedit.component';

import { StudentPaymentController } from './studentpayment.controller';
import { ModalNewStudentController } from './newstudent.controller';
import { ModalNewStudentInstanceController } from './newstudentinst.controller';
import { StudentClassController } from './studentclass.controller';
import { StudentHistoryController } from './studenthistory.controller';
import { StudentAttendController } from './studentattend.controller';
import { FormLayoutsControllerEditStudent } from './editstudent.controller';
import { ctrlDualList } from './studentdual.controller';
import { StudentsTableBasicController } from './studenttable.controller';
import { StudentHistoriesController } from './studenthistoriestable.controller';
//import { StudentClassEditController } from './studentclassedit.controller';

//import { portalDataService } from '../portal/portaldata.service';
import { StudentServices } from '../../js/services/studentServices';
import { ClassServices } from '../../js/services/classServices';
import { PhotoServices } from '../../js/services/photoServices';
import { PaymentServices } from '../../js/services/paymentServices';
import { TestingServices } from '../../js/services/testingServices';
import { Util } from '../../js/utility/utility';
import { StudentUtil } from './studentUtil';

import { leadnotRequired } from './leadNotrequired.directive';

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
// .service('portalDataService', portalDataService)
 .service('Util', Util)
 .service('StudentUtil', StudentUtil)
 .controller('StudentPaymentController', StudentPaymentController)
 .controller('ModalNewStudentController', ModalNewStudentController)
 .controller('ModalNewStudentInstanceController', ModalNewStudentInstanceController)
 .controller('StudentClassController', StudentClassController)
 .controller('StudentHistoryController', StudentHistoryController)
 .controller('StudentAttendController', StudentAttendController)
 .controller('FormLayoutsControllerEditStudent', FormLayoutsControllerEditStudent)
 .controller('StudentPaymentController', StudentPaymentController)
 .controller('ctrlDualList', ctrlDualList)
 .controller('StudentsTableBasicController', StudentsTableBasicController)
 .controller('StudentHistoriesController', StudentHistoriesController)
// .controller('StudentClassEditController', StudentClassEditController)
 .component('editstudentComponent', editstudentComponent)
 .component('newstudentComponent', newstudentComponent)
 .component('newstudentinstComponent', newstudentinstComponent)
 .component('studentclassComponent', studentclassComponent)
 .component('studentdualComponent', studentdualComponent)
 .component('studentdualgridComponent', studentdualgridComponent)
 .component('studenthistoryComponent', studenthistoryComponent)
 .component('studentattendComponent', studentattendComponent)
 .component('studentpaymentComponent', studentpaymentComponent)
 .component('studenttableComponent', studenttableComponent)
 .component('studenthistoriestableComponent', studenthistoriestableComponent)
// .component('studentclasseditComponent', studentclasseditComponent)
 .directive('leadnotRequired',leadnotRequired)
 .config(studentconfig)
 .name;


function studentconfig($routeProvider) {
 'ngInject';
 $routeProvider
  .when('/table-basic-students', {
   template: studenttemplate
  })

  .when('/table-basic-studenthistories', {
   template: studenthistoriestemplate
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
