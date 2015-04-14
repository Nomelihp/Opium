var port = require('../config.json');
var mongoose = require('mongoose');
var messenger = require('messenger')

var listen_port = parseInt(port.MMManager);

var server = messenger.createListener(listen_port);

server.on('notification',function(message,data){


});
