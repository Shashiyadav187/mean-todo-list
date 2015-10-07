angular.module('App', ['ngResource'])
	.controller('MainController', ['$scope', '$resource', function ($scope, $resource) {

	var todoResource = $resource('/api/todos/:todoId',
			{todoId:'@id'},
			{update: {method: 'PUT'}}
	);

	function reloadTodoList() {
		todoResource.query(function(data) {
			$scope.todoList = data;
		});
	}

	$scope.todoList = [];

	$scope.init = function () {
		reloadTodoList();
	}

	$scope.add = function () {
		todoResource.save({text: $scope.text});
		$scope.text = '';
		reloadTodoList();
	};

	$scope.remove = function (todo) {
		todoResource.remove({todoId: todo._id});
		reloadTodoList();
	};

	$scope.save = function (todo) {
		todoResource.update({todoId: todo._id}, {text: todo.text});
	};
}]);