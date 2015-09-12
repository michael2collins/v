(function () {
    'use strict';

    angular
        .module('ng-admin')    
    .factory('ClassServices', ClassServices);
    
    ClassServices.$inject = ['_', '$http', '$log'];

    function ClassServices( _ , $http, $log ) {
      var xlist = {
        "xList": [
         {"classcat": [ 'karate' ], "agecat": ['adult'] , "programcat": ['adult' ], "classurl": 'adult.jpg',"class": 'Adult'},
         {"classcat": [ 'special' ], "agecat": ['children'] , "programcat": ['other' ], "classurl": 'afterschool.jpg',"class": 'After School'},
         {"classcat": [ 'karate' ], "agecat": ['children'] , "programcat": ['basic', 'dragon' ], "classurl": 'basicdragon.jpg',"class": 'Basic Dragon'},
         {"classcat": [ 'karate' ], "agecat": ['children'], "programcat": ['bbt1' ], "classurl": 'bbt1purple.jpg',"class": 'BBT1 - Purple - B/G'},
         {"classcat": [ 'karate' ], "agecat": ['children'], "programcat": ['basic', 'leopard' ], "classurl": 'leopards.jpg',"class": 'Basic Leopard'},
         {"classcat": [ 'karate' ], "agecat": ['children'], "programcat": ['leopard', 'bbt1' ], "classurl": 'bbt1leopard.jpg',"class": 'BBT1 Leopard'},
         {"classcat": [ 'karate' ], "agecat": ['children'], "programcat": ['bbt2' ], "classurl": 'bbt2.jpg',"class": 'BBT2 - Green'},
         {"classcat": [ 'karate' ], "agecat": ['children'], "programcat": ['bbt3' ], "classurl": 'bbt3.jpg',"class": 'BBT3 - Brown'},
         {"classcat": [ 'special' ], "agecat": ['children', 'adult'] , "programcat": ['other' ], "classurl": 'inactive.jpg',"class": 'Inactive'},
         {"classcat": [ 'special' ], "agecat": ['children', 'adult'] , "programcat": ['other' ], "classurl": 'injured.jpg',"class": 'Injured'},
         {"classcat": [ 'karate' ], "agecat": ['adult'] , "programcat": ['black' ], "classurl": 'adultblackbelt.jpg',"class": 'Blackbelt Adult'},
         {"classcat": [ 'karate' ], "agecat": ['children'], "programcat": ['black' ], "classurl": 'jrblackbelt.jpg',"class": 'Blackbelt Jr'},
         {"classcat": [ 'fitness' ], "agecat": ['children', 'adult'] , "programcat": ['other' ], "classurl": 'kickbox.jpg',"class": 'Kickboxing'},
         {"classcat": [ 'karate' ], "agecat": ['children'], "programcat": ['bbt' ], "classurl": 'multiclass.jpg',"class": 'BBT - Multiclasses'},
         {"classcat": [ 'karate' ], "agecat": ['adult'] , "programcat": ['privates' ], "classurl": 'private.jpg',"class": 'Privates Adult'},
         {"classcat": [ 'karate' ], "agecat": ['children'], "programcat": ['privates' ], "classurl": 'privatechild.jpg',"class": 'Privates Children'},
         {"classcat": [ 'karate' ], "agecat": ['children', 'adult'] , "programcat": ['other' ], "classurl": 'saturday.png',"class": 'Saturday Only'},
         {"classcat": [ 'special' ], "agecat": ['adult'] , "programcat": ['other' ], "classurl": 'selfdefence.jpg',"class": 'Self Defense'},
         {"classcat": [ 'special' ], "agecat": ['children'], "programcat": ['other' ], "classurl": 'specialneeds.jpg',"class": 'Special Needs'},
         {"classcat": [ 'wellness' ], "agecat": ['adult'] , "programcat": ['other' ], "classurl": 'taichi.jpg',"class": 'TaiChi'},
         {"classcat": [ 'fitness' ], "agecat": ['children', 'adult'] , "programcat": ['other' ], "classurl": 'zumba.jpg',"class": 'Zoomba'}

      ]};

    var service = {
            getcat: getcat,
            distinctCat: distinctCat,
            distinctPgm: distinctPgm,
            distinctAge: distinctAge,
            getcat2: getcat2,
            getAll: getAll,
			getStudentClassList: getStudentClassList,
			getStudentClassLists: getStudentClassLists,
            updateStudentClass: updateStudentClass,
            getStudentClass: getStudentClass			
        };
        return service;
        
        function distinctAge() {
            var results = _.chain( xlist.xList)
                    .pluck('agecat')
                    .forEach(function(n) {
                        _.forEach(n, function(x) {
                            return _.trim(x,'');
                        });
                    })
                    .flatten()
                    .uniq()
                    .value();
					console.log("ageresults");
              console.log(results);
			  return results;
        }
        function distinctPgm() {
            var results = _.chain( xlist.xList)
                    .pluck('programcat')
                    .forEach(function(n) {
                        _.forEach(n, function(x) {
                            return _.trim(x,'');
                        });
                    })
                    .flatten()
                    .uniq()
                    .value();
					console.log("pgmresults");
              console.log(results);
			  return results;
        }
        function distinctCat() {
            var results = _.chain( xlist.xList)
                    .pluck('classcat')
                    .forEach(function(n) {
                        _.forEach(n, function(x) {
                            return _.trim(x,'');
                        });
                    })
                    .flatten()
                    .uniq()
                    .value();
					console.log("catresults");
              console.log(results);
			  return results;
        }
      function getcat(catquery) {
          console.log("querying for");
          console.log(catquery);
          console.log(xlist.xList.length);
          var results = _.where( xlist.xList, {classcat: [catquery]});
          console.log("the getcat query result");
          console.log(results);
          return results;
      }
      
      function getcat2(catquery) {
          console.log("querying for");
          console.log(catquery);
          var results=[];
          console.log(xlist.xList.length);
           for (var i=0; i < xlist.xList.length; i++) {
               console.log(xlist.xList[i].classcat);
               if (xlist.xList[i].classcat === catquery) {
                   results.push(xlist.xList[i]);
               }
           }
          console.log("the getcat query result");
          console.log(results);
          return results;
      }
      
      function getAll() {
          return xlist;
      }

        function getStudentClass(path) {
            return $http({method: 'GET', url: path}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentClass success:' + path);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentClass failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        function updateStudentClass(path, studentclass) {
                    $log.debug('vm.data before put :' + studentclass);
            return $http({method: 'PUT', url: path, data: studentclass}).
                success(function(data, status, headers, config) {
                    $log.debug('updateStudentClass success:' + path);
                    $log.debug(data);
                  
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('updateStudentClass failure:' + path);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }	  
        function getStudentClassList(classlistpath) {
            return $http({method: 'GET', url: classlistpath}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentClassList success:' + classlistpath);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentClassList failure:' + classlistpath);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        function getStudentClassStatuses(classstatuspath) {
            return $http({method: 'GET', url: classstatuspath}).
                success(function(data, status, headers, config) {
                    $log.debug('getStudentClassStatuses success:' + classstatuspath);
                    $log.debug(data);
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    $log.debug('getStudentClassStatuses failure:' + classstatuspath);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        
        }
 })();  
