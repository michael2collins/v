import angular from 'angular';

export class AttendanceServices {
    constructor($http, $q, $log) {
        'ngInject';
        this.$http = $http;
        this.$q = $q;
        this.$log = $log;

//        this.apikey = {};
        this.picFile = '';
        this.theAttendance = '';
        this.activeTab = 'Attendance Information'; //default
        this.response={};
        this.code={};
    }
    getActiveTab() {
        return this.activeTab;
    }
    setActiveTab(thetab) {
        this.activeTab = thetab;
    }
/*    setapikey(key) {
        //     self.$log.log('setapikey', key);
        this.apikey = key;
    }
*/


    refreshAttendances(path) {
        self = this;
        self.$log.log('refreshAttendances service entered');
        self.$log.log('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }

    getAttendanceHistory(path) {
        self = this;
        self.$log.log('getAttendanceHistory service entered');
        self.$log.log('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }

    getAttendanceSum(path) {
        self = this;
        self.$log.log('getAttendanceSum service entered');
        self.$log.log('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }

    getDOW() {
        self = this;
        var path = '../v1/DOW';
        self.$log.log('getDOW service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getSchedule(path) {
        self = this;
        self.$log.log('getSchedule service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getSchedules(path) {
        self = this;
        self.$log.log('getSchedules service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getClasses(path) {
        self = this;
        self.$log.log('getClasses service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    setStudentReadyNextRank(path, readyness, theclass) {
        self = this;
        self.$log.log('setStudentReadyNextRank before put :', path, readyness, theclass);
        var dta = {
            readyness: readyness,
            theclass: theclass
        };
        var request = self.$http({
            method: "PUT",
            url: path,
            data: dta
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    removeSchedule(thedata, path) {
        self = this;
        self.$log.log('removeSchedule data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    updateAttendance(path, thedata) {
        self = this;
        self.$log.log('updateAttendance data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            //    params: {
            //        action: "add"
            //    },
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateSchedule(path, thedata) {
        self = this;
        self.$log.log('updateSchedule data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }


    // ---
    // PRIVATE METHODS.
    // ---
    handleError(response) {
//        self = this;
 //       self.$log.log('failure:');
 //       self.$log.log(response);
  //      self.$log.log('status', response.status);
//        self.$log.log('config', response.config);
        //debugger;
        if (!angular.isObject(response.data) ||
            !response.data.message
        ) {
            //  return( $q.reject( "An unknown error occurred." ) );
            return (null);
        }
        // Otherwise, use expected error message.
        return ($q.reject(response.data.message));
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    handleSuccess(response) {
//        self = this;
//        self.$log.log(' success:');
//        self.$log.log(response, response.error);
        if (response.error === true || response.data === null) {
  //          self.$log.log('attendanceServices error returned', response);
            response.message = "attendanceServices error returned";
            return ($q.reject(response));
        }

        return (response.data);
    }

}
