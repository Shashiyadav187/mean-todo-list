var express = require('express');
var http = require('http');
var assert = require('assert');
var mongodb = require('mongodb');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.logger('dev'));

// Connect to MongoDB todo collection.
var collection;
mongodb.MongoClient.connect('mongodb://localhost:27017/todo', function(error, db) {
	assert.equal(null, error);
	collection = db.collection("todo");
});

// APIs
app.post('/api/todos', function(request, response) {
	var input = request.body;
	collection.insertOne(input, function(error, result) {
		assert.equal(null, error);
		var created = result.ops[0];
		response.status(201).send(created);
	});
});

app.get('/api/todos/:id', function(request, response) {
	var todoId = request.params.id;
	collection.findOne({_id:mongodb.ObjectID(todoId)}, function(error, item) {
		assert.equal(null, error);
		if (item == null) response.status(404).send({error:"not_found"});
		response.status(200).send(item);
	});
});

app.put('/api/todos/:id', function(request, response) {
	var todoId = request.params.id;
	var input = request.body;
	collection.updateOne({_id:mongodb.ObjectID(todoId)}, input, function(error, result) {
		assert.equal(null, error);
		if (result.result.nModified != 1) response.status(404).send({error:"no_found"});
	});
	collection.findOne({_id:mongodb.ObjectID(todoId)}, function(error, item) {
		assert.equal(null, error);
		if (item == null) response.status(404).send({error:"not_found"});
		response.status(200).send(item);
	});
});

app.delete('/api/todos/:id', function(request, response) {
	var id = request.params.id;
	collection.deleteOne({_id:mongodb.ObjectID(id)}, function(error, result) {
		assert.equal(null, error);
		if (result.deletedCount == 0) response.status(404).send({error:"not_found"});
		response.status(200).send();
	});
});

app.get('/api/todos', function(request, response) {
	var todoId = request.params.id;
	collection.find({}).toArray(function(error, items) {
		assert.equal(null, error);
		response.status(200).send(items);
	});
});

// Start the express server.
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});