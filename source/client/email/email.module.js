import { ModalEmailInstanceController } from './email.controller';
import { ModalEmailListInstanceController } from './emaillist.controller';
import { ModalEmailViewInstanceController } from './emailview.controller';
import { StudentServices } from '../../js/services/studentServices';
import { emailComponent } from './email.component';
import { emaillistComponent } from './email.component';
import { emailviewComponent } from './email.component';
import { Util } from '../../js/utility/utility';
import { CoreModule } from '../../js/core/core.module';
import iddropdown from '../../js/filters/iddropdown.filter';

//import tinymce from 'tinymce';
import angular from 'angular';

export const EmailModule =  angular
    .module('ngadmin.email', [ CoreModule,
                'ui.grid',
            'ui.grid.pagination',
            'ui.grid.cellNav',
            'ui.grid.edit',
            'ui.grid.autoResize',
            'ui.grid.selection',
            'ui.grid.resizeColumns',
            'ui.grid.pinning',
            'ui.grid.moveColumns',
            'ui.grid.exporter',
            'ui.grid.importer',
            'ui.grid.grouping',
            'ui.grid.saveState'
            ])
    .controller('ModalEmailViewInstanceController',ModalEmailViewInstanceController)
    .controller('ModalEmailInstanceController',ModalEmailInstanceController)
    .controller('ModalEmailListInstanceController',ModalEmailListInstanceController)
    .component('emailComponent',emailComponent)
    .component('emaillistComponent',emaillistComponent)
    .component('emailviewComponent',emailviewComponent)
    .filter('iddropdown',iddropdown)
    .service('studentServices', StudentServices)
    .service('util', Util)
    .name;
