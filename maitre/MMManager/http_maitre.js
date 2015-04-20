var http = require("http");

http.createServer(function(request, response) {
	

	
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello Maitre");
  response.end();
}).listen(9206, '127.0.0.1');


http.get("http://127.0.0.1:9206",function callback(response){

  response.setEncoding('utf8');
  response.on("data",function (data) {
   
      console.log(data);
    
    
  })
})