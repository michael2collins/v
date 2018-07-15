(function (window, angular) {
    'use strict';

    angular
        .module('ng-admin.all')
    .factory('StudentServices', StudentServices);

    StudentServices.$inject = ['$http', '$q', '$log'];

    function StudentServices( $http, $q, $log ) {
        var apikey;
        
        var activeTab = 1; //default
        var service = {
             setapikey: setapikey,
            getAllStudents: getAllStudents,
            getAllZips: getAllZips,
            getStudentLists: getStudentLists,
            getStudentHistory: getStudentHistory,
            getRankList: getRankList,
            getStudentRanks: getStudentRanks,
            addStudentRank: addStudentRank,
            removeStudentRank: removeStudentRank,
            getStudentRankTypes: getStudentRankTypes,
            updateStudent: updateStudent,
            getStudent: getStudent,
            getRankPartial: getRankPartial,
            getRank: getRank,
            setActiveTab: setActiveTab,
            getContactTypeCounts: getContactTypeCounts,
            getActiveTab: getActiveTab,
            createStudent: createStudent,
            getUserPrefCols: getUserPrefCols,
            refreshStudents: refreshStudents,
            createUserPrefCols: createUserPrefCols,
            getNotifications: getNotifications,
            removeNotification: removeNotification,
            sendEmail: sendEmail,
            refreshEmails: refreshEmails,
            getEmailcount: getEmailcount,
            updateEmailList: updateEmailList,
            removeEmailList: removeEmailList,
            getEmailLists: getEmailLists,
            getEmailViews: getEmailViews,
            removeEmailView: removeEmailView,
            updateEmailView: updateEmailView,
            getPayerStudent: getPayerStudent,
            getInvoices: getInvoices,
            updateInvoice: updateInvoice,
            addInvoice: addInvoice,
            emailInvoice: emailInvoice,
            removeInvoice: removeInvoice,
            calcInvoice: calcInvoice,
            getPayments: getPayments,
            payStripeInvoice: payStripeInvoice,
            setsession: setsession,
            storeusercred: storeusercred,
            getStripe: getStripe,
            getStripepub: getStripepub,
            removeStripe: removeStripe
        };
        return service;


        function getActiveTab() {
            return activeTab;
        }
        function setActiveTab(thetab,thecaller) {
            $log.debug('StudentServices setActiveTab called', thetab, thecaller);
            activeTab = thetab;
        }

     function setapikey(key) {
//        $log.debug('StudentServices setapikey', key);
         apikey = key;
     }

        

     function refreshStudents(input) {
        var params = {input: input};
        return $http.get(
          '../v1/studentnames',
          {params: params}
        ).then(function(response) {
                    $log.debug('refreshStudents service success:');
                    $log.debug(response.data);
          return response.data;
        });
      }
     function getPayerStudent(path, thedata) {
        var request = $http({
            method: "get",
            url: path,
            params: thedata                
        });
         
        return( request.then( handleSuccess, handleError ) );
      }
     function getInvoices(path, thedata) {
        var request = $http({
            method: "get",
            url: path,
            params: thedata                
        });
         
        return( request.then( handleSuccess, handleError ) );
      }
     function getPayments(path, thedata) {
        var request = $http({
            method: "get",
            url: path,
            params: thedata                
        });
         
        return( request.then( handleSuccess, handleError ) );
      }
     function calcInvoice(path, thedata) {
        var request = $http({
            method: "get",
            url: path,
            params: thedata                
        });
         
        return( request.then( handleSuccess, handleError ) );
      }
        function removeInvoice( thedata ) {
            $log.debug('removeInvoice data before post :' , thedata);
            var path = "../v1/invoice";
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateInvoice(path, thedata ) {
                    $log.debug('updateInvoice data before post :' , thedata);
                    var request = $http({
                        method: "PUT",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        function addInvoice(path, thedata ) {
                    $log.debug('addInvoice data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        function emailInvoice(path, thedata ) {
                    $log.debug('emailInvoice data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
      
     function refreshEmails(input) {
        var params = {input: input};
        var request = $http({
            method: "get",
            url: '../v1/emails',
            params: params                
        });
        return( request.then( handleSuccess, handleError ) );
      }
     function getEmailViews(input) {
        var params = {input: input};
        var request = $http({
            method: "get",
            url: '../v1/emailview',
            params: params                
        });
        return( request.then( handleSuccess, handleError ) );
      }

     function getRankPartial(input,ranktype) {
                    $log.debug('getRankPartial service entered:',input,ranktype);
        var params = {
            input: input,
            ranktype: ranktype
        };
        return $http.get(
          '../v1/rankpartial',
          {params: params}
        ).then(function(response) {
                    $log.debug('getRankPartial service success:');
                    $log.debug(response.data);
          return response.data;
        });
      }
     function getRank(ranktype) {
                    $log.debug('getRank service entered:',ranktype);
        var params = {
            ranktype: ranktype
        };
        return $http.get(
          '../v1/rank',
          {params: params}
        ).then(function(response) {
                    $log.debug('getRank service success:');
                    $log.debug(response.data);
          return response.data;
        });
      }


        function getAllStudents(path) {
            $log.debug('getAllStudents service entered');
            
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }

        function getUserPrefCols(path) {
            $log.debug('getUserPrefCols service entered with path:', path);
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }

        function createUserPrefCols(path, thedata ) {
                    $log.debug('createUserPrefCols data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        


        function getStudentHistory(path) {
        var request = $http({
            method: "get",
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
                    $log.debug('createStudent data before post :' , thedata);
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

        function addStudentRank( thedata ) {
            $log.debug('addStudentRank data before post :' , thedata);
            var path = "../v1/studentrank";
            var request = $http({
                method: "POST",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function removeStudentRank( thedata ) {
            $log.debug('removeStudentRank data before post :' , thedata);
            var path = "../v1/studentrank";
            var request = $http({
                method: "DELETE",
                url: path,
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
                    $log.debug('failure:');

                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    // Otherwise, use expected error message.
                    return( $q.reject( response.data.message ) );
                }
                // I transform the successful response, unwrapping the application data
                // from the API response payload.
                function handleSuccess( response ) {
                    $log.debug(' success:');
                    $log.debug(response.data);
                    return( response.data );
                }
        

        function updateStudent(path, students) {
                    $log.debug('updateStudent vm.data before put :' , students);
        var request = $http({
            method: "PUT",
            url: path,
            data: students                
        });
         
        return( request.then( handleSuccess, handleError ) );
                    
        }
        function getAllZips(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }
        function getContactTypeCounts() {
            var path='../v1/contacttypes';
        var request = $http({
            method: "get",
            url: path
            });
         
        return( request.then( handleSuccess, handleError ) );
            
        }
        
        function getStudentLists(path) {
            $log.debug('StudentServices getStudentLists entered', apikey);
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
        function getStudentRanks(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }
        function getStudentRankTypes(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }
        function getNotifications(path) {
            var request = $http({
                method: "get",
                url: path,
                ignoreLoadingBar: true
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeNotification( thedata ) {
            $log.debug('removeNotification data before post :' , thedata);
            var path = "../v1/notification";
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function getEmailcount(path) {
            var request = $http({
                method: "get",
                url: path,
                ignoreLoadingBar: true
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function getEmailLists(path) {
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeEmailList( thedata, path ) {
            $log.debug('removeEmailList data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateEmailList(path, thedata ) {
                    $log.debug('updateEmailList data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function sendEmail(path, thedata ) {
            $log.debug('send email data before post :' , path, thedata);
            var request = $http({
                method: "POST",
                url: path,
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function removeEmailView( thedata, path ) {
            $log.debug('removeEmailView data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateEmailView(path, thedata ) {
                    $log.debug('updateEmailView data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        function payStripeInvoice(path, thedata) {
                    $log.debug('payStripeInvoice data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
            
        }
        
     function setsession(path, thedata) {
        var request = $http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
         
        return( request.then( handleSuccess, handleError ) );
      }
     function storeusercred(path, thedata) {
        var request = $http({
            method: "POST",
            url: path,
            data: {
                thedata: thedata
            }
        });
         
        return( request.then( handleSuccess, handleError ) );
      }
     function getStripe(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
      }
     function getStripepub(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
      }
     function removeStripe(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
      }
        

        }
 })(window, window.angular);
