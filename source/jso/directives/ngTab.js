App.directive("ngTab", function($parse, $compile){
    return {
        link: function (scope, element, attrs) {
            element.click(function(e) {
                e.preventDefault();
            });
        }
    };
});