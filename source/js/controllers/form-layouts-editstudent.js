App.controller('FormLayoutsControllerEditStudent', ['StudentServices', 
    '$scope', 
    '$routeParams', 
    '$log',
    function( StudentServices, $scope, $routeParams, $log){

        var menu_h = $('#sidebar').height();
        $('#form-layouts-editstudent ul.nav-pills li a').live('click', function() {
            var tab_id = $(this).attr('href');
            var tab_h = $(tab_id).height();
            if(tab_h < menu_h){
                $(tab_id).css('height', '960px');
            }
        });
        $.fn.Data.Portlet();
        var path = '../v1/students/' + $routeParams.id;
//        var path = '../v1/students/5340';
        $log.debug('Hello Debug!');
         $log.debug($routeParams.id);          

        StudentServices.getStudent(path, function(data) {
            $log.debug('here too');
            $log.debug(data);
          
            $scope.students = data;
        });
}]);