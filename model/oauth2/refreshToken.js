module.exports.getUserId = function(refreshToken) {
    return refreshToken.userId;
};

module.exports.getClientId = function(refreshToken) {
    return refreshToken.clientId;
};

module.exports.fetchByToken = function(token, cb) {
    cb(null, null);
};

module.exports.removeByUserIdClientId = function(userId, clientId, cb) {
    cb();
};

module.exports.create = function(userId, clientId, scope, cb) {
    cb(null, null);
};