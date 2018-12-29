#!/usr/bin/env node

/* eslint no-console:0 */

'use strict';

const https = require('https');
 require('dotenv').config();

var moment = require('moment');

var host = process.env.host;
var school = process.env.school;

var invoiceDate = moment().format('YYYY-MM-DD');

function performRequest(thedata) {

    var jsonObject = thedata;

    // prepare the header
    var postheaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
    };

    // the post options
    var optionspost = {
        host: host,
        port: 443,
        path: '/v1/invoices',
        method: 'POST',
        headers: postheaders,
        rejectUnauthorized: false
    };


    // do the POST call
    var reqPost = https.request(optionspost, function(res) {
        console.log("statusCode: ", res.statusCode);
        // uncomment it for header details
        //  console.log("headers: ", res.headers);

        res.on('data', function(d) {
            console.info('POST result:\n');
            process.stdout.write(d);
            console.info('\n\nPOST completed');
        });
    });

    // write the json data
    reqPost.write(jsonObject);
    reqPost.end();
    reqPost.on('error', function(e) {
        console.error(e);
    });

}

    var content = {
        "thedata": {
            "invoiceDate": invoiceDate,
            "school": school
        }
    };

    var thedata = JSON.stringify(content);

    console.log("the data");
    console.log(thedata);


    performRequest(thedata);

