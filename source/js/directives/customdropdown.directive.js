export const myCustomDropdown = () => {
    'ngInject';

            return {
                template: '<select class="ui-grid-filter-select ui-grid-filter-input-0" ng-model="colFilter.term" ng-options="option.value as option.value for option in colFilter.options track by option.value"></select>'
            };
        };
