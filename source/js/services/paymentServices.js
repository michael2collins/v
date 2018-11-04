import angular from 'angular';

export class PaymentServices {
    constructor( $http, $q, $log) {
        'ngInject';

//        this.apikey={};
        this.$http = $http;
        this.$q = $q;
        this.$log = $log;

    }
/*    setapikey(key) {
        // $log.debug('setapikey', key);
        this.apikey = key;
    }
*/

    getStudentPayment(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    updateStudentPayment(path, StudentPayment) {
        var self = this;
        self.$log.debug('enter updateStudentPayment before put :', StudentPayment);
        var request = self.$http({
            method: "PUT",
            url: path,
            data: StudentPayment
        });
        return (request.then(self.handleSuccess, self.handleError));

    }
    setStudentPayment(path, mystudent, myclassid, mypgmid) {
        var self = this;
        self.$log.debug('service set student class :' + myclassid);
        self.$log.debug('service set student pgm :' + mypgmid);
        var mydata = {
            "mystudent": mystudent,
            "myclassid": myclassid,
            "mypgmid": mypgmid,
        };
        self.$log.debug('service set studentx class mydata:' + JSON.stringify({ data: mydata }) + ' sent to:' + path);
        var request = self.$http({
            method: "PUT",
            url: path,
            data: mydata
        });
        return (request.then(self.handleSuccess, self.handleError));

    }
    getStudentPaymentList(path) {
        var self = this;
        var request = self.$http({
            method: "GET",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));

    }
    getClassPayList(path) {
        var self = this;
        var request = self.$http({
            method: "GET",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));

    }

    createPayer(path, thedata) {
        var self = this;
        self.$log.debug('createPayer data before :', thedata);
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
        if (!angular.isObject(response.data) ||
            !response.data.message
        ) {
            //  return( $q.reject( "An unknown error occurred." ) );
            return (null);
        }
        // Otherwise, use expected error message.
        return (response.data.message);
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    handleSuccess(response) {
        if (response.data.error === true) {
            return (response.data.message);
        }
        return (response.data);
    }


}
