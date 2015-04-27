App.controller('StudentsTablegoodBasicController', ['$scope','$http','$routeParams', function($scope, $http, $routeParams){
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
	   
//	var path = './testdata/students.json';
	var path = '../v1/students';
	$log.debug('Hello Debug!');

	
    setTimeout(function(){
        // Init
        var spinner = $( ".spinner" ).spinner();
/*        var table = $('#table_id').dataTable( {
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
*/
/* don't get error msg with below, but also see that angular may not work with datatables
$(document).ready(function() {
    var table = $('#table_id').DataTable();
    var tt = new $.fn.dataTable.TableTools( table, {
        sRowSelect: 'single'
    } );
 
//    $( tt.fnContainer() ).insertAfter('div.info');
        $(".DTTT_container").css("float","right");

} );
*/		
		StudentServices.getAllStudents(path, function(data) {
			$scope.students = data;
		});
		
    },50);
	
}]);
 