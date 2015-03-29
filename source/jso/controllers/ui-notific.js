App.controller('UiNotific8Controller', function($scope, $routeParams){
    $('#message_trigger_ok').on('click', function(e) {
        e.preventDefault();
        $.scojs_message('The system has been updated with many new features', $.scojs_message.TYPE_OK);
     });
    $('#message_trigger_err').on('click', function(e) {
        e.preventDefault();
        $.scojs_message('The system is not working for maintenance', $.scojs_message.TYPE_ERROR);
    });
    /**
     * @file notific8.js
     * @author Will Steinmetz
     */

    if (!window.WS) {
        window.WS = {};
    }

    if (!WS.hasOwnProperty('jQuery')) {
        WS.jQuery = {};
    }

    WS.jQuery.notific8 = {
        init: function() {
            $('button#notific8Test').click(function(event) {
                var settings = {
                        theme: $('select#notific8Theme').val(),
                        sticky: $('input#notific8Sticky').is(':checked'),
                        horizontalEdge: $('select#notific8horizontal').val(),
                        verticalEdge: $('select#notific8vertical').val()
                    },
                    $button = $(this);
                
                if ($.trim($('input#notific8Heading').val()) !== '') {
                    settings.heading = $.trim($('input#notific8Heading').val());
                }
                
                if (!settings.sticky) {
                    settings.life = $('select#notific8Life').val();
                }
                
                $.notific8($.trim($('input#notific8Text').val()), settings);
                
                $button.attr('disabled', 'disabled');
                
                setTimeout(function() {
                    $button.removeAttr('disabled');
                }, 1000);
            });
        }
    };

    $(function() {
        WS.jQuery.notific8.init();
    });

});