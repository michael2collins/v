import angular from 'angular';

export class TemplateServices {
    constructor($http, $q, $log) {
        'ngInject';
        this.$http = $http;
        this.$q = $q;
        this.$log = $log;

//        this.apikey-{};
    }
/*    setapikey(key) {
        this.apikey = key;
    }
*/
    createtemplate(path, thedata) {
        var self = this;
        self.$log.debug('createtemplate data before post :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    removetemplate(path, thedata) {
        var self = this;
        self.$log.debug('removetemplate data before delete :', thedata);
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
        var self = this;
        self.$log.debug('updateTemplate data before put :', thedata);
        var request = self.$http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
        return (request.then(self.handleSuccess, self.handleError));
    }

    gettemplateDetails(path) {
        var self = this;
        self.$log.debug('gettemplateDetails service entered');
        self.$log.debug('path', path);

        return (self.$http.get(path).then(self.handleSuccess, self.handleError));
    }

    gettemplateNames(path) {
        var self = this;
        self.$log.debug('gettemplateNames service entered');
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
    handleSuccess(response) {
        if (response.error === true || response.data === null) {
            response.message = "templateServices error returned";
            return (this.$q.reject(response));
        }

        return (response.data);
    }


}
