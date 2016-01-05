// Load libraries.
var assert = require('assert');
var mongodb = require('mongodb');
var uuid = require('node-uuid');

var createError = function(name) {
	var error = new Error();
	error.name = name;
	return error;
};

var format = function(todo) {
	delete todo._id;
	return todo;
};

// Connect to MongoDB todo collection.
var collection;
mongodb.MongoClient.connect('mongodb://localhost:27017/todo', function(error, db) {
	assert.equal(null, error);
	collection = db.collection("todo");
});

module.exports.insert = function(todo, callback) {
	todo.todoId = uuid.v4();

	collection.insertOne(todo, function(error, result) {
		assert.equal(null, error);
		callback(null, format(todo));
	});
};

module.exports.find = function(todoId, callback) {
	collection.findOne({todoId: todoId}, function(error, todo) {
		assert.equal(null, error);

		if(todo === null) {
			callback(createError('NotFound'), null);
		} else {
			callback(null, format(todo));
		}
	});
};

module.exports.update = function(todo, callback) {
	collection.updateOne({todoId: todo.todoId}, todo, function(error, result) {
		assert.equal(null, error);

		if (result.modifiedCount === 0) {
			callback(createError('NotFound'), null);
		} else {
			callback(null, format(todo));
		}
	});
};

module.exports.delete = function(todoId, callback) {
	collection.deleteOne({todoId: todoId}, function(error, result) {
		assert.equal(null, error);

		if (result.deletedCount == 0) {
			callback(createError('NotFound'), null);
		} else {
			callback(null, null);
		}
	});
};

module.exports.findByUserId = function(userId, callback) {
	collection.find({userId: userId}).toArray(function(error, items) {
		assert.equal(null, error);

		items.forEach(function(item) {format(item)});
		callback(null, items);
	});
};