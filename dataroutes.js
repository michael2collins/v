/**
 *
 * These routes are moved to their own module to make it easier to deploy
 * this application to an existing node server. For example, to deploy the
 * prototype to the XD server on m-dco-app01.corp.workscape.net you would
 * copy the entire build directory, rename it to "offcycle" and put it in
 * the public folder in XD. Then configure these routes like so:
 *
 *      var budgetplanner = require('./public/budgetplanner/routes');
 *      budgetplanner.config(app, '');
 */
var express = require('express');
var fs = require('fs');
var util = require('./routeUtils');

var rootUri = "/";
var rootRESTUri = rootUri + "v1/";
var baseRESTUri = rootRESTUri + "students/";


util.setRootUri(rootUri);
exports.config = function(app, staticDir) {
    if (staticDir === null) {
        staticDir = "app";
    }

    var testDataFolder;

    if (staticDir === '') {
        testDataFolder = __dirname + "/testdata/";
    } else {
        testDataFolder = __dirname + "/" + staticDir + "/testdata/";
    }

    console.log("static data loading from: " + __dirname + "/" + staticDir);

    app.use("/", express.static(__dirname + "/" + staticDir));


 
    //    var fileName = testDataFolder + 'hrBudgets.json';
    //    util.readFileAndSend(fileName, req, res);

    app.get(baseRESTUri + "students", function (req, res){
        console.log('get students');
        var fileName = testDataFolder + 'students.json';
        util.readFileAndSend(fileName, req, res);
    });
 

    return baseRESTUri;
};