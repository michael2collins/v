export const NgTab = ($parse, $compile) => {
    'ngInject';
            return {
                link: function(scope, element, attrs) {
                    element.click(function(e) {
                        e.preventDefault();
                    });
                }
            };
        }
