var app = angular.module('App', [
	'ngRoute',
	'ngResource',
	'myControllers',
	'myServices'
]);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/list', {
				templateUrl: '/view/list.html',
				controller: 'todoController'
			}).
			when('/login', {
				templateUrl: '/view/login.html',
				controller: 'loginController'
			}).
			otherwise({
				redirectTo: '/list'
			});;
	}
]);