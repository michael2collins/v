import  angular from 'angular';

//import { AllModule } from './controllers/all.module';
import { AdminModule } from '../client/admin/admin.module';
import { EventsModule } from '../client/events/events.module';
import { MainModule } from '../client/main/main.module';
import { AttendanceModule } from '../client/attendance/attendance.module';
import { EmailModule } from '../client/email/email.module';
import { CCModule } from '../client/cc/cc.module';
import { TestmgmtModule } from '../client/testmgmt/testmgmt.module';
import { StudentModule } from '../client/student/student.module';
import { PaymentModule } from '../client/payment/payment.module';
import { PhotoModule } from '../client/photos/photo.module';
import { PortalModule } from '../client/portal/portal.module';
import { SidebarModule } from '../client/portal/sidebar/sidebar.module';
import { LoginModule } from '../client/login/login.module';
import { CoreModule } from './core/core.module';
import { DirectiveModule } from './directives/directive.module';
//import { FilterModule } from './filters/filter.module';
//import { RouterModule } from './blocks/router/router.module';

/*
import '../less/themes/default.less';
import '../less/themes/blue.less';
import '../less/main.less';
import '../less/wysiwyg.less';
*/
import '../less/htmlinline.css';
import '../less/stripecss.css';
import '../vendors/zoomPan-master/css/zoomPan.css';

    'use strict';

//export const app = 'portalComponent';

export const ngadmin =    angular
        .module('ngadmin', [
            CoreModule,
            DirectiveModule,
//            AllModule,
            LoginModule,
            EventsModule,
            AttendanceModule,
            MainModule,
            StudentModule,
            PortalModule,
            SidebarModule,
            PhotoModule,
            TestmgmtModule,
            AdminModule,
            PaymentModule,
            CCModule,
            EmailModule
//            ExceptionModule,
//            LoggerModule,
//            RouterModule
        ])
        .name;

//angular.bootstrap(document.body, [app]);