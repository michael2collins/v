(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('TestingServices', TestingServices);

    TestingServices.$inject = ['$http', '$q', '$log', '$window'];

    function TestingServices( $http, $q, $log, $window ) {
        var apikey;
        var thetasknamelist = '';
        var response;
        var code;
        var currentCalendarEvent;
        var notifylist = [];
        var intervalValue = 5000; //milli
        var okNotify;
        var checktime;
        var thisgrid;
        var thisapi;
        var thissrcgrid;
        var thissrcapi;
        var thisrptlayout;
        var testDate;
        var testTime;

        var service = {
  //          getAlltasknamelists: getAlltasknamelists,
             setapikey: setapikey,
             getTestTypes: getTestTypes,
             gettestcandidateDetails: gettestcandidateDetails,
             gettestcandidateList: gettestcandidateList,
             gettestcandidateNames: gettestcandidateNames,
             createtestcandidate: createtestcandidate,
             removetestcandidate: removetestcandidate,
             updatetestcandidate: updatetestcandidate,
             promotetestcandidate: promotetestcandidate,
             updateTesting: updateTesting,
             getTestDates: getTestDates,
             setGrid: setGrid,
             getGrid: getGrid,
             getGridApi: getGridApi,
             setsrcGrid: setsrcGrid,
             getsrcGrid: getsrcGrid,
             getsrcGridApi: getsrcGridApi,
             getRptLayout: getRptLayout,
             getTestDate: getTestDate,
             getTestTime: getTestTime,
             getGeneralColDefs: getGeneralColDefs
        };
        return service;

        function setGrid(input,api,thedate,thestart,thelayout) {
            thisgrid = input;
            thisapi = api;
            testDate = thedate;
            testTime = thestart;
            thisrptlayout = thelayout;
        }
        function setsrcGrid(input,api,thedate,thestart) {
            thissrcgrid = input;
            thissrcapi = api;
            testDate = thedate;
            testTime = thestart;
        }
        function getGrid() {
            return thisgrid;
        }
        function getsrcGrid() {
            return thissrcgrid;
        }
        function getGridApi() {
            return thisapi;
        }
        function getsrcGridApi() {
            return thissrcapi;
        }
        function getTestDate() {
            return testDate;
        }
        function getRptLayout(){
            return thisrptlayout;
        }
        function getTestTime() {
            return testTime;
        }
         function setapikey(key) {
       //     $log.debug('setapikey', key);
             apikey = key;
        }
        
        function getTestTypes(path) {
            $log.debug('getTestTypes service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getGeneralColDefs(path) {
            $log.debug('getGeneralColDefs service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function createtestcandidate(path, thedata ) {
                    $log.debug('createtestcandidate data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function removetestcandidate(path, thedata ) {
                    $log.debug('removetestcandidate data before delete :' , thedata);
                    var request = $http({
                        method: "DELETE",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function updateTesting(path, thedata ) {
                    $log.debug('updateTesting data before put :' , thedata);
                    var request = $http({
                        method: "PUT",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        
        function updatetestcandidate(path) {
            $log.debug('updatetestcandidate service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        function promotetestcandidate(path, thedata ) {
                    $log.debug('promotetestcandidate data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function getTestDates(path) {
            $log.debug('getTestDates service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function gettestcandidateDetails(path) {
            $log.debug('gettestcandidateDetails service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function gettestcandidateNames(path) {
            $log.debug('gettestcandidateNames service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        function gettestcandidateList(path) {
            $log.debug('gettestcandidateList service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        // ---
        // PRIVATE METHODS.
        // ---
        function handleError( response ) {
            $log.debug('failure:');
            $log.debug(response);
            $log.debug('status',response.status);
            $log.debug('config',response.config);
            //debugger;
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
              //  return( $q.reject( "An unknown error occurred." ) );
              return(null);
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {
            $log.debug(' success:');
            $log.debug(response);
            return( response.data );
        }


        }
 })();
