//import { AttendanceTableBasicController } from './attendance.controller';

import { CardController } from './card.controller';
import { CardlistController } from './cardlist.controller';

import attendancetemplate from './attendance.html';
import './template/attendance-card.html';
import './template/attendance-cardlist.html';
import './attendance.less'; 
import '../webcomponents/masonry.js';
import cardtemplate from './template/attendance-card.html';
import cardlisttemplate from './template/attendance-cardlist.html';

export let attendanceComponent  = {
// bindings: {},  
//  controller: AttendanceTableBasicController,
//  controllerAs: "vm",
  template: attendancetemplate
};

export let attendanceCard = {
  template: cardtemplate,
  controller: CardController,
    cardparent: '<',
//mlc future reference
//    studentpickparent2: '<',
    onUpdate: '&',
//    onUpdate2: '&'

};

export let attendanceCardlist = {
  template: cardlisttemplate,
  controller: CardlistController,
    cardparent: '<',
//mlc future reference
//    studentpickparent2: '<',
    onUpdate: '&',
//    onUpdate2: '&'

};

