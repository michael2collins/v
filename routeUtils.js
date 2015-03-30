var fs = require("fs");
var rootUri = "";

//automatically updates the baseURI link in any returned json
//to have the same Host. This allows the data to be moved
//to a different server without having to manually modify all
//the test data files

var updateBaseURI = function (json, domain) {

    if (json.entities) {
        for (var i = 0; i < json.entities.length; i++) {
            updateBaseURI(json.entities[i], domain);
        }
    }

    if (json.links) {
        for (var i = 0; i < json.links.length; i++) {
            var link = json.links[i];
            if (link.rel[0] === "baseUri") {
                link.href = domain + rootUri;
            }
        }
    }
};

exports.setRootUri = function(val) {
    rootUri = val;
};

/**
 * Reads a file and sends the JSON contents as the response. Optionally
 * pass a function to call after parsing the JSON file but before sending
 * to the client.
 *
 * @param fileName - Full file name to read
 * @param req - the http request
 * @param res - the http response
 * @param postParse - the optional function to call before sending the data back
 *              this function will get a single argument tha tis the parse JS object
 */
exports.readFileAndSend = function (fileName, req, res, postParse, code) {
    var file = fileName;
    if  (!code) {
        code = 200;
    }
    fs.exists(file, function (existence) {
        if (existence) {
            fs.readFile(file, function (err, data) {
                if (err) {
                    res.send(500);
                } else {
                    var json = JSON.parse(data);
                    if (postParse) {
                        postParse(json);
                    }

                    //update all the "baseUri" references
                    var requestURL = req.protocol + '://' + req.get('Host');
                    updateBaseURI(json, requestURL);
                    res.send(json, code);
                }
            });
        } else {
            console.log("couldn't find file: " + fileName);
            res.send(404);
        }
    });
};

exports.success = function (req, res) {
    res.send(200);
},

    exports.fail = function (req, res, data, code) {
        if (!code) {
            code = 404;
        }
        if (data) {
            res.send(data, code);
        } else {
            res.send(code);
        }

    };