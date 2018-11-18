import angular from 'angular';

export class StudentServices {
    constructor($http, $q, $log) {
        'ngInject';

//        this.apikey={};

        this.activeTab = 1; //default
        this.$http = $http;
        this.$q = $q;
        this.$log = $log;
    }

    getActiveTab() {
        return this.activeTab;
    }
    setActiveTab(thetab, thecaller) {
        this.$log.debug('StudentServices setActiveTab called', thetab, thecaller);
        this.activeTab = thetab;
    }

/*    setapikey(key) {
        //        self.$log.debug('StudentServices setapikey', key);
        this.apikey = key;
    }
*/


    refreshStudents(input) {
        var self = this;
        var params = { input: input };
        return self.$http.get(
            '../v1/studentnames', { params: params }
        ).then(function(response) {
            self.$log.debug('refreshStudents service success:');
            self.$log.debug(response.data);
            return response.data;
        });
    }
    getPayerStudent(path, thedata) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path,
            params: thedata
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    getInvoices(path, thedata) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path,
            params: thedata
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    getPayments(path, thedata) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path,
            params: thedata
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    calcInvoice(path, thedata) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path,
            params: thedata
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    removeInvoice(thedata) {
        var self = this;
        self.$log.debug('removeInvoice data before post :', thedata);
        var path = "../v1/invoice";
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateInvoice(path, thedata) {
        var self = this;
        self.$log.debug('updateInvoice data before post :', thedata);
        var request = self.$http({
            method: "PUT",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    addInvoice(path, thedata) {
        var self = this;
        self.$log.debug('addInvoice data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    emailInvoice(path, thedata) {
        var self = this;
        self.$log.debug('emailInvoice data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    refreshEmails(input) {
        var self = this;
        var params = { input: input };
        var request = self.$http({
            method: "get",
            url: '../v1/emails',
            params: params
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getEmailViews(input) {
        var self = this;
        var params = { input: input };
        var request = self.$http({
            method: "get",
            url: '../v1/emailview',
            params: params
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getRankPartial(input, ranktype) {
        var self = this;
        self.$log.debug('getRankPartial service entered:', input, ranktype);
        var params = {
            input: input,
            ranktype: ranktype
        };
        return self.$http.get(
            '../v1/rankpartial', { params: params }
        ).then(function(response) {
            self.$log.debug('getRankPartial service success:');
            self.$log.debug(response.data);
            return response.data;
        });
    }
    getRank(ranktype) {
        var self = this;
        self.$log.debug('getRank service entered:', ranktype);
        var params = {
            ranktype: ranktype
        };
        return self.$http.get(
            '../v1/rank', { params: params }
        ).then(function(response) {
            self.$log.debug('getRank service success:');
            self.$log.debug(response.data);
            return response.data;
        });
    }


    getAllStudents(path) {
        var self = this;
        self.$log.debug('getAllStudents service entered');

        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    getUserPrefCols(path) {
        var self = this;
        self.$log.debug('getUserPrefCols service entered with path:', path);
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    createUserPrefCols(path, thedata) {
        var self = this;
        self.$log.debug('createUserPrefCols data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }


    getStudentHistory(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    getStudent(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));

    }

    createStudent(path, thedata) {
        var self = this;
        self.$log.debug('createStudent data before post :', thedata);
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

    addStudentRank(thedata) {
        var self = this;
        self.$log.debug('addStudentRank data before post :', thedata);
        var path = "../v1/studentrank";
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    removeStudentRank(thedata) {
        var self = this;
        self.$log.debug('removeStudentRank data before post :', thedata);
        var path = "../v1/studentrank";
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeStudent(thedata, path) {
        var self=this;
        self.$log.debug('removeStudent data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
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
//            return (this.$q.reject("An unknown error occurred."));
            return ("An unknown error occurred.");
        }
        // Otherwise, use expected error message.
//        return (response.data.message);
        return (response.data.message);
    }
    handleSuccess(response) {
        return (response.data);
    }


    updateStudent(path, students) {
        var self = this;
        self.$log.debug('updateStudent vm.data before put :', students);
        var request = self.$http({
            method: "PUT",
            url: path,
            data: students
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getAllZips(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getContactTypeCounts() {
        var self = this;
        var path = '../v1/contacttypes';
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    getStudentLists(path) {
        var self = this;
        self.$log.debug('StudentServices getStudentLists entered', this.apikey);
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getRankList(data,path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path,
            params: data
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getStudentRanks(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getStudentRankTypes(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getNotifications(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path,
            ignoreLoadingBar: true
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeNotification(thedata) {
        var self = this;
        self.$log.debug('removeNotification data before post :', thedata);
        var path = "../v1/notification";
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getEmailcount(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path,
            ignoreLoadingBar: true
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getEmailLists(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeEmailList(thedata, path) {
        var self = this;
        self.$log.debug('removeEmailList data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateEmailList(path, thedata) {
        var self = this;
        self.$log.debug('updateEmailList data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    sendEmail(path, thedata) {
        var self = this;
        self.$log.debug('send email data before post :', path, thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    removeEmailView(thedata, path) {
        var self = this;
        self.$log.debug('removeEmailView data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateEmailView(path, thedata) {
        var self = this;
        self.$log.debug('updateEmailView data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    payStripeInvoice(path, thedata) {
        var self = this;
        self.$log.debug('payStripeInvoice data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));

    }

    setsession(path, thedata) {
        var self = this;
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    storeusercred(path, thedata) {
        var self = this;
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    getStripe(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    getStripepub(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    removeStripe(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));
    }


}
