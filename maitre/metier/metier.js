var messenger = require('messenger');
var process = require('process');

// On prend le port d'écoute en argument d'entrée
console.log("Listen Port :"+process.argv[2]);

var server = messenger.createListener(parseInt(process.argv[0]));

server.on('notification',function(message, data){
	
});
