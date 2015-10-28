var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    console.log('clusters: '+require('os').cpus().length);

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

} else {

	var express = require('express');
	var bodyParser = require('body-parser');
	var morgan = require('morgan');
	var path = require('path');
	var messageHandler = require('./server/messageHandler.js');
	var monk = require('monk');


	//init the connection to mongolabs via monk
	var url = 'mongodb://chatterAdmin:chadmin@ds045664.mongolab.com:45664/chatterbox';
	var db = monk(url);

	//init express app
	var app = express();

	// var port = process.env.PORT || 5000;

	//use morgan logging tool, will spit out a log of actions on server
	app.use(morgan('dev'));

	//easy way to parse the body sent in with a request in json form
	app.use(bodyParser.json());

	app.use(function(req,res,next) {
		req.db = db;
		next();
	});

	app.use(express.static('client'));


	app.get('/', function (req, res) {
	  res.sendFile(path.join(__dirname + '/index.html'));
	});

	app.get('/classes/messages', function(req, res) {
		
		var collection = req.db.get('messages');

		collection.find({},{},function(e,doc) {
		
			var toSend = {'results':doc};

			res.send(toSend);
		});

	});

	app.get('/classes/:room', function(req, res) {
		var collection = req.db.get('messages');

		collection.find({roomname:req.params.room},{},function(e,doc) {
		
			var toSend = {'results':doc};

			res.send(toSend);
		});
	});

	app.post('/classes/messages', function(req, res) {

		var collection = req.db.get('messages');

		// messageHandler.insertNewMessage(req.body);

		var content = messageHandler.formatMessage(req.body);

		collection.insert(content);

		res.send('added '+JSON.stringify(req.body));
	});

	app.post('/classes/:room', function(req, res) {
		var newMessage = req.body;
		newMessage['roomname'] = req.params.room;

		var collection = req.db.get('messages');

		var content = messageHandler.formatMessage(newMessage);

		collection.insert(content);

		res.send('added '+newMessage);
	});

	// app.listen(port);

	app.listen(process.env.PORT || 5000);

}