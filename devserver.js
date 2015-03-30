console.log("devdata server starting...");
console.log("stop dev server with dev:stop");

var express = require('express');

var app = express();
//app.use(express.bodyParser());

var routes = require("./dataroutes");

//routes.config(app, "build");
routes.config(app, "app");

module.exports = app;