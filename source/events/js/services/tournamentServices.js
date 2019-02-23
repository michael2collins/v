(function () {
    'use strict';

    angular
        .module('ngadmin')
    .factory('TournamentServices', TournamentServices);

    TournamentServices.$inject = ['$http', '$q', '$log'];

    function TournamentServices( $http, $q, $log ) {
        var apikey;
        var activeTab = 2; //default
        
        var service = {
            getAllStudents: getAllStudents,
            getAllZips: getAllZips,
            getStudentLists: getStudentLists,
            getRankList: getRankList,
            updateStudent: updateStudent,
            createStudent: createStudent,
            getStudent: getStudent,
             refreshStudents: refreshStudents,
             setapikey: setapikey,
             setActiveTab: setActiveTab,
            getActiveTab: getActiveTab

        };
        return service;

        function getActiveTab() {
            return activeTab;
        }
        function setActiveTab(thetab,thecaller) {
            $log.log('TournamentServices setActiveTab called', thetab, thecaller);
            activeTab = thetab;
        }

     function setapikey(key) {
        $log.log('TournamentServices setapikey', key);
         apikey = key;
     }
 
     function refreshStudents(input) {
        var params = {input: input};
        return $http.get(
          '../v1/studentnames',
          {params: params}
        ).then(function(response) {
                    $log.log('refreshStudents service success:');
                    $log.log(response.data);
          return response.data;
        });
      }

        function getAllStudents(path) {
            $log.log('getAllStudents service entered');
                    var request = $http({
                        method: "GET",
                        url: path
                    });
                    return( request.then( handleSuccess, handleError ) );
                
        }

 
        function getStudent(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }


        function createStudent(path, thedata ) {
                    $log.log('createStudent data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                    //    params: {
                    //        action: "add"
                    //    },
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        

                // ---
                // PRIVATE METHODS.
                // ---
                // I transform the error response, unwrapping the application dta from
                // the API response payload.
                function handleError( response ) {
                    // The API response from the server should be returned in a
                    // nomralized format. However, if the request was not handled by the
                    // server (or what not handles properly - ex. server error), then we
                    // may have to normalize it on our end, as best we can.
                    $log.log('TournamentServices failure:', response);
                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    $log.log('TournamentServices detail:', response.status);
                    var status = response.status;
                    var message = response.data.message;
                    var err = {
                        status: status,
                        message: message
                    };                    
                    // Otherwise, use expected error message.
                    return( $q.reject( err ) );
                }
                // I transform the successful response, unwrapping the application data
                // from the API response payload.
                function handleSuccess( response ) {
                    $log.log(' success:');
                    $log.log(response.data);
                    return( response.data );
                }
        
                


        function updateStudent(path, students) {
                    $log.log('updateStudent vm.data before put :' , students);
        var request = $http({
            method: "PUT",
            url: path,
            data: students                
        });
         
        return( request.then( handleSuccess, handleError ) );
                    
        }
        function getAllZips(path) {
            $log.log('getAllZips entered', path, apikey);
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }

        function getStudentLists(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }
        function getRankList(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }

        }
 })();
