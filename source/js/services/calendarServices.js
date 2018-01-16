(function (window,angular) {
    'use strict';

    angular
        .module('ng-admin')
    .factory('CalendarServices', CalendarServices);

    CalendarServices.$inject = ['$http', '$q', '$log', '$window', 'moment'];

    function CalendarServices( $http, $q, $log, $window, moment ) {
        var apikey;
        var currentCalendarEvent;
        var notifylist = [];
        var intervalValue = 5000; //milli
        var okNotify;
        var checktime;
        var notifyvlu;

        var service = {
             setapikey: setapikey,
             saveCalendarEvent: saveCalendarEvent,
             getCalendarEvents: getCalendarEvents,
             getUsers: getUsers,
             removeCalendarEvent: removeCalendarEvent,
            updateTasknamelist: updateTasknamelist,
            removeTasknamelist: removeTasknamelist,
            gettasknamelist: gettasknamelist,
            getinstructorlist: getinstructorlist,
            setCurrentEvent: setCurrentEvent,
            getCurrentEvent: getCurrentEvent,
            setNotifyList: setNotifyList,
            getNotifyList: getNotifyList,
            displaytime: displaytime,
            getIntervalValue: getIntervalValue,
            setIntervalValue: setIntervalValue,
            setOkNotify: setOkNotify,
            getOkNotify: getOkNotify
        };
        return service;
        
    function setapikey(key) {
        //     $log.debug('setapikey', key);
         apikey = key;
    }
    function setOkNotify(input) {
        notifyvlu = input;
    }
    function getOkNotify() {
        return notifyvlu;
    }
    function setIntervalValue(input) {
        intervalValue = input;
    }     
    function getIntervalValue() {
        return intervalValue;
    }     
        function gettasknamelist(path) {
            $log.debug('gettasknamelist service entered');
            $log.debug('path',path);
            var request = $http({
                method: "GET",
                url: path,
                ignoreLoadingBar: true
            });
                return( request.then( handleSuccess, handleError ) );

        }
        function getinstructorlist(path) {
            $log.debug('getinstructorlist service entered');
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
    

    function sendNotification(title, options, optionssyn) {
      // Memoize based on feature detection.
      if ("Notification" in $window) {
        sendNotification = function (title, options, optionssyn) {
            console.log('in window');
          try {
              $window.Notification.requestPermission().then(function(permission) {
                  console.log('requestPermission',permission);
                  if (permission !== 'granted') {
                      console.log('fallback notify from incognito');
                      alert(title + ": " + options.body);
                  } else {
                      return new $window.Notification(title, optionssyn);
                  }
              });
          } catch(e) {
              console.log('notification requestPermission error',e);
          }
            
        };
      } else if ("mozNotification" in $window.navigator) {
        sendNotification = function (title, options, optionssyn) {
          // Gecko < 22
          console.log('in moz');
          return $window.navigator.mozNotification
                   .createNotification(title, optionssyn.body, optionssyn.icon)
                   .show();
        };
      } else {
        sendNotification = function (title, options) {
            console.log('fallback notify');
          alert(title + ": " + options.body);
        };
      }
      return sendNotification(title, options, optionssyn);
    }

    function syntaxHighlight(json) {
        if (typeof json != 'string') {
             json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
    
    function mynotify(msg){
        $log.debug('notify entered',msg);
        var title = msg.title;
        var output = {
             title: msg.title,
             start: msg.start,
             now: moment()
//             assignee: msg.userpick,
//             reminder: msg.reminderInterval,
//             type: msg.eventtype
         };
         //var str = JSON.stringify(output, undefined, 4);
         var str = 'check calendar for: ' + msg.title + ' at: ' + msg.start;
         var iconstr =  'https://natick.villaris.us/images/notifyicon.jpg';
                      sendNotification(title, {
                          body: str,
                          icon: iconstr,
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
                      },
                      {
//                          body: syntaxHighlight(str),
                          body: str,
                          icon: iconstr,
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
                      }
                      );
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
            //            $log.debug('dropping too old ones',notifylist[niter], checktime);
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
 })(window,window.angular);
