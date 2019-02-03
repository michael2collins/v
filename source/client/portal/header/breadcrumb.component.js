import template from './header-breadcrumb.html';
import { BreadcrumbController } from '../header/breadcrumb.controller';

export const breadcrumbComponent  = {
  bindings: {
    "userdta": "<"
  },  
    controller: BreadcrumbController,
  template: template
};
