import { RankTypeController } from './ranktype.controller';
import template from './ranktype.html';
import './common.less';

export let ranktypeComponent  = {
  controller: RankTypeController,
  template: template,
 bindings: {
    ranktypeparent: '<',
    onUpdate: '&'
  }  
};
