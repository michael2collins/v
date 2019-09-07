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
        this.$log.log('StudentServices setActiveTab called', thetab, thecaller);
        this.activeTab = thetab;
    }

/*    setapikey(key) {
        //        self.$log.log('StudentServices setapikey', key);
        this.apikey = key;
    }
*/


    refreshStudents(input) {
        var self = this;
        var params = { input: input };
        return self.$http.get(
            '../v1/studentnames', { params: params }
        ).then(function(response) {
            self.$log.log('refreshStudents service success:');
            self.$log.log(response.data);
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
        self.$log.log('removeInvoice data before post :', thedata);
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
        self.$log.log('updateInvoice data before post :', thedata);
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
        self.$log.log('addInvoice data before post :', thedata);
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
        self.$log.log('emailInvoice data before post :', thedata);
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
        self.$log.log('getRankPartial service entered:', input, ranktype);
        var params = {
            input: input,
            ranktype: ranktype
        };
        return self.$http.get(
            '../v1/rankpartial', { params: params }
        ).then(function(response) {
            self.$log.log('getRankPartial service success:');
            self.$log.log(response.data);
            return response.data;
        });
    }
    getRank(ranktype) {
        var self = this;
        self.$log.log('getRank service entered:', ranktype);
        var params = {
            ranktype: ranktype
        };
        return self.$http.get(
            '../v1/rank', { params: params }
        ).then(function(response) {
            self.$log.log('getRank service success:');
            self.$log.log(response.data);
            return response.data;
        });
    }

    getAllStudents(path) {
        var self = this;
        self.$log.log('getAllStudents service entered');

        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getSampleStudents(path) {
        var self = this;
        self.$log.log('getSampleStudents service entered');

        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getSampleStudentRegistrations(path) {
        var self = this;
        self.$log.log('getSampleStudentRegistrations service entered');

        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    lookupExtas(path, thedata) {
        var self = this;
        self.$log.log('lookupExtas data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getUserPrefCols(path) {
        var self = this;
        self.$log.log('getUserPrefCols service entered with path:', path);
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    createUserPrefCols(path, thedata) {
        var self = this;
        self.$log.log('createUserPrefCols data before post :', thedata);
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
    getSampleStudenthistory(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getSampleStudentAttendance(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getStudentAttend(path) {
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
        self.$log.log('createStudent data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    addStudentRank(thedata) {
        var self = this;
        self.$log.log('addStudentRank data before post :', thedata);
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
        self.$log.log('removeStudentRank data before post :', thedata);
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
        self.$log.log('removeStudent data before delete :', thedata);
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
        self.$log.log('updateStudent vm.data before put :', students);
        var request = self.$http({
            method: "PUT",
            url: path,
            data: students
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    updateRawStudent(path, students) {
        var self = this;
        self.$log.log('updateStudent vm.data before put :', students);
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
        self.$log.log('StudentServices getStudentLists entered', this.apikey);
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
        self.$log.log('removeNotification data before post :', thedata);
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
        self.$log.log('removeEmailList data before delete :', thedata);
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
        self.$log.log('updateEmailList data before post :', thedata);
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
        self.$log.log('send email data before post :', path, thedata);
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
        self.$log.log('removeEmailView data before delete :', thedata);
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
        self.$log.log('updateEmailView data before post :', thedata);
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
        self.$log.log('payStripeInvoice data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));

    }
    payOtherInvoice(path, thedata) {
        var self = this;
        self.$log.log('payOtherInvoice data before post :', thedata);
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
    getStudentCols(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    getStudentColMap(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    updateStudentColMap(path, thedata) {
        var self=this;
        self.$log.log('updateStudentColMap data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }    
    removeCol(thedata, path) {
        var self=this;
        self.$log.log('removeCol data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
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

    createBulkStudents(path) {
        var self = this;
        var request = self.$http({
            method: "POST",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    createRawStudents(path, thedata) {
        var self = this;
        self.$log.log('createRawStudent data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    createBulkRegistrations(path) {
        var self = this;
        var request = self.$http({
            method: "POST",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    createBulkStudentHistory(path, thedata) {
        var self = this;
        self.$log.log('createBulkStudentHistory data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    createBulkStudentAttendance(path, thedata) {
        var self = this;
        self.$log.log('createBulkStudentAttendance data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeRawStudents(path) {
        var self=this;
        var request = self.$http({
            method: "DELETE",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeRawStudent(thedata, path) {
        var self=this;
        self.$log.log('removeRawStudent data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getRawStudentStatus(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    getRawRegistrationStatus(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    removeRawRegistrations(path) {
        var self=this;
        var request = self.$http({
            method: "DELETE",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeRawRegistration(thedata, path) {
        var self=this;
        self.$log.log('removeRawRegistration data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    createRawRegistrations(path, thedata) {
        var self = this;
        self.$log.log('createRawRegistrations data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateRawRegistration(path, registrations) {
        var self = this;
        self.$log.log('updateRawRegistration vm.data before put :', registrations);
        var request = self.$http({
            method: "PUT",
            url: path,
            data: registrations
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    getRawHistoryStatus(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    removeRawHistorys(path) {
        var self=this;
        var request = self.$http({
            method: "DELETE",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeRawHistory(thedata, path) {
        var self=this;
        self.$log.log('removeRawHistory data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    createRawHistorys(path, thedata) {
        var self = this;
        self.$log.log('createRawHistorys data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateRawHistory(path, historys) {
        var self = this;
        self.$log.log('updateRawHistory vm.data before put :', historys);
        var request = self.$http({
            method: "PUT",
            url: path,
            data: historys
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    getRawAttendanceStatus(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    removeRawAttendances(path) {
        var self=this;
        var request = self.$http({
            method: "DELETE",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeRawAttendance(thedata, path) {
        var self=this;
        self.$log.log('removeRawAttendance data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    createRawAttendances(path, thedata) {
        var self = this;
        self.$log.log('createRawAttendances data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateRawAttendance(path, historys) {
        var self = this;
        self.$log.log('updateRawAttendance vm.data before put :', historys);
        var request = self.$http({
            method: "PUT",
            url: path,
            data: historys
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getPayerbyEmail(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getStudentHistories(path) {
        var self = this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));
    }
    
}
