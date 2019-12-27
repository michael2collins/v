//import { AttendanceTableBasicController } from './attendance.controller';
import { ChildController } from './child.controller';
import { MaincController } from './mainc.controller';

import { CardController } from './card.controller';
import { CardlistController } from './cardlist.controller';

import attendancetemplate from './attendance.html';
import './template/attendance-card.html';
import './template/attendance-cardlist.html';
import './attendance.less'; 
import '../webcomponents/masonry.js';
import maintemplate from './main.html';
import childtemplate from './child.html';
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

export let main = {
  template: maintemplate,
  controller: MaincController,

};
export let childComponent = {
  template: childtemplate,
  controller: ChildController,

};
/*
export let childComponent = {
  template: childtemplate,
  controller: 
function($element) {
    this.fireEvent = function() {
      var event = new CustomEvent('customtype', { detail: new Date()});

      $element[0].dispatchEvent(event);
    };
  }    
  
};
*/