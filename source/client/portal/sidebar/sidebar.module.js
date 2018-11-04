import angular from 'angular';

import { sidebarComponent } from './sidebar.component'; 
import { UserServices } from '../../../js/services/userServices';
import { SidebarController } from './sidebar.controller';

import { CoreModule } from '../../../js/core/core.module';
import { DirectiveModule } from '../../../js/directives/directive.module';

export const SidebarModule = angular
    .module('ngadmin.sidebar', [CoreModule,DirectiveModule]        
    )
    .component('sidebarComponent',sidebarComponent)
    .controller('SidebarController',SidebarController)
    .service('userServices', UserServices)
    .name;
