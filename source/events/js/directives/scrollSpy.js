(function () {
    'use strict';

    angular
        .module('ng-admin')
.directive("scrollSpy", function($window){
    return {
        restrict: 'A',
        controller: function ($scope) {
            $scope.spies = [];
            this.addSpy = function (spyObj) {
                $scope.spies.push(spyObj);
            };
        },
        link: function (scope, elem, attrs) {
            function toggleChevron(e) {
                $(e.target)
                    .prev('.panel-heading')
                    .find("i.indicator")
                    .toggleClass('glyphicon-chevron-left glyphicon-chevron-down');
            }
            $('#accordion1').on('hidden.bs.collapse', toggleChevron);
            $('#accordion1').on('shown.bs.collapse', toggleChevron);
            //END ACCORDION WITH ICONS

            //BEGIN JQUERY SLIMSCROLL
            $('.scrollspy-example').slimScroll({
                "height": "200",
                "railVisible": true,
                "alwaysVisible": true
            });
            //END JQUERY SLIMSCROLL
        }
    };
})

.directive('spy', function ($location, $anchorScroll){
    return {
        restrict: "A",
        require: "^scrollSpy",
        link: function(scope, elem, attrs, affix) {
            elem.click(function () {
                $location.hash(attrs.spy);
                $anchorScroll();
            });

            affix.addSpy({
                id: attrs.spy,
                in: function() {
                    elem.addClass('active');
                },
                out: function() {
                    elem.removeClass('active');
                }
            });
        }
    };
});
 })();  