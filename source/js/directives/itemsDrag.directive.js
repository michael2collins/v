import angular from 'angular';

export const itemsDrag = () => {
    'ngInject';
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
    };
    