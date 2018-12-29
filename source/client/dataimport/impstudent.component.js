import { ImpstudentController } from './impstudent.controller';
import { ImpclassController } from './impclass.controller';
import { ImphistoryController } from './imphistory.controller';
import { ImpattendController } from './impattend.controller';

import template from './impstudent.html';
import datatemplate from './dataimport.html';
import classtemplate from './impclass.html';
import historytemplate from './imphistory.html';
import attendtemplate from './impattend.html';

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

export let impattendComponent  = {
bindings: {},  
  controller: ImpattendController,
  template: attendtemplate
};

export let dataimportComponent  = {
bindings: {},  
  template: datatemplate
};
