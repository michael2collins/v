(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin')
        .directive("ngTab", function($parse, $compile) {
            return {
                link: function(scope, element, attrs) {
                    element.click(function(e) {
                        e.preventDefault();
                    });
                }
            };
        })
        .directive('myCustomDropdown', function() {
            return {
                template: '<select class="ui-grid-filter-select ui-grid-filter-input-0" ng-model="colFilter.term" ng-options="option.value as option.value for option in colFilter.options track by option.value"></select>'
            };
        })

        .directive('myCustomDropdownid', function() {
            return {
                template: '<select class="ui-grid-filter-select ui-grid-filter-input-0" ng-model="colFilter.term" ng-options="option.id as option.value for option in colFilter.options track by option.id"></select>'
            };
        })
        .directive('zoom', function($window) {

            function link(scope, element, attrs) {

                //SETUP
                var frame, image, zoomlvl, fWidth, fHeight, rect, rootDoc, offsetL, offsetT, xPosition, yPosition, pan;
                //Template has loaded, grab elements.
                scope.$watch('$viewContentLoaded', function() {
                    frame = angular.element(document.querySelector("#" + scope.frame))[0];
                    image = angular.element(document.querySelector("#" + scope.img))[0];

                    zoomlvl = (scope.zoomlvl === undefined) ? "2.5" : scope.zoomlvl;
                });



                //MOUSE TRACKER OVER IMG
                scope.trackMouse = function($event) {

                    fWidth = frame.clientWidth;
                    fHeight = frame.clientHeight;

                    rect = frame.getBoundingClientRect();
                    rootDoc = frame.ownerDocument.documentElement;

                    //calculate the offset of the frame from the top and left of the document
                    offsetT = rect.top + $window.pageYOffset - rootDoc.clientTop;
                    offsetL = rect.left + $window.pageXOffset - rootDoc.clientLeft;

                    //calculate current cursor position inside the frame, as a percentage
                    xPosition = (($event.pageX - offsetL) / fWidth) * 100;
                    yPosition = (($event.pageY - offsetT) / fHeight) * 100;

                    pan = xPosition + "% " + yPosition + "% 0";
                    image.style.transformOrigin = pan;

                };

                //MOUSE OVER | ZOOM-IN
                element.on('mouseover', function(event) {
                    image.style.transform = 'scale(' + zoomlvl + ')';
                });

                //MOUSE OUT | ZOOM-OUT
                element.on('mouseout', function(event) {
                    image.style.transform = 'scale(1)';
                });


            }

            return {
                restrict: 'EA',
                scope: {
                    src: '@src',
                    frame: '@frame',
                    img: '@img',
                    zoomlvl: '@zoomlvl'
                },
                template: [
                    '<div id="{{ frame }}" class="zoomPanFrame" >',
                    '<img id="{{ img }}" class="zoomPanImage" ng-src= "{{ src }}" ng-mousemove="trackMouse($event)"></img>',
                    '</div>'
                ].join(''),
                link: link
            };
        })
        .directive('sbLoad', ['$parse', function($parse) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    var fn = $parse(attrs.sbLoad);
                    elem.on('load', function(event) {
                        scope.$apply(function() {
                            fn(scope, { $event: event });
                        });
                    });
                }
            };
        }]);

})(window, window.angular);