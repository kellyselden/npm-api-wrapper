var express = require('express');
var router = express.Router();

var bower = require('./routes/bower');
var npm = require('./routes/npm');

router.use('/bower', bower);
router.use('/npm', npm);

module.exports = function() {
  return router;
};
