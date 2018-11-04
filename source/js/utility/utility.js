const { crypto: crypto } = window;
const { Uint8Array: Uint8Array } = window;
const { moment: moment } = window;

export class Util {
    constructor($log) {
        'ngInject';
        this.$log = $log;
    }
    
    convertTime(thetime) {
        var vm=this;
        if (typeof(thetime) !== 'undefined') {
            var m = moment(thetime, "MM/DD/YYYY hh:mm A z");
             vm.$log.debug('convertTime: passed in: ', thetime,
                'isvalid?', m.isValid(),
                'where invalid', m.invalidAt());
            return moment(thetime, "MM/DD/YYYY hh:mm A z").tz('America/New_York').format('MM/DD/YYYY hh:mm A z');
        }
    }

    geteFormattedDate(date) {
        var d3 = new Date(date);
        var year = d3.getFullYear();
        var month = (1 + d3.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = d3.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return year + '-' + month + '-' + day;
    }

    geteFormattedTime(date) {
        var vm = this;
        var d3 = new Date(date);
        var hour = vm.addZero(d3.getHours());
        var min = vm.addZero(d3.getMinutes());
        return hour + ':' + min;
    }


    addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    eventconvertToMoment(thetime, thedate) {
        var startd = moment(thedate).tz('America/New_York').format('MM/DD/YYYY');

        //add the time to the date
        var tststr = startd + ' ' + thetime.toString();
        return moment(tststr, 'MM/DD/YYYY hh:mm A z');

    }

    isEmptyObject(obj) {
        return (Object.getOwnPropertyNames(obj).length === 0);
    }
    
    eventdateconvert(thedate) {

        //                var startd = moment(thedate).tz('America/New_York').format('MM/DD/YYYY');

        //                vm.EventDate = moment(startd, 'MM/DD/YYYY');
        return moment(thedate).tz('America/New_York').format('MM/DD/YYYY');


    }
    convertToMoment(thetime) {
        //it has DST on the end
        if (typeof(thetime) !== 'undefined') {
            var m = moment(thetime, "MM/DD/YYYY hh:mm A z");
            return moment(thetime, "MM/DD/YYYY hh:mm A z").tz('America/New_York').format('MM/DD/YYYY hh:mm A z');
        }
    }
    convertToMomentDST(thetime) {
        if (typeof(thetime) === 'undefined') {
            return;
        }
        return moment(thetime).tz('America/New_York').format('z');
    }


    highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
        if (col.filters[0].term) {
            return 'header-filtered';
        }
        else {
            return '';
        }
    }

    //https://gist.github.com/jed/982883
    uuidv4() {
        /*jslint bitwise: true */
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    datecheckconvert(indate) {
        var testdatetimestamp = Date.parse(indate);

        if (isNaN(testdatetimestamp) == false) {
            return new Date(indate);
        }
        else {
            return new Date();
        }

    }
    maxObjArr(arr, attr) {
        this.$log.debug('maxObjArr entered', arr, attr);
        var res = Math.max.apply(Math, arr.map(function(o) { return o[attr]; }));
        return res;
    }
    getByValue(arr, value, attr, resvlu) {
        this.$log.debug('getByValue entered', arr, value, attr, resvlu);

        var result = arr.filter(function(o) { return o[attr] == value; });

        return result ? result[0][resvlu] : null; // or undefined

    }

}
