var messenger = require('messenger');
var fs = require('fs');
var json = require('../config.json');

// Fonction pour récupérer le port d'écoute depuis ../config.json
var listen_port = json.metier;
var notif_port = json.MMManager;

console.log(listen_port);

var server = messenger.createListener(listen_port);

server.on('notification',function(message, data){
	
});


