// Test JSON-RPC Server and Client

var express = require("express");
var jsonrpc = require("./json-rpc");
var Promise = require("bluebird");


var api = {
	"toLowerCase": function() {
		var params = Array.prototype.slice.call(arguments);
		var results = [];
		
		return new Promise(function(good, bad) {
			params.forEach(function(param) {
				if(typeof param === "string") {
					results.push(param.toLowerCase());
				} else {
					bad(Error(param+" is not a string"));
					return;
				}
			});
			good(results);
		});
	},
	"toUpperCase": function() {
		var params = Array.prototype.slice.call(arguments);
		var results = [];

		return new Promise(function(good, bad) {
			params.forEach(function(param) {
				if(typeof param === "string") {
					results.push(param.toUpperCase());
				} else {
					bad(Error(params+" is not a string"));
					return;
				}
			});
			good(results);
		});
	},
	"testNotify": function(message) {
		return new Promise(function (good) {
			console.log("testNotify", message);
			good();
		})
	},
	"noargTest": function() {
		return new Promise(function (good) {
			good("Awesome String");
		});
	},
	"namedConcat": function(args) {
		return new Promise(function (good, bad) {
			if(args.first && args.second) {
				good(args.first+args.second);				
			} else {
				bad("must provide named arguments: first and last");
			}
		})		
	}
};

var ws = jsonrpc.createServer({port:3000}, api);
var httpServer = express();

httpServer.get("/", function(req, res) {
	res.sendFile(__dirname+"/demo-client.html");
});

httpServer.get("/bluebird.js", function(req, res) {
	res.sendFile(__dirname+"/node_modules/bluebird/js/browser/bluebird.js");
});

httpServer.get("/json-rpc.js", function(req, res) {
	res.sendFile(__dirname+"/json-rpc.js");
});

httpServer.listen(8080);