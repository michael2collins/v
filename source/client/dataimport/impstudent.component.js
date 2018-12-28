import { ImpstudentController } from './impstudent.controller';
import { ImpclassController } from './impclass.controller';
import { ImphistoryController } from './imphistory.controller';

import template from './impstudent.html';
import datatemplate from './dataimport.html';
import classtemplate from './impclass.html';
import historytemplate from './imphistory.html';

export let impstudentComponent  = {
bindings: {},  
  controller: ImpstudentController,
  template: template
};

export let impclassComponent  = {
bindings: {},  
  controller: ImpclassController,
  template: classtemplate
};

export let imphistoryComponent  = {
bindings: {},  
  controller: ImphistoryController,
  template: historytemplate
};

export let dataimportComponent  = {
bindings: {},  
  template: datatemplate
};
