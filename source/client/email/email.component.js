import { ModalEmailInstanceController } from './email.controller';
import { ModalEmailListInstanceController } from './emaillist.controller';
import { ModalEmailViewInstanceController } from './emailview.controller';
import emailtemplate from './email.html';
import emaillisttemplate from './emaillist.html';
import emailviewtemplate from './emailview.html';

export let emailComponent  = {
bindings: {},  
  controller: ModalEmailInstanceController,
  controllerAs: "vm",
  template: emailtemplate
};

export let emaillistComponent  = {
bindings: {},  
  controller: ModalEmailListInstanceController,
  controllerAs: "vm",
  template: emaillisttemplate
};

export let emailviewComponent  = {
bindings: {},  
  controller: ModalEmailViewInstanceController,
  controllerAs: "vm",
  template: emailviewtemplate
};
