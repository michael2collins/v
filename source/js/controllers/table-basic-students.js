App.controller('StudentsTableBasicController3', ['$scope','$http','$routeParams', function($scope, $http, $routeParams){
   $.fn.Data.Portlet();

      $scope.students = []; 
      
 //   setTimeout(function(){

       $http.get('/testdata/students.json').
         success(function(data, status, headers, config) {
             console.log('got students');
             $scope.status = status;
             $scope.students = data;
             console.log(data);
         }).
         error(function (data, status, headers, config) {
                 //  Do some error handling here
            $scope.data = data || "Request Failed";
            $scope.status = status;
         });   
  //  },50);

    /*
    setTimeout(function(){
        // Init
        var spinner = $( ".spinner" ).spinner();
        var table = $('#table_id').dataTable( {
            "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
        } );

        var tableTools = new $.fn.dataTable.TableTools( table, {
            "sSwfPath": "../vendors/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
            "buttons": [
                "copy",
                "csv",
                "xls",
                "pdf",
                { "type": "print", "buttonText": "Print me!" }
            ]
        } );
        $(".DTTT_container").css("float","right");

    },50);
*/
}]);

App.controller('StudentsTableBasicController', ['StudentServices', '$scope', '$routeParams', '$log', function( StudentServices, $scope, $routeParams, $log){
   $.fn.Data.Portlet();
   $scope.students = []; 
       
//    var path = './testdata/students.json';
    var path = '../v1/students';
    $log.debug('Hello Debug!');

    
    setTimeout(function(){
        // Init
        var spinner = $( ".spinner" ).spinner();
              
        $('#pre-selected-options').multiSelect();
        $('.selectpicker').selectpicker({
            iconBase: 'fa',
            tickIcon: 'fa-check'
        });
        $('.selectpicker2').selectpicker({
            iconBase: 'fa',
            tickIcon: 'fa-check'
        });

        $scope.limitlist = [{quantity:'10'}, {quantity:'100'}, {quantity:'all'}];
        $scope.quantity = 7;
        $scope.updateQuantity = function(quantity) {
            $scope.quantity = quantity;
            $log.debug('thenew' + quantity);
        };
        
        StudentServices.getAllStudents(path, function(data) {
//            $scope.students = data.splice(0, 5);
            $scope.students = data;
    //        $scope.students = $scope.allStudents.splice(0,5);
        });
        
    },50);
    
}]);
 