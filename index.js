var app = require('./app');
var http = require('http').Server(app);

var server = http.listen(process.env.PORT || 3000, function() {
  console.log('Express server listening on port ' + server.address().port);
});
