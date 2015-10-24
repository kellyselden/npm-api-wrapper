var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var router = require('./router');

var app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(morgan('combined'));

app.use('/api/v1', router());

module.exports = app;
