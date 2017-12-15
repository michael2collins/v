(function(window,angular,$,moment) {
    'use strict';
    angular
        .module('ng-admin')
        .factory('CalUtil', CalUtil);

    CalUtil.$inject = ['$log'];

    function CalUtil( $log ) {
        var utility = {
            calActivate: calActivate,
            EventDrag: EventDrag,
            aDialog: aDialog,
            setEventOpen: setEventOpen,
            eventopen: eventopen,
            uid: uid,
            onCalendarDayClick: onCalendarDayClick,
            initCalendar: initCalendar,
            convertToMoment: convertToMoment,
            convertToMomentDST: convertToMomentDST,
            getColorByBgColor: getColorByBgColor,
            hexToComplimentary: hexToComplimentary
        };
        
        return utility;
        
        function getColorByBgColor(bgColor) {
        //
        // * Get color (black/white) depending on bgColor so it would be clearly seen.
        // * @param bgColor
        // * @returns {string}
        //
            $log.debug('getColorByBgColor', bgColor);
            if (!bgColor) { return ''; }
            return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
        }
        function hexToComplimentary(hex) {
        // hexToComplimentary : Converts hex value to HSL, shifts
        // hue by 180 degrees and then converts hex, giving complimentary color
        // as a hex value
        // @param  [String] hex : hex value  
        // @return [String] : complimentary color as hex value
        //

            // Convert hex to rgb
            // Credit to Denis http://stackoverflow.com/a/36253499/4939630
            var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length / 3 + '})', 'g')).map(function(l) { return parseInt(hex.length % 2 ? l + l : l, 16); }).join(',') + ')';

            // Get array of RGB values
            rgb = rgb.replace(/[^\d,]/g, '').split(',');

            var r = rgb[0],
                g = rgb[1],
                b = rgb[2];

            // Convert RGB to HSL
            // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
            r /= 255.0;
            g /= 255.0;
            b /= 255.0;
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2.0;

            if (max == min) {
                h = s = 0; //achromatic
            }
            else {
                var d = max - min;
                s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

                if (max == r && g >= b) {
                    h = 1.0472 * (g - b) / d;
                }
                else if (max == r && g < b) {
                    h = 1.0472 * (g - b) / d + 6.2832;
                }
                else if (max == g) {
                    h = 1.0472 * (b - r) / d + 2.0944;
                }
                else if (max == b) {
                    h = 1.0472 * (r - g) / d + 4.1888;
                }
            }

            h = h / 6.2832 * 360.0 + 0;

            // Shift hue to opposite side of wheel and convert to [0-1] value
            h += 180;
            if (h > 360) { h -= 360; }
            h /= 360;

            // Convert h s and l values into r g and b values
            // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
            if (s === 0) {
                r = g = b = l; // achromatic
            }
            else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;

                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            r = Math.round(r * 255);
            g = Math.round(g * 255);
            b = Math.round(b * 255);

            // Convert r b and g values to hex
            rgb = b | (g << 8) | (r << 16);
            return "#" + (0x1000000 | rgb).toString(16).substring(1);
        }

        function setEventOpen(calEvent,studentpick) {
            $log.debug('eventopen enter', studentpick, $("#calEventDialogpick")[0], $("#reminderCheckbox").val(calEvent.reminderCheckbox));
            $("#eventpick").val(studentpick.FullName);

            $("#eventStartd").val(moment(calEvent.start).tz('America/New_York').format('MM/DD/YYYY'));

            $("#eventStart").val(moment(new Date(calEvent.start.toString())).tz('America/New_York').format('hh:mm A z'));
            $("#eventStarttz").val(moment(new Date(calEvent.start.toString())).tz('America/New_York').format('z'));

            $("#eventEnd").val(moment(new Date(calEvent.end.toString())).tz('America/New_York').format('hh:mm A z'));
            $("#eventEndtz").val(moment(new Date(calEvent.end.toString())).tz('America/New_York').format('z'));

            $('#eventStart').timepicker('setTime', new Date(calEvent.start.toString()));
            $('#eventEnd').timepicker('setTime', new Date(calEvent.end.toString()));

            if (calEvent.reminderCheckbox === 1 || calEvent.reminderCheckbox === true) {
                $("#reminderCheckbox").val(calEvent.reminderCheckbox).prop('checked', true);
            }
            else {
                $("#reminderCheckbox").val(calEvent.reminderCheckbox).prop('checked', false);
            }
            $("#reminderInterval").val(calEvent.reminderInterval);
            //            $("#userpick").val("number:" + calEvent.userpick);
            $("#userpick").val(calEvent.userpick);

            $("#eventid").val(calEvent.eventid);

            $('#calEventDialog #eventTitle').val(calEvent.title);
            $('#calEventDialog #allday').val(
                [calEvent.className == "gbcs-partialday-event" ? "1" : "2"]
            ).prop('checked', true);
        }

        // initialize the calendar
        // -----------------------------------------------------------------
        function initCalendar(vm,studentpick) {
            //  $(document).ready(function() {
            $log.debug("callendar ready");
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                eventLimit: 3, // for all non-agenda views
                views: {
                    agenda: {
                        eventLimit: 3 // adjust to 6 only for agendaWeek/agendaDay
                    }
                },
                //        timezone: 'America/New_York',
                events: vm.events,
                //        events: getEventList(),
                timezone: 'local',
                timeFormat: 'hh:mm A z',
                selectable: true,
                selectHelper: true,
                //    viewRender : onCalendarViewRender,
                dayClick: onCalendarDayClick,
                editable: true,
                droppable: true, // this allows things to be dropped onto the calendar !!!

                drop: function(date, jsEvent, ui, resourceId) { // this function is called when something is dropped
                    $log.debug('drop entered', date, jsEvent, ui, resourceId);
                    //       $log.debug('drop entered',jsEvent.target.style.backgroundColor,date._ambigTime);

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');

                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    if (date._ambigTime === true) {
                        copiedEventObject.start = moment(date).tz('America/New_York').add(11, 'hours');
                        copiedEventObject.startd = moment(date).tz('America/New_York').add(11, 'hours').format('MM/DD/YYYY');
                    }
                    else {
                        copiedEventObject.start = moment(date).tz('America/New_York');
                        copiedEventObject.startd = moment(date).tz('America/New_York').format('MM/DD/YYYY');
                    }

                    copiedEventObject.end = moment(copiedEventObject.start).add(2, 'hours');
                    $log.debug("copied end", copiedEventObject.end);
                    copiedEventObject.backgroundColor = jsEvent.target.style.backgroundColor;
                    copiedEventObject.textColor = jsEvent.target.style.color;
                    copiedEventObject.eventtype = jsEvent.target.id;
                    var inner = jsEvent.target.innerText;
                    //        $log.debug('drop parsing',inner);
                    var innerJ, desc;
                    try {
                        innerJ = JSON.parse(inner);
                        desc = innerJ.details.name;
                    }
                    catch (e) {
                        //            $log.debug('json parse err',e);
                        innerJ = inner;
                        desc = inner;
                    }

                    copiedEventObject.title = desc;
                    copiedEventObject.description = innerJ;

                    //mlc todo, use a db inserted id 
                    vm.saveCalendarEvent(copiedEventObject).then(function() {
                        $log.debug("test looking for new eventid", vm.neweventid);
                        copiedEventObject.id = vm.neweventid;
                        copiedEventObject.eventid = vm.neweventid;

                        // render the event on the calendar
                        // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                        $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                        // is the "remove after drop" checkbox checked?
                        if ($('#drop-remove').is(':checked')) {
                            // if so, remove the element from the "Draggable Events" list
                            $(this).remove();
                        }

                    });

                },
                select: function(start, end) {
                    $log.debug('select entered', start, end);
                    $("#eventStartd").val(moment(start).tz('America/New_York').format('MM/DD/YYYY'));
                    $("#eventStart").val(moment(start).tz('America/New_York').format('hh:mm A z'));
                    $("#eventEnd").val(moment(start).tz('America/New_York').format('hh:mm A z'));
                    $log.debug('start', $("#eventStart"), 'end', $("#eventEnd"));
                    //$('#calEventDialog').dialog('open');
                },
                eventClick: function(calEvent, jsEvent, view) {
                    $log.debug('eventClick entered', calEvent, jsEvent, view);

                    //get stu name if contactid set
                    if (calEvent.contactid !== "" && calEvent.contactid !== "NULL") {
                        var path = '../v1/students/' + calEvent.contactid;
                        vm.getStudent(path).then(function(data) {
                            $log.debug("eventclick get studentname returned", data);
                            var fullname = data.FirstName + " " + data.LastName;
                            vm.setstudent({ ID: data.ID, FirstName: data.FirstName, LastName: data.LastName, FullName: fullname });
                            $log.debug("student exit in eventclick", studentpick);
                            vm.eventopen(calEvent);

                        });
                    }
                    else {
                        vm.setstudent({});
                        vm.eventopen(calEvent);
                    }

                },

                eventDrop: function(event, delta, revertFunc) {

                    $log.debug('eventdrop', event, event.title + " was dropped on " + event.startd, delta);

                    var title = event.title;
                    var startd = moment(event.startd).add(delta, 'seconds').tz('America/New_York').format('MM/DD/YYYY');
                    var start = moment(event.start).tz('America/New_York').format('hh:mm A z');
                    var end = moment(event.end).tz('America/New_York').format('hh:mm A z');

                    var reminderInterval = event.reminderInterval;
                    var userpick = event.userpick;
                    var reminderCheckbox = event.reminderCheckbox;
                    var contactid = event.contactid;
                    var eventid = event.eventid;
                    var eventclass = event.className;
                    var color = event.backgroundColor;
                    var textcolor = event.textColor;
                    var eventtype = event.eventtype;
                    var screen = $(this);

                    if (!confirm("Are you sure about this change?")) {
                        revertFunc();
                    }
                    else {

                        $log.debug('save in eventdrop');
                        $log.debug('before eventdrop calsave', screen, title, startd, start, end, reminderCheckbox, reminderInterval, userpick, true, event, contactid, eventid, eventclass, color, textcolor, eventtype);

                        vm.calsave(screen, title, startd, start, end, reminderCheckbox, reminderInterval, userpick, true, event, contactid, eventid, eventclass, color, textcolor, eventtype);

                    }

                }
            });

            var addEvent = function(name) {
                var thecolor = vm.mycolor;
                var thetextcolor = vm.textcolor;

                name = name.length === 0 ? "Untitled Event" : name;
                var html = $('<div class="external-event label label-default" style="background-color: ' +
                    thecolor + '!important; color:' + thetextcolor + ' !important;">' + name + '</div>');
                $('#event-block').append(html);
                vm.eventDrag(html);
                $log.debug('after addEvent drag', html);

            };

            $('#event-add').on('click', function() {
                var name = $('#event-name').val();
                addEvent(name);
                $log.debug('after addEvent click', name);
            });
            // });
        }

        function eventopen(calEvent,studentpick,vm,CalendarServices) {
            $log.debug('eventopen enter', studentpick, $("#calEventDialogpick")[0], $("#reminderCheckbox").val(calEvent.reminderCheckbox));
            setEventOpen(calEvent,studentpick);
            
            CalendarServices.setCurrentEvent(calEvent);
            $("#calEventDialog").dialog("option", "buttons", [{
                    text: "Update",
                    click: function() {
                        $log.debug('save in edit. note need to update', $('#eventpick'), $('#contactpicklist'), studentpick, $('#studentpick'));
                        var title = $('#eventTitle').val();
                        var startd = $('#eventStartd').val();
                        var start = $('#eventStart').val();
                        var end = $('#eventEnd').val();
                        var contactid = studentpick.ID;
                        var eventid = $('#eventid').val();
                        var eventclass = calEvent.className;
                        var color = calEvent.backgroundColor;
                        var textcolor = calEvent.textColor;
                        var eventtype = calEvent.eventtype;

                        var reminderInterval = $('#reminderInterval').val();
                        var userpick = $('#userpick').val();
                        var reminderCheckbox = $('#reminderCheckbox');
                        var screen = $(this);
                        $log.debug('before calsave', screen, title, startd, start, end, reminderCheckbox, reminderInterval, userpick, true, calEvent, contactid, eventid, eventclass, color, textcolor, eventtype);

                        vm.calsave(screen, title, startd, start, end, reminderCheckbox, reminderInterval, userpick, true, calEvent, contactid, eventid, eventclass, color, textcolor, eventtype);
                        $('#calendar').fullCalendar('unselect');

                        $(this).dialog("close");
                    }
                },
                {
                    text: "Delete",
                    click: function() {
                        $log.debug('delete event entered', calEvent);

                        vm.removeCalendarEvent(calEvent.id);
                        $('#calendar').fullCalendar('removeEvents', calEvent._id);
                        $(this).dialog("close");
                    }
                },
                {
                    text: "Cancel",
                    click: function() {
                        $(this).dialog("close");
                    }
                }
            ]);
            $("#calEventDialog").dialog("option", "title", "Edit Event");
            $('#calEventDialog').dialog('open');

        }

        function uid() {
            $log.debug("uid");
            var id = 0; return function() { 
                if (arguments[0] === 0) 
                    id = 0; 
                    return id++; 
            }; 
        }
        
        function EventDrag() {
            return function(el) {
                $log.debug("eventdrag entered", el);
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim(el.text()), // use the element's text as the event title
                    id: uid()
                };
    
                // store the Event Object in the DOM element so we can get to it later
                el.data('eventObject', eventObject);
                $log.debug('drag after EventObject', el);
    
                // make the event draggable using jQuery UI
                el.draggable({
                    zIndex: 999,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0 //  original position after the drag
                });
            };
        }
        
        function aDialog(vm) {
            return $('#adialog').dialog({
                resizable: false,
                autoOpen: false,
                title: 'Select Student',
                width: 400,
                modal: true,
                buttons: {
                    "Close": function() {
                        $log.debug("picked is", vm.studentpick2);
                        $(this).dialog("close");
                    }
                }
            });
        }
        function onCalendarDayClick(date, jsEvent, view) {
            // Check to see whether the mouse was hovering over our day corner overlay 
            // that is itself applied to the fullCalendar's selection overlay div.
            // If it is, then we know we clicked on the day number and not some other 
            // part of the cell.
            //    if ($('.my-cell-overlay-day-corner').is(':hover')) {
            //        alert('Click!');
            //    }
            $log.debug('onCalendarDayClick entered', date, jsEvent, view);
            if ($(jsEvent.target).is('td')) {
                // Clicked on the day number in the month view 
                $('#calendar').fullCalendar('changeView', 'agendaDay');
                $('#calendar').fullCalendar('gotoDate', date);
            }

        }
        function convertToMoment(thetime) {
            var testtime;
            //it has DST on the end
            if (typeof(thetime) !== 'undefined') {
                /*            if (thetime.slice(-1,thetime.length) === "T" ) {
                                testtime = new Date(thetime.slice(1,thetime.length - 4));
                            } else {
                                testtime = thetime;
                            }
                            */
                var m = moment(thetime, "MM/DD/YYYY hh:mm A z");
                $log.debug('convertToMoment: passed in: ', thetime,
                    'isvalid?', m.isValid(),
                    'where invalid', m.invalidAt());
                return moment(thetime, "MM/DD/YYYY hh:mm A z").tz('America/New_York').format('MM/DD/YYYY hh:mm A z');
                //24 hr?    return moment(testtime).utc().format("YYYY-MM-DDThh:mm:ss.SSS[Z]");
            }
        }
        function convertToMomentDST(thetime) {
            if (typeof(thetime) === 'undefined') {
                return;
            }
            //          if (moment.isMoment(thetime) === true) {
            //           return moment(thetime).tz('America/New_York').format('z');              
            //         } else {
            //      var testtime = thetime.slice(-3, thetime.length);
            //         $log.debug('convertToMomentDST',thetime,testtime);
            //        return testtime;
            return moment(thetime).tz('America/New_York').format('z');
            //         }
        }

        function calActivate() {
            $('#calEventDialog').dialog({
                resizable: false,
                autoOpen: false,
                title: 'Add Event',
                width: 400,
                buttons: {}
            });
            $('#eventStart').timepicker({
                minuteStep: 15,
                template: 'dropdown',
                modalBackdrop: 'false',
                showSeconds: false,
                showMeridian: true,
                defaultTime: false
            });
            $('#eventEnd').timepicker({
                minuteStep: 15,
                template: 'dropdown',
                modalBackdrop: 'false',
                showSeconds: false,
                showMeridian: true,
                defaultTime: false
            });
            $('#external-events div.external-event').each(function() {
    
                EventDrag($(this));
                $log.debug('external-events after drag', $(this));
    
            });
            $('#todos-list-sort > li > label.external-event').each(function() {
    
                EventDrag($(this));
                $log.debug('todos external-events after drag', $(this));
    
            });
            // Back To Top 
            $(window).scroll(function() {
                if ($(this).scrollTop() < 20) {
    //                console.log("under 150",$(this).scrollTop() );
                    $('#totop').fadeOut();
                }
                else {
    //                console.log("over 150");
                    $('#totop').fadeIn();
                }
            });
            $('#totop').on('click', function() {
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                return false;
            });

        }
            

    }
})(window,window.angular,window.$, window.moment);
