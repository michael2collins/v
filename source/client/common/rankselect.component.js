import { RankSelectController } from './rankselect.controller';
import template from './rankselect.html';

export let rankselectComponent = {
  controller: RankSelectController,
  template: template,
  bindings: {
    rankpickparent: '<',
    onUpdate: '&'
  }
};
