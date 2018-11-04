import angular from 'angular';

export class FlashService {
    constructor($rootScope) {
        'ngInject';

//        this.apikey={};
        this.$rootScope=$rootScope;
        this.service = {};

        this.service.Success = this.Success;
        this.service.Err = this.Err;

        this.initService();

    }
    initService() {
        var self=this;
        this.$rootScope.$on('$locationChangeStart', function() {
            self.clearFlashMessage(self);
        });
    }

    clearFlashMessage(self) {
        var flash = self.$rootScope.flash;
        if (flash) {
            if (!flash.keepAfterLocationChange) {
                delete self.$rootScope.flash;
            }
            else {
                // only keep for a single location change
                flash.keepAfterLocationChange = false;
            }
        }
    }


    Success(message, keepAfterLocationChange) {
        this.$rootScope.flash = {
            message: message,
            type: 'success',
            keepAfterLocationChange: keepAfterLocationChange
        };
    }

    Err(message, keepAfterLocationChange) {
        this.$rootScope.flash = {
            message: message,
            type: 'error',
            keepAfterLocationChange: keepAfterLocationChange
        };
    }
}
