App.controller('FromLayoutsController', function($scope, $routeParams){
    var menu_h = $('#sidebar').height();
    $('#form-layouts-newweek ul.nav-pills li a').live('click', function() {
        var tab_id = $(this).attr('href');
        var tab_h = $(tab_id).height();
        if(tab_h < menu_h){
            $(tab_id).css('height', '960px');
        }
    });
});