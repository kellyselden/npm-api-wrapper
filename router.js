var express = require('express');
var router = express.Router();

var time = require('./routes/time');

router.use('/time', time);

module.exports = function() {
  return router;
};
