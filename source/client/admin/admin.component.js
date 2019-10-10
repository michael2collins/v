
import { BasicTableBasicController } from './table-basic-basic';
import { PayerTableBasicController } from './table-payer';
import { ClassRankTableBasicController } from './table-basic-classrank';     
import { ProgramTableBasicController } from './table-basic-program';   
import { TesttypeTableBasicController } from './table-basic-testtype';
//import { RptBuilderController } from './rptbuilder.controller';  
import { ClassTableBasicController } from './table-basic-class';     
import { ClassTestTableBasicController } from './table-basic-classtest';     
import { RankTableBasicController } from './table-basic-rank';
import { StripeTableBasicController } from './stripe-onboard';         
import { ClassPgmTableBasicController } from './table-basic-classpgm';  
import { TemplateTableBasicController } from './table-basic-htmltemplate';  
import { ScheduleTableBasicController } from './table-basic-schedule';
import { QuickpickController } from './quickpick.controller';
import { SchoolcomTableBasicController } from './table-basic-schoolcom';

import stripeonboardtemplate from './template/stripe_onboard.html';
import classtemplate from './template/table-basic-class.html';
import classranktemplate from './template/table-basic-classrank.html';
import htmltemplate from './template/table-basic-htmltemplate.html';
import rankstemplate from './template/table-basic-ranks.html';
import testtypetemplate from './template/table-basic-testtype.html';
import basictemplate from './template/table-basic-basic.html';
import classpgmtemplate from './template/table-basic-classpgm.html';
import classtesttemplate from './template/table-basic-classtest.html';
import programtemplate from './template/table-basic-program.html';
import scheduletemplate from './template/table-basic-schedule.html';
//import rptbuildertemplate from './table-basic-rptbuilder.html';
import quickpicktemplate from './template/table-quickpick.html';
import schoolcomtemplate from './template/table-basic-schoolcom.html';
import tablepayertemplate from './template/table-basic-payer.html';


import './textblockimage.html';
import './textblocktable.html';

export let basicComponent = {
bindings: {},  
  controller: BasicTableBasicController,
  template: basictemplate
};
export let tablePayerComponent = {
bindings: {},  
  controller: PayerTableBasicController,
  template: tablepayertemplate
};
export let quickpickComponent = {
bindings: {},  
  controller: QuickpickController,
  template: quickpicktemplate
};
export let classrankComponent = {
bindings: {},  
  controller: ClassRankTableBasicController,
  template: classranktemplate
};
export let programComponent = {
bindings: {},  
  controller: ProgramTableBasicController,
  template: programtemplate
};
export let testtypeComponent = {
bindings: {},  
  controller: TesttypeTableBasicController,
  template: testtypetemplate
};
export let rptbuilderComponent = {
//bindings: {},  
//  controller: RptBuilderController,
//  template: rptbuildertemplate
};
export let         classComponent = {
bindings: {},  
  controller: ClassTableBasicController,
  template: classtemplate
};
export let         classtestComponent = {
bindings: {},  
  controller: ClassTestTableBasicController,
  template: classtesttemplate
};
 export let        rankComponent = {
bindings: {},  
  controller: RankTableBasicController,
  template: rankstemplate
};
export let         stripeonboardComponent = {
bindings: {},  
  controller: StripeTableBasicController,
  template: stripeonboardtemplate
};
 export let        classpgmComponent = {
bindings: {},  
  controller: ClassPgmTableBasicController,
  template: classpgmtemplate
};
 export let        templateComponent = {
bindings: {},  
  controller: TemplateTableBasicController,
  template: htmltemplate
};
 export let        scheduleComponent = {
bindings: {},  
  controller: ScheduleTableBasicController,
  template:  scheduletemplate
};
        
 export let        schoolcomComponent = {
bindings: {},  
  controller: SchoolcomTableBasicController,
  template: schoolcomtemplate
};

