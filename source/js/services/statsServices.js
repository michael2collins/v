import angular from 'angular';

export class StatsServices {
    constructor( $http, $q, $log) {
        'ngInject';
        this.$http = $http;
        this.$q = $q;
        this.$log = $log;

//        this.apikey={};
    }
/*    setapikey(key) {
        //        self.$log.debug('StatsServices setapikey', key);
        this.apikey = key;
    }
*/
    getStudentStats(thedata) {
        var self = this;
        self.$log.debug('getStudentStats data before post :', thedata);
        var path = '../v1/studentstats';
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getStudentStatsMonths(thedata) {
        var self = this;
        self.$log.debug('getStudentStatsMonths data before post :', thedata);
        var path = '../v1/studentstatsmonths';
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }


    handleError(response) {

        if (!angular.isObject(response.data) ||
            !response.data.message
        ) {
            return (this.$q.reject("An unknown error occurred."));
        }
        // Otherwise, use expected error message.
        return (response.data.message);
    }
    handleSuccess(response) {
        return (response);
    }
}
