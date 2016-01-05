var jwt = require('jsonwebtoken'), fs = require('fs');

module.exports.getToken = function(accessToken) {
	return accessToken.token;
};

module.exports.create = function(userId, clientId, scope, ttl, cb) {

	var private_key = fs.readFileSync('./resource/private_key.pem');
	var accessToken = {
		userId : userId,
		clientId : clientId,
		scope : scope,
		ttl : new Date().getTime() + ttl * 1000
	};
	var token = jwt.sign(accessToken, private_key);

	cb(null, token);
};

module.exports.fetchByToken = function(token, cb) {

	var publicKey = fs.readFileSync('./resource/public_key.pem');
	jwt.verify(token, publicKey, function(error, decoded) {
		if (error) {
			cb();

		} else {
			var accessToken = decoded;
			accessToken.token = token;
			cb(error, accessToken);
		}
	});
};

module.exports.checkTTL = function(accessToken) {
	return (accessToken.ttl > new Date().getTime());
};