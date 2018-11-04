import { HeaderController } from './header.controller';
import template from './topbar.html';
import './topbar.less'; 

export const headerComponent  = {
  bindings: {
    "userdta": "<"
  },  
  controller: HeaderController,
  controllerAs: '$ctrl',
  template: template
};

