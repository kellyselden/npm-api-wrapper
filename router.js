var express = require('express');
var router = express.Router();

var github = require('./routes/github');
var bower = require('./routes/bower');
var npm = require('./routes/npm');

router.use('/github', github);
router.use('/bower', bower);
router.use('/npm', npm);

module.exports = function() {
  return router;
};
