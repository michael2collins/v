export const leadnotRequired = () => {
    'ngInject';

    //https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L1947
    var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

    return {
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
            if (controller && controller.ContactType === "Lead" &&
                (controller.$validators.email || controller.$validators.required)) {

                // this will overwrite the default AngularJS email validator
                controller.$validators.email = function(modelValue) {
                  return controller.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
                // this will overwrite the default AngularJS required validator, type=tel has no angularjs checking
                controller.$validators.required = function(modelValue) {
                    return controller.$isEmpty(modelValue);
                };
            }
        }
    };
};
