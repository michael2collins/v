(function () {
    'use strict';

    angular
        .module('ng-admin')    
    .factory('ClassServices', ClassServices);
    
    ClassServices.$inject = ['_', '$log'];

    function ClassServices( _ , $log ) {
      var xlist = {
        "xList": [
         {"classcat": 'karate' , "agecat": ['adult'] , "programcat": 'adult' , "classurl": 'adult.jpg',"class": 'Adult'},
         {"classcat": 'special' , "agecat": ['children'] , "programcat": 'other' , "classurl": 'afterschool.jpg',"class": 'After School'},
         {"classcat": 'karate' , "agecat": ['children'] , "programcat": 'basic dragon' , "classurl": 'basicdragon.jpg',"class": 'Basic Dragon'},
         {"classcat": 'karate' , "agecat": ['children'], "programcat": 'bbt1' , "classurl": 'bbt1purple.jpg',"class": 'BBT1 - Purple - B/G'},
         {"classcat": 'karate' , "agecat": ['children'], "programcat": 'basic leopard' , "classurl": 'leopards.jpg',"class": 'Basic Leopard'},
         {"classcat": 'karate' , "agecat": ['children'], "programcat": 'leopard bbt1' , "classurl": 'bbt1leopard.jpg',"class": 'BBT1 Leopard'},
         {"classcat": 'karate' , "agecat": ['children'], "programcat": 'bbt2' , "classurl": 'bbt2.jpg',"class": 'BBT2 - Green'},
         {"classcat": 'karate' , "agecat": ['children'], "programcat": 'bbt3' , "classurl": 'bbt3.jpg',"class": 'BBT3 - Brown'},
         {"classcat": 'special' , "agecat": ['children', 'adult'] , "programcat": 'other' , "classurl": 'inactive.jpg',"class": 'Inactive'},
         {"classcat": 'special' , "agecat": ['children', 'adult'] , "programcat": 'other' , "classurl": 'injured.jpg',"class": 'Injured'},
         {"classcat": 'karate' , "agecat": ['adult'] , "programcat": 'black' , "classurl": 'adultblackbelt.jpg',"class": 'Blackbelt Adult'},
         {"classcat": 'karate' , "agecat": ['children'], "programcat": 'black' , "classurl": 'jrblackbelt.jpg',"class": 'Blackbelt Jr'},
         {"classcat": 'fitness' , "agecat": ['children', 'adult'] , "programcat": 'other' , "classurl": 'kickbox.jpg',"class": 'Kickboxing'},
         {"classcat": 'karate' , "agecat": ['children'], "programcat": 'bbt' , "classurl": 'multiclass.jpg',"class": 'BBT - Multiclasses'},
         {"classcat": 'karate' , "agecat": ['adult'] , "programcat": 'privates' , "classurl": 'private.jpg',"class": 'Privates Adult'},
         {"classcat": 'karate' , "agecat": ['children'], "programcat": 'privates' , "classurl": 'privatechild.jpg',"class": 'Privates Children'},
         {"classcat": 'karate' , "agecat": ['children', 'adult'] , "programcat": 'other' , "classurl": 'saturday.png',"class": 'Saturday Only'},
         {"classcat": 'special' , "agecat": ['adult'] , "programcat": 'other' , "classurl": 'selfdefence.jpg',"class": 'Self Defense'},
         {"classcat": 'special' , "agecat": ['children'], "programcat": 'other' , "classurl": 'specialneeds.jpg',"class": 'Special Needs'},
         {"classcat": 'wellness' , "agecat": ['adult'] , "programcat": 'other' , "classurl": 'taichi.jpg',"class": 'TaiChi'},
         {"classcat": 'fitness' , "agecat": ['children', 'adult'] , "programcat": 'other' , "classurl": 'zumba.jpg',"class": 'Zoomba'}

      ]};

    var service = {
            getcat: getcat,
            distinctCat: distinctCat,
            distinctPgm: distinctPgm,
            distinctAge: distinctAge,
            getcat2: getcat2,
            getAll: getAll
        };
        return service;
        
        function distinctAge() {
            var retvlus =[];
            var results = _.chain( xlist.xList).uniq('agecat').pluck('agecat')
                    .forEach(function(n) {
                        var ii = _.forEach(n, function(x) {
                            console.log(x);
                            var iterim = _.trim(x,'');
                            retvlus.push( iterim);
                        });
                    })
                    .value();
            var retvlus2 = _.uniq(retvlus);        
          console.log("the distinctAge query result");
          console.log(retvlus2);
            return retvlus2;
        }
        function distinctPgm() {
            var retvlus =[];
            var results = _.chain( xlist.xList).uniq('programcat').pluck('programcat')
                    .forEach(function(n) {
                        var iterim = _.trim(n,'');
                        retvlus.push( iterim);
                    })
                    .value();
          console.log("the distinctPgm query result");
          console.log(retvlus);
            return retvlus;
        }
        function distinctCat() {
            var retvlus =[];
            var results = _.chain( xlist.xList).uniq('classcat').pluck('classcat')
                    .forEach(function(n) {
                        var iterim = _.trim(n,'');
                        retvlus.push( iterim);
                    })
                    .value();
          console.log("the distinctCat query result");
          console.log(retvlus);
            return retvlus;
        }
      function getcat(catquery) {
          console.log("querying for");
          console.log(catquery);
          console.log(xlist.xList.length);
          var results = _.where( xlist.xList, {classcat: catquery});
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

        
        }
 })();  
