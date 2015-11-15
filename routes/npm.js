var express = require('express');
var npm = require('npm');
var cache = require('memory-cache');
var sem = require('semaphore')(1);

var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(1, 250);

var router = express.Router();

function formatVersions(data) {
  data = data[Object.keys(data)[0]].time;
  delete data.modified;
  delete data.created;
  return data;
}

function formatDependencies(data) {
  var keys = Object.keys(data);
  if (!keys.length) {
    return data;
  }
  return data[keys[0]]['dependencies'];
}

var CACHE_TIME = 1000 * 60 * 60; // one hour

router.get('/:package/:command', function(req, res) {
  var url = req.url;
  var data = cache.get(url);
  if (data) {
    return res.send(data);
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

  sem.take(function() {
    limiter.removeTokens(1, function() {
      sem.leave();

      npm.load(function(er, npm) {
        if (er) {
          console.log(er);
          return res.send(er);
        }

        npm.commands.view(params, true, function(er, data) {
          if (er) {
            console.log(er);
            return res.send(er);
          }

          data = transformFunc(data);

          cache.put(url, data, CACHE_TIME);

          res.send(data);
        });
      });
    });
  });
});

module.exports = router;
