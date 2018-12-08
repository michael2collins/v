import angular from 'angular';

export class ClassServices {
    constructor(_, $http, $q, $log) {
        'ngInject';

//        this.apikey={};

        this.xlistnew = [];
        this.searchResult = {};
        this.$q = $q;
        this.$log = $log;
        this._ = _;
        this.$http = $http;
    }
    updateProgram(path, thedata) {
        var self=this;
        self.$log.debug('updateProgram data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getPrograms(path) {
        var self=this;
        self.$log.debug('getPrograms service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getClassTypes(path) {
        var self=this;
        self.$log.debug('getClassTypes service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeProgram(thedata, path) {
        var self=this;
        self.$log.debug('removeProgram data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateClass(path, thedata) {
        var self=this;
        self.$log.debug('updateClass data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getBasics(path) {
        var self=this;
        self.$log.debug('getBasics service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeBasic(thedata, path) {
        var self=this;
        self.$log.debug('removeBasic data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateBasic(path, thedata) {
        var self=this;
        self.$log.debug('updateBasic data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getAllRanks(path) {
        var self=this;
        self.$log.debug('getRanks service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeRank(thedata, path) {
        var self=this;
        self.$log.debug('removeRank data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateRank(path, thedata) {
        var self=this;
        self.$log.debug('updateRank data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getRankGroups(path) {
        var self=this;
        self.$log.debug('getRankGroups service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getClasses(path) {
        var self=this;
        self.$log.debug('getClasses service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getRankTypes(path) {
        var self=this;
        self.$log.debug('getRankTypes service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getPicklist(path) {
        var self=this;
        self.$log.debug('getPicklist service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    
    removeClass(thedata, path) {
        var self=this;
        self.$log.debug('removeClass data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getRanks(path) {
        var self=this;
        self.$log.debug('getRanks service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getClassPgms(path) {
        var self=this;
        self.$log.debug('getClassPgms service entered', path);
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeClassPgm(thedata, path) {
        var self=this;
        self.$log.debug('removeClassPgm data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateClassPgm(path, thedata) {
        var self=this;
        self.$log.debug('updateClassPgm data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
/*
    setapikey(key) {
        //        this.$log.debug('ClassServices setapikey', key);
        this.apikey = key;
    }
*/
    setxlist(mylist) {
        this.xlistnew = mylist;
        this.$log.debug('setxlist', this.xlistnew);
    }

    setClassSearchResult(result) {
        this.$log.debug('ClassServices.setClassSearchResult entered', result);
        this.searchResult = result;
    }
    getClassSearchResult() {
        this.$log.debug('ClassServices.getClassSearchResult entered', this.searchResult);
        return this.searchResult;
    }
    distinctAge() {
        var request = this.$http({
            method: "get",
            url: "../v1/classages",
            params: {
                action: "get"
            }
        });
        return (request.then(this.handleSuccess, this.handleError));
    }

    distinctPgm() {
        var self=this;
        var request = self.$http({
            method: "get",
            url: "../v1/classpgms",
            params: {
                action: "get"
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    distinctCat() {
        var self=this;
        var request = self.$http({
            method: "get",
            url: "../v1/classcats",
            params: {
                action: "get"
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getcat2(catquery) {
        //   console.log("querying for");
        //      console.log(catquery);
        var results = [];
        //     console.log(xlistnew.studentclasslist.length);
        for (var i = 0; i < this.xlistnew.studentclasslist.length; i++) {
            //         console.log(xlistnew.studentclasslist[i].classcat);
            if (this.xlistnew.studentclasslist[i].classcat === catquery) {
                results.push(this.xlistnew.studentclasslist[i]);
            }
        }
        //          console.log("the getcat query result");
        //         console.log(results);
        return results;
    }

    getclass2(catquery) {
        //       console.log("querying for");
        //      console.log(catquery);
        var results = [];
        //      console.log(xlistnew.studentclasslist.length);
        for (var i = 0; i < this.xlistnew.studentclasslist.length; i++) {
            //          console.log(xlistnew.studentclasslist[i].class);
            if (this.xlistnew.studentclasslist[i].class === catquery) {
                results.push(this.xlistnew.studentclasslist[i]);
            }
        }
        //    console.log("the getclass2 query result");
        //      console.log(results);
        return results;
    }

    getClassPgm(path) {
        var self=this;
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getStudentClass(path) {
        var self=this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    updateStudentClass(path, studentclass) {
        var self=this;
        self.$log.debug('vm.data before put :', studentclass);
        var request = self.$http({
            method: "PUT",
            url: path,
            data: studentclass
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    /*
    setStudentClass(path, mystudent, myclassid, mypgmid) {
        var self=this;
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
*/
    getStudentClassPicture(classpicturepath) {
        var self=this;
        var request = self.$http({
            method: "get",
            url: classpicturepath
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getStudentClassPictureList(classpicturepath) {
        var self=this;
        var request = self.$http({
            method: "get",
            url: classpicturepath
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getStudentClassList(path) {
        var self=this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    getStudentClassStatuses(path) {
        var self=this;
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }
    addStudentRegistration(path, thedata) {
        var self=this;
        self.$log.debug('addStudentRegistration data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeStudentRegistration(path, thedata) {
        var self=this;
        self.$log.debug('removeStudentRegistration data before post :', path, thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getPayersPartial(input) {
        var self=this;
        self.$log.debug('getPayersPartial service entered:', input);
        var params = {
            input: input
        };
        return self.$http.get(
            '../v1/payerpartial', { params: params }
        ).then(function(response) {
            self.$log.debug('getPayersPartial service success:');
            self.$log.debug(response.data);
            return response.data;
        });
    }
    getPayerList(path) {
        var self=this;
        self.$log.debug('getPayerList service entered', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    getFamily(path) {
        var self=this;
        self.$log.debug('getFamily service entered', path);
        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    getListPrices(path) {
        var self=this;
        self.$log.debug('getListPrices service entered', path);
        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    getPaymentplan(path) {
        var self=this;
        self.$log.debug('getPaymentplan service entered', path);
        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    getPaymentplans(path) {
        var self=this;
        self.$log.debug('getPaymentplans service entered', path);
        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    getPaymenttypes(path) {
        var self=this;
        self.$log.debug('getPaymenttypes service entered', path);
        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    updatePaymentPlan(path, thedata) {
        var self=this;
        self.$log.debug('updatePaymentPlan data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removePaymentPlan(path, thedata) {
        var self=this;
        self.$log.debug('removePaymentPlan data before post :', path, thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getPaymentpays(path) {
        var self=this;
        self.$log.debug('getPaymentpays service entered', path);
        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    getPayerpayments(path) {
        var self=this;
        self.$log.debug('getPayerpayments service entered', path);
        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    updatePaymentPay(path, thedata) {
        var self=this;
        self.$log.debug('updatePaymentPay data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removePaymentPay(path, thedata) {
        var self=this;
        self.$log.debug('removePaymentPay data before post :', path, thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removePayer(path, thedata) {
        var self=this;
        self.$log.debug('removePayer data before post :', path, thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getClassRanks(path) {
        var self=this;
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeClassRank(thedata, path) {
        var self=this;
        self.$log.debug('removeClassRank data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateClassRank(path, thedata) {
        var self=this;
        self.$log.debug('updateClassRank data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getTesttypes(path) {
        var self=this;
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeTesttype(thedata, path) {
        var self=this;
        self.$log.debug('removeTesttype data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateTesttype(path, thedata) {
        var self=this;
        self.$log.debug('updateTesttype data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    getClassTests(path) {
        var self=this;
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeClassTest(thedata, path) {
        var self=this;
        self.$log.debug('removeClassTest data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateClassTest(path, thedata) {
        var self=this;
        self.$log.debug('updateClassTest data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getTemplates(path) {
        var self=this;
        var request = self.$http({
            method: "get",
            url: path
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeTemplate(thedata, path) {
        var self=this;
        self.$log.debug('removeTemplate data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    updateTemplate(path, thedata) {
        var self=this;
        self.$log.debug('updateTemplate data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getQuickpicks(path) {
        var self=this;
        self.$log.debug('getQuickpicks service entered', path);
        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    getQuickpick(path) {
        var self=this;
        self.$log.debug('getQuickpick service entered', path);
        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    updateQuickpick(path, thedata) {
        var self=this;
        self.$log.debug('updateQuickpick data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }
    removeQuickpick(path, thedata) {
        var self=this;
        self.$log.debug('removeQuickpick data before post :', path, thedata);
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
            !response.data
        ) {
            //todo, need to figure out if we can pass this in the function and not interfere with response
            //return (this.$q.reject("An unknown error occurred in ClassServices."));
            return response;
        }
        // Otherwise, use expected error message.
        return (response.data);
    }

    handleSuccess(response) {
//        this.$log.debug(' success:');
 //       this.$log.debug(response.data);
        return (response.data);
    }

}
