// Load libraries.
var oauth20 = require('oauth20-provider');

// Define oauth20 methods.
module.exports = function() {
    var obj = new oauth20({log: {level: 4}});
    var myModel = require('./model').oauth2;

    // Client
    obj.model.client.getId = myModel.client.getId;
    obj.model.client.getRedirectUri = myModel.client.getRedirectUri;
    obj.model.client.fetchById = myModel.client.fetchById;
    obj.model.client.checkSecret = myModel.client.checkSecret;

    // User
    obj.model.user.getId = myModel.user.getId;
    obj.model.user.fetchById = myModel.user.fetchById;
    obj.model.user.fetchByUsername = myModel.user.fetchByUsername;
    obj.model.user.fetchFromRequest = myModel.user.fetchFromRequest;
    obj.model.user.checkPassword = myModel.user.checkPassword;

    // Access token
    obj.model.accessToken.getToken = myModel.accessToken.getToken;
    obj.model.accessToken.fetchByToken = myModel.accessToken.fetchByToken;
    obj.model.accessToken.checkTTL = myModel.accessToken.checkTTL;
    obj.model.accessToken.create = myModel.accessToken.create;

    // Refresh token
    obj.model.refreshToken.getUserId = myModel.refreshToken.getUserId;
    obj.model.refreshToken.getClientId = myModel.refreshToken.getClientId;
    obj.model.refreshToken.fetchByToken = myModel.refreshToken.fetchByToken;
    obj.model.refreshToken.removeByUserIdClientId = myModel.refreshToken.removeByUserIdClientId;
    obj.model.refreshToken.create = myModel.refreshToken.create;

    return obj;
};