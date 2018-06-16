(function () {
    'use strict';

    angular
        .module('ng-admin')    
    .factory('ClassServices', ClassServices);
    
    ClassServices.$inject = ['_', '$http', '$q', '$log'];

    function ClassServices( _ , $http, $q, $log ) {
    var apikey;

    var xlistnew = [];
    var searchResult = {};
    
    var service = {
             setapikey: setapikey,
            setxlist: setxlist,
            getclass2: getclass2,
            distinctCat: distinctCat,
            distinctPgm: distinctPgm,
            distinctAge: distinctAge,
            getcat2: getcat2,
            getStudentClassList: getStudentClassList,
            getStudentClassPicture: getStudentClassPicture,
            getStudentClassPictureList: getStudentClassPictureList,
            getStudentClassStatuses: getStudentClassStatuses,
            updateStudentClass: updateStudentClass,
            getStudentClass: getStudentClass,            
            getClassPgm: getClassPgm,
            addStudentRegistration: addStudentRegistration,
            removeStudentRegistration: removeStudentRegistration,
            setStudentClass: setStudentClass,
            setClassSearchResult: setClassSearchResult,
            getPayersPartial: getPayersPartial,
            getPayerList: getPayerList,
            getFamily: getFamily,
            getListPrices: getListPrices,
            getPaymentplan: getPaymentplan,
            getPaymentplans: getPaymentplans,
            getPaymenttypes: getPaymenttypes,
            updatePaymentPlan: updatePaymentPlan,
            removePaymentPlan: removePaymentPlan,
            getClassSearchResult: getClassSearchResult,
            getPaymentpays: getPaymentpays,
            getPayerpayments: getPayerpayments,
            updatePaymentPay: updatePaymentPay,
            removePaymentPay: removePaymentPay,
            removePayer: removePayer,
            getPrograms: getPrograms,
            getClassTypes: getClassTypes,
            updateProgram: updateProgram,
            removeProgram: removeProgram,
            getClasses: getClasses,
            getRankTypes: getRankTypes,
            getRanks: getRanks,
            updateClass: updateClass,
            removeClass: removeClass,
            getBasics: getBasics,
            updateBasic: updateBasic,
            removeBasic: removeBasic,
            getAllRanks: getAllRanks,
            getRankGroups: getRankGroups,
            updateRank: updateRank,
            removeRank: removeRank,
            getClassPgms: getClassPgms,
            updateClassPgm: updateClassPgm,
            removeClassPgm: removeClassPgm,
            getClassRanks: getClassRanks,
            updateClassRank: updateClassRank,
            removeClassRank: removeClassRank,
            getTesttypes: getTesttypes,
            updateTesttype: updateTesttype,
            removeTesttype: removeTesttype,
            getClassTests: getClassTests,
            updateClassTest: updateClassTest,
            removeClassTest: removeClassTest,
            getTemplates: getTemplates,
            updateTemplate: updateTemplate,
            removeTemplate: removeTemplate
        };
        return service;

        function updateProgram(path, thedata ) {
                    $log.debug('updateProgram data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function getPrograms(path) {
            $log.debug('getPrograms service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function getClassTypes(path) {
            $log.debug('getClassTypes service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeProgram( thedata, path ) {
            $log.debug('removeProgram data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateClass(path, thedata ) {
                    $log.debug('updateClass data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function getBasics(path) {
            $log.debug('getBasics service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeBasic( thedata, path ) {
            $log.debug('removeBasic data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateBasic(path, thedata ) {
                    $log.debug('updateBasic data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function getAllRanks(path) {
            $log.debug('getRanks service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeRank( thedata, path ) {
            $log.debug('removeRank data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateRank(path, thedata ) {
                    $log.debug('updateRank data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        function getRankGroups(path) {
            $log.debug('getRankGroups service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }

        function getClasses(path) {
            $log.debug('getClasses service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function getRankTypes(path) {
            $log.debug('getRankTypes service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeClass( thedata, path ) {
            $log.debug('removeClass data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function getRanks(path) {
            $log.debug('getRanks service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }

        function getClassPgms(path) {
            $log.debug('getClassPgms service entered', path);
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeClassPgm( thedata, path ) {
            $log.debug('removeClassPgm data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateClassPgm(path, thedata ) {
                    $log.debug('updateClassPgm data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

     function setapikey(key) {
//        $log.debug('ClassServices setapikey', key);
         apikey = key;
     }
        
        function setxlist(mylist) {
            xlistnew = mylist;
            $log.debug('setxlist', xlistnew);
        }
        
        function setClassSearchResult(result){
            $log.debug('ClassServices.setClassSearchResult entered', result);
            searchResult = result;
        }
        function getClassSearchResult(){
            $log.debug('ClassServices.getClassSearchResult entered', searchResult);
            return searchResult;
        }
        function distinctAge() {
            var request = $http({
                method: "get",
                url: "../v1/classages",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function distinctPgm() {
            var request = $http({
                method: "get",
                url: "../v1/classpgms",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function distinctCat() {
            var request = $http({
                method: "get",
                url: "../v1/classcats",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

      function getcat2(catquery) {
       //   console.log("querying for");
    //      console.log(catquery);
          var results=[];
     //     console.log(xlistnew.studentclasslist.length);
           for (var i=0; i < xlistnew.studentclasslist.length; i++) {
      //         console.log(xlistnew.studentclasslist[i].classcat);
               if (xlistnew.studentclasslist[i].classcat === catquery) {
                   results.push(xlistnew.studentclasslist[i]);
               }
           }
//          console.log("the getcat query result");
 //         console.log(results);
          return results;
      }

      function getclass2(catquery) {
   //       console.log("querying for");
    //      console.log(catquery);
          var results=[];
    //      console.log(xlistnew.studentclasslist.length);
           for (var i=0; i < xlistnew.studentclasslist.length; i++) {
     //          console.log(xlistnew.studentclasslist[i].class);
               if (xlistnew.studentclasslist[i].class === catquery) {
                   results.push(xlistnew.studentclasslist[i]);
               }
           }
      //    console.log("the getclass2 query result");
    //      console.log(results);
          return results;
      }

        function getClassPgm(path) {
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        
        function getStudentClass(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }
        function updateStudentClass(path, studentclass) {
                    $log.debug('vm.data before put :', studentclass);
        var request = $http({
            method: "PUT",
            url: path,
            data: studentclass                
        });
         
        return( request.then( handleSuccess, handleError ) );
                    
        }
        function setStudentClass(path, mystudent, myclassid, mypgmid) {
                    $log.debug('service set student class :' + myclassid);
                    $log.debug('service set student pgm :' + mypgmid);
                    var mydata = {
                        "mystudent": mystudent,
                        "myclassid": myclassid,
                        "mypgmid": mypgmid,
                    };
                    $log.debug('service set studentx class mydata:' + JSON.stringify({data: mydata}) + ' sent to:' + path);
        var request = $http({
            method: "PUT",
            url: path,
            data: mydata                
        });
         
        return( request.then( handleSuccess, handleError ) );
                    
        }        
        function getStudentClassPicture(classpicturepath) {
        var request = $http({
            method: "get",
            url: classpicturepath
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }        
        function getStudentClassPictureList(classpicturepath) {
        var request = $http({
            method: "get",
            url: classpicturepath
        });
         
        return( request.then( handleSuccess, handleError ) );

        }        
        function getStudentClassList(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }
        function getStudentClassStatuses(path) {
        var request = $http({
            method: "get",
            url: path
        });
         
        return( request.then( handleSuccess, handleError ) );
            
        }
        function addStudentRegistration(path, thedata ) {
                    $log.debug('addStudentRegistration data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        function removeStudentRegistration(path, thedata ) {
            $log.debug('removeStudentRegistration data before post :', path, thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function getPayersPartial(input) {
            $log.debug('getPayersPartial service entered:',input);
            var params = {
                input: input
            };
            return $http.get(
              '../v1/payerpartial',
              {params: params}
            ).then(function(response) {
                        $log.debug('getPayersPartial service success:');
                        $log.debug(response.data);
              return response.data;
            });
        }
        function getPayerList(path) {
            $log.debug('getPayerList service entered',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getFamily(path) {
            $log.debug('getFamily service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getListPrices(path) {
            $log.debug('getListPrices service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getPaymentplan(path) {
            $log.debug('getPaymentplan service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getPaymentplans(path) {
            $log.debug('getPaymentplans service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getPaymenttypes(path) {
            $log.debug('getPaymenttypes service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function updatePaymentPlan(path, thedata ) {
                    $log.debug('updatePaymentPlan data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }         
        function removePaymentPlan(path, thedata ) {
            $log.debug('removePaymentPlan data before post :', path, thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function getPaymentpays(path) {
            $log.debug('getPaymentpays service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function getPayerpayments(path) {
            $log.debug('getPayerpayments service entered',path);
            return($http.get(path).then( handleSuccess, handleError) );
        }
        function updatePaymentPay(path, thedata ) {
                    $log.debug('updatePaymentPay data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }         
        function removePaymentPay(path, thedata ) {
            $log.debug('removePaymentPay data before post :', path, thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function removePayer(path, thedata ) {
            $log.debug('removePayer data before post :', path, thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        

        function getClassRanks(path) {
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeClassRank( thedata, path ) {
            $log.debug('removeClassRank data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateClassRank(path, thedata ) {
                    $log.debug('updateClassRank data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function getTesttypes(path) {
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeTesttype( thedata, path ) {
            $log.debug('removeTesttype data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateTesttype(path, thedata ) {
                    $log.debug('updateTesttype data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        function getClassTests(path) {
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeClassTest( thedata, path ) {
            $log.debug('removeClassTest data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateClassTest(path, thedata ) {
                    $log.debug('updateClassTest data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function getTemplates(path) {
            var request = $http({
                method: "get",
                url: path
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function removeTemplate( thedata, path ) {
            $log.debug('removeTemplate data before delete :' , thedata);
            var request = $http({
                method: "DELETE",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }        
        function updateTemplate(path, thedata ) {
                    $log.debug('updateTemplate data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        
        
        function handleError( response ) {
            $log.debug('failure:');
    
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
                return( $q.reject( "An unknown error occurred in ClassServices." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }

        function handleSuccess( response ) {
            $log.debug(' success:');
            $log.debug(response.data);
            return( response.data );
        }
        
        }
 })();  
