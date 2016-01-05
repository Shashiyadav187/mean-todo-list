var myServices = angular.module('myServices', []);

myServices.service('loginService', ['$http', '$resource', '$location',
function ($http, $resource, $location) {

	var clientId = '04b59eea-60b8-4309-b415-3a0c9b57d43a';
	var clientSecret = 'secret';
	var loginSession = {};

	var createError = function(name) {
		var error = new Error();
		error.name = name;
		return error;
	};

	this.getLoginSession = function() {
		return loginSession;
	}

	this.login = function (username, password, callback) {
		$http({
			method: 'POST',
			url: '/token',
			headers: {
				'Authorization': 'Basic ' + window.btoa(clientId + ':' + clientSecret),
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
			data: {
				grant_type: 'password',
				username: username,
				password: password
			}

		}).then(function success(response){
			loginSession.accessToken = response.data.access_token;
			loginSession.refreshToken = response.data.refresh_token;

			// Retrieve user profile data.
			var profileResource = $resource('/api/profile', {},
					{query: {headers: {'Authorization': 'Bearer ' + loginSession.accessToken}}});
			profileResource.query(function(data) {
				loginSession.userId = data.userId;
				loginSession.username = data.username;

				callback(null);
			});

		}, function error(response){
			callback(createError("AuthenticationFailed"));
		});
	};

	this.checkSession = function() {
		if(loginSession.userId == null) {
			$location.path("login");
		}
	}

	this.logout = function() {
		loginSession = {};
		$location.path("login");
	}
}]);