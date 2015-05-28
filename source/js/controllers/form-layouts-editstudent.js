App.controller('FormLayoutsControllerEditStudent', function($scope, $routeParams){
    var menu_h = $('#sidebar').height();
    $('#form-layouts-newstudent ul.nav-pills li a').live('click', function() {
        var tab_id = $(this).attr('href');
        var tab_h = $(tab_id).height();
        if(tab_h < menu_h){
            $(tab_id).css('height', '960px');
        }
    });
        function( StudentServices, $scope, $routeParams, $log, uiGridConstants){
            $.fn.Data.Portlet();
            var path = '../v1/students/:id';
            $log.debug('Hello Debug!');
              StudentServices.getStudent(path, function(data) {
          //  $log.debug('here too');
          //  $log.debug(data.students);
          
             $scope.students = data;
        });
});