var express = require('express');

var app = express();
//app.use(express.bodyParser());

var routes = require("./dataroutes");

//routes.config(app, "build");
routes.config(app, "app");

module.exports = app;

app.listen(8080, function() {
	console.log("devdata server starting...");
});