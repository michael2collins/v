import angular from 'angular';

export class TestingServices {
    constructor($http, $q, $log) {
        'ngInject';

        this.$http = $http;
        this.$q = $q;
        this.$log = $log;
    //    this.apikey ={};
        this.thetasknamelist = '';
        this.code={};
        this.currentCalendarEvent={};
        this.notifylist = [];
        this.intervalValue = 5000; //milli
        this.okNotify={};
        this.checktime={};
        this.thisgrid={};
        this.thisapi={};
        this.thissrcgrid={};
        this.thissrcapi={};
        this.thisrptlayout={};
        this.testDate={};
        this.testTime={};
    }

    getActiveTab() {
        return this.activeTab;
    }
    setActiveTab(thetab, thecaller) {
        this.$log.debug('TestingServices setActiveTab called', thetab, thecaller);
        this.activeTab = thetab;
    }

    setGrid(input, api, thedate, thestart, thelayout) {
        this.thisgrid = input;
        this.thisapi = api;
        this.testDate = thedate;
        this.testTime = thestart;
        this.thisrptlayout = thelayout;
    }
    setsrcGrid(input, api, thedate, thestart) {
        this.thissrcgrid = input;
        this.thissrcapi = api;
        this.testDate = thedate;
        this.testTime = thestart;
    }
    getGrid() {
        return this.thisgrid;
    }
    getsrcGrid() {
        return this.thissrcgrid;
    }
    getGridApi() {
        return this.thisapi;
    }
    getsrcGridApi() {
        return this.thissrcapi;
    }
    getTestDate() {
        return this.testDate;
    }
    getRptLayout() {
        return this.thisrptlayout;
    }
    getTestTime() {
        return this.testTime;
    }
/*    setapikey(key) {
        this.apikey = key;
    }
*/
    getTestTypes(path) {
        var self = this;
        self.$log.debug('getTestTypes service entered');
        self.$log.debug('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    getGeneralColDefs(path) {
        var self = this;
        self.$log.debug('getGeneralColDefs service entered');
        self.$log.debug('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }

    createtestcandidate(path, thedata) {
        var self = this;
        self.$log.debug('createtestcandidate data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    removetestcandidate(path, thedata) {
        var self = this;
        self.$log.debug('removetestcandidate data before delete :', thedata);
        var request = self.$http({
            method: "DELETE",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    updateTesting(path, thedata) {
        var self = this;
        self.$log.debug('updateTesting data before put :', thedata);
        var request = self.$http({
            method: "PUT",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    updatetestcandidate(path) {
        var self = this;
        self.$log.debug('updatetestcandidate service entered');
        self.$log.debug('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    promotetestcandidate(path, thedata) {
        var self = this;
        self.$log.debug('promotetestcandidate data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    getTestDates(path) {
        var self = this;
        self.$log.debug('getTestDates service entered');
        self.$log.debug('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }

    gettestcandidateDetails(path) {
        var self = this;
        self.$log.debug('gettestcandidateDetails service entered');
        self.$log.debug('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }

    gettestcandidateNames(path) {
        var self = this;
        self.$log.debug('gettestcandidateNames service entered');
        self.$log.debug('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }
    gettestcandidateList(path) {
        var self = this;
        self.$log.debug('gettestcandidateList service entered');
        self.$log.debug('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
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
        return (response.data);
    }


}
