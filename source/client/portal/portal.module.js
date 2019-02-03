import angular from 'angular';

import { headerComponent } from './topbar/header.component';
import { breadcrumbComponent } from './header/breadcrumb.component';
import { usersettingsComponent } from './user/usersettings.component';
import { portalComponent } from './portal.component';
import { portalDataService } from './portaldata.service';
import { UserServices } from '../../js/services/userServices';
import { CalendarServices } from '../../js/services/calendarServices';
import { StudentServices } from '../../js/services/studentServices';
import { ClassServices } from '../../js/services/classServices';
import { AttendanceServices } from '../../js/services/attendanceServices';
import { TestingServices } from '../../js/services/testingServices';
import { EventServices } from '../../js/services/eventServices';
import { TemplateServices } from '../../js/services/templateServices';
import { PaymentServices } from '../../js/services/paymentServices';
import { StatsServices } from '../../js/services/statsServices';

import { ModalUserSettingsInstanceController } from './user/usersettings.controller';

import { Util } from '../../js/utility/utility';
import { HeaderController } from './topbar/header.controller';
import { PortalController } from './portal.controller';
import { BreadcrumbController } from './header/breadcrumb.controller';

import { CoreModule } from '../../js/core/core.module';
import { EmailModule } from '../email/email.module';
import { DirectiveModule } from '../../js/directives/directive.module';


export const PortalModule = angular
    .module('ngadmin.portal', [CoreModule, EmailModule,DirectiveModule])
    .component('headerComponent', headerComponent)
    .component('breadcrumbComponent', breadcrumbComponent)
    //    .component('sidebarComponent',sidebarComponent)
    .component('portalComponent', portalComponent)
    .component('usersettingsComponent', usersettingsComponent)
    .controller('HeaderController', HeaderController)
    .controller('PortalController', PortalController)
    .controller('BreadcrumbController', BreadcrumbController)
    .controller('ModalUserSettingsInstanceController',ModalUserSettingsInstanceController)
    .service('portalDataService', portalDataService)
    .service('userServices', UserServices)
    .service('calendarServices', CalendarServices)
    .service('studentServices', StudentServices)
    .service('classServices', ClassServices)
    .service('attendanceServices', AttendanceServices)
    .service('testingServices', TestingServices)
    .service('eventServices', EventServices)
    .service('templateServices', TemplateServices)
    .service('paymentServices', PaymentServices)
    .service('statsServices', StatsServices)

    .service('util', Util)
    .name;
