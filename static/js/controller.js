var myControllers = angular.module('myControllers', []);

myControllers.controller('loginController',
['$scope', '$resource', '$http', '$location', 'loginService',
function ($scope, $resource, $http, $location, loginService) {

	$scope.login = function() {

		loginService.login($scope.username, $scope.password, function(error) {
			if(error) {
				$scope.message = "Invalid username and password."
				$scope.password = "";
			} else {
				$location.path("/list");
			}
		});
	};

	$scope.logout = loginService.logout(function(error) {
		$location.path("/login");
	});
}]);

myControllers.controller('todoController', ['$scope', '$resource', 'loginService',
function ($scope, $resource, loginService) {

	var todoResource;

	function reloadTodoList() {
		todoResource.query(function(data) {
			$scope.todoList = data;
		});
	}

	$scope.todoList = [];

	$scope.init = function () {
		loginService.checkSession();

		var loginSession = loginService.getLoginSession();
		todoResource = $resource('/api/todos/:todoId',
				{todoId:'@todoId'}, {
					save: {method: 'POST', headers: {'Authorization': 'Bearer '+loginSession.accessToken}},
					update: {method: 'PUT', headers: {'Authorization': 'Bearer '+loginSession.accessToken}},
					remove: {method: 'DELETE', headers: {'Authorization': 'Bearer '+loginSession.accessToken}},
					query: {method: 'GET', isArray: true, headers: {'Authorization': 'Bearer '+loginSession.accessToken}}
				}
		);

		reloadTodoList();
	}

	$scope.add = function () {
		todoResource.save({text: $scope.text});
		$scope.text = '';
		reloadTodoList();
	};

	$scope.remove = function (todo) {
		todoResource.remove({todoId: todo.todoId});
		reloadTodoList();
	};

	$scope.save = function (todo) {
		todoResource.update({todoId: todo.todoId}, {text: todo.text});
	};

	$scope.logout = loginService.logout;
}]);