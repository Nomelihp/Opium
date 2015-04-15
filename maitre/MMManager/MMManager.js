var port = require('../config.json');
var messenger = require('messenger')
var model = require('../model/mongo_config');

var listen_port = parseInt(port.MMManager);

var server = messenger.createListener(listen_port);

server.on('notification',function(message,data){


});
