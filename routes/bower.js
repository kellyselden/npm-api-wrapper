var express = require('express');
var bower = require('bower');

var router = express.Router();

router.get('/:package', function(req, res) {
  var package = req.params.package;

  bower.commands.info(package).on('end', function(results) {
    res.send(results);
  });
});

module.exports = router;
