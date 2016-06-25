var express = require('express');
var request = require('request');
var querystring = require('querystring');
var config = require('config');

function getVariable(envVar, configVar) {
  let value = process.env[envVar];
  if (value) {
    return value;
  }

  if (config.has(configVar)) {
    return config.get(configVar);
  }

  return;
}

var clientId     = getVariable('GITHUB_CLIENT_ID',     'github.client_id');
var clientSecret = getVariable('GITHUB_CLIENT_SECRET', 'github.client_secret');

var router = express.Router();

function validate(callback) {
  return function(req, res) {
    if (!clientId || !clientSecret) {
      return res.status(500).send({
        error: 'config values not found'
      });
    }

    return callback(req, res);
  };
}

router.get('/client-id', validate(function(req, res) {
  res.send({
    'client_id': clientId
  });
}));

router.post('/auth', validate(function(req, res) {
  var code = req.query.code;

  var url = 'https://github.com/login/oauth/access_token?client_id=' + clientId + '&client_secret=' + clientSecret + '&code=' + code;

  request.post(url, function(error, response, body) {
    var data = querystring.parse(body);
    var token = data['access_token'];
    res.send({
      'access_token': token
    });
  });
}));

module.exports = router;
