var mongojs = require('mongojs');

var url = 'mongodb://chatterAdmin:chadmin@ds045664.mongolab.com:45664/chatterbox';

var _db = mongojs(url,['messages']);

console.log(_db.messages.find().toArray( function(err,docs) {
	console.log(err);
	console.log(docs);
}));

