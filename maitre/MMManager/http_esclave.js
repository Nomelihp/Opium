var http = require("http");

var srv=http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello esclave");
  response.end();
}).listen(9207, '127.0.0.1');

var options = {
  hostname: '127.0.0.1',
  port: 9206,
  method: 'POST'
};
var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
req.write("postData");
req.end();