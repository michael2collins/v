(function () {
    'use strict';

    angular
        .module('ng-admin')
    .factory('CalendarServices', CalendarServices);

    CalendarServices.$inject = ['$http', '$q', '$log', '$window'];

    function CalendarServices( $http, $q, $log, $window ) {
        var apikey;
        var thetasknamelist = '';
        var response;
        var code;
        var currentCalendarEvent;
        var notifylist = [];
        var intervalValue = 5000; //milli
        var okNotify;
        var checktime;

        var service = {
  //          getAlltasknamelists: getAlltasknamelists,
             setapikey: setapikey,
             saveCalendarEvent: saveCalendarEvent,
             getCalendarEvents: getCalendarEvents,
             getUsers: getUsers,
             removeCalendarEvent: removeCalendarEvent,
            updateTasknamelist: updateTasknamelist,
            removeTasknamelist: removeTasknamelist,
            gettasknamelist: gettasknamelist,
            setCurrentEvent: setCurrentEvent,
            getCurrentEvent: getCurrentEvent,
            setNotifyList: setNotifyList,
            getNotifyList: getNotifyList,
            getIntervalValue: getIntervalValue,
            displaytime: displaytime
        };
        return service;
        
     function setapikey(key) {
   //     $log.debug('setapikey', key);
         apikey = key;
     }
        function getIntervalValue() {
            return intervalValue;
        }
        function gettasknamelist(path) {
            $log.debug('gettasknamelist service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }
        function setNotifyList(list) {
            $log.debug('entered setnotifylist', list);
            notifylist = list;
        }
        function getNotifyList(notify) {
        //    $log.debug('entered getnotif', notifylist);
            timeCleaner(notify);
            return notifylist;
        }

        function displaytime() {
            return  moment(checktime).format('MM/DD/YYYY hh:mm A') + ' ' + moment(checktime).tz('America/New_York').format('Z z'); 
        }
    

    function sendNotification(title, options) {
      // Memoize based on feature detection.
      if ("Notification" in $window) {
        sendNotification = function (title, options) {
            console.log('in window');
          try {
              $window.Notification.requestPermission().then(function(permission) {
                  console.log('requestPermission',permission);
                  if (permission !== 'granted') {
                      console.log('fallback notify from incognito');
                      alert(title + ": " + options.body);
                  } else {
                      return new $window.Notification(title, options);
                  }
              });
          } catch(e) {
              console.log('notification requestPermission error',e);
          }
            
        };
      } else if ("mozNotification" in $window.navigator) {
        sendNotification = function (title, options) {
          // Gecko < 22
          console.log('in moz');
          return $window.navigator.mozNotification
                   .createNotification(title, options.body, options.icon)
                   .show();
        };
      } else {
        sendNotification = function (title, options) {
            console.log('fallback notify');
          alert(title + ": " + options.body);
        };
      }
      return sendNotification(title, options);
    }

    
    function mynotify(msg){
        $log.debug('notify entered');
                      var title = msg.title;
                      var body = 'This is a simple demo for the notification API Angular Service';
     //                 NotifyMe.launch(title, {
                      sendNotification(title, {
                          body: body,
          icon: 'http://us.cdn2.123rf.com/168nwm/dxinerz/dxinerz1506/'
              + 'dxinerz150601488/41355464-bell-notification-call-icon-vector'
              + '-image-can-also-be-used-for-education-academics-and-science'
              + '-suitab.jpg',
          lang: 'en-US',                         
          tag: generateTag(),
                          onclick:function(){
                              console.log("On Click Triggered");
                          },
                          onerror:function(){
                              console.log("On Error Triggered");
                          },
                          onclose:function(){
                              console.log("On Close Triggered");
                          }
                      });
    }

      //
      // *  Generate a random UUID string.
      // *  @return {String} A randomly-generated UUID string.
      //
      function generateTag() {
          return [s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');
      }
      //
      //  Generate a random four-digit hex value.
      //
      function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16).substring(1);
      }

      


    function timeCleaner(notify) {
          okNotify = notify;
          checktime = moment();
          for (var iter=0,len=notifylist.length;iter<len;iter++) {
/*                    $log.debug('intervalChecker: b4 if', 
                        checktime, 
                        okNotify, 
                        intervalValue,
                        listOfTimes[iter],
                        iter, len);
  */
                if( moment(checktime) <= moment(notifylist[iter].start).
                    add(  intervalValue/1000, 'seconds')  &&
                  moment(checktime) > moment(notifylist[iter].start) ) {
                    $log.debug('intervalChecker: found in interval', 
                        checktime, 
                        okNotify, 
                        intervalValue,
                        notifylist[iter]);
                        if (okNotify === true) {
                            $log.debug('going to notify',notifylist[iter]);
                            mynotify(notifylist[iter]);
                        }
                        notifylist[iter].remove = true;
                  }
                   // $log.debug("checking deleted event from list", listOfTimes[iter]);
                  
              notifylist[iter].remove = false;
          }
          for (var niter=0,nlen=notifylist.length;niter<nlen;niter++) {
        /*            $log.debug('intervalChecker: b4 removal if', 
                        checktime, 
                        okNotify, 
                        intervalValue,
                        listOfTimes[niter],
                        niter,nlen);
         */   if (typeof(notifylist[niter]) !== 'undefined') {
                //i think there is a transitional period where it is in 
                // process of being cleared that the count is wrong
                if(
                    moment(checktime) > moment(notifylist[niter].start).
                    add(intervalValue/1000, 'seconds') ||
                    notifylist[niter].remove === true
                    ) {
                        $log.debug('dropping too old ones',notifylist[niter], checktime);
                        //remove if they were passed by in the loop above
                          notifylist.splice(niter,1);
                }
            }
           }
        
    }    


        function getCurrentEvent() {
            return currentCalendarEvent;            
        }
        function setCurrentEvent(event) {
            $log.debug("setCurrentEvent", event);
            currentCalendarEvent = event;
        }
        function getCalendarEvents(path) {
            $log.debug('getCalendarEvents service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        function getUsers(path) {
            $log.debug('getUsers service entered');
            $log.debug('path',path);

            return($http.get(path).then( handleSuccess, handleError) );
        }

        //add or update
        function saveCalendarEvent(path, thedata ) {
                    $log.debug('saveCalendarEvent data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function removeCalendarEvent(path, thedata ) {
                    $log.debug('removeCalendarEvent data before delete :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function updateTasknamelist(path, thedata ) {
                    $log.debug('updatetasknamelist data before post :' , thedata);
                    var request = $http({
                        method: "POST",
                        url: path,
                        data: {
                            thedata: thedata
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
        }        

        function removeTasknamelist(path, thedata ) {
                    $log.debug('removeTasknamelist data before delete :' , thedata);
                    var request = $http({
                        method: "POST",
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
