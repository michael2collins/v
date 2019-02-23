import angular from 'angular';

export class EventServices {
    constructor($http, $q, $log) {
        'ngInject';

        this.$http = $http;
        this.$q = $q;
        this.$log = $log;
        //       this.apikey = {};
        this.activeTab = 1; //default
        this.response;
    }

    getActiveTab() {
        return this.activeTab;
    }
    setActiveTab(thetab, thecaller) {
        this.$log.log('EventServices setActiveTab called', thetab, thecaller);
        this.activeTab = thetab;
    }

    /*     setapikey(key) {
          //  $log.log('setapikey', key);
             this.apikey = key;
         }
      */
    getEventNames(path) {
        var self = this;
        self.$log.log('getEventNames service entered');
        self.$log.log('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }

    getEventDetails(path) {
        var self = this;
        self.$log.log('getEventDetails service entered');
        self.$log.log('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }


    getEventSource(path) {
        var self = this;
        self.$log.log('getEventSource service entered');
        self.$log.log('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }

    getColDefs(path) {
        var self = this;
        self.$log.log('getColDefs service entered');
        self.$log.log('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }

    getColDefList(path) {
        var self = this;
        self.$log.log('getColDefList service entered');
        self.$log.log('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }


    setColDefs(path, thedata) {
        var self = this;
        self.$log.log('setColDefs service entered before post:', thedata);
        self.$log.log('path', path);

        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    createEvent(path, thedata) {
        var self = this;
        self.$log.log('createEvent data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    updateEvent(path, thedata) {
        var self = this;
        self.$log.log('updateEvent data before post :', thedata);
        var request = self.$http({
            method: "PUT",
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
        //debugger;
        if (!angular.isObject(response.data) ||
            !response.data.message
        ) {
            return (this.$q.reject("An unknown error occurred."));
            //return(null);
        }
        // Otherwise, use expected error message.
        return (this.$q.reject(response.data.message));
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    handleSuccess(response) {
        return (response.data);
    }


}
