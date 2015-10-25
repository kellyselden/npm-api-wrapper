var express = require('express');
var npm = require('npm');

var router = express.Router();

router.get('/:package', function(req, res) {
  var package = req.params.package;

  npm.load(function(er, npm) {
    if (er) {
      console.log(er);
      return res.send(er);
    }

    npm.commands.view([package, 'time'], true, function(er, data) {
      if (er) {
        console.log(er);
        return res.send(er);
      }

      var time = data[Object.keys(data)[0]].time;

      res.send(time);
    });
  });
});

module.exports = router;
