import { AttendanceTableBasicController } from './attendance.controller';
import attendancetemplate from './attendance.html';
import './template/attendance-card.html';
import './template/attendance-cardlist.html';
import './attendance.less'; 


export let attendanceComponent  = {
bindings: {},  
  controller: AttendanceTableBasicController,
//  controllerAs: "vm",
  template: attendancetemplate
};

