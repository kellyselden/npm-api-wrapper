var express = require('express');
var npm = require('npm');

var router = express.Router();

function formatVersions(data) {
  data = data[Object.keys(data)[0]].time;
  delete data.modified;
  delete data.created;
  return data;
}

function formatDependencies(data) {
  return data[Object.keys(data)[0]]['dependencies'];
}

router.get('/:package/:command', function(req, res) {
  npm.load(function(er, npm) {
    if (er) {
      console.log(er);
      return res.send(er);
    }

    var params = [req.params.package];
    var transformFunc;

    switch (req.params.command) {
      case 'versions':
        params.push('time');
        transformFunc = formatVersions;
        break;
      case 'dependencies':
        params.push('dependencies');
        transformFunc = formatDependencies;
        break;
    }

    npm.commands.view(params, true, function(er, data) {
      if (er) {
        console.log(er);
        return res.send(er);
      }

      data = transformFunc(data);

      res.send(data);
    });
  });
});

module.exports = router;
