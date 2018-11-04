import angular from 'angular';

export class CalendarServices {
    constructor($http, $q, $log, $window, moment) {
        'ngInject';

//        this.apikey={};
        this.currentCalendarEvent={};
        this.notifylist = [];
        this.intervalValue = 5000; //milli
        this.okNotify=false;
        this.checktime=null;
        this.notifyvlu=null;
        this.$http = $http;
        this.$q = $q;
        this.$log = $log;
        this.$window = $window;
        this.moment = moment;
    }        
/*        setapikey(key) {
            //     this.$log.debug('setapikey', key);
            this.apikey = key;
        }
*/
        setOkNotify(input) {
            this.notifyvlu = input;
        }

        getOkNotify() {
            return this.notifyvlu;
        }

        setIntervalValue(input) {
            this.intervalValue = input;
        }

        getIntervalValue() {
            return this.intervalValue;
        }

        schedToCal(path, thedata) {
            var self=this;
            self.$log.debug('schedToCal data before post :', thedata);
            var request = self.$http({
                method: "POST",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return (request.then(self.handleSuccess, self.handleError));
        }

        clearCal(path) {
            var self=this;
            self.$log.debug('clearCal  before delete :');
            var request = self.$http({
                method: "DELETE",
                url: path
            });
            return (request.then(self.handleSuccess, self.handleError));
        }

        transferCal(path, thedata) {
            var self=this;
            self.$log.debug('transferCal data before post :', thedata);
            var request = self.$http({
                method: "POST",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return (request.then(self.handleSuccess, self.handleError));
        }

        getAgeRangeList(path) {
            var self=this;
            self.$log.debug('getAgeRangeList service entered');
            self.$log.debug('path', path);
            var request = self.$http({
                method: "GET",
                url: path,
                ignoreLoadingBar: true
            });
            return (request.then(self.handleSuccess, self.handleError));

        }

        gettasknamelist(path) {
            var self=this;
            self.$log.debug('gettasknamelist service entered');
            self.$log.debug('path', path);
            var request = self.$http({
                method: "GET",
                url: path,
                ignoreLoadingBar: true
            });
            return (request.then(self.handleSuccess, self.handleError));

        }

        getinstructorlist(path) {
            var self=this;
            self.$log.debug('getinstructorlist service entered');
            self.$log.debug('path', path);

            return (self.$http.get(path).then(self.handleSuccess, self.handleError));
        }

        setNotifyList(list) {
            var self=this;
            self.$log.debug('entered setnotifylist', list);
            self.notifylist = list;
        }

        getNotifyList(notify) {
            //    this.$log.debug('entered getnotif', notifylist);
            this.timeCleaner(notify);
            return this.notifylist;
        }

        displaytime() {
            return this.moment(this.checktime).format('MM/DD/YYYY hh:mm A') + ' ' + 
                this.moment(this.checktime).tz('America/New_York').format('Z z');
        }

        elseSendNotification (title, options) {
            console.log('fallback notify');
            alert(title + ": " + options.body);
        }
        sendWindowNotification(title, options, optionssyn) {
            console.log('in window');
            try {
                this.$window.Notification.requestPermission().then(function(permission) {
                    console.log('requestPermission', permission);
                    if (permission !== 'granted') {
                        console.log('fallback notify from incognito');
                        alert(title + ": " + options.body);
                    }
                    else {
                        return new this.$window.Notification(title, optionssyn);
                    }
                });
            }
            catch (e) {
                console.log('notification requestPermission error', e);
            }
            
        }
        sendMozNotification(title, options, optionssyn) {
            // Gecko < 22
            console.log('in moz');
            return this.$window.navigator.mozNotification
                .createNotification(title, optionssyn.body, optionssyn.icon)
                .show();
            
        }
        sendNotification(title, options, optionssyn) {
            // Memoize based on feature detection.
            if ("Notification" in this.$window) {
                   this.sendWindowNotification(title, options, optionssyn);
            }
            else if ("mozNotification" in this.$window.navigator) {
                   this.sendMozNotification(title, options, optionssyn);
            }
            else {
                  this.elseSendNotification(title, options);
            }
            return this.sendNotification(title, options, optionssyn);
        }
        mynotify(msg) {
            this.$log.debug('notify entered', msg);
            var title = msg.title;
            var str = 'check calendar for: ' + msg.title + ' at: ' + msg.start;
            var iconstr = 'https://vdojo.villaris.us/images/notifyicon.jpg';
            this.sendNotification(title, {
                body: str,
                icon: iconstr,
                lang: 'en-US',
                tag: this.generateTag(),
                onclick: function() {
                    console.log("On Click Triggered");
                },
                onerror: function() {
                    console.log("On Error Triggered");
                },
                onclose: function() {
                    console.log("On Close Triggered");
                }
            }, {
                //                          body: syntaxHighlight(str),
                body: str,
                icon: iconstr,
                lang: 'en-US',
                tag: this.generateTag(),
                onclick: function() {
                    console.log("On Click Triggered");
                },
                onerror: function() {
                    console.log("On Error Triggered");
                },
                onclose: function() {
                    console.log("On Close Triggered");
                }
            });
        }

        //
        // *  Generate a random UUID string.
        // *  @return {String} A randomly-generated UUID string.
        //
        generateTag() {
            return [this.s4() + this.s4(), this.s4(), 
                this.s4(), this.s4(), this.s4() + this.s4()
                + this.s4()].join('-');
        }
        //
        //  Generate a random four-digit hex value.
        //
        s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16).substring(1);
        }




        timeCleaner(notify) {
            this.okNotify = notify;
            this.checktime = this.moment();
            for (var iter = 0, len = this.notifylist.length; iter < len; iter++) {
                /*                    this.$log.debug('intervalChecker: b4 if', 
                                        checktime, 
                                        okNotify, 
                                        intervalValue,
                                        listOfTimes[iter],
                                        iter, len);
                  */
                if (this.moment(this.checktime) <= this.moment(this.notifylist[iter].start).add(this.intervalValue / 1000, 'seconds') &&
                    this.moment(this.checktime) > this.moment(this.notifylist[iter].start)) {
                    this.$log.debug('intervalChecker: found in interval',
                        this.checktime,
                        this.okNotify,
                        this.intervalValue,
                        this.notifylist[iter]);
                    if (this.okNotify === true) {
                        this.$log.debug('going to notify', this.notifylist[iter]);
                        this.mynotify(this.notifylist[iter]);
                    }
                    this.notifylist[iter].remove = true;
                }
                // this.$log.debug("checking deleted event from list", listOfTimes[iter]);

                this.notifylist[iter].remove = false;
            }
            for (var niter = 0, nlen = this.notifylist.length; niter < nlen; niter++) {
                /*            this.$log.debug('intervalChecker: b4 removal if', 
                                checktime, 
                                okNotify, 
                                intervalValue,
                                listOfTimes[niter],
                                niter,nlen);
                 */
                if (typeof(this.notifylist[niter]) !== 'undefined') {
                    //i think there is a transitional period where it is in 
                    // process of being cleared that the count is wrong
                    if (
                        this.moment(this.checktime) > this.moment(this.notifylist[niter].start).add(this.intervalValue / 1000, 'seconds') ||
                        this.notifylist[niter].remove === true
                    ) {
                        //            this.$log.debug('dropping too old ones',this.notifylist[niter], checktime);
                        //remove if they were passed by in the loop above
                        this.notifylist.splice(niter, 1);
                    }
                }
            }

        }


        getCurrentEvent() {
            return this.currentCalendarEvent;
        }

        setCurrentEvent(event) {
            this.$log.debug("setCurrentEvent", event);
            this.currentCalendarEvent = event;
        }

        getCalendarEvents(path) {
            var self=this;
            self.$log.debug('getCalendarEvents service entered');
            self.$log.debug('path', path);

            return (self.$http.get(path).then(self.handleSuccess, self.handleError));
        }

        getUsers(path) {
            var self=this;
            self.$log.debug('getUsers service entered');
            self.$log.debug('path', path);

            return (self.$http.get(path).then(self.handleSuccess, self.handleError));
        }

        //add or update
        saveCalendarEvent(path, thedata) {
            var self=this;
            self.$log.debug('saveCalendarEvent data before post :', thedata);
            var request = self.$http({
                method: "POST",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return (request.then(self.handleSuccess, self.handleError));
        }

        removeCalendarEvent(path, thedata) {
            var self=this;
            self.$log.debug('removeCalendarEvent data before delete :', thedata);
            var request = self.$http({
                method: "POST",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return (request.then(self.handleSuccess, self.handleError));
        }

        updateTasknamelist(path, thedata) {
            var self=this;
            self.$log.debug('updatetasknamelist data before post :', thedata);
            var request = self.$http({
                method: "POST",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return (request.then(self.handleSuccess, self.handleError));
        }

        removeTasknamelist(path, thedata) {
            var self=this;
            self.$log.debug('removeTasknamelist data before delete :', thedata);
            var request = self.$http({
                method: "POST",
                url: path,
                data: {
                    thedata: thedata
                }
            });
            return (request.then(self.handleSuccess, self.handleError));
        }


        // ---
        // PRIVATE METHODS.
        // ---
        handleError(response) {
//            this.$log.debug('failure:');
 //           this.$log.debug(response);
  //          this.$log.debug('status', response.status);
//            this.$log.debug('config', response.config);
            //debugger;
            if (!angular.isObject(response.data) ||
                !response.data.message
            ) {
                //  return( $q.reject( "An unknown error occurred." ) );
                return (null);
            }
            // Otherwise, use expected error message.
            return (response.data.message);
        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        handleSuccess(response) {
//            this.$log.debug(' success:');
  //          this.$log.debug(response);
            return (response.data);
        }


    }
