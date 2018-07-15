(function (window,angular) {
    'use strict';

    angular
        .module('ng-admin.all')
        .directive('datepickerPopup', function (){
          return {
            restrict: 'EAC',
            require: 'ngModel',
            link: function(scope, element, attr, controller) {
              //remove the default formatter from the input directive to prevent conflict
              controller.$formatters.shift();
            }
          };
        })
        .directive("ngMenu", function($parse, $compile){
    return {
        link: function($scope, element, attributes){
            $scope._menu = {status:[], collapse:{}, hover:[]};

            $scope._menu.mouseleave = function(){
                for(var j=0; j<$scope._menu.hover.length; j++){
                    $scope._menu.hover[j] = '';
                }
            };
            $scope._menu.mouseover = function(i){
                for(var j=0; j<$scope._menu.hover.length; j++){
                    $scope._menu.hover[j] = '';
                }
                $scope._menu.hover[i] = 'nav-hover';
            };
            $scope._menu.collapse = function(i){
          //      console.log('collapse');
                $scope._menu.status[i] = !$scope._menu.status[i];

                var current = attributes.$$element.find('a[index='+i+']');

                current.parent('li').addClass('active').siblings().removeClass('active').children('ul').each(function(){
                    $scope._menu.status[$(this).attr('index')] = true;
                });

                if(current.hasClass('btn-fullscreen')){
                    if (!document.fullscreenElement &&
                        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement){
                        if (document.documentElement.requestFullscreen) {
                            document.documentElement.requestFullscreen();
                        } else if (document.documentElement.msRequestFullscreen) {
                            document.documentElement.msRequestFullscreen();
                        } else if (document.documentElement.mozRequestFullScreen) {
                            document.documentElement.mozRequestFullScreen();
                        } else if (document.documentElement.webkitRequestFullscreen) {
                            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                        }
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                    }
                }
            };

            attributes.$$element.find('li').children('a').each(function(index, value){
                $scope._menu.status[index] = true;
                $(this).attr({'ng-click': '_menu.collapse('+index+')', 'index':index});
                $('>ul', $(this).parent('li')).attr({'uib-collapse': '_menu.status['+index+']', 'index':index});
            });

            $(">li", attributes.$$element).each(function(index, value){
                $scope._menu.hover[index] = '';
                $(this).attr({'ng-mouseleave':'_menu.mouseleave()', 'ng-mouseover': '_menu.mouseover('+index+')', 'ng-class':'_menu.hover['+index+']'});
            });

            element.html($compile(element.html())($scope));
        }
    };
})
    .directive('itemsDrag', function()
    {
        var $ = angular.element;
       var uid = (function(){var id=0;return function(){if(arguments[0]===0)id=0;return id++;}})();

       var eventDrag = function(el){
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim(el.text()), // use the element's text as the event title
                id: uid()
            };
    
            // store the Event Object in the DOM element so we can get to it later
            el.data('eventObject', eventObject);
    
            // make the event draggable using jQuery UI
            el.draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });
        };

        return {
            link: function(scope, element, attrs)
            {
                 element.draggable();
                 eventDrag(element);

                 scope.$on('$destroy', function()
                 {
                     element.off('**');
                 });
            }
        };
    });

 })(window,window.angular);  