App.controller('StudentsTableBasicController3', ['$scope','$http','$routeParams','uiGridConstants', function($scope, $http, $routeParams, uiGridConstants){
   $.fn.Data.Portlet();

      $scope.students = []; 
      
 //   setTimeout(function(){
               $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
            if( col.filters[0].term ){
              return 'header-filtered';
            } else {
              return '';
            }
          };
$scope.gridOptions = {
    enableFiltering: true,
         columnDefs: [
      // default
      { field: 'name', headerCellClass: $scope.highlightFilteredHeader },
        { field: 'ID',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'LastName' ,headerCellClass: $scope.highlightFilteredHeader },
        { field: 'FirstName',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Email' ,headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Email2',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Parent',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Phone' ,headerCellClass: $scope.highlightFilteredHeader },
        { field: 'AltPhone',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Address',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'City',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'State',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'ZIP',headerCellClass: $scope.highlightFilteredHeader },
            { name: 'modallink', displayName: 'Modal', enableFiltering: false, enableSorting: false, enableHiding: false,
      cellTemplate:'<button type="button" class="btn btn-blue mrs"  data-toggle="modal" data-target="#modal-config-student-fields" >Modal</button>'},
            { name: 'editlink', displayName: 'Edit', enableFiltering: false, enableSorting: false, enableHiding: false,
      cellTemplate:'<a role="button" class="btn btn-blue mrs" href="#/form-layouts-newstudent" >Edit</button>'}

    ]

};
       $http.get('testdata/students.json').
         success(function(data, status, headers, config) {
   //          console.log('got students');
             $scope.status = status;
//             $scope.students = data;
    $scope.gridOptions.data = data;
   //          console.log(data);
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

App.controller('StudentsTableBasicController', ['StudentServices', 
    '$scope', 
    '$routeParams', 
    '$log', 'uiGridConstants',
    function( StudentServices, $scope, $routeParams, $log, uiGridConstants){
   $.fn.Data.Portlet();
//   $scope.students = []; 
       
//    var path = 'testdata/students_vsmall.json';
    var path = '../v1/students';
    $log.debug('Hello Debug!');

    
 //   setTimeout(function(){
        // Init
  //      var spinner = $( ".spinner" ).spinner();

        /* when i was controlling the list
        
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
        */
        
          $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
            if( col.filters[0].term ){
              return 'header-filtered';
            } else {
              return '';
            }
          };

$scope.gridOptions = {
    enableFiltering: true,
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,    
     columnDefs: [
      // default
      { field: 'name', headerCellClass: $scope.highlightFilteredHeader },
        { field: 'ID',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'LastName' ,headerCellClass: $scope.highlightFilteredHeader },
        { field: 'FirstName',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Email' ,headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Email2',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Parent',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Phone' ,headerCellClass: $scope.highlightFilteredHeader },
        { field: 'AltPhone',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Address',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'City',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'State',headerCellClass: $scope.highlightFilteredHeader },
        { field: 'ZIP',headerCellClass: $scope.highlightFilteredHeader },
            { name: 'modallink', displayName: 'Modal', enableFiltering: false, enableSorting: false, enableHiding: false,
      cellTemplate:'<button type="button" class="btn btn-blue mrs"  data-toggle="modal" data-target="#modal-config-student-fields" >Modal</button>'},
            { name: 'editlink', displayName: 'Edit', enableFiltering: false, enableSorting: false, enableHiding: false,
      cellTemplate:'<a role="button" class="btn btn-blue mrs" href="#/form-layouts-newstudent" >Edit</button>'}
    ]
    
};
    
          StudentServices.getAllStudents(path, function(data) {
          //  $scope.gridOptions.data = data;
            $scope.gridOptions.data = data.students;
          //  $log.debug('here too');
          //  $log.debug(data.students);
          
            //            $scope.students = data;
        });
        
//    },50);
    
}]);
 