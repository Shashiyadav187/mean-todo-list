// Load libraries.
var express = require('express');
var http = require('http');
var assert = require('assert');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var todoModel = require('./model/todo');

// Application settings.
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));
app.use(logger('dev'));

// OAuth 2.0 Resource Owner Password Credentials Grant
var oauth20 = require('./oauth20.js')();
app.use(oauth20.inject());
app.post('/token', oauth20.controller.token);

// Profile API
var userModel = require('./model').oauth2.user;
app.get('/api/profile', oauth20.middleware.bearer, function(request, response) {
	var userId = request.oauth2.accessToken.userId;
	userModel.fetchById(userId, function(error, user) {
		if(user == null) {
			response.status(404).send();
		} else {
			response.status(200).send({
				userId: user.id,
				username: user.username
			});
		}
	});
});

// Todo Resource APIs
var filter = function(request, response, next) {
	var todoId = request.params.id;
	var userId = request.oauth2.accessToken.userId;

	todoModel.find(todoId, function(error, todo) {
		if (error != null && error.name == 'NotFound') {
			response.status(404).send();
			return;
		} else if (todo.userId != userId) {
			response.status(403).send();
			return;
		} else {
			request.todo = todo;
			next();
		}
	});
}

app.post('/api/todos', oauth20.middleware.bearer, function(request, response) {
	var todo = request.body;
	todo.userId = request.oauth2.accessToken.userId;

	todoModel.insert(todo, function(error, result) {
		response.status(201).send(todo);
	});
});

app.get('/api/todos/:id', oauth20.middleware.bearer, filter, function(request, response) {
	response.status(200).send(request.todo);
});

app.put('/api/todos/:id', oauth20.middleware.bearer, filter, function(request, response) {
	var todo = request.body;
	todo.todoId = request.todo.todoId;
	todo.userId = request.todo.userId;

	todoModel.update(todo, function(error, todo) {
		if (error != null && error.name == 'NotFound') {
			response.status(404).send();
		} else {
			response.status(200).send(todo);
		}
	});
});

app.delete('/api/todos/:id', oauth20.middleware.bearer, filter, function(request, response) {
	todoModel.delete(request.todo.todoId, function(error, result) {
		if (error != null && error.name == 'NotFound') {
			response.status(404).send();
		} else {
			response.status(200).send();
		}
	});
});

app.get('/api/todos', oauth20.middleware.bearer, function(request, response) {
	todoModel.findByUserId(request.oauth2.accessToken.userId, function(error, items) {
		response.status(200).send(items);
	});
});

// Start the express server.
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});