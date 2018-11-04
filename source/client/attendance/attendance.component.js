import { AttendanceTableBasicController } from './attendance.controller';
import attendancetemplate from './attendance.html';
import './template/attendance-card.html';

export let attendanceComponent  = {
bindings: {},  
  controller: AttendanceTableBasicController,
//  controllerAs: "vm",
  template: attendancetemplate
};

