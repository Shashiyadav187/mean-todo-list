var users = require('./data.js').users;

module.exports.getId = function(user) {
    return user.id;
};

module.exports.fetchById = function(id, cb) {
    var result = users.filter(function(item, index){
		if (item.id == id) return true;
    });

    if(result == null || result.lenth == 0) {
    	return cb(null, null);
    } else {
    	cb(null, result[0]);
    }
};

module.exports.fetchByUsername = function(username, cb) {
    for (var i in users) {
        if (username == users[i].username) return cb(null, users[i]);
    };
    cb();
};

module.exports.checkPassword = function(user, password, cb) {
    (user.password == password) ? cb(null, true) : cb(null, false);
};

module.exports.fetchFromRequest = function(req) {
    return req.session.user;
};