#!/usr/bin/env node

/* eslint no-console:0 */

'use strict';

const MailParser = require('mailparser').MailParser;
const safeJsonStringify = require('safe-json-stringify');
//const util = require('util');
const https = require('https');
 require('dotenv').config();

var fs = require('fs');
let emailHead = {};
let emailBody = {};
var _input = "";
var host = process.env.host;

let parser = new MailParser();
let attachments = [];

var stream;

function extractAddress(src) {
    var safesrc = safeJsonStringify(src);
    var out = JSONParse(safesrc);
    var addr = " ";
    try {
        addr = out.value.value[0].address;
        return addr;
    }
    catch (x) {
        //     console.log('did not have addr', x);
        return addr;
    }
}

function JSONParse(text) {
    try {
        return {
            value: JSON.parse(text)
        };
    }
    catch (ex) {
        return {
            error: ex
        };
    }
}

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
        path: '/v1/message',
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

if (process.argv.length > 2) {
    console.log("using arg to process", process.argv[2]);
    stream = fs.createReadStream(process.argv[2]);
    stream.pipe(parser);
}


process.stdin.resume();
process.stdin.setEncoding("ascii");
process.stdin.on("data", function(input) {
    _input += input;
}).pipe(parser);

/*
process.stdin.on("end", function() {
    console.log("stdin end");
});
*/



parser.on('headers', headers => {
    console.log('enter headers');
//    console.log(util.inspect(headers, false, 22));
    var _to = extractAddress(headers.get('to'));
    emailHead = {
        "_subject": headers.get('subject').toString(),
        "_to": _to,
        "inout": "in",
    	 "_threadtopic": typeof(headers.get('thread-topic')) == "undefined" ? ' ' : headers.get('thread-topic').toString(),
    	 "_date": headers.get('date').toString(),
    	 "_from": extractAddress(headers.get('from')),
    	 "_returnpath": extractAddress(headers.get('return-path')),
    	 "_deliveredto": extractAddress(headers.get('delivered-to')),
    	 "_replyto": extractAddress(headers.get('reply-to')),
    	 "_cc": extractAddress(headers.get('cc')),
    	 "_bcc": extractAddress(headers.get('bcc'))
    };

});

parser.on('data', data => {
    if (data.type === 'text') {
        Object.keys(data).forEach(key => {
            if (key === 'textAsHtml') {
                emailBody = {
                    "body": data[key]
                };
            }
        });
    }
  if (data.type === 'attachment') {
        attachments.push(data);
        data.chunks = [];
        data.chunklen = 0;
        let size = 0;
        Object.keys(data).forEach(key => {
            if (typeof data[key] !== 'object' && typeof data[key] !== 'function') {
                console.log('%s: %s', key, JSON.stringify(data[key]));
            }
        });
        data.content.on('readable', () => {
            let chunk;
            while ((chunk = data.content.read()) !== null) {
                size += chunk.length;
                data.chunks.push(chunk);
                data.chunklen += chunk.length;
            }
        });

        data.content.on('end', () => {
            data.buf = Buffer.concat(data.chunks, data.chunklen);
            console.log('%s: %s B', 'size', size);
            // attachment needs to be released before next chunk of
            // message data can be processed
            data.release();
        });
    }    

});

parser.on('end', () => {

    var content = {
        "thedata": {
            "emailHead": emailHead,
            "emailBody": emailBody
        }
    };
    var thedata = JSON.stringify(content);

    console.log(thedata);


    performRequest(thedata);

});
